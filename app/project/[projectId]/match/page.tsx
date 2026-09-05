'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './match.module.css';
import Button from '@/components/ui/Button';
import ScoreBar from '@/components/ui/ScoreBar';

interface Candidate {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  experience: string;
  skills: string[];
  hoursPerWeek: number;
  availabilityStatus: string;
  overallMatchScore: number;
  skillsMatchScore: number;
  styleMatchScore: number;
  availabilityMatchScore: number;
  interestsMatchScore: number;
  invited?: boolean;
}

const FALLBACK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    userId: 'usr-1',
    name: 'Elena Rostova',
    username: 'elenarostova',
    avatarUrl: null,
    role: 'AI / ML Architect',
    experience: 'Senior (5+ yrs)',
    skills: ['Gemini API', 'Python', 'TypeScript', 'LLM Prompts', 'PyTorch', 'Next.js'],
    hoursPerWeek: 20,
    availabilityStatus: 'available',
    overallMatchScore: 96,
    skillsMatchScore: 95,
    styleMatchScore: 90,
    availabilityMatchScore: 100,
    interestsMatchScore: 98,
    invited: false,
  },
  {
    id: 'cand-2',
    userId: 'usr-2',
    name: 'Marcus Vance',
    username: 'marcusvance',
    avatarUrl: null,
    role: 'Fullstack Next.js Specialist',
    experience: 'Intermediate (3 yrs)',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    hoursPerWeek: 15,
    availabilityStatus: 'available',
    overallMatchScore: 91,
    skillsMatchScore: 90,
    styleMatchScore: 88,
    availabilityMatchScore: 100,
    interestsMatchScore: 85,
    invited: false,
  },
  {
    id: 'cand-3',
    userId: 'usr-3',
    name: 'Aisha Patel',
    username: 'aishapatel',
    avatarUrl: null,
    role: 'Backend & Systems Engineer',
    experience: 'Senior (4 yrs)',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'GraphQL', 'TypeScript', 'Go'],
    hoursPerWeek: 10,
    availabilityStatus: 'busy',
    overallMatchScore: 84,
    skillsMatchScore: 88,
    styleMatchScore: 85,
    availabilityMatchScore: 60,
    interestsMatchScore: 90,
    invited: false,
  },
  {
    id: 'cand-4',
    userId: 'usr-4',
    name: 'Liam O\'Connor',
    username: 'liamoconnor',
    avatarUrl: null,
    role: 'UI / UX Product Designer',
    experience: 'Intermediate (2 yrs)',
    skills: ['Figma', 'CSS Modules', 'Design Systems', 'React', 'Tailwind'],
    hoursPerWeek: 15,
    availabilityStatus: 'available',
    overallMatchScore: 82,
    skillsMatchScore: 75,
    styleMatchScore: 88,
    availabilityMatchScore: 100,
    interestsMatchScore: 80,
    invited: false,
  },
];

export default function MatchCandidatesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [candidates, setCandidates] = useState<Candidate[]>(FALLBACK_CANDIDATES);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [invitedIds, setInvitedIds] = useState<Record<string, boolean>>({});

  const roles = [
    'All',
    'AI / ML Architect',
    'Fullstack Next.js Specialist',
    'Backend & Systems Engineer',
    'UI / UX Product Designer',
  ];

  useEffect(() => {
    async function fetchMatches() {
      if (!projectId) return;
      setLoading(true);
      try {
        const res = await fetch('/api/ai/match-candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, roleFilter: selectedRole }),
        });
        const data = await res.json();
        if (data.success && data.candidates && data.candidates.length > 0) {
          setCandidates(data.candidates);
        }
      } catch (err) {
        console.error('Failed to fetch matched candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [projectId, selectedRole]);

  const handleSendInvite = async (candId: string) => {
    setInvitedIds((prev) => ({ ...prev, [candId]: true }));
    try {
      await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, toUserId: candId }),
      });
    } catch (err) {
      console.error('Error sending invite:', err);
    }
  };

  const filteredCandidates =
    selectedRole === 'All'
      ? candidates
      : candidates.filter((c) => c.role.toLowerCase().includes(selectedRole.toLowerCase()));

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Candidate Match Engine</h1>
          <p className={styles.subtitle}>
            Top ranked developer candidates scored by technical compatibility, working style DNA, and availability.
          </p>
        </div>

        {/* Role Filter */}
        <div className={styles.filterBar}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Filter by Role:
          </span>
          <select
            className={styles.roleSelect}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate List */}
      <div className={styles.candidateList}>
        {filteredCandidates.map((cand) => (
          <div key={cand.id} className={styles.candidateCard}>
            <div className={styles.cardTop}>
              <div className={styles.candidateInfo}>
                <div className={styles.candidateAvatar}>
                  {cand.avatarUrl ? (
                    <img src={cand.avatarUrl} alt={cand.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    cand.name[0].toUpperCase()
                  )}
                </div>

                <div>
                  <h3 className={styles.candidateName}>{cand.name}</h3>
                  <p className={styles.candidateRole}>
                    {cand.role} • {cand.experience}
                  </p>
                  <div style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    🟢 {cand.hoursPerWeek} hrs/wk dedicated ({cand.availabilityStatus})
                  </div>
                </div>
              </div>

              <div className={styles.matchBadge}>
                <span>✨</span> {cand.overallMatchScore}% Match
              </div>
            </div>

            {/* Score Breakdown Grid */}
            <div className={styles.scoresGrid}>
              <ScoreBar label="Skills Compatibility" value={cand.skillsMatchScore} color="violet" />
              <ScoreBar label="Working Style DNA" value={cand.styleMatchScore} color="cyan" />
              <ScoreBar label="Availability Match" value={cand.availabilityMatchScore} color="emerald" />
              <ScoreBar label="Domain Interests" value={cand.interestsMatchScore} color="amber" />
            </div>

            {/* Matching Skills Tags */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                MATCHING SKILLS & TECH
              </div>
              <div className={styles.skillsContainer}>
                {cand.skills.map((skill) => (
                  <span key={skill} className={styles.chip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions */}
            <div className={styles.cardActions}>
              <Link href={`/profile/${cand.username}`}>
                <Button variant="ghost" size="sm">
                  View Developer Profile →
                </Button>
              </Link>

              {invitedIds[cand.id] ? (
                <Button variant="outline" size="sm" disabled style={{ borderColor: '#10b981', color: '#10b981' }}>
                  Invitation Sent ✓
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => handleSendInvite(cand.id)}>
                  Send Invitation ✉️
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
