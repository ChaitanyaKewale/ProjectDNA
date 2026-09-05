'use client';

import React, { useState } from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

export default function WorkspaceDnaPage() {
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState('AI Developer Matching Platform');
  const [description, setDescription] = useState(
    'An intelligent platform utilizing Gemini AI to extract structured Project DNA and rank developer candidates using weighted compatibility matching.'
  );
  const [teamSize, setTeamSize] = useState('5');
  const [skills, setSkills] = useState('TypeScript, Next.js 16, Neon PostgreSQL, Gemini API, Drizzle ORM');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Project DNA Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Configure project metadata, AI prompt parameters, required tech stack, and capacity limits.
        </p>
      </div>

      <form onSubmit={handleSave} className={styles.card}>
        <div className={styles.cardTitle}>
          <span>🧬 Core DNA Configuration</span>
          {saved && (
            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
              Settings saved successfully ✓
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
              PROJECT TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
              PROJECT SUMMARY & DNA PURPOSE
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                resize: 'vertical',
              }}
            />
          </div>

          <div className={styles.grid2}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                TARGET TEAM SIZE
              </label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                REQUIRED TECH STACK (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Button type="submit" variant="primary">
              Save DNA Changes ✨
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
