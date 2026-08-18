# SiraHub — Ethiopian Job Marketplace

A modern, full-stack job marketplace connecting Ethiopian job seekers with employers.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt |
| File Storage | Cloudinary + Multer |
| Email | Nodemailer (SMTP) |
| Additional Client | Telegram Bot (grammY) |

---

## Project Structure

```
SiraHub/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # env, database, cloudinary
│   │   ├── controllers/      # HTTP request handlers
│   │   ├── middleware/       # auth, authorize, validate, error, rate-limit
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript interfaces/types
│   │   ├── utils/            # AppError, asyncHandler, apiResponse, pagination
│   │   ├── validators/       # Zod schemas
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/              # Next.js pages and layouts
│   │   ├── components/
│   │   │   ├── common/       # Shared components (Spinner, EmptyState, etc.)
│   │   │   ├── layout/       # Header, Footer, Sidebar, DashboardLayout
│   │   │   ├── providers/    # ReduxProvider, etc.
│   │   │   └── ui/           # Primitive UI components (Button, Input, etc.)
│   │   ├── features/         # Feature modules (auth, jobs, profile, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # axios client, utility functions
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── services/         # API service functions
│   │   ├── store/            # Redux store + slices
│   │   └── types/            # TypeScript types
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── telegram-client/          # Telegram Bot (grammY)
│   ├── src/
│   │   ├── api/              # Axios client for SiraHub API
│   │   ├── bot/              # Command and callback handlers
│   │   └── index.ts          # Bot entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── ai-agent/             # Phase prompts and project state
├── .gitignore
├── package.json              # Monorepo root (npm workspaces)
└── README.md
```

---

## Local Development Setup

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- SMTP credentials (e.g. Gmail App Password)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sirahub.git
cd sirahub
```

---

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

The API will start at `http://localhost:5000`.

Health check: `GET http://localhost:5000/api/health`

---

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL if needed
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`.

---

### 4. Telegram Bot setup

```bash
cd telegram-client
cp .env.example .env
# Set TELEGRAM_BOT_TOKEN and API_BASE_URL
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` / `production` / `test` |
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | Access token expiry (default: 15m) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (default: 7d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password / app password |
| `EMAIL_FROM` | Sender name and address |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:3000) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | Application name |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL |

### Telegram Client (`telegram-client/.env`)

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather |
| `API_BASE_URL` | Backend API base URL |

---

## API Endpoints

| Method | Endpoint | Description | Phase |
|---|---|---|---|
| GET | `/api/health` | Health check | 0 ✅ |
| POST | `/api/auth/register` | Register user | 3 |
| POST | `/api/auth/login` | Login | 3 |
| POST | `/api/auth/logout` | Logout | 3 |
| POST | `/api/auth/refresh-token` | Refresh access token | 3 |
| GET | `/api/jobs` | List/search jobs | 4 |
| POST | `/api/jobs` | Create job (employer) | 4 |
| GET | `/api/companies` | List companies | 4 |
| POST | `/api/applications/apply` | Apply for a job | 6 |
| GET | `/api/admin/dashboard` | Admin dashboard | 7 |

---

## Development Phases

| Phase | Description | Status |
|---|---|---|
| 0 | Project Initialization | ✅ Complete |
| 1 | Requirements & Architecture | Pending |
| 2 | Database & Backend Foundation | Pending |
| 3 | Authentication & Authorization | Pending |
| 4 | Job Management | Pending |
| 5 | Search & Profiles | Pending |
| 6 | Applications & Hiring | Pending |
| 7 | Dashboards, Admin & Analytics | Pending |
| 8 | Chat, Files & Email | Pending |
| 9 | Telegram Client | Pending |
| 10 | Testing & Security | Pending |
| 11 | Deployment & Documentation | Pending |

---

## User Roles

- **Guest** — Browse and search jobs, register, login
- **Job Seeker** — Full profile, apply for jobs, track applications, messaging
- **Employer** — Post and manage jobs, review applicants, schedule interviews
- **Admin** — Manage platform, users, companies, categories, analytics

---

## Ethiopian Context

SiraHub is designed specifically for the Ethiopian job market:
- Salary displayed in ETB (Ethiopian Birr)
- Ethiopian cities for job locations (Addis Ababa, Dire Dawa, Hawassa, etc.)
- Local industry categories relevant to the Ethiopian economy
