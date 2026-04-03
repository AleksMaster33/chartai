'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Zap, Shield, Target, BarChart2 } from 'lucide-react'

const TICKERS = [
  { pair: 'BTC/USDT', signal: 'LONG', conf: '84%', color: '#84cc16' },
  { pair: 'ETH/USDT', signal: 'LONG', conf: '71%', color: '#84cc16' },
  { pair: 'SOL/USDT', signal: 'SHORT', conf: '68%', color: '#ef4444' },
  { pair: 'BNB/USDT', signal: 'NEUTRAL', conf: '52%', color: '#f59e0b' },
  { pair: 'XRP/USDT', signal: 'LONG', conf: '77%', color: '#84cc16' },
  { pair: 'DOGE/USDT', signal: 'SHORT', conf: '63%', color: '#ef4444' },
  { pair: 'ADA/USDT', signal: 'LONG', conf: '79%', color: '#84cc16' },
  { pair: 'AVAX/USDT', signal: 'NEUTRAL', conf: '58%', color: '#f59e0b' },
]

const OSIRIS = [
  { n: '01', name: 'Fuel', desc: 'Momentum & volume' },
  { n: '02', name: 'Tension', desc: 'Price compression' },
  { n: '03', name: 'Trend Sync', desc: 'Higher TF alignment' },
  { n: '04', name: 'BTC Shield', desc: 'Correlation guard' },
  { n: '05', name: 'Structure', desc: 'S/R & order blocks' },
  { n: '06', name: 'Entry Zone', desc: 'Optimal entry area' },
  { n: '07', name: 'Trigger', desc: 'Confirmation signal' },
]

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])

  const tickerItems = [...TICKERS, ...TICKERS]

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0ede8] overflow-hidden">

      {mounted && (
        <div className="fixed pointer-events-none z-50 transition-all duration-700"
          style={{ left: mousePos.x-200, top: mousePos.y-200, width:400, height:400, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(132,204,22,0.06) 0%, transparent 70%)' }} />
      )}

      <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-[#84cc16] opacity-[0.04] -top-48 -right-48" />
        <div className="orb w-[500px] h-[500px] bg-blue-500 opacity-[0.025] bottom-0 -left-48" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="fade-up flex items-center gap-2.5">
          <div className="relative w-8 h-8 bg-[#84cc16] rounded-xl flex items-center justify-center pulse-ring">
            <TrendingUp className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">ChartAI</span>
        </div>
        <div className="fade-up delay-1 flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors font-display">Pricing</Link>
          <Link href="/auth/login" className="text-sm text-white/40 hover:text-white/80 transition-colors font-display">Sign in</Link>
          <Link href="/auth/login" className="bg-[#84cc16] text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#a3e635] transition-all font-display">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="fade-up delay-1 inline-flex items-center gap-2.5 glass border border-[#84cc16]/20 rounded-full px-5 py-2 mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
          <span className="text-[#84cc16] text-sm font-display">Gemini Vision · Claude Osiris · Live</span>
        </div>

        <h1 className="font-display font-extrabold leading-[0.92] tracking-tight mb-8" style={{fontSize:'clamp(3.5rem,9vw,6.5rem)'}}>
          <span className="fade-up delay-2 block text-white/90">AI Trading</span>
          <span className="fade-up delay-3 block">
            <span className="text-[#84cc16]">Signals</span> From Any
          </span>
          <span className="fade-up delay-4 block text-white/90">Chart</span>
        </h1>

        <p className="fade-up delay-5 text-xl text-white/40 mb-12 max-w-xl mx-auto leading-relaxed font-light">
          Upload a screenshot. Get entry, stop-loss, and take-profit in under 10 seconds — powered by the 7-filter Osiris methodology.
        </p>

        <div className="fade-up delay-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/login"
            className="group relative inline-flex items-center gap-3 bg-[#84cc16] text-black font-bold px-8 py-4 rounded-2xl text-lg overflow-hidden hover:bg-[#a3e635] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(132,204,22,0.3)]">
            Analyze First Chart Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/pricing"
            className="inline-flex items-center gap-2 border border-white/10 text-white/60 px-8 py-4 rounded-2xl text-lg hover:border-white/20 hover:text-white/80 transition-all duration-300 font-display">
            View Plans
          </Link>
        </div>
        <p className="fade-up delay-6 text-xs text-white/25 mt-6 font-display">No credit card · 3 free analyses daily</p>
      </section>

      {/* Ticker */}
      <div className="relative z-10 border-y border-white/[0.04] py-3 mb-24 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />
        <div className="ticker-inner gap-12">
          {tickerItems.map((t, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-white/30 font-display font-semibold">{t.pair}</span>
              <span className="text-xs font-display font-bold" style={{color:t.color}}>{t.signal}</span>
              <span className="text-xs text-white/20">{t.conf}</span>
              <span className="text-white/10 mx-4">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '< 10s', label: 'Analysis time', icon: Zap },
            { val: '7', label: 'Osiris filters', icon: Shield },
            { val: '3', label: 'Free daily', icon: Target },
            { val: '∞', label: 'Chart sources', icon: BarChart2 },
          ].map((s, i) => (
            <div key={s.label} className={`glass glass-hover rounded-2xl p-6 text-center fade-up delay-${i+1}`}>
              <s.icon className="w-5 h-5 text-[#84cc16] mx-auto mb-3 opacity-70" />
              <div className="font-display font-extrabold text-3xl text-[#84cc16] mb-1">{s.val}</div>
              <div className="text-xs text-white/30 font-display">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-28">
        <div className="text-center mb-14">
          <p className="text-[#84cc16] text-xs font-display font-bold tracking-widest uppercase mb-3">Process</p>
          <h2 className="font-display font-extrabold text-4xl">Three steps to signal</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: '01', title: 'Upload screenshot', desc: 'Any chart from TradingView, Binance, Bybit, OKX — any platform, any timeframe.', icon: BarChart2 },
            { n: '02', title: 'Osiris AI analyzes', desc: 'Gemini Vision reads the chart. Claude applies all 7 Osiris filters simultaneously.', icon: Zap },
            { n: '03', title: 'Receive signal', desc: 'Entry, stop-loss, 3 TP targets, R:R ratio, confidence score and full rationale.', icon: Target },
          ].map((item, i) => (
            <div key={item.n} className={`glass glass-hover rounded-2xl p-7 relative overflow-hidden fade-up delay-${i+2}`}>
              <div className="absolute top-4 right-5 font-display font-extrabold text-6xl text-white/[0.03] select-none">{item.n}</div>
              <div className="w-10 h-10 bg-[#84cc16]/10 border border-[#84cc16]/20 rounded-xl flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-[#84cc16]" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Osiris */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-28">
        <div className="glass rounded-3xl p-10 border border-[#84cc16]/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#84cc16]/[0.03] to-transparent pointer-events-none" />
          <div className="text-center mb-10">
            <p className="text-[#84cc16] text-xs font-display font-bold tracking-widest uppercase mb-3">The System</p>
            <h2 className="font-display font-extrabold text-4xl">Osiris 7-Filter Method</h2>
            <p className="text-white/30 mt-3 text-sm">Every signal passes through all 7 filters. No exceptions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OSIRIS.map((f, i) => (
              <div key={f.n} className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-[#84cc16]/20 rounded-xl p-4 transition-all duration-300 cursor-default">
                <div className="text-[#84cc16]/50 text-xs font-display font-bold mb-2">{f.n}</div>
                <div className="font-display font-semibold text-sm mb-1">{f.name}</div>
                <div className="text-xs text-white/25">{f.desc}</div>
              </div>
            ))}
            <div className="bg-[#84cc16]/5 border border-[#84cc16]/20 rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <Shield className="w-5 h-5 text-[#84cc16] mb-2" />
              <div className="font-display font-bold text-sm text-[#84cc16]">All 7 passed</div>
              <div className="text-xs text-white/25 mt-1">= High confidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass rounded-3xl p-16 text-center relative overflow-hidden border border-white/[0.05]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#84cc16]/[0.04] to-transparent pointer-events-none" />
          <h2 className="font-display font-extrabold text-5xl mb-4">Start for free</h2>
          <p className="text-white/35 mb-10 text-lg">3 analyses daily. No credit card required.</p>
          <Link href="/auth/login"
            className="group inline-flex items-center gap-3 bg-[#84cc16] text-black font-bold px-10 py-5 rounded-2xl text-xl hover:bg-[#a3e635] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(132,204,22,0.35)]">
            Get Started Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center">
        <p className="text-xs text-white/20 font-display">ChartAI · Educational only · Not financial advice</p>
        <p className="text-xs text-white/10 mt-2">© 2025 ChartAI · <Link href="/pricing" className="hover:text-white/25">Pricing</Link></p>
      </footer>
    </div>
  )
}
