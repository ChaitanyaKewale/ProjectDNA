import { db } from '../index';
import { users, NewUser, User } from '../schema';
import { eq } from 'drizzle-orm';

export async function getUserByClerkId(clerkId: string): Promise<User | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not query users table:', error);
    return undefined;
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not query user by id:', error);
    return undefined;
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  } catch (error) {
    console.warn('[DB Notice]: Could not query user by username:', error);
    return undefined;
  }
}

export async function upsertUser(userData: NewUser): Promise<User> {
  if (!process.env.DATABASE_URL) {
    return {
      id: 'mock-user-id',
      clerkId: userData.clerkId,
      email: userData.email,
      name: userData.name || 'Developer',
      username: userData.username || 'developer',
      avatarUrl: userData.avatarUrl || null,
      onboardingComplete: false,
      createdAt: new Date(),
    };
  }

  try {
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
  } catch (error) {
    console.warn('[DB Notice]: Could not upsert user:', error);
    return {
      id: 'mock-user-id',
      clerkId: userData.clerkId,
      email: userData.email,
      name: userData.name || 'Developer',
      username: userData.username || 'developer',
      avatarUrl: userData.avatarUrl || null,
      onboardingComplete: false,
      createdAt: new Date(),
    };
  }
}

export async function completeUserOnboarding(userId: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await db.update(users).set({ onboardingComplete: true }).where(eq(users.id, userId));
  } catch (error) {
    console.warn('[DB Notice]: Could not update onboarding status:', error);
  }
}

export async function deleteUserByClerkId(clerkId: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await db.delete(users).where(eq(users.clerkId, clerkId));
  } catch (error) {
    console.warn('[DB Notice]: Could not delete user:', error);
  }
}
