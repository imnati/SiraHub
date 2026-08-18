# PHASE 1 — REQUIREMENTS, DATABASE DESIGN & UI ARCHITECTURE

## Objective

Turn the SiraHub Connect specification into a concrete technical design before implementing the main features.

## Tasks

Review the master specification and current repository.

### 1. Requirements

Create a structured feature map for:

* Guest
* Job Seeker
* Employer
* Admin

Map each role to:

* pages
* actions
* API requirements
* database requirements
* permissions

### 2. Database Design

Design MongoDB/Mongoose schemas for:

* User
* Company
* Job
* Application
* Category
* Skill
* Notification
* SavedJob
* Review
* Message

Define:

* fields
* data types
* required fields
* enums
* references
* indexes
* timestamps
* validation
* relationships

Pay particular attention to:

User → Applications
User → Saved Jobs
User → Messages
Company → Jobs
Job → Applications
Job → Category
Job → Skills
Application → Job
Application → Applicant

### 3. ERD

Create an ERD representation of the database.

If the repository supports documentation diagrams, add the ERD to the project documentation.

### 4. API Design

Create an API specification for:

* Authentication
* Users/Profile
* Jobs
* Applications
* Companies
* Categories
* Skills
* Saved Jobs
* Notifications
* Messages
* Reviews
* Admin

For each endpoint document:

* HTTP method
* URL
* authentication requirement
* role requirement
* request body/query parameters
* response
* possible errors

### 5. Frontend Route Architecture

Design routes for:

Public:

* /
* /about
* /contact
* /jobs
* /companies
* /categories
* /login
* /register
* /faq
* /privacy
* /terms

Job seeker:

* dashboard
* profile
* resume
* saved jobs
* applications
* notifications
* messages
* settings

Employer:

* dashboard
* company profile
* jobs
* jobs/create
* applicants
* interviews
* messages
* analytics
* subscription
* settings

Admin:

* dashboard
* users
* employers
* jobs
* categories
* skills
* reports
* analytics
* settings

### 6. UI Architecture

Design the reusable component system.

Identify:

* Navbar
* Footer
* JobCard
* JobList
* SearchBar
* FilterPanel
* CompanyCard
* Profile components
* Form components
* Modal
* Toast
* Pagination
* Dashboard sidebar
* Tables
* Status badges
* Loading states
* Empty states
* Error states

Do not implement every feature yet.

## Important

This phase is primarily planning and architecture.

Do not build the complete application.

Produce a clear blueprint that Phase 2 and later phases can follow.

## Completion Report

Provide:

* requirements map
* database design
* ERD
* API specification
* frontend route structure
* UI component architecture
* unresolved decisions
* recommended next phase

Suggested Git commit:

`docs: define project architecture, ERD and API specification`
