import { db } from '../index';
import { developerProfiles, workingStyles, NewDeveloperProfile, NewWorkingStyle, DeveloperProfile, WorkingStyle } from '../schema';
import { eq } from 'drizzle-orm';

export async function getProfileByUserId(userId: string): Promise<DeveloperProfile | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(developerProfiles).where(eq(developerProfiles.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not get profile:', error);
    return undefined;
  }
}

export async function upsertProfile(profileData: NewDeveloperProfile): Promise<DeveloperProfile> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-profile-id',
      userId: profileData.userId,
      bio: profileData.bio || '',
      role: profileData.role || 'Fullstack Developer',
      experience: profileData.experience || 'Intermediate',
      skills: profileData.skills || [],
      techStack: profileData.techStack || [],
      interests: profileData.interests || [],
      hoursPerWeek: profileData.hoursPerWeek || 10,
      availabilityStatus: profileData.availabilityStatus || 'available',
      college: profileData.college || null,
      organization: profileData.organization || null,
      updatedAt: new Date(),
    };
  }

  try {
    const existing = await getProfileByUserId(profileData.userId);
    if (existing) {
      const [updated] = await db
        .update(developerProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(developerProfiles.userId, profileData.userId))
        .returning();
      return updated;
    }

    const [inserted] = await db.insert(developerProfiles).values(profileData).returning();
    return inserted;
  } catch (error) {
    console.warn('[DB Notice]: Could not upsert profile:', error);
    return {
      id: 'mock-profile-id',
      userId: profileData.userId,
      bio: profileData.bio || '',
      role: profileData.role || 'Fullstack Developer',
      experience: profileData.experience || 'Intermediate',
      skills: profileData.skills || [],
      techStack: profileData.techStack || [],
      interests: profileData.interests || [],
      hoursPerWeek: profileData.hoursPerWeek || 10,
      availabilityStatus: profileData.availabilityStatus || 'available',
      college: profileData.college || null,
      organization: profileData.organization || null,
      updatedAt: new Date(),
    };
  }
}

export async function getWorkingStyleByUserId(userId: string): Promise<WorkingStyle | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(workingStyles).where(eq(workingStyles.userId, userId)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not get working style:', error);
    return undefined;
  }
}

export async function upsertWorkingStyle(styleData: NewWorkingStyle): Promise<WorkingStyle> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-style-id',
      userId: styleData.userId,
      workTiming: styleData.workTiming || 'Flexible',
      workApproach: styleData.workApproach || 'Flexible',
      workPace: styleData.workPace || 'Balanced',
      communicationStyle: styleData.communicationStyle || 'Async',
      teamPreference: styleData.teamPreference || 'Collaborative',
      updatedAt: new Date(),
    };
  }

  try {
    const existing = await getWorkingStyleByUserId(styleData.userId);
    if (existing) {
      const [updated] = await db
        .update(workingStyles)
        .set({
          ...styleData,
          updatedAt: new Date(),
        })
        .where(eq(workingStyles.userId, styleData.userId))
        .returning();
      return updated;
    }

    const [inserted] = await db.insert(workingStyles).values(styleData).returning();
    return inserted;
  } catch (error) {
    console.warn('[DB Notice]: Could not upsert working style:', error);
    return {
      id: 'mock-style-id',
      userId: styleData.userId,
      workTiming: styleData.workTiming || 'Flexible',
      workApproach: styleData.workApproach || 'Flexible',
      workPace: styleData.workPace || 'Balanced',
      communicationStyle: styleData.communicationStyle || 'Async',
      teamPreference: styleData.teamPreference || 'Collaborative',
      updatedAt: new Date(),
    };
  }
}
