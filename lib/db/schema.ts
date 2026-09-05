import { pgTable, uuid, text, boolean, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const visibilityEnum = pgEnum('visibility', ['public', 'private']);
export const projectStatusEnum = pgEnum('project_status', ['draft', 'active', 'complete']);
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'rejected']);
export const memberRoleEnum = pgEnum('member_role', ['admin', 'member', 'viewer']);

// 1. Users table (synced from Clerk)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  username: text('username').unique(),
  avatarUrl: text('avatar_url'),
  onboardingComplete: boolean('onboarding_complete').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Developer Profiles
export const developerProfiles = pgTable('developer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  role: text('role'),
  experience: text('experience'),
  skills: text('skills').array(),
  techStack: text('tech_stack').array(),
  interests: text('interests').array(),
  hoursPerWeek: integer('hours_per_week').default(10),
  availabilityStatus: text('availability_status').default('available'),
  college: text('college'),
  organization: text('organization'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Working Styles (DNA profile)
export const workingStyles = pgTable('working_styles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workTiming: text('work_timing'),
  workApproach: text('work_approach'),
  workPace: text('work_pace'),
  communicationStyle: text('communication_style'),
  teamPreference: text('team_preference'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Projects
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  category: text('category'),
  duration: text('duration'),
  deadline: timestamp('deadline'),
  teamSize: integer('team_size').default(4).notNull(),
  techPreferences: text('tech_preferences').array(),
  visibility: visibilityEnum('visibility').default('public').notNull(),
  status: projectStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Project DNA (AI Analysis result)
export const projectDna = pgTable('project_dna', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: 'cascade' }),
  summary: text('summary'),
  domain: text('domain'),
  difficulty: text('difficulty'),
  recommendedTeamSize: integer('recommended_team_size'),
  requiredRoles: jsonb('required_roles'),
  requiredSkills: jsonb('required_skills'),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

// 6. Invitations
export const invitations = pgTable('invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromUserId: uuid('from_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  toUserId: uuid('to_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  status: inviteStatusEnum('status').default('pending').notNull(),
  matchScore: integer('match_score'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Project Members (RBAC)
export const projectMembers = pgTable('project_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Type definitions exported for convenience
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type DeveloperProfile = typeof developerProfiles.$inferSelect;
export type NewDeveloperProfile = typeof developerProfiles.$inferInsert;

export type WorkingStyle = typeof workingStyles.$inferSelect;
export type NewWorkingStyle = typeof workingStyles.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectDna = typeof projectDna.$inferSelect;
export type NewProjectDna = typeof projectDna.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
