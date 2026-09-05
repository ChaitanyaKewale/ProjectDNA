import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, upsertUser, completeUserOnboarding } from '@/lib/db/queries/users';
import { upsertProfile, upsertWorkingStyle } from '@/lib/db/queries/profiles';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { basic, professional, availability, workingStyle } = body;

    // 1. Ensure user exists in Neon DB
    let dbUser = await getUserByClerkId(userId);
    if (!dbUser) {
      const clerkUser = await currentUser();
      const primaryEmail = clerkUser?.emailAddresses[0]?.emailAddress || '';
      const name = basic.name || clerkUser?.firstName || 'Developer';
      const username = basic.username || clerkUser?.username || `user_${userId.slice(-8)}`;
      const avatarUrl = clerkUser?.imageUrl || null;

      dbUser = await upsertUser({
        clerkId: userId,
        email: primaryEmail,
        name,
        username,
        avatarUrl,
        onboardingComplete: false,
      });
    }

    // 2. Save Developer Profile
    await upsertProfile({
      userId: dbUser.id,
      bio: basic.bio || '',
      role: professional.role || 'Fullstack Developer',
      experience: professional.experience || 'Intermediate',
      skills: professional.skills || [],
      techStack: professional.techStack || [],
      interests: professional.interests || [],
      hoursPerWeek: Number(availability.hoursPerWeek) || 10,
      availabilityStatus: availability.status || 'available',
      college: basic.college || null,
      organization: basic.organization || null,
    });

    // 3. Save Working Style (DNA)
    await upsertWorkingStyle({
      userId: dbUser.id,
      workTiming: workingStyle.workTiming || 'Flexible',
      workApproach: workingStyle.workApproach || 'Balanced',
      workPace: workingStyle.workPace || 'Balanced',
      communicationStyle: workingStyle.communicationStyle || 'Async',
      teamPreference: workingStyle.teamPreference || 'Collaborative',
    });

    // 4. Mark onboarding as complete
    await completeUserOnboarding(dbUser.id);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      redirectUrl: '/dashboard',
    });
  } catch (error: any) {
    console.error('Onboarding API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
