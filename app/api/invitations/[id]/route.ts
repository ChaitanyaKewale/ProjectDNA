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
        console.warn('Could not sync user in PATCH:', err);
      }
    }

    const updatedInvite = await updateInvitationStatus(id, status);
    const targetProjectId = updatedInvite?.projectId || 'demo-1';

    // If accepted, add to project_members table as 'member'
    if (status === 'accepted') {
      const memberUserId = dbUser?.id; // Real DB UUID!
      if (memberUserId && isUUID(memberUserId) && isUUID(targetProjectId)) {
        try {
          await addMember({
            projectId: targetProjectId,
            userId: memberUserId,
            role: 'member',
          });
        } catch (memberErr) {
          console.warn('Member insertion notice:', memberErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      invitation: updatedInvite || { id, status, projectId: targetProjectId },
    });
  } catch (error: any) {
    console.error('Error updating invitation status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update invitation' },
      { status: 500 }
    );
  }
}
