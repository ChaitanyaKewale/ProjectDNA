'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './explore.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ProjectCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  teamSize: number;
  membersCount: number;
  techPreferences: string[];
  duration: string;
  visibility: string;
}

const DEMO_PROJECTS: ProjectCardData[] = [
  {
    id: 'demo-1',
    name: 'DevFlow AI — Automated Code Reviewer',
    slug: 'devflow-ai',
    description:
      'An autonomous GitHub bot powered by Google Gemini that performs deep code reviews, generates PR summaries, and detects security vulnerabilities in real time.',
    category: 'AI / ML',
    teamSize: 4,
    membersCount: 2,
    techPreferences: ['TypeScript', 'Next.js', 'Gemini API', 'Tailwind'],
    duration: '4 Weeks',
    visibility: 'public',
  },
  {
    id: 'demo-2',
    name: 'PeerStack — Distributed P2P File Mesh',
    slug: 'peerstack',
    description:
      'Zero-knowledge encrypted peer-to-peer file sharing protocol built with WebRTC, Rust WASM, and decentralized file indexing.',
    category: 'Web3 / P2P',
    teamSize: 5,
    membersCount: 3,
    techPreferences: ['Rust', 'WASM', 'WebRTC', 'React'],
    duration: '6 Weeks',
    visibility: 'public',
  },
  {
    id: 'demo-3',
    name: 'EcoTrack — Realtime Carbon Footprint Dashboard',
    slug: 'ecotrack',
    description:
      'IoT & Web dashboard tracking energy consumption patterns for cloud microservices and auto-scaling workloads.',
    category: 'Fullstack',
    teamSize: 3,
    membersCount: 1,
    techPreferences: ['Node.js', 'PostgreSQL', 'Grafana', 'Docker'],
    duration: '3 Weeks',
    visibility: 'public',
  },
  {
    id: 'demo-4',
    name: 'Nexus UI — Glassmorphism Component Library',
    slug: 'nexus-ui',
    description:
      'A hyper-accessible, zero-dependency dark mode design system and React component library tailored for next-gen SaaS platforms.',
    category: 'Frontend',
    teamSize: 4,
    membersCount: 2,
    techPreferences: ['React', 'CSS Modules', 'Storybook', 'Figma'],
    duration: '2 Weeks',
    visibility: 'public',
  },
  {
    id: 'demo-5',
    name: 'PulseOps — Synthetic API Latency Monitor',
    slug: 'pulseops',
    description:
      'Edge worker network benchmarking REST and GraphQL API latency globally with instant Discord and Slack webhook alerts.',
    category: 'DevOps',
    teamSize: 3,
    membersCount: 2,
    techPreferences: ['Go', 'Cloudflare Workers', 'GraphQL', 'Next.js'],
    duration: '4 Weeks',
    visibility: 'public',
  },
  {
    id: 'demo-6',
    name: 'CodeCraft Mobile — Offline IDE for iPad',
    slug: 'codecraft-mobile',
    description:
      'Native Swift iPad app with built-in terminal emulator, Git integration, and offline WebAssembly code execution runtime.',
    category: 'Mobile',
    teamSize: 4,
    membersCount: 1,
    techPreferences: ['Swift', 'SwiftUI', 'WASM', 'C++'],
    duration: '8 Weeks',
    visibility: 'public',
  },
];

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<ProjectCardData[]>(DEMO_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'AI / ML', 'Fullstack', 'Frontend', 'Web3 / P2P', 'DevOps', 'Mobile'];

  // Filter projects by search query and selected category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techPreferences.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      project.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Explore Public Projects</h1>
        <p className={styles.subtitle}>
          Discover cutting-edge projects, inspect AI-generated team DNA, and join high-impact developer teams.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className={styles.searchFilterSection}>
        <div className={styles.searchBarWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search projects by name, description, or tech stack (e.g. Next.js, Rust, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryPills}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div>
                <div className={styles.cardHeader}>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <span className={styles.categoryBadge}>{project.category}</span>
                </div>

                <p className={styles.projectDescription}>{project.description}</p>

                {/* Tech Stack Chips */}
                <div className={styles.techSection}>
                  <div className={styles.techLabel}>Required Tech</div>
                  <div className={styles.tagContainer}>
                    {project.techPreferences.map((tech) => (
                      <span key={tech} className={styles.tag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Footer Info */}
                <div className={styles.cardFooter}>
                  <div className={styles.metaInfo}>
                    <span>👥 {project.membersCount}/{project.teamSize} Members</span>
                    <span>⏳ {project.duration}</span>
                  </div>

                  <Link href={`/project/${project.slug}`}>
                    <Button variant="outline" size="sm">
                      Inspect DNA ✨
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            No matching projects found
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            Try broadening your search query or switching categories.
          </p>
          <Button variant="ghost" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
