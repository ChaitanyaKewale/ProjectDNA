import { db } from '../index';
import { projects, projectDna, NewProject, NewProjectDna, Project, ProjectDna } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export async function createProject(projectData: NewProject): Promise<Project> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-proj-' + Math.random().toString(36).substring(2, 7),
      ownerId: projectData.ownerId,
      name: projectData.name,
      slug: projectData.slug,
      description: projectData.description,
      category: projectData.category || 'Fullstack',
      duration: projectData.duration || '4 Weeks',
      deadline: null,
      teamSize: projectData.teamSize || 4,
      techPreferences: projectData.techPreferences || [],
      visibility: projectData.visibility || 'public',
      status: projectData.status || 'active',
      createdAt: new Date(),
    };
  }

  try {
    const [inserted] = await db.insert(projects).values(projectData).returning();
    return inserted;
  } catch (error) {
    console.warn('[DB Notice]: Could not create project in DB:', error);
    return {
      id: 'mock-proj-' + Math.random().toString(36).substring(2, 7),
      ownerId: projectData.ownerId,
      name: projectData.name,
      slug: projectData.slug,
      description: projectData.description,
      category: projectData.category || 'Fullstack',
      duration: projectData.duration || '4 Weeks',
      deadline: null,
      teamSize: projectData.teamSize || 4,
      techPreferences: projectData.techPreferences || [],
      visibility: projectData.visibility || 'public',
      status: projectData.status || 'active',
      createdAt: new Date(),
    };
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not query project by id:', error);
    return undefined;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not query project by slug:', error);
    return undefined;
  }
}

export async function listPublicProjects(): Promise<Project[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.visibility, 'public'), eq(projects.status, 'active')))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn('[DB Notice]: Could not list public projects:', error);
    return [];
  }
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, userId))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn('[DB Notice]: Could not get user projects:', error);
    return [];
  }
}

export async function upsertProjectDna(dnaData: NewProjectDna): Promise<ProjectDna> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-dna-id',
      projectId: dnaData.projectId,
      summary: dnaData.summary || '',
      domain: dnaData.domain || 'Fullstack',
      difficulty: dnaData.difficulty || 'Intermediate',
      recommendedTeamSize: dnaData.recommendedTeamSize || 4,
      requiredRoles: dnaData.requiredRoles || [],
      requiredSkills: dnaData.requiredSkills || [],
      generatedAt: new Date(),
    };
  }

  try {
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
  } catch (error) {
    console.warn('[DB Notice]: Could not upsert project DNA:', error);
    return {
      id: 'mock-dna-id',
      projectId: dnaData.projectId,
      summary: dnaData.summary || '',
      domain: dnaData.domain || 'Fullstack',
      difficulty: dnaData.difficulty || 'Intermediate',
      recommendedTeamSize: dnaData.recommendedTeamSize || 4,
      requiredRoles: dnaData.requiredRoles || [],
      requiredSkills: dnaData.requiredSkills || [],
      generatedAt: new Date(),
    };
  }
}

export async function getProjectDna(projectId: string): Promise<ProjectDna | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(projectDna).where(eq(projectDna.projectId, projectId)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not get project DNA:', error);
    return undefined;
  }
}
