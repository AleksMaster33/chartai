'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Minus, Target, ShieldAlert,
  ArrowUpRight, BarChart2, ChevronDown, CheckCircle2, AlertCircle
} from 'lucide-react'
import type { AnalysisResult } from '@/lib/ai/analyze'

const LIME  = '#84cc16'
const RED   = '#ef4444'
const GREEN = '#22c55e'
const AMBER = '#f59e0b'

/* ── animated number ───────────────────────────────── */
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const start = Date.now()
    const dur = 900
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplay(e * value)
      if (p < 1) raf.current = setTimeout(tick, 16)
    }
    tick()
    return () => { if (raf.current) clearTimeout(raf.current) }
  }, [value])
  return <>{display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>
}

/* ── animated bar ──────────────────────────────────── */
function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 120); return () => clearTimeout(t) }, [value])
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
      <div className="h-full rounded-full transition-all duration-[1100ms] ease-out"
        style={{ width:`${w}%`, background:`linear-gradient(90deg,${color}99,${color})` }} />
    </div>
  )
}

/* ── level row ─────────────────────────────────────── */
function LevelRow({ label, val, color, bg, border, icon: Icon }: {
  label: string; val: number; color: string; bg: string; border: string
  icon: React.ElementType
}) {
  const decimals = val > 100 ? 2 : val > 1 ? 4 : 6
  return (
    <motion.div
      initial={{ opacity:0, x:-10 }}
      animate={{ opacity:1, x:0 }}
      className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
      style={{ background:bg, border:`1px solid ${border}` }}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-display font-semibold" style={{ color }}>{label}</span>
      </div>
      <span className="font-mono font-bold tabular-nums text-sm" style={{ color }}>
        <AnimatedNumber value={val} decimals={decimals} />
      </span>
    </motion.div>
  )
}

/* ── main component ────────────────────────────────── */
export function AnalysisResultCard({
  result,
  remainingToday,
}: {
  result: AnalysisResult
  remainingToday?: number
}) {
  const [showIndicators, setShowIndicators] = useState(false)

  const sig = {
    LONG:    { color:LIME,  bg:'rgba(132,204,22,0.08)',  border:'rgba(132,204,22,0.2)',  icon:TrendingUp,   label:'LONG'    },
    SHORT:   { color:RED,   bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.2)',   icon:TrendingDown, label:'SHORT'   },
    NEUTRAL: { color:AMBER, bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.2)',  icon:Minus,        label:'NEUTRAL' },
  }[result.signal] ?? { color:LIME, bg:'rgba(132,204,22,0.08)', border:'rgba(132,204,22,0.2)', icon:TrendingUp, label:'LONG' }

  const confColor = result.confidence >= 70 ? LIME : result.confidence >= 50 ? AMBER : RED
  const decimals  = result.entry_price > 100 ? 2 : result.entry_price > 1 ? 4 : 6
  const fmt = (v: number) => v > 0 ? v.toLocaleString(undefined, { maximumFractionDigits:decimals }) : '—'

  const levels = [
    { label:'Entry',    val:result.entry_price,    color:LIME,  bg:'rgba(132,204,22,0.06)',  border:'rgba(132,204,22,0.15)',  icon:ArrowUpRight },
    { label:'Stop Loss',val:result.stop_loss,       color:RED,   bg:'rgba(239,68,68,0.06)',   border:'rgba(239,68,68,0.15)',   icon:ShieldAlert  },
    { label:'TP 1',     val:result.take_profit_1,   color:GREEN, bg:'rgba(34,197,94,0.05)',   border:'rgba(34,197,94,0.12)',   icon:Target       },
    ...(result.take_profit_2 > 0 ? [{ label:'TP 2', val:result.take_profit_2, color:GREEN, bg:'rgba(34,197,94,0.04)', border:'rgba(34,197,94,0.1)', icon:Target }] : []),
    ...(result.take_profit_3 > 0 ? [{ label:'TP 3', val:result.take_profit_3, color:GREEN, bg:'rgba(34,197,94,0.03)', border:'rgba(34,197,94,0.08)', icon:Target }] : []),
  ].filter(l => l.val > 0)

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
      className="space-y-3">

      {/* ── header card ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${sig.border}` }}>

        {/* top accent line */}
        <div className="h-px w-full"
          style={{ background:`linear-gradient(90deg,transparent,${sig.color}55,transparent)` }} />

        <div className="p-5">
          {/* ticker + signal */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="font-display font-extrabold text-2xl">{result.ticker || 'CHART'}</span>
                {result.timeframe && (
                  <span className="text-xs rounded-md px-2 py-0.5 font-display text-white/45"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    {result.timeframe}
                  </span>
                )}
                {result.trend && (
                  <span className="text-xs rounded-md px-2 py-0.5 font-display font-semibold"
                    style={{ background:sig.bg, color:sig.color, border:`1px solid ${sig.border}` }}>
                    {result.trend}
                  </span>
                )}
              </div>
              {result.pattern && (
                <p className="text-sm text-white/35 font-display">{result.pattern}</p>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-base shrink-0"
              style={{ background:sig.bg, border:`1px solid ${sig.border}`, color:sig.color }}>
              <sig.icon className="w-4 h-4" />
              {sig.label}
            </div>
          </div>

          {/* confidence */}
          <div>
            <div className="flex justify-between text-xs text-white/30 font-display mb-2">
              <span>Osiris Confidence</span>
              <span className="font-semibold" style={{ color:confColor }}>{result.confidence}%</span>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedBar value={result.confidence} color={confColor} />
              {result.risk_reward > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-display shrink-0">
                  <BarChart2 className="w-3 h-3 text-white/25" />
                  <span className="text-white/25">R:R</span>
                  <span className="text-white/60 font-semibold">1:{result.risk_reward.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── price levels ── */}
      <div className="rounded-2xl p-5 space-y-2"
        style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] text-white/30 font-display font-semibold uppercase tracking-widest mb-3">
          Signal Levels
        </p>
        {levels.map((l, i) => (
          <motion.div key={l.label}
            initial={{ opacity:0, x:-8 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:i*0.06, duration:0.35, ease:[0.22,1,0.36,1] }}>
            <LevelRow {...l} />
          </motion.div>
        ))}
      </div>

      {/* ── S/R levels ── */}
      {(result.support_level > 0 || result.resistance_level > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {result.support_level > 0 && (
            <div className="rounded-xl p-4"
              style={{ background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-[10px] text-white/30 font-display uppercase tracking-wider mb-1.5">Support</p>
              <p className="font-mono font-bold text-blue-400 tabular-nums">{fmt(result.support_level)}</p>
            </div>
          )}
          {result.resistance_level > 0 && (
            <div className="rounded-xl p-4"
              style={{ background:'rgba(251,146,60,0.05)', border:'1px solid rgba(251,146,60,0.15)' }}>
              <p className="text-[10px] text-white/30 font-display uppercase tracking-wider mb-1.5">Resistance</p>
              <p className="font-mono font-bold text-orange-400 tabular-nums">{fmt(result.resistance_level)}</p>
            </div>
          )}
        </div>
      )}

      {/* ── rationale ── */}
      <div className="rounded-2xl p-5"
        style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] text-white/30 font-display font-semibold uppercase tracking-widest mb-3">
          Osiris Analysis
        </p>
        <p className="text-sm text-white/60 leading-relaxed">{result.rationale}</p>
      </div>

      {/* ── indicators (collapsible) ── */}
      {result.indicators?.length > 0 && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setShowIndicators(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <span className="text-[11px] text-white/30 font-display font-semibold uppercase tracking-widest">
              Indicators
            </span>
            <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-200 ${showIndicators ? 'rotate-180':''}`} />
          </button>

          <AnimatePresence>
            {showIndicators && (
              <motion.div
                initial={{ height:0, opacity:0 }}
                animate={{ height:'auto', opacity:1 }}
                exit={{ height:0, opacity:0 }}
                transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
                className="overflow-hidden">
                <div className="px-5 pb-4 space-y-2.5 border-t border-white/[0.05]">
                  {result.indicators.map((ind, i) => (
                    <div key={i} className="flex items-center justify-between pt-2.5">
                      <span className="text-sm text-white/45 font-display">{ind.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/65 font-mono">{ind.value}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-display font-semibold"
                          style={{
                            background: ind.signal==='bullish' ? 'rgba(132,204,22,0.1)' : ind.signal==='bearish' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                            color:      ind.signal==='bullish' ? LIME               : ind.signal==='bearish' ? RED               : 'rgba(255,255,255,0.3)',
                          }}>
                          {ind.signal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── confidence badge ── */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
        style={{
          background: result.confidence >= 70 ? 'rgba(132,204,22,0.05)' : 'rgba(255,255,255,0.02)',
          border:     result.confidence >= 70 ? '1px solid rgba(132,204,22,0.12)' : '1px solid rgba(255,255,255,0.05)',
        }}>
        {result.confidence >= 70
          ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color:LIME }} />
          : <AlertCircle  className="w-4 h-4 shrink-0 text-amber-400" />}
        <p className="text-xs text-white/35 font-display leading-relaxed">
          {result.confidence >= 70
            ? 'High confidence — all Osiris filters aligned'
            : 'Moderate confidence — use additional confirmation'}
          {remainingToday !== undefined && (
            <span className="ml-2 text-white/20">· {remainingToday} {remainingToday===1?'analysis':'analyses'} left today</span>
          )}
        </p>
      </div>

      <p className="text-[10px] text-white/15 text-center font-display">
        Educational purposes only · Not financial advice · Trade at your own risk
      </p>
    </motion.div>
  )
}
