import React from 'react';
import Link from 'next/link';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

interface GapItem {
  role: string;
  priority: string;
  status: string;
  missingSkills: string[];
  aiRecommendation: string;
}

const GAPS: GapItem[] = [
  {
    role: 'UI / UX Product Designer',
    priority: 'High Priority',
    status: 'Unfilled (0 / 1)',
    missingSkills: ['Figma', 'CSS Modules', 'Design Systems', 'Micro-interactions'],
    aiRecommendation: 'Recruit a UI/UX specialist to translate Project DNA wireframes into polished vanilla CSS design tokens and micro-animations.',
  },
  {
    role: 'DevOps & Infrastructure Specialist',
    priority: 'Medium Priority',
    status: 'Optional Gap',
    missingSkills: ['Docker', 'Kubernetes', 'Vercel Edge', 'CI/CD Pipelines'],
    aiRecommendation: 'Backend team is covering database configuration, but a DevOps expert will streamline production edge deployment.',
  },
];

export default async function WorkspaceGapAnalysisPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          AI Team Gap Analysis
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Evaluate role coverage, identify missing technical skill matrices, and get AI hiring recommendations.
        </p>
      </div>

      {/* Role Coverage Overview */}
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div className={styles.cardTitle}>
          <span>📊 Overall Team Capacity & Role Coverage</span>
          <span style={{ color: 'var(--color-cyan-light)', fontWeight: 700 }}>80% Covered (4 / 5 Roles)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>AI / ML Architect</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>100% Filled ✓</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#10b981' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Fullstack Next.js Specialist</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>100% Filled ✓</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#10b981' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Backend & Systems Engineer</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>100% Filled ✓</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#10b981' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>UI / UX Product Designer</span>
              <span style={{ color: '#f87171', fontWeight: 600 }}>0% Unfilled (Action Required)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#ef4444' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Identified Gaps */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
        Identified Team Gaps & AI Hiring Recommendations
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {GAPS.map((gap, idx) => (
          <div key={idx} className={styles.card} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>{gap.role}</h3>
                <span className={`${styles.priorityPill} ${styles.priorityHigh}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                  {gap.priority}
                </span>
              </div>

              <Link href={`/project/${projectId}/match`}>
                <Button variant="primary" size="sm">
                  Find Candidates ✨
                </Button>
              </Link>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', borderLeft: '3px solid var(--color-cyan-light)' }}>
              🤖 <strong>AI Recommendation:</strong> {gap.aiRecommendation}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                MISSING SKILLS MATRIX
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {gap.missingSkills.map((skill) => (
                  <span key={skill} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
