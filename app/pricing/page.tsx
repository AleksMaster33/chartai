'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Check, ArrowLeft, Loader2, Zap, Crown, Rocket } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    color: 'border-white/[0.08]',
    badgeColor: '',
    features: [
      '3 analyses per day',
      'Entry / SL / TP levels',
      'Pattern recognition',
      'Confidence score',
      'Osiris signal rationale',
    ],
    missing: ['Analysis history', 'Multi-timeframe', 'Priority speed', 'API access'],
    cta: 'Start for free',
    ctaStyle: 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1]',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    icon: Crown,
    popular: true,
    color: 'border-lime-400/40',
    badgeColor: 'bg-lime-400 text-black',
    features: [
      'Unlimited analyses',
      'Full analysis history',
      'Multi-timeframe support',
      'Priority processing',
      'Confidence score',
      'All Osiris filters displayed',
      'Pattern + indicator breakdown',
    ],
    missing: ['API access', 'Webhook alerts'],
    cta: 'Upgrade to Pro',
    ctaStyle: 'bg-lime-400 hover:bg-lime-300 text-black',
  },
  {
    id: 'trader',
    name: 'Trader',
    price: 29,
    icon: Rocket,
    color: 'border-purple-400/30',
    badgeColor: 'bg-purple-500 text-white',
    features: [
      'Everything in Pro',
      'REST API access',
      'Webhook alerts (Telegram, Discord)',
      'Portfolio tracker',
      'Backtesting statistics',
      'Priority support (24h)',
      'Early access to new features',
    ],
    missing: [],
    cta: 'Go Trader',
    ctaStyle: 'bg-purple-500 hover:bg-purple-400 text-white',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/auth/login'
      return
    }

    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else if (res.status === 401) window.location.href = '/auth/login'
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold">ChartAI</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </nav>

      {/* Header */}
      <section className="text-center pt-16 pb-12 px-4">
        <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
        <p className="text-white/50 text-lg">Start free. Upgrade when you need more.</p>
      </section>

      {/* Plans */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative border rounded-2xl p-6 flex flex-col ${plan.color} ${
                plan.popular ? 'bg-lime-400/[0.02]' : 'bg-white/[0.02]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  plan.badgeColor || 'bg-white/[0.06]'
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.badgeColor ? '' : 'text-white/50'}`} />
                </div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-white/40 text-sm">/month</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                    <span className="text-white/25">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${plan.ctaStyle}`}
              >
                {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, cancel your subscription at any time. You keep Pro access until end of billing period.' },
            { q: 'What charts are supported?', a: 'Any screenshot from any platform — TradingView, Binance, Bybit, OKX, or custom charts.' },
            { q: 'How accurate are the signals?', a: 'AI uses the Osiris 7-filter methodology. Always use signals as part of your own analysis, not as sole decision maker.' },
            { q: 'What is the Osiris methodology?', a: 'A 7-filter system: Fuel, Tension, Trend Sync, BTC Correlation, Market Structure, Entry Zone, and Entry Trigger.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
              <h4 className="font-medium mb-2 text-sm">{q}</h4>
              <p className="text-sm text-white/50 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-white/30 mt-10">
          All plans include: Not financial advice · Educational purpose only · Trade at your own risk
        </p>
      </section>
    </div>
  )
}
