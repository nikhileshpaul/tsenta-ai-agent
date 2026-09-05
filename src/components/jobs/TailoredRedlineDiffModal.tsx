'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import {
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  Send,
  RotateCw,
  Copy,
  Check,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export function TailoredRedlineDiffModal() {
  const {
    selectedJobForDiff,
    setSelectedJobForDiff,
    applyForJob,
    addLog,
  } = useAgentStore();

  const [activeTab, setActiveTab] = useState<'diff' | 'coverLetter'>('diff');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedJobForDiff) return null;

  const diff = selectedJobForDiff;
  const scoreDelta = diff.atsScoreAfter - diff.atsScoreBefore;

  const handleApproveAndApply = async () => {
    setIsSubmitting(true);
    addLog({
      level: 'info',
      message: `User approved tailored redline diff for "${diff.jobTitle} @ ${diff.company}". Dispatching...`,
      jobId: diff.jobId,
      actionType: 'apply',
    });

    await new Promise((res) => setTimeout(res, 800));
    applyForJob(diff.jobId);
    setIsSubmitting(false);
    setSelectedJobForDiff(null);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(diff.generatedCoverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-2xl border border-surface-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-subtle/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Tailored Redline Resume Diff
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                  {diff.company}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-lg">
                Requisition: <span className="text-slate-200 font-medium">{diff.jobTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedJobForDiff(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ATS Score Improvement Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-brand-950/40 via-surface to-surface-subtle border-b border-surface-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400">Baseline ATS:</span>
              <span className="text-sm font-bold font-mono text-slate-300">
                {diff.atsScoreBefore}/100
              </span>
            </div>

            <span className="text-slate-600">→</span>

            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400">Tailored ATS:</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {diff.atsScoreAfter}/100
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" />
              <span>+{scoreDelta}% improvement</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-surface-light rounded-lg p-0.5 border border-surface-border text-xs font-medium">
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'diff'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Resume Diff</span>
            </button>
            <button
              onClick={() => setActiveTab('coverLetter')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'coverLetter'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cover Letter</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'diff' ? (
            <div className="space-y-6">
              {/* Executive Summary Transformation */}
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Executive Summary Tailoring
                </span>

                <div className="space-y-2 text-xs">
                  <div className="diff-deletion p-3 rounded-lg">
                    <span className="font-mono text-[10px] text-rose-400 block font-bold mb-1">
                      - ORIGINAL SUMMARY:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{diff.summaryBefore}</p>
                  </div>

                  <div className="diff-addition p-3 rounded-lg">
                    <span className="font-mono text-[10px] text-emerald-400 block font-bold mb-1">
                      + TAILORED REWRITE (ATS OPTIMIZED):
                    </span>
                    <p className="text-slate-100 leading-relaxed font-medium">
                      {diff.summaryAfter}
                    </p>
                  </div>
                </div>
              </div>

              {/* Keywords & Strategic Injections */}
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Targeted Keywords Injected into ATS Pipeline:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {diff.keywordsAdded.map((kw, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  Strategy: {diff.toneAdjustment}
                </p>
              </div>

              {/* Redline Bullet Points Diff */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Experience Accomplishment Redline Comparison:
                </span>

                <div className="space-y-3 font-mono text-xs">
                  {diff.diffChunks.map((chunk) => {
                    if (chunk.type === 'unchanged') {
                      return (
                        <div
                          key={chunk.id}
                          className="p-3 rounded-xl border border-surface-border bg-surface-subtle text-slate-400"
                        >
                          <span className="text-[11px] text-slate-400 font-bold block mb-1">
                            UNCHANGED SECTION
                          </span>
                          <p className="text-slate-300">{chunk.originalText}</p>
                        </div>
                      );
                    }

                    if (chunk.type === 'removed') {
                      return (
                        <div
                          key={chunk.id}
                          className="diff-deletion p-3 rounded-xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-rose-400">
                            <span>- REMOVED FROM MASTER RESUME</span>
                            {chunk.reason && (
                              <span className="text-slate-400 font-sans italic font-normal">
                                Reason: {chunk.reason}
                              </span>
                            )}
                          </div>
                          <p className="text-rose-200">{chunk.originalText}</p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={chunk.id}
                        className="diff-addition p-3 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                          <span>+ INJECTED TAILORED BULLET POINT</span>
                          {chunk.reason && (
                            <span className="text-slate-300 font-sans italic font-normal">
                              Why: {chunk.reason}
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-200 font-medium">{chunk.tailoredText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Cover letter tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Custom AI Generated Cover Letter
                </span>
                <button
                  onClick={handleCopyCoverLetter}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-surface-border bg-surface-light text-slate-300 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-xl border border-surface-border bg-surface-subtle font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {diff.generatedCoverLetter}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border bg-surface-subtle/90">
          <div className="text-xs text-slate-400">
            Approved diff will update ATS payload and move requisition to{' '}
            <span className="text-cyan-400 font-medium">Applied</span> stage.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedJobForDiff(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-surface-light transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleApproveAndApply}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Dispatching Payload...' : 'Approve & Dispatch Application'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
