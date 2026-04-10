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
  { pair:'AVAX/USDT',  signal:'LONG',    conf:'77%', dir: 1  },
  { pair:'ADA/USDT',   signal:'SHORT',   conf:'63%', dir:-1  },
  { pair:'DOGE/USDT',  signal:'LONG',    conf:'79%', dir: 1  },
  { pair:'MATIC/USDT', signal:'NEUTRAL', conf:'58%', dir: 0  },
  { pair:'LINK/USDT',  signal:'LONG',    conf:'72%', dir: 1  },
  { pair:'BTC/USDT',   signal:'SHORT',   conf:'65%', dir:-1  },
  { pair:'ETH/USDT',   signal:'LONG',    conf:'84%', dir: 1  },
  { pair:'SOL/USDT',   signal:'LONG',    conf:'71%', dir: 1  },
]

const OSIRIS_FILTERS = [
  { n:'01', name:'Fuel',        desc:'Volume and momentum confirm energy to sustain the move',              icon:Flame      },
  { n:'02', name:'Tension',     desc:'Price compression signals a release is imminent',                    icon:Layers     },
  { n:'03', name:'Trend Sync',  desc:'Setup aligns with global and local trend — no counter-trend trades', icon:GitMerge   },
  { n:'04', name:'BTC Shield',  desc:'Altcoin BTC correlation checked — low correlation means independence', icon:Shield    },
  { n:'05', name:'Structure',   desc:'Higher highs/lows, order blocks, and FVG zones confirm direction',   icon:BarChart2  },
  { n:'06', name:'Entry Zone',  desc:'Price at Fibonacci 0.618, FVG, or S/R flip — not overextended',     icon:Crosshair  },
  { n:'07', name:'Trigger',     desc:'Confirmation candle exists — Pin Bar, Engulfing, or equivalent',     icon:Zap        },
]

const STEPS = [
  { n:'01', icon:BarChart2, title:'Scan the Market',    desc:'Hit "Scan Now" and ChartAI instantly analyzes 100+ USDT pairs using real-time Binance data. The Osiris engine applies 4 quantitative filters — volume, volatility, trend sync, and BTC correlation — and surfaces only the pairs worth your attention.' },
  { n:'02', icon:Brain,     title:'Upload Your Charts', desc:'Pick a coin from the results. Open it on TradingView or Bybit, take screenshots of the 15m, 1h, and 4h timeframes, and drop them into ChartAI. Three screenshots. Thirty seconds.' },
  { n:'03', icon:Target,    title:'Get Your Signal',    desc:'Gemini Vision reads the charts. Claude applies the full 7-filter Osiris methodology. You receive a complete signal: entry zone, stop-loss, TP1, TP2, leverage suggestion, confidence score — and the reasoning behind every filter.' },
]

const FEATURES = [
  { icon:Zap,       title:'Real-Time Market Scanner', desc:'Analyzes 100+ USDT pairs from Binance every 15 minutes. Volume spikes, volatility windows, trend alignment — filtered and ranked automatically.' },
  { icon:Shield,    title:'Osiris 7-Filter Engine',   desc:'Every signal passes through all 7 filters: Fuel, Tension, Trend Sync, BTC Shield, Market Structure, Entry Zone, and Trigger. No filter shortcuts.' },
  { icon:Brain,     title:'AI Chart Analysis',        desc:'Upload screenshots from any platform — TradingView, Binance, Bybit, OKX. Gemini 2.0 Flash reads the chart. Claude Sonnet applies the methodology.' },
  { icon:Target,    title:'Full Signal Breakdown',    desc:'Not just "buy here." Every signal includes entry zone, stop-loss, two take-profit targets, suggested leverage, risk-reward ratio, and a filter-by-filter explanation.' },
  { icon:Activity,  title:'Transparent Reasoning',    desc:'See exactly why each filter passed or failed. Understand the setup before you enter. Trade with conviction, not blind trust.' },
  { icon:BarChart2, title:'Signal History',            desc:'Every signal you generate is saved with timestamp and outcome tracking. Build a personal track record. See what setups work best for your style.' },
]

const LIVE_STATS = [
  { label:'Pairs Scanned',     val:'100+',   icon:Globe   },
  { label:'Osiris Filters',    val:'7',      icon:Shield  },
  { label:'Signal Speed',      val:'<20s',   icon:Zap     },
  { label:'Entry · SL · TP',   val:'✓',      icon:Target  },
  { label:'Avg Confidence',    val:'87%',    icon:Gauge   },
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
    <div style={{ minHeight:'100vh', overflowX:'hidden', background:'#080B10' }}>

      {/* ── NAV — fixed, z-50 ───────────────────────────── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, height:64,
        zIndex:50, background:'#080B10',
        borderBottom:'1px solid rgba(255,255,255,0.08)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px',
      }}>
        {/* logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:8, background:G,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <TrendingUp style={{ width:16, height:16, color:'#000' }} />
          </div>
          <span style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.02em', color:'#E8EDF5' }}>ChartAI</span>
        </div>
        {/* nav links */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <Link href="/pricing" style={{ padding:'8px 16px', fontSize:13, color:'rgba(232,237,245,0.45)', fontWeight:500, borderRadius:10, textDecoration:'none' }}>
            Pricing
          </Link>
          <Link href="/auth/login" style={{ padding:'8px 16px', fontSize:13, color:'rgba(232,237,245,0.45)', fontWeight:500, borderRadius:10, textDecoration:'none' }}>
            Sign in
          </Link>
          <Link href="/auth/login" style={{
            marginLeft:8, display:'flex', alignItems:'center', gap:6,
            padding:'10px 20px', borderRadius:10, background:G,
            fontSize:13, fontWeight:700, color:'#000', textDecoration:'none',
          }}>
            Get Started
            <ArrowRight style={{ width:14, height:14 }} />
          </Link>
        </div>
      </nav>

      {/* ── STATS BAR — fixed below nav, z-40 ──────────── */}
      <div style={{
        position:'fixed', top:64, left:0, right:0, height:36,
        zIndex:40, background:'#0a0f0a',
        borderBottom:'1px solid rgba(0,255,136,0.10)',
        display:'flex', alignItems:'center', gap:24, padding:'0 24px',
        overflow:'hidden',
      }}>
        {/* LIVE badge */}
        <div style={{
          display:'flex', alignItems:'center', gap:6, flexShrink:0,
          padding:'2px 10px', borderRadius:999,
          background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.20)',
        }}>
          <span className="live-dot" style={{ width:6, height:6 }} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:G }}>LIVE</span>
        </div>
        <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)', flexShrink:0 }} />
        {LIVE_STATS.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            <s.icon style={{ width:11, height:11, color:'rgba(0,255,136,0.55)' }} />
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:12, color:G }}>{s.val}</span>
            <span style={{ fontSize:11, color:'rgba(232,237,245,0.30)' }}>{s.label}</span>
            {i < LIVE_STATS.length - 1 && (
              <div style={{ width:1, height:12, background:'rgba(255,255,255,0.06)', marginLeft:8, flexShrink:0 }} />
            )}
          </div>
        ))}
      </div>

      {/* ── MAIN — padded below both fixed bars ─────────── */}
      <main style={{ paddingTop:100 }}>

        {/* ── HERO ──────────────────────────────────────── */}
        <section style={{
          minHeight:'calc(100vh - 100px)',
          display:'flex', flexDirection:'column', justifyContent:'center',
          maxWidth:'72rem', margin:'0 auto', padding:'6rem 1.5rem',
          gap:0,
        }}>
          {/* live badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8, marginBottom:28,
            padding:'6px 14px', borderRadius:999, alignSelf:'flex-start',
            background:'rgba(0,255,136,0.07)', border:'1px solid rgba(0,255,136,0.18)',
          }}>
            <span className="live-dot" style={{ width:6, height:6 }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'rgba(0,255,136,0.9)' }}>
              LIVE · Osiris AI Engine Active
            </span>
          </div>

          {/* headline */}
          <h1 style={{
            fontSize:'clamp(3rem,7vw,5.2rem)', fontWeight:800,
            lineHeight:1.0, letterSpacing:'-0.03em', marginBottom:24,
          }}>
            <span style={{ display:'block', color:'#E8EDF5' }}>Find Your Next</span>
            <span className="hero-gradient" style={{ display:'block' }}>Trade.</span>
            <span style={{ display:'block', color:'rgba(232,237,245,0.65)' }}>Understand Why.</span>
          </h1>

          {/* subheadline */}
          <p style={{
            maxWidth:560, fontSize:16, lineHeight:1.65,
            color:'rgba(232,237,245,0.45)', marginBottom:32,
          }}>
            ChartAI scans 100+ crypto pairs with the Osiris 7-filter methodology,
            identifies the highest-probability setups, and explains every decision —
            so you trade with conviction, not guesswork.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40 }}>
            <Link href="/auth/login" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'14px 28px', borderRadius:12,
              background:G, color:'#000', fontWeight:700, fontSize:15,
              textDecoration:'none',
              boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 6px 24px ${GLOW}`,
            }}>
              Scan the Market Now
              <ArrowRight style={{ width:16, height:16 }} />
            </Link>
            <Link href="/pricing" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'14px 28px', borderRadius:12,
              border:'1px solid rgba(0,255,136,0.25)', color:'rgba(232,237,245,0.65)',
              fontWeight:600, fontSize:15, textDecoration:'none',
            }}>
              See How It Works →
            </Link>
          </div>

          {/* stats row */}
          <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
            {[
              { icon:Globe,   label:'100+ Pairs Scanned'    },
              { icon:Shield,  label:'7 Osiris Filters'      },
              { icon:Zap,     label:'Signal in <20s'        },
              { icon:Target,  label:'Entry · SL · TP Included' },
            ].map(({ icon:Icon, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Icon style={{ width:14, height:14, color:'rgba(0,255,136,0.5)' }} />
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.38)' }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TICKER TAPE — below hero, not fixed ─────────── */}
        <div style={{
          width:'100%', overflow:'hidden',
          borderTop:'1px solid rgba(255,255,255,0.06)',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          padding:'10px 0', background:'#080B10', position:'relative',
        }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, zIndex:2, pointerEvents:'none',
            background:'linear-gradient(90deg,#080B10,transparent)' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, zIndex:2, pointerEvents:'none',
            background:'linear-gradient(-90deg,#080B10,transparent)' }} />
          <div className="ticker-track" style={{ display:'flex', gap:32, alignItems:'center', whiteSpace:'nowrap' }}>
            {tickers.map((t, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, userSelect:'none' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'rgba(232,237,245,0.28)' }}>{t.pair}</span>
                {t.dir > 0  && <TrendingUp   style={{ width:12, height:12, color:G   }} />}
                {t.dir < 0  && <TrendingDown style={{ width:12, height:12, color:RED }} />}
                {t.dir === 0 && <Minus       style={{ width:12, height:12, color:AMB }} />}
                <span style={{ fontSize:11, fontWeight:700, color: t.dir > 0 ? G : t.dir < 0 ? RED : AMB }}>
                  {t.signal}
                </span>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(232,237,245,0.18)' }}>{t.conf}</span>
                <div style={{ width:1, height:12, background:'rgba(255,255,255,0.07)', marginLeft:4 }} />
              </div>
            ))}
          </div>
        </div>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section style={{ maxWidth:'64rem', margin:'0 auto', padding:'6rem 1.5rem' }}>
        <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:'0.75rem' }}>
          HOW IT WORKS
        </p>
        <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:'3.5rem' }}>
          From market scan to signal in 3 steps
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
            FEATURES
          </p>
          <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:'3.5rem' }}>
            Built for traders who want to understand, not just follow
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
                  style={{ color:'rgba(0,255,136,0.65)' }}>THE METHODOLOGY</p>
                <h2 className="font-display font-extrabold tracking-tight text-[2.25rem]" style={{ color:'#E8EDF5' }}>
                  7 filters. Every signal. No exceptions.
                </h2>
              </div>
              <p className="text-[13px] max-w-xs md:text-right" style={{ color:'rgba(232,237,245,0.30)' }}>
                The Osiris methodology was built for high-probability crypto scalping. A trade only reaches you when all relevant filters align.
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
                {' '}with entry zone, stop-loss, TP1, TP2, leverage suggestion, and full filter reasoning
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
              Start free. Scale when you&apos;re ready.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name:'Basic', price:'$19.99', period:'/month',
                features:['3 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (30 days)'],
                cta:'Get Started', href:'/auth/login', accent:false, purple:false,
              },
              {
                name:'Pro', price:'$44.90', period:'/month',
                features:['10 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed'],
                cta:'Get Started', href:null, accent:true, purple:false, badge:'Most Popular',
              },
              {
                name:'Unlimited', price:'$125', period:'/month',
                features:['50 analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed','Swing analysis (4H / Daily)'],
                cta:'Get Started', href:null, accent:false, purple:true,
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
                3 free analyses — no credit card required
              </span>
            </div>

            <h2 className="font-display font-extrabold tracking-tight text-[2.5rem] mb-4" style={{ color:'#E8EDF5' }}>
              Ready to trade with <span className="hero-gradient">a system</span>?
            </h2>
            <p className="text-[15px] mb-4 max-w-md mx-auto" style={{ color:'rgba(232,237,245,0.40)' }}>
              Scan the market. Identify the setup. Understand the signal. Enter with confidence.
            </p>

            <Link href="/auth/login"
              className="inline-flex items-center gap-2.5 font-display font-bold text-[15px] text-black px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background:G, boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 8px 32px ${GLOW}` }}>
              Start Your Free Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-[12px] font-display" style={{ color:'rgba(232,237,245,0.25)' }}>
              3 free analyses included. No credit card required.
            </p>
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
            © 2026 ChartAI. Not financial advice. Trade responsibly.
          </p>
        </div>
      </footer>

      </main>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}
