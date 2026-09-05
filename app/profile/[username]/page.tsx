import React from 'react';
import { notFound } from 'next/navigation';
import styles from './profile.module.css';
import Button from '@/components/ui/Button';
import { getUserByUsername } from '@/lib/db/queries/users';
import { getProfileByUserId, getWorkingStyleByUserId } from '@/lib/db/queries/profiles';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Query Neon DB for user
  const dbUser = await getUserByUsername(username);

  let profile = dbUser ? await getProfileByUserId(dbUser.id) : null;
  let workingStyle = dbUser ? await getWorkingStyleByUserId(dbUser.id) : null;

  // Fallback demo user if username is not found in DB yet
  const userDisplay = dbUser || {
    name: username.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    username,
    avatarUrl: null,
    createdAt: new Date(),
  };

  const profileDisplay = profile || {
    bio: 'Passionate full-stack developer focused on building scalable web apps and AI-driven developer collaboration tools.',
    role: 'Fullstack Engineer',
    experience: 'Intermediate (2+ yrs)',
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind'],
    techStack: ['Drizzle ORM', 'Clerk Auth', 'Neon DB', 'Docker', 'Git'],
    interests: ['AI Tools', 'Web3', 'Open Source'],
    hoursPerWeek: 15,
    availabilityStatus: 'available',
    college: 'Stanford University',
    organization: 'Open Source Contributor',
  };

  const styleDisplay = workingStyle || {
    workTiming: 'Flexible 🕐',
    workApproach: 'Flexible 🌊',
    workPace: 'Fast-paced ⚡',
    communicationStyle: 'Async 📨',
    teamPreference: 'Collaborative 🤝',
  };

  return (
    <div className={styles.container}>
      {/* Profile Header Banner */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarRing}>
            <div className={styles.avatarInner}>
              {userDisplay.avatarUrl ? (
                <img src={userDisplay.avatarUrl} alt={userDisplay.name || 'User'} className={styles.avatarImage} />
              ) : (
                userDisplay.name ? userDisplay.name[0].toUpperCase() : 'D'
              )}
            </div>
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <div>
                <h1 className={styles.userName}>{userDisplay.name}</h1>
                <p className={styles.userHandle}>@{userDisplay.username}</p>
              </div>

              <Button variant="primary">
                Invite to Project ✉️
              </Button>
            </div>

            <div className={styles.metaPills}>
              <span className={styles.roleBadge}>
                {profileDisplay.role} • {profileDisplay.experience}
              </span>
              <span className={styles.availabilityBadge}>
                🟢 {profileDisplay.hoursPerWeek} hrs/wk ({profileDisplay.availabilityStatus})
              </span>
              {profileDisplay.college && (
                <span className={styles.chip} style={{ background: 'rgba(255,255,255,0.05)' }}>
                  🎓 {profileDisplay.college}
                </span>
              )}
            </div>

            {profileDisplay.bio && <p className={styles.bio}>{profileDisplay.bio}</p>}
          </div>
        </div>
      </div>

      {/* Grid: Skills & Working Style DNA */}
      <div className={styles.grid2}>
        {/* Core Skills & Tools */}
        <div className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>⚡ Technical Skills & Stack</h2>
          <div className={styles.chipCloud} style={{ marginBottom: '1.5rem' }}>
            {profileDisplay.skills?.map((skill: string) => (
              <span key={skill} className={styles.chip} style={{ borderColor: 'var(--color-brand-primary)' }}>
                {skill}
              </span>
            ))}
          </div>

          <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
            🛠️ Tools & Ecosystem
          </h3>
          <div className={styles.chipCloud}>
            {profileDisplay.techStack?.map((tech: string) => (
              <span key={tech} className={styles.chip}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Working Style DNA */}
        <div className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>🧬 Working Style DNA</h2>
          <div className={styles.dnaGrid}>
            <div className={styles.dnaItem}>
              <div className={styles.dnaLabel}>Work Timing</div>
              <div className={styles.dnaValue}>{styleDisplay.workTiming}</div>
            </div>

            <div className={styles.dnaItem}>
              <div className={styles.dnaLabel}>Work Approach</div>
              <div className={styles.dnaValue}>{styleDisplay.workApproach}</div>
            </div>

            <div className={styles.dnaItem}>
              <div className={styles.dnaLabel}>Execution Pace</div>
              <div className={styles.dnaValue}>{styleDisplay.workPace}</div>
            </div>

            <div className={styles.dnaItem}>
              <div className={styles.dnaLabel}>Communication</div>
              <div className={styles.dnaValue}>{styleDisplay.communicationStyle}</div>
            </div>

            <div className={styles.dnaItem} style={{ gridColumn: 'span 2' }}>
              <div className={styles.dnaLabel}>Team Role Preference</div>
              <div className={styles.dnaValue}>{styleDisplay.teamPreference}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
