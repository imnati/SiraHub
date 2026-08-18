# SiraHub — Project State

## Current Phase
Phase 2 — Database & Backend Foundation (not started)

## Completed Phases

### Phase 0 — Project Initialization ✅
Completed. Full monorepo scaffold created and verified.

### Phase 1 — Requirements & Architecture ✅
Completed. Full technical blueprint created across 5 architecture documents.
Both builds verified clean after type file updates.

## In Progress
None.

## Next Phase
Phase 2 — Database & Backend Foundation

---

## Technology Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form, Zod, Axios
- Backend: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary, Nodemailer, Zod
- Additional Client: Telegram Bot (grammY)

---

## Repository Structure

```
SiraHub/
├── backend/
│   ├── src/
│   │   ├── config/         env.ts, database.ts, cloudinary.ts
│   │   ├── controllers/    index.ts (placeholder)
│   │   ├── middleware/     authenticate.ts, authorize.ts, errorHandler.ts,
│   │   │                   notFound.ts, rateLimiter.ts, validate.ts
│   │   ├── models/         index.ts (placeholder — Phase 2)
│   │   ├── routes/         health (functional), auth, user, job, company,
│   │   │                   application, category, notification, admin (all stubbed)
│   │   ├── services/       index.ts (placeholder)
│   │   ├── types/          index.ts ← FULLY EXPANDED (Phase 1)
│   │   │                   All domain interfaces: IUser, ICompany, IJob,
│   │   │                   IApplication, ICategory, ISkill, INotification,
│   │   │                   ISavedJob, IReview, IMessage + sub-document types,
│   │   │                   APPLICATION_STATUS_TRANSITIONS, JobFilters,
│   │   │                   ApiResponse, PaginationMeta
│   │   ├── utils/          AppError.ts, asyncHandler.ts, apiResponse.ts, pagination.ts
│   │   ├── validators/     index.ts (placeholder)
│   │   ├── app.ts          Express application
│   │   └── server.ts       Entry point
│   ├── .env                Local dev (gitignored)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            layout.tsx, page.tsx
│   │   ├── components/
│   │   │   ├── common/     placeholder
│   │   │   ├── layout/     placeholder
│   │   │   ├── providers/  ReduxProvider.tsx
│   │   │   └── ui/         placeholder
│   │   ├── features/       auth, jobs, profile, applications, employer,
│   │   │                   admin, notifications, messages (all placeholder)
│   │   ├── hooks/          placeholder
│   │   ├── lib/            axios.ts, utils.ts
│   │   ├── schemas/        placeholder
│   │   ├── services/       placeholder
│   │   ├── store/          index.ts (Redux store + typed hooks)
│   │   └── types/          index.ts ← FULLY EXPANDED (Phase 1)
│   │                       All domain interfaces: User, Company, Job,
│   │                       Application, Category, Skill, SavedJob,
│   │                       Notification, Message, Conversation, Review,
│   │                       + Redux state shapes (AuthState, JobsState,
│   │                       ApplicationsState, NotificationsState),
│   │                       ApiResponse, PaginationMeta, JobFilters,
│   │                       AdminAnalytics
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── telegram-client/
│   ├── src/
│   │   ├── api/            client.ts
│   │   ├── bot/            commands.ts, callbacks.ts (stubs)
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── ai-agent/           Phase prompts and project state
│   └── architecture/       ← NEW (Phase 1)
│       ├── REQUIREMENTS_MAP.md
│       ├── DATABASE_DESIGN.md
│       ├── ERD.md
│       ├── API_SPECIFICATION.md
│       └── FRONTEND_ARCHITECTURE.md
│
├── .gitignore
├── package.json            Monorepo root (npm workspaces)
└── README.md
```

---

## Architecture Documents (Phase 1 Output)

| Document | Contents |
|---|---|
| `REQUIREMENTS_MAP.md` | Role-to-page/action/API/DB/permission map for Guest, Job Seeker, Employer, Admin |
| `DATABASE_DESIGN.md` | Full Mongoose schema designs for all 10 collections with fields, types, enums, refs, indexes, decisions |
| `ERD.md` | Mermaid entity-relationship diagram + relationship narrative + index strategy |
| `API_SPECIFICATION.md` | 60+ endpoint specs across 13 resource groups: method, URL, auth, role, request, response, errors |
| `FRONTEND_ARCHITECTURE.md` | 45+ routes, Redux slice plan, component tree, services layer, hooks, Zod schemas, design system, auth guard pattern |

---

## Important Decisions

### From Phase 0
- **Monorepo layout**: npm workspaces — `backend`, `frontend`, `telegram-client`
- **Additional client**: Telegram Bot (Option B) using grammY
- **JWT strategy**: Short-lived access token (15m) + long-lived refresh token (7d)
- **Error handling**: `AppError` class + centralised `errorHandler` middleware
- **Validation**: Zod on both backend (middleware) and frontend (React Hook Form)
- **State management**: Redux Toolkit
- **TypeScript**: Strict mode on both sides

### From Phase 1
- **Embedded sub-documents**: Experience, education, languages, certificates are embedded in the User document (no separate collection). Only queried through the user profile — avoids N+1.
- **Denormalized counters**: `Job.applicationCount` and `Category.jobCount` stored denormalized. Maintained by service layer. Avoids expensive COUNT queries on hot read paths.
- **Application status transitions**: Enforced in service layer using `APPLICATION_STATUS_TRANSITIONS` map (now in `backend/src/types/index.ts`). Transitions: `applied → reviewing → shortlisted → interview → accepted/rejected`.
- **conversationId in Messages**: Deterministic composite key `[userId1, userId2].sort().join('_')`. Avoids a separate Conversations collection. Future real-time upgrade can use this as a Socket.io room key.
- **One company per employer**: Enforced via unique index on `{ owner: 1 }` in companies collection.
- **Slug fields**: Jobs, Companies, Categories, Skills all have SEO-friendly slug fields.
- **`select: false` on sensitive fields**: `password`, `emailVerifyToken`, `resetPasswordToken`, `refreshTokenHash` — never returned in queries unless explicitly selected.
- **Route groups**: Next.js App Router uses `(auth)` and `(public)` route groups with separate layouts. Dashboard routes have role-specific layout wrappers with `AuthGuard`.
- **Skills route**: Added `/api/skills` resource group (not in original route stubs — will be added to `app.ts` in Phase 2).
- **Uploads route**: Added `/api/uploads` resource group for Cloudinary file management (Phase 5).
- **Saved Jobs route**: Added `/api/saved-jobs` resource group (Phase 5).
- **Reviews route**: Added `/api/reviews` resource group (Phase 5).

---

## Verification Results

### Phase 0
| Check | Result |
|---|---|
| Backend `npm install` | ✅ 163 packages, exit 0 |
| Backend `tsc --noEmit` | ✅ Zero TypeScript errors |
| Backend server startup | ✅ Boots, wires routes, stops at placeholder DB URI only |
| Frontend `npm install` | ✅ Exit 0 |
| Frontend `tsc --noEmit` | ✅ Zero TypeScript errors |
| Frontend `next build` | ✅ 5 static pages, clean |

### Phase 1
| Check | Result |
|---|---|
| Backend `tsc --noEmit` | ✅ Zero errors after full type expansion |
| Frontend `tsc --noEmit` | ✅ Zero errors after full type expansion |
| Frontend `next build` | ✅ Compiled, linted, 5 static pages, exit 0 |

---

## Known Issues

- `multer@1.x` has known vulnerabilities. Will be upgraded to `2.x` in Phase 2.
- `backend/.env` contains local development credentials only (gitignored).
- The following route stubs in `app.ts` need to be added in Phase 2 (not currently in route stubs):
  - `/api/skills`
  - `/api/saved-jobs`
  - `/api/reviews`
  - `/api/uploads`
- MongoDB Atlas connection verified in Phase 0. Cloudinary and email credentials not yet configured.

---

## Phase 2 Scope (next)

Phase 2 will implement the database and backend foundation:
- All 10 Mongoose models (with full schemas, indexes, virtuals)
- Seed data (categories, skills, optional demo users/jobs)
- Add missing route stubs (`/api/skills`, `/api/saved-jobs`, `/api/reviews`, `/api/uploads`)
- Backend startup validation with real MongoDB connection

---

## Suggested Git Commit Message (Phase 1)

```
docs: Phase 1 — define project architecture, ERD and API specification

- docs/architecture/REQUIREMENTS_MAP.md: role-to-page/action/DB/permission map
- docs/architecture/DATABASE_DESIGN.md: Mongoose schema designs for 10 collections
- docs/architecture/ERD.md: Mermaid ERD + relationship narrative + index strategy
- docs/architecture/API_SPECIFICATION.md: 60+ endpoint specs across 13 resource groups
- docs/architecture/FRONTEND_ARCHITECTURE.md: 45+ routes, Redux slices, component tree,
  services, hooks, Zod schemas, design system, auth guard pattern
- backend/src/types/index.ts: full domain interfaces + APPLICATION_STATUS_TRANSITIONS
- frontend/src/types/index.ts: full domain interfaces + Redux state shapes
- Verification: backend tsc clean, frontend next build clean
```
