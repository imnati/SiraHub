# SiraHub — Project State

## Current Phase
Phase 3 — Authentication & Authorization (not started)

## Completed Phases

### Phase 0 — Project Initialization ✅
Completed. Full monorepo scaffold created and verified.

### Phase 1 — Requirements & Architecture ✅
Completed. Full technical blueprint across 5 architecture documents.

### Phase 2 — Database & Backend Foundation ✅
Completed. All 10 Mongoose models implemented, seed data populated, missing routes
added, base validators created, multer upgraded, server verified clean.

## In Progress
None.

## Next Phase
Phase 3 — Authentication & Authorization

---

## Technology Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form, Zod, Axios
- Backend: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Multer 2.x, Cloudinary, Nodemailer, Zod
- Additional Client: Telegram Bot (grammY)

---

## Repository Structure

```
SiraHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              Typed env loader
│   │   │   ├── database.ts         Mongoose connect/disconnect + graceful shutdown
│   │   │   └── cloudinary.ts       Cloudinary SDK config
│   │   ├── middleware/
│   │   │   ├── authenticate.ts     JWT verification → req.user
│   │   │   ├── authorize.ts        Role-based guard factory
│   │   │   ├── errorHandler.ts     Centralised error handler
│   │   │   ├── notFound.ts         404 catch-all
│   │   │   ├── rateLimiter.ts      Global + auth-specific rate limiters
│   │   │   └── validate.ts         Zod middleware factory
│   │   ├── models/                 ← ALL IMPLEMENTED (Phase 2)
│   │   │   ├── User.ts             bcrypt pre-save, comparePassword, embedded sub-docs
│   │   │   ├── Company.ts          slug pre-save, unique owner index, text search
│   │   │   ├── Job.ts              slug pre-save, all search indexes, skills array
│   │   │   ├── Application.ts      statusHistory, interview sub-doc, compound unique
│   │   │   ├── Category.ts         slug pre-save, jobCount counter
│   │   │   ├── Skill.ts            slug pre-save, text search index
│   │   │   ├── Notification.ts     recipient+read compound index, TTL ready
│   │   │   ├── SavedJob.ts         (user,job) unique compound index
│   │   │   ├── Review.ts           (company,author) unique compound index
│   │   │   ├── Message.ts          conversationId index, buildConversationId static
│   │   │   └── index.ts            Re-exports all 10 models + document types
│   │   ├── routes/                 ← ALL ROUTES REGISTERED (Phase 2 added 5 missing)
│   │   │   ├── health.routes.ts    GET /api/health — FUNCTIONAL
│   │   │   ├── auth.routes.ts      7 stubs → Phase 3
│   │   │   ├── user.routes.ts      stubs → Phase 5
│   │   │   ├── job.routes.ts       stubs → Phase 4
│   │   │   ├── company.routes.ts   stubs → Phase 4
│   │   │   ├── application.routes.ts stubs → Phase 6
│   │   │   ├── category.routes.ts  stubs → Phase 4
│   │   │   ├── skill.routes.ts     stubs → Phase 4  (NEW Phase 2)
│   │   │   ├── savedJob.routes.ts  stubs → Phase 5  (NEW Phase 2)
│   │   │   ├── review.routes.ts    stubs → Phase 5  (NEW Phase 2)
│   │   │   ├── upload.routes.ts    stubs → Phase 5  (NEW Phase 2)
│   │   │   ├── message.routes.ts   stubs → Phase 8  (NEW Phase 2)
│   │   │   ├── notification.routes.ts stubs → Phase 8
│   │   │   └── admin.routes.ts     stubs → Phase 7
│   │   ├── services/               index.ts (placeholder — Phase 3+)
│   │   ├── types/                  index.ts (fully expanded Phase 1)
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   ├── asyncHandler.ts
│   │   │   ├── apiResponse.ts
│   │   │   ├── pagination.ts
│   │   │   └── slugify.ts          (NEW Phase 2)
│   │   ├── validators/
│   │   │   └── index.ts            (EXPANDED Phase 2 — base Zod schemas)
│   │   ├── app.ts                  All 14 routes mounted, models registered at startup
│   │   ├── server.ts               connectDB → registerShutdownHandlers → listen
│   │   └── seed.ts                 (NEW Phase 2 — 18 categories, 143 skills)
│   ├── .env                        Local dev (gitignored)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json                multer 2.2.0, ts-node added, seed script
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    layout.tsx, page.tsx
│   │   ├── components/providers/   ReduxProvider.tsx
│   │   ├── features/               auth, jobs, profile, applications, employer,
│   │   │                           admin, notifications, messages (placeholders)
│   │   ├── lib/                    axios.ts, utils.ts
│   │   ├── store/                  index.ts (Redux store + typed hooks)
│   │   └── types/                  index.ts (fully expanded Phase 1)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── telegram-client/                Telegram Bot stubs (Phase 9)
├── docs/
│   ├── ai-agent/                   Phase prompts and project state
│   └── architecture/               REQUIREMENTS_MAP, DATABASE_DESIGN, ERD,
│                                   API_SPECIFICATION, FRONTEND_ARCHITECTURE
├── .gitignore
├── package.json                    Monorepo root (npm workspaces)
└── README.md
```

---

## Database State (Phase 2)

| Collection  | Status           | Notes |
|-------------|------------------|-------|
| users       | Model ready      | bcrypt pre-save, comparePassword(), select:false on sensitive fields |
| companies   | Model ready      | Unique owner index, slug auto-gen, text search |
| jobs        | Model ready      | Slug auto-gen, all search indexes, 15-skill limit |
| applications| Model ready      | Unique (job,applicant), statusHistory, interview sub-doc |
| categories  | Model + data ✅  | 18 Ethiopian categories seeded |
| skills      | Model + data ✅  | 143 skills seeded across categories |
| notifications| Model ready     | Compound index, TTL index commented (enable Phase 8) |
| savedjobs   | Model ready      | Unique (user,job) index |
| reviews     | Model ready      | Unique (company,author) index |
| messages    | Model ready      | conversationId index, buildConversationId static helper |

---

## Seeded Data

18 Ethiopian job market categories:
Software & IT, Finance & Accounting, Healthcare & Medical, Education & Training,
Sales & Marketing, Engineering, Human Resources, Legal, Construction & Real Estate,
Hospitality & Tourism, NGO & Development, Government & Public Sector,
Media & Communications, Transport & Logistics, Agriculture, Manufacturing,
Banking & Insurance, Consulting

143 skills distributed across categories (e.g. React, Node.js, Python under Software & IT;
Credit Analysis, Core Banking Systems under Banking & Insurance, etc.)

---

## Important Decisions

### From Phase 0
- Monorepo layout: npm workspaces — `backend`, `frontend`, `telegram-client`
- Telegram Bot (Option B) using grammY
- JWT: 15m access token + 7d refresh token (dual-token)
- Error handling: `AppError` + centralised `errorHandler`
- Validation: Zod on both sides
- State: Redux Toolkit
- TypeScript strict mode

### From Phase 1
- Embedded sub-documents for experience/education/languages/certificates (avoids N+1)
- Denormalized `Job.applicationCount` and `Category.jobCount` counters
- `APPLICATION_STATUS_TRANSITIONS` map enforced in service layer
- `conversationId` as deterministic composite key `[id1,id2].sort().join('_')`
- One company per employer (unique owner index)
- `select: false` on password/tokens

### From Phase 2
- **multer upgraded to 2.2.0** (from 1.4.5-lts.1 — resolves all known CVEs)
- **slugify utility**: custom `src/utils/slugify.ts` — no external slug dependency needed
- **Slug strategy**: Category/Skill use slug from name on `pre('save')`; Company uses async loop to guarantee uniqueness; Job appends `Date.now().toString(36)` suffix for fast uniqueness without DB round-trip
- **Duplicate index fix**: Company.ts — removed explicit `schema.index({slug:1})` since field-level `unique:true` already creates the index; avoids Mongoose warning at startup
- **Model registration**: `app.ts` imports `./models/index` at startup so all schemas are registered with Mongoose before any route handler runs (prevents populate errors in Phase 3+)
- **Graceful shutdown**: `SIGTERM` + `SIGINT` handlers close MongoDB connection cleanly
- **Seed script idempotent**: uses `findOneAndUpdate` with `$setOnInsert` + `exists()` check — safe to re-run
- **ts-node** added as devDependency for seed script (ts-node-dev is only for the watch server)
- **5 new routes registered**: `/api/skills`, `/api/saved-jobs`, `/api/reviews`, `/api/uploads`, `/api/messages` — all returning 501 stubs until their implementation phases

---

## Verification Results

### Phase 0
| Check | Result |
|---|---|
| Backend `npm install` | ✅ exit 0 |
| Backend `tsc --noEmit` | ✅ zero errors |
| Backend server startup | ✅ starts, routes wired |
| Frontend `npm install` | ✅ exit 0 |
| Frontend `tsc --noEmit` | ✅ zero errors |
| Frontend `next build` | ✅ 5 static pages |

### Phase 1
| Check | Result |
|---|---|
| Backend `tsc --noEmit` | ✅ zero errors |
| Frontend `tsc --noEmit` | ✅ zero errors |
| Frontend `next build` | ✅ compiled, linted, clean |

### Phase 2
| Check | Result |
|---|---|
| Backend `npm install` (multer 2.2.0) | ✅ exit 0 |
| Backend `tsc --noEmit` | ✅ zero errors |
| Server startup (no warnings) | ✅ clean |
| MongoDB Atlas connection | ✅ connected to ac-knla1o2 shard |
| `GET /api/health` | ✅ 200, database=connected |
| All 13 route stubs | ✅ 501 Not Implemented |
| Unknown route | ✅ 404 Not Found |
| Seed script | ✅ 18 categories, 143 skills in Atlas |
| multer audit | ✅ no multer CVEs at 2.2.0 |

---

## Known Issues

- 9 npm audit vulnerabilities remain in transitive dependencies (not in multer or direct deps). These are inherited from older sub-dependencies and do not affect runtime security at this stage.
- Cloudinary and SMTP credentials not yet configured — file uploads and email sending will not work until Phase 5 configures them.
- The TTL index on `Notification.createdAt` (90-day auto-delete) is commented out in the model. Enable it in Phase 8 when notifications are implemented.

---

## Phase 3 Scope (next)

Phase 3 implements Authentication & Authorization:
- `POST /api/auth/register` — hash password, send verification email, return user
- `POST /api/auth/login` — verify credentials, sign tokens, set refresh cookie
- `POST /api/auth/logout` — clear cookie, invalidate refresh token hash
- `POST /api/auth/refresh-token` — validate refresh token, issue new access token
- `GET /api/auth/verify-email/:token` — verify email token
- `POST /api/auth/forgot-password` — generate reset token, send email
- `POST /api/auth/reset-password` — validate token, hash new password
- `PUT /api/users/me/password` — change password (authenticated)
- Email service (Nodemailer) — verification and password reset templates
- Zod validators: `registerSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema`
- AuthService: all auth business logic
- AuthController: HTTP handlers
- Stricter `authRateLimiter` applied to auth routes
- Frontend: connect auth pages to backend once routes work (optional — may be Phase 3 frontend or Phase 5)

---

## Suggested Git Commit Message (Phase 2)

```
feat: Phase 2 — implement all Mongoose models and backend foundation

Models (10): User, Company, Job, Application, Category, Skill,
             Notification, SavedJob, Review, Message
- User: bcrypt pre-save hook, comparePassword(), select:false on sensitive fields,
        embedded sub-docs for experience/education/languages/certificates/skills
- Company: async slug uniqueness loop, unique owner index, text search index
- Job: timestamp-suffix slug, full search indexes (city/type/level/salary/text)
- Application: statusHistory array, interview sub-doc, unique (job,applicant)
- Category/Skill: slug pre-save, seeded with 18 categories + 143 skills
- SavedJob/Review: unique compound indexes enforcing business constraints
- Message: conversationId index, buildConversationId() static helper
- Notification: compound indexes, TTL index prepared (commented, Phase 8)

Infrastructure:
- backend/src/utils/slugify.ts: custom slug utility
- backend/src/validators/index.ts: base Zod schemas (objectId, email, password,
  pagination, enums, location, salary)
- backend/src/seed.ts: idempotent seed for 18 Ethiopian categories + 143 skills
- backend/src/config/database.ts: graceful SIGTERM/SIGINT shutdown handlers
- backend/src/app.ts: all 14 routes mounted, models registered at startup

Routes added (5 missing from Phase 1):
  /api/skills, /api/saved-jobs, /api/reviews, /api/uploads, /api/messages

Dependencies:
- multer upgraded 1.4.5-lts.1 → 2.2.0 (resolves all known CVEs)
- ts-node added as devDependency for seed script

Verification: tsc clean, server starts without warnings,
MongoDB Atlas connected, 16/16 API smoke tests passed,
seed script: 18 categories + 143 skills in Atlas
```
