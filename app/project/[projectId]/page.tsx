import React from 'react';
import Link from 'next/link';
import styles from './project-dna.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getProjectById, getProjectBySlug, getProjectDna } from '@/lib/db/queries/projects';

interface ProjectDnaPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDnaPage({ params }: ProjectDnaPageProps) {
  const { projectId } = await params;

  // Query Neon DB for project & DNA
  let dbProject = await getProjectById(projectId);
  if (!dbProject) {
    dbProject = await getProjectBySlug(projectId);
  }

  let dbDna = dbProject ? await getProjectDna(dbProject.id) : null;

  // High-quality fallback display data if viewing demo or new project
  const projectDisplay = dbProject || {
    id: projectId,
    name: 'DevFlow AI — Autonomous Code Reviewer',
    slug: 'devflow-ai',
    description:
      'An autonomous GitHub bot powered by Google Gemini that performs deep code reviews, generates PR summaries, and detects security vulnerabilities in real time.',
    category: 'AI / ML',
    duration: '4 Weeks',
    teamSize: 4,
    membersCount: 2,
    techPreferences: ['TypeScript', 'Next.js', 'Gemini API', 'PostgreSQL', 'Tailwind'],
    visibility: 'public',
  };

  const dnaDisplay = dbDna || {
    summary:
      'DevFlow AI is a high-performance developer productivity platform designed to automate pull request code reviews, enforce coding standards, and surface potential security flaws using Google Gemini AI.',
    domain: 'Artificial Intelligence & Developer Tools',
    difficulty: 'Advanced',
    recommendedTeamSize: 4,
    requiredRoles: [
      {
        role: 'AI / ML Lead Architect',
        count: 1,
        skillsRequired: ['Gemini API', 'Python', 'TypeScript', 'LLM Prompts'],
      },
      {
        role: 'Fullstack Next.js Engineer',
        count: 1,
        skillsRequired: ['Next.js 16', 'React', 'TypeScript', 'CSS Modules'],
      },
      {
        role: 'Backend & Systems Engineer',
        count: 1,
        skillsRequired: ['Node.js', 'PostgreSQL', 'Drizzle ORM', 'Docker'],
      },
      {
        role: 'UI / UX Product Designer',
        count: 1,
        skillsRequired: ['Figma', 'Design Systems', 'Dark Mode UI'],
      },
    ],
    requiredSkills: ['Gemini API', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
  };

  // Roles distribution colors for Donut Chart
  const roleColors = ['#7c3aed', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'];

  return (
    <div className={styles.container}>
      {/* Hero Header Banner */}
      <div className={styles.projectHeaderCard}>
        <div className={styles.badgeRow}>
          <Badge color="violet">{dnaDisplay.domain}</Badge>
          <Badge color="cyan">{dnaDisplay.difficulty}</Badge>
          <Badge color="emerald">{projectDisplay.visibility.toUpperCase()}</Badge>
        </div>

        <h1 className={styles.projectTitle}>{projectDisplay.name}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', lineHeight: '1.6' }}>
          {projectDisplay.description}
        </p>

        <div className={styles.metaRow}>
          <span>👥 Team Capacity: {projectDisplay.teamSize} Members</span>
          <span>⏳ Estimated Duration: {projectDisplay.duration}</span>
          <span>✨ Domain: {projectDisplay.category}</span>
        </div>
      </div>

      {/* AI Summary Card */}
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>
          <span>🧬</span> AI Project DNA Summary
        </h2>
        <p className={styles.summaryText}>{dnaDisplay.summary}</p>
      </div>

      {/* Grid: Donut Chart & Roles Breakdown */}
      <div className={styles.grid2}>
        {/* SVG Donut Chart: Role Composition */}
        <div className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>📊 Role Composition Chart</h2>
          <div className={styles.chartWrapper}>
            {/* SVG Donut Chart */}
            <svg className={styles.donutSvg} viewBox="0 0 42 42">
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              {/* Segment 1: AI Lead (25%) */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#7c3aed"
                strokeWidth="6"
                strokeDasharray="25 75"
                strokeDashoffset="0"
              />
              {/* Segment 2: Fullstack (25%) */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeDasharray="25 75"
                strokeDashoffset="-25"
              />
              {/* Segment 3: Systems (25%) */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="25 75"
                strokeDashoffset="-50"
              />
              {/* Segment 4: Designer (25%) */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="6"
                strokeDasharray="25 75"
                strokeDashoffset="-75"
              />
            </svg>

            {/* Legend */}
            <div className={styles.chartLegend}>
              {Array.isArray(dnaDisplay.requiredRoles) &&
                dnaDisplay.requiredRoles.map((r: any, idx: number) => (
                  <div key={idx} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: roleColors[idx % roleColors.length] }}
                    />
                    <span>{r.role || 'Role'} ({r.count || 1})</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Required Roles & Skill Matrices */}
        <div className={styles.cardSection}>
          <h2 className={styles.sectionTitle}>🎯 Required Role Breakdown</h2>
          <div className={styles.rolesList}>
            {Array.isArray(dnaDisplay.requiredRoles) &&
              dnaDisplay.requiredRoles.map((roleObj: any, idx: number) => (
                <div key={idx} className={styles.roleCard}>
                  <div className={styles.roleCardHeader}>
                    <span className={styles.roleName}>{roleObj.role || 'Developer'}</span>
                    <span className={styles.roleCountBadge}>{roleObj.count || 1} Needed</span>
                  </div>
                  <div className={styles.tagCloud}>
                    {Array.isArray(roleObj.skillsRequired) &&
                      roleObj.skillsRequired.map((skill: string) => (
                        <span key={skill} className={styles.chip}>
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Candidate Discovery CTA Banner */}
      <div className={styles.ctaBox}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          Ready to Build Your Dream Team?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '1.75rem', maxWidth: '600px', margin: '0 auto 1.75rem auto' }}>
          Use AI to rank candidate developers based on skill compatibility, working style DNA, and availability status.
        </p>

        <Link href={`/project/${projectDisplay.id}/match`}>
          <Button variant="primary" size="lg">
            Find & Match Candidates ✨
          </Button>
        </Link>
      </div>
    </div>
  );
}
