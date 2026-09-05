'use client';

import React, { useState } from 'react';
import { SkillGroup } from '@/types';
import { Plus, X, Tag } from 'lucide-react';

interface SkillsMatrixProps {
  skills: SkillGroup[];
  onChange: (skills: SkillGroup[]) => void;
}

export function SkillsMatrix({ skills, onChange }: SkillsMatrixProps) {
  const [newSkillText, setNewSkillText] = useState<{ [category: string]: string }>({});

  const handleAddSkill = (categoryIndex: number) => {
    const category = skills[categoryIndex].category;
    const text = (newSkillText[category] || '').trim();
    if (!text) return;

    const updated = [...skills];
    if (!updated[categoryIndex].items.includes(text)) {
      updated[categoryIndex].items.push(text);
      onChange(updated);
    }
    setNewSkillText({ ...newSkillText, [category]: '' });
  };

  const handleRemoveSkill = (categoryIndex: number, skillToRemove: string) => {
    const updated = [...skills];
    updated[categoryIndex].items = updated[categoryIndex].items.filter(
      (s) => s !== skillToRemove
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-cyan-400" /> ATS Indexed Skills Taxonomy
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Used by semantic analyzer to calculate match scores
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((group, groupIdx) => (
          <div
            key={group.category}
            className="rounded-xl border border-surface-border bg-surface-subtle p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-200">{group.category}</h5>
              <span className="text-[10px] font-mono text-slate-500">
                {group.items.length} skills
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-surface border border-slate-700 text-slate-300 font-mono hover:border-slate-500 transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(groupIdx, skill)}
                    className="text-slate-500 hover:text-rose-400 ml-0.5 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder={`Add ${group.category} skill...`}
                value={newSkillText[group.category] || ''}
                onChange={(e) =>
                  setNewSkillText({
                    ...newSkillText,
                    [group.category]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(groupIdx);
                  }
                }}
                className="flex-1 bg-surface border border-surface-border rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(groupIdx)}
                className="p-1 rounded-lg bg-surface-light border border-surface-border text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
