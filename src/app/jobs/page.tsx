'use client';

import React from 'react';
import { JobsFeed } from '@/components/jobs/JobsFeed';
import { Briefcase, Zap, ShieldCheck } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" /> Requisition Radar & Redline Diff
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Autonomous scraper feed with real-time semantic ATS scoring and side-by-side resume tailoring.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-surface px-3 py-1.5 rounded-xl border border-surface-border">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Semantic ATS Analysis Active</span>
        </div>
      </div>

      <JobsFeed />
    </div>
  );
}
