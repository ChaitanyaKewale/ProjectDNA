'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './create-project.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'AI / ML',
    description: '',
    duration: '4 Weeks',
    teamSize: 4,
    techPreferences: ['TypeScript', 'Next.js', 'PostgreSQL'],
    visibility: 'public',
  });

  const [techInput, setTechInput] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);

  // Tag Handlers
  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techPreferences.includes(techInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          techPreferences: [...prev.techPreferences, techInput.trim()],
        }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techPreferences: prev.techPreferences.filter((t) => t !== tech),
    }));
  };

  // Step 4: Run AI Analyzer Preview
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          saveToDb: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze project with AI');

      setAiResult(data.aiResult);
    } catch (err: any) {
      setError(err.message || 'AI Analysis failed. Please check inputs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save Project to Neon DB
  const handleConfirmAndSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          saveToDb: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      // Redirect to Dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save project to database.');
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name.trim() || !formData.description.trim())) {
      setError('Please provide a project name and description');
      return;
    }
    setError('');
    const next = Math.min(step + 1, 4);
    setStep(next);
    if (next === 4 && !aiResult) {
      runAiAnalysis();
    }
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Timeline & Team' },
    { num: 3, label: 'Tech & Visibility' },
    { num: 4, label: 'AI DNA Analysis' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wizardHeader}>
        <h1 className={styles.wizardTitle}>Create & Analyze Project</h1>
        <p className={styles.wizardSubtitle}>
          Describe your project and let AI structure its complete Project DNA profile
        </p>
      </div>

      {/* Step Bar */}
      <div className={styles.stepBar}>
        <div
          className={styles.stepProgressFill}
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s) => (
          <div
            key={s.num}
            className={`${styles.stepItem} ${step === s.num ? styles.activeStep : ''} ${
              step > s.num ? styles.completedStep : ''
            }`}
          >
            <div className={styles.stepCircle}>{step > s.num ? '✓' : s.num}</div>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div>
            <h2 className={styles.stepTitle}>Step 1: Project Overview</h2>
            <p className={styles.stepDesc}>What are you building? Give your project a name and description.</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. DevFlow AI — Automated Code Reviewer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="AI / ML">AI / ML</option>
                  <option value="Fullstack SaaS">Fullstack SaaS</option>
                  <option value="Web3 / P2P">Web3 / P2P</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Open Source Tool">Open Source Tool</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Detailed Description *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your project goals, key architecture features, and what problems it solves..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Timeline & Team */}
        {step === 2 && (
          <div>
            <h2 className={styles.stepTitle}>Step 2: Timeline & Team Capacity</h2>
            <p className={styles.stepDesc}>Specify estimated duration and target team size.</p>

            <div className={styles.formGrid}>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estimated Duration</label>
                  <select
                    className={styles.select}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <option value="2 Weeks">2 Weeks (Hackathon / Sprint)</option>
                    <option value="4 Weeks">4 Weeks (1 Month MVP)</option>
                    <option value="8 Weeks">8 Weeks (2 Months Build)</option>
                    <option value="Long Term">Long Term (Ongoing)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Target Team Size: {formData.teamSize} Members</label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    style={{ accentColor: 'var(--color-brand-primary)', cursor: 'pointer' }}
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Tech & Visibility */}
        {step === 3 && (
          <div>
            <h2 className={styles.stepTitle}>Step 3: Preferred Stack & Visibility</h2>
            <p className={styles.stepDesc}>Set required technologies and privacy options.</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Preferred Technologies (Press Enter to add)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type technology (e.g. Next.js, Gemini API, Docker) and press Enter..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                />
                <div className={styles.tagContainer}>
                  {formData.techPreferences.map((tech) => (
                    <span key={tech} className={styles.chip}>
                      {tech}
                      <span className={styles.removeChip} onClick={() => handleRemoveTech(tech)}>
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Visibility</label>
                <div className={styles.formGrid2}>
                  <button
                    type="button"
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: formData.visibility === 'public' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: formData.visibility === 'public' ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onClick={() => setFormData({ ...formData, visibility: 'public' })}
                  >
                    <strong>🌐 Public Project</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Visible in Explore page; developers can apply.
                    </div>
                  </button>

                  <button
                    type="button"
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: formData.visibility === 'private' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: formData.visibility === 'private' ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onClick={() => setFormData({ ...formData, visibility: 'private' })}
                  >
                    <strong>🔒 Private Workspace</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Only invited members can view DNA and access workspace.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AI Analysis & Preview */}
        {step === 4 && (
          <div>
            <h2 className={styles.stepTitle}>Step 4: AI Project DNA Analysis</h2>
            <p className={styles.stepDesc}>Review your AI-generated Project DNA before saving.</p>

            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'float 2s infinite' }}>✨</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  Analyzing Project Description with Gemini AI...
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Structuring domain complexity, required roles, and technical skill matrices...
                </p>
              </div>
            ) : aiResult ? (
              <div className={styles.aiPreviewBox}>
                <div className={styles.aiHeader}>
                  <span className={styles.aiBadge}>✨ AI Project DNA Generated</span>
                  <Badge color="violet">{aiResult.difficulty || 'Intermediate'}</Badge>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                    {formData.name}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                    {aiResult.summary}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Recommended Roles & Team Composition ({aiResult.recommendedTeamSize} Members)
                  </h4>
                  <div className={styles.rolesGrid}>
                    {aiResult.requiredRoles?.map((r: any, idx: number) => (
                      <div key={idx} className={r.roleTitle ? styles.roleCard : ''} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.875rem', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-accent-cyan)', fontSize: '0.875rem' }}>
                          {r.role || 'Developer'} ({r.count || 1})
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          Skills: {r.skillsRequired?.join(', ') || 'Core Stack'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Buttons */}
        <div className={styles.buttonRow}>
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={isAnalyzing || isSaving}>
              ← Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button variant="primary" onClick={nextStep}>
              Next: AI DNA Analysis →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleConfirmAndSave} loading={isSaving} disabled={isAnalyzing}>
              Confirm & Launch Project 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
