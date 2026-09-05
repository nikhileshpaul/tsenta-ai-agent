'use client';

import React, { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { ApplicationsTable } from './ApplicationsTable';
import { useAgentStore } from '@/store/useAgentStore';
import { Columns3, Table, Layers, CheckCircle2, TrendingUp } from 'lucide-react';

export function ApplicationsView() {
  const { applications } = useAgentStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const activeApps = applications.filter((a) => a.stage !== 'rejected').length;
  const interviewingApps = applications.filter((a) => a.stage === 'interviewing').length;
  const offersApps = applications.filter((a) => a.stage === 'offer').length;

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Metric indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border bg-surface text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Pipeline: <strong className="text-white">{activeApps}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <span>Interviewing: <strong className="text-white">{interviewingApps}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <span>Offers: <strong className="text-white">{offersApps}</strong></span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-surface-light rounded-xl p-1 border border-surface-border text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'kanban'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'table'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Data Table</span>
          </button>
        </div>
      </div>

      {/* Main View Renderer */}
      {viewMode === 'kanban' ? <KanbanBoard /> : <ApplicationsTable />}
    </div>
  );
}
