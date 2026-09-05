'use client';

import React from 'react';
import { JobPosting } from '@/types';
import { useAgentStore } from '@/store/useAgentStore';
import {
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  onOpenDetails: (job: JobPosting) => void;
}

export function JobCard({ job, onOpenDetails }: JobCardProps) {
  const { tailorJob, applyForJob } = useAgentStore();

  const getScoreBadge = (score: number) => {
    if (score >= 95) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (score >= 90) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
    if (score >= 85) {
      return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
    }
    return 'bg-slate-700/30 text-slate-400 border-slate-700';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'queued':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'reviewed':
        return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
      case 'dismissed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface hover:border-cyan-500/40 transition-all duration-200 p-5 flex flex-col justify-between group shadow-sm">
      <div className="space-y-4">
        {/* Header: Company & Match Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-300 shadow-sm shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{job.company}</span>
                <span
                  className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded border ${getStatusBadge(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>
              <h4
                onClick={() => onOpenDetails(job)}
                className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer mt-0.5 line-clamp-1"
              >
                {job.title}
              </h4>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold font-mono shrink-0 shadow-xs ${getScoreBadge(
              job.matchScore
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{job.matchScore}% FIT</span>
          </div>
        </div>

        {/* Details: Location, Workplace, Salary, Posted */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono text-slate-200 truncate">{job.salaryRange.split('+')[0]}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{job.postedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-surface-lighter text-slate-300 uppercase font-semibold text-[9px] tracking-wider">
              {job.workplaceType}
            </span>
          </div>
        </div>

        {/* Short description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.requiredSkills.slice(0, 4).map((skill, i) => {
            const isMatched = job.matchedSkills.includes(skill);
            return (
              <span
                key={i}
                className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                  isMatched
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                    : 'bg-surface-light text-slate-400 border-surface-border'
                }`}
              >
                {skill}
              </span>
            );
          })}
          {job.requiredSkills.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-mono">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(job)}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          View Specs
        </button>

        <div className="flex items-center gap-2">
          {job.status !== 'applied' ? (
            <button
              onClick={() => tailorJob(job.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Redline Diff</span>
            </button>
          ) : (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
