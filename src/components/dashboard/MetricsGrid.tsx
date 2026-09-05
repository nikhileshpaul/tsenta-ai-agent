'use client';

import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import {
  Briefcase,
  Send,
  Target,
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';

export function MetricsGrid() {
  const { jobs, applications } = useAgentStore();

  const totalJobs = jobs.length;
  const appliedCount = applications.filter((a) =>
    ['applied', 'interviewing', 'offer'].includes(a.stage)
  ).length;
  const interviewingCount = applications.filter((a) => a.stage === 'interviewing').length;
  const offersCount = applications.filter((a) => a.stage === 'offer').length;

  const avgMatchRate =
    applications.length > 0
      ? Math.round(
          applications.reduce((acc, curr) => acc + curr.matchScore, 0) / applications.length
        )
      : 92;

  const metrics = [
    {
      title: 'Discovered Requisitions',
      value: totalJobs,
      delta: '+12 today',
      icon: Briefcase,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Applications Dispatched',
      value: appliedCount,
      delta: '80% autonomous',
      icon: Send,
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      title: 'Avg ATS Match Fit',
      value: `${avgMatchRate}%`,
      delta: '+18% with tailoring',
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Active Interviews',
      value: interviewingCount,
      delta: 'Anthropic & Vercel',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Offers Secured',
      value: offersCount,
      delta: 'Linear ($265K Base)',
      icon: Award,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-surface-border bg-surface p-5 hover:border-surface-lighter transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{item.title}</span>
              <div className={`p-2 rounded-xl border ${item.bgColor}`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {item.value}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{item.delta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
