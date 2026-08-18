# SiraHub — Frontend Architecture

## Technology

- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- State: Redux Toolkit
- Forms: React Hook Form + Zod
- HTTP: Axios (with interceptors in `src/lib/axios.ts`)
- Icons: lucide-react
- Class utilities: clsx + tailwind-merge (via `cn()`)

---

## 1. Route Architecture

All routes use Next.js App Router file-based conventions.
Protected routes use layout-level auth guards (not middleware.ts for this phase).

### 1.1 Public Routes

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, featured jobs, categories, stats |
| `/jobs` | `app/jobs/page.tsx` | Browse & search all jobs |
| `/jobs/[id]` | `app/jobs/[id]/page.tsx` | Full job detail |
| `/companies` | `app/companies/page.tsx` | Company directory |
| `/companies/[id]` | `app/companies/[id]/page.tsx` | Company profile + jobs + reviews |
| `/categories` | `app/categories/page.tsx` | Category listing |
| `/categories/[slug]` | `app/categories/[slug]/page.tsx` | Jobs in category |
| `/login` | `app/(auth)/login/page.tsx` | Login form |
| `/register` | `app/(auth)/register/page.tsx` | Registration (role select) |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Forgot password |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Reset with token |
| `/verify-email` | `app/(auth)/verify-email/page.tsx` | Email verification landing |
| `/about` | `app/about/page.tsx` | About SiraHub |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/faq` | `app/faq/page.tsx` | FAQ accordion |
| `/privacy` | `app/privacy/page.tsx` | Privacy Policy |
| `/terms` | `app/terms/page.tsx` | Terms of Service |

### 1.2 Job Seeker Dashboard Routes

Base: `/dashboard` — protected, role: `jobseeker`

| Route | File | Description |
|---|---|---|
| `/dashboard` | `app/dashboard/page.tsx` | Overview — stats, recent activity |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | Personal info, bio |
| `/dashboard/profile/experience` | `app/dashboard/profile/experience/page.tsx` | Work experience |
| `/dashboard/profile/education` | `app/dashboard/profile/education/page.tsx` | Education |
| `/dashboard/resume` | `app/dashboard/resume/page.tsx` | Upload/manage CV |
| `/dashboard/saved-jobs` | `app/dashboard/saved-jobs/page.tsx` | Saved job list |
| `/dashboard/applications` | `app/dashboard/applications/page.tsx` | Applied jobs list |
| `/dashboard/applications/[id]` | `app/dashboard/applications/[id]/page.tsx` | Application detail |
| `/dashboard/notifications` | `app/dashboard/notifications/page.tsx` | Notification list |
| `/dashboard/messages` | `app/dashboard/messages/page.tsx` | Conversation list |
| `/dashboard/messages/[conversationId]` | `app/dashboard/messages/[conversationId]/page.tsx` | Message thread |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | Account settings |

### 1.3 Employer Dashboard Routes

Base: `/employer` — protected, role: `employer`

| Route | File | Description |
|---|---|---|
| `/employer/dashboard` | `app/employer/dashboard/page.tsx` | Overview — job stats |
| `/employer/company` | `app/employer/company/page.tsx` | Edit company profile |
| `/employer/jobs` | `app/employer/jobs/page.tsx` | Job list with stats |
| `/employer/jobs/create` | `app/employer/jobs/create/page.tsx` | Create job form |
| `/employer/jobs/[id]/edit` | `app/employer/jobs/[id]/edit/page.tsx` | Edit job |
| `/employer/jobs/[id]/applicants` | `app/employer/jobs/[id]/applicants/page.tsx` | Applicant list |
| `/employer/jobs/[id]/applicants/[appId]` | `app/employer/jobs/[id]/applicants/[appId]/page.tsx` | Applicant detail |
| `/employer/interviews` | `app/employer/interviews/page.tsx` | Upcoming interviews |
| `/employer/messages` | `app/employer/messages/page.tsx` | Conversation list |
| `/employer/messages/[conversationId]` | `app/employer/messages/[conversationId]/page.tsx` | Message thread |
| `/employer/analytics` | `app/employer/analytics/page.tsx` | Job & hiring analytics |
| `/employer/settings` | `app/employer/settings/page.tsx` | Account settings |

### 1.4 Admin Dashboard Routes

Base: `/admin` — protected, role: `admin`

| Route | File | Description |
|---|---|---|
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Platform overview stats |
| `/admin/users` | `app/admin/users/page.tsx` | User management table |
| `/admin/users/[id]` | `app/admin/users/[id]/page.tsx` | User detail / actions |
| `/admin/verification` | `app/admin/verification/page.tsx` | Employer verification queue |
| `/admin/companies` | `app/admin/companies/page.tsx` | Company list |
| `/admin/companies/[id]` | `app/admin/companies/[id]/page.tsx` | Company detail |
| `/admin/jobs` | `app/admin/jobs/page.tsx` | All jobs (any status) |
| `/admin/categories` | `app/admin/categories/page.tsx` | Category CRUD |
| `/admin/skills` | `app/admin/skills/page.tsx` | Skill CRUD |
| `/admin/reports` | `app/admin/reports/page.tsx` | Reports |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Platform analytics |
| `/admin/settings` | `app/admin/settings/page.tsx` | Platform settings |

### 1.5 Route Groups & Layouts

```
app/
├── (auth)/                   ← Auth layout (centered card, no sidebar)
│   ├── layout.tsx
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   └── verify-email/
│
├── (public)/                 ← Public layout (Navbar + Footer)
│   ├── layout.tsx
│   ├── page.tsx              (home)
│   ├── jobs/
│   ├── companies/
│   ├── categories/
│   ├── about/
│   ├── contact/
│   ├── faq/
│   ├── privacy/
│   └── terms/
│
├── dashboard/                ← Job Seeker dashboard layout (sidebar)
│   ├── layout.tsx            ← AuthGuard (role: jobseeker) + DashboardLayout
│   └── ...
│
├── employer/                 ← Employer dashboard layout (sidebar)
│   ├── layout.tsx            ← AuthGuard (role: employer) + DashboardLayout
│   └── ...
│
├── admin/                    ← Admin dashboard layout (sidebar)
│   ├── layout.tsx            ← AuthGuard (role: admin) + AdminLayout
│   └── ...
│
└── layout.tsx                ← Root layout (ReduxProvider, fonts, metadata)
```

---

## 2. Redux Store Architecture

```
store/
├── index.ts           ← configureStore, RootState, AppDispatch, typed hooks
└── slices/
    ├── authSlice.ts          Phase 3 — user, tokens, login/logout
    ├── jobsSlice.ts          Phase 4 — job list, filters, current job
    ├── companiesSlice.ts     Phase 4 — company list, current company
    ├── categoriesSlice.ts    Phase 4 — category list
    ├── profileSlice.ts       Phase 5 — job seeker profile details
    ├── applicationsSlice.ts  Phase 6 — application list, current application
    ├── savedJobsSlice.ts     Phase 5 — saved job ids
    ├── notificationsSlice.ts Phase 8 — notification list, unread count
    ├── messagesSlice.ts      Phase 8 — conversation list, current thread
    └── adminSlice.ts         Phase 7 — analytics, user management
```

### Auth Slice Shape
```typescript
{
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Jobs Slice Shape
```typescript
{
  jobs: Job[];
  currentJob: Job | null;
  filters: JobFilters;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
}
```

---

## 3. Component Architecture

### 3.1 Directory Structure

```
src/components/
├── ui/                       ← Primitive, unstyled-base components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Dropdown.tsx
│   ├── Tooltip.tsx
│   ├── Tabs.tsx
│   ├── Spinner.tsx
│   ├── Skeleton.tsx
│   └── index.ts
│
├── layout/                   ← App-level structure
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── DashboardLayout.tsx
│   ├── AdminLayout.tsx
│   ├── AuthLayout.tsx
│   └── index.ts
│
├── common/                   ← Reusable non-primitive components
│   ├── LoadingSpinner.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── Pagination.tsx
│   ├── SearchBar.tsx
│   ├── Toast.tsx
│   ├── ConfirmDialog.tsx
│   ├── FileUpload.tsx
│   ├── RichTextEditor.tsx    (Phase 4 — job description)
│   └── index.ts
│
└── providers/
    ├── ReduxProvider.tsx     ← Already exists (Phase 0)
    └── ToastProvider.tsx
```

### 3.2 Feature Components

```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── authSlice.ts
│
├── jobs/
│   ├── components/
│   │   ├── JobCard.tsx           ← Summary card (used in list views)
│   │   ├── JobList.tsx           ← Grid/list of JobCards
│   │   ├── JobDetail.tsx         ← Full job detail view
│   │   ├── JobFilters.tsx        ← Filter panel (sidebar or drawer)
│   │   ├── JobSearchBar.tsx
│   │   ├── JobSortSelect.tsx
│   │   ├── JobStatusBadge.tsx
│   │   ├── JobForm.tsx           ← Create/edit job (employer)
│   │   └── FeaturedJobsBanner.tsx
│   ├── hooks/
│   │   ├── useJobs.ts
│   │   └── useJobDetail.ts
│   └── jobsSlice.ts
│
├── profile/
│   ├── components/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileBio.tsx
│   │   ├── ExperienceList.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── EducationList.tsx
│   │   ├── EducationForm.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── LanguagesSection.tsx
│   │   ├── CertificatesSection.tsx
│   │   ├── CvUploadCard.tsx
│   │   └── ProfileCompletionBar.tsx
│   ├── hooks/
│   │   └── useProfile.ts
│   └── profileSlice.ts
│
├── applications/
│   ├── components/
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationList.tsx
│   │   ├── ApplicationDetail.tsx
│   │   ├── ApplyModal.tsx
│   │   ├── ApplicationStatusBadge.tsx
│   │   ├── ApplicationStatusTimeline.tsx
│   │   └── InterviewCard.tsx
│   ├── hooks/
│   │   └── useApplications.ts
│   └── applicationsSlice.ts
│
├── employer/
│   ├── components/
│   │   ├── CompanyForm.tsx
│   │   ├── CompanyHeader.tsx
│   │   ├── ApplicantTable.tsx
│   │   ├── ApplicantStatusSelect.tsx
│   │   ├── InterviewScheduleModal.tsx
│   │   └── EmployerJobCard.tsx
│   └── hooks/
│       └── useEmployer.ts
│
├── admin/
│   ├── components/
│   │   ├── StatsCard.tsx
│   │   ├── UserTable.tsx
│   │   ├── CompanyVerificationCard.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── ReportsTable.tsx
│   └── adminSlice.ts
│
├── notifications/
│   ├── components/
│   │   ├── NotificationList.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationBell.tsx
│   └── notificationsSlice.ts
│
└── messages/
    ├── components/
    │   ├── ConversationList.tsx
    │   ├── MessageThread.tsx
    │   ├── MessageBubble.tsx
    │   └── MessageInput.tsx
    └── messagesSlice.ts
```

---

## 4. UI Component Specifications

### Button
```
Variants: primary | secondary | outline | ghost | danger
Sizes: sm | md | lg
States: default | loading | disabled
Props: variant, size, isLoading, leftIcon, rightIcon, fullWidth
```

### Input
```
Types: text | email | password | number | tel | url
States: default | error | success | disabled
Props: label, error, hint, leftAddon, rightAddon
```

### Badge
```
Variants: default | success | warning | danger | info | outline
Sizes: sm | md
Used for: job status, application status, company verified, role
```

### JobCard
```
Displays: job title, company name + logo, location, salary (ETB),
          employment type badge, deadline, experience level,
          days-ago posted, save button (heart icon), apply button
Variants: compact (list view) | featured (highlighted border)
```

### SearchBar
```
Props: value, onChange, onSearch, placeholder, showFilters (toggle filter panel)
Has: debounced input (300ms), clear button, mobile-friendly
```

### FilterPanel
```
Sections: Category, Employment Type, Experience Level,
          Location (city), Salary Range (slider), Remote Only toggle
Behaviour: updates URL query params, syncs with Redux filters state
```

### Modal
```
Sizes: sm | md | lg | xl | fullscreen
Props: isOpen, onClose, title, footer, closeOnOverlay
Accessibility: focus trap, ESC to close, aria-labelledby
```

### Pagination
```
Props: page, totalPages, onPageChange
Shows: prev/next buttons, page numbers (max 5 visible), total count
```

### StatusBadge
```
Maps ApplicationStatus → color:
  applied    → blue
  reviewing  → yellow
  shortlisted → purple
  interview  → orange
  accepted   → green
  rejected   → red

Maps JobStatus → color:
  draft   → gray
  active  → green
  paused  → yellow
  closed  → red
```

### EmptyState
```
Props: icon, title, description, action (button)
Used when: no jobs found, no applications, no notifications, etc.
```

### DashboardLayout
```
Structure:
  Sidebar (fixed on desktop, drawer on mobile)
    - Profile summary
    - Nav links (role-specific)
    - Logout button
  Main content area
    - Breadcrumb
    - Page title
    - Page content
```

---

## 5. Services Layer

```
src/services/
├── auth.service.ts         login, register, logout, forgotPassword, resetPassword
├── job.service.ts          getJobs, getJob, createJob, updateJob, deleteJob, duplicateJob
├── application.service.ts  apply, getApplications, getApplication, updateStatus, withdraw
├── company.service.ts      getCompanies, getCompany, createCompany, updateCompany
├── profile.service.ts      getProfile, updateProfile, updateExperience, updateEducation
├── savedJob.service.ts     getSavedJobs, saveJob, unsaveJob
├── notification.service.ts getNotifications, markRead, markAllRead
├── message.service.ts      getConversations, getMessages, sendMessage
├── review.service.ts       getReviews, createReview, updateReview, deleteReview
├── upload.service.ts       uploadAvatar, uploadCV, uploadCertificate, uploadLogo
└── admin.service.ts        getDashboard, getUsers, banUser, verifyCompany, getAnalytics
```

---

## 6. Custom Hooks

```
src/hooks/
├── useAuth.ts              Current user, isAuthenticated, role
├── useDebounce.ts          Debounce a value (for search inputs)
├── usePagination.ts        Page state, handlers
├── useLocalStorage.ts      Type-safe localStorage wrapper
├── useMediaQuery.ts        Responsive breakpoint detection
├── useToast.ts             Show/dismiss toast notifications
├── useConfirm.ts           Confirmation dialog hook
└── useClickOutside.ts      Close dropdowns/modals on outside click
```

---

## 7. Validation Schemas (Zod)

```
src/schemas/
├── auth.schema.ts      loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema
├── job.schema.ts       createJobSchema, updateJobSchema
├── application.schema.ts  applySchema
├── profile.schema.ts   updateProfileSchema, experienceSchema, educationSchema
├── company.schema.ts   createCompanySchema, updateCompanySchema
└── review.schema.ts    createReviewSchema
```

---

## 8. Design System

### Colour Palette (Tailwind config extensions)

```
primary:   blue-600   (#2563EB)  — CTAs, links, active states
secondary: gray-600   (#4B5563)  — secondary text
success:   green-500  (#22C55E)  — accepted, active, verified
warning:   yellow-500 (#EAB308)  — paused, reviewing
danger:    red-500    (#EF4444)  — rejected, banned, error
info:      blue-400   (#60A5FA)  — applied, info
neutral:   gray-100   (#F3F4F6)  — backgrounds
```

### Typography
```
Font family: Geist Sans (already configured in Phase 0 layout)
Heading:     font-bold text-gray-900
Body:        text-gray-600 leading-relaxed
Caption:     text-sm text-gray-400
```

### Spacing
- Use Tailwind spacing scale consistently
- Section padding: `px-4 sm:px-6 lg:px-8`, `py-12`
- Card padding: `p-4 sm:p-6`
- Gap between grid items: `gap-4 sm:gap-6`

### Breakpoints (Tailwind defaults — mobile-first)
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

---

## 9. Auth Guard Pattern

```typescript
// app/dashboard/layout.tsx pattern
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }) {
  // Server component: reads cookie or use client-side guard
  // Client component approach preferred for this phase:
  return <AuthGuard requiredRole="jobseeker">{children}</AuthGuard>;
}

// components/AuthGuard.tsx
'use client';
function AuthGuard({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) redirect('/login');
  if (requiredRole && user?.role !== requiredRole) redirect('/');
  return <>{children}</>;
}
```

---

## 10. Ethiopian Localisation

- Default currency: ETB (Ethiopian Birr) — used in `formatSalary()` already in `lib/utils.ts`
- City list for location fields:
  ```
  Addis Ababa, Dire Dawa, Mekelle, Gondar, Hawassa, Bahir Dar,
  Adama (Nazret), Jimma, Dessie, Jijiga, Shashamane, Bishoftu,
  Harar, Debre Birhan, Arba Minch
  ```
- Date format: `dd MMM yyyy` (e.g. 18 Aug 2026) using `Intl.DateTimeFormat`
