'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Shield, TrendingUp, Clock, BarChart2, Target } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-lg">ChartAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
          <Link href="/auth/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
          <Link href="/auth/login" className="bg-lime-400 text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-lime-300 transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-full px-4 py-1.5 text-lime-400 text-sm mb-8">
          <Zap className="w-3.5 h-3.5" />
          Gemini Vision + Claude · Osiris 7-filter methodology
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          AI Trading Signals<br />
          <span className="text-lime-400">From Any Chart</span>
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload a screenshot of any crypto chart. Get instant entry, stop-loss, and take-profit levels in under 10 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login" className="bg-lime-400 text-black font-semibold px-8 py-4 rounded-xl text-lg hover:bg-lime-300 transition-all flex items-center justify-center gap-2 group">
            Analyze Your First Chart Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/pricing" className="border border-white/10 text-white/70 px-8 py-4 rounded-xl text-lg hover:border-white/20 transition-all">
            View Pricing
          </Link>
        </div>
        <p className="text-sm text-white/30 mt-4">No credit card required · 3 free analyses per day</p>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '< 10s', label: 'Analysis time' },
            { value: '7', label: 'Osiris filters' },
            { value: 'Free', label: 'To start' },
            { value: 'Any', label: 'Platform supported' },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-lime-400 mb-1">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: '01', title: 'Upload chart', desc: 'Screenshot from TradingView, Binance, Bybit, or any platform.', icon: BarChart2 },
            { step: '02', title: 'Osiris AI analyzes', desc: 'Gemini reads the chart. Claude applies 7 filters for signal generation.', icon: Zap },
            { step: '03', title: 'Get precise signals', desc: 'Entry price, stop-loss, 3 take-profit targets, R:R ratio, and rationale.', icon: Target },
          ].map((item) => (
            <div key={item.step} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
              <div className="text-3xl font-bold text-lime-400/25 mb-3">{item.step}</div>
              <div className="w-8 h-8 bg-lime-400/10 rounded-lg flex items-center justify-center mb-3">
                <item.icon className="w-4 h-4 text-lime-400" />
              </div>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Osiris methodology */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-lime-400/[0.03] border border-lime-400/[0.12] rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="text-lime-400 text-sm font-medium">The Osiris Methodology</span>
            <h2 className="text-2xl font-bold mt-1">7 filters. Every signal.</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: '1', name: 'Fuel', desc: 'Momentum & volume' },
              { n: '2', name: 'Tension', desc: 'Price compression' },
              { n: '3', name: 'Trend Sync', desc: 'Higher TF alignment' },
              { n: '4', name: 'BTC Shield', desc: 'BTC correlation' },
              { n: '5', name: 'Structure', desc: 'S/R & order blocks' },
              { n: '6', name: 'Entry Zone', desc: 'Optimal positioning' },
              { n: '7', name: 'Trigger', desc: 'Entry confirmation' },
            ].map((f) => (
              <div key={f.n} className="bg-white/[0.03] rounded-xl p-3 text-center">
                <div className="text-lime-400 text-xs font-bold mb-1">#{f.n}</div>
                <div className="font-medium text-sm">{f.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-3">Start analyzing for free</h2>
          <p className="text-white/40 mb-8">3 free analyses every day. No credit card needed.</p>
          <Link href="/auth/login" className="bg-lime-400 text-black font-semibold px-8 py-4 rounded-xl text-lg hover:bg-lime-300 transition-all inline-flex items-center gap-2 group">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] py-8 px-6 text-center text-sm text-white/25">
        <p>ChartAI is for educational purposes only. Not financial advice. Trade at your own risk.</p>
        <p className="mt-2">© 2025 ChartAI · <Link href="/pricing" className="hover:text-white/50">Pricing</Link> · <Link href="/auth/login" className="hover:text-white/50">Sign in</Link></p>
      </footer>
    </div>
  )
}
