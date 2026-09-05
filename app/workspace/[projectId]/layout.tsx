import React from 'react';
import Link from 'next/link';
import styles from './workspace.module.css';
import { checkWorkspaceAccess } from '@/lib/auth/workspace-guard';
import Button from '@/components/ui/Button';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const access = await checkWorkspaceAccess(projectId);

  const projectTitle = access.project?.title || 'ProjectDNA Workspace';

  const navItems = [
    { href: `/workspace/${projectId}`, label: 'Overview', icon: '📊' },
    { href: `/workspace/${projectId}/team`, label: 'Team Members', icon: '👥' },
    { href: `/workspace/${projectId}/tasks`, label: 'Tasks (Kanban)', icon: '📋' },
    { href: `/workspace/${projectId}/gap-analysis`, label: 'AI Gap Analysis', icon: '🔍' },
    { href: `/workspace/${projectId}/health`, label: 'AI Team Health', icon: '⚡' },
    { href: `/workspace/${projectId}/dna`, label: 'DNA Settings', icon: '🧬' },
    { href: `/workspace/${projectId}/progress`, label: 'Progress & Goals', icon: '🎯' },
    { href: `/workspace/${projectId}/resources`, label: 'Shared Resources', icon: '📚' },
    { href: `/workspace/${projectId}/github`, label: 'GitHub Sync', icon: '🐙' },
    { href: `/workspace/${projectId}/chat`, label: 'Team Chat & AI', icon: '💬' },
  ];

  return (
    <div className={styles.layoutShell}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.projectHeader}>
          <div className={styles.projectBadge}>🔒 Private Workspace</div>
          <h2 className={styles.sidebarTitle} title={projectTitle}>
            {projectTitle}
          </h2>
        </div>

        <nav className={styles.navGroup}>
          <div className={styles.navSectionLabel}>Workspace Modules</div>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href={`/project/${projectId}`}>
            <Button variant="outline" size="sm" style={{ width: '100%' }}>
              ← Public Project DNA
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainPanel}>
        <header className={styles.topBar}>
          <div className={styles.topTitle}>
            <span>⚡ Team Workspace</span>
            <span className={styles.roleBadge}>Role: {access.role || 'Member'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              🟢 Live Collaboration Active
            </span>
          </div>
        </header>

        <div className={styles.contentArea}>{children}</div>
      </main>
    </div>
  );
}
