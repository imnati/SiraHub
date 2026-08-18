# PHASE 8 — CHAT, FILE UPLOADS & EMAIL INTEGRATION

## Objective

Implement communication and document infrastructure.

## Chat

Implement private messaging:

Employer ↔ Job Seeker

Features:

* send message
* receive message
* conversation list
* online status
* read receipts
* file attachments

Design the system so real-time communication can be introduced cleanly if required.

If WebSockets/Socket.IO are used, integrate them cleanly without breaking the REST API.

## File Uploads

Use:

* Multer
* Cloudinary

Support:

* profile pictures
* company logos
* resumes
* certificates
* application documents
* chat attachments

Validate:

* MIME type
* file size
* file extension
* authorization

Do not trust client-provided file metadata blindly.

## Email Service

Implement reusable Nodemailer email functionality.

Support emails for:

* email verification
* password reset
* application confirmation
* application status changes
* interview invitations
* relevant employer notifications

Create reusable email templates.

## Notifications

Ensure email and in-app notifications are separated appropriately.

## Security

Pay special attention to uploaded files.

Do not expose sensitive documents to unauthorized users.

## Testing

Test:

* message sending
* conversation retrieval
* authorization
* file upload
* invalid files
* large files
* email sending
* notification creation

## Completion

Provide:

* chat architecture
* file upload architecture
* Cloudinary integration
* email service
* security considerations
* tests
* known issues
* Git commit message
