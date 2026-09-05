import React from 'react';
import styles from '../workspace.module.css';

export default async function WorkspaceHealthPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          AI Team Health & Synergy Score
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Composite AI telemetry analyzing communication styles, availability overlap, and skill compatibility.
        </p>
      </div>

      {/* Main Gauge & Score Card */}
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {/* Radial SVG Gauge */}
          <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
              <circle
                cx="90"
                cy="90"
                r="70"
                stroke="url(#healthGrad)"
                strokeWidth="14"
                fill="none"
                strokeDasharray="440"
                strokeDashoffset="26" // ~94% fill
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
              />
              <defs>
                <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>94%</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>EXCELLENT</div>
            </div>
          </div>

          {/* Telemetry Sub-Scores */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>🧬 Working Style DNA Synergy</span>
                <span style={{ color: 'var(--color-cyan-light)', fontWeight: 600 }}>92%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>⏰ Timezone & Availability Overlap</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>96%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>🎯 Tech Stack Skill Coverage</span>
                <span style={{ color: 'var(--color-cyan-light)', fontWeight: 600 }}>90%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: '#06b6d4' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>⚡ Sprint Task Velocity</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>98%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: '#10b981' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Telemetry Insights */}
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>✨ AI Team Synergy Insights</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <li style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #7c3aed' }}>
              <strong>Async & Sync Alignment:</strong> Team members maintain a balanced 70% Async / 30% Daily Sync collaboration preference, leading to zero meeting fatigue.
            </li>
            <li style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #06b6d4' }}>
              <strong>Time Capacity:</strong> 75 dedicated development hours/week registered across all 4 team members.
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>🎯 Optimization Recommendations</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <li style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #10b981' }}>
              Fill the UI/UX Product Designer role to boost visual component throughput by 25%.
            </li>
            <li style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #fbbf24' }}>
              Set up automated GitHub PR reviews for instant code verification.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
