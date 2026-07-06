# AI Notes — Discord Slash-Command Bot

## Tools & Model Used
- **Primary coding agent**: Antigravity (Claude Opus 4.6 Thinking) via the Gemini IDE.
- **Work split**: The AI generated the Next.js project structure, boilerplate, API route handlers, Prisma schema, NextAuth configuration, and dashboard UI. I provided the architectural direction, supplied the necessary credentials, performed manual verification steps (like configuring the Discord endpoint URL and Vercel deployment), and guided the AI through debugging edge cases.

## Decisions I Made Myself (and Why)

1. **Using `waitUntil` for Background Tasks**: Discord has a strict 3-second timeout for Interaction responses. I chose to immediately respond with a `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` (type 5) and pass the database operations, AI summarization, and webhook mirroring to Next.js/Vercel's `waitUntil()`. This ensures the bot never times out while allowing complex asynchronous workflows to complete reliably.
2. **Handling Mirror Failures Gracefully**: Instead of letting webhook failures disappear into the server logs, I designed the database schema to track `mirrorStatus` (`pending`, `sent`, `failed`) and `mirrorRetries`. If the secondary Discord channel webhook goes down or rejects a payload, the dashboard surfaces this failure and provides a "Retry Webhooks" bulk-action button.
3. **Deduplicating Requests at the Database Level**: Discord will retry sending the interaction if it thinks it timed out. To prevent duplicate records, I relied on Prisma's `P2002` Unique Constraint violation on the `interactionId` primary key. If an interaction with the same ID arrives twice, the system catches the error and safely ignores it.

## The Hardest Bug the AI Led Me Into

The trickiest bug occurred when trying to set up the local admin login. The AI generated a bcrypt hash for the password `DiscordBot2026!` and told me to paste it into the `.env` file like this:
`ADMIN_PASSWORD_HASH=$2b$12$pBMQgWlG/1O0vFbzYArBwt4kAvhy`

However, logging in kept failing with a `CredentialsSignin` error. The AI initially assumed it was a Next.js caching issue and started recklessly clearing the `.next` build cache and killing terminal processes. I had to intervene and tell the AI: *"first find the issue not start changing everything, first have evidence that what cause this error no assumptions."*

Prompted by my correction, the AI added debug logging to the Auth callback. The logs revealed that the environment variable parser was treating the `$` characters in the bcrypt hash as shell variable references (e.g., `$2b`, `$12`). It expanded them into empty strings, truncating the hash down to just `/1O0vFbzYArBwt4kAvhy`. 

**The Fix:** We simply wrapped the hash value in single quotes in the `.env` file (`ADMIN_PASSWORD_HASH='...'`), which forced the parser to interpret the `$` characters literally, instantly fixing the authentication!

## What I'd Add With More Time
- **WebSocket-based Dashboard Updates**: Instead of polling the database every 5 seconds on the client, I'd implement real-time updates via WebSockets or Server-Sent Events.
- **Interactive Discord Components**: I'd expand the bot to use Message Components (buttons/modals), allowing users to categorize or append information to their reports directly from the Discord interface.
- **Role-Based Access Control**: Expanding the hard-coded single admin credential system into a proper multi-user RBAC system using Discord OAuth login for dashboard access.
