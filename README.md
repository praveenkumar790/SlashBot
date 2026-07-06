# Discord Slash-Command Bot

A full-stack Next.js application that integrates with Discord to process slash commands, generate AI summaries, and mirror reports to secondary webhooks.

## Features
- **Discord Integration**: Handles `/report` and `/status` slash commands using HTTP interactions.
- **Ed25519 Security**: Cryptographically verifies all incoming requests from Discord.
- **AI Summarization**: Uses Google Gemini to automatically summarize user reports.
- **Webhook Mirroring**: Forwards reports and their AI summaries to a secondary Discord channel.
- **Admin Dashboard**: Secure NextAuth dashboard to view the command log, monitor mirror success/failure, retry failed webhooks, and configure server-specific rules.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: `@google/genai` (Gemini 2.5 Flash)
- **Styling**: Tailwind CSS, Lucide Icons

---

## 🚀 How to Test It

1. **Live URL**: https://slash-bot-alpha.vercel.app/
2. **Test Admin Login**:
   - Email: `[EMAIL_ADDRESS]`
   - Password: `[PASSWORD]`
3. **Add Bot to your Discord Server**: 
   - [Click here to invite the bot](https://discord.com/oauth2/authorize?client_id=1523291537725980842&permissions=2147502080&integration_type=0&scope=bot+applications.commands)

Once added, type `/report message: <your text>` in your server. The bot will acknowledge it, run it through AI, and you'll see the record appear in the dashboard!

---

## 💻 Running Locally

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd SlashBot
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`. Fill in the required secrets:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `DISCORD_PUBLIC_KEY`: From your Discord Developer Portal.
- `DISCORD_BOT_TOKEN`: From your Discord Developer Portal.
- `MIRROR_WEBHOOK_URL`: A webhook URL for a separate Discord/Slack channel.
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `NEXTAUTH_SECRET`: Generate one using `openssl rand -base64 32`.

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Dev Server
```bash
npm run dev
```
The app will run on `http://localhost:3000`. 
*Note: To receive live Discord webhook events locally, you must use a tunnel like ngrok (`ngrok http 3000`) and update your Interactions Endpoint URL in the Discord Portal to `https://<your-ngrok-url>/api/discord/interactions`.*

---

## ☁️ Deployment

This project is deployed on **Vercel**. 
- The PostgreSQL database is hosted on **Neon**.
- Background async tasks (like mirroring and AI processing) utilize Vercel's `waitUntil` function to respect Discord's strict 3-second response window while allowing long-running serverless processes to finish safely.
