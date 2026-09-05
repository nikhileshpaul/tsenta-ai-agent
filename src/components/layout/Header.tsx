'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAgentStore } from '@/store/useAgentStore';
import { AgentStatusBadge } from './AgentStatusBadge';
import { AuthModal } from '@/components/auth/AuthModal';
import { Sparkles, RotateCcw, LogIn, LogOut, User as UserIcon } from 'lucide-react';

export function Header() {
  const { user, logoutUser, resetToDefaults } = useAgentStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  const isGuest = user.id === 'usr-guest';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-background/80 px-6 backdrop-blur-md">
        {/* Left: Clickable Site Icon & Title */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-opacity hover:opacity-90 cursor-pointer"
          title="Return to JobPulse Command Center"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                JobPulse AI
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-400">
                POSTGRES AGENT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Application Agent & Tailored Diff Engine
            </p>
          </div>
        </Link>

        {/* Right: Live Agent Status, Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <AgentStatusBadge />

          <div className="h-4 w-px bg-surface-border hidden md:block" />

          {/* Reset State Button */}
          <button
            onClick={() => {
              if (confirm('Reset all jobs, applications, and logs to initial seed data?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-surface-light transition-colors cursor-pointer"
            title="Reset mock data / seeds"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Reset Seeds</span>
          </button>

          {/* Candidate Profile / Auth Dropdown or Button */}
          {isGuest ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2.5 rounded-full border border-surface-border bg-surface-subtle py-1 pl-1.5 pr-3 hover:border-slate-600 transition-colors cursor-pointer"
                title="Click to switch account"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-700">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden text-left lg:block">
                  <div className="text-xs font-medium text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user.title || 'Staff Engineer'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-surface-border bg-surface text-slate-400 hover:text-rose-400 hover:bg-surface-light transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
