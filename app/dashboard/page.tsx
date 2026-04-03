'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import { Zap, History, Loader2, Crown, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Tab = 'analyze' | 'history'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('analyze')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState('free')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      supabase.from('profiles').select('plan,daily_analyses_used').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan)
            const limit = data.plan === 'free' ? 3 : 999999
            setRemaining(Math.max(0, limit - (data.daily_analyses_used || 0)))
          }
        })
    })
  }, [router])

  const handleFileSelect = (f: File, p: string) => {
    setFile(f); setPreview(p); setResult(null); setError(null)
  }

  const handleAnalyze = async () => {
    if (!file || loading) return
    setLoading(true); setError(null); setResult(null)
    const form = new FormData()
    form.append('image', file)
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(res.status === 429
          ? 'Daily limit reached. Upgrade to Pro for unlimited analyses.'
          : data.error || 'Analysis failed.')
        return
      }
      setResult(data.analysis)
      setRemaining(data.remainingToday)
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const TABS = [
    { id: 'analyze' as Tab, label: 'Analyze', icon: Zap },
    { id: 'history' as Tab, label: 'History', icon: History },
  ]

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative z-10">
        <Navbar plan={plan} remaining={remaining} />

        {/* Tab bar */}
        <div className="border-b border-white/[0.05] px-5">
          <div className="max-w-5xl mx-auto flex gap-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold rounded-t-lg border-b-2 transition-all duration-200 ${
                  tab === id
                    ? 'border-[#84cc16] text-[#84cc16]'
                    : 'border-transparent text-white/30 hover:text-white/50'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-8">
          {tab === 'history' ? <HistoryPanel /> : (
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Left */}
              <div className="space-y-4">
                <div>
                  <h1 className="font-display font-extrabold text-xl mb-1">Chart Analysis</h1>
                  <p className="text-sm text-white/35">Upload from TradingView, Binance, Bybit, or any platform</p>
                </div>

                <div className="relative">
                  <UploadZone
                    onFileSelect={handleFileSelect}
                    selectedFile={file} preview={preview}
                    onClear={() => { setFile(null); setPreview(null); setResult(null); setError(null) }}
                    disabled={loading}
                  />
                  {loading && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div className="scan-beam" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="glass border border-[#84cc16]/20 rounded-2xl px-5 py-3 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
                          <span className="text-sm font-display text-white/80">Osiris AI analyzing...</span>
                          <Loader2 className="w-4 h-4 text-[#84cc16] animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={handleAnalyze} disabled={!file || loading}
                  className="w-full relative overflow-hidden bg-[#84cc16] text-black font-display font-bold py-4 rounded-2xl text-lg hover:bg-[#a3e635] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(132,204,22,0.25)] group">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Analyzing chart...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" />Analyze with Osiris AI</>
                  )}
                </button>

                {error && (
                  <div className="glass border border-red-500/20 rounded-xl px-4 py-3">
                    <p className="text-sm text-red-400 font-display">{error}</p>
                    {error.includes('limit') && (
                      <a href="/pricing" className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#84cc16] hover:text-[#a3e635] font-display font-semibold">
                        <Crown className="w-3.5 h-3.5" />
                        Upgrade to Pro →
                      </a>
                    )}
                  </div>
                )}

                {plan === 'free' && remaining !== null && !error && (
                  <div className="flex items-center justify-between glass border border-white/[0.06] rounded-xl px-4 py-3">
                    <span className="text-sm text-white/40 font-display">
                      <span className="text-white/70 font-semibold">{remaining}</span> free {remaining === 1 ? 'analysis' : 'analyses'} left today
                    </span>
                    <a href="/pricing" className="text-xs text-[#84cc16] hover:text-[#a3e635] font-display font-semibold">Upgrade →</a>
                  </div>
                )}

                <p className="text-xs text-white/20 font-display flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#84cc16]/40" />
                  Gemini 2.0 Flash Vision → Claude Sonnet Osiris · ~8s
                </p>
              </div>

              {/* Right: Result */}
              <div>
                {result ? (
                  <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
                ) : (
                  <div className="h-full min-h-72 glass border border-white/[0.05] rounded-2xl flex flex-col items-center justify-center text-center p-12">
                    <div className="w-16 h-16 glass border border-white/[0.08] rounded-2xl flex items-center justify-center mb-5">
                      <Zap className="w-7 h-7 text-white/15" />
                    </div>
                    <p className="text-white/25 text-sm font-display leading-relaxed">
                      Upload a chart and click<br />
                      <span className="text-white/40">Analyze with Osiris AI</span><br />
                      to see signals here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
