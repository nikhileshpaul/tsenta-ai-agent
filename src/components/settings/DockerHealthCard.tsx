'use client';

import React from 'react';
import { Server, Activity, ShieldCheck, Box, HardDrive, Cpu, Terminal } from 'lucide-react';

export function DockerHealthCard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Container Runtime Architecture
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                HEALTHY
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Next.js 14+ Standalone Multi-Stage Container configuration
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-surface-subtle px-3 py-1 rounded-xl border border-surface-border">
          0.0.0.0:3000
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase">Base Environment</span>
          </div>
          <div className="text-white font-bold">Node 20 Alpine Linux</div>
          <div className="text-[10px] text-slate-500">Non-root user (UID 1001)</div>
        </div>

        <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[10px] uppercase">Standalone Output</span>
          </div>
          <div className="text-white font-bold">server.js Bundled</div>
          <div className="text-[10px] text-slate-500">Zero node_modules bloat</div>
        </div>

        <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase">Healthcheck</span>
          </div>
          <div className="text-white font-bold">Wget Polling :3000</div>
          <div className="text-[10px] text-slate-500">30s Interval / 5s Timeout</div>
        </div>

        <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase">Service Name</span>
          </div>
          <div className="text-white font-bold">tsenta-ai-agent</div>
          <div className="text-[10px] text-slate-500">Docker Compose v2+ ready</div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-surface-border bg-[#080b11] font-mono text-[11px] text-slate-300 space-y-1">
        <div className="text-slate-500 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-cyan-400" /> Production Launch Command:
        </div>
        <div className="text-cyan-300 select-all">
          docker compose up --build -d
        </div>
      </div>
    </div>
  );
}
