'use client';

import React from 'react';
import { AgentSettings } from '@/components/settings/AgentSettings';
import { DockerHealthCard } from '@/components/settings/DockerHealthCard';
import { Sliders } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-cyan-400" /> Agent Orchestration & System Diagnostics
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Tune autonomous thresholds, manage exclusion blacklists, and monitor Docker container health.
        </p>
      </div>

      {/* Docker Standalone Container Health */}
      <DockerHealthCard />

      {/* Orchestration Settings */}
      <AgentSettings />
    </div>
  );
}
