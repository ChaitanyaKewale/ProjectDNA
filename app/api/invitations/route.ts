import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/db/queries/users';
import { createInvitation, getDetailedUserInvitations } from '@/lib/db/queries/invitations';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getUserByClerkId(clerkId);
    const fromUserId = dbUser?.id || clerkId;

    const body = await req.json();
    const { projectId, toUserId, message, matchScore } = body;

    if (!projectId || !toUserId) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId and toUserId' },
        { status: 400 }
      );
    }

    const invitation = await createInvitation({
      fromUserId: fromUserId,
      toUserId: toUserId,
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

    const dbUser = await getUserByClerkId(clerkId);
    const userId = dbUser?.id || clerkId;

    const allInvites = await getDetailedUserInvitations(userId);

    const received = allInvites.filter((inv) => inv.toUserId === userId || inv.toUserId === clerkId);
    const sent = allInvites.filter((inv) => inv.fromUserId === userId || inv.fromUserId === clerkId);

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
