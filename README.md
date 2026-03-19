# v0-green-guard-frontend-build

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_c5pPs2MZUZbzB5LQ1rIN053hsTZ4)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Backend (API + Auth + Database)

This repository includes a Node.js backend via **Next.js API routes** (under `app/api/`) and a SQLite database managed by **Prisma**.

To get the backend running:

1. Copy `.env.example` to `.env` and update the values if you want:

```bash
cp .env.example .env
```

2. Generate the Prisma client and apply the database schema:

```bash
npm run db:dev
```

You can then call the API endpoints:

- `POST /api/auth/register` → create user
- `POST /api/auth/login` → login and set an HTTP-only cookie
- `GET /api/auth/me` → get authenticated user
- `POST /api/auth/logout` → clear auth cookie

The frontend can use `hooks/useAuth.ts` for a simple client-side auth helper.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/AlokMishra7275/v0-green-guard-frontend-build" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
