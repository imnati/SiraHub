# PHASE 9 — TELEGRAM CLIENT INTEGRATION

## Objective

Build the additional client using Telegram while reusing the existing SiraHub Connect backend API.

Do NOT create a second backend.

The Telegram client must communicate with the existing REST API.

## Job Seeker Features

Implement:

* registration/login or account linking
* browse latest jobs
* search jobs
* search by keyword
* search by category
* search by city
* view job details
* save favorite jobs
* apply using stored profile
* receive application status notifications
* subscribe to job alerts

Example:

"Software Engineering jobs in Addis Ababa"

## Employer Features

Implement:

* application notifications
* applicant summaries
* application status updates
* shortlist
* interview
* reject
* hire

## Admin Features

Where practical implement:

* broadcast announcements
* maintenance notifications
* flagged job review

## Architecture

Telegram client
↓
Existing REST API
↓
Existing Services
↓
MongoDB

Do not duplicate business logic unnecessarily.

## Authentication

Design a secure account-linking mechanism between Telegram users and existing platform accounts.

Do not blindly trust Telegram user IDs without validating Telegram authentication data.

## Notifications

Integrate Telegram notifications with the existing notification architecture.

## Testing

Test:

* account linking
* job search
* job details
* saving jobs
* applications
* notifications
* employer workflow

## Completion

Provide:

* Telegram architecture
* bot commands/features
* API integration
* authentication strategy
* security considerations
* tests
* deployment requirements
* Git commit message
