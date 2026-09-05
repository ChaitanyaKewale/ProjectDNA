import { db } from '../index';
import { developerProfiles, workingStyles, NewDeveloperProfile, NewWorkingStyle, DeveloperProfile, WorkingStyle } from '../schema';
import { eq } from 'drizzle-orm';

export async function getProfileByUserId(userId: string): Promise<DeveloperProfile | undefined> {
  const result = await db.select().from(developerProfiles).where(eq(developerProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertProfile(profileData: NewDeveloperProfile): Promise<DeveloperProfile> {
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
}

export async function getWorkingStyleByUserId(userId: string): Promise<WorkingStyle | undefined> {
  const result = await db.select().from(workingStyles).where(eq(workingStyles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertWorkingStyle(styleData: NewWorkingStyle): Promise<WorkingStyle> {
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
}
