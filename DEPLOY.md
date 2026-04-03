# ChartAI — Deployment Guide

## 1. Добави кредити в Anthropic (задължително)
→ https://console.anthropic.com/settings/billing
→ Добави $5-10 (стига за хиляди анализи)

## 2. Качи проекта в GitHub

```bash
# Разархивирай chartai-project.zip
cd chartai

# Инициализирай git
git init
git add .
git commit -m "Initial ChartAI commit"

# Създай repo в github.com → New Repository → "chartai"
git remote add origin https://github.com/ТВОЕТО_USERNAME/chartai.git
git push -u origin main
```

## 3. Деплой в Vercel (безплатно)

1. Влез в https://vercel.com → **Add New Project**
2. Избери GitHub repo-то "chartai"
3. **Environment Variables** — добави следните:

```
NEXT_PUBLIC_SUPABASE_URL = https://utvothnuwndgwtscwmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY = sb_secret_YOUR_SERVICE_ROLE_KEY
GEMINI_API_KEY = YOUR_GEMINI_KEY
ANTHROPIC_API_KEY = YOUR_ANTHROPIC_KEY ключ...
NEXT_PUBLIC_APP_URL = https://ТВОЯ_ДОМЕЙН.vercel.app
STRIPE_SECRET_KEY = (добавяш по-късно)
STRIPE_WEBHOOK_SECRET = (добавяш по-късно)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = (добавяш по-късно)
STRIPE_PRO_PRICE_ID = (добавяш по-късно)
STRIPE_TRADER_PRICE_ID = (добавяш по-късно)
```

4. Кликни **Deploy** → готово в 2 минути!

## 4. Активирай Google Auth в Supabase

1. Supabase → Authentication → Providers → Google → Enable
2. Създай OAuth app в https://console.cloud.google.com
3. Добави Authorized redirect URI:
   `https://utvothnuwndgwtscwmno.supabase.co/auth/v1/callback`

## 5. Тествай

1. Отвори твоя Vercel URL
2. Sign in с Google
3. Upload BTC screenshot от TradingView
4. Получи сигнал!

## 6. Добави Stripe (когато си готов да монетизираш)

1. stripe.com → Test mode → Products → Add Product
   - "ChartAI Pro" → €12/month → вземи Price ID
   - "ChartAI Trader" → €29/month → вземи Price ID
2. Stripe → Developers → Webhooks → Add endpoint:
   `https://ТВОЯ_ДОМЕЙН.vercel.app/api/webhooks/stripe`
   Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
3. Добави всички Stripe ключове в Vercel Environment Variables
4. Redeploy

## Структура на файловете

```
chartai/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── dashboard/page.tsx    ← Главното приложение
│   ├── auth/login/page.tsx   ← Вход
│   ├── pricing/page.tsx      ← Ценови план
│   └── api/
│       ├── analyze/          ← AI pipeline (Gemini → Claude)
│       ├── checkout/         ← Stripe checkout
│       └── webhooks/stripe/  ← Auto upgrade/downgrade
├── components/
│   ├── UploadZone.tsx        ← Drag & drop upload
│   ├── AnalysisResultCard.tsx← Показва сигнала
│   ├── HistoryPanel.tsx      ← История (Pro)
│   └── Navbar.tsx
├── lib/
│   ├── ai/analyze.ts         ← Gemini Vision + Claude Osiris
│   ├── supabase/             ← Database client
│   └── stripe.ts             ← Payments
└── supabase-migration.sql    ← ✓ Вече изпълнен
```

## Месечни разходи при старт

| Услуга | Разход |
|--------|--------|
| Vercel | €0 (free tier) |
| Supabase | €0 (free tier) |
| Gemini Flash | ~€4-5/мес (при 1000 free анализа/ден) |
| Claude Sonnet | ~€8-10/мес |
| Domain | ~€1/мес (по желание) |
| **Общо** | **~€15/мес** |

При 30 платени Pro потребители → €360 MRR → печалба ~€345/мес
