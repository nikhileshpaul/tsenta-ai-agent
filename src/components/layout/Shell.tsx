'use client';

import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TailoredRedlineDiffModal } from '@/components/jobs/TailoredRedlineDiffModal';
import { ApplicationModal } from '@/components/applications/ApplicationModal';

import { useAgentStore } from '@/store/useAgentStore';

export function Shell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { loadUserSession, user } = useAgentStore();

  useEffect(() => {
    setMounted(true);
    // Sync session on mount
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          loadUserSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="text-xs text-slate-400 font-mono tracking-wider">
            INITIALIZING JOBPULSE AGENT CONSOLE...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-background via-surface-subtle/30 to-background">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <TailoredRedlineDiffModal />
      <ApplicationModal />
    </div>
  );
}
