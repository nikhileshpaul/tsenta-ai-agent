import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AgentStatus,
  JobApplicationStage,
  MasterProfile,
  JobPosting,
  Application,
  TailoredDiff,
  AgentLog,
  AgentSettingsConfig,
  User,
} from '@/types';
import {
  initialUser,
  initialMasterProfile,
  initialJobs,
  initialApplications,
  initialTailoredDiffs,
  initialAgentLogs,
  initialSettings,
} from '@/mock/initial-data';

interface AgentState {
  user: User;
  profile: MasterProfile;
  jobs: JobPosting[];
  applications: Application[];
  tailoredDiffs: Record<string, TailoredDiff>;
  agentLogs: AgentLog[];
  agentStatus: AgentStatus;
  settings: AgentSettingsConfig;
  isCycleRunning: boolean;
  selectedJobForDiff: TailoredDiff | null;
  selectedApplication: Application | null;

  // Actions
  setAgentStatus: (status: AgentStatus) => void;
  toggleAutonomousMode: () => void;
  runAgentCycle: () => Promise<void>;
  updateApplicationStage: (appId: string, newStage: JobApplicationStage) => void;
  updateApplicationNotes: (appId: string, notes: string) => void;
  tailorJob: (jobId: string) => void;
  applyForJob: (jobId: string) => void;
  updateProfile: (profile: Partial<MasterProfile>) => void;
  updateSettings: (settings: Partial<AgentSettingsConfig>) => void;
  addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setSelectedJobForDiff: (diff: TailoredDiff | null) => void;
  setSelectedApplication: (app: Application | null) => void;
  resetToDefaults: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      profile: initialMasterProfile,
      jobs: initialJobs,
      applications: initialApplications,
      tailoredDiffs: initialTailoredDiffs,
      agentLogs: initialAgentLogs,
      agentStatus: 'idle',
      settings: initialSettings,
      isCycleRunning: false,
      selectedJobForDiff: null,
      selectedApplication: null,

      setAgentStatus: (status) => set({ agentStatus: status }),

      toggleAutonomousMode: () => {
        const current = get().settings.autonomousMode;
        const newStatus: AgentStatus = !current ? 'idle' : 'paused';
        set((state) => ({
          settings: { ...state.settings, autonomousMode: !current },
          agentStatus: newStatus,
        }));
        get().addLog({
          level: !current ? 'info' : 'warning',
          message: !current
            ? 'Autonomous agent scheduler enabled. Monitoring active boards.'
            : 'Autonomous mode paused by operator.',
        });
      },

      addLog: ({ level, message, jobId, actionType }) => {
        const now = new Date();
        const timestamp = now.toTimeString().split(' ')[0];
        const newLog: AgentLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp,
          level,
          message,
          jobId,
          actionType,
        };
        set((state) => ({
          agentLogs: [newLog, ...state.agentLogs].slice(0, 100), // retain last 100 logs
        }));
      },

      runAgentCycle: async () => {
        if (get().isCycleRunning) return;
        set({ isCycleRunning: true, agentStatus: 'scanning' });

        get().addLog({
          level: 'info',
          message: 'Initiating real-time autonomous scan cycle across partner feeds...',
          actionType: 'scan',
        });

        // Step 1: Scan
        await new Promise((res) => setTimeout(res, 800));

        // Find an unapplied job meeting the threshold
        const state = get();
        const threshold = state.settings.matchThreshold;
        const candidateJob = state.jobs.find(
          (j) => j.status !== 'applied' && j.matchScore >= threshold
        ) || state.jobs[0];

        if (!candidateJob) {
          get().addLog({
            level: 'warning',
            message: 'Scan cycle complete: No pending job postings found meeting current threshold.',
            actionType: 'scan',
          });
          set({ isCycleRunning: false, agentStatus: 'idle' });
          return;
        }

        get().addLog({
          level: 'success',
          message: `Target detected: "${candidateJob.title} @ ${candidateJob.company}" (${candidateJob.matchScore}% Match).`,
          jobId: candidateJob.id,
          actionType: 'match',
        });

        // Step 2: Tailor
        set({ agentStatus: 'tailoring' });
        await new Promise((res) => setTimeout(res, 1200));

        const diffId = `diff-${candidateJob.id}`;
        let existingDiff = state.tailoredDiffs[diffId];
        if (!existingDiff) {
          existingDiff = {
            id: diffId,
            jobId: candidateJob.id,
            jobTitle: candidateJob.title,
            company: candidateJob.company,
            atsScoreBefore: Math.max(65, candidateJob.matchScore - 18),
            atsScoreAfter: Math.min(99, candidateJob.matchScore + 4),
            summaryBefore: state.profile.summary.slice(0, 180) + '...',
            summaryAfter: `Specialized ${candidateJob.title} with proven expertise in ${candidateJob.requiredSkills.slice(0, 3).join(', ')}. Engineered distributed systems handling millions of daily operations.`,
            diffChunks: [
              {
                id: `dc-${Date.now()}-1`,
                type: 'removed',
                originalText: `- Managed cloud infrastructure and microservice APIs.`,
                reason: `Under-specified tech alignment for ${candidateJob.company}`,
              },
              {
                id: `dc-${Date.now()}-2`,
                type: 'added',
                tailoredText: `+ Architected high-concurrency systems incorporating ${candidateJob.requiredSkills.slice(0, 2).join(' & ')} to enhance system fault tolerance by 40%.`,
                reason: `Injected required ATS keywords for ${candidateJob.title}`,
              },
            ],
            keywordsAdded: candidateJob.requiredSkills.slice(0, 4),
            toneAdjustment: `Aligned with ${state.settings.aiTone} tone and company tech stack`,
            generatedCoverLetter: `Dear Hiring Team at ${candidateJob.company},\n\nI am thrilled to submit my candidacy for the ${candidateJob.title} position. With over a decade architecting high-scale distributed systems and deep experience in ${candidateJob.requiredSkills.join(', ')}, I am excited by the opportunity to make an immediate impact.\n\nWarm regards,\n${state.profile.name}`,
            createdAt: new Date().toISOString(),
          };
        }

        set((s) => ({
          tailoredDiffs: { ...s.tailoredDiffs, [diffId]: existingDiff },
        }));

        get().addLog({
          level: 'info',
          message: `AI resume tailoring complete: ATS score boosted to ${existingDiff.atsScoreAfter}% (+${existingDiff.atsScoreAfter - existingDiff.atsScoreBefore}% gain).`,
          jobId: candidateJob.id,
          actionType: 'tailor',
        });

        // Step 3: Apply
        set({ agentStatus: 'applying' });
        await new Promise((res) => setTimeout(res, 1000));

        const newApp: Application = {
          id: `app-${Date.now()}`,
          jobId: candidateJob.id,
          jobTitle: candidateJob.title,
          company: candidateJob.company,
          companyLogo: candidateJob.companyLogo,
          location: candidateJob.location,
          salaryRange: candidateJob.salaryRange,
          stage: 'applied',
          appliedDate: new Date().toISOString().split('T')[0],
          matchScore: candidateJob.matchScore,
          tailoredDiffId: diffId,
          notes: `Automated submission generated via Tsenta AI agent (Model: ${state.settings.aiModel}).`,
          timeline: [
            {
              stage: 'discovered',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: 'Identified via autonomous scan',
            },
            {
              stage: 'tailoring',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: 'Tailored resume generated with redline diff',
            },
            {
              stage: 'applied',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: 'Dispatched application payload to job portal',
            },
          ],
        };

        // Update Job and Application state
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === candidateJob.id ? { ...j, status: 'applied' } : j)),
          applications: [newApp, ...s.applications.filter((a) => a.jobId !== candidateJob.id)],
          isCycleRunning: false,
          agentStatus: s.settings.autonomousMode ? 'idle' : 'paused',
        }));

        get().addLog({
          level: 'success',
          message: `Application dispatched successfully to ${candidateJob.company} portal. Pipeline updated.`,
          jobId: candidateJob.id,
          actionType: 'apply',
        });
      },

      updateApplicationStage: (appId, newStage) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return;

        const updatedTimeline = [
          ...app.timeline,
          {
            stage: newStage,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            note: `Stage manually moved to ${newStage.toUpperCase()}`,
          },
        ];

        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === appId ? { ...a, stage: newStage, timeline: updatedTimeline } : a
          ),
        }));

        get().addLog({
          level: 'info',
          message: `Application for "${app.jobTitle} @ ${app.company}" moved to [${newStage.toUpperCase()}].`,
        });
      },

      updateApplicationNotes: (appId, notes) => {
        set((state) => ({
          applications: state.applications.map((a) => (a.id === appId ? { ...a, notes } : a)),
        }));
      },

      tailorJob: (jobId) => {
        const state = get();
        const job = state.jobs.find((j) => j.id === jobId);
        if (!job) return;

        const diffId = `diff-${job.id}`;
        let diff = state.tailoredDiffs[diffId];
        if (!diff) {
          diff = {
            id: diffId,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            atsScoreBefore: Math.max(65, job.matchScore - 16),
            atsScoreAfter: Math.min(99, job.matchScore + 5),
            summaryBefore: state.profile.summary.slice(0, 180) + '...',
            summaryAfter: `Specialized ${job.title} with proven track record in ${job.requiredSkills.slice(0, 3).join(', ')}. Engineered distributed architectures handling millions of daily operations.`,
            diffChunks: [
              {
                id: `dc-${Date.now()}-1`,
                type: 'removed',
                originalText: `- Developed web applications and backend services.`,
                reason: `Lacks quantified impact metrics and targeted keywords for ${job.company}`,
              },
              {
                id: `dc-${Date.now()}-2`,
                type: 'added',
                tailoredText: `+ Architected resilient services utilizing ${job.requiredSkills.slice(0, 2).join(' & ')}, improving system response by 35%.`,
                reason: `Injected required ATS keywords for ${job.title}`,
              },
            ],
            keywordsAdded: job.requiredSkills.slice(0, 4),
            toneAdjustment: `Optimized for ${job.company} culture and requirements`,
            generatedCoverLetter: `Dear ${job.company} Hiring Committee,\n\nI am writing to apply for the ${job.title} role. With over 10 years of systems engineering experience, my background aligns closely with your team's mission.\n\nBest regards,\n${state.profile.name}`,
            createdAt: new Date().toISOString(),
          };

          set((s) => ({
            tailoredDiffs: { ...s.tailoredDiffs, [diffId]: diff },
          }));
        }

        set({ selectedJobForDiff: diff });
      },

      applyForJob: (jobId) => {
        const state = get();
        const job = state.jobs.find((j) => j.id === jobId);
        if (!job) return;

        const diffId = `diff-${job.id}`;
        const newApp: Application = {
          id: `app-${Date.now()}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          companyLogo: job.companyLogo,
          location: job.location,
          salaryRange: job.salaryRange,
          stage: 'applied',
          appliedDate: new Date().toISOString().split('T')[0],
          matchScore: job.matchScore,
          tailoredDiffId: diffId,
          notes: 'Manually triggered tailored application via Tsenta console.',
          timeline: [
            {
              stage: 'discovered',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: 'Discovered in jobs feed',
            },
            {
              stage: 'applied',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: 'Application dispatched with tailored resume',
            },
          ],
        };

        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status: 'applied' } : j)),
          applications: [newApp, ...s.applications.filter((a) => a.jobId !== jobId)],
        }));

        get().addLog({
          level: 'success',
          message: `Application submitted for "${job.title} @ ${job.company}". Added to active pipeline.`,
          jobId: job.id,
          actionType: 'apply',
        });
      },

      updateProfile: (newProfile) => {
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        }));
        get().addLog({
          level: 'info',
          message: 'Candidate master profile & skills matrix updated.',
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        get().addLog({
          level: 'info',
          message: 'Agent orchestration settings updated.',
        });
      },

      clearLogs: () => set({ agentLogs: [] }),
      setSelectedJobForDiff: (diff) => set({ selectedJobForDiff: diff }),
      setSelectedApplication: (app) => set({ selectedApplication: app }),

      resetToDefaults: () => {
        set({
          user: initialUser,
          profile: initialMasterProfile,
          jobs: initialJobs,
          applications: initialApplications,
          tailoredDiffs: initialTailoredDiffs,
          agentLogs: initialAgentLogs,
          settings: initialSettings,
          agentStatus: 'idle',
          isCycleRunning: false,
          selectedJobForDiff: null,
          selectedApplication: null,
        });
        get().addLog({
          level: 'warning',
          message: 'System reset: All state and applications restored to default seeds.',
        });
      },
    }),
    {
      name: 'tsenta-ai-agent-v1',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        jobs: state.jobs,
        applications: state.applications,
        tailoredDiffs: state.tailoredDiffs,
        agentLogs: state.agentLogs,
        settings: state.settings,
      }),
    }
  )
);
