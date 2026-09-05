'use client';

import React, { useState, useMemo } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { JobPosting } from '@/types';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  RotateCw,
} from 'lucide-react';

export function JobsFeed() {
  const { jobs } = useAgentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState<'all' | 'remote' | 'hybrid' | 'onsite'>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inspectingJob, setInspectingJob] = useState<JobPosting | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesWorkplace =
          workplaceFilter === 'all' || job.workplaceType === workplaceFilter;

        const matchesScore = job.matchScore >= minMatchScore;

        return matchesSearch && matchesWorkplace && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore;
        if (sortBy === 'salary') return b.maxSalary - a.maxSalary;
        return 0; // default order
      });
  }, [jobs, searchTerm, workplaceFilter, minMatchScore, sortBy]);

  return (
    <div className="space-y-6">
      {/* Control Bar: Search & Filters */}
      <div className="rounded-2xl border border-surface-border bg-surface p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company (e.g. Stripe, Linear), or skill (Go, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* View toggle & counts */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs text-slate-400 font-mono">
              Showing <span className="text-white font-bold">{filteredJobs.length}</span> of {jobs.length} jobs
            </span>

            <div className="flex items-center bg-surface-light rounded-xl p-1 border border-surface-border text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Compact layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-border text-xs">
          {/* Workplace Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Workplace:</span>
            {(['all', 'remote', 'hybrid', 'onsite'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setWorkplaceFilter(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-all font-medium ${
                  workplaceFilter === mode
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'bg-surface-subtle text-slate-400 border border-surface-border hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Min Match Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Min Match:</span>
            {[0, 85, 90, 95].map((score) => (
              <button
                key={score}
                onClick={() => setMinMatchScore(score)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all font-medium ${
                  minMatchScore === score
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-surface-subtle text-slate-400 border border-surface-border hover:text-slate-200'
                }`}
              >
                {score === 0 ? 'All' : `≥ ${score}%`}
              </button>
            ))}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface-subtle border border-surface-border rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="match">Highest ATS Fit</option>
              <option value="salary">Top Base Compensation</option>
              <option value="recent">Recently Scraped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">No requisitions match your criteria</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, lowering the minimum match threshold, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setWorkplaceFilter('all');
              setMinMatchScore(0);
            }}
            className="px-4 py-2 rounded-xl text-xs bg-surface-light border border-surface-border text-slate-200 hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDetails={(selected) => setInspectingJob(selected)}
            />
          ))}
        </div>
      )}

      {/* Inspect Detail Modal */}
      <JobDetailModal
        job={inspectingJob}
        onClose={() => setInspectingJob(null)}
      />
    </div>
  );
}
