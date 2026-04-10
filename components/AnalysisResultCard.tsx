'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Minus, Target, ShieldAlert,
  ArrowUpRight, BarChart2, ChevronDown, CheckCircle2, AlertCircle
} from 'lucide-react'
import type { AnalysisResult } from '@/lib/ai/analyze'

const G     = '#00FF88'
const RED   = '#FF3B5C'
const GREEN = '#00FF88'
const AMBER = '#FFB800'

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
    <div style={{ flex:1, height:6, borderRadius:999, overflow:'hidden', background:'rgba(255,255,255,0.05)' }}>
      <div style={{
        height:'100%', borderRadius:999,
        width:`${w}%`,
        background:`linear-gradient(90deg,${color}99,${color})`,
        transition:'width 1100ms cubic-bezier(0,0,0.2,1)',
      }} />
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
      style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 16px', borderRadius:12,
        background:bg, border:`1px solid ${border}`,
      }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <Icon style={{ width:16, height:16, color }} />
        <span style={{ fontSize:14, fontWeight:600, color }}>{label}</span>
      </div>
      <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:14, color }}>
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
    LONG:    { color:G,     bg:`rgba(0,255,136,0.08)`,   border:`rgba(0,255,136,0.20)`,   icon:TrendingUp,   label:'LONG'    },
    SHORT:   { color:RED,   bg:'rgba(255,59,92,0.08)',    border:'rgba(255,59,92,0.20)',    icon:TrendingDown, label:'SHORT'   },
    NEUTRAL: { color:AMBER, bg:'rgba(255,184,0,0.08)',    border:'rgba(255,184,0,0.20)',    icon:Minus,        label:'NEUTRAL' },
  }[result.signal] ?? { color:G, bg:'rgba(0,255,136,0.08)', border:'rgba(0,255,136,0.20)', icon:TrendingUp, label:'LONG' }

  const confColor = result.confidence >= 70 ? G : result.confidence >= 50 ? AMBER : RED
  const decimals  = result.entry_price > 100 ? 2 : result.entry_price > 1 ? 4 : 6
  const fmt = (v: number) => v > 0 ? v.toLocaleString(undefined, { maximumFractionDigits:decimals }) : '—'

  const levels = [
    { label:'Entry',     val:result.entry_price,   color:G,     bg:`rgba(0,255,136,0.06)`,  border:`rgba(0,255,136,0.15)`,  icon:ArrowUpRight },
    { label:'Stop Loss', val:result.stop_loss,      color:RED,   bg:'rgba(255,59,92,0.06)',   border:'rgba(255,59,92,0.15)',   icon:ShieldAlert  },
    { label:'TP 1',      val:result.take_profit_1,  color:GREEN, bg:'rgba(0,255,136,0.05)',   border:'rgba(0,255,136,0.12)',   icon:Target       },
    ...(result.take_profit_2 > 0 ? [{ label:'TP 2', val:result.take_profit_2, color:GREEN, bg:'rgba(0,255,136,0.04)', border:'rgba(0,255,136,0.10)', icon:Target }] : []),
    ...(result.take_profit_3 > 0 ? [{ label:'TP 3', val:result.take_profit_3, color:GREEN, bg:'rgba(0,255,136,0.03)', border:'rgba(0,255,136,0.08)', icon:Target }] : []),
  ].filter(l => l.val > 0)

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
      style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* ── header card ── */}
      <div style={{
        borderRadius:16, overflow:'hidden',
        background:'rgba(255,255,255,0.025)', border:`1px solid ${sig.border}`,
      }}>
        {/* top accent line */}
        <div style={{
          height:1, width:'100%',
          background:`linear-gradient(90deg,transparent,${sig.color}55,transparent)`,
        }} />

        <div style={{ padding:20 }}>
          {/* ticker + signal */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <span style={{ fontWeight:800, fontSize:'1.5rem', color:'#E8EDF5' }}>{result.ticker || 'CHART'}</span>
                {result.timeframe && (
                  <span style={{
                    fontSize:11, borderRadius:6, padding:'2px 8px', color:'rgba(255,255,255,0.45)',
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  }}>
                    {result.timeframe}
                  </span>
                )}
                {result.trend && (
                  <span style={{
                    fontSize:11, borderRadius:6, padding:'2px 8px', fontWeight:600,
                    background:sig.bg, color:sig.color, border:`1px solid ${sig.border}`,
                  }}>
                    {result.trend}
                  </span>
                )}
              </div>
              {result.pattern && (
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>{result.pattern}</p>
              )}
            </div>

            <div style={{
              display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:12,
              fontWeight:700, fontSize:14, flexShrink:0,
              background:sig.bg, border:`1px solid ${sig.border}`, color:sig.color,
            }}>
              <sig.icon style={{ width:16, height:16 }} />
              {sig.label}
            </div>
          </div>

          {/* confidence */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,0.30)', marginBottom:8 }}>
              <span>Osiris Confidence</span>
              <span style={{ fontWeight:600, color:confColor }}>{result.confidence}%</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <AnimatedBar value={result.confidence} color={confColor} />
              {result.risk_reward > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, flexShrink:0 }}>
                  <BarChart2 style={{ width:12, height:12, color:'rgba(255,255,255,0.25)' }} />
                  <span style={{ color:'rgba(255,255,255,0.25)' }}>R:R</span>
                  <span style={{ color:'rgba(255,255,255,0.60)', fontWeight:600 }}>1:{result.risk_reward.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── price levels ── */}
      <div style={{
        borderRadius:16, padding:20,
        background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
        display:'flex', flexDirection:'column', gap:8,
      }}>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.30)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {result.support_level > 0 && (
            <div style={{
              borderRadius:12, padding:16,
              background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.15)',
            }}>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.30)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Support</p>
              <p style={{ fontFamily:'monospace', fontWeight:700, color:'#60a5fa' }}>{fmt(result.support_level)}</p>
            </div>
          )}
          {result.resistance_level > 0 && (
            <div style={{
              borderRadius:12, padding:16,
              background:'rgba(251,146,60,0.05)', border:'1px solid rgba(251,146,60,0.15)',
            }}>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.30)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Resistance</p>
              <p style={{ fontFamily:'monospace', fontWeight:700, color:'#fb923c' }}>{fmt(result.resistance_level)}</p>
            </div>
          )}
        </div>
      )}

      {/* ── rationale ── */}
      <div style={{
        borderRadius:16, padding:20,
        background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.30)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>
          Osiris Analysis
        </p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.60)', lineHeight:1.65 }}>{result.rationale}</p>
      </div>

      {/* ── indicators (collapsible) ── */}
      {result.indicators?.length > 0 && (
        <div style={{
          borderRadius:16, overflow:'hidden',
          background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
        }}>
          <button onClick={() => setShowIndicators(v => !v)}
            style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'16px 20px', background:'none', border:'none', cursor:'pointer',
            }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.30)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>
              Indicators
            </span>
            <ChevronDown style={{
              width:16, height:16, color:'rgba(255,255,255,0.20)',
              transform: showIndicators ? 'rotate(180deg)' : 'none',
              transition:'transform 0.2s',
            }} />
          </button>

          <AnimatePresence>
            {showIndicators && (
              <motion.div
                initial={{ height:0, opacity:0 }}
                animate={{ height:'auto', opacity:1 }}
                exit={{ height:0, opacity:0 }}
                transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
                style={{ overflow:'hidden' }}>
                <div style={{
                  padding:'0 20px 16px',
                  borderTop:'1px solid rgba(255,255,255,0.05)',
                  display:'flex', flexDirection:'column', gap:10,
                }}>
                  {result.indicators.map((ind, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10 }}>
                      <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>{ind.name}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:13, color:'rgba(255,255,255,0.65)', fontFamily:'monospace' }}>{ind.value}</span>
                        <span style={{
                          fontSize:10, padding:'2px 8px', borderRadius:999, fontWeight:600,
                          background: ind.signal==='bullish' ? 'rgba(0,255,136,0.10)' : ind.signal==='bearish' ? 'rgba(255,59,92,0.10)' : 'rgba(255,255,255,0.05)',
                          color:      ind.signal==='bullish' ? G                      : ind.signal==='bearish' ? RED                    : 'rgba(255,255,255,0.30)',
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
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:12,
        background: result.confidence >= 70 ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)',
        border:     result.confidence >= 70 ? '1px solid rgba(0,255,136,0.12)' : '1px solid rgba(255,255,255,0.05)',
      }}>
        {result.confidence >= 70
          ? <CheckCircle2 style={{ width:16, height:16, flexShrink:0, color:G }} />
          : <AlertCircle  style={{ width:16, height:16, flexShrink:0, color:AMBER }} />}
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.55 }}>
          {result.confidence >= 70
            ? 'High confidence — all Osiris filters aligned'
            : 'Moderate confidence — use additional confirmation'}
          {remainingToday !== undefined && (
            <span style={{ marginLeft:8, color:'rgba(255,255,255,0.20)' }}>
              · {remainingToday} {remainingToday===1?'analysis':'analyses'} left today
            </span>
          )}
        </p>
      </div>

      <p style={{ fontSize:10, color:'rgba(255,255,255,0.15)', textAlign:'center' }}>
        Educational purposes only · Not financial advice · Trade at your own risk
      </p>
    </motion.div>
  )
}
