'use client';

import React from 'react';
import { JobPosting } from '@/types';
import { useAgentStore } from '@/store/useAgentStore';
import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const { tailorJob, applyForJob } = useAgentStore();

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface rounded-2xl border border-surface-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-300">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">{job.company}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold font-mono">
                  {job.matchScore}% FIT
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{job.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Metadata chips */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl border border-surface-border bg-surface-subtle font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">COMPENSATION</span>
              <span className="font-bold text-emerald-400">{job.salaryRange.split('+')[0]}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">WORKPLACE</span>
              <span className="font-bold text-slate-200 uppercase">{job.workplaceType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">LOCATION</span>
              <span className="font-bold text-slate-200 truncate block">{job.location}</span>
            </div>
          </div>

          {/* Full description */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Requisition Description
            </span>
            <p className="text-slate-300 text-xs leading-relaxed bg-surface-subtle p-4 rounded-xl border border-surface-border">
              {job.description}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ATS Compatibility Assessment
            </span>

            <div className="space-y-2">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills from Master Profile (
                {job.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.matchedSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {job.missingSkills.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Gap Skills (Will be highlighted in Cover Letter)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border bg-surface-subtle">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>Original Requisition Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                tailorJob(job.id);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Inspect Redline Diff</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
