import React from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

export default async function WorkspaceGithubPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          GitHub Integration & Automated AI Code Reviews
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Automated repository syncing, pull request AI checks, and automated commit velocity telemetry.
        </p>
      </div>

      <div className={styles.card} style={{ textAlign: 'center', padding: '3.5rem 2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🐙</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          GitHub Sync & AI Bot Review Engine
        </h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          ProjectDNA is configured for automated GitHub OAuth integration. Connect your repository to enable automatic PR reviews, commit branch telemetry, and Gemini AI code auditing.
        </p>

        <div style={{ display: 'inline-flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="primary">
            Connect GitHub Repository 🐙
          </Button>
          <Button variant="outline">
            View Sample AI PR Review →
          </Button>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className={styles.grid3}>
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <div className={styles.cardTitle}>⚡ Automated PR Reviews</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Gemini AI reviews incoming Pull Requests against your Project DNA guidelines, flagging type mismatches and security risks.
          </p>
        </div>

        <div className={styles.card} style={{ marginBottom: 0 }}>
          <div className={styles.cardTitle}>🌿 Branch & Task Sync</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Commits matching Kanban task IDs automatically transition tasks from <code>To Do</code> to <code>In Progress</code> or <code>Done</code>.
          </p>
        </div>

        <div className={styles.card} style={{ marginBottom: 0 }}>
          <div className={styles.cardTitle}>📈 Code Velocity Stats</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Real-time telemetry measuring lines added, PR turnaround time, and team contribution balance.
          </p>
        </div>
      </div>
    </div>
  );
}
