# PHASE 4 — JOB MANAGEMENT

## Objective

Implement the complete job management system for employers and the public job marketplace.

## Employer Features

Implement:

* Create job
* View own jobs
* View job
* Update job
* Delete job
* Pause job
* Close job
* Duplicate job

Only the employer who owns a company/job should be able to modify it.

## Job Fields

Implement:

* title
* description
* requirements
* salary
* experience
* education
* employmentType
* deadline
* location
* category
* skills
* company
* status
* createdAt

## Job Status

Design appropriate states such as:

* draft
* active
* paused
* closed
* expired

Ensure status transitions are validated.

## Public Job Marketplace

Implement:

* browse jobs
* job listing
* job details
* company information
* pagination
* loading state
* empty state
* error state

Guests must be able to browse jobs.

Guests cannot create jobs.

## Employer UI

Implement:

* employer job dashboard
* job table/list
* create job form
* edit job form
* job status controls
* delete confirmation
* duplicate job functionality

Use React Hook Form and Zod/Yup validation.

## API

Implement the job API according to the Phase 1 specification.

Use:

* controllers
* services
* validation
* authorization
* proper status codes

## Testing

Test:

* create job
* update job
* delete job
* pause job
* close job
* duplicate job
* employer ownership
* unauthorized access
* guest job browsing

## Completion

Provide:

* backend changes
* frontend changes
* API endpoints
* validation
* authorization rules
* tests
* known issues
* Git commit message

Do not start advanced search/filtering yet.
