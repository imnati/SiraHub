# SiraHub — Entity Relationship Diagram

## Mermaid ERD

Render this diagram at [mermaid.live](https://mermaid.live) or any Mermaid-compatible viewer.

```mermaid
erDiagram

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        string avatar
        string phone
        string location
        string bio
        boolean isEmailVerified
        boolean isActive
        object jobSeekerProfile
        date createdAt
        date updatedAt
    }

    COMPANY {
        ObjectId _id PK
        ObjectId owner FK
        string name UK
        string slug UK
        string logo
        string description
        string website
        string industry
        string size
        object location
        boolean isVerified
        boolean isActive
        date createdAt
        date updatedAt
    }

    JOB {
        ObjectId _id PK
        ObjectId company FK
        ObjectId postedBy FK
        ObjectId category FK
        string title
        string slug UK
        string description
        string employmentType
        string experienceLevel
        string educationLevel
        object location
        object salary
        date deadline
        string status
        boolean isFeatured
        int viewCount
        int applicationCount
        date createdAt
        date updatedAt
    }

    APPLICATION {
        ObjectId _id PK
        ObjectId job FK
        ObjectId applicant FK
        ObjectId company FK
        string cvUrl
        string coverLetter
        string portfolioUrl
        string status
        array statusHistory
        object interview
        boolean isWithdrawn
        date createdAt
        date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name UK
        string slug UK
        string description
        int jobCount
        boolean isActive
        date createdAt
        date updatedAt
    }

    SKILL {
        ObjectId _id PK
        ObjectId category FK
        string name UK
        string slug UK
        boolean isActive
        date createdAt
        date updatedAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId recipient FK
        string type
        string title
        string body
        string link
        boolean isRead
        date createdAt
        date updatedAt
    }

    SAVEDJOB {
        ObjectId _id PK
        ObjectId user FK
        ObjectId job FK
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId company FK
        ObjectId author FK
        int rating
        string title
        string body
        boolean isAnonymous
        boolean isApproved
        date createdAt
        date updatedAt
    }

    MESSAGE {
        ObjectId _id PK
        string conversationId
        ObjectId sender FK
        ObjectId recipient FK
        ObjectId jobContext FK
        string body
        array attachments
        boolean isRead
        boolean isDeleted
        date createdAt
        date updatedAt
    }

    JOB_SKILL {
        ObjectId job FK
        ObjectId skill FK
    }

    USER_SKILL {
        ObjectId user FK
        ObjectId skill FK
    }

    %% Relationships
    USER ||--o| COMPANY           : "employer owns"
    USER ||--o{ APPLICATION       : "submits"
    USER ||--o{ SAVEDJOB          : "saves"
    USER ||--o{ NOTIFICATION      : "receives"
    USER ||--o{ MESSAGE           : "sends/receives"
    USER ||--o{ REVIEW            : "writes"

    COMPANY ||--o{ JOB            : "posts"
    COMPANY ||--o{ REVIEW         : "receives"

    JOB ||--o{ APPLICATION        : "receives"
    JOB }o--|| CATEGORY           : "belongs to"
    JOB ||--o{ JOB_SKILL          : "requires"
    JOB ||--o{ SAVEDJOB           : "bookmarked in"
    JOB ||--o{ MESSAGE            : "provides context for"

    CATEGORY ||--o{ SKILL         : "groups"

    SKILL ||--o{ JOB_SKILL        : "tagged on"
    SKILL ||--o{ USER_SKILL       : "held by"

    APPLICATION ||--o{ MESSAGE    : "provides context for"
```

---

## Relationship Narrative

### User → Company (One-to-One for Employers)
An employer (`role = 'employer'`) creates exactly one Company document. The `Company.owner` field holds the User's ObjectId. A job seeker does not have a Company.

### Company → Job (One-to-Many)
A Company can have many Job postings. `Job.company` references the Company. `Job.postedBy` references the employer User directly (useful for queries without a company join).

### Job → Category (Many-to-One)
Each Job belongs to exactly one Category. Categories are managed by admins.

### Job → Skill (Many-to-Many — embedded in Job)
A Job has an array of Skill ObjectIds (`skills: [ObjectId]`). Mongoose populates these on demand. A Skill can belong to many Jobs.

### User → Skill (Many-to-Many — embedded in User profile)
A Job Seeker's profile contains an array of Skill ObjectIds (`jobSeekerProfile.skills`). Same Skills collection is reused.

### User → Application (One-to-Many)
A Job Seeker can submit many Applications. Each Application references both the `Job` and the `applicant` (User). The `{ job, applicant }` combination is unique — no duplicate applications.

### Application → Company (Denormalized)
`Application.company` stores the Company ObjectId at application time. This makes employer dashboard queries efficient without joining through Job.

### User → SavedJob (One-to-Many)
A Job Seeker can save many Jobs. `{ user, job }` is unique — no duplicate saves.

### User → Notification (One-to-Many)
Notifications are delivered to a specific User (`recipient`). Each notification has a `type` and an optional `link` for navigation.

### User → Message (Many-to-Many via conversationId)
Two Users exchange messages. The `conversationId` is a stable string key: `[userId1, userId2].sort().join('_')`. All messages in a thread share the same `conversationId`. Optional `jobContext` and `applicationContext` fields link the conversation to a specific job or application.

### User → Review → Company (Many-to-Many via Review)
A Job Seeker writes Reviews for Companies. `{ company, author }` is unique — one review per user per company. The Review document bridges User and Company.

### Category → Skill (One-to-Many, optional)
Skills can optionally belong to a Category for grouping (e.g. "React" → "Software & IT"). This is advisory — skills can exist without a category.

---

## Index Strategy Summary

| Collection | Key Indexes |
|---|---|
| users | email (unique), role, isActive |
| companies | owner (unique), slug (unique), text(name+desc) |
| jobs | company, category, status, deadline, location.city, createdAt, text(title+desc) |
| applications | (job+applicant) unique, applicant, job, company, status |
| categories | slug (unique), isActive |
| skills | slug (unique), text(name), category |
| notifications | (recipient+isRead), (recipient+createdAt) |
| savedjobs | (user+job) unique, user+createdAt |
| reviews | (company+author) unique, company+createdAt |
| messages | (conversationId+createdAt), recipient+isRead |
