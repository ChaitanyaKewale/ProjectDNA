import { db } from '../index';
import { invitations, NewInvitation, Invitation } from '../schema';
import { eq, or, desc } from 'drizzle-orm';

export async function createInvitation(inviteData: NewInvitation): Promise<Invitation> {
  const [inserted] = await db.insert(invitations).values(inviteData).returning();
  return inserted;
}

export async function getUserInvitations(userId: string): Promise<Invitation[]> {
  return await db
    .select()
    .from(invitations)
    .where(or(eq(invitations.toUserId, userId), eq(invitations.fromUserId, userId)))
    .orderBy(desc(invitations.createdAt));
}

export async function getReceivedInvitations(userId: string): Promise<Invitation[]> {
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.toUserId, userId))
    .orderBy(desc(invitations.createdAt));
}

export async function updateInvitationStatus(
  id: string,
  status: 'accepted' | 'rejected'
): Promise<Invitation | undefined> {
  const [updated] = await db
    .update(invitations)
    .set({ status })
    .where(eq(invitations.id, id))
    .returning();
  return updated;
}
