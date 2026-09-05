import React from 'react';
import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import styles from './dashboard.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getUserByClerkId } from '@/lib/db/queries/users';
import { getUserProjects } from '@/lib/db/queries/projects';
import { getReceivedInvitations } from '@/lib/db/queries/invitations';

export default async function DashboardPage() {
  // Enforce Clerk authentication guard
  const { userId } = await auth.protect();
  const clerkUser = await currentUser();

  // Query Neon DB for user profile and projects
  const dbUser = await getUserByClerkId(userId);

  const ownedProjects = dbUser ? await getUserProjects(dbUser.id) : [];
  const pendingInvitations = dbUser ? await getReceivedInvitations(dbUser.id) : [];

  // Recommended Projects Mock / DB Feed
  const recommendedProjects = [
    {
      id: 'rec-1',
      name: 'DevFlow AI',
      slug: 'devflow-ai',
      description: 'Autonomous Gemini PR code reviewer & security scanner.',
      category: 'AI / ML',
      teamSize: 4,
      membersCount: 2,
    },
    {
      id: 'rec-2',
      name: 'PeerStack Mesh',
      slug: 'peerstack',
      description: 'Encrypted P2P file mesh built with WebRTC and WASM.',
      category: 'Web3 / P2P',
      teamSize: 5,
      membersCount: 3,
    },
    {
      id: 'rec-3',
      name: 'Nexus UI Library',
      slug: 'nexus-ui',
      description: 'Glassmorphism dark mode React design system.',
      category: 'Frontend',
      teamSize: 4,
      membersCount: 2,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <div className={styles.welcomeHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {clerkUser?.firstName || 'Developer'} 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Manage your project DNA, track active team applications, and launch new builds.
          </p>
        </div>

        <Link href="/create-project">
          <Button variant="primary">
            + Create New Project
          </Button>
        </Link>
      </div>

      {/* Main Dashboard Layout */}
      <div className={styles.dashboardLayout}>
        <div className={styles.mainSection}>
          {/* SECTION 1: My Projects */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                🚀 My Projects
                {ownedProjects.length > 0 && (
                  <span className={styles.countBadge}>{ownedProjects.length}</span>
                )}
              </h2>

              <Link href="/create-project">
                <Button variant="ghost" size="sm">
                  + New
                </Button>
              </Link>
            </div>

            {ownedProjects.length > 0 ? (
              <div className={styles.cardsGrid}>
                {ownedProjects.map((project) => (
                  <div key={project.id} className={styles.card}>
                    <div>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>{project.name}</h3>
                        <Badge color="cyan">{project.visibility}</Badge>
                      </div>
                      <p className={styles.cardDesc}>{project.description}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardMeta}>
                        👥 Team size: {project.teamSize}
                      </span>
                      <Link href={`/workspace/${project.id}`}>
                        <Button variant="outline" size="sm">
                          Manage Workspace →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p style={{ marginBottom: '1rem' }}>You haven't created any projects yet.</p>
                <Link href="/create-project">
                  <Button variant="primary" size="sm">
                    ✨ Create Your First Project with AI
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 2: Pending Invitations */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                ✉️ Pending Invitations
                {pendingInvitations.length > 0 && (
                  <span className={styles.countBadge}>{pendingInvitations.length}</span>
                )}
              </h2>
            </div>

            {pendingInvitations.length > 0 ? (
              <div className={styles.cardsGrid}>
                {pendingInvitations.map((invite) => (
                  <div key={invite.id} className={styles.inviteCard}>
                    <div className={styles.inviteHeader}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        Project Invitation
                      </span>
                      {invite.matchScore && (
                        <span className={styles.matchScoreBadge}>{invite.matchScore}% Match</span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {invite.message || 'You have been invited to join the project team!'}
                    </p>

                    <div className={styles.inviteActions}>
                      <Button variant="primary" size="sm">
                        Accept Invite ✓
                      </Button>
                      <Button variant="ghost" size="sm">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No pending invitations at the moment. Keep your profile updated to get matched!</p>
              </div>
            )}
          </div>

          {/* SECTION 3: Recommended Projects */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🎯 Recommended Projects for You</h2>
              <Link href="/explore">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>

            <div className={styles.cardsGrid}>
              {recommendedProjects.map((rec) => (
                <div key={rec.id} className={styles.card}>
                  <div>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{rec.name}</h3>
                      <Badge color="violet">{rec.category}</Badge>
                    </div>
                    <p className={styles.cardDesc}>{rec.description}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.cardMeta}>👥 {rec.membersCount}/{rec.teamSize} Fill</span>
                    <Link href={`/project/${rec.slug}`}>
                      <Button variant="outline" size="sm">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Quick Actions */}
        <div className={styles.sidebarSection}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>⚡ Quick Actions</h3>
            <div className={styles.quickActionList}>
              <Link href="/create-project" className={styles.quickActionButton}>
                <span>✨</span> Create New Project
              </Link>
              <Link href="/explore" className={styles.quickActionButton}>
                <span>🔍</span> Explore Projects
              </Link>
              <Link href="/onboarding" className={styles.quickActionButton}>
                <span>🧬</span> Edit Developer DNA
              </Link>
              {dbUser?.username && (
                <Link href={`/profile/${dbUser.username}`} className={styles.quickActionButton}>
                  <span>👤</span> View Public Profile
                </Link>
              )}
            </div>
          </div>

          {/* Developer DNA Card */}
          <div
            className={styles.sidebarCard}
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1))',
              borderColor: 'rgba(124, 58, 237, 0.3)',
            }}
          >
            <h3 className={styles.sidebarTitle} style={{ color: 'var(--color-accent-cyan)' }}>
              🧬 Your Profile Status
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Onboarding Complete: {dbUser?.onboardingComplete ? '✅ Yes' : '⚠️ Pending'}
            </p>
            <Link href="/onboarding">
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Update DNA Specs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
