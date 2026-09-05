import React from 'react';
import styles from '../workspace.module.css';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  targetDate: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    title: 'Phase 1: Database & User Auth Setup',
    description: 'Neon Postgres, Drizzle ORM schema, Clerk webhook sync, and vanilla CSS design tokens.',
    status: 'completed',
    progress: 100,
    targetDate: 'Sept 01, 2026',
  },
  {
    id: 'm-2',
    title: 'Phase 2: Project Creation & AI DNA Extraction',
    description: 'Step wizard with Gemini API structured prompt engine to extract roles and tech stack matrices.',
    status: 'completed',
    progress: 100,
    targetDate: 'Sept 03, 2026',
  },
  {
    id: 'm-3',
    title: 'Phase 3: Smart Matching System & Invitations',
    description: 'Weighted candidate ranking algorithm, per-category compatibility scores, and invitation workflow.',
    status: 'completed',
    progress: 100,
    targetDate: 'Sept 05, 2026',
  },
  {
    id: 'm-4',
    title: 'Phase 4: Private Team Workspace & Kanban Tasks',
    description: 'RBAC protected workspace, task boards, team management, and milestone tracking telemetry.',
    status: 'in_progress',
    progress: 75,
    targetDate: 'Sept 10, 2026',
  },
  {
    id: 'm-5',
    title: 'Phase 5: Production Deployment & Staging Release',
    description: 'End-to-end load testing, Vercel edge deployment, and production database indexes.',
    status: 'upcoming',
    progress: 0,
    targetDate: 'Sept 20, 2026',
  },
];

export default async function WorkspaceProgressPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Milestones & Progress Goals
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Track project milestones, sprint release dates, and phase completion telemetry.
        </p>
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div className={styles.cardTitle}>
          <span>🎯 Overall Project Completion</span>
          <span style={{ color: 'var(--color-cyan-light)', fontWeight: 700 }}>75% Complete</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {MILESTONES.map((m) => (
          <div key={m.id} className={styles.card} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>{m.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{m.description}</p>
              </div>

              <span className={styles.roleBadge} style={{ background: m.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : m.status === 'in_progress' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: m.status === 'completed' ? '#34d399' : m.status === 'in_progress' ? 'var(--color-cyan-light)' : 'var(--color-text-muted)' }}>
                {m.status === 'completed' ? '✓ Completed' : m.status === 'in_progress' ? '⚡ In Progress' : '⏳ Upcoming'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${m.progress}%`, height: '100%', background: m.status === 'completed' ? '#10b981' : '#06b6d4' }} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', minWidth: '80px', textAlign: 'right' }}>
                {m.targetDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
