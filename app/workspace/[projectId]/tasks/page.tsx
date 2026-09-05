'use client';

import React, { useState } from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Setup Clerk Webhooks and Svix User Synchronization',
    assignee: 'Chaitanya Kewale',
    priority: 'high',
    status: 'done',
  },
  {
    id: 't-2',
    title: 'Implement Drizzle Schema & Neon Database Migrations',
    assignee: 'Aisha Patel',
    priority: 'medium',
    status: 'done',
  },
  {
    id: 't-3',
    title: 'Build AI Candidate Matching Algorithm (Jaccard Score)',
    assignee: 'Elena Rostova',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 't-4',
    title: 'Design Dark Glassmorphism Kanban & Workspace UI',
    assignee: 'Marcus Vance',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 't-5',
    title: 'GitHub Repo OAuth Integration & Automated PR Reviews',
    assignee: 'Aisha Patel',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 't-6',
    title: 'Team Health Score SVG Animated Gauge',
    assignee: 'Elena Rostova',
    priority: 'low',
    status: 'todo',
  },
];

export default function WorkspaceTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const moveTask = (id: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTitle,
      assignee: 'You',
      priority: newPriority,
      status: 'todo',
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Sprint Kanban Tasks
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Manage sprint tasks, assign team members, and track completion progress.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : '+ Add New Task'}
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3 className={styles.cardTitle}>Create New Sprint Task</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Task title or user story description..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
              }}
              required
            />
            <select
              value={newPriority}
              onChange={(e: any) => setNewPriority(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
              }}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <Button type="submit" variant="primary">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Kanban Board */}
      <div className={styles.kanbanBoard}>
        {/* Column 1: To Do */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span>📝 To Do</span>
              <span className={styles.countBadge}>{todoTasks.length}</span>
            </div>
          </div>

          {todoTasks.map((t) => (
            <div key={t.id} className={styles.taskCard}>
              <div className={styles.taskTitle}>{t.title}</div>
              <div className={styles.taskMeta}>
                <span>👤 {t.assignee}</span>
                <span className={`${styles.priorityPill} ${t.priority === 'high' ? styles.priorityHigh : t.priority === 'medium' ? styles.priorityMedium : styles.priorityLow}`}>
                  {t.priority}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Button variant="ghost" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => moveTask(t.id, 'in_progress')}>
                  Start Task →
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: In Progress */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span>⚡ In Progress</span>
              <span className={styles.countBadge} style={{ background: 'rgba(124, 58, 237, 0.4)' }}>
                {inProgressTasks.length}
              </span>
            </div>
          </div>

          {inProgressTasks.map((t) => (
            <div key={t.id} className={styles.taskCard} style={{ borderColor: 'rgba(124, 58, 237, 0.4)' }}>
              <div className={styles.taskTitle}>{t.title}</div>
              <div className={styles.taskMeta}>
                <span>👤 {t.assignee}</span>
                <span className={`${styles.priorityPill} ${t.priority === 'high' ? styles.priorityHigh : t.priority === 'medium' ? styles.priorityMedium : styles.priorityLow}`}>
                  {t.priority}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Button variant="ghost" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => moveTask(t.id, 'todo')}>
                  ← Move Back
                </Button>
                <Button variant="outline" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderColor: '#10b981', color: '#10b981' }} onClick={() => moveTask(t.id, 'done')}>
                  Complete ✓
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3: Done */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <span>✅ Completed</span>
              <span className={styles.countBadge} style={{ background: 'rgba(16, 185, 129, 0.3)' }}>
                {doneTasks.length}
              </span>
            </div>
          </div>

          {doneTasks.map((t) => (
            <div key={t.id} className={styles.taskCard} style={{ opacity: 0.85 }}>
              <div className={styles.taskTitle} style={{ textDecoration: 'line-through' }}>
                {t.title}
              </div>
              <div className={styles.taskMeta}>
                <span>👤 {t.assignee}</span>
                <span className={`${styles.priorityPill} ${styles.priorityLow}`}>Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
