import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/db/queries/users';
import { updateInvitationStatus } from '@/lib/db/queries/invitations';
import { addMember } from '@/lib/db/queries/members';

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

    const dbUser = await getUserByClerkId(clerkId);
    const userId = dbUser?.id || clerkId;

    const updatedInvite = await updateInvitationStatus(id, status);

    // If accepted, add to project_members table as 'member'
    if (status === 'accepted' && updatedInvite?.projectId) {
      try {
        await addMember({
          projectId: updatedInvite.projectId,
          userId: userId,
          role: 'member',
        });
      } catch (memberErr) {
        console.warn('Member insertion notice:', memberErr);
      }
    }

    return NextResponse.json({
      success: true,
      invitation: updatedInvite || { id, status },
    });
  } catch (error: any) {
    console.error('Error updating invitation status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update invitation' },
      { status: 500 }
    );
  }
}
