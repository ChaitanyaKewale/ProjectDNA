import { db } from '../index';
import { users, NewUser, User } from '../schema';
import { eq } from 'drizzle-orm';

export async function getUserByClerkId(clerkId: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return result[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function upsertUser(userData: NewUser): Promise<User> {
  const existing = await getUserByClerkId(userData.clerkId);
  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        email: userData.email,
        name: userData.name ?? existing.name,
        avatarUrl: userData.avatarUrl ?? existing.avatarUrl,
        username: userData.username ?? existing.username,
      })
      .where(eq(users.clerkId, userData.clerkId))
      .returning();
    return updated;
  }

  const [inserted] = await db.insert(users).values(userData).returning();
  return inserted;
}

export async function completeUserOnboarding(userId: string): Promise<void> {
  await db.update(users).set({ onboardingComplete: true }).where(eq(users.id, userId));
}
