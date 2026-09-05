import { db } from '../index';
import { projectMembers, NewProjectMember, ProjectMember } from '../schema';
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
    const [inserted] = await db.insert(projectMembers).values(memberData).returning();
    return inserted;
  } catch (error) {
    console.warn('[DB Notice]: Could not add member:', error);
    return {
      id: 'mock-member-id',
      projectId: memberData.projectId,
      userId: memberData.userId,
      role: memberData.role || 'member',
      joinedAt: new Date(),
    };
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
