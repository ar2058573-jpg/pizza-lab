# Pizza Lab — AI Restaurant + Delivery System

Complete system matching the demo videos.

## Phases

| Phase | Status | What |
|-------|--------|------|
| 1 | ✅ | Dashboard UI + Prisma schema |
| 2 | ✅ | Live assign / dispatch / rider flow |
| 3 | ✅ | WhatsApp Bot simulator |
| 4 | ✅ | AI Voice Agent |
| 5 | ✅ | Production readiness (DB, env, deploy guide) |

## Quick start (mock data — no DB needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000

Pages:
- `/` Dashboard
- `/orders` `/customers` `/riders` `/dispatch`
- `/whatsapp` WhatsApp bot
- `/voice` AI Voice Agent
- `/rider` Rider terminal

## Phase 5 — Real PostgreSQL

### 1. Get a free database
- [Neon](https://neon.tech) (recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- Local Postgres

### 2. Configure env

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### 3. Push schema + seed

```bash
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. WhatsApp (when Meta works)

```
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=pizza_lab_verify_token
```

Webhook URL: `https://your-domain.com/api/whatsapp/webhook`

### 5. Deploy

**Frontend:** Vercel  
**Database:** Neon / Supabase  
**Optional backend real-time:** Railway

```bash
npm run build
npm start
```

## Full order flow

```
Voice Agent or WhatsApp
        ↓
   Create Order
        ↓
    Dashboard
        ↓
    Dispatch → Assign Rider
        ↓
  Rider Terminal → Deliver + COD
        ↓
     Delivered
```

## Tech stack

- Next.js 16 + Tailwind
- Prisma + PostgreSQL
- React Context (live state)
- Meta WhatsApp Cloud API (ready)
- Voice: browser TTS now → Vapi/Retell later
