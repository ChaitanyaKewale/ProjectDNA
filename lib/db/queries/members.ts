import { db } from '../index';
import { projectMembers, NewProjectMember, ProjectMember } from '../schema';
import { eq, and } from 'drizzle-orm';

export async function addMember(memberData: NewProjectMember): Promise<ProjectMember> {
  const [inserted] = await db.insert(projectMembers).values(memberData).returning();
  return inserted;
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  return await db.select().from(projectMembers).where(eq(projectMembers.projectId, projectId));
}

export async function getMemberRole(projectId: string, userId: string): Promise<'admin' | 'member' | 'viewer' | undefined> {
  const result = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
    .limit(1);
  return result[0]?.role;
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
}
