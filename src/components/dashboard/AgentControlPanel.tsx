'use client';

import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import {
  Cpu,
  Zap,
  Play,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function AgentControlPanel() {
  const {
    settings,
    agentStatus,
    isCycleRunning,
    toggleAutonomousMode,
    runAgentCycle,
    updateSettings,
    addLog,
  } = useAgentStore();

  const handleScrapeSimulation = () => {
    addLog({
      level: 'info',
      message: 'Scraper triggered: Polling 14 tech ATS sources (Greenhouse, Lever, Ashby, Workday)...',
      actionType: 'scan',
    });
    setTimeout(() => {
      addLog({
        level: 'success',
        message: 'Scraper finished: 15 active high-priority requisitions cached in local store.',
        actionType: 'scan',
      });
    }, 700);
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-border">
        {/* Left: Agent Title & Autonomous Switch */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Agent Orchestration Matrix
                <span className="text-xs font-mono font-normal text-slate-400">
                  [Daemon: tsenta-worker-01]
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Self-directing pipeline that continuously queries target boards, generates tailored resumes, and submits applications.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Mode Switch & Run Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAutonomousMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              settings.autonomousMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-surface-light border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                settings.autonomousMode ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            {settings.autonomousMode ? 'Autonomous Auto-Pilot ACTIVE' : 'Autonomous Mode PAUSED'}
          </button>

          <button
            onClick={() => runAgentCycle()}
            disabled={isCycleRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isCycleRunning ? 'animate-spin' : ''}`} />
            {isCycleRunning ? 'Cycle Executing...' : 'Execute Cycle Now'}
          </button>
        </div>
      </div>

      {/* Control sliders & tuning parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Threshold Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Min. ATS Match Threshold
            </span>
            <span className="font-mono font-bold text-cyan-400 text-sm">
              {settings.matchThreshold}%
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            step="1"
            value={settings.matchThreshold}
            onChange={(e) => updateSettings({ matchThreshold: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-surface-lighter rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Aggressive (60%)</span>
            <span>Balanced (80%)</span>
            <span>Strict (95%)</span>
          </div>
        </div>

        {/* Max Daily Apps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-400" /> Daily Dispatch Limit
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {settings.maxDailyApplications} apps/day
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={settings.maxDailyApplications}
            onChange={(e) => updateSettings({ maxDailyApplications: Number(e.target.value) })}
            className="w-full accent-brand-500 cursor-pointer h-1.5 bg-surface-lighter rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Low (3)</span>
            <span>Recommended (12)</span>
            <span>Max (30)</span>
          </div>
        </div>

        {/* AI Tone & Quick Tools */}
        <div className="space-y-2">
          <span className="text-slate-400 text-xs font-medium block">
            AI Resume Tone Alignment
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {(['technical', 'executive', 'assertive', 'balanced'] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => updateSettings({ aiTone: tone })}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium capitalize border transition-all cursor-pointer ${
                  settings.aiTone === tone
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                    : 'bg-surface-light border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleScrapeSimulation}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" /> Re-trigger Scrape Feed
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              Model: {settings.aiModel.split('/')[0].trim()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
