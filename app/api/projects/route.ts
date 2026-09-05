import { NextResponse } from 'next/server';
import { listPublicProjects } from '@/lib/db/queries/projects';

export async function GET() {
  try {
    const dbProjects = await listPublicProjects();
    return NextResponse.json({
      success: true,
      projects: dbProjects,
    });
  } catch (error: any) {
    console.error('Error listing public projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch public projects' },
      { status: 500 }
    );
  }
}
