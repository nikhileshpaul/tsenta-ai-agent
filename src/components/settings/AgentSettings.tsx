'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import {
  Sliders,
  ShieldAlert,
  Bot,
  Zap,
  RotateCcw,
  Save,
  CheckCircle,
  Plus,
  X,
} from 'lucide-react';

export function AgentSettings() {
  const { settings, updateSettings, resetToDefaults } = useAgentStore();
  const [newCompany, setNewCompany] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleAddCompany = () => {
    if (!newCompany.trim()) return;
    if (!settings.blacklistedCompanies.includes(newCompany.trim())) {
      updateSettings({
        blacklistedCompanies: [...settings.blacklistedCompanies, newCompany.trim()],
      });
    }
    setNewCompany('');
  };

  const handleRemoveCompany = (company: string) => {
    updateSettings({
      blacklistedCompanies: settings.blacklistedCompanies.filter((c) => c !== company),
    });
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (!settings.blacklistedKeywords.includes(newKeyword.trim())) {
      updateSettings({
        blacklistedKeywords: [...settings.blacklistedKeywords, newKeyword.trim()],
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    updateSettings({
      blacklistedKeywords: settings.blacklistedKeywords.filter((k) => k !== kw),
    });
  };

  return (
    <div className="space-y-8">
      {/* Autonomous Dispatch Parameters */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Autonomous Dispatch Parameters
              </h3>
              <p className="text-xs text-slate-400">
                Configure auto-pilot constraints, rate limits, and qualification thresholds.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSaveAlert(true);
              setTimeout(() => setSaveAlert(false), 2000);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveAlert ? 'Saved!' : 'Save Config'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">
                Minimum Match Score Threshold
              </label>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {settings.matchThreshold}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only auto-tailor and dispatch applications when semantic fit exceeds this percentage.
            </p>
            <input
              type="range"
              min="65"
              max="98"
              value={settings.matchThreshold}
              onChange={(e) => updateSettings({ matchThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-surface-lighter rounded-lg"
            />
          </div>

          {/* Daily limit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">
                Daily Application Quota
              </label>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {settings.maxDailyApplications} applications
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Maximum submissions per 24 hours to prevent ATS spam flags.
            </p>
            <input
              type="range"
              min="1"
              max="30"
              value={settings.maxDailyApplications}
              onChange={(e) => updateSettings({ maxDailyApplications: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-surface-lighter rounded-lg"
            />
          </div>
        </div>

        {/* Dry Run Toggle */}
        <div className="pt-4 border-t border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Dry Run Simulation Mode</span>
            <span className="text-[11px] text-slate-400">
              When enabled, agent computes redline diffs and logs actions without dispatching external HTTP submissions.
            </span>
          </div>
          <button
            onClick={() => updateSettings({ dryRunMode: !settings.dryRunMode })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              settings.dryRunMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-surface-light border-slate-700 text-slate-400'
            }`}
          >
            {settings.dryRunMode ? 'DRY-RUN ON' : 'DRY-RUN OFF'}
          </button>
        </div>
      </div>

      {/* AI Synthesis Engine Models & Tone */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            AI Synthesis & Prompt Directives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Active LLM Tailoring Engine
            </label>
            <select
              value={settings.aiModel}
              onChange={(e) => updateSettings({ aiModel: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="Gemini 1.5 Pro / Claude 3.5 Sonnet (Tailoring Engine v4)">
                Gemini 1.5 Pro / Claude 3.5 Sonnet (Hybrid Redline Engine v4)
              </option>
              <option value="GPT-4o Enterprise Agentic Runner">
                GPT-4o Enterprise Agentic Runner
              </option>
              <option value="DeepSeek R1 High-Reasoning Tailoring Core">
                DeepSeek R1 High-Reasoning Tailoring Core
              </option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Resume Persona Tone
            </label>
            <select
              value={settings.aiTone}
              onChange={(e) => updateSettings({ aiTone: e.target.value as any })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden capitalize cursor-pointer"
            >
              <option value="technical">Technical (Quantified Metrics, Scale, Primitives)</option>
              <option value="executive">Executive (Leadership, Revenue, Strategy)</option>
              <option value="assertive">Assertive (High Velocity, Impact Obsession)</option>
              <option value="balanced">Balanced (Holistic Staff Engineer Persona)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blacklists & Filters */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Exclusion Matrices & Blacklists
            </h3>
            <p className="text-xs text-slate-400">
              Prevent agent from scanning or applying to unwanted companies or roles.
            </p>
          </div>
        </div>

        {/* Company Blacklist */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Excluded Organizations ({settings.blacklistedCompanies.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {settings.blacklistedCompanies.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompany(c)}
                  className="text-rose-400 hover:text-rose-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add company to blacklist..."
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
              className="flex-1 bg-surface-subtle border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden"
            />
            <button
              onClick={handleAddCompany}
              className="px-3 py-1.5 rounded-xl bg-surface-light border border-surface-border text-xs text-slate-300 hover:text-white"
            >
              Add
            </button>
          </div>
        </div>

        {/* Keyword Blacklist */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-300 block">
            Excluded Title Keywords ({settings.blacklistedKeywords.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {settings.blacklistedKeywords.map((k) => (
              <span
                key={k}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono"
              >
                <span>{k}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(k)}
                  className="text-rose-400 hover:text-rose-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add keyword (e.g. Crypto, Intern)..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="flex-1 bg-surface-subtle border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden"
            />
            <button
              onClick={handleAddKeyword}
              className="px-3 py-1.5 rounded-xl bg-surface-light border border-surface-border text-xs text-slate-300 hover:text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-400">System Reset to Factory Mock Data</h4>
          <p className="text-xs text-slate-400">
            Clears browser storage and restores the default 15 jobs, 10 applications, and telemetry logs.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data to default seeds?')) {
              resetToDefaults();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Mock State</span>
        </button>
      </div>
    </div>
  );
}
