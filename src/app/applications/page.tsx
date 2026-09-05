'use client';

import React from 'react';
import { ApplicationsView } from '@/components/applications/ApplicationsView';
import { Columns3, Sparkles } from 'lucide-react';

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Columns3 className="w-6 h-6 text-cyan-400" /> Autonomous Application Tracker
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Monitor your career pipeline across all stages from auto-discovery to executed offers.
        </p>
      </div>

      <ApplicationsView />
    </div>
  );
}
