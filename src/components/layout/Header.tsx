'use client';

import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { AgentStatusBadge } from './AgentStatusBadge';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const { user, resetToDefaults } = useAgentStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-background/80 px-6 backdrop-blur-md">
      {/* Left: App Title & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">Tsenta AI</span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-400">
                CONTAINERIZED AGENT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Application Agent & Tailored Diff Engine
            </p>
          </div>
        </div>
      </div>

      {/* Right: Live Agent Status, Actions & Profile */}
      <div className="flex items-center gap-4">
        <AgentStatusBadge />

        <div className="h-4 w-px bg-surface-border hidden md:block" />

        {/* Reset State Button */}
        <button
          onClick={() => {
            if (confirm('Reset all jobs, applications, and logs to initial seed data?')) {
              resetToDefaults();
            }
          }}
          className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-surface-light transition-colors"
          title="Reset all mock data to factory state"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Reset Seeds</span>
        </button>

        {/* Candidate User Pill */}
        <div className="flex items-center gap-2.5 rounded-full border border-surface-border bg-surface-subtle py-1 pl-1.5 pr-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-700">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-medium text-slate-200">{user.name}</div>
            <div className="text-[10px] text-slate-400">Staff Architect</div>
          </div>
        </div>
      </div>
    </header>
  );
}
