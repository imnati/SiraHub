# SiraHub — Database Design

## Overview

MongoDB database: `sirahub`
ORM: Mongoose 8.x with TypeScript

All schemas use:
- `timestamps: true` (createdAt, updatedAt auto-managed by Mongoose)
- Explicit indexes on all frequently queried fields
- `strict: true` (Mongoose default — rejects unknown fields)
- References using `mongoose.Schema.Types.ObjectId` with `ref`

---

## Collections Summary

| Collection | Purpose |
|---|---|
| `users` | All platform users (job seekers, employers, admins) |
| `companies` | Employer company profiles |
| `jobs` | Job postings created by employers |
| `applications` | Job applications submitted by job seekers |
| `categories` | Job categories (e.g. Software Engineering, Finance) |
| `skills` | Skills tags (e.g. React, Python, Accounting) |
| `notifications` | In-app notifications for users |
| `savedjobs` | Job seeker bookmarks |
| `reviews` | Company reviews by job seekers |
| `messages` | Private messages between employers and job seekers |

---

## 1. User Schema

**Collection:** `users`

```
users {
  _id              : ObjectId          PK, auto
  name             : String            required, trim, minLength 2, maxLength 100
  email            : String            required, unique, lowercase, trim
  password         : String            required (hashed with bcrypt, select: false)
  role             : String            enum ['jobseeker', 'employer', 'admin'], default 'jobseeker'
  avatar           : String            Cloudinary URL, optional
  phone            : String            optional, trim
  location         : String            optional (city, e.g. "Addis Ababa")
  bio              : String            optional, maxLength 500
  isEmailVerified  : Boolean           default false
  isActive         : Boolean           default true (false = banned)
  emailVerifyToken : String            select: false, optional
  emailVerifyExpiry: Date              select: false, optional
  resetPasswordToken: String           select: false, optional
  resetPasswordExpiry: Date            select: false, optional
  refreshTokenHash : String            select: false (hashed refresh token for rotation)

  -- Job Seeker specific (null for employer/admin) --
  jobSeekerProfile : {
    headline       : String            optional, e.g. "Senior Software Engineer"
    cvUrl          : String            Cloudinary URL
    cvPublicId     : String            Cloudinary public_id for deletion
    portfolioUrl   : String            optional URL
    experience     : [ExperienceEntry]
    education      : [EducationEntry]
    skills         : [ObjectId]        ref: 'Skill'
    languages      : [LanguageEntry]
    certificates   : [CertificateEntry]
    socialLinks    : {
      linkedin     : String
      github       : String
      twitter      : String
      website      : String
    }
  }

  createdAt        : Date              auto (timestamps)
  updatedAt        : Date              auto (timestamps)
}
```

#### Sub-documents

**ExperienceEntry** (embedded array, not a separate collection)
```
{
  _id         : ObjectId    auto
  company     : String      required
  title       : String      required
  location    : String      optional
  startDate   : Date        required
  endDate     : Date        optional (null = current)
  isCurrent   : Boolean     default false
  description : String      optional, maxLength 1000
}
```

**EducationEntry** (embedded)
```
{
  _id         : ObjectId    auto
  institution : String      required
  degree      : String      required  e.g. "BSc Computer Science"
  field       : String      optional
  startDate   : Date        required
  endDate     : Date        optional
  grade       : String      optional  e.g. "3.8 GPA"
  description : String      optional
}
```

**LanguageEntry** (embedded)
```
{
  language    : String      required
  proficiency : String      enum ['beginner','conversational','professional','native']
}
```

**CertificateEntry** (embedded)
```
{
  _id         : ObjectId    auto
  name        : String      required
  issuer      : String      required
  issueDate   : Date        optional
  expiryDate  : Date        optional
  fileUrl     : String      Cloudinary URL
  publicId    : String      Cloudinary public_id
}
```

#### Indexes
```
{ email: 1 }                          unique
{ role: 1 }
{ isActive: 1 }
{ 'jobSeekerProfile.skills': 1 }
```

---

## 2. Company Schema

**Collection:** `companies`

```
companies {
  _id            : ObjectId    PK, auto
  owner          : ObjectId    ref: 'User', required (the employer who created it)
  name           : String      required, unique, trim, minLength 2, maxLength 200
  slug           : String      unique, lowercase (auto-generated from name)
  logo           : String      Cloudinary URL, optional
  logoPublicId   : String      Cloudinary public_id
  description    : String      required, maxLength 2000
  website        : String      optional, URL
  email          : String      optional, contact email
  phone          : String      optional
  industry       : String      required  e.g. "Technology", "Finance"
  size           : String      enum ['1-10','11-50','51-200','201-500','501-1000','1000+']
  founded        : Number      optional, year e.g. 2015
  location       : {
    city         : String      required
    region       : String      optional  e.g. "Oromia"
    country      : String      default 'Ethiopia'
    address      : String      optional
  }
  socialLinks    : {
    linkedin     : String
    twitter      : String
    facebook     : String
  }
  isVerified     : Boolean     default false (admin must verify)
  isActive       : Boolean     default true
  verifiedAt     : Date        optional
  verifiedBy     : ObjectId    ref: 'User' (admin), optional

  createdAt      : Date        auto
  updatedAt      : Date        auto
}
```

#### Indexes
```
{ owner: 1 }                          unique (one company per employer)
{ slug: 1 }                           unique
{ name: 'text', description: 'text' } text search
{ isVerified: 1, isActive: 1 }
{ industry: 1 }
{ 'location.city': 1 }
```

---

## 3. Job Schema

**Collection:** `jobs`

```
jobs {
  _id              : ObjectId    PK, auto
  company          : ObjectId    ref: 'Company', required
  postedBy         : ObjectId    ref: 'User', required (employer user)
  title            : String      required, trim, minLength 3, maxLength 200
  slug             : String      unique, lowercase (auto-generated)
  description      : String      required, maxLength 10000
  requirements     : [String]    array of requirement strings
  responsibilities : [String]    optional
  category         : ObjectId    ref: 'Category', required
  skills           : [ObjectId]  ref: 'Skill', max 15
  employmentType   : String      enum ['full-time','part-time','contract','internship','remote','freelance']
  experienceLevel  : String      enum ['entry','junior','mid','senior','lead','executive']
  educationLevel   : String      enum ['none','high-school','diploma','bachelors','masters','phd']
  location         : {
    city           : String      required
    region         : String      optional
    country        : String      default 'Ethiopia'
    isRemote       : Boolean     default false
  }
  salary           : {
    min            : Number      optional
    max            : Number      optional
    currency       : String      default 'ETB'
    period         : String      enum ['hourly','daily','monthly','yearly'], default 'monthly'
    isNegotiable   : Boolean     default false
    isHidden       : Boolean     default false (employer can hide salary)
  }
  deadline         : Date        required (application deadline)
  status           : String      enum ['draft','active','paused','closed'], default 'draft'
  isFeatured       : Boolean     default false (admin can feature a job)
  viewCount        : Number      default 0
  applicationCount : Number      default 0 (denormalized for performance)

  createdAt        : Date        auto
  updatedAt        : Date        auto
}
```

#### Indexes
```
{ company: 1 }
{ postedBy: 1 }
{ category: 1 }
{ status: 1 }
{ deadline: 1 }
{ 'location.city': 1 }
{ employmentType: 1 }
{ experienceLevel: 1 }
{ 'salary.min': 1, 'salary.max': 1 }
{ isFeatured: 1, status: 1 }
{ createdAt: -1 }
{ title: 'text', description: 'text' }   text search
{ skills: 1 }
```

---

## 4. Application Schema

**Collection:** `applications`

```
applications {
  _id          : ObjectId    PK, auto
  job          : ObjectId    ref: 'Job', required
  applicant    : ObjectId    ref: 'User', required
  company      : ObjectId    ref: 'Company', required (denormalized for query performance)

  cvUrl        : String      required (URL to CV at time of application)
  coverLetter  : String      optional, maxLength 3000
  portfolioUrl : String      optional URL
  additionalDocs: [{
    name       : String
    url        : String      Cloudinary URL
    publicId   : String
  }]

  status       : String      enum ['applied','reviewing','shortlisted','interview','accepted','rejected']
                             default 'applied'
  statusHistory: [{
    status     : String      enum (same as above)
    changedBy  : ObjectId    ref: 'User'
    changedAt  : Date        default Date.now
    note       : String      optional
  }]

  interview    : {
    scheduledAt: Date        optional
    format     : String      enum ['in-person','video','phone'], optional
    location   : String      optional
    meetingUrl : String      optional
    notes      : String      optional
  }

  isWithdrawn  : Boolean     default false
  withdrawnAt  : Date        optional
  employerNote : String      optional (internal note, not shown to applicant)
  isRead       : Boolean     default false (employer has viewed)

  createdAt    : Date        auto
  updatedAt    : Date        auto
}
```

#### Constraints
- Unique index on `{ job, applicant }` — one application per job per user
- Status transitions enforced in service layer:
  ```
  applied → reviewing → shortlisted → interview → accepted
  applied | reviewing | shortlisted | interview → rejected
  ```

#### Indexes
```
{ job: 1, applicant: 1 }    unique
{ applicant: 1 }
{ job: 1 }
{ company: 1 }
{ status: 1 }
{ createdAt: -1 }
{ isWithdrawn: 1 }
```

---

## 5. Category Schema

**Collection:** `categories`

```
categories {
  _id         : ObjectId    PK, auto
  name        : String      required, unique, trim
  slug        : String      unique, lowercase
  description : String      optional, maxLength 500
  icon        : String      optional (icon name or URL)
  jobCount    : Number      default 0 (denormalized, updated on job create/delete)
  isActive    : Boolean     default true

  createdAt   : Date        auto
  updatedAt   : Date        auto
}
```

#### Seed Data (Ethiopian job market categories)
```
Software & IT, Finance & Accounting, Healthcare & Medical,
Education & Training, Sales & Marketing, Engineering,
Human Resources, Legal, Construction & Real Estate,
Hospitality & Tourism, NGO & Development, Government & Public Sector,
Media & Communications, Transport & Logistics, Agriculture,
Manufacturing, Banking & Insurance, Consulting
```

#### Indexes
```
{ slug: 1 }    unique
{ isActive: 1 }
{ jobCount: -1 }
```

---

## 6. Skill Schema

**Collection:** `skills`

```
skills {
  _id       : ObjectId    PK, auto
  name      : String      required, unique, trim
  slug      : String      unique, lowercase
  category  : ObjectId    ref: 'Category', optional
  isActive  : Boolean     default true

  createdAt : Date        auto
  updatedAt : Date        auto
}
```

#### Indexes
```
{ slug: 1 }     unique
{ name: 'text' } text search
{ category: 1 }
```

---

## 7. Notification Schema

**Collection:** `notifications`

```
notifications {
  _id       : ObjectId    PK, auto
  recipient : ObjectId    ref: 'User', required
  type      : String      enum ['new_job','application_status','interview_invite','message','system']
  title     : String      required, maxLength 200
  body      : String      required, maxLength 500
  link      : String      optional (frontend route to navigate to)
  isRead    : Boolean     default false
  metadata  : Mixed       optional (extra context — e.g. { jobId, applicationId })

  createdAt : Date        auto
  updatedAt : Date        auto
}
```

#### Indexes
```
{ recipient: 1, isRead: 1 }
{ recipient: 1, createdAt: -1 }
{ type: 1 }
```

#### TTL (optional, Phase 8+)
- Notifications older than 90 days can be automatically deleted via MongoDB TTL index on `createdAt`.

---

## 8. SavedJob Schema

**Collection:** `savedjobs`

```
savedjobs {
  _id       : ObjectId    PK, auto
  user      : ObjectId    ref: 'User', required
  job       : ObjectId    ref: 'Job', required

  createdAt : Date        auto
  updatedAt : Date        auto
}
```

#### Constraints
- Unique index on `{ user, job }` — cannot save the same job twice

#### Indexes
```
{ user: 1, job: 1 }    unique
{ user: 1, createdAt: -1 }
{ job: 1 }
```

---

## 9. Review Schema

**Collection:** `reviews`

```
reviews {
  _id       : ObjectId    PK, auto
  company   : ObjectId    ref: 'Company', required
  author    : ObjectId    ref: 'User', required (must be job seeker)
  rating    : Number      required, min 1, max 5, integer
  title     : String      required, maxLength 200
  body      : String      required, maxLength 2000
  pros      : String      optional, maxLength 1000
  cons      : String      optional, maxLength 1000
  isAnonymous: Boolean    default false
  isApproved : Boolean    default true (can be moderated by admin)

  createdAt : Date        auto
  updatedAt : Date        auto
}
```

#### Constraints
- Unique index on `{ company, author }` — one review per user per company

#### Indexes
```
{ company: 1, author: 1 }    unique
{ company: 1, createdAt: -1 }
{ author: 1 }
{ rating: 1 }
{ isApproved: 1 }
```

---

## 10. Message Schema

**Collection:** `messages`

```
messages {
  _id            : ObjectId    PK, auto
  conversationId : String      required (composite: sorted([userId1, userId2]).join('_'))
  sender         : ObjectId    ref: 'User', required
  recipient      : ObjectId    ref: 'User', required
  jobContext     : ObjectId    ref: 'Job', optional (message is about this job)
  applicationContext: ObjectId ref: 'Application', optional
  body           : String      optional, maxLength 2000
  attachments    : [{
    name         : String
    url          : String      Cloudinary URL
    publicId     : String
    mimeType     : String
    size         : Number      bytes
  }]
  isRead         : Boolean     default false
  readAt         : Date        optional
  isDeleted      : Boolean     default false (soft delete)

  createdAt      : Date        auto
  updatedAt      : Date        auto
}
```

#### Notes
- `conversationId` is a stable string key computed as `[senderId, recipientId].sort().join('_')`.
  This allows efficient retrieval of an entire thread without a separate Conversation collection.
- A future real-time upgrade (WebSocket/Socket.io) can use `conversationId` as a room key.

#### Indexes
```
{ conversationId: 1, createdAt: 1 }
{ sender: 1 }
{ recipient: 1, isRead: 1 }
{ jobContext: 1 }
```

---

## Relationship Summary

```
User (1) ──────────── (1) Company          [owner field — employer has one company]
User (1) ──────────── (N) Application      [applicant field]
User (1) ──────────── (N) SavedJob         [user field]
User (1) ──────────── (N) Notification     [recipient field]
User (1) ──────────── (N) Message          [sender / recipient fields]
User (1) ──────────── (N) Review           [author field — job seeker reviews company]

Company (1) ────────── (N) Job             [company field]

Job (1) ─────────────── (N) Application    [job field]
Job (1) ─────────────── (1) Category       [category field]
Job (N) ─────────────── (N) Skill          [skills array]

Category (1) ────────── (N) Skill          [category field on Skill]
```

---

## Design Decisions

1. **Embedded sub-documents vs. separate collections**: Experience, education, languages, and certificates are embedded inside the User document. They are only ever accessed through the user profile — no independent querying needed. This avoids N+1 queries.

2. **Denormalized counters**: `Job.applicationCount` and `Category.jobCount` are stored denormalized. They are incremented/decremented in service layer transactions. This avoids expensive COUNT queries on hot read paths.

3. **Application status history**: Full history of status changes is stored in `statusHistory` array for audit trail and employer-facing timeline.

4. **conversationId in Messages**: A deterministic composite key avoids the need for a separate Conversations collection. The trade-off is that listing all conversations for a user requires a `$group` aggregation — acceptable at this scale.

5. **password and tokens use `select: false`**: These fields are never returned in queries unless explicitly selected, preventing accidental leakage in API responses.

6. **Soft deletes**: Messages support soft delete (`isDeleted`) so conversation history is preserved. Users and Jobs use `isActive`/`status` flags rather than hard deletion for data integrity.

7. **Slug fields**: Jobs, Companies, Categories, and Skills all have `slug` fields for SEO-friendly URLs.
