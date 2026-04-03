'use client'

import { TrendingUp, TrendingDown, Minus, Target, ShieldAlert, ArrowUpRight, BarChart2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { AnalysisResult } from '@/lib/ai/analyze'

interface AnalysisResultCardProps {
  result: AnalysisResult
  remainingToday?: number
}

function SignalBadge({ signal }: { signal: 'LONG' | 'SHORT' | 'NEUTRAL' }) {
  const config = {
    LONG: { color: 'bg-green-500/10 border-green-500/30 text-green-400', icon: TrendingUp, label: 'LONG' },
    SHORT: { color: 'bg-red-500/10 border-red-500/30 text-red-400', icon: TrendingDown, label: 'SHORT' },
    NEUTRAL: { color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', icon: Minus, label: 'NEUTRAL' },
  }[signal]

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-lg ${config.color}`}>
      <config.icon className="w-5 h-5" />
      {config.label}
    </div>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-lime-400' : value >= 50 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${color.replace('bg-', 'text-')}`}>{value}%</span>
    </div>
  )
}

function PriceLevel({ label, value, color, icon: Icon }: {
  label: string
  value: number
  color: string
  icon: React.ElementType
}) {
  if (!value || value === 0) return null
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${color}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-bold tabular-nums">{value.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
    </div>
  )
}

export function AnalysisResultCard({ result, remainingToday }: AnalysisResultCardProps) {
  const [showIndicators, setShowIndicators] = useState(false)

  const rrLabel = result.risk_reward
    ? `1 : ${result.risk_reward.toFixed(1)}`
    : 'N/A'

  return (
    <div className="fade-in space-y-4">
      {/* Header */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold">{result.ticker || 'CHART'}</span>
              <span className="text-sm text-white/40 bg-white/[0.05] px-2 py-0.5 rounded-md">{result.timeframe}</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                result.trend === 'BULLISH' ? 'bg-green-500/10 text-green-400' :
                result.trend === 'BEARISH' ? 'bg-red-500/10 text-red-400' :
                'bg-yellow-500/10 text-yellow-400'
              }`}>{result.trend}</span>
            </div>
            <p className="text-sm text-white/50">{result.pattern}</p>
          </div>
          <SignalBadge signal={result.signal} />
        </div>

        <div>
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Confidence</span>
            <span>Osiris score</span>
          </div>
          <ConfidenceBar value={result.confidence} />
        </div>
      </div>

      {/* Price Levels */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/60">Signal levels</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <BarChart2 className="w-3.5 h-3.5" />
            R:R {rrLabel}
          </div>
        </div>

        <PriceLevel
          label="Entry"
          value={result.entry_price}
          color="border-lime-400/30 bg-lime-400/[0.05] text-lime-400"
          icon={ArrowUpRight}
        />
        <PriceLevel
          label="Stop Loss"
          value={result.stop_loss}
          color="border-red-500/30 bg-red-500/[0.05] text-red-400"
          icon={ShieldAlert}
        />
        <PriceLevel
          label="TP 1"
          value={result.take_profit_1}
          color="border-green-500/20 bg-green-500/[0.04] text-green-400"
          icon={Target}
        />
        {result.take_profit_2 > 0 && (
          <PriceLevel
            label="TP 2"
            value={result.take_profit_2}
            color="border-green-500/20 bg-green-500/[0.04] text-green-400"
            icon={Target}
          />
        )}
        {result.take_profit_3 > 0 && (
          <PriceLevel
            label="TP 3"
            value={result.take_profit_3}
            color="border-green-500/20 bg-green-500/[0.04] text-green-400"
            icon={Target}
          />
        )}
      </div>

      {/* Support / Resistance */}
      {(result.support_level > 0 || result.resistance_level > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {result.support_level > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">Support</p>
              <p className="font-bold text-blue-400">{result.support_level.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
            </div>
          )}
          {result.resistance_level > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">Resistance</p>
              <p className="font-bold text-orange-400">{result.resistance_level.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
            </div>
          )}
        </div>
      )}

      {/* Rationale */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
        <h3 className="text-sm font-medium text-white/60 mb-2">Analysis</h3>
        <p className="text-sm text-white/80 leading-relaxed">{result.rationale}</p>
      </div>

      {/* Indicators (collapsible) */}
      {result.indicators && result.indicators.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
          >
            <h3 className="text-sm font-medium text-white/60">Indicators</h3>
            {showIndicators ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showIndicators && (
            <div className="px-5 pb-5 space-y-2">
              {result.indicators.map((ind, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{ind.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80">{ind.value}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ind.signal === 'bullish' ? 'bg-green-500/10 text-green-400' :
                      ind.signal === 'bearish' ? 'bg-red-500/10 text-red-400' :
                      'bg-white/10 text-white/40'
                    }`}>{ind.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-white/25 text-center leading-relaxed">
        For educational purposes only. Not financial advice. Always do your own research.
        {remainingToday !== undefined && (
          <span className="block mt-1">
            {remainingToday} free {remainingToday === 1 ? 'analysis' : 'analyses'} remaining today.
          </span>
        )}
      </p>
    </div>
  )
}
