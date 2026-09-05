import React from 'react';
import Link from 'next/link';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';
import { getProjectMembers } from '@/lib/db/queries/members';
import { getUserById, getUserByClerkId } from '@/lib/db/queries/users';
import { getProjectById, getProjectBySlug } from '@/lib/db/queries/projects';
import { auth, currentUser } from '@clerk/nextjs/server';

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  teamRole: 'Admin' | 'Member';
  skills: string[];
  joinedAt: string;
  hoursPerWeek: number;
}

export default async function WorkspaceTeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { userId: clerkId } = await auth();

  let project = await getProjectById(projectId);
  if (!project) {
    project = await getProjectBySlug(projectId);
  }

  const dbMembers = project ? await getProjectMembers(project.id) : [];

  let realMembersList: TeamMemberItem[] = [];

  for (const m of dbMembers) {
    const userRes = await getUserById(m.userId);
    if (userRes) {
      realMembersList.push({
        id: m.id,
        name: userRes.name || 'Developer',
        role: m.role === 'admin' ? 'Project Owner & Lead' : 'Team Member',
        teamRole: m.role === 'admin' ? 'Admin' : 'Member',
        skills: ['TypeScript', 'React', 'Next.js'],
        joinedAt: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'Joined',
        hoursPerWeek: m.role === 'admin' ? 30 : 20,
      });
    }
  }

  // If DB returned no members, show currently authenticated user as Admin Owner
  if (realMembersList.length === 0 && clerkId) {
    const clerkUser = await currentUser();
    const dbUser = await getUserByClerkId(clerkId);
    const ownerName = dbUser?.name || clerkUser?.fullName || 'Project Owner';
    realMembersList.push({
      id: 'owner-1',
      name: ownerName,
      role: 'Project Owner & Lead Architect',
      teamRole: 'Admin',
      skills: ['TypeScript', 'Next.js 16', 'Neon DB', 'Gemini AI'],
      joinedAt: 'Project Creator',
      hoursPerWeek: 30,
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Team Roster & Administration
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Active project collaborators, RBAC roles, and capacity allocations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href={`/project/${projectId}/match`}>
            <Button variant="primary">
              + Find & Match Candidates ✨
            </Button>
          </Link>
          <Link href="/invitations">
            <Button variant="outline">
              ✉️ Send Invitations
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.grid2} style={{ marginBottom: '2rem' }}>
        {realMembersList.map((member) => (
          <div key={member.id} className={styles.card} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.875rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-electric-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>{member.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-cyan-light)', fontWeight: 500 }}>{member.role}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{member.joinedAt}</div>
                </div>
              </div>

              <span className={styles.roleBadge} style={{ background: member.teamRole === 'Admin' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(124, 58, 237, 0.2)', color: member.teamRole === 'Admin' ? '#34d399' : 'var(--color-cyan-light)' }}>
                {member.teamRole}
              </span>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>SKILLS & TECH</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {member.skills.map((s) => (
                  <span key={s} style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                ⏱️ {member.hoursPerWeek} hrs/week dedicated
              </span>

              {member.teamRole !== 'Admin' && (
                <Button variant="ghost" size="sm" style={{ fontSize: '0.75rem' }}>
                  Manage Permissions ⚙️
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Banner if team needs more members */}
      {realMembersList.length <= 1 && (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Build Your Project Team
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9375rem' }}>
            You are currently the sole team member. Use AI Candidate Matching or send direct email invitations to recruit developers into your workspace team.
          </p>
          <div style={{ display: 'inline-flex', gap: '1rem' }}>
            <Link href={`/project/${projectId}/match`}>
              <Button variant="primary">
                Find Candidates ✨
              </Button>
            </Link>
            <Link href="/invitations">
              <Button variant="outline">
                Send Direct Email Invite ✉️
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
