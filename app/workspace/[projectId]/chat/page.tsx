'use client';

import React, { useState } from 'react';
import styles from '../workspace.module.css';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'Chaitanya Kewale',
    avatar: 'C',
    text: 'Welcome team to the ProjectDNA workspace! All Phase 1–11 features are live.',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg-2',
    sender: 'Elena Rostova',
    avatar: 'E',
    text: 'Great! I just updated the Gemini API structured matching algorithm. Overall candidate compatibility calculation is working smoothly.',
    timestamp: '10:18 AM',
  },
  {
    id: 'msg-3',
    sender: 'Gemini AI Assistant',
    avatar: '✨',
    text: '🤖 AI Update: Team Health is currently at 94%. Recommended next step: recruit 1 UI/UX Product Designer for full DNA capacity.',
    timestamp: '10:20 AM',
    isAi: true,
  },
];

export default function WorkspaceChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      avatar: 'Y',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Trigger AI response if message starts with /ai or asks a question
    if (currentInput.toLowerCase().includes('ai') || currentInput.startsWith('/')) {
      setTimeout(() => {
        const aiMsg: Message = {
          id: `msg-ai-${Date.now()}`,
          sender: 'Gemini AI Assistant',
          avatar: '✨',
          text: `🤖 Gemini Assist: I analyzed your request ("${currentInput}"). The project is 75% complete with 4 team members assigned across 18 sprint tasks.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 1000);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Real-Time Team Chat & AI Assistant
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Instant team messaging, topic channels, and interactive Gemini AI commands.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', height: '550px' }}>
        {/* Channels List */}
        <div className={styles.card} style={{ marginBottom: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CHANNELS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(124, 58, 237, 0.2)', border: '1px solid rgba(124, 58, 237, 0.4)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>
              # general
            </div>
            <div style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', cursor: 'pointer' }}>
              # ai-architecture
            </div>
            <div style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', cursor: 'pointer' }}>
              # dev-sync
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-light)', fontWeight: 600 }}>
              ✨ Gemini AI Assistant Active
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Type /ai to prompt bot
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className={styles.card} style={{ marginBottom: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: m.isAi ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'var(--color-electric-violet)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {m.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: m.isAi ? 'var(--color-cyan-light)' : '#fff' }}>
                      {m.sender}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.timestamp}</span>
                  </div>
                  <div
                    style={{
                      background: m.isAi ? 'rgba(124, 58, 237, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                      border: m.isAi ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <input
              type="text"
              placeholder="Send message to #general or type /ai for assistant..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.875rem',
              }}
            />
            <Button type="submit" variant="primary">
              Send 🚀
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
