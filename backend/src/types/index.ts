/**
 * Shared TypeScript types and interfaces for the SiraHub backend.
 *
 * These types mirror the Mongoose schema designs defined in
 * docs/architecture/DATABASE_DESIGN.md and are used across
 * controllers, services, middleware, and validators.
 *
 * Models (Mongoose schemas) are implemented in Phase 2.
 * Validators (Zod schemas) are implemented in Phase 3+.
 */

import { Types } from 'mongoose';

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

// ─── Sub-document Interfaces ─────────────────────────────────────────────────

export interface IExperienceEntry {
  _id?: Types.ObjectId;
  company: string;
  title: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface IEducationEntry {
  _id?: Types.ObjectId;
  institution: string;
  degree: string;
  field?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

export interface ILanguageEntry {
  language: string;
  proficiency: LanguageProficiency;
}

export interface ICertificateEntry {
  _id?: Types.ObjectId;
  name: string;
  issuer: string;
  issueDate?: Date;
  expiryDate?: Date;
  fileUrl?: string;
  publicId?: string;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface IJobSeekerProfile {
  headline?: string;
  cvUrl?: string;
  cvPublicId?: string;
  portfolioUrl?: string;
  experience: IExperienceEntry[];
  education: IEducationEntry[];
  skills: Types.ObjectId[];
  languages: ILanguageEntry[];
  certificates: ICertificateEntry[];
  socialLinks: ISocialLinks;
}

export interface ILocation {
  city: string;
  region?: string;
  country: string;
  address?: string;
}

export interface ISalary {
  min?: number;
  max?: number;
  currency: string;
  period: SalaryPeriod;
  isNegotiable: boolean;
  isHidden: boolean;
}

export interface IInterview {
  scheduledAt?: Date;
  format?: InterviewFormat;
  location?: string;
  meetingUrl?: string;
  notes?: string;
}

export interface IStatusHistoryEntry {
  status: ApplicationStatus;
  changedBy: Types.ObjectId;
  changedAt: Date;
  note?: string;
}

export interface IAttachment {
  name: string;
  url: string;
  publicId?: string;
  mimeType?: string;
  size?: number;
}

// ─── Document Interfaces (used in service return types) ──────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;        // select: false in schema
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  jobSeekerProfile?: IJobSeekerProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompany {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  logoPublicId?: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  industry: string;
  size: CompanySize;
  founded?: number;
  location: ILocation;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJob {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  postedBy: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: Types.ObjectId;
  skills: Types.ObjectId[];
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  location: ILocation & { isRemote: boolean };
  salary: ISalary;
  deadline: Date;
  status: JobStatus;
  isFeatured: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  company: Types.ObjectId;
  cvUrl: string;
  coverLetter?: string;
  portfolioUrl?: string;
  additionalDocs: IAttachment[];
  status: ApplicationStatus;
  statusHistory: IStatusHistoryEntry[];
  interview?: IInterview;
  isWithdrawn: boolean;
  withdrawnAt?: Date;
  employerNote?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedJob {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  job: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  author: Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: string;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  jobContext?: Types.ObjectId;
  applicationContext?: Types.ObjectId;
  body?: string;
  attachments: IAttachment[];
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API / Utility Types ─────────────────────────────────────────────────────

/** Standard API response wrapper returned by sendSuccess() */
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

/** Job search/filter query parameters */
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
}

/**
 * Application status transition rules.
 * Each key lists the statuses it can transition TO.
 */
export const APPLICATION_STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  applied:     ['reviewing', 'rejected'],
  reviewing:   ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview:   ['accepted', 'rejected'],
  accepted:    [],
  rejected:    [],
};
