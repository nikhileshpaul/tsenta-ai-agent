'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { JobApplicationStage } from '@/types';
import {
  X,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Zap,
} from 'lucide-react';

export function ApplicationModal() {
  const {
    selectedApplication,
    setSelectedApplication,
    updateApplicationStage,
    updateApplicationNotes,
    tailorJob,
  } = useAgentStore();

  const [notesDraft, setNotesDraft] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!selectedApplication) return null;

  const app = selectedApplication;

  const stageOptions: { value: JobApplicationStage; label: string }[] = [
    { value: 'discovered', label: 'Discovered' },
    { value: 'tailoring', label: 'Tailoring Diff' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offer', label: 'Offer Received' },
    { value: 'rejected', label: 'Rejected / Archived' },
  ];

  const handleSaveNotes = () => {
    updateApplicationNotes(app.id, notesDraft);
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-2xl border border-surface-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-lighter border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-300">
              {app.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">{app.company}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold font-mono">
                  {app.matchScore}% FIT
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{app.jobTitle}</h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedApplication(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Stage transition selector */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Pipeline Lifecycle Stage
              </span>
              <span className="text-slate-300 text-xs">
                Advance or rewind the requisition status in your tracking board
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={app.stage}
                onChange={(e) => updateApplicationStage(app.id, e.target.value as JobApplicationStage)}
                className="bg-surface border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-semibold text-cyan-300 focus:outline-hidden cursor-pointer"
              >
                {stageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-surface-border bg-surface-subtle">
              <span className="text-[10px] text-slate-400 block font-mono">SALARY BAND</span>
              <span className="font-bold text-slate-200">{app.salaryRange.split('+')[0]}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-surface-subtle">
              <span className="text-[10px] text-slate-400 block font-mono">LOCATION</span>
              <span className="font-bold text-slate-200 truncate block">{app.location}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-surface-subtle">
              <span className="text-[10px] text-slate-400 block font-mono">DISPATCHED DATE</span>
              <span className="font-bold text-slate-200">{app.appliedDate || 'Pending'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-surface-subtle">
              <span className="text-[10px] text-slate-400 block font-mono">RESUME DIFF</span>
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  tailorJob(app.jobId);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <Zap className="w-3 h-3" /> View Diff
              </button>
            </div>
          </div>

          {/* Conditional Interview or Offer highlight */}
          {app.interviewRound && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Upcoming Interview
              </span>
              <div className="text-xs font-semibold text-white">{app.interviewRound}</div>
              <div className="text-[11px] text-slate-300 font-mono">{app.interviewDate}</div>
            </div>
          )}

          {app.offerAmount && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Confirmed Offer Terms
              </span>
              <div className="text-sm font-bold font-mono text-emerald-300">{app.offerAmount}</div>
            </div>
          )}

          {/* Notes & Recruiter Observations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Recruiter & Pipeline Notes
              </span>
              {!isEditingNotes && (
                <button
                  onClick={() => {
                    setNotesDraft(app.notes);
                    setIsEditingNotes(true);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-medium cursor-pointer"
                >
                  Edit Note
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-subtle border border-cyan-500/40 rounded-xl p-3 text-xs text-slate-200 focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 rounded-lg text-xs bg-brand-600 text-white font-medium hover:bg-brand-500"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle text-slate-300 text-xs leading-relaxed">
                {app.notes || 'No notes added yet for this requisition.'}
              </div>
            )}
          </div>

          {/* Timeline of Stage Events */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Historical Lifecycle Activity
            </span>

            <div className="relative border-l-2 border-slate-700 ml-2 space-y-4 pl-4 pt-1">
              {app.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-4 ring-surface" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold uppercase text-slate-200">
                      {event.stage}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{event.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border bg-surface-subtle">
          <div className="text-[11px] text-slate-400 font-mono">ID: {app.id}</div>
          <button
            onClick={() => setSelectedApplication(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-light hover:bg-surface-lighter text-slate-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
