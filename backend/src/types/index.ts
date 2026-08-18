/**
 * Shared TypeScript types and interfaces for the SiraHub backend.
 * Extended in each phase as new domain types are introduced.
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

export type NotificationType =
  | 'new_job'
  | 'application_status'
  | 'interview_invite'
  | 'message'
  | 'system';
