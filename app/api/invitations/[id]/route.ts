import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, upsertUser } from '@/lib/db/queries/users';
import { updateInvitationStatus } from '@/lib/db/queries/invitations';
import { addMember } from '@/lib/db/queries/members';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    console.log('[PATCH /api/invitations] invitationId:', id, 'status:', status, 'clerkId:', clerkId);

    if (!status || (status !== 'accepted' && status !== 'rejected')) {
      return NextResponse.json(
        { error: 'Invalid status. Must be accepted or rejected.' },
        { status: 400 }
      );
    }

    // Ensure dbUser exists in Neon DB
    let dbUser = await getUserByClerkId(clerkId);
    if (!dbUser) {
      try {
        const clerkUser = await currentUser();
        if (clerkUser) {
          dbUser = await upsertUser({
            clerkId,
            email: clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@clerk.user`,
            name: clerkUser.fullName || 'Developer',
            username: clerkUser.username || `user_${clerkId.slice(-8)}`,
            avatarUrl: clerkUser.imageUrl || null,
            onboardingComplete: false,
          });
        }
      } catch (err) {
        console.warn('[PATCH] Could not sync user:', err);
      }
    }

    console.log('[PATCH] dbUser resolved:', dbUser?.id, dbUser?.email);

    // Update the invitation status in DB
    const updatedInvite = await updateInvitationStatus(id, status);

    if (!updatedInvite) {
      console.error('[PATCH] updateInvitationStatus returned undefined for id:', id);
      return NextResponse.json(
        { error: 'Invitation not found or could not be updated' },
        { status: 404 }
      );
    }

    console.log('[PATCH] Invitation updated:', updatedInvite.id, 'projectId:', updatedInvite.projectId, 'status:', updatedInvite.status);

    // If accepted, add to project_members table as 'member'
    if (status === 'accepted') {
      const memberUserId = dbUser?.id;
      const targetProjectId = updatedInvite.projectId;

      console.log('[PATCH] Attempting addMember - userId:', memberUserId, 'projectId:', targetProjectId);
      console.log('[PATCH] userId isUUID:', memberUserId ? isUUID(memberUserId) : 'null', 'projectId isUUID:', targetProjectId ? isUUID(targetProjectId) : 'null');

      if (memberUserId && isUUID(memberUserId) && targetProjectId && isUUID(targetProjectId)) {
        try {
          const memberResult = await addMember({
            projectId: targetProjectId,
            userId: memberUserId,
            role: 'member',
          });
          console.log('[PATCH] addMember succeeded:', memberResult.id);
        } catch (memberErr) {
          console.error('[PATCH] addMember FAILED:', memberErr);
          // Don't fail the whole response — invitation is already accepted
        }
      } else {
        console.error('[PATCH] Cannot add member - invalid IDs. userId:', memberUserId, 'projectId:', targetProjectId);
      }
    }

    return NextResponse.json({
      success: true,
      invitation: updatedInvite,
    });
  } catch (error: any) {
    console.error('[PATCH] Error updating invitation status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update invitation' },
      { status: 500 }
    );
  }
}
