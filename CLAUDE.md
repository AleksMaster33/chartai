# ChartAI — Claude Code Guide

## Project Overview
ChartAI is an AI-powered crypto chart analysis SaaS. Users upload chart screenshots and receive trading signals (entry, SL, TP) powered by the Osiris 7-filter methodology.

## Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI Pipeline**: Gemini 2.0 Flash (vision) → Claude Sonnet (reasoning)
- **Payments**: Stripe (subscriptions)
- **Deployment**: Vercel → https://chartai-rho.vercel.app
- **Repo**: https://github.com/AleksMaster33/chartai

## Design System
- **Background**: `#060606`
- **Text**: `#edeae5`
- **Accent (lime)**: `#84cc16`
- **Display font**: Syne (headings, UI labels) — class: `font-display`
- **Body font**: DM Sans — default on `body`
- **Glass cards**: CSS class `glass-card` — use `glass` for nav/overlays
- **Grid bg**: `line-grid` class on fixed divs
- NO gradients as decoration · NO shadows except `glow-lime` on CTAs

## Key Files
```
app/
  page.tsx              — Landing page (public)
  dashboard/page.tsx    — Main app (auth required)
  auth/login/page.tsx   — Login with Google OAuth + magic link
  pricing/page.tsx      — Pricing with Stripe checkout
  api/analyze/route.ts  — POST: AI pipeline, rate limiting
  api/checkout/route.ts — POST: Stripe checkout session
  api/webhooks/stripe/  — Stripe webhook → auto upgrade/downgrade
  api/history/route.ts  — GET: user's past analyses

components/
  Navbar.tsx            — Sticky nav with plan badge, user menu
  UploadZone.tsx        — Drag & drop image upload
  AnalysisResultCard.tsx— Signal display with animated bars
  HistoryPanel.tsx      — Past analyses (Pro+ only)

lib/
  ai/analyze.ts         — Gemini Vision + Claude Osiris pipeline
  stripe.ts             — PLANS config, checkout helpers
  supabase/client.ts    — Browser Supabase client
  supabase/server.ts    — Server Supabase client
```

## Business Logic

### Plans & Rate Limiting
- **Free**: 3 analyses/day (enforced in `api/analyze/route.ts`)
- **Pro** (€12/mo): unlimited, history, multi-timeframe
- **Trader** (€29/mo): everything + API access, webhooks

### AI Pipeline (`lib/ai/analyze.ts`)
1. User uploads image → base64 encoded
2. **Gemini 2.0 Flash Vision** extracts chart data (trend, patterns, levels, indicators)
3. **Claude Sonnet** applies Osiris 7 filters → generates JSON signal
4. Result: `{ signal, entry_price, stop_loss, take_profit_1/2/3, confidence, rationale, ... }`

### Osiris 7 Filters
1. Fuel — momentum & volume
2. Tension — price compression
3. Trend Sync — higher TF alignment
4. BTC Shield — bitcoin correlation
5. Structure — S/R & order blocks
6. Entry Zone — optimal positioning
7. Trigger — confirmation signal

## Environment Variables (in Vercel)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
ANTHROPIC_API_KEY
NEXT_PUBLIC_APP_URL=https://chartai-rho.vercel.app
STRIPE_SECRET_KEY        (add when ready)
STRIPE_WEBHOOK_SECRET    (add when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (add when ready)
STRIPE_PRO_PRICE_ID      (add when ready)
STRIPE_TRADER_PRICE_ID   (add when ready)
```

## Database Schema (Supabase)
- `profiles`: id, email, plan, daily_analyses_used, daily_reset_at, stripe_customer_id, ...
- `analyses`: id, user_id, ticker, signal, entry_price, stop_loss, take_profit_1/2/3, confidence, rationale, ...

## Common Tasks

### Add a new feature
1. Edit relevant component or API route
2. `npm run build` to verify
3. `git add -A && git commit -m "feat: ..." && git push`
4. Vercel deploys automatically

### Test AI pipeline locally
```bash
# Requires real API keys in .env.local
npm run dev
# Then POST to http://localhost:3000/api/analyze with form-data image
```

### Deploy
```bash
git push origin main
# Vercel auto-deploys from main branch
```

## Current Status
- ✅ Full codebase deployed and live
- ✅ Supabase DB schema created (profiles + analyses tables)
- ✅ Google OAuth configured in Supabase
- ✅ Landing page, dashboard, login, pricing pages live
- ⏳ Anthropic credits needed (add at console.anthropic.com/settings/billing)
- ⏳ Stripe products not yet created (add when ready to monetize)
