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
    color: string;
    border: string;
    badge: string;
  }[] = [
    {
      stage: 'discovered',
      title: 'Discovered',
      color: 'text-slate-400',
      border: 'border-t-slate-500',
      badge: 'bg-slate-500/10 text-slate-400',
    },
    {
      stage: 'tailoring',
      title: 'Tailoring Diff',
      color: 'text-indigo-400',
      border: 'border-t-indigo-500',
      badge: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      stage: 'applied',
      title: 'Applied',
      color: 'text-cyan-400',
      border: 'border-t-cyan-500',
      badge: 'bg-cyan-500/10 text-cyan-400',
    },
    {
      stage: 'interviewing',
      title: 'Interviewing',
      color: 'text-amber-400',
      border: 'border-t-amber-500',
      badge: 'bg-amber-500/10 text-amber-400',
    },
    {
      stage: 'offer',
      title: 'Offer Received',
      color: 'text-emerald-400',
      border: 'border-t-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      stage: 'rejected',
      title: 'Rejected / Archived',
      color: 'text-rose-400',
      border: 'border-t-rose-500',
      badge: 'bg-rose-500/10 text-rose-400',
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px] overflow-x-auto pb-4">
      {columns.map((col) => {
        const columnApps = applications.filter((a) => a.stage === col.stage);

        return (
          <div
            key={col.stage}
            className={`rounded-2xl border border-surface-border bg-surface-subtle/60 flex flex-col min-w-[220px] shadow-sm border-t-4 ${col.border}`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-surface-border flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                {col.title}
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badge}`}
              >
                {columnApps.length}
              </span>
            </div>

            {/* Column Body Cards */}
            <div className="p-3 flex-1 space-y-3 overflow-y-auto">
              {columnApps.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-surface-border rounded-xl">
                  No applications
                </div>
              ) : (
                columnApps.map((app) => {
                  const currentIdx = stageOrder.indexOf(app.stage);

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      className="group rounded-xl border border-surface-border bg-surface hover:border-cyan-500/40 p-3.5 space-y-2.5 transition-all cursor-pointer shadow-xs"
                    >
                      {/* Company & Fit badge */}
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-[10px] text-cyan-300 shrink-0">
                            {app.company.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-slate-300 truncate max-w-[110px]">
                            {app.company}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                          {app.matchScore}%
                        </span>
                      </div>

                      {/* Job Title */}
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {app.jobTitle}
                      </h5>

                      {/* Salary */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{app.salaryRange.split('+')[0]}</span>
                      </div>

                      {/* Interview or Offer Badge if any */}
                      {app.stage === 'interviewing' && app.interviewDate && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{app.interviewDate}</span>
                        </div>
                      )}

                      {app.stage === 'offer' && app.offerAmount && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                          <Award className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{app.offerAmount.split('+')[0]}</span>
                        </div>
                      )}

                      {/* Stage Mover Controls */}
                      <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                        <button
                          disabled={currentIdx === 0}
                          onClick={(e) => moveStage(app, 'prev', e)}
                          className="p-1 rounded bg-surface-light hover:bg-surface-lighter text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                          title="Move stage back"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {app.appliedDate ? app.appliedDate.slice(5) : 'Pending'}
                        </span>

                        <button
                          disabled={currentIdx === stageOrder.length - 1}
                          onClick={(e) => moveStage(app, 'next', e)}
                          className="p-1 rounded bg-surface-light hover:bg-surface-lighter text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                          title="Advance stage forward"
                        >
                          <ChevronRight className="w-3 h-3" />
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
