# AI AGENT INSTRUCTION

Before performing any development work, read:

1. This file: MASTER_PROMPT.md
2. PROJECT_STATE.md
3. The prompt for the current phase
4. Relevant project documentation
5. Existing source code

These documents are the source of truth for the project's architecture,
requirements, development rules, and current progress.

Never assume the current project state from conversation history alone.

Always inspect the actual repository.


# SiraHub — Master Full-Stack Development Prompt

## 1. ROLE

You are a senior full-stack software engineer, software architect, UI/UX engineer, database designer, DevOps engineer, and technical mentor.

You are helping me build a production-quality capstone project called:

SiraHub** — A Modern Ethiopian Job Marketplace**

Your job is to help me build this application incrementally and professionally.

Do NOT attempt to implement the entire project at once.

The project must be developed phase-by-phase. Only work on the phase I explicitly give you.

---

# 2. PROJECT OBJECTIVE

Build a complete job marketplace connecting Ethiopian job seekers with employers.

The platform must allow:

### Job Seekers

* Register and authenticate
* Verify their email
* Create and manage professional profiles
* Upload resumes/CVs
* Upload certificates
* Add education
* Add work experience
* Add skills
* Add languages
* Add portfolio links
* Search and filter jobs
* View job details
* Save jobs
* Apply for jobs
* Track application status
* Receive notifications
* Communicate with employers
* Receive interview invitations
* Accept interviews
* Track hiring decisions

### Employers

* Register
* Create a company profile
* Verify email
* Wait for admin/company verification where required
* Create and manage job postings
* Edit jobs
* Pause jobs
* Close jobs
* Duplicate job posts
* View applicants
* Download applicant CVs
* Review applications
* Shortlist candidates
* Schedule interviews
* Hire candidates
* Send messages
* View analytics

### Administrators

* Access an admin dashboard
* Manage users
* Manage companies
* Verify employers
* Manage jobs
* Manage categories
* Manage skills
* View reports
* View analytics
* Ban users
* Manage platform settings

---

# 3. REQUIRED TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to deviate.

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux Toolkit OR Context API
* Axios
* React Hook Form
* Zod or Yup

Prefer TypeScript.

Use a clean and scalable component architecture.

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary
* Nodemailer

## Additional Client

Implement either:

### Option A

React Native / Flutter mobile application

OR

### Option B

Telegram Bot / Telegram Mini App

The additional client must communicate with the SAME backend API.

---

# 4. DATABASE

The main MongoDB collections should include:

* Users
* Companies
* Jobs
* Applications
* Categories
* Skills
* Notifications
* SavedJobs
* Reviews
* Messages

Design relationships carefully.

Use Mongoose schemas with:

* validation
* indexes where appropriate
* timestamps
* references
* appropriate enums
* constraints
* meaningful field names

Do not create unnecessary collections.

---

# 5. USER ROLES

Implement four roles:

## Guest

Can:

* Browse jobs
* Search jobs
* View company profiles
* Register
* Login

Cannot:

* Apply
* Post jobs

## Job Seeker

Can:

* Register
* Build profile
* Upload CV
* Upload certificates
* Save jobs
* Apply
* Track applications
* Receive notifications
* Chat with employers
* Edit profile

## Employer

Can:

* Register company
* Verify company
* Post jobs
* Edit jobs
* Close jobs
* View applicants
* Download CVs
* Schedule interviews
* Hire candidates
* Send messages

## Admin

Can:

* Manage users
* Manage companies
* Manage jobs
* Manage categories
* Manage skills
* Manage reports
* View dashboard
* View analytics
* Verify employers
* Ban users

Implement proper Role-Based Access Control.

Never rely only on frontend role checks for security.

All protected operations must also be enforced by the backend.

---

# 6. MAIN FRONTEND AREAS

## Public Pages

* Home
* About
* Contact
* Browse Jobs
* Companies
* Categories
* Login
* Register
* FAQ
* Privacy Policy
* Terms

## Job Seeker Dashboard

* Dashboard
* My Profile
* Resume
* Saved Jobs
* Applied Jobs
* Notifications
* Messages
* Account Settings

## Employer Dashboard

* Dashboard
* Company Profile
* Job Management
* Create Job
* Applicants
* Interviews
* Messages
* Analytics
* Subscription
* Settings

## Admin Dashboard

* Dashboard
* User Management
* Employer Verification
* Job Management
* Categories
* Skills
* Reports
* Analytics
* Settings

---

# 7. CORE FEATURES

## Authentication

Implement:

* Register
* Login
* Logout
* Forgot password
* Reset password
* Email verification
* JWT authentication
* Refresh token
* Protected routes
* Role-based authorization

Passwords must never be stored in plaintext.

Use bcrypt.

---

# 8. JOB MANAGEMENT

Employers must be able to:

* Create jobs
* Read jobs
* Update jobs
* Delete jobs
* Pause jobs
* Close jobs
* Duplicate jobs

Job information should include:

* Title
* Description
* Requirements
* Salary
* Experience
* Education
* Employment Type
* Deadline
* Location
* Category
* Skills
* Company
* Status
* Created date

---

# 9. JOB SEARCH

Users should be able to search/filter by:

* Keyword
* Category
* Location
* Salary
* Experience
* Job type
* Remote
* Company

Sorting:

* Latest
* Highest salary
* Deadline
* Popular

Search and filtering should be implemented efficiently on the backend.

Avoid fetching all jobs to the frontend and filtering everything with JavaScript.

---

# 10. APPLICATION SYSTEM

An application contains:

* Resume
* Cover Letter
* Portfolio Link
* Additional Documents
* Status
* Applied Date

Application statuses:

* Applied
* Reviewing
* Shortlisted
* Interview
* Accepted
* Rejected

Implement proper state transitions.

Only authorized users should be able to change application status.

---

# 11. NOTIFICATIONS

Support notifications for:

* New jobs
* Interview invitations
* Application status changes
* Employer messages
* System notifications

Users should be able to:

* View notifications
* Mark notifications as read
* See unread count

---

# 12. MESSAGING

Implement private messaging between:

**Employer ↔ Job Seeker**

Support:

* Messages
* Online status
* File sharing
* Read receipts

Design the messaging architecture so it can later support real-time communication.

---

# 13. FILE UPLOADS

Use:

* Multer
* Cloudinary

Potential uploads:

* Profile pictures
* Company logos
* CVs
* Certificates
* Application documents
* Message attachments

Validate:

* file type
* file size
* authorization
* upload errors

Do not expose sensitive files publicly without considering authorization.

---

# 14. EMAIL

Use Nodemailer for appropriate emails such as:

* Email verification
* Password reset
* Application confirmation
* Interview notifications
* Application status updates

Create a reusable email service.

---

# 15. COMPANY REVIEWS

Job seekers/employees should be able to:

* Rate companies
* Leave reviews

Implement appropriate validation and authorization.

---

# 16. ANALYTICS

Admin analytics should include:

* Jobs posted
* Active users
* Companies
* Applications
* Hiring statistics

Employer analytics can include useful job/application statistics.

Do not fabricate analytics.

Calculate them from real database data.

---

# 17. API ARCHITECTURE

Build a REST API.

Main API modules include:

### Authentication

POST /register
POST /login
POST /logout
POST /forgot-password
POST /reset-password
GET /profile
PUT /profile

### Jobs

GET /jobs
GET /jobs/
POST /jobs
PUT /jobs/
DELETE /jobs/

### Applications

POST /apply
GET /applications
PUT /applications/

### Companies

GET /companies
POST /companies
PUT /companies/

### Admin

GET /dashboard
GET /users
GET /reports

You may extend these endpoints when required by the complete application.

Use consistent:

* HTTP status codes
* response structures
* error handling
* validation
* authentication middleware
* authorization middleware

---

# 18. PROJECT ARCHITECTURE

Use a maintainable architecture.

Separate responsibilities such as:

Backend:

* routes
* controllers
* services
* models
* middleware
* validators
* utilities
* configuration
* integrations

Frontend:

* app/routes
* components
* features
* services/API
* hooks
* state management
* schemas
* types
* utilities

Avoid putting business logic directly inside React components or Express route handlers when it should belong in services.

---

# 19. CODE QUALITY RULES

Follow these rules throughout the project:

1. Write clean, readable code.
2. Prefer reusable components.
3. Avoid unnecessary duplication.
4. Use meaningful variable/function names.
5. Use TypeScript types properly.
6. Validate all external input.
7. Handle errors explicitly.
8. Never expose secrets.
9. Never hardcode API keys or passwords.
10. Use environment variables.
11. Keep frontend and backend responsibilities separated.
12. Follow REST principles.
13. Use proper HTTP status codes.
14. Protect sensitive endpoints.
15. Never trust frontend authorization.
16. Add database indexes where justified.
17. Keep code modular.
18. Avoid premature overengineering.

---

# 20. SECURITY REQUIREMENTS

Pay special attention to:

* Password hashing
* JWT security
* Refresh token security
* Authorization
* Role-based access control
* Input validation
* File upload validation
* Rate limiting where appropriate
* CORS
* Environment variables
* MongoDB injection prevention
* XSS prevention
* Secure error messages
* Authentication middleware
* Authorization middleware

Never place secrets in source code.

Create appropriate `.env.example` files without exposing real credentials.

---

# 21. UI/UX REQUIREMENTS

The website should look like a professional modern job marketplace.

Prioritize:

* Responsive design
* Mobile-first layouts
* Accessibility
* Clear navigation
* Consistent spacing
* Reusable UI components
* Loading states
* Empty states
* Error states
* Form validation
* Success feedback
* Confirmation dialogs for destructive actions
* Pagination where appropriate

Do not make every page look like a generic template.

Use a consistent visual system.

---

# 22. ETHIOPIAN CONTEXT

The platform is specifically designed for the Ethiopian job market.

Use realistic Ethiopian context where appropriate:

* Ethiopian cities
* Ethiopian companies in seed/demo data
* ETB salary examples
* Local job categories
* Addis Ababa and other Ethiopian locations

Do not invent real company partnerships, government affiliations, or official endorsements.

---

# 23. DEVELOPMENT METHOD

The project must be developed incrementally.

For every phase:

1. Inspect the current project.
2. Understand the existing architecture.
3. Do not overwrite working code unnecessarily.
4. Identify what the current phase requires.
5. Create a short implementation plan.
6. Explain important architectural decisions.
7. Implement the phase.
8. Run/build/test the affected code.
9. Fix errors.
10. Review the implementation.
11. Summarize what was changed.
12. Tell me exactly what remains for the next phase.

Do not silently move to the next phase.

---

# 24. IMPORTANT AGENT BEHAVIOR

Before writing significant code:

* inspect the repository
* inspect existing files
* inspect package.json
* inspect environment configuration
* inspect existing database models
* inspect API structure
* inspect frontend architecture

Do not assume that files or dependencies exist.

If something is unclear or genuinely requires a project-level decision, ask me before making a major architectural change.

For small implementation decisions, use sensible engineering judgment.

---

# 25. PHASE RULE

I will provide you with prompts such as:

"START PHASE 1"

or

"START PHASE 4"

or I will instruct you to read specific documentation files such as:
docs/ai-agent/MASTER_PROMPT.md, docs/ai-agent/PHASE_01_REQUIREMENTS_AND_ARCHITECTURE.md, etc.

When I give you a phase prompt, ONLY work on that phase.

Do not implement future phases unless the current phase requires a small dependency.

If a future feature must be considered architecturally, prepare the architecture for it but do not fully implement it.

---

# 26. TESTING RULE

Every phase should leave the project in a working state.

At minimum:

* Run the frontend build/type check where applicable.
* Run the backend tests or startup check where applicable.
* Test relevant API endpoints.
* Check important UI flows.
* Fix errors introduced by the current phase.

Do not claim something works unless you have actually verified it.

---

# 27. GIT RULE

Treat every phase as a logical milestone.

At the end of each phase, provide:

* What changed
* Files created
* Files modified
* Important decisions
* Tests performed
* Known issues
* Suggested Git commit message

Do NOT execute Git commits unless I explicitly ask you to.

---

# 28. CURRENT OBJECTIVE

We are building this project progressively.

Do NOT start implementation yet.

First acknowledge this master specification and inspect the existing repository.

Then wait for me to provide the first phase prompt.

Your first response should contain:

1. Your understanding of the project.
2. The architecture you recommend.
3. Any important assumptions.
4. What you found in the existing repository.
5. Confirmation that you will work phase-by-phase.

Do not start implementing features until I explicitly tell you to start Phase 0.
