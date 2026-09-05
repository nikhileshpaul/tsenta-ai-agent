'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgentStore } from '@/store/useAgentStore';
import {
  LayoutDashboard,
  Briefcase,
  Columns3,
  UserCheck,
  Sliders,
  Terminal,
  Server,
  Zap,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { jobs, applications, settings } = useAgentStore();

  const highMatchJobsCount = jobs.filter((j) => j.matchScore >= 90).length;
  const activeAppsCount = applications.filter((a) => a.stage !== 'rejected').length;

  const navItems = [
    {
      label: 'Agent Console',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Jobs & Redline Diff',
      href: '/jobs',
      icon: Briefcase,
      badge: `${highMatchJobsCount} match`,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    },
    {
      label: 'Applications Pipeline',
      href: '/applications',
      icon: Columns3,
      badge: `${activeAppsCount} active`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
    {
      label: 'Master Profile',
      href: '/profile',
      icon: UserCheck,
      badge: null,
    },
    {
      label: 'Agent Settings',
      href: '/settings',
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-surface-border bg-surface-subtle/50 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Autonomous Specs Quickcard */}
        <div className="rounded-2xl border border-surface-border bg-surface p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Auto-Apply Engine
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                settings.autonomousMode
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {settings.autonomousMode ? 'ENABLED' : 'MANUAL'}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Match Threshold:</span>
              <span className="text-slate-200 font-mono font-medium">
                ≥ {settings.matchThreshold}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily Limit:</span>
              <span className="text-slate-200 font-mono font-medium">
                {settings.maxDailyApplications} apps/day
              </span>
            </div>
            <div className="flex justify-between">
              <span>AI Tailoring:</span>
              <span className="text-cyan-400 font-mono capitalize">
                {settings.aiTone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Container Spec */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-cyan-400" /> Docker Standalone
          </span>
          <span className="text-emerald-400 font-mono font-medium">PORT 3000</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Next.js 14+ Alpine Standalone runner. State persisted to local browser storage.
        </div>
      </div>
    </aside>
  );
}
