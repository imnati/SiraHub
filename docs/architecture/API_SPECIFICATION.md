# SiraHub — API Specification

## Conventions

**Base URL:** `/api`

**Authentication:** All protected endpoints require `Authorization: Bearer <accessToken>` header
or `accessToken` cookie. The access token has a 15-minute TTL.

**Response envelope** (all endpoints):
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": <payload>,
  "pagination": {              // present on paginated list endpoints only
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [                 // present on validation failures (400)
    { "field": "email", "message": "Invalid email" }
  ]
}
```

**HTTP Status Codes:**
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request / Validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (authenticated but wrong role/ownership) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 501 | Not Implemented (Phase 0 stubs) |

**Pagination query params (list endpoints):**
- `page` — integer, default 1
- `limit` — integer, default 10, max 50

---

## 1. Authentication (`/api/auth`)

Rate limited to 20 req / 15 min per IP.

### POST /api/auth/register
Register a new user account.

**Auth:** None
**Body:**
```json
{
  "name": "Abebe Girma",
  "email": "abebe@example.com",
  "password": "SecureP@ss1",
  "role": "jobseeker"          // "jobseeker" | "employer"
}
```
**Response 201:**
```json
{
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "jobseeker" }
  }
}
```
**Notes:** Sends email verification link. User cannot apply/post until email is verified.
**Errors:** 400 (validation), 409 (email already exists)

---

### POST /api/auth/login
```json
// Body
{ "email": "abebe@example.com", "password": "SecureP@ss1" }

// Response 200
{
  "data": {
    "accessToken": "eyJ...",
    "user": { "_id": "...", "name": "...", "email": "...", "role": "...", "isEmailVerified": true }
  }
}
```
**Notes:** Refresh token is set as `HttpOnly; Secure; SameSite=Strict` cookie named `refreshToken`.
**Errors:** 400 (validation), 401 (invalid credentials), 403 (account banned)

---

### POST /api/auth/logout
**Auth:** Optional (clears cookie)
**Body:** none
**Response 200:** `{ "data": null }`
**Notes:** Invalidates refresh token hash in DB and clears `refreshToken` cookie.

---

### POST /api/auth/refresh-token
**Auth:** `refreshToken` cookie
**Body:** none
**Response 200:**
```json
{ "data": { "accessToken": "eyJ..." } }
```
**Errors:** 401 (missing/invalid/expired refresh token)

---

### GET /api/auth/verify-email/:token
**Auth:** None
**Response 200:** `{ "data": { "message": "Email verified successfully" } }`
**Errors:** 400 (invalid/expired token)

---

### POST /api/auth/forgot-password
```json
// Body
{ "email": "abebe@example.com" }
// Response 200
{ "data": { "message": "If that email exists, a reset link has been sent." } }
```
**Notes:** Vague response to prevent email enumeration.

---

### POST /api/auth/reset-password
```json
// Body
{ "token": "reset_token_from_email", "password": "NewSecureP@ss1" }
// Response 200
{ "data": { "message": "Password reset successful" } }
```
**Errors:** 400 (invalid/expired token, weak password)

---

## 2. Users / Profile (`/api/users`)

### GET /api/users/me
**Auth:** Required | **Role:** Any
**Response 200:**
```json
{
  "data": {
    "_id": "...", "name": "...", "email": "...", "role": "jobseeker",
    "avatar": "...", "phone": "...", "location": "Addis Ababa",
    "bio": "...", "isEmailVerified": true,
    "jobSeekerProfile": { "headline": "...", "skills": [...], "experience": [...], ... }
  }
}
```

---

### PUT /api/users/me
**Auth:** Required | **Role:** Any
**Body:** Partial user fields (name, phone, location, bio, jobSeekerProfile fields)
**Response 200:** Updated user object
**Errors:** 400 (validation)

---

### POST /api/users/me/experience
**Auth:** Required | **Role:** jobseeker
**Body:** `{ company, title, location, startDate, endDate, isCurrent, description }`
**Response 201:** Updated experience array

### PUT /api/users/me/experience/:expId
### DELETE /api/users/me/experience/:expId

---

### POST /api/users/me/education
### PUT /api/users/me/education/:eduId
### DELETE /api/users/me/education/:eduId
Same pattern as experience.

---

### POST /api/users/me/skills
**Body:** `{ skills: ["skillId1", "skillId2"] }` — replaces skill list
**Response 200:** Updated skills array (populated)

---

### PUT /api/users/me/password
**Auth:** Required | **Role:** Any
**Body:** `{ currentPassword: "...", newPassword: "..." }`
**Response 200:** `{ "data": null }`

---

### DELETE /api/users/me
**Auth:** Required | **Role:** jobseeker | employer
**Body:** `{ password: "..." }` — confirmation
**Response 204**

---

## 3. Jobs (`/api/jobs`)

### GET /api/jobs
**Auth:** None (public)
**Query params:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Keyword search (title, description) |
| `category` | ObjectId | Filter by category |
| `location` | string | Filter by city |
| `employmentType` | string | full-time, part-time, etc. |
| `experienceLevel` | string | entry, junior, etc. |
| `salaryMin` | number | Minimum salary |
| `salaryMax` | number | Maximum salary |
| `isRemote` | boolean | Remote jobs only |
| `company` | ObjectId | Filter by company |
| `skills` | string | Comma-separated skill ids |
| `status` | string | Default `active` (public); admin can query all |
| `sort` | string | `latest`(default), `salary`, `deadline`, `popular` |
| `page` | number | |
| `limit` | number | |

**Response 200:** Paginated list of jobs with populated company and category.

---

### GET /api/jobs/:id
**Auth:** None (public)
**Response 200:** Full job document with populated company, category, skills.
**Side effect:** Increments `viewCount` (non-blocking)
**Errors:** 404

---

### POST /api/jobs
**Auth:** Required | **Role:** employer
**Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "...",
  "requirements": ["5+ years experience", "BSc in CS"],
  "category": "categoryId",
  "skills": ["skillId1", "skillId2"],
  "employmentType": "full-time",
  "experienceLevel": "senior",
  "educationLevel": "bachelors",
  "location": { "city": "Addis Ababa", "isRemote": false },
  "salary": { "min": 50000, "max": 80000, "currency": "ETB", "period": "monthly" },
  "deadline": "2026-12-31"
}
```
**Response 201:** Created job
**Errors:** 400, 403 (company not verified)

---

### PUT /api/jobs/:id
**Auth:** Required | **Role:** employer (must own job)
**Body:** Partial job fields
**Response 200:** Updated job
**Errors:** 400, 403, 404

---

### DELETE /api/jobs/:id
**Auth:** Required | **Role:** employer (must own) | admin
**Response 204**
**Notes:** Only draft jobs can be deleted; active/closed jobs are archived

---

### POST /api/jobs/:id/duplicate
**Auth:** Required | **Role:** employer (must own)
**Response 201:** New job draft copied from source
**Notes:** Status reset to `draft`, deadline cleared

---

### PATCH /api/jobs/:id/status
**Auth:** Required | **Role:** employer (must own)
**Body:** `{ "status": "paused" | "active" | "closed" }`
**Response 200:** Updated job

---

## 4. Applications (`/api/applications`)

### POST /api/applications
**Auth:** Required | **Role:** jobseeker
**Body:**
```json
{
  "jobId": "...",
  "cvUrl": "...",           // URL of already-uploaded CV
  "coverLetter": "...",
  "portfolioUrl": "...",
  "additionalDocs": [{ "name": "...", "url": "..." }]
}
```
**Response 201:** Created application
**Errors:** 400, 409 (already applied), 403 (email not verified, job not active)

---

### GET /api/applications
**Auth:** Required
**Role behaviour:**
- `jobseeker` → own applications only
- `employer` → applications for own jobs (filter by `jobId` required)
- `admin` → all applications

**Query params:** `jobId`, `status`, `page`, `limit`
**Response 200:** Paginated applications list

---

### GET /api/applications/:id
**Auth:** Required
**Role:** jobseeker (own) | employer (for own job) | admin
**Response 200:** Full application with populated job, applicant (safe fields only)
**Errors:** 403, 404

---

### PATCH /api/applications/:id/status
**Auth:** Required | **Role:** employer (for own job)
**Body:** `{ "status": "reviewing" | "shortlisted" | "interview" | "accepted" | "rejected", "note": "..." }`
**Response 200:** Updated application
**Notes:** Triggers notification to applicant on status change.
**Errors:** 400 (invalid transition), 403, 404

---

### PATCH /api/applications/:id/interview
**Auth:** Required | **Role:** employer (for own job)
**Body:** `{ "scheduledAt": "ISO date", "format": "video", "location": "...", "meetingUrl": "...", "notes": "..." }`
**Response 200:** Updated application
**Notes:** Triggers interview invitation notification.

---

### DELETE /api/applications/:id
**Auth:** Required | **Role:** jobseeker (own, withdraw)
**Response 200:** `{ "data": { "message": "Application withdrawn" } }`
**Notes:** Sets `isWithdrawn: true`. Cannot withdraw if status is `accepted` or `rejected`.

---

## 5. Companies (`/api/companies`)

### GET /api/companies
**Auth:** None (public)
**Query:** `q` (name search), `industry`, `location`, `isVerified`, `page`, `limit`
**Response 200:** Paginated list

---

### GET /api/companies/:id
**Auth:** None (public)
**Response 200:** Company + stats (job count, average rating)
**Errors:** 404

---

### POST /api/companies
**Auth:** Required | **Role:** employer
**Body:** `{ name, description, website, email, phone, industry, size, founded, location, socialLinks }`
**Response 201:** Created company
**Notes:** One company per employer. New company is unverified.
**Errors:** 400, 409 (company already exists for this user)

---

### PUT /api/companies/mine
**Auth:** Required | **Role:** employer
**Body:** Partial company fields
**Response 200:** Updated company

---

### GET /api/companies/mine
**Auth:** Required | **Role:** employer
**Response 200:** Own company document

---

## 6. Categories (`/api/categories`)

### GET /api/categories
**Auth:** None (public)
**Response 200:** All active categories sorted by `jobCount` desc

### GET /api/categories/:id
**Auth:** None (public)
**Response 200:** Category + jobs in that category (paginated)

### POST /api/categories
**Auth:** Required | **Role:** admin
**Body:** `{ name, description, icon }`
**Response 201:** Created category

### PUT /api/categories/:id
**Auth:** Required | **Role:** admin
**Response 200:** Updated category

### DELETE /api/categories/:id
**Auth:** Required | **Role:** admin
**Response 204**
**Notes:** Soft delete (`isActive: false`). Jobs in this category are not affected.

---

## 7. Skills (`/api/skills`)

### GET /api/skills
**Auth:** None (public)
**Query:** `q` (search), `category`
**Response 200:** List of skills

### POST /api/skills
**Auth:** Required | **Role:** admin
**Body:** `{ name, category }`
**Response 201**

### PUT /api/skills/:id
**Auth:** Required | **Role:** admin
**Response 200**

### DELETE /api/skills/:id
**Auth:** Required | **Role:** admin
**Response 204**

---

## 8. Saved Jobs (`/api/saved-jobs`)

### GET /api/saved-jobs
**Auth:** Required | **Role:** jobseeker
**Response 200:** Paginated list of saved jobs (populated)

### POST /api/saved-jobs
**Auth:** Required | **Role:** jobseeker
**Body:** `{ "jobId": "..." }`
**Response 201:** Saved job
**Errors:** 409 (already saved), 404 (job not found)

### DELETE /api/saved-jobs/:jobId
**Auth:** Required | **Role:** jobseeker
**Response 204**
**Errors:** 404

---

## 9. Notifications (`/api/notifications`)

### GET /api/notifications
**Auth:** Required | **Role:** Any
**Query:** `isRead` (boolean filter), `page`, `limit`
**Response 200:** Paginated notifications + unread count in metadata

### PATCH /api/notifications/:id/read
**Auth:** Required | **Role:** Any (own notifications)
**Response 200:** Updated notification

### PATCH /api/notifications/read-all
**Auth:** Required | **Role:** Any
**Response 200:** `{ "data": { "markedCount": 5 } }`

### DELETE /api/notifications/:id
**Auth:** Required | **Role:** Any (own only)
**Response 204**

---

## 10. Messages (`/api/messages`)

### GET /api/messages/conversations
**Auth:** Required | **Role:** jobseeker | employer
**Response 200:** List of unique conversations with latest message and unread count

### GET /api/messages/:conversationId
**Auth:** Required | **Role:** Participant in conversation only
**Query:** `page`, `limit`
**Response 200:** Paginated messages in thread, oldest-first

### POST /api/messages
**Auth:** Required | **Role:** jobseeker | employer
**Body:**
```json
{
  "recipientId": "...",
  "body": "Hello, I saw your application...",
  "jobContext": "jobId",              // optional
  "applicationContext": "appId",     // optional
  "attachments": []
}
```
**Response 201:** Created message
**Errors:** 400, 403 (messaging restricted — must have a job/application relationship)

### PATCH /api/messages/:conversationId/read
**Auth:** Required
**Response 200:** `{ "data": { "markedCount": 3 } }`

---

## 11. Reviews (`/api/reviews`)

### GET /api/reviews/company/:companyId
**Auth:** None (public)
**Query:** `page`, `limit`, `sort` (recent | rating)
**Response 200:** Paginated reviews + average rating

### POST /api/reviews/company/:companyId
**Auth:** Required | **Role:** jobseeker
**Body:** `{ rating, title, body, pros, cons, isAnonymous }`
**Response 201:** Created review
**Errors:** 409 (already reviewed), 403

### PUT /api/reviews/:id
**Auth:** Required | **Role:** jobseeker (own review)
**Response 200**

### DELETE /api/reviews/:id
**Auth:** Required | **Role:** jobseeker (own) | admin
**Response 204**

---

## 12. Admin (`/api/admin`)

All endpoints require `authenticate` + `authorize('admin')`.

### GET /api/admin/dashboard
**Response 200:**
```json
{
  "data": {
    "stats": {
      "totalUsers": 1240,
      "totalJobs": 380,
      "totalCompanies": 95,
      "totalApplications": 4500,
      "activeJobs": 210,
      "newUsersThisWeek": 45
    },
    "recentJobs": [...],
    "recentApplications": [...]
  }
}
```

### GET /api/admin/users
**Query:** `role`, `isActive`, `q` (name/email search), `page`, `limit`
**Response 200:** Paginated users

### GET /api/admin/users/:id
**Response 200:** Full user detail

### PATCH /api/admin/users/:id/ban
**Body:** `{ "reason": "..." }`
**Response 200**

### PATCH /api/admin/users/:id/unban
**Response 200**

### DELETE /api/admin/users/:id
**Response 204**

### GET /api/admin/companies
**Query:** `isVerified`, `q`, `page`, `limit`
**Response 200:** Paginated companies

### PATCH /api/admin/companies/:id/verify
**Body:** `{ "approved": true | false, "note": "..." }`
**Response 200**

### DELETE /api/admin/companies/:id
**Response 204**

### GET /api/admin/jobs
**Query:** `status`, `company`, `category`, `page`, `limit`
**Response 200:** Paginated jobs (all statuses)

### DELETE /api/admin/jobs/:id
**Response 204**

### PATCH /api/admin/jobs/:id/feature
**Body:** `{ "isFeatured": true | false }`
**Response 200**

### GET /api/admin/analytics
**Query:** `period` (7d | 30d | 90d | 365d)
**Response 200:**
```json
{
  "data": {
    "userGrowth": [{ "date": "2026-01-01", "count": 12 }],
    "jobGrowth": [...],
    "applicationsByStatus": { "applied": 400, "accepted": 80, ... },
    "topCategories": [{ "name": "Software & IT", "count": 95 }],
    "topCompanies": [{ "name": "Safaricom Ethiopia", "applications": 320 }],
    "hiringRate": 0.18
  }
}
```

---

## 13. File Uploads (`/api/uploads`)

### POST /api/uploads/avatar
**Auth:** Required | **Role:** Any
**Content-Type:** `multipart/form-data`
**Field:** `avatar` (image — jpg/png/webp, max 2MB)
**Response 201:** `{ "data": { "url": "...", "publicId": "..." } }`

### POST /api/uploads/cv
**Auth:** Required | **Role:** jobseeker
**Field:** `cv` (PDF, max 5MB)
**Response 201:** `{ "data": { "url": "...", "publicId": "..." } }`

### POST /api/uploads/certificate
**Auth:** Required | **Role:** jobseeker
**Field:** `certificate` (PDF/image, max 5MB)
**Response 201:** `{ "data": { "url": "...", "publicId": "..." } }`

### POST /api/uploads/logo
**Auth:** Required | **Role:** employer
**Field:** `logo` (image, max 2MB)
**Response 201:** `{ "data": { "url": "...", "publicId": "..." } }`

### DELETE /api/uploads/:publicId
**Auth:** Required | **Role:** Any (own files only)
**Response 204**

---

## Route Summary Table

| Method | Endpoint | Auth | Role | Phase |
|---|---|---|---|---|
| POST | /auth/register | No | — | 3 |
| POST | /auth/login | No | — | 3 |
| POST | /auth/logout | No | — | 3 |
| POST | /auth/refresh-token | Cookie | — | 3 |
| GET | /auth/verify-email/:token | No | — | 3 |
| POST | /auth/forgot-password | No | — | 3 |
| POST | /auth/reset-password | No | — | 3 |
| GET | /users/me | Yes | Any | 5 |
| PUT | /users/me | Yes | Any | 5 |
| POST | /users/me/experience | Yes | jobseeker | 5 |
| PUT | /users/me/experience/:id | Yes | jobseeker | 5 |
| DELETE | /users/me/experience/:id | Yes | jobseeker | 5 |
| POST | /users/me/education | Yes | jobseeker | 5 |
| PUT | /users/me/education/:id | Yes | jobseeker | 5 |
| DELETE | /users/me/education/:id | Yes | jobseeker | 5 |
| POST | /users/me/skills | Yes | jobseeker | 5 |
| PUT | /users/me/password | Yes | Any | 3 |
| DELETE | /users/me | Yes | jobseeker/employer | 5 |
| GET | /jobs | No | — | 4 |
| GET | /jobs/:id | No | — | 4 |
| POST | /jobs | Yes | employer | 4 |
| PUT | /jobs/:id | Yes | employer | 4 |
| DELETE | /jobs/:id | Yes | employer/admin | 4 |
| POST | /jobs/:id/duplicate | Yes | employer | 4 |
| PATCH | /jobs/:id/status | Yes | employer | 4 |
| POST | /applications | Yes | jobseeker | 6 |
| GET | /applications | Yes | Any | 6 |
| GET | /applications/:id | Yes | Any | 6 |
| PATCH | /applications/:id/status | Yes | employer | 6 |
| PATCH | /applications/:id/interview | Yes | employer | 6 |
| DELETE | /applications/:id | Yes | jobseeker | 6 |
| GET | /companies | No | — | 4 |
| GET | /companies/:id | No | — | 4 |
| POST | /companies | Yes | employer | 4 |
| GET | /companies/mine | Yes | employer | 4 |
| PUT | /companies/mine | Yes | employer | 4 |
| GET | /categories | No | — | 4 |
| GET | /categories/:id | No | — | 4 |
| POST | /categories | Yes | admin | 4 |
| PUT | /categories/:id | Yes | admin | 4 |
| DELETE | /categories/:id | Yes | admin | 4 |
| GET | /skills | No | — | 4 |
| POST | /skills | Yes | admin | 4 |
| PUT | /skills/:id | Yes | admin | 4 |
| DELETE | /skills/:id | Yes | admin | 4 |
| GET | /saved-jobs | Yes | jobseeker | 5 |
| POST | /saved-jobs | Yes | jobseeker | 5 |
| DELETE | /saved-jobs/:jobId | Yes | jobseeker | 5 |
| GET | /notifications | Yes | Any | 8 |
| PATCH | /notifications/:id/read | Yes | Any | 8 |
| PATCH | /notifications/read-all | Yes | Any | 8 |
| DELETE | /notifications/:id | Yes | Any | 8 |
| GET | /messages/conversations | Yes | js/employer | 8 |
| GET | /messages/:conversationId | Yes | js/employer | 8 |
| POST | /messages | Yes | js/employer | 8 |
| PATCH | /messages/:conversationId/read | Yes | js/employer | 8 |
| GET | /reviews/company/:id | No | — | 5 |
| POST | /reviews/company/:id | Yes | jobseeker | 5 |
| PUT | /reviews/:id | Yes | jobseeker | 5 |
| DELETE | /reviews/:id | Yes | js/admin | 5 |
| POST | /uploads/avatar | Yes | Any | 5 |
| POST | /uploads/cv | Yes | jobseeker | 5 |
| POST | /uploads/certificate | Yes | jobseeker | 5 |
| POST | /uploads/logo | Yes | employer | 5 |
| DELETE | /uploads/:publicId | Yes | Any | 5 |
| GET | /admin/dashboard | Yes | admin | 7 |
| GET | /admin/users | Yes | admin | 7 |
| GET | /admin/users/:id | Yes | admin | 7 |
| PATCH | /admin/users/:id/ban | Yes | admin | 7 |
| PATCH | /admin/users/:id/unban | Yes | admin | 7 |
| DELETE | /admin/users/:id | Yes | admin | 7 |
| GET | /admin/companies | Yes | admin | 7 |
| PATCH | /admin/companies/:id/verify | Yes | admin | 7 |
| DELETE | /admin/companies/:id | Yes | admin | 7 |
| GET | /admin/jobs | Yes | admin | 7 |
| DELETE | /admin/jobs/:id | Yes | admin | 7 |
| PATCH | /admin/jobs/:id/feature | Yes | admin | 7 |
| GET | /admin/analytics | Yes | admin | 7 |
