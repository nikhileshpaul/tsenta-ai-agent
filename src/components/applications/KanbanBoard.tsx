'use client';

import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Application, JobApplicationStage } from '@/types';
import {
  Sparkles,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  Zap,
  Building2,
  Clock,
} from 'lucide-react';

export function KanbanBoard() {
  const {
    applications,
    updateApplicationStage,
    setSelectedApplication,
    tailorJob,
  } = useAgentStore();

  const columns: {
    stage: JobApplicationStage;
    title: string;
    accentColor: string;
    dotColor: string;
    badgeStyle: string;
  }[] = [
    {
      stage: 'discovered',
      title: 'Discovered',
      accentColor: 'bg-slate-500',
      dotColor: 'bg-slate-400',
      badgeStyle: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    },
    {
      stage: 'tailoring',
      title: 'Tailoring Diff',
      accentColor: 'bg-indigo-500',
      dotColor: 'bg-indigo-400',
      badgeStyle: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      stage: 'applied',
      title: 'Applied',
      accentColor: 'bg-cyan-500',
      dotColor: 'bg-cyan-400',
      badgeStyle: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
    {
      stage: 'interviewing',
      title: 'Interviewing',
      accentColor: 'bg-amber-500',
      dotColor: 'bg-amber-400',
      badgeStyle: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      stage: 'offer',
      title: 'Offer Received',
      accentColor: 'bg-emerald-500',
      dotColor: 'bg-emerald-400',
      badgeStyle: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      stage: 'rejected',
      title: 'Rejected / Archived',
      accentColor: 'bg-rose-500',
      dotColor: 'bg-rose-400',
      badgeStyle: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
  ];

  const stageOrder: JobApplicationStage[] = [
    'discovered',
    'tailoring',
    'applied',
    'interviewing',
    'offer',
    'rejected',
  ];

  const moveStage = (app: Application, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stageOrder.indexOf(app.stage);
    if (direction === 'prev' && currentIndex > 0) {
      updateApplicationStage(app.id, stageOrder[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < stageOrder.length - 1) {
      updateApplicationStage(app.id, stageOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="flex gap-4 min-h-[640px] overflow-x-auto pb-6 scrollbar-thin">
      {columns.map((col) => {
        const columnApps = applications.filter((a) => a.stage === col.stage);

        return (
          <div
            key={col.stage}
            className="w-80 shrink-0 flex flex-col rounded-2xl border border-surface-border bg-surface-subtle/50 shadow-sm overflow-hidden"
          >
            {/* Top Crisp Accent Line */}
            <div className={`h-1 w-full ${col.accentColor}`} />

            {/* Column Header */}
            <div className="px-4 py-3.5 border-b border-surface-border flex items-center justify-between bg-surface/40">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {col.title}
                </span>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${col.badgeStyle}`}
              >
                {columnApps.length}
              </span>
            </div>

            {/* Column Body Cards */}
            <div className="p-3 flex-1 space-y-3 overflow-y-auto">
              {columnApps.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-700/60 rounded-xl bg-surface/20">
                  <span className="text-xs font-medium text-slate-500">
                    No applications in this stage
                  </span>
                </div>
              ) : (
                columnApps.map((app) => {
                  const currentIdx = stageOrder.indexOf(app.stage);

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      className="group rounded-xl border border-surface-border bg-surface hover:border-slate-600 hover:shadow-lg p-3.5 space-y-3 transition-all cursor-pointer"
                    >
                      {/* Company & Fit badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-surface-light border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                            {app.company.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {app.company}
                          </span>
                        </div>

                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                            app.matchScore >= 95
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          }`}
                        >
                          {app.matchScore}%
                        </span>
                      </div>

                      {/* Job Title */}
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {app.jobTitle}
                      </h5>

                      {/* Salary */}
                      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{app.salaryRange.split('+')[0]}</span>
                      </div>

                      {/* Special Badges: Interview Date or Confirmed Offer */}
                      {app.stage === 'interviewing' && app.interviewDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg font-mono">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{app.interviewDate}</span>
                        </div>
                      )}

                      {app.stage === 'offer' && app.offerAmount && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-mono">
                          <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{app.offerAmount.split('+')[0]}</span>
                        </div>
                      )}

                      {/* Stage Mover Controls */}
                      <div className="pt-2.5 border-t border-surface-border flex items-center justify-between">
                        <button
                          disabled={currentIdx === 0}
                          onClick={(e) => moveStage(app, 'prev', e)}
                          className="p-1.5 rounded-lg border border-surface-border bg-surface-light hover:bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                          title={currentIdx > 0 ? `Move back to ${stageOrder[currentIdx - 1]}` : undefined}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[11px] text-slate-400 font-mono">
                          {app.appliedDate ? app.appliedDate.slice(5) : 'Pending'}
                        </span>

                        <button
                          disabled={currentIdx === stageOrder.length - 1}
                          onClick={(e) => moveStage(app, 'next', e)}
                          className="p-1.5 rounded-lg border border-surface-border bg-surface-light hover:bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                          title={currentIdx < stageOrder.length - 1 ? `Advance to ${stageOrder[currentIdx + 1]}` : undefined}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
