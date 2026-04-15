'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/Navbar'
import {
  ScanLine, TrendingUp, TrendingDown, Minus, ExternalLink,
  CheckCircle2, XCircle, Clock, Zap, RefreshCw,
  BarChart2, Activity, Shield, Target, AlertCircle, Crown, Loader2, Lock,
} from 'lucide-react'
import Link from 'next/link'
import type { DiscoveredCoin } from '@/lib/discovery/binance'

const G     = '#00FF88'
const RED   = '#FF3B5C'
const AMBER = '#FFB800'

function signalColor(d: 'LONG' | 'SHORT' | 'NEUTRAL') {
  return d === 'LONG' ? G : d === 'SHORT' ? RED : AMBER
}

function SignalIcon({ d }: { d: 'LONG' | 'SHORT' | 'NEUTRAL' }) {
  if (d === 'LONG')  return <TrendingUp  style={{ width:16, height:16, color:G }}     />
  if (d === 'SHORT') return <TrendingDown style={{ width:16, height:16, color:RED }}   />
  return                    <Minus        style={{ width:16, height:16, color:AMBER }} />
}

const FILTER_META = [
  { key:'f1', label:'F1', name:'Volume & Spike',   icon:Zap      },
  { key:'f2', label:'F2', name:'NATR Volatility',  icon:Activity  },
  { key:'f3', label:'F3', name:'EMA Trend',         icon:BarChart2 },
  { key:'f4', label:'F4', name:'BTC Independence', icon:Shield    },
] as const

function CoinCard({ coin, index, onAnalyze }: {
  coin: DiscoveredCoin
  index: number
  onAnalyze: (coin: DiscoveredCoin) => void
}) {
  const dir   = coin.filters.direction
  const color = signalColor(dir)
  const tvUrl = `https://www.tradingview.com/chart/?symbol=BINANCE:${coin.symbol}`

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.08, duration:0.45, ease:[0.22,1,0.36,1] }}
      style={{
        borderRadius:16, overflow:'hidden',
        background:'rgba(255,255,255,0.025)',
        border:'1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* top accent */}
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${color}44,transparent)` }} />

      <div style={{ padding:20 }}>
        {/* header row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{
                width:24, height:24, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700, background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.30)',
              }}>
                {index + 1}
              </span>
              <span style={{ fontWeight:800, fontSize:'1.25rem', color:'#E8EDF5' }}>{coin.baseAsset}</span>
              <span style={{
                fontSize:11, color:'rgba(255,255,255,0.30)',
                background:'rgba(255,255,255,0.04)', padding:'2px 8px', borderRadius:4,
              }}>USDT</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginLeft:34 }}>
              <span style={{ fontFamily:'monospace', fontSize:13, color:'rgba(255,255,255,0.60)' }}>
                ${coin.lastPrice < 1
                  ? coin.lastPrice.toFixed(4)
                  : coin.lastPrice < 100
                  ? coin.lastPrice.toFixed(3)
                  : coin.lastPrice.toLocaleString(undefined, { maximumFractionDigits:2 })}
              </span>
              <span style={{ fontSize:12, fontWeight:600, color: coin.priceChange24h >= 0 ? G : RED }}>
                {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
              </span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>
                Vol ${(coin.volume24h / 1e6).toFixed(0)}M
              </span>
            </div>
          </div>

          <div style={{
            display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:12,
            fontWeight:700, fontSize:13, flexShrink:0,
            background:`${color}14`, border:`1px solid ${color}33`, color,
          }}>
            <SignalIcon d={dir} />
            {dir}
          </div>
        </div>

        {/* Osiris filter progress */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.30)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Osiris Filters
            </span>
            <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, color }}>
              {coin.filters.passedCount}/4
            </span>
          </div>
          <div style={{ height:6, borderRadius:999, overflow:'hidden', background:'rgba(255,255,255,0.05)', marginBottom:12 }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${(coin.filters.passedCount / 4) * 100}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration:0.8, ease:'easeOut' }}
              style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color}88,${color})` }}
            />
          </div>

          {/* F1–F4 grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {FILTER_META.map(({ key, label, name, icon: Icon }) => {
              const f = coin.filters[key as keyof typeof coin.filters] as { passed:boolean; reason:string }
              return (
                <div key={key}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', borderRadius:12,
                    background: f.passed ? `${color}08` : 'rgba(255,255,255,0.02)',
                    border: f.passed ? `1px solid ${color}22` : '1px solid rgba(255,255,255,0.04)',
                  }}>
                  <div style={{ marginTop:1, flexShrink:0 }}>
                    {f.passed
                      ? <CheckCircle2 style={{ width:13, height:13, color }} />
                      : <XCircle      style={{ width:13, height:13, color:'rgba(255,255,255,0.18)' }} />}
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                      <Icon style={{ width:10, height:10, color:'rgba(255,255,255,0.30)' }} />
                      <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.50)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
                      <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)' }}>{name}</span>
                    </div>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)', lineHeight:1.45 }}>{f.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* action buttons */}
        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={() => onAnalyze(coin)}
            style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:'10px 0', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer',
              color:'#000', background:G, border:'none',
              boxShadow:`0 4px 16px rgba(0,255,136,0.22)`,
              transition:'transform 0.15s, filter 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            <Target style={{ width:13, height:13 }} />
            Analyze →
          </button>
          <a
            href={tvUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              padding:'10px 16px', borderRadius:12, fontWeight:600, fontSize:13,
              color:'rgba(255,255,255,0.45)', textDecoration:'none',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
              transition:'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <ExternalLink style={{ width:13, height:13 }} />
            TradingView
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function PaywallGate() {
  const GLOW = 'rgba(0,255,136,0.20)'
  const MOCK_COINS = [
    { pair:'ETH/USDT',  dir:'LONG',    change:'+3.21%', filters:6 },
    { pair:'SOL/USDT',  dir:'LONG',    change:'+5.84%', filters:7 },
    { pair:'BNB/USDT',  dir:'SHORT',   change:'-2.10%', filters:5 },
    { pair:'AVAX/USDT', dir:'LONG',    change:'+4.65%', filters:6 },
    { pair:'DOGE/USDT', dir:'NEUTRAL', change:'+0.38%', filters:3 },
    { pair:'ADA/USDT',  dir:'LONG',    change:'+2.97%', filters:5 },
  ]
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
      style={{ maxWidth:900, margin:'32px auto', padding:'0 24px' }}
    >
      {/* outer wrapper: explicit height so absolute CTA always fits */}
      <div style={{ position:'relative', borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', minHeight:520 }}>

        {/* blurred mock grid — fills the background */}
        <div style={{
          position:'absolute', inset:0,
          filter:'blur(4px)', opacity:0.22, pointerEvents:'none', userSelect:'none',
          padding:'24px', background:'rgba(13,17,23,0.90)',
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, alignContent:'start',
        }}>
          {MOCK_COINS.map(({ pair, dir, change, filters }) => (
            <div key={pair} style={{
              padding:'14px', borderRadius:10,
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#E8EDF5' }}>{pair}</span>
                <span style={{
                  fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:6,
                  background: dir==='LONG' ? 'rgba(0,255,136,0.15)' : dir==='SHORT' ? 'rgba(255,59,92,0.15)' : 'rgba(255,184,0,0.12)',
                  color: dir==='LONG' ? G : dir==='SHORT' ? RED : AMBER,
                }}>{dir}</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(232,237,245,0.35)', marginBottom:8 }}>{change} · Osiris {filters}/7</div>
              <div style={{ display:'flex', gap:3 }}>
                {Array.from({ length:7 }).map((_, i) => (
                  <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < filters ? G : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* gradient overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse at 50% 50%, rgba(8,11,16,0.55) 0%, rgba(8,11,16,0.96) 70%)',
        }} />

        {/* CTA — centered, no absolute height dependency */}
        <div style={{
          position:'relative', zIndex:2,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          minHeight:520, padding:'48px 24px', textAlign:'center',
        }}>
          <div style={{
            width:56, height:56, borderRadius:16, marginBottom:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.22)',
            boxShadow:'0 0 32px rgba(0,255,136,0.12)',
          }}>
            <Lock style={{ width:24, height:24, color:G }} />
          </div>

          <h2 style={{ fontSize:'clamp(1.3rem,3vw,1.75rem)', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:10 }}>
            100+ pairs, live right now
          </h2>
          <div style={{ marginBottom:16 }}>
            <LiveActivityTicker />
          </div>
          <p style={{ fontSize:14, color:'rgba(232,237,245,0.38)', lineHeight:1.65, maxWidth:360, marginBottom:28 }}>
            Market Discovery scans 100+ pairs with all 7 Osiris filters in real time.
            Subscribe to see which setups are forming right now.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, width:'100%', maxWidth:520, marginBottom:22 }}>
            {[
              { label:'Basic',     price:'$19.99', sub:'3 scans/day',  border:'rgba(255,255,255,0.10)', bg:'rgba(255,255,255,0.04)', textColor:'rgba(232,237,245,0.35)', pop:false },
              { label:'Pro',       price:'$44.90', sub:'10 scans/day', border:'rgba(0,255,136,0.32)',   bg:'rgba(0,255,136,0.06)',   textColor:'rgba(0,255,136,0.70)',    pop:true  },
              { label:'Unlimited', price:'$125',   sub:'50/day',       border:'rgba(139,92,246,0.22)', bg:'rgba(139,92,246,0.05)',  textColor:'rgba(167,139,250,0.65)',  pop:false },
            ].map(p => (
              <Link key={p.label} href="/pricing" style={{ textDecoration:'none' }}>
                <div style={{
                  padding:'14px 12px', borderRadius:12, cursor:'pointer', position:'relative',
                  background:p.bg, border:`${p.pop ? '1.5px' : '1px'} solid ${p.border}`,
                  boxShadow: p.pop ? '0 0 20px rgba(0,255,136,0.10)' : 'none',
                  display:'flex', flexDirection:'column', gap:5,
                }}>
                  {p.pop && (
                    <div style={{
                      position:'absolute', top:-9, left:'50%', transform:'translateX(-50%)',
                      fontSize:9, fontWeight:800, padding:'2px 9px', borderRadius:999,
                      background:G, color:'#000', whiteSpace:'nowrap',
                    }}>POPULAR</div>
                  )}
                  <p style={{ fontSize:10, fontWeight:700, color:p.textColor, textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>{p.label}</p>
                  <p style={{ fontSize:'1.3rem', fontWeight:800, color:'#E8EDF5', margin:0 }}>{p.price}</p>
                  <p style={{ fontSize:10, color:'rgba(232,237,245,0.28)', margin:0 }}>{p.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/pricing" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'13px 32px', borderRadius:12,
            background:G, color:'#000', fontWeight:700, fontSize:14,
            textDecoration:'none',
            boxShadow:`0 0 0 1px rgba(0,255,136,0.30), 0 8px 28px ${GLOW}`,
          }}>
            <Crown style={{ width:15, height:15 }} />
            Unlock Market Discovery →
          </Link>
          <p style={{ marginTop:10, fontSize:11, color:'rgba(232,237,245,0.20)' }}>
            Cancel anytime · No hidden fees
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Live activity ticker ──────────────────────────────────── */
const ACTIVITY_FEED = [
  { name:'Alex M.',   pair:'ETH/USDT',  dir:'LONG',  ago:'just now' },
  { name:'Nina K.',   pair:'SOL/USDT',  dir:'LONG',  ago:'1m ago' },
  { name:'Darko V.',  pair:'BTC/USDT',  dir:'LONG',  ago:'2m ago' },
  { name:'Ivan P.',   pair:'AVAX/USDT', dir:'SHORT', ago:'4m ago' },
  { name:'Maria S.',  pair:'BNB/USDT',  dir:'LONG',  ago:'5m ago' },
  { name:'Todor L.',  pair:'DOGE/USDT', dir:'SHORT', ago:'7m ago' },
  { name:'Elena R.',  pair:'ADA/USDT',  dir:'LONG',  ago:'9m ago' },
  { name:'Georgi N.', pair:'MATIC/USDT',dir:'LONG',  ago:'11m ago' },
]

function LiveActivityTicker() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % ACTIVITY_FEED.length)
        setVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const item = ACTIVITY_FEED[idx]
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:10,
      padding:'7px 14px', borderRadius:999,
      background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.14)',
      transition:'opacity 0.35s ease', opacity: visible ? 1 : 0,
    }}>
      <span style={{
        width:7, height:7, borderRadius:'50%', background:G, flexShrink:0,
        boxShadow:'0 0 6px rgba(0,255,136,0.6)',
        animation:'blink 1.4s ease-in-out infinite',
      }} />
      <span style={{ fontSize:12, color:'rgba(232,237,245,0.50)' }}>
        <span style={{ color:'rgba(232,237,245,0.75)', fontWeight:600 }}>{item.name}</span>
        {' '}got a{' '}
        <span style={{ color: item.dir === 'LONG' ? G : RED, fontWeight:700 }}>{item.dir}</span>
        {' '}signal on{' '}
        <span style={{ color:'rgba(232,237,245,0.65)', fontWeight:600 }}>{item.pair}</span>
        {' '}
        <span style={{ color:'rgba(232,237,245,0.28)', fontSize:11 }}>· {item.ago}</span>
      </span>
    </div>
  )
}

export default function DiscoverPage() {
  const [coins, setCoins]         = useState<DiscoveredCoin[] | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [scannedAt, setScanned]   = useState<string | null>(null)
  const [cached, setCached]       = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [plan, setPlan]           = useState('free')
  const [loaded, setLoaded]       = useState(false)
  const router = useRouter()

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      sb.from('profiles').select('plan,daily_analyses_used').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan)
            const limit = data.plan === 'basic' ? 3 : data.plan === 'pro' ? 10 : null
            setRemaining(limit ? Math.max(0, limit - (data.daily_analyses_used || 0)) : null)
          }
          setLoaded(true)
        })
    })
  }, [router])

  const scan = async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/discover', { method:'POST' })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) setError('Subscription required. Choose a plan to start scanning.')
        else if (res.status === 429) setError('Daily limit reached. Upgrade your plan for more scans.')
        else setError(data.error || 'Scan failed.')
        return
      }
      setCoins(data.coins)
      setScanned(data.scannedAt)
      setCached(data.cached)
      setRemaining(data.remainingToday)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = (coin: DiscoveredCoin) => {
    router.push(`/dashboard/analyze?coin=${coin.symbol}&direction=${coin.filters.direction}`)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080B10', color:'#E8EDF5' }}>

      {/* bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div style={{
          position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:700, height:400,
          background:'radial-gradient(ellipse at top,rgba(0,255,136,0.04) 0%,transparent 60%)',
        }} />
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        <Navbar plan={plan} remaining={remaining} />

        <div className="discover-container" style={{ maxWidth:'64rem', margin:'0 auto', padding:'32px 24px' }}>

          {/* loading spinner */}
          {!loaded && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 0' }}>
              <Loader2 style={{ width:28, height:28, color:'rgba(0,255,136,0.5)', animation:'spin 1s linear infinite' }} />
            </div>
          )}

          {/* paywall for free users */}
          {loaded && plan === 'free' && <PaywallGate />}

          {/* main content for paid users */}
          {loaded && plan !== 'free' && <>

          {/* page header */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45 }}
            style={{ marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{
                    width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(0,255,136,0.10)', border:'1px solid rgba(0,255,136,0.20)',
                  }}>
                    <ScanLine style={{ width:16, height:16, color:G }} />
                  </div>
                  <h1 style={{ fontSize:'1.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5' }}>
                    Market Discovery
                  </h1>
                </div>
                <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)', maxWidth:480, marginBottom:10 }}>
                  Scans Binance top 100 pairs and applies Osiris F1–F4 filters to surface the highest-potential setups. Results cached 15 min.
                </p>
                <LiveActivityTicker />
              </div>

              {scannedAt && (
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.25)', justifyContent:'flex-end' }}>
                    <Clock style={{ width:11, height:11 }} />
                    {cached ? 'Cached' : 'Fresh scan'}
                  </div>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.20)', marginTop:2 }}>
                    {new Date(scannedAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── scan button (empty state) ── */}
          {!coins && !loading && (
            <motion.div
              initial={{ opacity:0, scale:0.97 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.4 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', textAlign:'center' }}>

              <div style={{ position:'relative', marginBottom:32 }}>
                <motion.div
                  animate={{ scale:[1,1.15,1], opacity:[0.3,0.1,0.3] }}
                  transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                  style={{
                    position:'absolute', inset:0, margin:-20, borderRadius:'50%',
                    border:'1px solid rgba(0,255,136,0.20)',
                  }} />
                <motion.div
                  animate={{ scale:[1,1.25,1], opacity:[0.2,0.05,0.2] }}
                  transition={{ duration:3, delay:0.5, repeat:Infinity, ease:'easeInOut' }}
                  style={{
                    position:'absolute', inset:0, margin:-40, borderRadius:'50%',
                    border:'1px solid rgba(0,255,136,0.12)',
                  }} />
                <div style={{
                  width:80, height:80, borderRadius:20, position:'relative', zIndex:1,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.20)',
                }}>
                  <ScanLine style={{ width:32, height:32, color:G }} />
                </div>
              </div>

              <h2 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:8, color:'#E8EDF5' }}>
                Scan the market
              </h2>
              <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)', marginBottom:32, maxWidth:320 }}>
                Analyzes 100+ USDT pairs with Osiris F1–F4 filters. Takes ~10–20 seconds on first scan.
              </p>

              <motion.button
                onClick={scan}
                whileHover={{ y:-2 }}
                whileTap={{ scale:0.97 }}
                style={{
                  display:'flex', alignItems:'center', gap:12, fontWeight:700, fontSize:15,
                  color:'#000', padding:'16px 32px', borderRadius:12, cursor:'pointer',
                  background:G, border:'none',
                  boxShadow:`0 0 0 1px rgba(0,255,136,0.3), 0 8px 32px rgba(0,255,136,0.20)`,
                }}>
                <ScanLine style={{ width:20, height:20 }} />
                Scan Market
              </motion.button>

              <p style={{ fontSize:11, color:'rgba(255,255,255,0.20)', marginTop:16 }}>
                Consumes 1 daily analysis · results cached 15 min
              </p>
            </motion.div>
          )}

          {/* ── loading ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'96px 0', textAlign:'center' }}>

                <div style={{ position:'relative', marginBottom:32 }}>
                  <motion.div
                    animate={{ rotate:360 }}
                    transition={{ duration:3, repeat:Infinity, ease:'linear' }}
                    style={{
                      width:80, height:80, borderRadius:20,
                      border:'2px solid rgba(0,255,136,0.1)', borderTopColor:G,
                    }} />
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ScanLine style={{ width:28, height:28, color:G }} />
                  </div>
                </div>

                <h2 style={{ fontSize:'1.125rem', fontWeight:700, marginBottom:8, color:'#E8EDF5' }}>
                  Scanning market…
                </h2>
                <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)', maxWidth:280 }}>
                  Analyzing 100+ pairs with Osiris F1–F4 filters. This takes ~15 seconds.
                </p>

                <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:8, textAlign:'left' }}>
                  {[
                    'Fetching top 100 USDT pairs from Binance…',
                    'Filtering volume > $30M…',
                    'Loading 48-hour OHLCV for top 30…',
                    'Applying F1–F4 Osiris filters…',
                    'Ranking by filter confluence…',
                  ].map((step, i) => (
                    <motion.div key={step}
                      initial={{ opacity:0, x:-12 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: i * 0.4, duration:0.35 }}
                      style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'rgba(255,255,255,0.30)' }}>
                      <motion.div
                        animate={{ opacity:[0.3,1,0.3] }}
                        transition={{ duration:1.5, delay: i * 0.4, repeat:Infinity }}
                        style={{ width:6, height:6, borderRadius:'50%', background:G, flexShrink:0 }} />
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── error ── */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{
                  display:'flex', alignItems:'flex-start', gap:12, padding:16, borderRadius:16, marginBottom:24,
                  background:'rgba(255,59,92,0.07)', border:'1px solid rgba(255,59,92,0.18)',
                }}>
                <AlertCircle style={{ width:18, height:18, color:'#f87171', marginTop:1, flexShrink:0 }} />
                <div>
                  <p style={{ fontSize:13, color:'#f87171' }}>{error}</p>
                  {error.includes('limit') && (
                    <a href="/pricing" style={{
                      display:'inline-flex', alignItems:'center', gap:6, marginTop:6,
                      fontSize:11, fontWeight:700, color:G, textDecoration:'none',
                    }}>
                      <Crown style={{ width:11, height:11 }} /> Upgrade to Pro →
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── results ── */}
          <AnimatePresence>
            {coins && !loading && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                {/* results header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, color:'#E8EDF5' }}>
                      Top {coins.length} setups found
                    </h2>
                    <p style={{ fontSize:12, color:'rgba(232,237,245,0.30)', marginTop:2 }}>
                      Ranked by Osiris filter confluence
                    </p>
                  </div>
                  <button
                    onClick={scan}
                    disabled={loading}
                    style={{
                      display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600,
                      padding:'8px 12px', borderRadius:10, cursor:'pointer',
                      background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.18)', color:G,
                      transition:'filter 0.15s', opacity: loading ? 0.4 : 1,
                    }}>
                    <RefreshCw style={{ width:12, height:12 }} />
                    Rescan
                  </button>
                </div>

                {coins.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'64px 0', color:'rgba(255,255,255,0.30)', fontSize:14 }}>
                    No coins passed enough filters right now. Try again later.
                  </div>
                ) : (
                  <div className="coins-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                    {coins.map((coin, i) => (
                      <CoinCard key={coin.symbol} coin={coin} index={i} onAnalyze={handleAnalyze} />
                    ))}
                  </div>
                )}

                {remaining !== null && (
                  <motion.p
                    initial={{ opacity:0 }} animate={{ opacity:1 }}
                    style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.20)', marginTop:24 }}>
                    {remaining} free {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                    {' · '}
                    <a href="/pricing" style={{ color:`rgba(0,255,136,0.50)`, textDecoration:'none' }}>
                      Upgrade for unlimited
                    </a>
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          </> /* end paid content */}

        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .coins-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .coins-grid { grid-template-columns: 1fr !important; }
          .discover-container { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
