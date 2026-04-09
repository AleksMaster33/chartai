'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Check, X, ArrowLeft, Loader2, Zap, Crown, Rocket, ChevronRight, Shield } from 'lucide-react'

const LIME = '#84cc16'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, period: 'forever', icon: Zap,
    badge: null,
    features: ['3 analyses per day', 'Entry / SL / TP levels', 'Pattern recognition', 'Confidence score', 'Osiris rationale'],
    missing: ['Analysis history', 'Multi-timeframe', 'Priority speed', 'API access'],
    cta: 'Start for free', ctaHref: '/auth/login',
    accentColor: 'rgba(255,255,255,0.3)',
  },
  {
    id: 'pro', name: 'Pro', price: 12, period: '/month', icon: Crown,
    badge: 'Most popular',
    features: ['Unlimited analyses', 'Full analysis history', 'Multi-timeframe', 'Priority processing', 'Confidence scoring', 'All Osiris filters', 'Pattern breakdown'],
    missing: ['API access', 'Webhook alerts'],
    cta: 'Upgrade to Pro', ctaHref: null,
    accentColor: LIME,
  },
  {
    id: 'trader', name: 'Trader', price: 29, period: '/month', icon: Rocket,
    badge: null,
    features: ['Everything in Pro', 'REST API access', 'Telegram & Discord webhooks', 'Portfolio tracker', 'Backtesting stats', 'Priority support', 'Early access'],
    missing: [],
    cta: 'Go Trader', ctaHref: null,
    accentColor: '#8b5cf6',
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?',          a: 'Yes — cancel at any time. You keep Pro access until the end of the billing period. No questions asked.' },
  { q: 'What charts are supported?',     a: 'Any screenshot from any platform — TradingView, Binance, Bybit, OKX, or custom charts. PNG, JPG, WebP.' },
  { q: 'How accurate are the signals?',  a: 'ChartAI uses the Osiris 7-filter system. Always combine with your own analysis. Not financial advice.' },
  { q: 'What is the Osiris methodology?', a: '7 filters: Fuel, Tension, Trend Sync, BTC Shield, Structure, Entry Zone, Trigger — all applied simultaneously.' },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const d = await res.json()
      if (d.url) window.location.href = d.url
      else if (res.status === 401) window.location.href = '/auth/login'
    } catch { alert('Something went wrong.') }
    finally { setLoading(null) }
  }

  return (
    <div className="min-h-screen bg-[#090909] overflow-x-hidden">

      {/* bg grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{ background:'radial-gradient(ellipse at center top,rgba(132,204,22,0.05) 0%,transparent 60%)' }} />
      </div>

      {/* nav */}
      <header className="relative z-20 border-b border-white/[0.05]"
        style={{ background:'rgba(9,9,9,0.85)', backdropFilter:'blur(20px)' }}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:LIME }}>
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-extrabold text-[15px] tracking-tight group-hover:text-[#84cc16] transition-colors">ChartAI</span>
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65 transition-colors font-display">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </nav>
      </header>

      {/* header */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45 }}>
          <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color:`${LIME}99` }}>Pricing</p>
          <h1 className="font-display font-extrabold text-[3rem] tracking-tight mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-white/35 text-base">Start free. Upgrade when you need more power.</p>
        </motion.div>
      </div>

      {/* cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.1, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="relative rounded-2xl p-6 flex flex-col overflow-hidden group"
              style={{
                background: plan.id==='pro' ? 'rgba(132,204,22,0.03)' : plan.id==='trader' ? 'rgba(139,92,246,0.025)' : 'rgba(255,255,255,0.025)',
                border: plan.id==='pro' ? '1px solid rgba(132,204,22,0.25)' : plan.id==='trader' ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(255,255,255,0.06)',
              }}>

              {/* top glow line */}
              {plan.id === 'pro' && (
                <div className="absolute top-0 left-4 right-4 h-px"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(132,204,22,0.5),transparent)' }} />
              )}

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-black text-[10px] font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                    style={{ background:LIME }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* icon + name */}
              <div className="mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                  plan.id==='pro' ? '' : plan.id==='trader' ? '' : ''
                }`}
                  style={{
                    background: plan.id==='pro' ? LIME : plan.id==='trader' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                    border: plan.id==='pro' ? 'none' : plan.id==='trader' ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <plan.icon
                    className="w-4.5 h-4.5"
                    style={{ width:18, height:18, color: plan.id==='pro' ? '#000' : plan.id==='trader' ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}
                  />
                </div>
                <div className="font-display font-bold text-sm text-white/60 mb-2 uppercase tracking-widest text-[11px]">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-[2.5rem]">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-white/25 text-sm font-display">{plan.period}</span>}
                </div>
              </div>

              {/* features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: plan.id==='pro' ? LIME : plan.id==='trader' ? '#a78bfa' : 'rgba(255,255,255,0.3)' }} />
                    <span className="text-white/60">{f}</span>
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/12" />
                    <span className="text-white/18">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.ctaHref ? (
                <Link href={plan.ctaHref}
                  className="w-full py-3 rounded-xl text-sm font-display font-bold text-center transition-all duration-200 border border-white/[0.07] text-white/40 hover:border-white/14 hover:text-white/60 flex items-center justify-center gap-1.5">
                  {plan.cta} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button onClick={() => checkout(plan.id)} disabled={!!loading}
                  className={`w-full py-3 rounded-xl text-sm font-display font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ${
                    plan.id==='pro'
                      ? 'text-black hover:brightness-110'
                      : 'border border-purple-500/20 text-purple-300 hover:bg-purple-500/10'
                  }`}
                  style={plan.id==='pro' ? { background:LIME, boxShadow:`0 4px 16px rgba(132,204,22,0.22)` } : {}}>
                  {loading === plan.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* comparison note */}
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4, duration:0.4 }}
          className="mt-8 flex items-center justify-center gap-3 p-4 rounded-2xl"
          style={{ background:'rgba(132,204,22,0.04)', border:'1px solid rgba(132,204,22,0.1)' }}>
          <Shield className="w-4 h-4 shrink-0" style={{ color:`${LIME}88` }} />
          <span className="text-sm text-white/40 font-display">
            All plans include the Osiris 7-filter methodology · Cancel anytime · Educational purposes only
          </span>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16">
          <motion.h2
            initial={{ opacity:0, y:12 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.4 }}
            className="font-display font-extrabold text-xl mb-6 text-center">
            Frequently asked questions
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FAQS.map(({ q, a }, i) => (
              <motion.div key={q}
                initial={{ opacity:0, y:14 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }}
                transition={{ delay:i*0.08, duration:0.4 }}
                className="rounded-xl p-5"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.055)' }}>
                <div className="font-display font-semibold text-sm mb-2 text-white/80">{q}</div>
                <p className="text-sm text-white/35 leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-white/18 font-display mt-10">
          Educational only · Not financial advice · Trade at your own risk
        </p>
      </div>
    </div>
  )
}
