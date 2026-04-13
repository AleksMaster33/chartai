'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
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
/* ── auth code redirect handler ─────────────────────────── */
function AuthCodeRedirect() {
  const router = useRouter()
  const params = useSearchParams()
  useEffect(() => {
    const code = params.get('code')
    if (code) router.replace(`/auth/callback?code=${code}`)
  }, [params, router])
  return null
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mouse, setMouse] = useState({ x:-1000, y:-1000 })
  const [signalsThisWeek, setSignalsThisWeek] = useState<number>(0)
  const tickers = [...TICKERS, ...TICKERS, ...TICKERS]

  useEffect(() => {
    setMounted(true)
    const h = (e: MouseEvent) => setMouse({ x:e.clientX, y:e.clientY })
    window.addEventListener('mousemove', h, { passive:true })
    fetch('/api/stats').then(r => r.json()).then(d => {
      if (d.signalsThisWeek) setSignalsThisWeek(d.signalsThisWeek)
    }).catch(() => {})
    return () => window.removeEventListener('mousemove', h)
  }, [])

  return (
    <div style={{ minHeight:'100vh', overflowX:'hidden', background:'#080B10' }}>

      {/* auth code redirect — handles ?code= landing on root */}
      <Suspense fallback={null}><AuthCodeRedirect /></Suspense>

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
        <div className="lp-nav-links" style={{ display:'flex', alignItems:'center', gap:4 }}>
          <Link href="/pricing" className="lp-nav-text" style={{ padding:'8px 16px', fontSize:13, color:'rgba(232,237,245,0.45)', fontWeight:500, borderRadius:10, textDecoration:'none' }}>
            Pricing
          </Link>
          <Link href="/auth/login" className="lp-nav-text" style={{ padding:'8px 16px', fontSize:13, color:'rgba(232,237,245,0.45)', fontWeight:500, borderRadius:10, textDecoration:'none' }}>
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
        display:'flex', alignItems:'center', justifyContent:'center', gap:24, padding:'0 24px',
        overflow:'hidden',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <CheckCircle2 style={{ width:11, height:11, color:'rgba(0,255,136,0.55)' }} />
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:12, color:G }}>1,250+</span>
          <span style={{ fontSize:11, color:'rgba(232,237,245,0.30)' }}>Traders Daily</span>
        </div>
        <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)', flexShrink:0 }} />
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <Zap style={{ width:11, height:11, color:'rgba(0,255,136,0.55)' }} />
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:12, color:G }}>
            {signalsThisWeek > 0 ? signalsThisWeek.toLocaleString() : '1,800+'}
          </span>
          <span style={{ fontSize:11, color:'rgba(232,237,245,0.30)' }}>Signals This Week</span>
        </div>
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

          {/* tech specs row */}
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {[
              { icon:Globe,   label:'100+ Pairs Scanned'       },
              { icon:Shield,  label:'7 Osiris Filters'         },
              { icon:Zap,     label:'Signal in <20s'           },
              { icon:Target,  label:'Entry · SL · TP Included' },
            ].map(({ icon:Icon, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Icon style={{ width:13, height:13, color:'rgba(0,255,136,0.4)' }} />
                <span style={{ fontSize:12, color:'rgba(232,237,245,0.30)' }}>{label}</span>
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
      <section style={{ maxWidth:'72rem', margin:'0 auto', padding:'6rem 1.5rem' }}>
        {/* section header */}
        <div style={{ marginBottom:48 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:12 }}>
            THE METHODOLOGY
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
            <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5', margin:0 }}>
              7 filters. Every signal.<br />No exceptions.
            </h2>
            <p style={{ fontSize:14, maxWidth:320, color:'rgba(232,237,245,0.38)', lineHeight:1.65, margin:0 }}>
              The Osiris methodology was built for high-probability crypto scalping. A trade only reaches you when all relevant filters align.
            </p>
          </div>
        </div>

        {/* filter list */}
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {OSIRIS_FILTERS.map((f, i) => (
            <div key={f.n} className="osiris-row" style={{
              display:'grid',
              gridTemplateColumns:'64px 48px 1fr 2fr',
              alignItems:'center',
              gap:24,
              padding:'20px 24px',
              borderRadius:12,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              border:'1px solid transparent',
              borderBottom: i < OSIRIS_FILTERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
            }}>
              {/* number */}
              <span style={{
                fontFamily:'JetBrains Mono,monospace', fontSize:22, fontWeight:800,
                color:'rgba(0,255,136,0.18)', letterSpacing:'-0.04em', lineHeight:1,
              }}>
                {f.n}
              </span>
              {/* icon */}
              <div style={{
                width:40, height:40, borderRadius:10,
                background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.12)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <f.icon style={{ width:18, height:18, color:`rgba(0,255,136,0.75)` }} />
              </div>
              {/* name */}
              <span style={{ fontSize:15, fontWeight:700, color:'#E8EDF5' }}>{f.name}</span>
              {/* description */}
              <span style={{ fontSize:13, color:'rgba(232,237,245,0.38)', lineHeight:1.5 }}>{f.desc}</span>
            </div>
          ))}
        </div>

        {/* confluence banner */}
        <div style={{
          marginTop:24, display:'flex', alignItems:'center', gap:14,
          padding:'16px 22px', borderRadius:14,
          background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.15)',
        }}>
          <CheckCircle2 style={{ width:18, height:18, flexShrink:0, color:G }} />
          <span style={{ fontSize:13, color:'rgba(232,237,245,0.60)', lineHeight:1.5 }}>
            When all 7 filters pass →{' '}
            <span style={{ fontWeight:700, color:G }}>High-confidence signal</span>
            {' '}generated with entry zone, stop-loss, TP1, TP2, leverage suggestion, and full filter reasoning
          </span>
        </div>
      </section>

      {/* ── STATS COUNTERS ────────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,255,136,0.015)' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'4rem 1.5rem' }}>
          <div className="stats-grid" style={{
            display:'grid',
            gridTemplateColumns:'repeat(4, 1fr)',
            gap:0,
          }}>
            {[
              { val:20,  suffix:'s',  label:'Avg signal speed',   sub:'Gemini + Claude in parallel' },
              { val:7,   suffix:'',   label:'Osiris filters',     sub:'Applied to every signal'     },
              { val:100, suffix:'+',  label:'Pairs scanned',      sub:'Real-time Binance data'       },
              { val:100, suffix:'%',  label:'Chart compatibility', sub:'Any platform, any asset'     },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding:'32px 28px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                textAlign:'center',
              }}>
                <div style={{
                  fontFamily:'JetBrains Mono,monospace', fontWeight:800,
                  fontSize:'3rem', lineHeight:1, letterSpacing:'-0.03em',
                  color:G, marginBottom:12,
                }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:'rgba(232,237,245,0.75)', marginBottom:4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize:12, color:'rgba(232,237,245,0.30)' }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'6rem 1.5rem' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:12 }}>
              PRICING
            </p>
            <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.25rem)', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:12 }}>
              Simple, transparent pricing.
            </h2>
            <p style={{ fontSize:14, color:'rgba(232,237,245,0.35)', margin:0 }}>
              No hidden fees. Cancel anytime. Every plan includes full Osiris signal breakdowns.
            </p>
          </div>

          {/* 3-col grid */}
          <div className="lp-pricing-grid" style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr 1fr',
            gap:20,
            maxWidth:940,
            margin:'0 auto',
          }}>
            {/* Basic */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16,
              background:'rgba(13,17,23,0.70)',
              border:'1px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,237,245,0.35)', marginBottom:10, marginTop:0 }}>Basic</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$19.99</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.30)' }}>/mo</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['3 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (30 days)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                    <CheckCircle2 style={{ width:14, height:14, flexShrink:0, color:'rgba(255,255,255,0.25)' }} />
                    <span style={{ color:'rgba(232,237,245,0.55)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" style={{
                display:'block', textAlign:'center', padding:'13px 0',
                borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none',
                border:'1px solid rgba(255,255,255,0.10)', color:'rgba(232,237,245,0.50)',
              }}>Get Started</Link>
            </div>

            {/* Pro — highlighted */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16, position:'relative',
              background:'rgba(0,255,136,0.04)',
              border:'1px solid rgba(0,255,136,0.25)',
              boxShadow:'0 0 0 1px rgba(0,255,136,0.10), 0 16px 48px rgba(0,255,136,0.06)',
            }}>
              {/* top glow line */}
              <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${G}66,transparent)` }} />
              {/* badge */}
              <div style={{
                position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)',
                background:G, color:'#000', fontSize:10, fontWeight:800,
                padding:'4px 14px', borderRadius:999, letterSpacing:'0.08em', textTransform:'uppercase',
                whiteSpace:'nowrap',
              }}>
                Most Popular
              </div>

              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:`rgba(0,255,136,0.65)`, marginBottom:10, marginTop:12 }}>Pro</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$44.90</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.30)' }}>/mo</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['10 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                    <CheckCircle2 style={{ width:14, height:14, flexShrink:0, color:G }} />
                    <span style={{ color:'rgba(232,237,245,0.65)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" style={{
                display:'block', textAlign:'center', padding:'13px 0',
                borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none',
                background:G, color:'#000',
                boxShadow:`0 4px 20px ${GLOW}`,
              }}>Get Started</Link>
            </div>

            {/* Unlimited */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16,
              background:'rgba(139,92,246,0.03)',
              border:'1px solid rgba(139,92,246,0.18)',
            }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(167,139,250,0.60)', marginBottom:10, marginTop:0 }}>Unlimited</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$125</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.30)' }}>/mo</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['50 analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed','Swing analysis (4H / Daily)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                    <CheckCircle2 style={{ width:14, height:14, flexShrink:0, color:'#a78bfa' }} />
                    <span style={{ color:'rgba(232,237,245,0.55)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" style={{
                display:'block', textAlign:'center', padding:'13px 0',
                borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none',
                border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa',
              }}>Get Started</Link>
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:28 }}>
            <Link href="/pricing" style={{
              display:'inline-flex', alignItems:'center', gap:6,
              fontSize:13, color:'rgba(0,255,136,0.55)', textDecoration:'none',
            }}>
              See full pricing details <ChevronRight style={{ width:14, height:14 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section style={{ maxWidth:'72rem', margin:'0 auto', padding:'0 1.5rem 6rem' }}>
        <div style={{
          borderRadius:24, padding:'4rem 2rem', textAlign:'center',
          position:'relative', overflow:'hidden',
          background:'linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(8,11,16,1) 60%)',
          border:'1px solid rgba(0,255,136,0.12)',
        }}>
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none',
            background:'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.08) 0%, transparent 55%)',
          }} />
          <div style={{
            position:'absolute', top:0, left:'25%', right:'25%', height:1,
            background:`linear-gradient(90deg,transparent,${G}44,transparent)`,
          }} />

          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8, marginBottom:24,
              padding:'6px 16px', borderRadius:999,
              background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.18)',
            }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(0,255,136,0.9)' }}>
                Osiris AI Engine · Live Market Scanner
              </span>
            </div>

            <h2 style={{
              fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:800,
              letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:16,
            }}>
              Ready to trade with{' '}
              <span className="hero-gradient">a system</span>?
            </h2>
            <p style={{ fontSize:15, color:'rgba(232,237,245,0.40)', maxWidth:420, margin:'0 auto 32px' }}>
              Scan the market. Identify the setup. Understand the signal. Enter with confidence.
            </p>

            <Link href="/auth/login" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'16px 32px', borderRadius:12,
              background:G, color:'#000', fontWeight:700, fontSize:15,
              textDecoration:'none',
              boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 8px 32px ${GLOW}`,
            }}>
              Get Started — From $19.99
              <ArrowRight style={{ width:16, height:16 }} />
            </Link>
            <p style={{ marginTop:16, fontSize:12, color:'rgba(232,237,245,0.25)' }}>
              Cancel anytime · No hidden fees · Full Osiris signal breakdown
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{
          maxWidth:'72rem', margin:'0 auto', padding:'2rem 1.5rem',
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:6, background:G, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <TrendingUp style={{ width:12, height:12, color:'black' }} />
            </div>
            <span style={{ fontWeight:700, fontSize:13, color:'rgba(232,237,245,0.50)' }}>ChartAI</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <Link href="/pricing" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Pricing</Link>
            <Link href="/auth/login" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Sign in</Link>
            <Link href="/dashboard" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Dashboard</Link>
          </div>
          <p style={{ fontSize:11, color:'rgba(232,237,245,0.18)', margin:0 }}>
            © 2026 ChartAI. Not financial advice. Trade responsibly.
          </p>
        </div>
      </footer>

      </main>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .lp-pricing-grid { grid-template-columns: 1fr !important; }
          .osiris-row { grid-template-columns: 40px 36px 1fr !important; gap: 12px !important; }
          .osiris-row > *:last-child { display: none !important; }
          .lp-nav-text { display: none !important; }
          .lp-stat-divider { display: none !important; }
        }
      `}</style>
    </div>
  )
}
