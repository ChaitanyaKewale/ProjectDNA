import React from 'react';
import Link from 'next/link';
import styles from './project-dna.module.css';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = await params;

  const tabs = [
    { href: `/project/${projectId}`, label: '🧬 DNA Overview' },
    { href: `/project/${projectId}/match`, label: '🎯 Match Candidates' },
    { href: `/project/${projectId}/team`, label: '👥 Team Members' },
    { href: `/project/${projectId}/workspace`, label: '🔒 Private Workspace' },
  ];

  return (
    <div>
      {/* Sub-Navigation Header */}
      <div className={styles.subNavHeader}>
        <div className={styles.subNavInner}>
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className={styles.subNavLink}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
