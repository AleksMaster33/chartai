'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, ShieldAlert, ArrowUpRight, BarChart2, ChevronDown } from 'lucide-react'
import type { AnalysisResult } from '@/lib/ai/analyze'

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const start = Date.now()
    const duration = 800
    const from = 0
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (value - from) * eased)
      if (progress < 1) ref.current = setTimeout(animate, 16)
    }
    animate()
    return () => { if (ref.current) clearTimeout(ref.current) }
  }, [value])

  return <>{display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }} />
    </div>
  )
}

export function AnalysisResultCard({ result, remainingToday }: { result: AnalysisResult; remainingToday?: number }) {
  const [showIndicators, setShowIndicators] = useState(false)

  const signalConfig = {
    LONG:    { color: '#84cc16', bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.2)', icon: TrendingUp,   label: 'LONG' },
    SHORT:   { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  icon: TrendingDown, label: 'SHORT' },
    NEUTRAL: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: Minus,        label: 'NEUTRAL' },
  }[result.signal]

  const confColor = result.confidence >= 70 ? '#84cc16' : result.confidence >= 50 ? '#f59e0b' : '#ef4444'
  const decimals = result.entry_price > 100 ? 2 : result.entry_price > 1 ? 4 : 6

  const fmt = (v: number) => v > 0 ? v.toLocaleString(undefined, { maximumFractionDigits: decimals }) : '—'

  return (
    <div className="space-y-3 fade-up">

      {/* Header card */}
      <div className="glass border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="font-display font-extrabold text-2xl">{result.ticker || 'CHART'}</span>
              {result.timeframe && (
                <span className="text-xs bg-white/[0.06] border border-white/[0.08] rounded-md px-2 py-0.5 font-display text-white/50">
                  {result.timeframe}
                </span>
              )}
              <span className="text-xs rounded-md px-2 py-0.5 font-display font-semibold"
                style={{ background: signalConfig.bg, color: signalConfig.color, border: `1px solid ${signalConfig.border}` }}>
                {result.trend}
              </span>
            </div>
            {result.pattern && <p className="text-sm text-white/35 font-display">{result.pattern}</p>}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-lg"
            style={{ background: signalConfig.bg, border: `1px solid ${signalConfig.border}`, color: signalConfig.color }}>
            <signalConfig.icon className="w-5 h-5" />
            {signalConfig.label}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/30 font-display mb-1">
            <span>Osiris confidence</span>
            <span style={{ color: confColor }} className="font-semibold">{result.confidence}%</span>
          </div>
          <div className="flex items-center gap-3">
            <AnimatedBar value={result.confidence} color={confColor} />
          </div>
        </div>
      </div>

      {/* Price levels */}
      <div className="glass border border-white/[0.07] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-white/35 font-display font-semibold uppercase tracking-wider">Signal Levels</span>
          {result.risk_reward > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-display">
              <BarChart2 className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/30">R:R</span>
              <span className="text-white/70 font-semibold">1 : {result.risk_reward.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {[
            { label: 'Entry', val: result.entry_price, color: '#84cc16', bg: 'rgba(132,204,22,0.06)', border: 'rgba(132,204,22,0.15)', icon: ArrowUpRight },
            { label: 'Stop Loss', val: result.stop_loss, color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', icon: ShieldAlert },
            { label: 'TP 1', val: result.take_profit_1, color: '#22c55e', bg: 'rgba(34,197,94,0.04)', border: 'rgba(34,197,94,0.12)', icon: Target },
            ...(result.take_profit_2 > 0 ? [{ label: 'TP 2', val: result.take_profit_2, color: '#22c55e', bg: 'rgba(34,197,94,0.04)', border: 'rgba(34,197,94,0.12)', icon: Target }] : []),
            ...(result.take_profit_3 > 0 ? [{ label: 'TP 3', val: result.take_profit_3, color: '#22c55e', bg: 'rgba(34,197,94,0.04)', border: 'rgba(34,197,94,0.12)', icon: Target }] : []),
          ].filter(l => l.val > 0).map(({ label, val, color, bg, border, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-display font-medium" style={{ color }}>{label}</span>
              </div>
              <span className="font-display font-bold tabular-nums" style={{ color }}>
                {fmt(val)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* S/R levels */}
      {(result.support_level > 0 || result.resistance_level > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {result.support_level > 0 && (
            <div className="glass border border-white/[0.07] rounded-xl p-4">
              <p className="text-xs text-white/30 font-display mb-1.5">Support</p>
              <p className="font-display font-bold text-blue-400 tabular-nums">{fmt(result.support_level)}</p>
            </div>
          )}
          {result.resistance_level > 0 && (
            <div className="glass border border-white/[0.07] rounded-xl p-4">
              <p className="text-xs text-white/30 font-display mb-1.5">Resistance</p>
              <p className="font-display font-bold text-orange-400 tabular-nums">{fmt(result.resistance_level)}</p>
            </div>
          )}
        </div>
      )}

      {/* Rationale */}
      <div className="glass border border-white/[0.07] rounded-2xl p-5">
        <p className="text-xs text-white/30 font-display font-semibold uppercase tracking-wider mb-3">Analysis</p>
        <p className="text-sm text-white/70 leading-relaxed">{result.rationale}</p>
      </div>

      {/* Indicators collapsible */}
      {result.indicators?.length > 0 && (
        <div className="glass border border-white/[0.07] rounded-2xl overflow-hidden">
          <button onClick={() => setShowIndicators(!showIndicators)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <span className="text-xs text-white/30 font-display font-semibold uppercase tracking-wider">Indicators</span>
            <ChevronDown className={`w-4 h-4 text-white/25 transition-transform duration-200 ${showIndicators ? 'rotate-180' : ''}`} />
          </button>
          {showIndicators && (
            <div className="px-5 pb-4 space-y-2.5 border-t border-white/[0.05]">
              {result.indicators.map((ind, i) => (
                <div key={i} className="flex items-center justify-between pt-2">
                  <span className="text-sm text-white/50 font-display">{ind.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70 font-display">{ind.value}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-display font-semibold"
                      style={{
                        background: ind.signal === 'bullish' ? 'rgba(132,204,22,0.1)' : ind.signal === 'bearish' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                        color: ind.signal === 'bullish' ? '#84cc16' : ind.signal === 'bearish' ? '#ef4444' : 'rgba(255,255,255,0.3)',
                      }}>
                      {ind.signal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-white/20 text-center font-display leading-relaxed">
        Educational purposes only · Not financial advice · Trade at your own risk
        {remainingToday !== undefined && (
          <span className="block mt-1 text-white/15">
            {remainingToday} free {remainingToday === 1 ? 'analysis' : 'analyses'} remaining today
          </span>
        )}
      </p>
    </div>
  )
}
