import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, upsertUser, getAllUsers } from '@/lib/db/queries/users';
import { createInvitation, getDetailedUserInvitations } from '@/lib/db/queries/invitations';

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
      console.warn('Could not sync user:', err);
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
    const fromUserId = dbUser?.id || clerkId;

    const body = await req.json();
    const { projectId, toUserId, toEmail, message, matchScore } = body;

    if (!projectId || (!toUserId && !toEmail)) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId and recipient' },
        { status: 400 }
      );
    }

    // Resolve target user from registered DB users by ID, Clerk ID, Email, or Username
    let targetUserId = toUserId || toEmail;
    const registeredUsers = await getAllUsers();
    const matchedUser = registeredUsers.find(
      (u) =>
        u.id === targetUserId ||
        u.clerkId === targetUserId ||
        (toEmail && u.email.toLowerCase() === toEmail.toLowerCase()) ||
        (toUserId && u.email.toLowerCase() === toUserId.toLowerCase()) ||
        (toUserId && u.username && u.username.toLowerCase() === toUserId.toLowerCase())
    );

    if (matchedUser) {
      targetUserId = matchedUser.id; // Store real DB UUID
    }

    const invitation = await createInvitation({
      fromUserId: fromUserId,
      toUserId: targetUserId,
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
    console.error('Error creating invitation:', error);
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
    const userIds = [dbUser?.id, clerkId].filter(Boolean) as string[];

    const allInvites = await getDetailedUserInvitations(userIds);

    const received = allInvites.filter((inv) => userIds.includes(inv.toUserId));
    const sent = allInvites.filter((inv) => userIds.includes(inv.fromUserId));

    return NextResponse.json({
      success: true,
      received,
      sent,
    });
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
