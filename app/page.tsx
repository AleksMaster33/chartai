'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, TrendingUp, TrendingDown, Zap, Shield, Target,
  BarChart2, Activity, ChevronRight, Minus, Brain, ScanLine,
  CheckCircle2, Lock, Cpu, Globe, Flame, Layers, GitMerge,
  Radio, Crosshair, Gauge,
} from 'lucide-react'

/* ─── palette (new DS) ────────────────────────────────── */
const G    = '#00FF88'   // primary green
const GLOW = 'rgba(0,255,136,0.22)'
const BLUE = '#00D4FF'
const RED  = '#FF3B5C'
const AMB  = '#FFB800'

/* ─── data ─────────────────────────────────────────────── */
const TICKERS = [
  { pair:'BTC/USDT',   signal:'LONG',    conf:'84%', dir: 1  },
  { pair:'ETH/USDT',   signal:'LONG',    conf:'71%', dir: 1  },
  { pair:'SOL/USDT',   signal:'SHORT',   conf:'68%', dir:-1  },
  { pair:'BNB/USDT',   signal:'NEUTRAL', conf:'52%', dir: 0  },
  { pair:'XRP/USDT',   signal:'LONG',    conf:'77%', dir: 1  },
  { pair:'AVAX/USDT',  signal:'SHORT',   conf:'63%', dir:-1  },
  { pair:'ADA/USDT',   signal:'LONG',    conf:'79%', dir: 1  },
  { pair:'DOGE/USDT',  signal:'NEUTRAL', conf:'58%', dir: 0  },
  { pair:'MATIC/USDT', signal:'LONG',    conf:'72%', dir: 1  },
  { pair:'LINK/USDT',  signal:'SHORT',   conf:'65%', dir:-1  },
]

const OSIRIS_FILTERS = [
  { n:'01', name:'Fuel',        desc:'Momentum & volume surge',    icon:Flame      },
  { n:'02', name:'Tension',     desc:'Price compression setup',    icon:Layers     },
  { n:'03', name:'Trend Sync',  desc:'Higher-TF alignment check',  icon:GitMerge   },
  { n:'04', name:'BTC Shield',  desc:'Low correlation guard',      icon:Shield     },
  { n:'05', name:'Structure',   desc:'S/R & order block zones',    icon:BarChart2  },
  { n:'06', name:'Entry Zone',  desc:'Optimal entry risk ratio',   icon:Crosshair  },
  { n:'07', name:'Trigger',     desc:'Confirmation signal fired',  icon:Zap        },
]

const STEPS = [
  { n:'01', icon:BarChart2, title:'Upload your chart',  desc:'Screenshot from TradingView, Binance, Bybit, OKX — any platform, any timeframe, any pair.' },
  { n:'02', icon:Brain,     title:'Dual AI pipeline',   desc:'Gemini 2.0 Flash Vision reads your chart. Claude Sonnet applies all 7 Osiris filters in parallel.' },
  { n:'03', icon:Target,    title:'Receive your signal',desc:'Entry, stop-loss, 3 take-profits, R:R ratio, confidence score and full Osiris rationale — in under 10s.' },
]

const FEATURES = [
  { icon:Zap,       title:'Under 10 seconds',    desc:'Gemini Flash Vision + Claude Sonnet run in parallel — full actionable signal in < 10 s.' },
  { icon:Shield,    title:'7-Filter Osiris',      desc:'Every signal passes Fuel, Tension, Trend Sync, BTC Shield, Structure, Entry Zone & Trigger.' },
  { icon:BarChart2, title:'Any chart, any asset', desc:'TradingView, Binance, Bybit, OKX or any platform. Crypto, forex, equities — all supported.' },
  { icon:Brain,     title:'Dual AI pipeline',     desc:'Gemini reads the image; Claude Sonnet reasons over it using the full Osiris methodology.' },
  { icon:Target,    title:'Full risk levels',     desc:'Entry, stop-loss and 3 take-profit levels with exact R:R ratio on every single signal.' },
  { icon:Activity,  title:'Confidence scoring',   desc:'7-of-7 filter confluence score tells you exactly how strong each setup is before you trade.' },
]

const LIVE_STATS = [
  { label:'Signals Today',     val:'2,400+', icon:Radio   },
  { label:'Avg Confidence',    val:'87%',    icon:Gauge   },
  { label:'Analysis Speed',    val:'<10s',   icon:Zap     },
  { label:'Osiris Filters',    val:'7',      icon:Shield  },
  { label:'Supported Pairs',   val:'500+',   icon:Globe   },
  { label:'Platforms',         val:'Any',    icon:Cpu     },
]

/* ─── animated counter ─────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    const dur = 1100
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

/* ─── hero analysis card ────────────────────────────────── */
function AnalysisCard() {
  const [bar, setBar] = useState(0)
  useEffect(() => { const t = setTimeout(() => setBar(87), 900); return () => clearTimeout(t) }, [])

  const levels = [
    { label:'Entry',     val:'$84,220', color:G,    bg:`rgba(0,255,136,0.06)`,  border:`rgba(0,255,136,0.15)` },
    { label:'Stop Loss', val:'$81,400', color:RED,  bg:`rgba(255,59,92,0.06)`,  border:`rgba(255,59,92,0.15)`  },
    { label:'TP 1',      val:'$88,500', color:BLUE, bg:`rgba(0,212,255,0.05)`,  border:`rgba(0,212,255,0.12)`  },
    { label:'TP 2',      val:'$93,000', color:BLUE, bg:`rgba(0,212,255,0.04)`,  border:`rgba(0,212,255,0.10)`  },
  ]

  return (
    <motion.div
      initial={{ opacity:0, y:28, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay:0.4, duration:0.65, ease:[0.22,1,0.36,1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:'rgba(13,17,23,0.80)',
        border:`1px solid rgba(0,255,136,0.12)`,
        boxShadow:`0 0 0 1px rgba(0,255,136,0.06), 0 32px 80px rgba(0,0,0,0.60)`,
      }}
    >
      {/* top accent line */}
      <div className="h-px w-full" style={{ background:`linear-gradient(90deg,transparent,${G}55,transparent)` }} />

      {/* header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <span className="live-dot" />
          <span className="font-display font-bold text-sm text-[#E8EDF5]">BTC/USDT</span>
          <span className="text-xs text-white/30 font-display bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded">4H</span>
        </div>
        <div className="badge-bullish">
          <TrendingUp style={{ width:13, height:13 }} />
          LONG
        </div>
      </div>

      {/* confidence bar */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/35 font-display">Osiris Confidence</span>
          <span className="metric-value-green text-sm">87%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-[1300ms] ease-out"
            style={{ width:`${bar}%`, background:`linear-gradient(90deg,${G}88,${G})` }} />
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {OSIRIS_FILTERS.map(f => (
            <span key={f.n} className="tag-lime" style={{ fontSize:9 }}>{f.name}</span>
          ))}
        </div>
      </div>

      {/* price levels */}
      <div className="px-5 py-4 grid grid-cols-2 gap-2">
        {levels.map(l => (
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
          All 7 Osiris filters passed. BTC holding $82K support. Fuel strong, Tension breakout confirmed.{' '}
          <span className="text-[#00FF88]">R:R 1:3.4</span>
        </p>
      </div>
    </motion.div>
  )
}

/* ─── page ──────────────────────────────────────────────── */
export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mouse, setMouse] = useState({ x:-1000, y:-1000 })
  const tickers = [...TICKERS, ...TICKERS, ...TICKERS]

  useEffect(() => {
    setMounted(true)
    const h = (e: MouseEvent) => setMouse({ x:e.clientX, y:e.clientY })
    window.addEventListener('mousemove', h, { passive:true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#080B10' }}>

      {/* cursor orb */}
      {mounted && (
        <div className="pointer-events-none fixed z-50" style={{
          left:mouse.x - 380, top:mouse.y - 380,
          width:760, height:760, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,255,136,0.028) 0%, transparent 65%)',
          transition:'left 0.6s cubic-bezier(0.4,0,0.2,1), top 0.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
      )}

      {/* bg layer */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div className="line-grid absolute inset-0 opacity-70" />
        <div className="absolute -top-80 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background:'radial-gradient(circle, rgba(0,255,136,0.045) 0%, transparent 55%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background:'radial-gradient(circle, rgba(0,212,255,0.025) 0%, transparent 55%)' }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────── */}
      <header className="relative z-30 border-b" style={{ background:'rgba(8,11,16,0.88)', backdropFilter:'blur(20px)', borderColor:'rgba(255,255,255,0.048)' }}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative" style={{ background:G }}>
              <TrendingUp className="w-4 h-4 text-black" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 live-dot" style={{ borderColor:'#080B10' }} />
            </div>
            <span className="font-display font-extrabold text-[15px] tracking-tight text-[#E8EDF5]">ChartAI</span>
          </motion.div>

          <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
            className="flex items-center gap-1">
            <Link href="/pricing"
              className="px-4 py-2 text-[13px] font-display font-medium transition-colors rounded-xl hover:bg-white/[0.03]"
              style={{ color:'rgba(232,237,245,0.40)' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(232,237,245,0.75)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(232,237,245,0.40)')}>
              Pricing
            </Link>
            <Link href="/auth/login"
              className="px-4 py-2 text-[13px] font-display font-medium transition-colors rounded-xl hover:bg-white/[0.03]"
              style={{ color:'rgba(232,237,245,0.40)' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(232,237,245,0.75)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(232,237,245,0.40)')}>
              Sign in
            </Link>
            <Link href="/auth/login"
              className="ml-2 flex items-center gap-2 font-display font-bold text-[13px] text-black px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px"
              style={{ background:G, boxShadow:`0 0 0 1px rgba(0,255,136,0.3), 0 4px 16px ${GLOW}` }}>
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* ── LIVE STATS BAR ──────────────────────────────── */}
      <div className="relative z-10 border-b" style={{ background:'rgba(13,17,23,0.60)', borderColor:'rgba(0,255,136,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {/* LIVE badge */}
          <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full"
            style={{ background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.20)' }}>
            <span className="live-dot" />
            <span className="text-[11px] font-display font-bold tracking-wider uppercase" style={{ color:G }}>LIVE</span>
          </div>
          <div className="w-px h-5 shrink-0" style={{ background:'rgba(255,255,255,0.07)' }} />
          {LIVE_STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <s.icon style={{ width:12, height:12, color:'rgba(0,255,136,0.6)' }} />
              <span className="font-mono font-bold text-[13px]" style={{ color:G }}>{s.val}</span>
              <span className="text-[11px] font-display" style={{ color:'rgba(232,237,245,0.30)' }}>{s.label}</span>
              {i < LIVE_STATS.length - 1 && (
                <span className="ml-3 w-px h-3 shrink-0" style={{ background:'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* ── left copy ── */}
          <div>
            {/* animated badge */}
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.4 }}
              className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full"
              style={{ background:'rgba(0,255,136,0.07)', border:'1px solid rgba(0,255,136,0.18)' }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              <span className="text-[11px] font-display font-bold tracking-wide" style={{ color:'rgba(0,255,136,0.9)' }}>
                LIVE · Osiris AI Engine
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.07, duration:0.6, ease:[0.22,1,0.36,1] }}
              className="font-display font-extrabold tracking-tight leading-[1.0] mb-6"
              style={{ fontSize:'clamp(3rem,7vw,5.2rem)' }}>
              <span className="block" style={{ color:'#E8EDF5' }}>AI Trading</span>
              <span className="block hero-gradient">Signals</span>
              <span className="block" style={{ color:'rgba(232,237,245,0.75)' }}>From Any Chart</span>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.17, duration:0.5 }}
              className="text-[15px] leading-relaxed mb-8 max-w-lg"
              style={{ color:'rgba(232,237,245,0.42)' }}>
              Upload a chart screenshot. ChartAI reads it with Gemini 2.0 Flash Vision,
              then applies the 7-filter Osiris methodology via Claude Sonnet — delivering
              entry, stop-loss and 3 take-profits in under 10 seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.26, duration:0.4 }}
              className="flex flex-wrap gap-3 mb-8">
              <Link href="/auth/login"
                className="flex items-center gap-2.5 font-display font-bold text-[15px] text-black px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background:G, boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 6px 24px ${GLOW}` }}>
                Analyze First Chart Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing"
                className="flex items-center gap-2 font-display font-semibold text-[15px] px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px"
                style={{ color:'rgba(232,237,245,0.48)', border:'1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,255,136,0.18)'; e.currentTarget.style.color='rgba(232,237,245,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(232,237,245,0.48)' }}>
                View pricing
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* stats row */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.36, duration:0.45 }}
              className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {[
                '2,400+ Signals Generated',
                '87% Avg Confidence',
                'Real-Time Analysis',
                '7-Filter System',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="hidden sm:block w-px h-3" style={{ background:'rgba(255,255,255,0.10)' }} />}
                  <span className="text-[12px] font-display" style={{ color:'rgba(232,237,245,0.38)' }}>{s}</span>
                </div>
              ))}
            </motion.div>

            {/* tech tags */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.44, duration:0.4 }}
              className="flex flex-wrap gap-2 items-center">
              {['Gemini 2.0 Flash', 'Claude Sonnet', 'Osiris 7-Filter', 'Any Platform'].map(t => (
                <span key={t} className="tag-white">{t}</span>
              ))}
              <span className="text-[11px] font-display ml-1 flex items-center gap-1.5" style={{ color:'rgba(232,237,245,0.22)' }}>
                <Lock style={{ width:11, height:11 }} /> No credit card
              </span>
            </motion.div>
          </div>

          {/* ── right: live card ── */}
          <div className="hidden lg:block">
            <AnalysisCard />
          </div>
        </div>
      </section>

      {/* ── TICKER TAPE ─────────────────────────────────── */}
      <div className="relative z-10 border-y overflow-hidden py-2.5"
        style={{ background:'rgba(13,17,23,0.40)', borderColor:'rgba(255,255,255,0.04)' }}>
        <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background:'linear-gradient(90deg,#080B10,transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background:'linear-gradient(-90deg,#080B10,transparent)' }} />
        <div className="ticker-track gap-8 items-center">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="text-[11px] font-display font-semibold" style={{ color:'rgba(232,237,245,0.28)' }}>{t.pair}</span>
              {t.dir > 0  && <TrendingUp   className="w-3 h-3" style={{ color:G    }} />}
              {t.dir < 0  && <TrendingDown className="w-3 h-3" style={{ color:RED  }} />}
              {t.dir === 0 && <Minus       className="w-3 h-3" style={{ color:AMB  }} />}
              <span className="text-[11px] font-display font-bold"
                style={{ color: t.dir > 0 ? G : t.dir < 0 ? RED : AMB }}>
                {t.signal}
              </span>
              <span className="font-mono text-[10px]" style={{ color:'rgba(232,237,245,0.18)' }}>{t.conf}</span>
              <span className="w-px h-3 mx-3" style={{ background:'rgba(255,255,255,0.07)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section style={{ maxWidth:'64rem', margin:'0 auto', padding:'6rem 1.5rem' }}>
        <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:'0.75rem' }}>
          How it works
        </p>
        <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:'3.5rem' }}>
          From chart to signal in 3 steps
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'2rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              padding:'2rem',
              borderRadius:'1rem',
              border:'1px solid rgba(255,255,255,0.10)',
              background:'rgba(255,255,255,0.05)',
              display:'flex',
              flexDirection:'column',
              gap:'1rem',
            }}>
              <span style={{ fontSize:'3.75rem', fontWeight:700, lineHeight:1, color:'rgba(0,255,136,0.20)', fontFamily:'JetBrains Mono, monospace' }}>
                {s.n}
              </span>
              <div style={{
                width:'3rem', height:'3rem',
                background:'rgba(0,255,136,0.10)',
                borderRadius:'0.75rem',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <s.icon style={{ width:20, height:20, color:G }} />
              </div>
              <h3 style={{ fontSize:'1.125rem', fontWeight:600, color:'#ffffff', margin:0 }}>{s.title}</h3>
              <p style={{ fontSize:'0.875rem', lineHeight:1.6, color:'rgba(255,255,255,0.50)', margin:0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:'64rem', margin:'0 auto', padding:'6rem 1.5rem' }}>
          <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:'0.75rem' }}>
            Features
          </p>
          <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:'3.5rem' }}>
            Everything you need to trade smarter
          </h2>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.5rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                padding:'1.5rem',
                borderRadius:'0.75rem',
                border:'1px solid rgba(255,255,255,0.10)',
                background:'rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  width:'2.5rem', height:'2.5rem',
                  background:'rgba(0,255,136,0.10)',
                  borderRadius:'0.5rem',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:'1rem',
                }}>
                  <f.icon style={{ width:18, height:18, color:G }} />
                </div>
                <h3 style={{ fontSize:'0.9375rem', fontWeight:600, color:'#ffffff', margin:'0 0 0.5rem 0' }}>{f.title}</h3>
                <p style={{ fontSize:'0.875rem', lineHeight:1.6, color:'rgba(255,255,255,0.50)', margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OSIRIS 7 FILTERS ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="rounded-3xl overflow-hidden relative"
          style={{
            background:'linear-gradient(135deg, rgba(0,255,136,0.03) 0%, rgba(8,11,16,0.98) 60%)',
            border:'1px solid rgba(0,255,136,0.10)',
          }}>
          {/* top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[65%]"
            style={{ background:`linear-gradient(90deg,transparent,${G}44,transparent)` }} />

          <div className="p-10">
            <motion.div
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[11px] font-display font-bold tracking-[0.18em] uppercase mb-3"
                  style={{ color:'rgba(0,255,136,0.65)' }}>The System</p>
                <h2 className="font-display font-extrabold tracking-tight text-[2.25rem]" style={{ color:'#E8EDF5' }}>
                  Osiris 7-Filter Method
                </h2>
              </div>
              <p className="text-[13px] max-w-xs md:text-right" style={{ color:'rgba(232,237,245,0.30)' }}>
                Every signal passes all 7 filters simultaneously. No exceptions. No shortcuts.
              </p>
            </motion.div>

            {/* progress pipeline */}
            <div className="relative mb-8 hidden md:flex items-center justify-between">
              {OSIRIS_FILTERS.map((f, i) => (
                <div key={f.n} className="flex items-center flex-1">
                  <motion.div
                    initial={{ opacity:0, scale:0.7 }} whileInView={{ opacity:1, scale:1 }}
                    viewport={{ once:true }} transition={{ delay:i * 0.07, duration:0.4 }}
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background:G, boxShadow:`0 0 8px ${G}` }}
                  />
                  {i < OSIRIS_FILTERS.length - 1 && (
                    <motion.div
                      initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
                      viewport={{ once:true }} transition={{ delay:i * 0.07 + 0.1, duration:0.5 }}
                      className="flex-1 h-px origin-left"
                      style={{ background:`linear-gradient(90deg,${G}55,${G}22)` }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* filter cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {OSIRIS_FILTERS.map((f, i) => (
                <motion.div key={f.n}
                  initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:'-40px' }}
                  transition={{ delay:i * 0.06, duration:0.4, ease:[0.22,1,0.36,1] }}
                  whileHover={{ scale:1.04, borderColor:'rgba(0,255,136,0.25)' }}
                  className="rounded-xl p-4 text-center cursor-default transition-all duration-200 group"
                  style={{ background:'rgba(13,17,23,0.80)', border:'1px solid rgba(255,255,255,0.055)' }}
                >
                  {/* number */}
                  <div className="font-mono font-bold text-[10px] mb-2.5 transition-opacity duration-200 opacity-40 group-hover:opacity-100"
                    style={{ color:G }}>
                    {f.n}
                  </div>
                  {/* icon */}
                  <div className="flex justify-center mb-2">
                    <f.icon style={{ width:16, height:16, color:`rgba(0,255,136,0.55)` }} className="group-hover:text-[#00FF88] transition-colors" />
                  </div>
                  <div className="font-display font-semibold text-[12px] mb-0.5" style={{ color:'rgba(232,237,245,0.80)' }}>
                    {f.name}
                  </div>
                  <div className="text-[10px] leading-snug" style={{ color:'rgba(232,237,245,0.22)' }}>
                    {f.desc}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* confluence banner */}
            <motion.div
              initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:0.4, duration:0.4 }}
              className="mt-6 flex items-center gap-3 p-4 rounded-xl"
              style={{ background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.14)' }}>
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color:G }} />
              <span className="text-[13px] font-display" style={{ color:'rgba(232,237,245,0.60)' }}>
                When all 7 filters pass →{' '}
                <span className="font-bold" style={{ color:G }}>High-confidence signal</span>
                {' '}with full entry, SL and 3 TP targets generated automatically
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTERS ────────────────────────────────── */}
      <section className="relative z-10 border-t" style={{ borderColor:'rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { val:10,  suffix:'s',  label:'Avg analysis time',  sub:'Gemini + Claude pipeline' },
              { val:7,   suffix:'',   label:'Osiris filters',     sub:'Applied simultaneously'   },
              { val:3,   suffix:'',   label:'Free daily analyses',sub:'No credit card required'  },
              { val:100, suffix:'%',  label:'Chart compatibility', sub:'Any platform, any asset'  },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ delay:i * 0.08, duration:0.5, ease:[0.22,1,0.36,1] }}
                className="rounded-2xl p-6 group cursor-default data-card">
                <div className="font-mono font-extrabold leading-none mb-2"
                  style={{ fontSize:'2.75rem', color:G, letterSpacing:'-0.02em' }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div className="font-display font-semibold text-sm mb-1" style={{ color:'rgba(232,237,245,0.70)' }}>
                  {s.label}
                </div>
                <div className="text-[12px] font-display" style={{ color:'rgba(232,237,245,0.28)' }}>
                  {s.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────── */}
      <section className="relative z-10 border-t" style={{ borderColor:'rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.5 }}
            className="text-center mb-14">
            <p className="text-[11px] font-display font-bold tracking-[0.18em] uppercase mb-3"
              style={{ color:'rgba(0,255,136,0.65)' }}>Pricing</p>
            <h2 className="font-display font-extrabold tracking-tight text-[2.25rem]" style={{ color:'#E8EDF5' }}>
              Start free. Scale when ready.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name:'Free', price:'€0', period:'forever',
                features:['3 analyses/day','Entry, SL & TP levels','Osiris confidence score'],
                cta:'Start free', href:'/auth/login', accent:false, purple:false,
              },
              {
                name:'Pro', price:'€12', period:'/month',
                features:['Unlimited analyses','Full analysis history','Multi-timeframe','Priority speed'],
                cta:'Upgrade to Pro', href:null, accent:true, purple:false, badge:'Most popular',
              },
              {
                name:'Trader', price:'€29', period:'/month',
                features:['Everything in Pro','API access','Telegram webhooks','Portfolio tracker'],
                cta:'Go Trader', href:null, accent:false, purple:true,
              },
            ].map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ delay:i * 0.10, duration:0.5, ease:[0.22,1,0.36,1] }}
                className="relative rounded-2xl p-6 flex flex-col overflow-hidden"
                style={{
                  background: p.accent
                    ? 'rgba(0,255,136,0.04)'
                    : p.purple ? 'rgba(139,92,246,0.03)' : 'rgba(13,17,23,0.70)',
                  border: p.accent
                    ? '1px solid rgba(0,255,136,0.20)'
                    : p.purple ? '1px solid rgba(139,92,246,0.16)' : '1px solid rgba(255,255,255,0.065)',
                }}>
                {/* top accent line */}
                {p.accent && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background:`linear-gradient(90deg,transparent,${G}55,transparent)` }} />
                )}

                {'badge' in p && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-black text-[10px] font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ background:G }}>
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className="font-display font-semibold text-[11px] tracking-widest uppercase mb-3"
                    style={{ color:'rgba(232,237,245,0.38)' }}>
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-[2.25rem]" style={{ color:'#E8EDF5' }}>{p.price}</span>
                    <span className="text-[13px] font-display" style={{ color:'rgba(232,237,245,0.28)' }}>{p.period}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px]">
                      <CheckCircle2 style={{ width:14, height:14, flexShrink:0, color: p.accent ? G : p.purple ? '#a78bfa' : 'rgba(255,255,255,0.25)' }} />
                      <span style={{ color:'rgba(232,237,245,0.50)' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {p.href ? (
                  <Link href={p.href}
                    className="w-full py-3 rounded-xl text-[13px] font-display font-bold text-center transition-all duration-200"
                    style={{ border:'1px solid rgba(255,255,255,0.07)', color:'rgba(232,237,245,0.38)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.13)'; e.currentTarget.style.color='rgba(232,237,245,0.65)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(232,237,245,0.38)' }}>
                    {p.cta}
                  </Link>
                ) : (
                  <Link href="/pricing"
                    className="w-full py-3 rounded-xl text-[13px] font-display font-bold text-center transition-all duration-200 hover:-translate-y-px"
                    style={p.accent
                      ? { background:G, color:'#020D06', boxShadow:`0 4px 16px ${GLOW}` }
                      : { border:'1px solid rgba(139,92,246,0.20)', color:'#a78bfa' }
                    }>
                    {p.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ delay:0.3 }}
            className="text-center mt-6">
            <Link href="/pricing"
              className="text-[13px] font-display inline-flex items-center gap-1.5 transition-colors hover:opacity-80"
              style={{ color:'rgba(0,255,136,0.60)' }}>
              See full pricing details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}
          className="rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(8,11,16,1) 60%)',
            border:'1px solid rgba(0,255,136,0.12)',
          }}>
          {/* radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.08) 0%, transparent 55%)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[50%]"
            style={{ background:`linear-gradient(90deg,transparent,${G}44,transparent)` }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
              style={{ background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.18)' }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              <span className="text-[11px] font-display font-bold tracking-wide" style={{ color:'rgba(0,255,136,0.9)' }}>
                Free to start — no card needed
              </span>
            </div>

            <h2 className="font-display font-extrabold tracking-tight text-[2.5rem] mb-4" style={{ color:'#E8EDF5' }}>
              Ready to trade with <span className="hero-gradient">AI precision</span>?
            </h2>
            <p className="text-[15px] mb-8 max-w-md mx-auto" style={{ color:'rgba(232,237,245,0.40)' }}>
              Upload your first chart and get a full Osiris signal in under 10 seconds. 3 free analyses daily.
            </p>

            <Link href="/auth/login"
              className="inline-flex items-center gap-2.5 font-display font-bold text-[15px] text-black px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background:G, boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 8px 32px ${GLOW}` }}>
              Analyze Your First Chart
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t" style={{ borderColor:'rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background:G }}>
              <TrendingUp style={{ width:12, height:12, color:'black' }} />
            </div>
            <span className="font-display font-bold text-[13px]" style={{ color:'rgba(232,237,245,0.50)' }}>ChartAI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-[12px] font-display transition-colors hover:opacity-70"
              style={{ color:'rgba(232,237,245,0.28)' }}>Pricing</Link>
            <Link href="/auth/login" className="text-[12px] font-display transition-colors hover:opacity-70"
              style={{ color:'rgba(232,237,245,0.28)' }}>Sign in</Link>
            <Link href="/dashboard" className="text-[12px] font-display transition-colors hover:opacity-70"
              style={{ color:'rgba(232,237,245,0.28)' }}>Dashboard</Link>
          </div>
          <p className="text-[11px] font-display" style={{ color:'rgba(232,237,245,0.18)' }}>
            © 2025 ChartAI. Not financial advice.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}
