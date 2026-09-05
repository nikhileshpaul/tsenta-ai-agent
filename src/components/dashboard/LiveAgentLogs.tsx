'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Terminal, Trash2, CheckCircle, AlertTriangle, Info, XCircle, Copy, Check } from 'lucide-react';

export function LiveAgentLogs() {
  const { agentLogs, clearLogs } = useAgentStore();
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [copied, setCopied] = useState(false);

  const filteredLogs = agentLogs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const handleCopy = () => {
    const text = agentLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'error':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'info':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface flex flex-col h-[400px] shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border bg-surface-subtle/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Autonomous Agent Telemetry Stream
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Filter buttons & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-light rounded-lg p-0.5 border border-surface-border text-[11px]">
            {(['all', 'info', 'success', 'warning'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2 py-0.5 rounded-md capitalize font-medium transition-all ${
                  filter === lvl
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-surface-border bg-surface text-slate-400 hover:text-slate-200 hover:bg-surface-light transition-colors"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={clearLogs}
            className="p-1.5 rounded-lg border border-surface-border bg-surface text-slate-400 hover:text-rose-400 hover:bg-surface-light transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-[#080b11]">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No telemetry records for this filter level.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 py-1 px-2 rounded-lg hover:bg-surface-subtle/50 transition-colors"
            >
              <span className="text-slate-400 text-[11px] shrink-0 pt-0.5 select-none font-mono">
                [{log.timestamp}]
              </span>
              <span
                className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold shrink-0 select-none ${getLogBadge(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <span className="text-slate-300 leading-relaxed break-words flex-1">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Status footer */}
      <div className="px-4 py-2 border-t border-surface-border bg-surface-subtle/40 flex items-center justify-between text-[11px] text-slate-400">
        <span>Log buffer: {agentLogs.length} events</span>
        <span className="text-cyan-400/80 font-mono">Socket: ws://localhost:3000/agent/stream (mocked)</span>
      </div>
    </div>
  );
}
