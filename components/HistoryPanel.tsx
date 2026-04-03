'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, Minus, Clock, ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'

interface Analysis {
  id: string
  ticker: string
  timeframe: string
  signal: 'LONG' | 'SHORT' | 'NEUTRAL'
  confidence: number
  entry_price: number
  take_profit_1: number
  stop_loss: number
  rationale: string
  created_at: string
}

function SignalIcon({ signal }: { signal: 'LONG' | 'SHORT' | 'NEUTRAL' }) {
  if (signal === 'LONG') return <TrendingUp className="w-4 h-4 text-green-400" />
  if (signal === 'SHORT') return <TrendingDown className="w-4 h-4 text-red-400" />
  return <Minus className="w-4 h-4 text-yellow-400" />
}

export function HistoryPanel() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('free')
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      if (profile) setPlan(profile.plan)

      if (profile?.plan === 'free') {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      setAnalyses(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (plan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-5">
          <Lock className="w-7 h-7 text-white/20" />
        </div>
        <h2 className="text-lg font-semibold mb-2">History is a Pro feature</h2>
        <p className="text-white/40 text-sm mb-6 max-w-xs">
          Upgrade to Pro to access your full analysis history and track your performance over time.
        </p>
        <Link
          href="/pricing"
          className="bg-lime-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-lime-300 transition-colors"
        >
          Upgrade to Pro — €12/mo
        </Link>
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">No analyses yet. Go to the Analyze tab to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Analysis History</h2>
        <span className="text-sm text-white/40">{analyses.length} analyses</span>
      </div>

      {analyses.map((a) => (
        <div
          key={a.id}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                a.signal === 'LONG' ? 'bg-green-500/10' :
                a.signal === 'SHORT' ? 'bg-red-500/10' :
                'bg-yellow-500/10'
              }`}>
                <SignalIcon signal={a.signal} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.ticker || 'CHART'}</span>
                  <span className="text-xs text-white/30 bg-white/[0.05] px-1.5 py-0.5 rounded">{a.timeframe}</span>
                  <span className={`text-xs font-medium ${
                    a.signal === 'LONG' ? 'text-green-400' :
                    a.signal === 'SHORT' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>{a.signal}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-white/30">
                    Confidence: <span className="text-white/50">{a.confidence}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-white/30 mb-0.5">Entry</p>
                <p className="text-sm font-medium tabular-nums">
                  {a.entry_price > 0 ? a.entry_price.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
          </div>

          {a.rationale && (
            <p className="text-xs text-white/30 mt-3 line-clamp-2 leading-relaxed">{a.rationale}</p>
          )}
        </div>
      ))}
    </div>
  )
}
