# PHASE 3 — AUTHENTICATION & AUTHORIZATION

## Objective

Implement a secure authentication and role-based authorization system.

## Authentication Features

Implement:

* Register
* Login
* Logout
* Forgot password
* Reset password
* Email verification
* JWT authentication
* Access token
* Refresh token
* Get current profile
* Update profile

## Registration

Support registration for:

* Job Seeker
* Employer

Validate:

* name
* email
* password
* role

Hash passwords using bcrypt.

Never store plaintext passwords.

## Login

Implement secure login.

Return appropriate authentication information.

Do not expose:

* password hashes
* sensitive tokens unnecessarily
* internal errors

## JWT

Implement:

* access token
* refresh token
* token verification
* expiration
* authentication middleware

Protect refresh tokens appropriately.

## Role-Based Access Control

Create middleware such as:

* authenticate
* authorize

Support:

* guest
* job_seeker
* employer
* admin

Authorization must be enforced on the backend.

Example:

Only employers can create jobs.

Only admins can verify employers.

Only job seekers can apply to jobs.

## Email Verification

Implement:

* verification token
* verification email
* verification endpoint
* expiration
* invalid token handling
* already verified handling

Use Nodemailer through a reusable email service.

## Password Reset

Implement:

* forgot-password request
* reset token
* expiration
* reset password
* invalid/expired token handling

Never expose whether sensitive account information exists unnecessarily.

## Frontend

Implement:

* login page
* registration page
* forgot password page
* reset password page
* verification flow
* protected routes
* role-aware navigation
* authentication state

Use proper loading and error states.

## Testing

Test:

* successful registration
* duplicate email
* login
* incorrect password
* protected endpoint
* expired token
* invalid token
* role restrictions
* email verification
* password reset

## Completion

Provide:

* authentication architecture
* endpoints
* middleware
* frontend authentication flow
* security decisions
* tests performed
* known issues
* Git commit message

Do not start Job Management.
