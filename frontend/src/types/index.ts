/**
 * Shared TypeScript types and interfaces for the SiraHub frontend.
 *
 * These types mirror the backend domain types and API response shapes
 * defined in docs/architecture/DATABASE_DESIGN.md and
 * docs/architecture/API_SPECIFICATION.md.
 *
 * Types are progressively expanded in each phase as new features are built.
 */

// ─── Core Enums ──────────────────────────────────────────────────────────────

export type UserRole = 'jobseeker' | 'employer' | 'admin';

export type ApplicationStatus =
  | 'applied'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'accepted'
  | 'rejected';

export type JobStatus = 'draft' | 'active' | 'paused' | 'closed';

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'remote'
  | 'freelance';

export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'executive';

export type EducationLevel =
  | 'none'
  | 'high-school'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'phd';

export type SalaryPeriod = 'hourly' | 'daily' | 'monthly' | 'yearly';

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

export type NotificationType =
  | 'new_job'
  | 'application_status'
  | 'interview_invite'
  | 'message'
  | 'system';

export type LanguageProficiency =
  | 'beginner'
  | 'conversational'
  | 'professional'
  | 'native';

export type InterviewFormat = 'in-person' | 'video' | 'phone';

// ─── Standard API Response Envelope ─────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Location & Salary ───────────────────────────────────────────────────────

export interface Location {
  city: string;
  region?: string;
  country: string;
  address?: string;
  isRemote?: boolean;
}

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
  period: SalaryPeriod;
  isNegotiable: boolean;
  isHidden: boolean;
}

// ─── User & Profile ──────────────────────────────────────────────────────────

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface ExperienceEntry {
  _id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface EducationEntry {
  _id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: LanguageProficiency;
}

export interface CertificateEntry {
  _id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
}

export interface JobSeekerProfile {
  headline?: string;
  cvUrl?: string;
  portfolioUrl?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: Skill[];
  languages: LanguageEntry[];
  certificates: CertificateEntry[];
  socialLinks: SocialLinks;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  jobSeekerProfile?: JobSeekerProfile;
  createdAt: string;
  updatedAt: string;
}

// ─── Company ─────────────────────────────────────────────────────────────────

export interface Company {
  _id: string;
  owner: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  industry: string;
  size: CompanySize;
  founded?: number;
  location: Location;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Computed fields — may be included in API responses */
  jobCount?: number;
  averageRating?: number;
}

// ─── Category & Skill ─────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount: number;
  isActive: boolean;
}

export interface Skill {
  _id: string;
  name: string;
  slug: string;
  category?: string | Category;
  isActive: boolean;
}

// ─── Job ─────────────────────────────────────────────────────────────────────

export interface Job {
  _id: string;
  company: string | Company;
  postedBy: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string | Category;
  skills: string[] | Skill[];
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  location: Location;
  salary: Salary;
  deadline: string;
  status: JobStatus;
  isFeatured: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  /** Computed — true if current user has saved this job */
  isSaved?: boolean;
  /** Computed — true if current user has applied */
  hasApplied?: boolean;
}

export interface JobFilters {
  q?: string;
  category?: string;
  location?: string;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  company?: string;
  skills?: string[];
  status?: JobStatus;
  sort?: 'latest' | 'salary' | 'deadline' | 'popular';
  page?: number;
  limit?: number;
}

// ─── Application ─────────────────────────────────────────────────────────────

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  note?: string;
}

export interface InterviewDetails {
  scheduledAt?: string;
  format?: InterviewFormat;
  location?: string;
  meetingUrl?: string;
  notes?: string;
}

export interface Attachment {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
}

export interface Application {
  _id: string;
  job: string | Job;
  applicant: string | User;
  company: string | Company;
  cvUrl: string;
  coverLetter?: string;
  portfolioUrl?: string;
  additionalDocs: Attachment[];
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  interview?: InterviewDetails;
  isWithdrawn: boolean;
  withdrawnAt?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── SavedJob ─────────────────────────────────────────────────────────────────

export interface SavedJob {
  _id: string;
  user: string;
  job: string | Job;
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  _id: string;
  conversationId: string;
  sender: string | User;
  recipient: string | User;
  jobContext?: string | Job;
  body?: string;
  attachments: Attachment[];
  isRead: boolean;
  readAt?: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Conversation {
  conversationId: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
  jobContext?: Job;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  company: string | Company;
  author: string | User;
  rating: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  totalApplications: number;
  activeJobs: number;
  newUsersThisWeek: number;
}

export interface AnalyticsDataPoint {
  date: string;
  count: number;
}

export interface AdminAnalytics {
  userGrowth: AnalyticsDataPoint[];
  jobGrowth: AnalyticsDataPoint[];
  applicationsByStatus: Record<ApplicationStatus, number>;
  topCategories: { name: string; count: number }[];
  topCompanies: { name: string; applications: number }[];
  hiringRate: number;
}

// ─── Redux State Shapes ───────────────────────────────────────────────────────

/** Auth slice state (Phase 3) */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Jobs slice state (Phase 4) */
export interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  filters: JobFilters;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

/** Applications slice state (Phase 6) */
export interface ApplicationsState {
  applications: Application[];
  currentApplication: Application | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

/** Notifications slice state (Phase 8) */
export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}
