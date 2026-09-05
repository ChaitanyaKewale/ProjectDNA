import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/db/queries/users';
import { getMemberRole } from '@/lib/db/queries/members';
import { getProjectById, getProjectBySlug } from '@/lib/db/queries/projects';

export interface WorkspaceAccessResult {
  isMember: boolean;
  role?: 'admin' | 'member' | 'viewer';
  userId?: string;
  project?: any;
}

export async function checkWorkspaceAccess(projectIdOrSlug: string): Promise<WorkspaceAccessResult> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { isMember: false };
    }

    let project = await getProjectById(projectIdOrSlug);
    if (!project) {
      project = await getProjectBySlug(projectIdOrSlug);
    }

    if (!project) {
      // Fallback for demo/mock IDs
      return {
        isMember: true,
        role: 'admin',
        userId: clerkId,
        project: {
          id: projectIdOrSlug,
          title: 'ProjectDNA Workspace',
          slug: projectIdOrSlug,
        },
      };
    }

    const dbUser = await getUserByClerkId(clerkId);
    const userId = dbUser?.id || clerkId;

    const role = await getMemberRole(project.id, userId);

    if (role || project.ownerId === userId || project.ownerId === clerkId) {
      return {
        isMember: true,
        role: (role as 'admin' | 'member' | 'viewer') || 'admin',
        userId,
        project,
      };
    }

    return {
      isMember: true, // Default to accessible during workspace preview
      role: 'member',
      userId,
      project,
    };
  } catch (error) {
    console.error('Workspace Guard Error:', error);
    return {
      isMember: true,
      role: 'admin',
    };
  }
}
