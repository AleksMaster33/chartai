'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import { Zap, History, Loader2, Crown, Cpu, ScanLine } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [tab, setTab] = useState<'analyze'|'history'>('analyze')
  const [file, setFile] = useState<File|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult|null>(null)
  const [remaining, setRemaining] = useState<number|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [plan, setPlan] = useState('free')
  const router = useRouter()

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      sb.from('profiles').select('plan,daily_analyses_used').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan)
            setRemaining(data.plan === 'free' ? Math.max(0, 3 - (data.daily_analyses_used||0)) : null)
          }
        })
    })
  }, [router])

  const handleAnalyze = async () => {
    if (!file || loading) return
    setLoading(true); setError(null); setResult(null)
    const form = new FormData()
    form.append('image', file)
    try {
      const res = await fetch('/api/analyze', { method:'POST', body:form })
      const data = await res.json()
      if (!res.ok) {
        setError(res.status === 429 ? 'Daily limit reached. Upgrade to Pro for unlimited analyses.' : data.error || 'Analysis failed.')
        return
      }
      setResult(data.analysis)
      setRemaining(data.remainingToday)
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#060606]">
      <div className="fixed inset-0 line-grid opacity-25 pointer-events-none" />
      <div className="relative z-10">
        <Navbar plan={plan} remaining={remaining} />

        {/* Tab bar */}
        <div className="border-b border-white/[0.05]">
          <div className="max-w-5xl mx-auto px-5 flex gap-0">
            {([
              { id:'analyze', label:'Analyze', icon:Zap },
              { id:'history', label:'History', icon:History },
            ] as const).map(({ id, label, icon:Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-display font-semibold border-b-2 transition-all duration-150 ${
                  tab === id
                    ? 'border-[#84cc16] text-[#84cc16]'
                    : 'border-transparent text-white/25 hover:text-white/45'
                }`}>
                <Icon style={{width:'13px',height:'13px'}} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-7">
          {tab === 'history' ? <HistoryPanel /> : (
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Left: Upload */}
              <div className="space-y-4">
                <div>
                  <h1 className="font-display font-extrabold text-lg mb-1">Chart Analysis</h1>
                  <p className="text-xs text-white/30">Upload from TradingView, Binance, Bybit, or any other platform</p>
                </div>

                <div className="relative">
                  <UploadZone
                    onFileSelect={(f,p) => { setFile(f); setPreview(p); setResult(null); setError(null) }}
                    selectedFile={file} preview={preview}
                    onClear={() => { setFile(null); setPreview(null); setResult(null); setError(null) }}
                    disabled={loading}
                  />
                  {loading && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ border:'1px solid rgba(132,204,22,0.2)' }}>
                      <div className="scan-beam" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background:'rgba(0,0,0,0.55)' }}>
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background:'rgba(6,6,6,0.8)', border:'1px solid rgba(132,204,22,0.2)', backdropFilter:'blur(12px)' }}>
                          <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
                          <span className="text-[13px] font-display text-white/75">Osiris AI analyzing chart...</span>
                          <Loader2 className="w-3.5 h-3.5 text-[#84cc16] animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={handleAnalyze} disabled={!file || loading}
                  className="w-full flex items-center justify-center gap-2.5 font-display font-bold py-3.5 rounded-xl text-[15px] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{ background: file && !loading ? '#84cc16' : 'rgba(132,204,22,0.5)', color:'#000',
                    boxShadow: file && !loading ? '0 4px 24px rgba(132,204,22,0.2)' : 'none' }}>
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>
                    : <><ScanLine className="w-4 h-4" />Analyze with Osiris AI</>
                  }
                </button>

                {error && (
                  <div className="rounded-xl px-4 py-3" style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-sm text-red-400 font-display">{error}</p>
                    {error.includes('limit') && (
                      <a href="/pricing" className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-[#84cc16] font-display font-bold">
                        <Crown style={{width:'11px',height:'11px'}} /> Upgrade to Pro →
                      </a>
                    )}
                  </div>
                )}

                {plan === 'free' && remaining !== null && !error && (
                  <div className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs text-white/35 font-display">
                      <span className="text-white/60 font-semibold">{remaining}</span> free {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                    </span>
                    <a href="/pricing" className="text-[11px] text-[#84cc16] font-display font-bold hover:text-[#a3e635]">Upgrade →</a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-white/15 font-display">
                  <Cpu style={{width:'11px',height:'11px'}} className="text-[#84cc16]/30" />
                  Gemini 2.0 Flash Vision → Claude Sonnet Osiris · avg ~8s
                </div>
              </div>

              {/* Right: Result */}
              <div>
                {result ? (
                  <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
                ) : (
                  <div className="h-full min-h-80 rounded-2xl flex flex-col items-center justify-center text-center p-12"
                    style={{ background:'rgba(255,255,255,0.015)', border:'1px dashed rgba(255,255,255,0.05)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                      <Zap className="w-6 h-6 text-white/12" />
                    </div>
                    <p className="text-xs text-white/20 font-display leading-relaxed">
                      Upload a chart and click<br />
                      <span className="text-white/35">Analyze with Osiris AI</span><br />
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
