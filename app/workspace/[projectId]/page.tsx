import React from 'react';
import Link from 'next/link';
import styles from './workspace.module.css';
import Button from '@/components/ui/Button';

export default async function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Workspace Overview
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Project telemetry, sprint milestones, and real-time team collaboration stream.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className={styles.grid4} style={{ marginBottom: '2rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>TEAM MEMBERS</div>
          <div className={styles.statValue}>4 / 5</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>🟢 80% Capacity Filled</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>TASKS COMPLETED</div>
          <div className={styles.statValue}>12 / 18</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-light)', marginTop: '0.25rem' }}>⚡ 66% Completion Rate</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>TARGET RELEASE</div>
          <div className={styles.statValue}>14 Days</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>📅 Oct 15, 2026</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>AI TEAM HEALTH</div>
          <div className={styles.statValue} style={{ color: '#34d399' }}>94%</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>✨ High Synergy</div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className={styles.grid2}>
        {/* Quick Actions & Sprint Progress */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>📋 Active Sprint Telemetry</span>
            <Link href={`/workspace/${projectId}/tasks`}>
              <Button variant="ghost" size="sm">
                Open Kanban →
              </Button>
            </Link>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              <span>Sprint Completion Target</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>66%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '66%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Implement Gemini AI API Route</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Assigned to Elena Rostova</div>
              </div>
              <span className={`${styles.priorityPill} ${styles.priorityHigh}`}>In Progress</span>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Drizzle Schema & Neon DB Migrations</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Assigned to Aisha Patel</div>
              </div>
              <span className={`${styles.priorityPill} ${styles.priorityLow}`}>Done ✓</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>⚡ Recent Team Activity</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-electric-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>E</div>
              <div>
                <span style={{ color: '#fff', fontWeight: 600 }}>Elena Rostova</span> completed task <span style={{ color: 'var(--color-cyan-light)' }}>Project DNA Extraction Prompt</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>20 mins ago</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>M</div>
              <div>
                <span style={{ color: '#fff', fontWeight: 600 }}>Marcus Vance</span> updated styling for <span style={{ color: 'var(--color-cyan-light)' }}>ScoreBar Component</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>1 hour ago</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Y</div>
              <div>
                <span style={{ color: '#fff', fontWeight: 600 }}>You</span> accepted <span style={{ color: 'var(--color-cyan-light)' }}>Elena Rostova</span> to team
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
