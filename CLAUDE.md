# CHARTAI — CLAUDE CODE MASTER DOCUMENT
> Пълен контрол, достъп и контекст за автономна работа върху проекта

---

## 🔑 ВСИЧКИ API КЛЮЧОВЕ И ДОСТЪП

### Supabase (DB + Auth + Storage)
```
Project URL:       https://utvothnuwndgwtscwmno.supabase.co
Anon Key:          sb_publishable_[ВИЖ_.env.local]
Service Role Key:  sb_secret_[ВИЖ_.env.local]
DB Password:       [DB_PASSWORD_В_.env.local]
DB Connection:     postgresql://postgres:[DB_PASSWORD_В_.env.local]@db.utvothnuwndgwtscwmno.supabase.co:5432/postgres
Dashboard:         https://supabase.com/dashboard/project/utvothnuwndgwtscwmno
SQL Editor:        https://supabase.com/dashboard/project/utvothnuwndgwtscwmno/sql/new
Auth Settings:     https://supabase.com/dashboard/project/utvothnuwndgwtscwmno/auth/url-configuration
```

### Google Gemini AI (Vision анализ)
```
API Key:   [GEMINI_KEY_В_.env.local]
Model:     gemini-2.0-flash
Purpose:   Визуален анализ на chart screenshots
Console:   https://aistudio.google.com/apikey
Project:   OsirisAi (projects/50095782618)
```

### Anthropic Claude (Osiris signal генерация)
```
API Key:   [ANTHROPIC_KEY_В_.env.local]
Model:     claude-sonnet-4-5
Purpose:   7-filter Osiris reasoning → JSON signal
Console:   https://console.anthropic.com
Billing:   https://console.anthropic.com/settings/billing
⚠️  НУЖНИ СА КРЕДИТИ — добави $5+ за да работи pipeline-ът
```

### GitHub (Source Code)
```
Repo:    https://github.com/AleksMaster33/chartai
Branch:  main (auto-deploy to Vercel)
Token:   [GITHUB_TOKEN_В_.env.local]
Clone:   git clone https://[GITHUB_TOKEN_В_.env.local]@github.com/AleksMaster33/chartai
```

### Vercel (Хостинг)
```
Live URL:     https://chartai-rho.vercel.app
Auto-deploy:  Всеки push към main → деплой (~2 мин)
Dashboard:    https://vercel.com/dashboard
Env vars:     https://vercel.com/aleksmaster33/chartai/settings/environment-variables
```

### Stripe (Плащания — ⏳ за настройка)
```
Dashboard:  https://dashboard.stripe.com
Status:     Не е конфигуриран — виж Roadmap секцията
```

---

## ⚙️ .env.local (копирай в root на проекта)

```env
NEXT_PUBLIC_SUPABASE_URL=https://utvothnuwndgwtscwmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_[ВИЖ_.env.local]
SUPABASE_SERVICE_ROLE_KEY=sb_secret_[ВИЖ_.env.local]
GEMINI_API_KEY=[GEMINI_KEY_В_.env.local]
ANTHROPIC_API_KEY=[ANTHROPIC_KEY_В_.env.local]
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_PRO_PRICE_ID=price_placeholder
STRIPE_TRADER_PRICE_ID=price_placeholder
NEXT_PUBLIC_APP_URL=https://chartai-rho.vercel.app
```

---

## 🏗️ СТЕК

```
Framework:    Next.js 14 (App Router, TypeScript, Turbopack)
Styling:      Tailwind CSS + custom CSS (app/globals.css)
Database:     Supabase PostgreSQL + RLS
Auth:         Supabase Auth (Google OAuth + Magic Link email)
Storage:      Supabase Storage (bucket: "charts")
AI Vision:    Google Gemini 2.0 Flash
AI Reasoning: Anthropic Claude Sonnet (claude-sonnet-4-5)
Payments:     Stripe subscriptions
Hosting:      Vercel (GitHub auto-deploy)
Fonts:        Syne (display) + DM Sans (body) via Google Fonts <link>
```

---

## 📁 ФАЙЛОВА КАРТА

```
app/
  layout.tsx                    Root layout, Google Fonts <link>, metadata
  globals.css                   Design system: glass, grid, animations, CSS vars
  page.tsx                      Landing page (публичен)
  dashboard/page.tsx            Главното приложение (изисква auth)
  auth/login/page.tsx           Login: Google OAuth + magic link
  auth/callback/route.ts        OAuth код → сесия redirect
  pricing/page.tsx              Планове + Stripe checkout
  api/
    analyze/route.ts            POST: AI pipeline + rate limiting (main logic)
    checkout/route.ts           POST: Stripe checkout session
    history/route.ts            GET: история на анализи
    webhooks/stripe/route.ts    Stripe events → auto plan upgrade/downgrade

components/
  Navbar.tsx                    Sticky nav, план badge, user dropdown
  UploadZone.tsx                Drag & drop upload с image preview
  AnalysisResultCard.tsx        Signal карта с animated confidence bar
  HistoryPanel.tsx              История на анализи (само Pro+)

lib/
  ai/analyze.ts                 Gemini Vision → Claude Osiris pipeline
  stripe.ts                     PLANS конфиг + checkout helpers
  supabase/client.ts            Browser Supabase client
  supabase/server.ts            Server + admin Supabase client

supabase-migration.sql          ✅ Изпълнен — DB схема + RLS + triggers
```

---

## 🗄️ БАЗА ДАННИ СХЕМА

### profiles
| Колона | Тип | Default | Описание |
|--------|-----|---------|----------|
| id | uuid PK | — | = auth.users.id |
| email | text | — | |
| plan | text | 'free' | 'free', 'pro', 'trader' |
| daily_analyses_used | int | 0 | Reset всеки 24h |
| daily_reset_at | timestamptz | now() | Последен reset timestamp |
| total_analyses | int | 0 | Cumulative count |
| stripe_customer_id | text | — | Stripe customer ID |
| stripe_subscription_id | text | — | Активен subscription ID |
| subscription_status | text | 'inactive' | 'active', 'past_due', etc. |

### analyses
| Колона | Тип | Описание |
|--------|-----|----------|
| id | uuid PK | Auto UUID |
| user_id | uuid FK | → profiles.id |
| image_url | text | Supabase Storage URL |
| ticker | text | "BTC/USDT" |
| signal | text | 'LONG', 'SHORT', 'NEUTRAL' |
| entry_price | numeric | |
| stop_loss | numeric | |
| take_profit_1/2/3 | numeric | |
| confidence | int | 0-100 |
| rationale | text | Osiris explanation |
| key_levels | jsonb | Array of {label, price, type} |
| indicators | jsonb | Array of {name, value, signal} |

### Triggers
```sql
-- Auto-create profile при нов потребител:
handle_new_user() → AFTER INSERT ON auth.users

-- Reset daily count:
reset_daily_analyses() → UPDATE WHERE daily_reset_at < NOW() - INTERVAL '24h'
```

---

## 🤖 AI PIPELINE

### Поток
```
1. User uploads image → FormData POST /api/analyze
2. Auth check → profile load → rate limit check
3. File → ArrayBuffer → base64
4. Upload to Supabase Storage: {user_id}/{timestamp}-{filename}
5. GEMINI 2.0 FLASH (vision):
   - Извлича: цена, тренд, паттерни, S/R нива, индикатори, volume, TF, ticker
   - Output: детайлно текстово описание
6. CLAUDE SONNET (reasoning):
   - System: Osiris 7-filter methodology
   - Input: Gemini output
   - Output: structured JSON signal
7. Save to analyses table
8. Increment daily_analyses_used
9. Return JSON to frontend
```

### Osiris 7 Filters (System Prompt на Claude)
```
1. FUEL    — Достатъчно momentum/volume за движение?
2. TENSION — Price compression/squeeze готово за release?
3. TREND SYNC — Алайнва ли се с higher TF тренда?
4. BTC SHIELD — BTC подкрепя ли за altcoins?
5. STRUCTURE — S/R, order blocks, FVG потвърждават?
6. ENTRY ZONE — Цената не е overextended?
7. TRIGGER — Clear trigger candle/pattern?
```

### Цена за 1 анализ
```
Gemini Flash (vision):  ~$0.001-0.002
Claude Sonnet (reason): ~$0.002-0.003
Общо:                   ~$0.003-0.005 на анализ
```

---

## 💰 БИЗНЕС МОДЕЛ

### Планове
| План | Цена | Лимит | Функции |
|------|------|-------|---------|
| Free | €0 | 3/ден | Entry/SL/TP, confidence, rationale |
| Pro | €12/мес | Unlimited | + История, multi-TF, priority |
| Trader | €29/мес | Unlimited | + API, webhooks, portfolio |

### Break-even
```
При 1000 безплатни потребители:
  2% → Pro:    20 × €12 = €240 MRR
  0.5% → Trader: 5 × €29 = €145 MRR
  Общо MRR:   ~€385
  Разходи:    ~€15-20
  Нетна печалба: ~€365/мес
```

### Stripe Webhook Events (api/webhooks/stripe/route.ts)
```
checkout.session.completed     → plan = 'pro'/'trader', status = 'active'
customer.subscription.deleted  → plan = 'free', status = 'inactive'
invoice.payment_succeeded      → status = 'active'
invoice.payment_failed         → status = 'past_due'
customer.subscription.updated  → sync plan + status
```

---

## 🎨 DESIGN SYSTEM

### Цветове
```css
--background:   #060606
--text:         #edeae5
--lime:         #84cc16   /* primary accent */
--lime-bright:  #a3e635
--lime-dim:     rgba(132,204,22,0.12)
--surface-1:    rgba(255,255,255,0.03)
--surface-2:    rgba(255,255,255,0.055)
--border:       rgba(255,255,255,0.06)
```

### CSS Класове (globals.css)
```
.font-display  → Syne font (headings, badges, labels)
.glass         → backdrop-blur glassmorphism (nav, modals)
.glass-card    → hover-lift карта (основен card компонент)
.line-grid     → тонка линеена grid texture (fixed bg)
.glow-lime     → lime box-shadow glow (CTA бутони)
.text-glow     → lime text-shadow (hero H1)
.upload-zone   → dashed border + hover state
.scan-beam     → зелена анимирана scan линия
.ticker-track  → безкраен хоризонтален scroll
.reveal        → fade-up entrance animation
.reveal-d1..6  → staggered delays (0.08s steps)
.pulse-ring    → pulsating ring около логото
.dot-live      → blinking зелена точка ("Live")
```

### Правила
```
✅ Glassmorphism за карти и overlays
✅ 1px тънки borders с rgba
✅ Micro-animations с purpose
✅ Radial gradients само като ambient bg
❌ НЕ decorative drop-shadows
❌ НЕ gradient-filled backgrounds
❌ НЕ @import в CSS (чупи Tailwind)
❌ НЕ next/font (блокиран в build containers)
```

---

## 🚀 ROADMAP

### ✅ Готово
- [x] Next.js проект с TypeScript
- [x] Supabase DB схема + RLS + Auth
- [x] Google OAuth + Magic Link login
- [x] Gemini Vision + Claude Osiris AI pipeline
- [x] Rate limiting (3/ден за Free)
- [x] Stripe webhook handler (auto upgrade/downgrade)
- [x] Landing page, Dashboard, Login, Pricing
- [x] UploadZone, AnalysisResultCard, HistoryPanel, Navbar
- [x] Vercel deployment + GitHub auto-deploy
- [x] Design system (glass, grid, animations)

### ⏳ Следващо (по приоритет)

**1. Активиране на AI (незабавно)**
```
→ console.anthropic.com/settings/billing → $5-10 кредити
→ Тест: dashboard → upload BTC chart → analyze
```

**2. Stripe монетизация**
```
→ stripe.com → Products → Create "ChartAI Pro" €12/мес
→ stripe.com → Products → Create "ChartAI Trader" €29/мес
→ stripe.com → Webhooks → https://chartai-rho.vercel.app/api/webhooks/stripe
→ Vercel env vars → добави Stripe ключове → redeploy
```

**3. Telegram Bot (Trader feature)**
```
→ @BotFather → /newbot → @chartai_signals_bot
→ app/api/telegram/webhook/route.ts
→ Потребителят изпраща chart image → получава сигнал директно в Telegram
→ Webhook: POST /api/telegram/webhook
```

**4. Public Analysis Sharing**
```
→ /analysis/[id] dynamic route
→ Public page с OG image за social sharing
→ Twitter/Telegram share buttons
```

**5. Affiliate Program**
```
→ Rewardful.com или LemonSqueezy
→ 30% recurring commission
→ /api/affiliate/track route
```

**6. SEO Blog**
```
→ /blog route (MDX или Contentful)
→ Статии: "How to analyze BTC chart with AI"
→ Target: "ai crypto chart analyzer", "trading signals ai" keywords
```

---

## 💻 COMMON TASKS

### Стартирай локално
```bash
git clone https://[GITHUB_TOKEN_В_.env.local]@github.com/AleksMaster33/chartai
cd chartai
npm install
# Създай .env.local от секцията по-горе
npm run dev   # → http://localhost:3000
```

### Deploy промяна
```bash
git add -A
git commit -m "feat: описание"
git push origin main
# Vercel деплоява автоматично в ~2 мин
# Провери: curl -s -o /dev/null -w "%{http_code}" https://chartai-rho.vercel.app
```

### Query Supabase от CLI
```bash
# Виж потребители
curl -s "https://utvothnuwndgwtscwmno.supabase.co/rest/v1/profiles?select=id,email,plan,daily_analyses_used" \
  -H "apikey: sb_secret_[ВИЖ_.env.local]" \
  -H "Authorization: Bearer sb_secret_[ВИЖ_.env.local]"

# Виж анализи
curl -s "https://utvothnuwndgwtscwmno.supabase.co/rest/v1/analyses?select=ticker,signal,confidence,created_at&order=created_at.desc&limit=10" \
  -H "apikey: sb_secret_[ВИЖ_.env.local]" \
  -H "Authorization: Bearer sb_secret_[ВИЖ_.env.local]"

# Upgrade потребител ръчно
curl -s -X PATCH "https://utvothnuwndgwtscwmno.supabase.co/rest/v1/profiles?id=eq.USER_ID" \
  -H "apikey: sb_secret_[ВИЖ_.env.local]" \
  -H "Authorization: Bearer sb_secret_[ВИЖ_.env.local]" \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro","subscription_status":"active"}'
```

### Тест на Anthropic connection
```bash
curl -s "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: [ANTHROPIC_KEY_В_.env.local]" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":20,"messages":[{"role":"user","content":"Say OK"}]}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',[{}])[0].get('text','ERROR:',d.get('error')))"
```

### Тест на живия API endpoint
```bash
# Трябва да си логнат — тества само connectivity
curl -s -X POST "https://chartai-rho.vercel.app/api/analyze" \
  -w "\nHTTP: %{http_code}" | tail -1
# Очаква: HTTP: 401 (Unauthorized — OK, endpoint работи)
```

---

## 🔧 ИЗВЕСТНИ ПРОБЛЕМИ

| Проблем | Причина | Решение |
|---------|---------|---------|
| `@import` чупи CSS | Трябва преди `@tailwind` | ❌ Не използвай `@import` в globals.css |
| `next/font` → 403 | Google Fonts блокиран в build | ✅ Използвай `<link>` в layout.tsx |
| psql connection refused | Direct DB блокиран | ✅ Използвай Supabase REST API |
| "credit balance too low" | Anthropic без кредити | ✅ console.anthropic.com/billing |
| Tailwind класове не работят | Purging на динамични класове | ✅ Използвай safelist или static strings |

---

## 📊 ПРОИЗВОДИТЕЛНОСТ

| Метрика | Цел | Как |
|---------|-----|-----|
| Analysis time | < 10s | Gemini Flash (бърз) + паралелни calls |
| Cold start | < 2s | Vercel Edge runtime за API routes |
| Image upload | < 3s | Direct to Supabase Storage |
| Page load | < 1.5s | Static generation + CDN |

---

## 🔐 СИГУРНОСТ

- RLS на ниво база данни (потребителят вижда само своето)
- Service role key само в server-side код
- Stripe webhook signature verification
- Rate limiting по user_id (не по IP)
- File validation: тип + размер (max 10MB)
- `.env.local` не е в git (добавен в .gitignore)

