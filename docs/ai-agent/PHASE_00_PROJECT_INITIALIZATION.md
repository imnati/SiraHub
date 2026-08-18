# PHASE 0 — PROJECT INITIALIZATION & ARCHITECTURE

You are now starting Phase 0 of the SiraHub Connect project.

## Objective

Prepare a clean, scalable full-stack project structure before implementing business features.

## Tasks

First inspect the existing repository thoroughly.

Determine:

* Current frontend framework
* Current backend framework
* Existing folders
* Existing dependencies
* Existing configuration
* Existing environment files
* Existing database setup
* Existing API setup
* Existing components
* Existing routes
* Existing code that can be reused

Do not delete or rewrite existing working code unnecessarily.

## Architecture

Prepare the project for:

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios
* React Hook Form
* Zod
* Redux Toolkit or Context API

Backend:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary
* Nodemailer

## Required Structure

Create a clean architecture appropriate for the project.

The frontend should separate:

* pages/routes
* reusable components
* features
* API services
* hooks
* state
* validation schemas
* types
* utilities

The backend should separate:

* routes
* controllers
* services
* models
* middleware
* validators
* utilities
* configuration

## Environment

Create appropriate environment variable structures.

Create `.env.example` files.

Never put real secrets into source code.

## Documentation

Create or update a project README explaining:

* project purpose
* technology stack
* project structure
* local development setup
* environment variables
* how to run frontend
* how to run backend

## Verification

Make sure:

* frontend starts
* backend starts
* database connection configuration is valid
* no obvious TypeScript/build errors exist
* frontend can communicate with backend architecture-wise

Do not implement authentication, jobs, applications, dashboards, chat, or other business features yet.

## Completion Report

At the end report:

* files created
* files modified
* dependencies added
* architecture decisions
* commands used for verification
* remaining issues
* suggested Git commit message

Do not start Phase 1.
