'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import { Loader2, Zap, History } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Tab = 'analyze' | 'history'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('analyze')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>('free')
  const [scanY, setScanY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
      else {
        supabase.from('profiles').select('plan, daily_analyses_used').eq('id', user.id).single()
          .then(({ data }) => {
            if (data) {
              setPlan(data.plan)
              const limit = data.plan === 'free' ? 3 : 999
              setRemaining(Math.max(0, limit - (data.daily_analyses_used || 0)))
            }
          })
      }
    })
  }, [router])

  // Scanning animation during analysis
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => setScanY(y => (y + 2) % 100), 16)
    return () => clearInterval(interval)
  }, [loading])

  const handleFileSelect = (f: File, p: string) => {
    setFile(f)
    setPreview(p)
    setResult(null)
    setError(null)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError('Daily limit reached. Upgrade to Pro for unlimited analyses.')
        } else {
          setError(data.error || 'Analysis failed. Please try again.')
        }
        return
      }

      setResult(data.analysis)
      setRemaining(data.remainingToday)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar plan={plan} remaining={remaining} />

      {/* Tabs */}
      <div className="border-b border-white/[0.06] px-4">
        <div className="max-w-5xl mx-auto flex gap-1 pt-2">
          {([
            { id: 'analyze', label: 'Analyze', icon: Zap },
            { id: 'history', label: 'History', icon: History },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                tab === id
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'history' ? (
          <HistoryPanel />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Upload */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">Chart Analysis</h1>
                <p className="text-sm text-white/40">Upload a screenshot from TradingView, Binance, or any other platform</p>
              </div>

              {/* Upload zone with scan animation overlay */}
              <div className="relative">
                <UploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  preview={preview}
                  onClear={handleClear}
                  disabled={loading}
                />
                {loading && preview && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-80 scan-line"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-lime-400 animate-spin" />
                        <span className="text-sm text-white/80">AI analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full bg-lime-400 text-black font-semibold py-4 rounded-xl hover:bg-lime-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with Osiris AI...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Chart
                  </>
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                  {error.includes('Upgrade') && (
                    <a href="/pricing" className="ml-2 underline hover:text-red-300">View plans →</a>
                  )}
                </div>
              )}

              {/* Free tier notice */}
              {plan === 'free' && remaining !== null && !error && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    <span className="text-white/80 font-medium">{remaining}</span> free {remaining === 1 ? 'analysis' : 'analyses'} left today
                  </span>
                  <a href="/pricing" className="text-xs text-lime-400 hover:text-lime-300 transition-colors">
                    Upgrade →
                  </a>
                </div>
              )}

              {/* Pipeline info */}
              <div className="text-xs text-white/25 flex items-center gap-4">
                <span>⚡ Gemini Vision → Claude Osiris</span>
                <span>· avg ~8s</span>
              </div>
            </div>

            {/* Right: Result */}
            <div>
              {result ? (
                <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
              ) : (
                <div className="h-full min-h-64 flex flex-col items-center justify-center border border-dashed border-white/[0.06] rounded-2xl text-center p-10">
                  <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm">
                    Upload a chart and click Analyze<br />to see AI signals here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
