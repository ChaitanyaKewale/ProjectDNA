import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId } = body;

    const healthData = {
      overallHealthScore: 94,
      statusLabel: 'Excellent Synergy',
      breakdown: {
        workingStyleSynergy: 92,
        availabilityAlignment: 96,
        skillCoverage: 90,
        sprintVelocity: 98,
      },
      insights: [
        '✨ Team members share complimentary working style preferences (Async + Daily Sync blend).',
        '⚡ High time-commitment overlap (75 total dedicated hours/week across team).',
        '🎯 Strong skill synergy across Next.js 16, TypeScript, Neon DB, and Gemini API.',
      ],
      recommendations: [
        'Recruit 1 UI/UX Product Designer to reach 100% full capacity.',
        'Schedule weekly architectural syncs for backend API contract stability.',
      ],
    };

    return NextResponse.json({
      success: true,
      projectId,
      ...healthData,
    });
  } catch (error: any) {
    console.error('Error fetching team health score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team health score' },
      { status: 500 }
    );
  }
}
