import React from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  teamRole: 'Admin' | 'Member';
  skills: string[];
  joinedAt: string;
  hoursPerWeek: number;
}

const MEMBERS: TeamMemberItem[] = [
  {
    id: 'm-1',
    name: 'Chaitanya Kewale',
    role: 'Lead Architect & Owner',
    teamRole: 'Admin',
    skills: ['TypeScript', 'Next.js 16', 'Neon DB', 'Gemini AI'],
    joinedAt: 'Project Creator',
    hoursPerWeek: 30,
  },
  {
    id: 'm-2',
    name: 'Elena Rostova',
    role: 'AI / ML Architect',
    teamRole: 'Member',
    skills: ['Gemini API', 'Python', 'LLM Prompts', 'PyTorch'],
    joinedAt: 'Joined 2 hours ago',
    hoursPerWeek: 20,
  },
  {
    id: 'm-3',
    name: 'Marcus Vance',
    role: 'Fullstack Next.js Specialist',
    teamRole: 'Member',
    skills: ['TypeScript', 'Next.js', 'React', 'Drizzle ORM'],
    joinedAt: 'Joined 2 days ago',
    hoursPerWeek: 15,
  },
  {
    id: 'm-4',
    name: 'Aisha Patel',
    role: 'Backend & Systems Engineer',
    teamRole: 'Member',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Go'],
    joinedAt: 'Joined 3 days ago',
    hoursPerWeek: 10,
  },
];

export default async function WorkspaceTeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Team Roster & Administration
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Active project collaborators, RBAC roles, and capacity allocations.
        </p>
      </div>

      <div className={styles.grid2}>
        {MEMBERS.map((member) => (
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
    </div>
  );
}
