# SiraHub — Requirements Map

## Overview

This document maps each user role to its pages, permitted actions, required API endpoints,
database collections touched, and access-control rules.

---

## Role Definitions

| Role | Description |
|---|---|
| **Guest** | Unauthenticated visitor |
| **Job Seeker** | Authenticated user looking for work |
| **Employer** | Authenticated user posting jobs (must have a verified company) |
| **Admin** | Platform administrator with full access |

---

## 1. Guest

### Pages
| Page | Route |
|---|---|
| Home | `/` |
| Browse Jobs | `/jobs` |
| Job Detail | `/jobs/[id]` |
| Companies | `/companies` |
| Company Detail | `/companies/[id]` |
| Categories | `/categories` |
| Login | `/login` |
| Register | `/register` |
| About | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |

### Permitted Actions
- Browse and search job listings
- Filter jobs by keyword, category, location, salary, type, experience
- View job details
- View company profiles
- View categories
- Register an account (job seeker or employer)
- Log in

### API Requirements
- `GET /api/jobs` — public
- `GET /api/jobs/:id` — public
- `GET /api/companies` — public
- `GET /api/companies/:id` — public
- `GET /api/categories` — public
- `POST /api/auth/register` — public
- `POST /api/auth/login` — public

### Database Collections Accessed (read-only)
- Jobs (active only)
- Companies
- Categories

### Permissions
- No JWT required
- Cannot apply, save jobs, post jobs, or access any dashboard
- Must register + verify email before any authenticated action

---

## 2. Job Seeker

### Pages
| Page | Route |
|---|---|
| Dashboard | `/dashboard` |
| My Profile | `/dashboard/profile` |
| Resume | `/dashboard/resume` |
| Saved Jobs | `/dashboard/saved-jobs` |
| My Applications | `/dashboard/applications` |
| Application Detail | `/dashboard/applications/[id]` |
| Notifications | `/dashboard/notifications` |
| Messages | `/dashboard/messages` |
| Message Thread | `/dashboard/messages/[id]` |
| Account Settings | `/dashboard/settings` |

### Permitted Actions

#### Profile & Account
- Complete personal profile (name, bio, location, phone, social links)
- Upload profile picture
- Add/edit/delete work experience entries
- Add/edit/delete education entries
- Add/edit skills (from predefined Skill collection)
- Add languages spoken
- Add portfolio links
- Upload CV/resume (PDF)
- Upload certificates

#### Job Discovery
- Search and filter all active jobs
- View full job details
- Save a job to saved list
- Remove a saved job
- View applied jobs and their statuses

#### Applications
- Apply for a job (attach CV, cover letter, portfolio link)
- Withdraw a pending application
- View application history and status

#### Notifications
- View all notifications
- Mark individual notification as read
- Mark all notifications as read

#### Messaging
- Send message to employer (only after application exists)
- View conversation threads
- Receive messages from employers

#### Account
- Change password
- Update email (requires re-verification)
- Delete account

### API Requirements
- All auth endpoints
- `GET/PUT /api/users/me`
- `GET/POST/DELETE /api/users/me/experience`
- `GET/POST/DELETE /api/users/me/education`
- `GET/POST/DELETE /api/users/me/skills`
- `POST /api/uploads/avatar`
- `POST /api/uploads/cv`
- `POST /api/uploads/certificate`
- `GET/POST/DELETE /api/saved-jobs`
- `POST /api/applications/apply`
- `GET /api/applications` (own applications)
- `GET /api/applications/:id`
- `DELETE /api/applications/:id` (withdraw)
- `GET/PUT /api/notifications`
- `GET/POST /api/messages`
- `GET /api/messages/:conversationId`

### Database Collections Accessed
- Users (own document)
- Jobs (read-only)
- Applications (own)
- SavedJobs (own)
- Notifications (own)
- Messages (own)
- Companies (read-only)
- Categories (read-only)
- Skills (read-only, for selection)

### Permissions
- Must be authenticated (`authenticate` middleware)
- Must have role `jobseeker`
- Email must be verified before applying
- Can only access/modify own documents

---

## 3. Employer

### Pages
| Page | Route |
|---|---|
| Dashboard | `/employer/dashboard` |
| Company Profile | `/employer/company` |
| Job Management | `/employer/jobs` |
| Create Job | `/employer/jobs/create` |
| Edit Job | `/employer/jobs/[id]/edit` |
| Applicants for Job | `/employer/jobs/[id]/applicants` |
| Applicant Detail | `/employer/jobs/[id]/applicants/[appId]` |
| Interviews | `/employer/interviews` |
| Messages | `/employer/messages` |
| Message Thread | `/employer/messages/[id]` |
| Analytics | `/employer/analytics` |
| Settings | `/employer/settings` |

### Permitted Actions

#### Company
- Create company profile (name, logo, description, website, industry, size, location)
- Edit company profile
- Upload company logo
- View company public profile

#### Job Management
- Create new job posting
- Edit existing job
- Pause job (stops new applications)
- Reopen paused job
- Close job (permanently)
- Duplicate job posting
- Delete draft job
- View all own jobs with statistics

#### Applicant Management
- View all applicants for a specific job
- Download applicant CV
- Change application status: reviewing → shortlisted → interview → accepted | rejected
- Schedule interview (date, time, format, notes)
- Send interview invitation
- Mark candidate as hired

#### Messaging
- Send message to job seeker applicants
- View and reply to conversations

#### Analytics
- View per-job application counts
- View application status breakdown
- View job view counts
- View hiring funnel statistics

### API Requirements
- All auth endpoints
- `GET/PUT /api/companies/mine`
- `POST /api/uploads/logo`
- `POST/GET/PUT/DELETE /api/jobs` (own jobs)
- `POST /api/jobs/:id/duplicate`
- `GET /api/jobs/:id/applicants`
- `GET/PUT /api/applications/:id` (status changes only)
- `GET /api/employer/analytics`
- `GET/POST /api/messages`
- `GET /api/messages/:conversationId`

### Database Collections Accessed
- Users (own document)
- Companies (own)
- Jobs (own)
- Applications (for own jobs)
- Messages (own)
- Categories (read-only)
- Skills (read-only)

### Permissions
- Must be authenticated with role `employer`
- Must have verified email
- Company must be created before posting jobs
- Company should be admin-verified before jobs go public (configurable)
- Can only modify own company, own jobs
- Can only update application status on jobs they own — never change status to higher privilege than `accepted/rejected`

---

## 4. Admin

### Pages
| Page | Route |
|---|---|
| Dashboard | `/admin/dashboard` |
| Users | `/admin/users` |
| User Detail | `/admin/users/[id]` |
| Employer Verification | `/admin/verification` |
| Jobs | `/admin/jobs` |
| Job Detail | `/admin/jobs/[id]` |
| Companies | `/admin/companies` |
| Company Detail | `/admin/companies/[id]` |
| Categories | `/admin/categories` |
| Skills | `/admin/skills` |
| Reports | `/admin/reports` |
| Analytics | `/admin/analytics` |
| Settings | `/admin/settings` |

### Permitted Actions

#### User Management
- List all users with filters (role, status, date)
- View user detail
- Ban / unban a user
- Delete user account
- Manually verify employer

#### Company Management
- List all companies
- View company detail
- Approve / reject company verification
- Delete company

#### Job Management
- List all jobs (all statuses)
- View any job
- Remove inappropriate jobs
- Toggle job featured status

#### Category & Skill Management
- Create, edit, delete categories
- Create, edit, delete skills
- Assign skills to categories

#### Analytics & Reports
- Total users, jobs, companies, applications (real-time from DB)
- New registrations per day/week/month
- Application status breakdown
- Top categories by job count
- Top companies by application count
- Hiring success rate

#### Platform Settings
- View and update platform configuration

### API Requirements
- All `/api/admin/*` endpoints
- `GET /api/admin/dashboard`
- `GET/PUT /api/admin/users` + `PUT /api/admin/users/:id/ban`
- `GET/PUT/DELETE /api/admin/companies`
- `PUT /api/admin/companies/:id/verify`
- `GET/PUT/DELETE /api/admin/jobs`
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/POST/PUT/DELETE /api/admin/skills`
- `GET /api/admin/analytics`
- `GET /api/admin/reports`

### Database Collections Accessed
- All collections (full read/write)

### Permissions
- Must be authenticated with role `admin`
- Admin accounts are created manually (no public registration path for admin)
- All admin routes protected by `authenticate` + `authorize('admin')`

---

## Permission Matrix Summary

| Action | Guest | Job Seeker | Employer | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse jobs | ✅ | ✅ | ✅ | ✅ |
| View job detail | ✅ | ✅ | ✅ | ✅ |
| View company profiles | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — | — |
| Apply for jobs | ❌ | ✅ | ❌ | ❌ |
| Save jobs | ❌ | ✅ | ❌ | ❌ |
| Manage own profile | ❌ | ✅ | ✅ | ✅ |
| Post jobs | ❌ | ❌ | ✅ | ❌ |
| Manage own company | ❌ | ❌ | ✅ | ❌ |
| Review applicants | ❌ | ❌ | ✅ | ❌ |
| Send messages | ❌ | ✅* | ✅* | ❌ |
| Admin dashboard | ❌ | ❌ | ❌ | ✅ |
| Manage all users | ❌ | ❌ | ❌ | ✅ |
| Manage categories/skills | ❌ | ❌ | ❌ | ✅ |
| Verify employers | ❌ | ❌ | ❌ | ✅ |
| View all analytics | ❌ | ❌ | Own only | ✅ |

*Messaging: Job Seekers can message employers on jobs they have applied to. Employers can message applicants for their own jobs.
