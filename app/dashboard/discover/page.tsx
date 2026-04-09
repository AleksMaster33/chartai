'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import {
  ScanLine, TrendingUp, TrendingDown, Minus, ExternalLink,
  CheckCircle2, XCircle, ArrowRight, Clock, Zap, RefreshCw,
  BarChart2, Activity, Shield, Target, AlertCircle, Crown,
} from 'lucide-react'
import type { DiscoveredCoin } from '@/lib/discovery/binance'

const LIME  = '#84cc16'
const RED   = '#ef4444'
const AMBER = '#f59e0b'

// ── helpers ──────────────────────────────────────────────────────────────────

function signalColor(d: 'LONG' | 'SHORT' | 'NEUTRAL') {
  return d === 'LONG' ? LIME : d === 'SHORT' ? RED : AMBER
}
function SignalIcon({ d }: { d: 'LONG' | 'SHORT' | 'NEUTRAL' }) {
  if (d === 'LONG')  return <TrendingUp  className="w-4 h-4" style={{ color:LIME  }} />
  if (d === 'SHORT') return <TrendingDown className="w-4 h-4" style={{ color:RED   }} />
  return <Minus className="w-4 h-4" style={{ color:AMBER }} />
}

const FILTER_META = [
  { key:'f1', label:'F1', name:'Volume & Spike',  icon:Zap      },
  { key:'f2', label:'F2', name:'NATR Volatility', icon:Activity  },
  { key:'f3', label:'F3', name:'EMA Trend',       icon:BarChart2 },
  { key:'f4', label:'F4', name:'BTC Independence',icon:Shield    },
] as const

// ── CoinCard ─────────────────────────────────────────────────────────────────

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
      className="rounded-2xl overflow-hidden"
      style={{
        background:'rgba(255,255,255,0.025)',
        border:`1px solid rgba(255,255,255,0.06)`,
      }}
    >
      {/* top accent line */}
      <div className="h-px w-full"
        style={{ background:`linear-gradient(90deg,transparent,${color}44,transparent)` }} />

      <div className="p-5">
        {/* header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              {/* rank */}
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-display font-bold"
                style={{ background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.3)' }}>
                {index + 1}
              </span>
              <span className="font-display font-extrabold text-xl">{coin.baseAsset}</span>
              <span className="text-xs text-white/30 font-display bg-white/[0.04] px-2 py-0.5 rounded">USDT</span>
            </div>
            <div className="flex items-center gap-3 ml-8">
              <span className="font-mono text-sm text-white/60">
                ${coin.lastPrice < 1
                  ? coin.lastPrice.toFixed(4)
                  : coin.lastPrice < 100
                  ? coin.lastPrice.toFixed(3)
                  : coin.lastPrice.toLocaleString(undefined, { maximumFractionDigits:2 })}
              </span>
              <span className="text-xs font-display font-semibold"
                style={{ color: coin.priceChange24h >= 0 ? LIME : RED }}>
                {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
              </span>
              <span className="text-[11px] text-white/25 font-display">
                Vol ${(coin.volume24h / 1e6).toFixed(0)}M
              </span>
            </div>
          </div>

          {/* direction badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-sm shrink-0"
            style={{ background:`${color}14`, border:`1px solid ${color}33`, color }}>
            <SignalIcon d={dir} />
            {dir}
          </div>
        </div>

        {/* Osiris filter progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-white/30 font-display uppercase tracking-wider">Osiris Filters</span>
            <span className="font-mono text-sm font-bold" style={{ color }}>
              {coin.filters.passedCount}/4
            </span>
          </div>
          {/* progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background:'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${(coin.filters.passedCount / 4) * 100}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration:0.8, ease:'easeOut' }}
              className="h-full rounded-full"
              style={{ background:`linear-gradient(90deg,${color}88,${color})` }}
            />
          </div>

          {/* F1–F4 grid */}
          <div className="grid grid-cols-2 gap-2">
            {FILTER_META.map(({ key, label, name, icon: Icon }) => {
              const f = coin.filters[key as keyof typeof coin.filters] as { passed:boolean; reason:string }
              return (
                <div key={key}
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                  style={{
                    background: f.passed ? `${color}08` : 'rgba(255,255,255,0.02)',
                    border: f.passed ? `1px solid ${color}22` : '1px solid rgba(255,255,255,0.04)',
                  }}>
                  <div className="mt-0.5 shrink-0">
                    {f.passed
                      ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} />
                      : <XCircle      className="w-3.5 h-3.5 text-white/18" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon className="w-3 h-3 text-white/30" style={{ width:11, height:11 }} />
                      <span className="text-[10px] font-display font-bold text-white/50 uppercase tracking-wider">{label}</span>
                      <span className="text-[10px] text-white/25 font-display">{name}</span>
                    </div>
                    <p className="text-[10px] text-white/35 leading-snug font-display">{f.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAnalyze(coin)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-bold text-sm text-black transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            style={{ background:LIME, boxShadow:`0 4px 16px ${LIME}22` }}>
            <Target className="w-3.5 h-3.5" />
            Analyze →
          </button>
          <a
            href={tvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-display font-semibold text-sm text-white/45 hover:text-white/70 transition-all duration-200"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <ExternalLink className="w-3.5 h-3.5" />
            TradingView
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [coins, setCoins]       = useState<DiscoveredCoin[] | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [scannedAt, setScanned] = useState<string | null>(null)
  const [cached, setCached]     = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const router = useRouter()

  const scan = async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/discover', { method:'POST' })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 429) setError('Daily limit reached. Upgrade to Pro for unlimited scans.')
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
    router.push(
      `/dashboard/analyze?coin=${coin.symbol}&direction=${coin.filters.direction}`,
    )
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      {/* bg grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
          style={{ background:'radial-gradient(ellipse at top,rgba(132,204,22,0.04) 0%,transparent 60%)' }} />
      </div>

      <div className="relative z-10">
        <Navbar plan="free" remaining={remaining} />

        <div className="max-w-5xl mx-auto px-5 py-8">

          {/* page header */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45 }}
            className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(132,204,22,0.1)', border:'1px solid rgba(132,204,22,0.2)' }}>
                    <ScanLine className="w-4 h-4" style={{ color:LIME }} />
                  </div>
                  <h1 className="font-display font-extrabold text-xl">Market Discovery</h1>
                </div>
                <p className="text-sm text-white/35 max-w-xl">
                  Scans Binance top 100 pairs and applies Osiris F1–F4 filters to surface the highest-potential setups. Results cached 15 min.
                </p>
              </div>

              {scannedAt && (
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/25 font-display justify-end">
                    <Clock className="w-3 h-3" />
                    {cached ? 'Cached' : 'Fresh scan'}
                  </div>
                  <p className="text-[11px] text-white/20 font-display mt-0.5">
                    {new Date(scannedAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── scan button ── */}
          {!coins && !loading && (
            <motion.div
              initial={{ opacity:0, scale:0.97 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.4 }}
              className="flex flex-col items-center justify-center py-20 text-center">

              {/* animated rings */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ scale:[1,1.15,1], opacity:[0.3,0.1,0.3] }}
                  transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                  className="absolute inset-0 -m-5 rounded-full"
                  style={{ border:'1px solid rgba(132,204,22,0.2)' }} />
                <motion.div
                  animate={{ scale:[1,1.25,1], opacity:[0.2,0.05,0.2] }}
                  transition={{ duration:3, delay:0.5, repeat:Infinity, ease:'easeInOut' }}
                  className="absolute inset-0 -m-10 rounded-full"
                  style={{ border:'1px solid rgba(132,204,22,0.12)' }} />
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.2)' }}>
                  <ScanLine className="w-8 h-8" style={{ color:LIME }} />
                </div>
              </div>

              <h2 className="font-display font-extrabold text-2xl mb-2">Scan the market</h2>
              <p className="text-sm text-white/35 mb-8 max-w-sm">
                Analyzes 100+ USDT pairs with Osiris F1–F4 filters. Takes ~10–20 seconds on first scan.
              </p>

              <motion.button
                onClick={scan}
                whileHover={{ y:-2 }}
                whileTap={{ scale:0.97 }}
                className="flex items-center gap-3 font-display font-bold text-black px-8 py-4 rounded-xl text-[15px]"
                style={{ background:LIME, boxShadow:`0 0 0 1px rgba(132,204,22,0.3), 0 8px 32px rgba(132,204,22,0.2)` }}>
                <ScanLine className="w-5 h-5" />
                Scan Market
              </motion.button>

              <p className="text-[11px] text-white/20 font-display mt-4">Consumes 1 daily analysis · results cached 15 min</p>
            </motion.div>
          )}

          {/* ── loading ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 text-center">

                {/* scanning animation */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate:360 }}
                    transition={{ duration:3, repeat:Infinity, ease:'linear' }}
                    className="w-20 h-20 rounded-2xl"
                    style={{ border:'2px solid rgba(132,204,22,0.1)', borderTopColor:LIME }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-7 h-7" style={{ color:LIME }} />
                  </div>
                </div>

                <h2 className="font-display font-bold text-lg mb-2">Scanning market…</h2>
                <p className="text-sm text-white/35 max-w-xs">
                  Analyzing 100+ pairs with Osiris F1–F4 filters. This takes ~15 seconds.
                </p>

                {/* step indicators */}
                <div className="mt-8 space-y-2 text-left">
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
                      className="flex items-center gap-2 text-xs font-display text-white/30">
                      <motion.div
                        animate={{ opacity:[0.3,1,0.3] }}
                        transition={{ duration:1.5, delay: i * 0.4, repeat:Infinity }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background:LIME }} />
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
                className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)' }}>
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-red-400 font-display">{error}</p>
                  {error.includes('limit') && (
                    <a href="/pricing"
                      className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-display font-bold"
                      style={{ color:LIME }}>
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
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                {/* results header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display font-bold text-base">
                      Top {coins.length} setups found
                    </h2>
                    <p className="text-xs text-white/30 font-display mt-0.5">
                      Ranked by Osiris filter confluence
                    </p>
                  </div>
                  <button
                    onClick={scan}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-2 rounded-xl transition-all hover:brightness-110 disabled:opacity-40"
                    style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.18)', color:LIME }}>
                    <RefreshCw className="w-3 h-3" />
                    Rescan
                  </button>
                </div>

                {/* coin cards */}
                {coins.length === 0 ? (
                  <div className="text-center py-16 text-white/30 font-display">
                    No coins passed enough filters right now. Try again later.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {coins.map((coin, i) => (
                      <CoinCard key={coin.symbol} coin={coin} index={i} onAnalyze={handleAnalyze} />
                    ))}
                  </div>
                )}

                {/* remaining counter */}
                {remaining !== null && (
                  <motion.p
                    initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="text-center text-[11px] text-white/20 font-display mt-6">
                    {remaining} free {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                    {' · '}
                    <a href="/pricing" className="hover:text-white/40 transition-colors" style={{ color:`${LIME}66` }}>
                      Upgrade for unlimited
                    </a>
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
