'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './invitations.module.css';
import Button from '@/components/ui/Button';

interface InvitationItem {
  id: string;
  projectId: string;
  projectTitle: string;
  projectCategory?: string;
  senderName: string;
  senderAvatar?: string | null;
  recipientName?: string;
  status: 'pending' | 'accepted' | 'rejected';
  matchScore: number;
  message: string;
  createdAt: string;
}

const FALLBACK_RECEIVED: InvitationItem[] = [
  {
    id: 'inv-rec-1',
    projectId: 'demo-1',
    projectTitle: 'AI Developer Matching Platform',
    projectCategory: 'Developer Tools & AI',
    senderName: 'Chaitanya Kewale (Project Owner)',
    status: 'pending',
    matchScore: 96,
    message: 'Hey! Your profile on ProjectDNA matches our AI ML Architect requirements with a 96% score. We would love to have you join our project team!',
    createdAt: '2 hours ago',
  },
  {
    id: 'inv-rec-2',
    projectId: 'demo-2',
    projectTitle: 'DeFi Liquidity Aggregator',
    projectCategory: 'Blockchain / Fintech',
    senderName: 'Alex Morgan',
    status: 'pending',
    matchScore: 88,
    message: 'Looking for a Senior Systems & Backend Specialist with PostgreSQL & Node.js expertise to help architect our high-throughput DEX liquidity engine.',
    createdAt: '1 day ago',
  },
];

const FALLBACK_SENT: InvitationItem[] = [
  {
    id: 'inv-sent-1',
    projectId: 'demo-1',
    projectTitle: 'AI Developer Matching Platform',
    projectCategory: 'Developer Tools & AI',
    senderName: 'You',
    recipientName: 'Elena Rostova (AI ML Architect)',
    status: 'pending',
    matchScore: 96,
    message: 'Invitation to collaborate as AI / ML Architect.',
    createdAt: '3 hours ago',
  },
  {
    id: 'inv-sent-2',
    projectId: 'demo-1',
    projectTitle: 'AI Developer Matching Platform',
    projectCategory: 'Developer Tools & AI',
    senderName: 'You',
    recipientName: 'Marcus Vance (Fullstack Next.js Specialist)',
    status: 'accepted',
    matchScore: 91,
    message: 'Invitation to collaborate as Fullstack Next.js Specialist.',
    createdAt: '2 days ago',
  },
];

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedList, setReceivedList] = useState<InvitationItem[]>(FALLBACK_RECEIVED);
  const [sentList, setSentList] = useState<InvitationItem[]>(FALLBACK_SENT);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchInvitations() {
      setLoading(true);
      try {
        const res = await fetch('/api/invitations');
        const data = await res.json();
        if (data.success) {
          if (data.received && data.received.length > 0) {
            const mappedReceived: InvitationItem[] = data.received.map((item: any) => ({
              id: item.id,
              projectId: item.projectId || 'demo-1',
              projectTitle: item.projectTitle || 'Project Collaboration',
              projectCategory: item.projectCategory || 'General',
              senderName: item.senderName || 'Project Lead',
              status: item.status || 'pending',
              matchScore: item.matchScore || 90,
              message: item.message || 'Invited to join project',
              createdAt: new Date(item.createdAt).toLocaleDateString(),
            }));
            setReceivedList(mappedReceived);
          } else {
            setReceivedList([]);
          }

          if (data.sent && data.sent.length > 0) {
            const mappedSent: InvitationItem[] = data.sent.map((item: any) => ({
              id: item.id,
              projectId: item.projectId || 'demo-1',
              projectTitle: item.projectTitle || 'Project Collaboration',
              projectCategory: item.projectCategory || 'General',
              senderName: 'You',
              recipientName: item.recipientName || 'Developer Candidate',
              status: item.status || 'pending',
              matchScore: item.matchScore || 90,
              message: item.message || 'Invitation sent',
              createdAt: new Date(item.createdAt).toLocaleDateString(),
            }));
            setSentList(mappedSent);
          } else {
            setSentList([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch invitations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvitations();
  }, []);

  const handleRespond = async (id: string, action: 'accepted' | 'rejected') => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });

      // Update UI state
      setReceivedList((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: action } : inv))
      );
    } catch (err) {
      console.error(`Error updating invitation to ${action}:`, err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [userProjects, setUserProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('demo-1');
  const [sendingDirect, setSendingDirect] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    async function loadUserProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && data.projects && data.projects.length > 0) {
          setUserProjects(data.projects.map((p: any) => ({ id: p.id, name: p.name })));
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (e) {
        console.warn('Could not load projects:', e);
      }
    }
    loadUserProjects();
  }, []);

  const handleDirectInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setSendingDirect(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId || 'demo-1',
          toEmail: inviteEmail.trim(),
          message: 'Invitation to collaborate on project team on ProjectDNA.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
          setShowInviteModal(false);
          setInviteEmail('');
        }, 2000);

        // Refresh sent invitations list
        const updatedRes = await fetch('/api/invitations');
        const updatedData = await updatedRes.json();
        if (updatedData.sent) {
          setSentList(
            updatedData.sent.map((item: any) => ({
              id: item.id,
              projectId: item.projectId || 'demo-1',
              projectTitle: item.projectTitle || 'Project Collaboration',
              projectCategory: item.projectCategory || 'General',
              senderName: 'You',
              recipientName: item.recipientName || inviteEmail,
              status: item.status || 'pending',
              matchScore: item.matchScore || 90,
              message: item.message || 'Invitation sent',
              createdAt: new Date(item.createdAt).toLocaleDateString(),
            }))
          );
        }
      }
    } catch (err) {
      console.error('Error sending direct invite:', err);
    } finally {
      setSendingDirect(false);
    }
  };

  const pendingReceivedCount = receivedList.filter((i) => i.status === 'pending').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Team Invitations</h1>
          <p className={styles.subtitle}>
            Manage your incoming project collaboration invitations and track outgoing developer requests.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowInviteModal(!showInviteModal)}>
          + Invite Developer by Email ✉️
        </Button>
      </div>

      {/* Direct Invite Modal */}
      {showInviteModal && (
        <form onSubmit={handleDirectInvite} className={styles.inviteCard} style={{ marginBottom: '2rem', borderColor: 'var(--color-electric-violet)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>
              Send Direct Invitation to Developer
            </h3>
            {sendSuccess && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>Invitation Sent Successfully ✓</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {userProjects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                }}
              >
                {userProjects.map((p) => (
                  <option key={p.id} value={p.id} style={{ background: '#0f172a' }}>
                    Project: {p.name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="email"
              placeholder="Enter developer's email address (e.g. developer@example.com)..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
              }}
              required
            />
            <Button type="submit" variant="primary" disabled={sendingDirect}>
              {sendingDirect ? 'Sending...' : 'Send Invite ✉️'}
            </Button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'received' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('received')}
        >
          <span>Received Invitations</span>
          {pendingReceivedCount > 0 && <span className={styles.badge}>{pendingReceivedCount}</span>}
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'sent' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <span>Sent Invitations</span>
          <span className={styles.badge} style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}>
            {sentList.length}
          </span>
        </button>
      </div>

      {/* Received Tab Content */}
      {activeTab === 'received' && (
        <div className={styles.inviteGrid}>
          {receivedList.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📬</div>
              <p className={styles.emptyText}>You don&apos;t have any project invitations yet.</p>
              <Link href="/explore">
                <Button variant="primary">Explore Open Projects →</Button>
              </Link>
            </div>
          ) : (
            receivedList.map((inv) => (
              <div key={inv.id} className={styles.inviteCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.projectTitle}>{inv.projectTitle}</h3>
                    <div className={styles.projectCategory}>{inv.projectCategory}</div>
                  </div>

                  <div className={styles.matchPill}>
                    <span>✨</span> {inv.matchScore}% DNA Match
                  </div>
                </div>

                <div className={styles.messageBox}>{inv.message}</div>

                <div className={styles.cardFooter}>
                  <div className={styles.senderInfo}>
                    <div className={styles.avatar}>{inv.senderName[0].toUpperCase()}</div>
                    <div>
                      <div className={styles.senderName}>{inv.senderName}</div>
                      <div className={styles.senderRole}>Sent {inv.createdAt}</div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {inv.status === 'pending' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading[inv.id]}
                          onClick={() => handleRespond(inv.id, 'rejected')}
                          style={{ color: '#f87171' }}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={actionLoading[inv.id]}
                          onClick={() => handleRespond(inv.id, 'accepted')}
                        >
                          Accept & Join Team ✨
                        </Button>
                      </>
                    ) : inv.status === 'accepted' ? (
                      <Link href={`/workspace/${inv.projectId}`}>
                        <Button variant="primary" size="sm">
                          ✓ Joined — Open Workspace →
                        </Button>
                      </Link>
                    ) : (
                      <span className={`${styles.statusPill} ${styles.statusRejected}`}>
                        ✕ Invitation Declined
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sent Tab Content */}
      {activeTab === 'sent' && (
        <div className={styles.inviteGrid}>
          {sentList.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📤</div>
              <p className={styles.emptyText}>You haven&apos;t sent any invitations to candidates yet.</p>
              <Link href="/dashboard">
                <Button variant="primary">Go to Dashboard →</Button>
              </Link>
            </div>
          ) : (
            sentList.map((inv) => (
              <div key={inv.id} className={styles.inviteCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.projectTitle}>{inv.projectTitle}</h3>
                    <div className={styles.projectCategory}>Recipient: {inv.recipientName || 'Candidate'}</div>
                  </div>

                  <div className={styles.matchPill}>
                    <span>✨</span> {inv.matchScore}% Match
                  </div>
                </div>

                <div className={styles.messageBox}>{inv.message}</div>

                <div className={styles.cardFooter}>
                  <div className={styles.senderInfo}>
                    <div className={styles.avatar}>Y</div>
                    <div>
                      <div className={styles.senderName}>Sent by You</div>
                      <div className={styles.senderRole}>Created {inv.createdAt}</div>
                    </div>
                  </div>

                  <div>
                    {inv.status === 'pending' && (
                      <span className={`${styles.statusPill} ${styles.statusPending}`}>
                        ⏳ Pending Response
                      </span>
                    )}
                    {inv.status === 'accepted' && (
                      <span className={`${styles.statusPill} ${styles.statusAccepted}`}>
                        ✓ Accepted & Joined
                      </span>
                    )}
                    {inv.status === 'rejected' && (
                      <span className={`${styles.statusPill} ${styles.statusRejected}`}>
                        ✕ Declined
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
