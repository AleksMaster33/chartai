'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Zap, Shield, Target, BarChart2, Activity, ChevronRight } from 'lucide-react'

const TICKERS = [
  { pair:'BTC/USDT', signal:'LONG',    conf:'84%', c:'#84cc16' },
  { pair:'ETH/USDT', signal:'LONG',    conf:'71%', c:'#84cc16' },
  { pair:'SOL/USDT', signal:'SHORT',   conf:'68%', c:'#ef4444' },
  { pair:'BNB/USDT', signal:'NEUTRAL', conf:'52%', c:'#f59e0b' },
  { pair:'XRP/USDT', signal:'LONG',    conf:'77%', c:'#84cc16' },
  { pair:'AVAX/USDT',signal:'SHORT',   conf:'63%', c:'#ef4444' },
  { pair:'ADA/USDT', signal:'LONG',    conf:'79%', c:'#84cc16' },
  { pair:'DOGE/USDT',signal:'NEUTRAL', conf:'58%', c:'#f59e0b' },
  { pair:'MATIC/USDT',signal:'LONG',   conf:'72%', c:'#84cc16' },
  { pair:'LINK/USDT', signal:'SHORT',  conf:'65%', c:'#ef4444' },
]

const OSIRIS = [
  { n:'01', name:'Fuel',       desc:'Momentum & volume confirmation' },
  { n:'02', name:'Tension',    desc:'Price compression & squeeze' },
  { n:'03', name:'Trend Sync', desc:'Higher timeframe alignment' },
  { n:'04', name:'BTC Shield', desc:'Bitcoin correlation guard' },
  { n:'05', name:'Structure',  desc:'Support, resistance & order blocks' },
  { n:'06', name:'Entry Zone', desc:'Optimal risk entry positioning' },
  { n:'07', name:'Trigger',    desc:'Entry confirmation signal' },
]

const STATS = [
  { val:'< 10s', label:'Analysis time',   icon:Zap,       color:'#84cc16' },
  { val:'7',     label:'Osiris filters',  icon:Shield,    color:'#84cc16' },
  { val:'3',     label:'Free daily',      icon:Target,    color:'#84cc16' },
  { val:'∞',     label:'Chart sources',   icon:BarChart2, color:'#84cc16' },
]

export default function HomePage() {
  const [mouse, setMouse] = useState({ x:-1000, y:-1000 })
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  const tickers = [...TICKERS, ...TICKERS, ...TICKERS]

  return (
    <div className="min-h-screen bg-[#060606] overflow-hidden">

      {/* Ambient cursor */}
      {mounted && (
        <div className="pointer-events-none fixed z-[60]" style={{
          left: mouse.x - 250, top: mouse.y - 250,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(132,204,22,0.055) 0%, transparent 65%)',
          transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1), top 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      )}

      {/* Background */}
      <div className="fixed inset-0 line-grid pointer-events-none opacity-50" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full -top-64 left-1/2 -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.05) 0%, transparent 60%)' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full bottom-0 -right-48"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 60%)' }} />
      </div>

      {/* ── NAV ─────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/[0.05]">
        <nav className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="reveal flex items-center gap-2.5">
            <div className="pulse-ring w-8 h-8 bg-[#84cc16] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight">ChartAI</span>
            <div className="ml-2 flex items-center gap-1.5 bg-[#84cc16]/10 border border-[#84cc16]/20 rounded-full px-2.5 py-0.5">
              <div className="dot-live w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
              <span className="text-[10px] text-[#84cc16] font-display font-semibold tracking-wider uppercase">Live</span>
            </div>
          </div>

          <div className="reveal-d1 flex items-center gap-1">
            {['Pricing', 'Sign in'].map(l => (
              <Link key={l} href={l === 'Pricing' ? '/pricing' : '/auth/login'}
                className="px-4 py-2 text-sm text-white/40 hover:text-white/80 transition-colors font-display rounded-lg hover:bg-white/[0.04]">
                {l}
              </Link>
            ))}
            <Link href="/auth/login"
              className="ml-2 bg-[#84cc16] text-black text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#a3e635] transition-all duration-200 font-display glow-lime">
              Start Free
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal inline-flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.07] rounded-full px-4 py-2 mb-8">
            <Activity className="w-3.5 h-3.5 text-[#84cc16]" />
            <span className="text-xs text-white/50 font-display">Gemini 2.0 Flash Vision · Claude Sonnet · Osiris Methodology</span>
          </div>

          <h1 className="font-display font-extrabold tracking-tight leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}>
            <span className="reveal-d1 block text-white/90">AI Trading</span>
            <span className="reveal-d2 block text-[#84cc16] text-glow">Signals</span>
            <span className="reveal-d3 block text-white/90">From Any Chart</span>
          </h1>

          <p className="reveal-d4 text-lg text-white/40 mb-10 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-dm)' }}>
            Upload a screenshot. Get entry, stop-loss, and 3 take-profit targets in under 10 seconds — powered by the 7-filter Osiris methodology.
          </p>

          <div className="reveal-d5 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/auth/login"
              className="group flex items-center gap-3 bg-[#84cc16] text-black font-bold px-7 py-3.5 rounded-xl text-base hover:bg-[#a3e635] transition-all duration-200 font-display glow-lime hover:-translate-y-0.5">
              Analyze First Chart Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing"
              className="flex items-center gap-2 border border-white/[0.08] text-white/50 px-7 py-3.5 rounded-xl text-base hover:border-white/[0.15] hover:text-white/70 transition-all duration-200 font-display">
              View pricing
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="reveal-d6 mt-4 text-xs text-white/20 font-display">No credit card required · 3 free analyses per day</p>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────── */}
      <div className="relative z-10 border-y border-white/[0.04] bg-white/[0.01] overflow-hidden py-2.5">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #060606, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #060606, transparent)' }} />
        <div className="ticker-track gap-10">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0 select-none">
              <span className="text-[11px] font-display font-semibold text-white/30">{t.pair}</span>
              <span className="text-[11px] font-display font-bold" style={{ color: t.c }}>{t.signal}</span>
              <span className="text-[11px] text-white/20">{t.conf}</span>
              <span className="w-px h-3 bg-white/[0.08] mx-3" />
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ───────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 text-center cursor-default">
              <s.icon className="w-4 h-4 text-[#84cc16] mx-auto mb-3 opacity-60" />
              <div className="font-display font-extrabold text-[2rem] leading-none text-[#84cc16] mb-1.5">{s.val}</div>
              <div className="text-xs text-white/30 font-display">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <p className="text-[#84cc16] text-[11px] font-display font-bold tracking-[0.15em] uppercase mb-3">How it works</p>
          <h2 className="font-display font-extrabold text-[2.25rem] tracking-tight">From chart to signal in 3 steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n:'01', title:'Upload screenshot', desc:'Any chart from TradingView, Binance, Bybit, OKX — any platform, any timeframe, any asset class.', icon:BarChart2 },
            { n:'02', title:'Dual AI analysis', desc:'Gemini Flash Vision reads your chart visually. Claude Sonnet applies all 7 Osiris filters in parallel.', icon:Zap },
            { n:'03', title:'Receive signal', desc:'Entry price, stop-loss, 3 take-profit targets, R:R ratio, confidence score and detailed rationale.', icon:Target },
          ].map((s) => (
            <div key={s.n} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-4 right-5 font-display font-extrabold text-[5rem] leading-none text-white/[0.025] select-none pointer-events-none">{s.n}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#84cc16]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
              <div className="w-10 h-10 bg-[#84cc16]/10 border border-[#84cc16]/15 rounded-xl flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-[#84cc16]" />
              </div>
              <h3 className="font-display font-bold text-[1.05rem] mb-2">{s.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OSIRIS ──────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden border border-[#84cc16]/[0.08]">
          <div className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(132,204,22,0.05) 0%, transparent 60%)' }} />

          <div className="relative text-center mb-10">
            <p className="text-[#84cc16] text-[11px] font-display font-bold tracking-[0.15em] uppercase mb-3">The System</p>
            <h2 className="font-display font-extrabold text-[2.25rem] tracking-tight mb-2">Osiris 7-Filter Method</h2>
            <p className="text-sm text-white/30 max-w-sm mx-auto">Every signal passes through all 7 filters simultaneously. No filter skipped, no exceptions.</p>
          </div>

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OSIRIS.map((f) => (
              <div key={f.n}
                className="rounded-xl p-4 border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#84cc16]/20 transition-all duration-200 cursor-default group">
                <div className="text-[#84cc16] text-[10px] font-display font-bold mb-2 opacity-50 group-hover:opacity-100 transition-opacity">{f.n}</div>
                <div className="font-display font-semibold text-[13px] text-white/80 mb-1">{f.name}</div>
                <div className="text-[11px] text-white/25 leading-relaxed">{f.desc}</div>
              </div>
            ))}
            <div className="rounded-xl p-4 border border-[#84cc16]/20 bg-[#84cc16]/[0.04] flex flex-col justify-center items-center text-center cursor-default">
              <Shield className="w-5 h-5 text-[#84cc16] mb-2.5" />
              <div className="font-display font-bold text-[13px] text-[#84cc16] mb-1">All 7 Passed</div>
              <div className="text-[11px] text-[#84cc16]/40">= High confidence signal</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(132,204,22,0.06) 0%, transparent 60%)' }} />
          <div className="relative">
            <h2 className="font-display font-extrabold text-[2.75rem] tracking-tight mb-3">Start analyzing for free</h2>
            <p className="text-white/35 mb-8 text-base">3 analyses daily. No credit card required.</p>
            <Link href="/auth/login"
              className="group inline-flex items-center gap-3 bg-[#84cc16] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#a3e635] transition-all duration-200 font-display glow-lime hover:-translate-y-0.5">
              Get Started — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center">
        <p className="text-[11px] text-white/20 font-display">ChartAI · Educational purposes only · Not financial advice · Trade at your own risk</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <Link href="/pricing" className="text-[11px] text-white/15 hover:text-white/35 transition-colors font-display">Pricing</Link>
          <span className="text-white/10">·</span>
          <Link href="/auth/login" className="text-[11px] text-white/15 hover:text-white/35 transition-colors font-display">Sign in</Link>
          <span className="text-white/10">·</span>
          <span className="text-[11px] text-white/10 font-display">© 2025 ChartAI</span>
        </div>
      </footer>
    </div>
  )
}
