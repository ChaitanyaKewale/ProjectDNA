import { db } from '../index';
import { invitations, projects, users, NewInvitation, Invitation } from '../schema';
import { eq, or, desc, inArray } from 'drizzle-orm';

export interface DetailedInvitation extends Invitation {
  projectTitle?: string;
  projectCategory?: string;
  senderName?: string;
  senderAvatar?: string | null;
  recipientName?: string;
  recipientAvatar?: string | null;
}

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

export async function getDetailedUserInvitations(userIdOrIds: string | string[]): Promise<DetailedInvitation[]> {
  if (!process.env.DATABASE_URL) return [];
  const ids = Array.isArray(userIdOrIds) ? userIdOrIds.filter(Boolean) : [userIdOrIds].filter(Boolean);
  if (ids.length === 0) return [];

  try {
    const rawInvites = await db
      .select()
      .from(invitations)
      .where(or(inArray(invitations.toUserId, ids), inArray(invitations.fromUserId, ids)))
      .orderBy(desc(invitations.createdAt));

    const detailedList: DetailedInvitation[] = [];

    for (const inv of rawInvites) {
      // Fetch project details
      let projTitle = 'Project Collaboration';
      let projCat = 'Developer Tools';
      if (inv.projectId) {
        const projRes = await db.select().from(projects).where(eq(projects.id, inv.projectId)).limit(1);
        if (projRes[0]) {
          projTitle = projRes[0].name;
          projCat = projRes[0].category || 'Developer Tools';
        }
      }

      // Fetch sender details
      let senderName = 'Developer';
      let senderAvatar: string | null = null;
      if (inv.fromUserId) {
        const senderRes = await db.select().from(users).where(or(eq(users.id, inv.fromUserId), eq(users.clerkId, inv.fromUserId))).limit(1);
        if (senderRes[0]) {
          senderName = senderRes[0].name || 'Developer';
          senderAvatar = senderRes[0].avatarUrl;
        }
      }

      // Fetch recipient details
      let recipientName = 'Candidate';
      let recipientAvatar: string | null = null;
      if (inv.toUserId) {
        const recipientRes = await db.select().from(users).where(or(eq(users.id, inv.toUserId), eq(users.clerkId, inv.toUserId))).limit(1);
        if (recipientRes[0]) {
          recipientName = recipientRes[0].name || 'Candidate';
          recipientAvatar = recipientRes[0].avatarUrl;
        }
      }

      detailedList.push({
        ...inv,
        projectTitle: projTitle,
        projectCategory: projCat,
        senderName,
        senderAvatar,
        recipientName,
        recipientAvatar,
      });
    }

    return detailedList;
  } catch (error) {
    console.warn('[DB Notice]: Could not get detailed invitations:', error);
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

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    return {
      id,
      fromUserId: 'mock-from',
      toUserId: 'mock-to',
      projectId: 'demo-1',
      status,
      matchScore: 90,
      message: 'Invitation',
      createdAt: new Date(),
    };
  }

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
