/**
 * Base Zod validation schemas — reusable primitives used across all feature validators.
 *
 * Feature-specific validators are added in later phases alongside their routes:
 *   Phase 3: auth validators
 *   Phase 4: job, company, category, skill validators
 *   Phase 5: profile, upload validators
 *   Phase 6: application validators
 */

import { z } from 'zod';

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Validates a MongoDB ObjectId string (24-char hex) */
export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

/** Wraps an ObjectId schema in body/params/query shape for use with validate() middleware */
export const objectIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/** Email validation — lowercase, trimmed */
export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Password validation:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 */
export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/** Pagination query parameters */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(50)),
});

/** Non-empty trimmed string helper */
export const nonEmptyString = (fieldName: string, maxLength?: number) => {
  let schema = z
    .string({ required_error: `${fieldName} is required` })
    .trim()
    .min(1, `${fieldName} cannot be empty`);
  if (maxLength) {
    schema = schema.max(maxLength, `${fieldName} must be at most ${maxLength} characters`);
  }
  return schema;
};

/** URL validation — optional, must be valid URL if provided */
export const optionalUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''));

/** Date string validation — must be a valid ISO date and in the future */
export const futureDateSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO date string' })
  .refine((d) => new Date(d) > new Date(), 'Date must be in the future');

// ─── Enum schemas ─────────────────────────────────────────────────────────────

export const userRoleSchema = z.enum(['jobseeker', 'employer'] as const, {
  errorMap: () => ({ message: 'Role must be jobseeker or employer' }),
});

export const employmentTypeSchema = z.enum(
  ['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance'] as const
);

export const experienceLevelSchema = z.enum(
  ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'] as const
);

export const educationLevelSchema = z.enum(
  ['none', 'high-school', 'diploma', 'bachelors', 'masters', 'phd'] as const
);

export const jobStatusSchema = z.enum(['draft', 'active', 'paused', 'closed'] as const);

export const applicationStatusSchema = z.enum(
  ['applied', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'] as const
);

export const companySizeSchema = z.enum(
  ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] as const
);

export const salaryPeriodSchema = z.enum(['hourly', 'daily', 'monthly', 'yearly'] as const);

export const languageProficiencySchema = z.enum(
  ['beginner', 'conversational', 'professional', 'native'] as const
);

export const interviewFormatSchema = z.enum(['in-person', 'video', 'phone'] as const);

export const notificationTypeSchema = z.enum(
  ['new_job', 'application_status', 'interview_invite', 'message', 'system'] as const
);

// ─── Compound schemas ─────────────────────────────────────────────────────────

/** Location sub-object used in Job and Company */
export const locationSchema = z.object({
  city: nonEmptyString('City'),
  region: z.string().trim().optional(),
  country: z.string().trim().default('Ethiopia'),
  address: z.string().trim().optional(),
  isRemote: z.boolean().optional().default(false),
});

/** Salary sub-object used in Job */
export const salarySchema = z.object({
  min: z.number().min(0).optional(),
  max: z.number().min(0).optional(),
  currency: z.string().default('ETB'),
  period: salaryPeriodSchema.default('monthly'),
  isNegotiable: z.boolean().default(false),
  isHidden: z.boolean().default(false),
});
