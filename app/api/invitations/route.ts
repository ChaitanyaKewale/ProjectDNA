import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, upsertUser, getAllUsers } from '@/lib/db/queries/users';
import { createInvitation, getDetailedUserInvitations } from '@/lib/db/queries/invitations';

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

async function getOrSyncUser(clerkId: string) {
  let dbUser = await getUserByClerkId(clerkId);
  if (!dbUser) {
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@clerk.user`;
        const name = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Developer';
        const username = clerkUser.username || `user_${clerkId.slice(-8)}`;
        const avatarUrl = clerkUser.imageUrl || null;

        dbUser = await upsertUser({
          clerkId,
          email: primaryEmail,
          name,
          username,
          avatarUrl,
          onboardingComplete: false,
        });
      }
    } catch (err) {
      console.warn('[Invitations API] Could not sync user:', err);
    }
  }
  return dbUser;
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrSyncUser(clerkId);
    if (!dbUser || !isUUID(dbUser.id)) {
      return NextResponse.json(
        { error: 'Could not resolve your user account. Please try again.' },
        { status: 500 }
      );
    }

    const fromUserId = dbUser.id;
    const body = await req.json();
    const { projectId, toUserId, toEmail, message, matchScore } = body;

    if (!projectId || (!toUserId && !toEmail)) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId and recipient (toUserId or toEmail)' },
        { status: 400 }
      );
    }

    // Resolve target user — MUST be a registered user with a valid DB UUID
    const registeredUsers = await getAllUsers();
    let targetUser = null;

    if (toUserId) {
      targetUser = registeredUsers.find(
        (u) =>
          u.id === toUserId ||
          u.clerkId === toUserId ||
          u.email.toLowerCase() === toUserId.toLowerCase() ||
          (u.username && u.username.toLowerCase() === toUserId.toLowerCase())
      );
    }

    if (!targetUser && toEmail) {
      targetUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === toEmail.toLowerCase()
      );
    }

    if (!targetUser) {
      console.warn('[Invitations API] Target user not found. toUserId:', toUserId, 'toEmail:', toEmail);
      return NextResponse.json(
        {
          error: `User not found. The recipient ${toEmail || toUserId} must be registered on ProjectDNA first.`,
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    console.log('[Invitations API] Creating invitation from:', fromUserId, 'to:', targetUser.id, 'project:', projectId);

    const invitation = await createInvitation({
      fromUserId: fromUserId,
      toUserId: targetUser.id,
      projectId: projectId,
      status: 'pending',
      matchScore: matchScore || 90,
      message: message || 'You are invited to join the project team on ProjectDNA.',
    });

    return NextResponse.json({
      success: true,
      invitation,
    });
  } catch (error: any) {
    console.error('[Invitations API] Error creating invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrSyncUser(clerkId);

    // Build a list of identifiers to match against — we pass both UUID and non-UUID
    // The getDetailedUserInvitations function handles the separation internally
    const userIds = Array.from(
      new Set(
        [
          dbUser?.id,
          clerkId,
        ].filter(Boolean) as string[]
      )
    );

    console.log('[Invitations API] GET - fetching invitations for UUIDs:', userIds);

    const allInvites = await getDetailedUserInvitations(userIds);

    // Filter into received vs sent using the DB user UUID
    const dbUserId = dbUser?.id;

    const received = allInvites.filter((inv) => inv.toUserId === dbUserId);
    const sent = allInvites.filter((inv) => inv.fromUserId === dbUserId);

    console.log('[Invitations API] GET result - received:', received.length, 'sent:', sent.length);

    return NextResponse.json({
      success: true,
      received,
      sent,
    });
  } catch (error: any) {
    console.error('[Invitations API] Error fetching invitations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
