'use client';

import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Bot, Play, Pause, RefreshCw } from 'lucide-react';

export function AgentStatusBadge() {
  const { agentStatus, isCycleRunning, settings, toggleAutonomousMode, runAgentCycle } =
    useAgentStore();

  const getStatusDetails = () => {
    switch (agentStatus) {
      case 'scanning':
        return {
          label: 'Scanning Live Requisitions',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400 animate-ping',
          icon: RefreshCw,
          spinning: true,
        };
      case 'tailoring':
        return {
          label: 'Synthesizing Resume Diff',
          color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-400 animate-pulse',
          icon: Bot,
          spinning: false,
        };
      case 'applying':
        return {
          label: 'Dispatching Application',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-ping',
          icon: RefreshCw,
          spinning: true,
        };
      case 'paused':
        return {
          label: 'Autonomous Mode Paused',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: Pause,
          spinning: false,
        };
      case 'idle':
      default:
        return {
          label: settings.autonomousMode ? 'Autonomous Agent Active' : 'Agent Ready',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
          icon: Bot,
          spinning: false,
        };
    }
  };

  const status = getStatusDetails();
  const Icon = status.icon;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${status.color}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dot}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dot}`} />
        </span>
        <Icon className={`w-3.5 h-3.5 ${status.spinning ? 'animate-spin' : ''}`} />
        <span className="tracking-tight">{status.label}</span>
      </div>

      {/* Quick Action: Run Cycle */}
      <button
        onClick={() => runAgentCycle()}
        disabled={isCycleRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white shadow-sm shadow-brand-500/20 transition-all cursor-pointer"
        title="Trigger an autonomous matching, tailoring & submission cycle immediately"
      >
        <Play className={`w-3 h-3 ${isCycleRunning ? 'animate-spin' : ''}`} />
        <span>{isCycleRunning ? 'Cycle In Progress...' : 'Run Cycle Now'}</span>
      </button>

      {/* Autonomous Mode Toggle */}
      <button
        onClick={toggleAutonomousMode}
        className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
          settings.autonomousMode
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            : 'border-slate-700 bg-surface text-slate-400 hover:text-slate-200'
        }`}
        title={settings.autonomousMode ? 'Pause Auto-Pilot' : 'Resume Auto-Pilot'}
      >
        {settings.autonomousMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
