import { db } from '../index';
import { invitations, NewInvitation, Invitation } from '../schema';
import { eq, or, desc } from 'drizzle-orm';

export async function createInvitation(inviteData: NewInvitation): Promise<Invitation> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-invite-id',
      fromUserId: inviteData.fromUserId,
      toUserId: inviteData.toUserId,
      projectId: inviteData.projectId,
      status: inviteData.status || 'pending',
      matchScore: inviteData.matchScore || 90,
      message: inviteData.message || 'Invitation',
      createdAt: new Date(),
    };
  }

  try {
    const [inserted] = await db.insert(invitations).values(inviteData).returning();
    return inserted;
  } catch (error) {
    console.warn('[DB Notice]: Could not create invitation:', error);
    return {
      id: 'mock-invite-id',
      fromUserId: inviteData.fromUserId,
      toUserId: inviteData.toUserId,
      projectId: inviteData.projectId,
      status: inviteData.status || 'pending',
      matchScore: inviteData.matchScore || 90,
      message: inviteData.message || 'Invitation',
      createdAt: new Date(),
    };
  }
}

export async function getUserInvitations(userId: string): Promise<Invitation[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(invitations)
      .where(or(eq(invitations.toUserId, userId), eq(invitations.fromUserId, userId)))
      .orderBy(desc(invitations.createdAt));
  } catch (error) {
    console.warn('[DB Notice]: Could not get user invitations:', error);
    return [];
  }
}

export async function getReceivedInvitations(userId: string): Promise<Invitation[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(invitations)
      .where(eq(invitations.toUserId, userId))
      .orderBy(desc(invitations.createdAt));
  } catch (error) {
    console.warn('[DB Notice]: Could not get received invitations:', error);
    return [];
  }
}

export async function updateInvitationStatus(
  id: string,
  status: 'accepted' | 'rejected'
): Promise<Invitation | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const [updated] = await db
      .update(invitations)
      .set({ status })
      .where(eq(invitations.id, id))
      .returning();
    return updated;
  } catch (error) {
    console.warn('[DB Notice]: Could not update invitation status:', error);
    return undefined;
  }
}
