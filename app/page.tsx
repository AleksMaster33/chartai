'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, TrendingUp, TrendingDown, Zap, Shield, Target,
  BarChart2, Activity, ChevronRight, Minus, Brain, ScanLine,
  CheckCircle2, Lock, Cpu, Globe
} from 'lucide-react'

/* ─── palette ─────────────────────────────────────── */
const LIME   = '#84cc16'
const LIME_B = '#a3e635'
const RED    = '#ef4444'
const AMBER  = '#f59e0b'
const GREEN  = '#22c55e'

/* ─── data ────────────────────────────────────────── */
const TICKERS = [
  { pair:'BTC/USDT',  signal:'LONG',    conf:'84%', up:true  },
  { pair:'ETH/USDT',  signal:'LONG',    conf:'71%', up:true  },
  { pair:'SOL/USDT',  signal:'SHORT',   conf:'68%', up:false },
  { pair:'BNB/USDT',  signal:'NEUTRAL', conf:'52%', up:null  },
  { pair:'XRP/USDT',  signal:'LONG',    conf:'77%', up:true  },
  { pair:'AVAX/USDT', signal:'SHORT',   conf:'63%', up:false },
  { pair:'ADA/USDT',  signal:'LONG',    conf:'79%', up:true  },
  { pair:'DOGE/USDT', signal:'NEUTRAL', conf:'58%', up:null  },
  { pair:'MATIC/USDT',signal:'LONG',    conf:'72%', up:true  },
  { pair:'LINK/USDT', signal:'SHORT',   conf:'65%', up:false },
]

const OSIRIS_FILTERS = [
  { n:'01', name:'Fuel',       desc:'Momentum & volume',    ok:true  },
  { n:'02', name:'Tension',    desc:'Price compression',    ok:true  },
  { n:'03', name:'Trend Sync', desc:'Higher-TF alignment',  ok:true  },
  { n:'04', name:'BTC Shield', desc:'Correlation guard',    ok:true  },
  { n:'05', name:'Structure',  desc:'S/R & order blocks',   ok:true  },
  { n:'06', name:'Entry Zone', desc:'Optimal entry risk',   ok:true  },
  { n:'07', name:'Trigger',    desc:'Confirmation signal',  ok:true  },
]

const STEPS = [
  { n:'1', icon:BarChart2, title:'Upload any chart',  desc:'Screenshot from TradingView, Binance, Bybit, OKX — any platform, any timeframe, any asset.' },
  { n:'2', icon:Brain,     title:'Dual AI analysis',  desc:'Gemini 2.0 Flash Vision reads your chart visually. Claude Sonnet applies all 7 Osiris filters.' },
  { n:'3', icon:Target,    title:'Receive signal',    desc:'Entry, stop-loss, 3 take-profits, R:R ratio, confidence score and full Osiris rationale.' },
]

const FEATURES = [
  { icon:Zap,       title:'Under 10 seconds',    desc:'Gemini Flash Vision + Claude Sonnet run in parallel — full signal in < 10 s.' },
  { icon:Shield,    title:'7-Filter Osiris',      desc:'Every signal passes Fuel, Tension, Trend Sync, BTC Shield, Structure, Entry Zone & Trigger.' },
  { icon:BarChart2, title:'Any chart, any asset', desc:'TradingView, Binance, Bybit, OKX or any platform. Crypto, forex, stocks — all supported.' },
  { icon:Brain,     title:'Dual AI pipeline',     desc:'Gemini reads the image; Claude reasons over it using the full Osiris methodology.' },
  { icon:Target,    title:'Full risk levels',     desc:'Entry, stop-loss and 3 take-profit levels with exact R:R ratio on every signal.' },
  { icon:Activity,  title:'Confidence scoring',   desc:'7-of-7 filter confidence score tells you exactly how strong each setup is.' },
]

/* ─── animated counter ────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    const dur = 1000
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref}>{n}{suffix}</span>
}

/* ─── hero analysis card ──────────────────────────── */
function AnalysisCard() {
  const [bar, setBar] = useState(0)
  useEffect(() => { const t = setTimeout(() => setBar(84), 800); return () => clearTimeout(t) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 0 1px rgba(132,204,22,0.06), 0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#84cc16]" style={{ animation:'blink 1.8s ease-in-out infinite' }} />
          <span className="font-display font-bold text-sm">BTC/USDT</span>
          <span className="text-xs text-white/30 font-display bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded">4H</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background:'rgba(132,204,22,0.1)', border:'1px solid rgba(132,204,22,0.22)' }}>
          <TrendingUp className="w-3.5 h-3.5 text-[#84cc16]" />
          <span className="font-display font-bold text-[#84cc16] text-sm">LONG</span>
        </div>
      </div>

      {/* confidence */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/35 font-display">Osiris Confidence</span>
          <span className="font-mono font-bold text-[#84cc16] text-sm">84%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-[1200ms] ease-out"
            style={{ width:`${bar}%`, background:'linear-gradient(90deg,#65a30d,#84cc16,#a3e635)' }} />
        </div>
        {/* osiris pills */}
        <div className="flex flex-wrap gap-1 mt-3">
          {OSIRIS_FILTERS.map(f => (
            <span key={f.n} className="text-[9px] font-display font-semibold px-2 py-0.5 rounded-full"
              style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.15)', color:'rgba(132,204,22,0.8)' }}>
              {f.name}
            </span>
          ))}
        </div>
      </div>

      {/* levels */}
      <div className="px-5 py-4 grid grid-cols-2 gap-2">
        {[
          { label:'Entry',    val:'$84,220', color:LIME,  bg:'rgba(132,204,22,0.06)',  border:'rgba(132,204,22,0.15)' },
          { label:'Stop Loss',val:'$81,400', color:RED,   bg:'rgba(239,68,68,0.06)',   border:'rgba(239,68,68,0.15)'  },
          { label:'TP 1',     val:'$88,500', color:GREEN, bg:'rgba(34,197,94,0.05)',   border:'rgba(34,197,94,0.12)'  },
          { label:'TP 2',     val:'$93,000', color:GREEN, bg:'rgba(34,197,94,0.04)',   border:'rgba(34,197,94,0.10)'  },
        ].map(l => (
          <div key={l.label} className="rounded-xl px-3 py-2.5"
            style={{ background:l.bg, border:`1px solid ${l.border}` }}>
            <div className="text-[10px] text-white/30 font-display mb-0.5">{l.label}</div>
            <div className="font-mono font-bold text-sm" style={{ color:l.color }}>{l.val}</div>
          </div>
        ))}
      </div>

      {/* rationale */}
      <div className="px-5 pb-5 pt-1 border-t border-white/[0.04]">
        <p className="text-[11px] text-white/30 font-display leading-relaxed">
          Bullish confluence: all 7 Osiris filters passed. BTC holding key $82K support.
          Fuel strong, Tension breakout confirmed. R:R 1:3.2
        </p>
      </div>

      {/* R:R badge */}
      <div className="absolute top-3 right-20 hidden">
        <span className="font-mono text-xs text-white/40">R:R 1:3.2</span>
      </div>
    </motion.div>
  )
}

/* ─── page ────────────────────────────────────────── */
export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 })

  useEffect(() => {
    setMounted(true)
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  const tickers = [...TICKERS, ...TICKERS, ...TICKERS]

  return (
    <div className="min-h-screen bg-[#090909] overflow-x-hidden">

      {/* cursor glow */}
      {mounted && (
        <div className="pointer-events-none fixed z-50" style={{
          left: mouse.x - 350, top: mouse.y - 350,
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(132,204,22,0.032) 0%, transparent 65%)',
          transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1)',
        }} />
      )}

      {/* bg grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full"
          style={{ background:'radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 55%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background:'radial-gradient(circle, rgba(34,211,238,0.025) 0%, transparent 55%)' }} />
      </div>

      {/* ── NAV ───────────────────────────────────────── */}
      <header className="relative z-30 border-b border-white/[0.05]"
        style={{ background:'rgba(9,9,9,0.85)', backdropFilter:'blur(20px)' }}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.45 }}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative"
              style={{ background:LIME }}>
              <TrendingUp className="w-4 h-4 text-black" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#84cc16] border-2 border-[#090909]"
                style={{ animation:'blink 1.8s ease-in-out infinite' }} />
            </div>
            <span className="font-display font-extrabold text-[15px] tracking-tight">ChartAI</span>
          </motion.div>

          <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.45 }}
            className="flex items-center gap-1">
            <Link href="/pricing"
              className="px-4 py-2 text-sm text-white/40 hover:text-white/75 transition-colors font-display rounded-xl hover:bg-white/[0.03]">
              Pricing
            </Link>
            <Link href="/auth/login"
              className="px-4 py-2 text-sm text-white/40 hover:text-white/75 transition-colors font-display rounded-xl hover:bg-white/[0.03]">
              Sign in
            </Link>
            <Link href="/auth/login"
              className="ml-2 flex items-center gap-2 font-display font-bold text-sm text-black px-5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px"
              style={{ background:LIME, boxShadow:`0 0 0 1px rgba(132,204,22,0.3), 0 4px 16px rgba(132,204,22,0.2)` }}>
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* left */}
          <div>
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-display"
              style={{ background:'rgba(132,204,22,0.07)', border:'1px solid rgba(132,204,22,0.18)', color:'rgba(132,204,22,0.85)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" style={{ animation:'blink 1.8s ease-in-out infinite' }} />
              Live Osiris AI · Chart Analysis
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.08, duration:0.55, ease:[0.22,1,0.36,1] }}
              className="font-display font-extrabold tracking-tight leading-[0.9] mb-6"
              style={{ fontSize:'clamp(3.2rem,7vw,5.5rem)' }}>
              <span className="block text-white">ChartAI</span>
              <span className="block" style={{
                background:'linear-gradient(135deg,#84cc16 0%,#a3e635 50%,#84cc16 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text',
                textShadow:'none',
              }}>
                AI Trading Signals
              </span>
              <span className="block text-white/80">From Any Chart</span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.18, duration:0.45 }}
              className="text-base text-white/45 leading-relaxed mb-8 max-w-lg">
              Upload a chart screenshot. ChartAI reads it with Gemini 2.0 Flash Vision,
              then applies the 7-filter Osiris methodology via Claude Sonnet — delivering
              entry, stop-loss and 3 take-profits in under 10 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.26, duration:0.4 }}
              className="flex flex-wrap gap-3 mb-8">
              <Link href="/auth/login"
                className="flex items-center gap-2.5 font-display font-bold text-black px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-[15px]"
                style={{ background:LIME, boxShadow:`0 0 0 1px rgba(132,204,22,0.3), 0 6px 24px rgba(132,204,22,0.2)` }}>
                Analyze First Chart Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing"
                className="flex items-center gap-2 font-display font-semibold text-white/50 px-7 py-3.5 rounded-xl transition-all duration-200 hover:text-white/75 hover:border-white/15 text-[15px] border border-white/[0.08] hover:bg-white/[0.02]">
                View pricing
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* tech stack tags */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.38, duration:0.4 }}
              className="flex flex-wrap gap-2 items-center">
              {['Gemini 2.0 Flash', 'Claude Sonnet', 'Osiris 7-Filter', 'Any Platform'].map(t => (
                <span key={t}
                  className="text-[11px] font-display text-white/30 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.025]">
                  {t}
                </span>
              ))}
              <span className="text-[11px] text-white/20 font-display ml-1 flex items-center gap-1">
                <Lock className="w-3 h-3" /> No credit card
              </span>
            </motion.div>
          </div>

          {/* right: live analysis card */}
          <div className="hidden lg:block">
            <AnalysisCard />
          </div>
        </div>
      </section>

      {/* ── LIVE TICKER ──────────────────────────────── */}
      <div className="relative z-10 border-y border-white/[0.04] overflow-hidden py-2.5"
        style={{ background:'rgba(255,255,255,0.008)' }}>
        <div className="absolute left-0 inset-y-0 w-20 z-10 pointer-events-none"
          style={{ background:'linear-gradient(90deg,#090909,transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-20 z-10 pointer-events-none"
          style={{ background:'linear-gradient(-90deg,#090909,transparent)' }} />
        <div className="ticker-track gap-8 items-center">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="text-[11px] font-display font-semibold text-white/25">{t.pair}</span>
              {t.up === true  && <TrendingUp   className="w-3 h-3 opacity-70" style={{ color:LIME  }} />}
              {t.up === false && <TrendingDown className="w-3 h-3 opacity-70" style={{ color:RED   }} />}
              {t.up === null  && <Minus        className="w-3 h-3 opacity-70" style={{ color:AMBER }} />}
              <span className="text-[11px] font-display font-bold"
                style={{ color: t.signal==='LONG'?LIME : t.signal==='SHORT'?RED : AMBER }}>
                {t.signal}
              </span>
              <span className="text-[10px] font-mono text-white/18">{t.conf}</span>
              <span className="w-px h-3 bg-white/[0.07] mx-3" />
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val:10, suffix:'s',  label:'Avg analysis time',   sub:'Gemini + Claude pipeline' },
            { val:7,  suffix:'',   label:'Osiris filters',      sub:'All applied simultaneously' },
            { val:3,  suffix:'',   label:'Free daily analyses', sub:'No credit card required' },
            { val:100,suffix:'%',  label:'Chart compatibility',  sub:'Any platform, any asset' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-60px' }}
              transition={{ delay:i*0.08, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="rounded-2xl p-6 group cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{
                background:'rgba(255,255,255,0.025)',
                border:'1px solid rgba(255,255,255,0.055)',
                boxShadow:'0 0 0 1px transparent',
              }}
              whileHover={{ boxShadow:`0 0 0 1px rgba(132,204,22,0.12), 0 12px 40px rgba(0,0,0,0.3)` }}
            >
              <div className="font-display font-extrabold leading-none mb-2"
                style={{ fontSize:'2.75rem', color:LIME, fontFamily:"'JetBrains Mono', monospace" }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div className="font-display font-semibold text-sm text-white/70 mb-1">{s.label}</div>
              <div className="text-xs text-white/25 font-display">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity:0, y:18 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.5 }}
          className="mb-14">
          <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color:`${LIME}99` }}>
            How it works
          </p>
          <h2 className="font-display font-extrabold tracking-tight text-[2.2rem]">
            From chart to signal in 3 steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* connector */}
          <div className="hidden md:block absolute top-8 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px"
            style={{ background:`linear-gradient(90deg,${LIME}44,${LIME}22)` }} />

          {STEPS.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity:0, y:24 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-60px' }}
              transition={{ delay:i*0.1, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="relative rounded-2xl p-7 group transition-all duration-300 overflow-hidden"
              style={{
                background:'rgba(255,255,255,0.025)',
                border:'1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ borderColor:'rgba(132,204,22,0.15)', background:'rgba(255,255,255,0.035)' }}
            >
              {/* hover left bar */}
              <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background:`linear-gradient(180deg,${LIME}66,${LIME}22)` }} />

              {/* number badge */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-sm mb-5 transition-all duration-300"
                style={{ background:`rgba(132,204,22,0.1)`, border:`1px solid rgba(132,204,22,0.2)`, color:LIME }}>
                {s.n}
              </div>

              <h3 className="font-display font-bold text-[1.05rem] mb-2.5 text-white/90">{s.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────── */}
      <section className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity:0, y:18 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.5 }}
            className="mb-14">
            <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color:`${LIME}99` }}>
              Features
            </p>
            <h2 className="font-display font-extrabold tracking-tight text-[2.2rem]">
              Everything you need to trade smarter
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity:0, y:22 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-50px' }}
                transition={{ delay:i*0.07, duration:0.45, ease:[0.22,1,0.36,1] }}
                className="relative rounded-2xl p-6 group overflow-hidden transition-all duration-300"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.055)' }}
                whileHover={{ borderColor:'rgba(132,204,22,0.14)', background:'rgba(255,255,255,0.035)' }}
              >
                <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background:`linear-gradient(180deg,${LIME}55,${LIME}11)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.14)' }}>
                  <f.icon className="w-4.5 h-4.5" style={{ color:LIME, width:18, height:18 }} />
                </div>
                <h3 className="font-display font-bold text-[0.95rem] mb-2 text-white/85">{f.title}</h3>
                <p className="text-[13px] text-white/32 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OSIRIS SECTION ────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="rounded-3xl overflow-hidden relative"
          style={{
            background:'linear-gradient(135deg,rgba(132,204,22,0.04) 0%,rgba(9,9,9,0.98) 50%)',
            border:'1px solid rgba(132,204,22,0.1)',
          }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[70%]"
            style={{ background:'linear-gradient(90deg,transparent,rgba(132,204,22,0.35),transparent)' }} />

          <div className="p-10">
            <motion.div
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color:`${LIME}99` }}>The System</p>
                <h2 className="font-display font-extrabold tracking-tight text-[2.2rem]">
                  Osiris 7-Filter Method
                </h2>
              </div>
              <p className="text-sm text-white/30 max-w-xs md:text-right">
                Every signal passes all 7 filters simultaneously. No exceptions. No shortcuts.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {OSIRIS_FILTERS.map((f, i) => (
                <motion.div key={f.n}
                  initial={{ opacity:0, scale:0.88, y:14 }}
                  whileInView={{ opacity:1, scale:1, y:0 }}
                  viewport={{ once:true, margin:'-40px' }}
                  transition={{ delay:i*0.06, duration:0.4, ease:[0.22,1,0.36,1] }}
                  whileHover={{ scale:1.04 }}
                  className="rounded-xl p-4 text-center cursor-default transition-all duration-200 group"
                  style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="font-mono font-bold text-[10px] mb-2 opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ color:LIME }}>{f.n}</div>
                  <div className="font-display font-semibold text-[12px] text-white/80 mb-0.5">{f.name}</div>
                  <div className="text-[10px] text-white/20 leading-snug">{f.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl"
              style={{ background:'rgba(132,204,22,0.05)', border:'1px solid rgba(132,204,22,0.15)' }}>
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color:LIME }} />
              <span className="text-sm font-display text-white/60">
                When all 7 filters pass → <span className="text-[#84cc16] font-bold">High confidence signal</span> with full entry, SL and 3 TP targets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity:0, y:18 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.5 }}
            className="text-center mb-14">
            <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color:`${LIME}99` }}>Pricing</p>
            <h2 className="font-display font-extrabold tracking-tight text-[2.2rem]">
              Start free. Scale when ready.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name:'Free',   price:'€0',  period:'forever',  features:['3 analyses/day','Entry, SL & TP levels','Osiris confidence score'], cta:'Start free',     href:'/auth/login', accent:false },
              { name:'Pro',    price:'€12', period:'/month',   features:['Unlimited analyses','Full analysis history','Multi-timeframe','Priority speed'],  cta:'Upgrade to Pro', href:null,         accent:true,  badge:'Most popular' },
              { name:'Trader', price:'€29', period:'/month',   features:['Everything in Pro','API access','Telegram webhooks','Portfolio tracker'],       cta:'Go Trader',      href:null,         purple:true },
            ].map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity:0, y:22 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ delay:i*0.1, duration:0.5, ease:[0.22,1,0.36,1] }}
                className="relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: p.accent ? 'rgba(132,204,22,0.03)' : 'rgba(255,255,255,0.025)',
                  border: p.accent ? '1px solid rgba(132,204,22,0.25)' : 'rgba(purple)' in p ? '1px solid rgba(139,92,246,0.18)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                {'badge' in p && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-black text-[10px] font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ background:LIME }}>
                      {p.badge}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <div className="font-display font-semibold text-xs text-white/40 uppercase tracking-widest mb-3">{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-[2.25rem]">{p.price}</span>
                    <span className="text-white/25 text-sm font-display">{p.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0"
                        style={{ color: p.accent ? LIME : 'rgba(139,92,246,0.7)' in p ? '#a78bfa' : 'rgba(255,255,255,0.25)' }} />
                      <span className="text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
                {p.href ? (
                  <Link href={p.href}
                    className="w-full py-3 rounded-xl text-sm font-display font-bold text-center transition-all duration-200 border border-white/[0.07] text-white/40 hover:border-white/14 hover:text-white/60">
                    {p.cta}
                  </Link>
                ) : (
                  <Link href="/pricing"
                    className={`w-full py-3 rounded-xl text-sm font-display font-bold text-center transition-all duration-200 ${
                      p.accent
                        ? 'text-black hover:brightness-110'
                        : 'border border-purple-500/20 text-purple-300 hover:bg-purple-500/10'
                    }`}
                    style={p.accent ? { background:LIME, boxShadow:`0 4px 16px rgba(132,204,22,0.2)` } : {}}>
                    {p.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity:0, y:22 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
          className="relative rounded-3xl overflow-hidden text-center p-16"
          style={{
            background:'linear-gradient(135deg,rgba(132,204,22,0.06) 0%,rgba(9,9,9,0.98) 60%,rgba(34,211,238,0.02) 100%)',
            border:'1px solid rgba(132,204,22,0.12)',
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 120%, rgba(132,204,22,0.09) 0%, transparent 55%)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[500px]"
            style={{ background:'linear-gradient(90deg,transparent,rgba(132,204,22,0.4),transparent)' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-[11px] font-display"
              style={{ background:'rgba(132,204,22,0.07)', border:'1px solid rgba(132,204,22,0.18)', color:`${LIME}BB` }}>
              <ScanLine className="w-3 h-3" />
              Free to start · No credit card required
            </div>
            <h2 className="font-display font-extrabold tracking-tight text-[2.75rem] mb-3">
              Start analyzing for free
            </h2>
            <p className="text-white/35 mb-8 text-base">3 analyses daily. Upgrade anytime for unlimited access.</p>
            <Link href="/auth/login"
              className="inline-flex items-center gap-3 font-display font-bold text-black text-[15px] px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background:LIME, boxShadow:`0 0 0 1px rgba(132,204,22,0.3), 0 8px 32px rgba(132,204,22,0.25)` }}>
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:LIME }}>
              <TrendingUp className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-display font-bold text-sm">ChartAI</span>
            <span className="text-white/15 text-xs">© 2025</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/pricing"    className="text-xs text-white/20 hover:text-white/45 transition-colors font-display">Pricing</Link>
            <Link href="/auth/login" className="text-xs text-white/20 hover:text-white/45 transition-colors font-display">Sign in</Link>
            <span className="text-[11px] text-white/15 font-display">Educational only · Not financial advice</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  )
}
