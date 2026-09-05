import { db } from '../index';
import { invitations, projects, users, NewInvitation, Invitation } from '../schema';
import { eq, or, desc, inArray } from 'drizzle-orm';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUUID = (s: string) => UUID_RE.test(s);

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
    console.log('[Invitations] Created invitation:', inserted.id, 'from:', inserted.fromUserId, 'to:', inserted.toUserId);
    return inserted;
  } catch (error) {
    console.error('[Invitations] FAILED to create invitation:', error);
    throw error; // Re-throw so the API handler knows it failed
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

/**
 * Fetches detailed invitations for a user.
 * Accepts an array of identifiers — UUIDs, Clerk IDs, or emails.
 * Only valid UUIDs are used in direct column queries.
 * Non-UUID identifiers (emails) are resolved to UUIDs first via the users table.
 */
export async function getDetailedUserInvitations(userIdOrIds: string | string[]): Promise<DetailedInvitation[]> {
  if (!process.env.DATABASE_URL) return [];
  const rawIds = Array.isArray(userIdOrIds) ? userIdOrIds.filter(Boolean) : [userIdOrIds].filter(Boolean);
  if (rawIds.length === 0) return [];

  try {
    // Separate UUIDs from non-UUID identifiers (emails, clerk IDs)
    const uuidIds = rawIds.filter(isUUID);
    const nonUuidIds = rawIds.filter(id => !isUUID(id));

    // Resolve non-UUID identifiers to DB UUIDs via users table lookup
    if (nonUuidIds.length > 0) {
      const allUsers = await db.select().from(users);
      for (const identifier of nonUuidIds) {
        const lowerIdentifier = identifier.toLowerCase();
        const matched = allUsers.find(
          u => u.email?.toLowerCase() === lowerIdentifier ||
               u.clerkId?.toLowerCase() === lowerIdentifier ||
               u.username?.toLowerCase() === lowerIdentifier
        );
        if (matched && !uuidIds.includes(matched.id)) {
          uuidIds.push(matched.id);
        }
      }
    }

    if (uuidIds.length === 0) {
      console.log('[Invitations] No valid UUID identifiers resolved, returning empty');
      return [];
    }

    console.log('[Invitations] Querying invitations for UUIDs:', uuidIds);

    const rawInvites = await db
      .select()
      .from(invitations)
      .where(or(inArray(invitations.toUserId, uuidIds), inArray(invitations.fromUserId, uuidIds)))
      .orderBy(desc(invitations.createdAt));

    console.log('[Invitations] Found', rawInvites.length, 'invitations');

    const detailedList: DetailedInvitation[] = [];

    for (const inv of rawInvites) {
      // Fetch project details
      let projTitle = 'Project Collaboration';
      let projCat = 'Developer Tools';
      if (inv.projectId && isUUID(inv.projectId)) {
        const projRes = await db.select().from(projects).where(eq(projects.id, inv.projectId)).limit(1);
        if (projRes[0]) {
          projTitle = projRes[0].name;
          projCat = projRes[0].category || 'Developer Tools';
        }
      }

      // Fetch sender details
      let senderName = 'Developer';
      let senderAvatar: string | null = null;
      if (inv.fromUserId && isUUID(inv.fromUserId)) {
        const senderRes = await db.select().from(users).where(eq(users.id, inv.fromUserId)).limit(1);
        if (senderRes[0]) {
          senderName = senderRes[0].name || 'Developer';
          senderAvatar = senderRes[0].avatarUrl;
        }
      }

      // Fetch recipient details
      let recipientName = 'Candidate';
      let recipientAvatar: string | null = null;
      if (inv.toUserId && isUUID(inv.toUserId)) {
        const recipientRes = await db.select().from(users).where(eq(users.id, inv.toUserId)).limit(1);
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
    console.error('[Invitations] Error in getDetailedUserInvitations:', error);
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

  if (!isUUID(id)) {
    console.error('[Invitations] updateInvitationStatus called with non-UUID id:', id);
    return undefined;
  }

  try {
    const [updated] = await db
      .update(invitations)
      .set({ status })
      .where(eq(invitations.id, id))
      .returning();
    
    if (updated) {
      console.log('[Invitations] Updated invitation', id, 'to status:', status, 'projectId:', updated.projectId);
    } else {
      console.warn('[Invitations] No invitation found with id:', id);
    }
    return updated;
  } catch (error) {
    console.error('[Invitations] Failed to update invitation status:', error);
    return undefined;
  }
}
