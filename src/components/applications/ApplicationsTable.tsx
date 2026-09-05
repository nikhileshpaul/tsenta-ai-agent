'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Application, JobApplicationStage } from '@/types';
import {
  DollarSign,
  Calendar,
  Zap,
  ArrowUpDown,
  Search,
  ChevronRight,
} from 'lucide-react';

export function ApplicationsTable() {
  const {
    applications,
    updateApplicationStage,
    setSelectedApplication,
    tailorJob,
  } = useAgentStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageBadge = (stage: JobApplicationStage) => {
    switch (stage) {
      case 'offer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'interviewing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'applied':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'tailoring':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface shadow-sm overflow-hidden space-y-4">
      {/* Table filters bar */}
      <div className="p-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-subtle border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Stage Filter:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-surface-subtle border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Stages ({applications.length})</option>
            <option value="discovered">Discovered</option>
            <option value="tailoring">Tailoring</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-surface-subtle border-b border-surface-border text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            <tr>
              <th className="py-3 px-4">Company & Position</th>
              <th className="py-3 px-4">Current Stage</th>
              <th className="py-3 px-4">ATS Fit</th>
              <th className="py-3 px-4">Target Compensation</th>
              <th className="py-3 px-4">Timeline Activity</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((app) => (
              <tr
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className="hover:bg-surface-subtle/60 transition-colors cursor-pointer"
              >
                {/* Company & Role */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{app.jobTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.company} • {app.location}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Stage dropdown/badge */}
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={app.stage}
                    onChange={(e) =>
                      updateApplicationStage(app.id, e.target.value as JobApplicationStage)
                    }
                    className={`rounded-lg px-2 py-1 text-xs font-semibold font-mono border capitalize focus:outline-hidden cursor-pointer ${getStageBadge(
                      app.stage
                    )}`}
                  >
                    <option value="discovered" className="bg-surface text-slate-200">
                      Discovered
                    </option>
                    <option value="tailoring" className="bg-surface text-indigo-400">
                      Tailoring
                    </option>
                    <option value="applied" className="bg-surface text-cyan-400">
                      Applied
                    </option>
                    <option value="interviewing" className="bg-surface text-amber-400">
                      Interviewing
                    </option>
                    <option value="offer" className="bg-surface text-emerald-400">
                      Offer
                    </option>
                    <option value="rejected" className="bg-surface text-rose-400">
                      Rejected
                    </option>
                  </select>
                </td>

                {/* Match Score */}
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                  {app.matchScore}%
                </td>

                {/* Salary */}
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {app.salaryRange.split('+')[0]}
                </td>

                {/* Next Event / Note */}
                <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-400">
                  {app.interviewRound ? (
                    <span className="text-amber-300 font-medium truncate block">
                      📅 {app.interviewRound}
                    </span>
                  ) : app.offerAmount ? (
                    <span className="text-emerald-300 font-medium truncate block">
                      🎉 Offer: {app.offerAmount.split('+')[0]}
                    </span>
                  ) : (
                    <span>{app.notes}</span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => tailorJob(app.jobId)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      title="Inspect Tailored Redline Diff"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="p-1.5 rounded-lg border border-surface-border bg-surface-light text-slate-300 hover:text-white transition-colors"
                      title="View Timeline Details"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
