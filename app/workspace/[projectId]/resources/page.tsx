import React from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

interface ResourceLink {
  id: string;
  title: string;
  category: 'GitHub' | 'Figma' | 'Documentation' | 'Staging';
  url: string;
  description: string;
  icon: string;
}

const RESOURCES: ResourceLink[] = [
  {
    id: 'r-1',
    title: 'GitHub Source Repository',
    category: 'GitHub',
    url: 'https://github.com/ChaitanyaKewale/ProjectDNA.git',
    description: 'Main project codebase (Next.js 16, Neon DB, Drizzle ORM, Clerk Auth)',
    icon: '🐙',
  },
  {
    id: 'r-2',
    title: 'Figma Design System & Wireframes',
    category: 'Figma',
    url: 'https://figma.com',
    description: 'Dark navy glassmorphic design system tokens, color palettes, and component library.',
    icon: '🎨',
  },
  {
    id: 'r-3',
    title: 'Gemini AI Integration Docs',
    category: 'Documentation',
    url: 'https://ai.google.dev',
    description: 'Official Google Gemini API prompt structuring and JSON schema guidelines.',
    icon: '📄',
  },
  {
    id: 'r-4',
    title: 'Live Staging Deployment',
    category: 'Staging',
    url: 'http://localhost:3000',
    description: 'Development server environment running on port 3000.',
    icon: '🚀',
  },
];

export default async function WorkspaceResourcesPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Shared Resources & Documentation
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Central repository for team repository links, design specifications, and API documentation.
        </p>
      </div>

      <div className={styles.grid2}>
        {RESOURCES.map((r) => (
          <div key={r.id} className={styles.card} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.75rem' }}>{r.icon}</div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>{r.title}</h3>
                <span className={styles.roleBadge} style={{ fontSize: '0.75rem' }}>{r.category}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {r.description}
            </p>

            <div style={{ paddingTop: '0.875rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  Open Link 🔗
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
