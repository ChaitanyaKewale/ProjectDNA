import { db } from '../index';
import { projectMembers, users, NewProjectMember, ProjectMember } from '../schema';
import { eq, and } from 'drizzle-orm';

export async function addMember(memberData: NewProjectMember): Promise<ProjectMember> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-member-id',
      projectId: memberData.projectId,
      userId: memberData.userId,
      role: memberData.role || 'member',
      joinedAt: new Date(),
    };
  }

  try {
    console.log('[Members] Adding member - projectId:', memberData.projectId, 'userId:', memberData.userId, 'role:', memberData.role);

    // Check if already a member (prevent duplicate insert errors)
    const existing = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, memberData.projectId),
          eq(projectMembers.userId, memberData.userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log('[Members] User already a member of this project, skipping insert');
      return existing[0];
    }

    const [inserted] = await db.insert(projectMembers).values(memberData).returning();
    console.log('[Members] Successfully added member:', inserted.id);
    return inserted;
  } catch (error) {
    console.error('[Members] FAILED to add member:', error);
    throw error; // Re-throw so we know what happened
  }
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db.select().from(projectMembers).where(eq(projectMembers.projectId, projectId));
  } catch (error) {
    console.warn('[DB Notice]: Could not get project members:', error);
    return [];
  }
}

export async function getMemberRole(
  projectId: string,
  userId: string
): Promise<'admin' | 'member' | 'viewer' | undefined> {
  if (!process.env.DATABASE_URL) return 'admin';
  try {
    const result = await db
      .select()
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
      .limit(1);
    return result[0]?.role;
  } catch (error) {
    console.warn('[DB Notice]: Could not get member role:', error);
    return undefined;
  }
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await db
      .delete(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
  } catch (error) {
    console.warn('[DB Notice]: Could not remove member:', error);
  }
}
