# Whispr

Whispr is a playful anonymous multimedia sharing platform — think NGL.link, but
visitors can send text, images, audio, or video to your personal link.
Nothing about the sender is ever stored.

## How it works

1. Create an account and get a personal link: `whispr.vercel.app/your-username`
2. Share the link anywhere
3. Anyone who visits can send you a text, image, audio, or video message —
   completely anonymously
4. View everything you've received in your private dashboard

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [TailwindCSS v4](https://tailwindcss.com) + [ShadCN UI](https://ui.shadcn.com)
- [Prisma ORM](https://www.prisma.io) + [Neon](https://neon.tech) (PostgreSQL)
- [Auth.js v5](https://authjs.dev) for authentication
- [Supabase Storage](https://supabase.com/storage) for media uploads

## Project structure

```
whispr/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   └── dashboard/       # owner's private message inbox
│   ├── [username]/          # public anonymous submission page
│   └── api/
├── components/
├── lib/
│   ├── auth.ts
│   ├── db.ts                # Prisma client
│   └── supabase.ts          # Supabase client
├── prisma/
│   └── schema.prisma
└── types/
```

## Getting started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Supabase](https://supabase.com) project with a Storage bucket

### Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own values:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Secret used by Auth.js to sign sessions (`npx auth secret`) |
| `NEXTAUTH_URL` | Base URL of the app (`http://localhost:3000` in dev) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, used for uploads) |

Apply the database schema:

```bash
npx prisma migrate dev
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Limits & rules

- Images up to 10MB, audio up to 20MB, video up to 50MB
- Anonymous submissions are rate-limited per link to prevent spam
- No sender identity is ever collected or stored
- A receiver's email is never exposed on public routes

## Deployment

Deploys to [Vercel](https://vercel.com). Set the same environment variables
from `.env.example` in your Vercel project settings before deploying.
