export type AgentStatus = 'idle' | 'scanning' | 'tailoring' | 'applying' | 'paused';

export type JobApplicationStage = 
  | 'discovered' 
  | 'tailoring' 
  | 'applied' 
  | 'interviewing' 
  | 'offer' 
  | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | 'Present';
  location: string;
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface MasterProfile {
  name: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  experiences: WorkExperience[];
  skills: SkillGroup[];
  targetRoles: string[];
  minBaseSalary: number;
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  workAuthorization: string;
}

export interface DiffChunk {
  id: string;
  type: 'unchanged' | 'added' | 'removed';
  originalText?: string;
  tailoredText?: string;
  reason?: string;
}

export interface TailoredDiff {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  atsScoreBefore: number;
  atsScoreAfter: number;
  summaryBefore: string;
  summaryAfter: string;
  diffChunks: DiffChunk[];
  keywordsAdded: string[];
  toneAdjustment: string;
  generatedCoverLetter: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  salaryRange: string;
  minSalary: number;
  maxSalary: number;
  postedDate: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  sourceUrl: string;
  status: 'new' | 'reviewed' | 'queued' | 'applied' | 'dismissed';
}

export interface ApplicationTimelineEvent {
  stage: JobApplicationStage;
  timestamp: string;
  note: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salaryRange: string;
  stage: JobApplicationStage;
  appliedDate?: string;
  matchScore: number;
  tailoredDiffId: string;
  interviewRound?: string;
  interviewDate?: string;
  offerAmount?: string;
  notes: string;
  timeline: ApplicationTimelineEvent[];
}

export interface AgentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  jobId?: string;
  actionType?: 'scan' | 'match' | 'tailor' | 'apply' | 'verify';
}

export interface AgentSettingsConfig {
  autonomousMode: boolean;
  matchThreshold: number; // e.g. 85
  maxDailyApplications: number;
  autoApplyIntervalMinutes: number;
  aiModel: string;
  aiTone: 'assertive' | 'balanced' | 'technical' | 'executive';
  blacklistedCompanies: string[];
  blacklistedKeywords: string[];
  dryRunMode: boolean;
}
