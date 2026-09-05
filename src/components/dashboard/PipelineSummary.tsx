'use client';

import React from 'react';
import Link from 'next/link';
import { useAgentStore } from '@/store/useAgentStore';
import { JobApplicationStage } from '@/types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function PipelineSummary() {
  const { applications } = useAgentStore();

  const stages: { stage: JobApplicationStage; label: string; color: string; barColor: string }[] = [
    { stage: 'discovered', label: 'Discovered', color: 'text-slate-400', barColor: 'bg-slate-500' },
    { stage: 'tailoring', label: 'Tailoring Diff', color: 'text-indigo-400', barColor: 'bg-indigo-500' },
    { stage: 'applied', label: 'Applied', color: 'text-cyan-400', barColor: 'bg-cyan-500' },
    { stage: 'interviewing', label: 'Interviewing', color: 'text-amber-400', barColor: 'bg-amber-500' },
    { stage: 'offer', label: 'Offer Received', color: 'text-emerald-400', barColor: 'bg-emerald-500' },
  ];

  const total = applications.length || 1;

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Active Pipeline Funnel</h3>
          <p className="text-xs text-slate-400">Distribution across active conversion stages</p>
        </div>
        <Link
          href="/applications"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Full Kanban Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Funnel Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stages.map((st) => {
          const count = applications.filter((a) => a.stage === st.stage).length;
          const percentage = Math.round((count / total) * 100);

          return (
            <div
              key={st.stage}
              className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-400">{st.label}</span>
                <span className={`font-mono font-bold ${st.color}`}>{count}</span>
              </div>
              <div className="w-full bg-surface-lighter rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${st.barColor}`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {percentage}% of active
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
