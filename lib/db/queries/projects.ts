import { db } from '../index';
import { projects, projectDna, NewProject, NewProjectDna, Project, ProjectDna } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export async function createProject(projectData: NewProject): Promise<Project> {
  const [inserted] = await db.insert(projects).values(projectData).returning();
  return inserted;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function listPublicProjects(): Promise<Project[]> {
  return await db
    .select()
    .from(projects)
    .where(and(eq(projects.visibility, 'public'), eq(projects.status, 'active')))
    .orderBy(desc(projects.createdAt));
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, userId))
    .orderBy(desc(projects.createdAt));
}

export async function upsertProjectDna(dnaData: NewProjectDna): Promise<ProjectDna> {
  const existing = await getProjectDna(dnaData.projectId);
  if (existing) {
    const [updated] = await db
      .update(projectDna)
      .set({
        ...dnaData,
        generatedAt: new Date(),
      })
      .where(eq(projectDna.projectId, dnaData.projectId))
      .returning();
    return updated;
  }

  const [inserted] = await db.insert(projectDna).values(dnaData).returning();
  return inserted;
}

export async function getProjectDna(projectId: string): Promise<ProjectDna | undefined> {
  const result = await db.select().from(projectDna).where(eq(projectDna.projectId, projectId)).limit(1);
  return result[0];
}
