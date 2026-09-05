'use client';

import React from 'react';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { AgentControlPanel } from '@/components/dashboard/AgentControlPanel';
import { LiveAgentLogs } from '@/components/dashboard/LiveAgentLogs';
import { PipelineSummary } from '@/components/dashboard/PipelineSummary';
import { useAgentStore } from '@/store/useAgentStore';
import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { jobs, tailorJob } = useAgentStore();

  const topMatches = [...jobs]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Agent Command Center
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3 h-3" /> AUTONOMOUS CLONE v1.4
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time multi-board job scraping, ATS semantic scoring, and redline resume tailoring loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-surface-border bg-surface hover:bg-surface-light text-slate-200 transition-colors"
          >
            <span>Browse All {jobs.length} Requisitions</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* 5-Card Metrics Grid */}
      <MetricsGrid />

      {/* Autonomous Controls */}
      <AgentControlPanel />

      {/* Pipeline Summary Funnel */}
      <PipelineSummary />

      {/* 2-Column Section: Top Matches Quick Action + Live Telemetry Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top High-Match Opportunities */}
        <div className="lg:col-span-5 rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" /> Top Target Requisitions
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Sorted by Fit</span>
            </div>
            <p className="text-xs text-slate-400">
              Highest scoring roles detected by the semantic parser
            </p>
          </div>

          <div className="space-y-3">
            {topMatches.map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {job.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {job.company} • <span className="font-mono text-slate-300">{job.salaryRange.split('+')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                      job.matchScore >= 95
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {job.matchScore}%
                  </span>
                  <button
                    onClick={() => tailorJob(job.id)}
                    className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs transition-colors cursor-pointer"
                    title="Inspect Redline Diff & Tailor"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/jobs"
            className="text-xs text-center text-cyan-400 hover:text-cyan-300 font-medium pt-2 block"
          >
            Explore all matching jobs →
          </Link>
        </div>

        {/* Right: Live Telemetry Terminal */}
        <div className="lg:col-span-7">
          <LiveAgentLogs />
        </div>
      </div>
    </div>
  );
}
