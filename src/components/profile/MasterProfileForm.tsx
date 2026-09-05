'use client';

import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { MasterProfile } from '@/types';
import { SkillsMatrix } from './SkillsMatrix';
import {
  Save,
  CheckCircle,
  User,
  Briefcase,
  Globe,
  DollarSign,
  Plus,
  Trash2,
} from 'lucide-react';

export function MasterProfileForm() {
  const { profile, updateProfile } = useAgentStore();
  const [formData, setFormData] = useState<MasterProfile>(profile);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleAddHighlight = (expIdx: number) => {
    const updated = [...formData.experiences];
    updated[expIdx].highlights.push('New quantified engineering achievement with metrics.');
    setFormData({ ...formData, experiences: updated });
  };

  const handleRemoveHighlight = (expIdx: number, hlIdx: number) => {
    const updated = [...formData.experiences];
    updated[expIdx].highlights.splice(hlIdx, 1);
    setFormData({ ...formData, experiences: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Candidate Knowledge Graph & Master Profile
          </h2>
          <p className="text-xs text-slate-400">
            The canonical source material referenced by Tsenta AI during resume synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedAlert && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> Profile Updated & Re-indexed
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Master Profile</span>
          </button>
        </div>
      </div>

      {/* Basic Contact Info */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-cyan-400" /> Identity & Contact Credentials
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Primary Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Location & Availability
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Work Authorization Status
            </label>
            <input
              type="text"
              value={formData.workAuthorization}
              onChange={(e) =>
                setFormData({ ...formData, workAuthorization: e.target.value })
              }
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Portfolio / Website
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Executive Headline & Summary */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Professional Headline & Executive Narrative
        </span>

        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Master Headline
          </label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-medium"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Core Career Summary (Redline diff base text)
          </label>
          <textarea
            rows={4}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full bg-surface-subtle border border-surface-border rounded-xl p-3 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 leading-relaxed"
          />
        </div>

        {/* Salary & Remote Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Minimum Target Base Compensation (USD)
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="5000"
                value={formData.minBaseSalary}
                onChange={(e) =>
                  setFormData({ ...formData, minBaseSalary: Number(e.target.value) })
                }
                className="w-full bg-surface-subtle border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Location / Workplace Preference
            </label>
            <select
              value={formData.remotePreference}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remotePreference: e.target.value as any,
                })
              }
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden capitalize cursor-pointer"
            >
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid Acceptable</option>
              <option value="onsite">Onsite</option>
              <option value="any">Any Configuration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <SkillsMatrix
          skills={formData.skills}
          onChange={(updatedSkills) => setFormData({ ...formData, skills: updatedSkills })}
        />
      </div>

      {/* Work Experiences */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Career Experiences & Bullet Achievements
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {formData.experiences.length} positions indexed
          </span>
        </div>

        <div className="space-y-6">
          {formData.experiences.map((exp, expIdx) => (
            <div
              key={exp.id}
              className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">COMPANY</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[expIdx].company = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full bg-surface border border-surface-border rounded-lg px-2.5 py-1.5 text-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">ROLE TITLE</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[expIdx].role = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full bg-surface border border-surface-border rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">TIMEFRAME</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[expIdx].startDate = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-1/2 bg-surface border border-surface-border rounded-lg px-2 py-1.5 text-slate-200 font-mono text-[11px]"
                    />
                    <span className="text-slate-500">-</span>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[expIdx].endDate = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-1/2 bg-surface border border-surface-border rounded-lg px-2 py-1.5 text-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Quantified Accomplishments
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(expIdx)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet Point
                  </button>
                </div>

                <div className="space-y-2">
                  {exp.highlights.map((hl, hlIdx) => (
                    <div key={hlIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs mt-1.5">•</span>
                      <textarea
                        rows={2}
                        value={hl}
                        onChange={(e) => {
                          const updated = [...formData.experiences];
                          updated[expIdx].highlights[hlIdx] = e.target.value;
                          setFormData({ ...formData, experiences: updated });
                        }}
                        className="flex-1 bg-surface border border-surface-border rounded-lg p-2 text-xs text-slate-300 leading-relaxed focus:outline-hidden focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(expIdx, hlIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1 mt-1 transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
