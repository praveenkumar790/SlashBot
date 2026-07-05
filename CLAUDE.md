# Project: Discord Slash-Command Bot

Next.js 16 App Router + TypeScript + Prisma 7 (Neon Postgres) + NextAuth v5 (Credentials).
Deployed on Vercel. See the implementation plan for full spec and build order —
follow the milestones (M0-M10) in sequence, do not skip the M2 deploy checkpoint.

## Stack specifics (as of July 2026)

- **Next.js 16**: Uses `proxy.ts` instead of deprecated `middleware.ts`.
- **Prisma 7**: Requires `prisma.config.ts` for DB URL, `@prisma/adapter-pg` driver adapter,
  generator `prisma-client` with explicit output, import from `./generated/prisma/client`.
- **NextAuth v5**: Install via `next-auth@beta` npm tag. Split config pattern:
  `auth.config.ts` (Edge-safe, used by proxy.ts) + `auth.ts` (full config with bcrypt).
- **Gemini AI**: Use `@google/genai` (not deprecated `@google/generative-ai`).
  Client: `new GoogleGenAI({ apiKey })` → `ai.models.generateContent(...)`.

## Conventions

- Interactions route must read the raw body as ArrayBuffer before parsing JSON
  (signature verification needs raw bytes).
- Dedup on Interaction.id (the Discord interaction id) via unique constraint,
  not a separate check-then-insert.
- Never let a mirror or AI call failure block or fail the Discord response.
- All secrets via env vars only — never hardcoded, never logged.
