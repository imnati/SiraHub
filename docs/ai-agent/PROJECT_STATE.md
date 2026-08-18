# SiraHub — Project State

## Current Phase
Phase 1 — Requirements & Architecture (not started)

## Completed Phases

### Phase 0 — Project Initialization ✅
Completed. Full monorepo scaffold created and verified.

## In Progress
None.

## Next Phase
Phase 1 — Requirements & Architecture

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
│   │   ├── routes/         health, auth, user, job, company, application,
│   │   │                   category, notification, admin (all stubbed)
│   │   ├── services/       index.ts (placeholder)
│   │   ├── types/          index.ts (UserRole, JobStatus, ApplicationStatus, etc.)
│   │   ├── utils/          AppError.ts, asyncHandler.ts, apiResponse.ts, pagination.ts
│   │   ├── validators/     index.ts (placeholder)
│   │   ├── app.ts          Express application (CORS, helmet, morgan, routes wired)
│   │   └── server.ts       Entry point
│   ├── .env                Temporary dev env (NOT committed — gitignored)
│   ├── .env.example        Template with all required variables
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            layout.tsx (Redux + metadata), page.tsx (placeholder home)
│   │   ├── components/
│   │   │   ├── common/     placeholder
│   │   │   ├── layout/     placeholder
│   │   │   ├── providers/  ReduxProvider.tsx
│   │   │   └── ui/         placeholder
│   │   ├── features/       auth, jobs, profile, applications, employer,
│   │   │                   admin, notifications, messages (all placeholder)
│   │   ├── hooks/          placeholder
│   │   ├── lib/            axios.ts (with interceptors + token refresh), utils.ts
│   │   ├── schemas/        placeholder
│   │   ├── services/       placeholder
│   │   ├── store/          index.ts (Redux store, typed hooks)
│   │   └── types/          index.ts (shared types + ApiResponse envelope)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── telegram-client/
│   ├── src/
│   │   ├── api/            client.ts (Axios → SiraHub API)
│   │   ├── bot/            commands.ts, callbacks.ts (stubs)
│   │   └── index.ts        Bot entry point (grammY)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/ai-agent/          Phase prompts and project state
├── .gitignore
├── package.json            Monorepo root (npm workspaces)
└── README.md
```

---

## Important Decisions

- **Monorepo layout**: npm workspaces with three packages — `backend`, `frontend`, `telegram-client`.
- **Additional client**: Telegram Bot (Option B) using grammY library.
- **JWT strategy**: Short-lived access token (15m) + long-lived refresh token (7d). Refresh handled by Axios interceptor on the frontend.
- **Error handling**: Centralised via `AppError` class + `errorHandler` middleware. All async handlers wrapped with `asyncHandler` utility.
- **Validation**: Zod used on both backend (request validation middleware) and frontend (React Hook Form schemas).
- **State management**: Redux Toolkit selected over Context API for scalability across multiple feature domains.
- **TypeScript**: Strict mode enabled on both backend and frontend.
- **Rate limiting**: Global limiter on `/api/*` + stricter `authRateLimiter` ready for auth routes in Phase 3.
- **multer**: Kept at 1.x for now; will upgrade to 2.x in Phase 2 when file uploads are implemented.

---

## Verification Results (Phase 0)

| Check | Result |
|---|---|
| Backend `npm install` | ✅ 163 packages, exit 0 |
| Backend `tsc --noEmit` | ✅ Zero TypeScript errors |
| Backend server startup | ✅ Boots successfully and connects to MongoDB Atlas on port 5000 |
| Frontend `npm install` | ✅ Exit 0 |
| Frontend `tsc --noEmit` | ✅ Zero TypeScript errors |
| Frontend `next build` | ✅ Compiled, linted, 5 static pages generated |

---

## Known Issues

- `multer@1.x` has known vulnerabilities. Will be upgraded to `2.x` in Phase 2 when Multer is actually used.
- `backend/.env` contains local development credentials and is gitignored.
- MongoDB Atlas connection has been successfully verified.
- Cloudinary and email credentials have not yet been configured/verified.
- Frontend `.next/` build directory was cleaned up after verification.

---

## Notes

- Phase 0 leaves the project in a clean, buildable state with no business logic yet.
- All route stubs return `501 Not Implemented` with a note indicating which phase implements them.
- All feature folders contain placeholder `index.ts` files documenting which phase will fill them in.
- The Telegram bot structure is scaffolded but stubs out all real functionality until Phase 9.

---

## Suggested Git Commit Message (Phase 0)

```
feat: Phase 0 — project initialization

- Monorepo scaffold: backend (Express/TS), frontend (Next.js 14/TS/Tailwind), telegram-client (grammY)
- Backend: full folder structure, all route stubs, middleware (auth, authorize, validate, error, rate-limit), utils (AppError, asyncHandler, apiResponse, pagination), config (env, database, cloudinary)
- Frontend: Next.js 14 App Router, Redux Toolkit store, Axios client with token refresh, feature folder structure, shared types and utils
- Telegram client: grammY bot entry point, command/callback stubs, API client
- Environment: .env.example files for all three packages
- Docs: root README with setup instructions, phase roadmap, API reference
- Verification: backend tsc clean, frontend next build clean
```
