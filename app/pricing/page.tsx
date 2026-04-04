'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Check, X, ArrowLeft, Loader2, Zap, Crown, Rocket, ChevronRight } from 'lucide-react'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, icon: Zap,
    badge: null,
    features: ['3 analyses per day','Entry / SL / TP levels','Pattern recognition','Confidence score','Osiris rationale'],
    missing: ['Analysis history','Multi-timeframe','Priority speed','API access'],
    cta: 'Start for free', ctaHref: '/auth/login',
    style: { border: 'rgba(255,255,255,0.07)', bg: 'rgba(255,255,255,0.02)' },
  },
  {
    id: 'pro', name: 'Pro', price: 12, icon: Crown,
    badge: 'Most popular',
    features: ['Unlimited analyses','Full analysis history','Multi-timeframe','Priority processing','Confidence scoring','All Osiris filters','Pattern breakdown'],
    missing: ['API access','Webhook alerts'],
    cta: 'Upgrade to Pro', ctaHref: null,
    style: { border: 'rgba(132,204,22,0.3)', bg: 'rgba(132,204,22,0.03)' },
  },
  {
    id: 'trader', name: 'Trader', price: 29, icon: Rocket,
    badge: null,
    features: ['Everything in Pro','REST API access','Telegram & Discord webhooks','Portfolio tracker','Backtesting stats','Priority support','Early access'],
    missing: [],
    cta: 'Go Trader', ctaHref: null,
    style: { border: 'rgba(139,92,246,0.25)', bg: 'rgba(139,92,246,0.02)' },
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string|null>(null)

  const checkout = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan: planId }) })
      const d = await res.json()
      if (d.url) window.location.href = d.url
      else if (res.status === 401) window.location.href = '/auth/login'
    } catch { alert('Something went wrong.') }
    finally { setLoading(null) }
  }

  return (
    <div className="min-h-screen bg-[#060606]">
      <div className="fixed inset-0 line-grid opacity-40 pointer-events-none" />

      <header className="relative z-10 border-b border-white/[0.05]">
        <nav className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#84cc16] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight">ChartAI</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors font-display">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </nav>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">
        <p className="text-[#84cc16] text-[11px] font-display font-bold tracking-[0.15em] uppercase mb-3">Pricing</p>
        <h1 className="font-display font-extrabold text-[2.75rem] tracking-tight mb-3">Simple, transparent pricing</h1>
        <p className="text-white/35 text-base">Start free. Upgrade when you need more power.</p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div key={plan.id} className="relative rounded-2xl p-6 flex flex-col"
              style={{ background: plan.style.bg, border: `1px solid ${plan.style.border}` }}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#84cc16] text-black text-[10px] font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                  plan.id === 'pro' ? 'bg-[#84cc16] text-black' :
                  plan.id === 'trader' ? 'bg-purple-500/20 border border-purple-500/20' :
                  'bg-white/[0.05] border border-white/[0.07]'
                }`}>
                  <plan.icon className={`w-4.5 h-4.5 ${plan.id === 'pro' ? 'text-black' : plan.id === 'trader' ? 'text-purple-400' : 'text-white/40'}`} style={{width:'18px',height:'18px'}} />
                </div>
                <div className="font-display font-bold text-base mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-[2.25rem]">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-white/30 text-sm font-display">/month</span>}
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-[#84cc16] mt-0.5 shrink-0" />
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <X className="w-3.5 h-3.5 text-white/15 mt-0.5 shrink-0" />
                    <span className="text-white/20">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaHref ? (
                <Link href={plan.ctaHref}
                  className="w-full py-3 rounded-xl text-sm font-display font-bold text-center transition-all duration-200 border border-white/[0.08] text-white/50 hover:border-white/[0.15] hover:text-white/70 flex items-center justify-center gap-2">
                  {plan.cta} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button onClick={() => checkout(plan.id)} disabled={!!loading}
                  className={`w-full py-3 rounded-xl text-sm font-display font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ${
                    plan.id === 'pro'
                      ? 'bg-[#84cc16] text-black hover:bg-[#a3e635] glow-lime'
                      : 'bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}>
                  {loading === plan.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {[
            { q:'Can I cancel anytime?', a:'Yes — cancel at any time. You keep Pro access until end of the billing period.' },
            { q:'What charts are supported?', a:'Any screenshot from any platform — TradingView, Binance, Bybit, OKX, or custom charts.' },
            { q:'How accurate are the signals?', a:'AI uses the Osiris 7-filter system. Always combine with your own analysis. Not financial advice.' },
            { q:'What is the Osiris methodology?', a:'7 filters: Fuel, Tension, Trend Sync, BTC Shield, Structure, Entry Zone, and Trigger — applied simultaneously.' },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl p-5 border border-white/[0.05] bg-white/[0.02]">
              <div className="font-display font-semibold text-sm mb-2">{q}</div>
              <p className="text-sm text-white/35 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/20 font-display mt-10">Educational only · Not financial advice · Trade at your own risk</p>
      </div>
    </div>
  )
}
