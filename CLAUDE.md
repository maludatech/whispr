@AGENTS.md

```markdown
# Whispr — Claude Code Context

## Project Overview

Whispr is a playful anonymous multimedia sharing
platform. Think NGL.link but users can send text,
images, audio, and video anonymously to a
personalised link.

## Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM
- PostgreSQL via Neon
- Auth.js v5 for authentication
- Supabase Storage for media uploads
- ShadCN UI for components

## Project Structure
```

whispr/
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ └── register/
│ ├── (dashboard)/
│ │ └── dashboard/
│ ├── [username]/ # public anonymous link
│ └── api/
├── components/
├── lib/
│ ├── auth.ts
│ ├── db.ts
│ └── supabase.ts
├── prisma/
│ └── schema.prisma
└── types/

```

## Database Models

### User
- id (uuid)
- username (unique)
- email (unique)
- password (hashed)
- createdAt

### Message
- id (uuid)
- receiverId (FK → User)
- type (text | image | audio | video)
- content (text, nullable)
- mediaUrl (nullable)
- createdAt
- NO sender identity stored

## Core Features (MVP only)
1. Auth — register and login with email/password
2. Each user gets a unique public link:
   whispr.vercel.app/[username]
3. Anyone can visit that link and send:
   - Text messages
   - Images (max 10MB)
   - Audio recordings (max 20MB)
   - Video uploads (max 50MB)
4. Owner dashboard to view all received messages
5. Loading, error, and empty states throughout

## Design Guidelines
- Playful but clean aesthetic
- Dark mode by default
- Mobile responsive
- Geist font
- Subtle gradients and rounded corners
- CSS variables for theming

## Key Decisions
- No sender identity stored — truly anonymous
- Rate limiting on /[username] submission route
- Supabase Storage for media (not local filesystem)
- Auth.js v5 for session management
- Prisma for type-safe database access

## Environment Variables Needed
```

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

```

## Development Rules
- Mobile first, desktop second
- No feature creep — MVP only
- Every route needs loading and error states
- File uploads must validate type and size
- Rate limit anonymous submissions
- Never expose receiver's email to public routes
```
