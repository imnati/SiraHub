# PHASE 6 — JOB APPLICATIONS & HIRING WORKFLOW

## Objective

Implement the complete job application lifecycle.

## Job Seeker

Implement:

* Apply to job
* Resume selection/upload
* Cover letter
* Portfolio link
* Additional documents
* Application confirmation
* View applications
* Track application status

Prevent:

* applying to closed jobs
* applying after deadline
* duplicate applications

## Application Status

Implement:

* Applied
* Reviewing
* Shortlisted
* Interview
* Accepted
* Rejected

Ensure only authorized employers can modify applications for their jobs.

## Employer

Implement:

* applicant list
* applicant details
* resume download/view
* application review
* shortlist
* reject
* invite for interview
* accept/hire candidate

## Application Dashboard

Job seeker dashboard should show:

* job
* company
* application date
* current status
* relevant actions

Employer dashboard should show:

* job
* applicant count
* applicant statuses
* filtering
* sorting

## Interview Workflow

Prepare the application system for:

* interview invitation
* interview date/time
* interview status
* candidate notification

## Notifications

Create notifications for important application events.

Examples:

* application submitted
* application reviewed
* shortlisted
* interview invitation
* rejected
* accepted

## Testing

Test the entire lifecycle:

Job seeker:

Apply
→ Applied
→ Employer reviews
→ Shortlisted
→ Interview
→ Accepted/Rejected

Verify authorization at every stage.

## Completion

Provide:

* application architecture
* endpoints
* frontend pages
* status transition rules
* notifications created
* tests
* known issues
* Git commit message
