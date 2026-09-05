'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import styles from './onboarding.module.css';
import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Step 1: Basic Info
  const [basic, setBasic] = useState({
    name: '',
    username: '',
    college: '',
    organization: '',
    bio: '',
  });

  // Pre-fill from Clerk when loaded
  useEffect(() => {
    if (isLoaded && user) {
      setBasic((prev) => ({
        ...prev,
        name: prev.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        username: prev.username || user.username || (user.firstName ? user.firstName.toLowerCase() : ''),
      }));
    }
  }, [isLoaded, user]);

  // Step 2: Professional Info
  const [professional, setProfessional] = useState({
    role: 'Fullstack Developer',
    experience: 'Intermediate',
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js'],
    techStack: ['PostgreSQL', 'Tailwind', 'REST APIs'],
    interests: ['AI & ML', 'Web Apps', 'Open Source'],
  });

  const [skillInput, setSkillInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Step 3: Availability
  const [availability, setAvailability] = useState({
    hoursPerWeek: 15,
    status: 'available',
  });

  // Step 4: Working Style
  const [workingStyle, setWorkingStyle] = useState({
    workTiming: 'Flexible 🕐',
    workApproach: 'Flexible 🌊',
    workPace: 'Balanced ⚖️',
    communicationStyle: 'Async 📨',
    teamPreference: 'Collaborative 🤝',
  });

  // Handlers for Tag Inputs
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!professional.skills.includes(skillInput.trim())) {
        setProfessional((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfessional((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!professional.techStack.includes(techInput.trim())) {
        setProfessional((prev) => ({
          ...prev,
          techStack: [...prev.techStack, techInput.trim()],
        }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setProfessional((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== techToRemove),
    }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basic,
          professional,
          availability,
          workingStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save onboarding profile');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !basic.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Professional' },
    { num: 3, label: 'Availability' },
    { num: 4, label: 'Working Style' },
    { num: 5, label: 'Preview & Submit' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wizardHeader}>
        <h1 className={styles.wizardTitle}>Setup Your Developer DNA Profile</h1>
        <p className={styles.wizardSubtitle}>
          Complete your profile so AI can match you with dream team projects
        </p>
      </div>

      {/* Step Progress Bar */}
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

      {/* Step Form Shell */}
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

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div>
            <h2 className={styles.stepTitle}>Step 1: Personal Details</h2>
            <p className={styles.stepDesc}>Tell us a bit about who you are and where you study/work</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Alex Chen"
                  value={basic.name}
                  onChange={(e) => setBasic({ ...basic, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. alexchen"
                  value={basic.username}
                  onChange={(e) =>
                    setBasic({ ...basic, username: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                  }
                />
              </div>

              <div className={styles.formGrid2} style={{ display: 'grid', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>College / University</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Stanford University"
                    value={basic.college}
                    onChange={(e) => setBasic({ ...basic, college: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Organization / Company</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Open Source Contributor"
                    value={basic.organization}
                    onChange={(e) => setBasic({ ...basic, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Short Bio</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Passionate full-stack developer who loves building AI tools and scalable web apps..."
                  value={basic.bio}
                  onChange={(e) => setBasic({ ...basic, bio: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Professional Info */}
        {step === 2 && (
          <div>
            <h2 className={styles.stepTitle}>Step 2: Role & Technical Skills</h2>
            <p className={styles.stepDesc}>Define your primary expertise and core technical stack</p>

            <div className={styles.formGrid}>
              <div className={styles.formGrid2} style={{ display: 'grid', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primary Role</label>
                  <select
                    className={styles.select}
                    value={professional.role}
                    onChange={(e) => setProfessional({ ...professional, role: e.target.value })}
                  >
                    <option value="Fullstack Developer">Fullstack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Experience Level</label>
                  <select
                    className={styles.select}
                    value={professional.experience}
                    onChange={(e) => setProfessional({ ...professional, experience: e.target.value })}
                  >
                    <option value="Beginner">Beginner (0-1 yrs)</option>
                    <option value="Intermediate">Intermediate (1-3 yrs)</option>
                    <option value="Advanced">Advanced (3-5 yrs)</option>
                    <option value="Lead / Senior">Lead / Senior (5+ yrs)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Skills (Press Enter to add)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <div className={styles.tagContainer}>
                  {professional.skills.map((skill) => (
                    <span key={skill} className={styles.chip}>
                      {skill}
                      <span className={styles.removeChip} onClick={() => handleRemoveSkill(skill)}>
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tech Stack & Tools (Press Enter to add)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type tech (e.g. Next.js, Postgres, Docker) and press Enter..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                />
                <div className={styles.tagContainer}>
                  {professional.techStack.map((tech) => (
                    <span key={tech} className={styles.chip} style={{ borderColor: 'var(--color-accent-cyan)' }}>
                      {tech}
                      <span className={styles.removeChip} onClick={() => handleRemoveTech(tech)}>
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Availability */}
        {step === 3 && (
          <div>
            <h2 className={styles.stepTitle}>Step 3: Time & Availability</h2>
            <p className={styles.stepDesc}>How many hours per week can you dedicate to team projects?</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dedicated Hours Per Week</label>
                <div className={styles.sliderRow}>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    className={styles.rangeSlider}
                    value={availability.hoursPerWeek}
                    onChange={(e) =>
                      setAvailability({ ...availability, hoursPerWeek: Number(e.target.value) })
                    }
                  />
                  <span className={styles.sliderValue}>{availability.hoursPerWeek} hrs/wk</span>
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                <label className={styles.label}>Current Availability Status</label>
                <div className={styles.optionGrid}>
                  {[
                    { id: 'available', title: '🟢 Ready for Projects', desc: 'Actively seeking new team projects' },
                    { id: 'busy', title: '🟡 Limited Capacity', desc: 'Can advise or assist part-time' },
                    { id: 'unavailable', title: '🔴 Unavailable', desc: 'Currently fully committed' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      className={`${styles.optionCard} ${
                        availability.status === opt.id ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setAvailability({ ...availability, status: opt.id })}
                    >
                      <span className={styles.optionTitle}>{opt.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {opt.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Working Style */}
        {step === 4 && (
          <div>
            <h2 className={styles.stepTitle}>Step 4: Working Style DNA</h2>
            <p className={styles.stepDesc}>Select your preferred work habits to ensure optimal team harmony</p>

            <div className={styles.formGrid}>
              {/* Work Timing */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Work Timing Preference</label>
                <div className={styles.optionGrid}>
                  {['Morning 🌅', 'Afternoon ☀️', 'Night 🌙', 'Flexible 🕐'].map((t) => (
                    <div
                      key={t}
                      className={`${styles.optionCard} ${
                        workingStyle.workTiming === t ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setWorkingStyle({ ...workingStyle, workTiming: t })}
                    >
                      <span className={styles.optionTitle}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Approach */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Work Approach</label>
                <div className={styles.optionGrid}>
                  {['Structured 📋', 'Flexible 🌊', 'Balanced ⚖️'].map((a) => (
                    <div
                      key={a}
                      className={`${styles.optionCard} ${
                        workingStyle.workApproach === a ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setWorkingStyle({ ...workingStyle, workApproach: a })}
                    >
                      <span className={styles.optionTitle}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Pace */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Pace of Execution</label>
                <div className={styles.optionGrid}>
                  {['Fast-paced ⚡', 'Balanced ⚖️', 'Detail-oriented 🔍'].map((p) => (
                    <div
                      key={p}
                      className={`${styles.optionCard} ${
                        workingStyle.workPace === p ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setWorkingStyle({ ...workingStyle, workPace: p })}
                    >
                      <span className={styles.optionTitle}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Style */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Communication Frequency</label>
                <div className={styles.optionGrid}>
                  {['Daily Sync 💬', 'Weekly Sync 📅', 'Async 📨'].map((c) => (
                    <div
                      key={c}
                      className={`${styles.optionCard} ${
                        workingStyle.communicationStyle === c ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setWorkingStyle({ ...workingStyle, communicationStyle: c })}
                    >
                      <span className={styles.optionTitle}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Role */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Preferred Team Role</label>
                <div className={styles.optionGrid}>
                  {['Leader 👑', 'Collaborative 🤝', 'Independent 🧑‍💻'].map((r) => (
                    <div
                      key={r}
                      className={`${styles.optionCard} ${
                        workingStyle.teamPreference === r ? styles.selectedOptionCard : ''
                      }`}
                      onClick={() => setWorkingStyle({ ...workingStyle, teamPreference: r })}
                    >
                      <span className={styles.optionTitle}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Preview & Submit */}
        {step === 5 && (
          <div>
            <h2 className={styles.stepTitle}>Step 5: Review Your Developer DNA</h2>
            <p className={styles.stepDesc}>Review your profile card before publishing to ProjectDNA</p>

            <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}>
                  {basic.name ? basic.name[0].toUpperCase() : 'D'}
                </div>
                <div>
                  <h3 className={styles.previewName}>{basic.name || 'Anonymous Developer'}</h3>
                  <p className={styles.previewRole}>
                    {professional.role} • {professional.experience}
                  </p>
                </div>
              </div>

              <div className={styles.previewGrid}>
                <div className={styles.previewItem}>
                  <div className={styles.previewItemLabel}>College / Org</div>
                  <div className={styles.previewItemVal}>{basic.college || basic.organization || 'Independent'}</div>
                </div>

                <div className={styles.previewItem}>
                  <div className={styles.previewItemLabel}>Availability</div>
                  <div className={styles.previewItemVal}>
                    {availability.hoursPerWeek} hrs/wk ({availability.status})
                  </div>
                </div>

                <div className={styles.previewItem}>
                  <div className={styles.previewItemLabel}>Working Style DNA</div>
                  <div className={styles.previewItemVal}>
                    {workingStyle.workTiming} | {workingStyle.teamPreference}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <div className={styles.previewItemLabel}>Core Skills</div>
                <div className={styles.tagContainer}>
                  {professional.skills.map((s) => (
                    <span key={s} className={styles.chip}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {basic.bio && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.previewItemLabel}>Bio</div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{basic.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.buttonRow}>
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
              ← Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button variant="primary" onClick={nextStep}>
              Next Step →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
              Finish & Launch Dashboard 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
