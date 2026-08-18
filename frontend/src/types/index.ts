/**
 * Shared TypeScript types for the SiraHub frontend.
 * Extended per phase as domain types are introduced.
 */

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

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Minimal user shape (expanded in Phase 3) */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}
