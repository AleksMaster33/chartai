'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import { Zap, History, Loader2, Crown, Cpu, ScanLine, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const LIME = '#84cc16'

export default function DashboardPage() {
  const [tab, setTab] = useState<'analyze' | 'history'>('analyze')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState('free')
  const router = useRouter()

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      sb.from('profiles')
        .select('plan,daily_analyses_used')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan)
            setRemaining(data.plan === 'free' ? Math.max(0, 3 - (data.daily_analyses_used || 0)) : null)
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
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090909]">

      {/* bg grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
      </div>

      <div className="relative z-10">
        <Navbar plan={plan} remaining={remaining} />

        {/* tab bar */}
        <div className="border-b border-white/[0.05]"
          style={{ background:'rgba(9,9,9,0.6)', backdropFilter:'blur(12px)' }}>
          <div className="max-w-5xl mx-auto px-5 flex">
            {([
              { id:'analyze', label:'Analyze', icon:Zap },
              { id:'history', label:'History', icon:History },
            ] as const).map(({ id, label, icon:Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-xs font-display font-semibold transition-all duration-150 ${
                  tab === id
                    ? 'text-[#84cc16]'
                    : 'text-white/25 hover:text-white/45'
                }`}>
                <Icon style={{ width:13, height:13 }} />
                {label}
                {tab === id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                    style={{ background:LIME }}
                    transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="max-w-5xl mx-auto px-5 py-7">
          <AnimatePresence mode="wait">
            {tab === 'history' ? (
              <motion.div key="history"
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.3 }}>
                <HistoryPanel />
              </motion.div>
            ) : (
              <motion.div key="analyze"
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.3 }}
                className="grid lg:grid-cols-2 gap-6">

                {/* ── LEFT: upload ── */}
                <div className="space-y-4">
                  <div>
                    <h1 className="font-display font-extrabold text-lg mb-1">Chart Analysis</h1>
                    <p className="text-xs text-white/30">
                      Upload from TradingView, Binance, Bybit, or any platform
                    </p>
                  </div>

                  {/* upload zone with loading overlay */}
                  <div className="relative">
                    <UploadZone
                      onFileSelect={(f, p) => { setFile(f); setPreview(p); setResult(null); setError(null) }}
                      selectedFile={file}
                      preview={preview}
                      onClear={() => { setFile(null); setPreview(null); setResult(null); setError(null) }}
                      disabled={loading}
                    />

                    <AnimatePresence>
                      {loading && (
                        <motion.div
                          initial={{ opacity:0 }}
                          animate={{ opacity:1 }}
                          exit={{ opacity:0 }}
                          className="absolute inset-0 rounded-2xl overflow-hidden"
                          style={{ border:'1px solid rgba(132,204,22,0.2)' }}>
                          {/* scan beam */}
                          <div className="scan-beam" />
                          <div className="absolute inset-0 flex items-center justify-center"
                            style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
                            <motion.div
                              initial={{ scale:0.9, opacity:0 }}
                              animate={{ scale:1, opacity:1 }}
                              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                              style={{
                                background:'rgba(9,9,9,0.9)',
                                border:'1px solid rgba(132,204,22,0.2)',
                                backdropFilter:'blur(16px)',
                              }}>
                              <div className="w-2 h-2 rounded-full bg-[#84cc16]"
                                style={{ animation:'blink 0.8s ease-in-out infinite' }} />
                              <span className="text-[13px] font-display text-white/70">Osiris AI analyzing…</span>
                              <Loader2 className="w-3.5 h-3.5 text-[#84cc16] animate-spin" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* analyze button */}
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    whileHover={file && !loading ? { y:-2 } : {}}
                    whileTap={file && !loading ? { scale:0.98 } : {}}
                    className="w-full flex items-center justify-center gap-2.5 font-display font-bold py-3.5 rounded-xl text-[15px] transition-all duration-200 disabled:cursor-not-allowed"
                    style={{
                      background: file && !loading ? LIME : 'rgba(132,204,22,0.25)',
                      color: '#000',
                      opacity: !file ? 0.35 : 1,
                      boxShadow: file && !loading ? '0 4px 20px rgba(132,204,22,0.22)' : 'none',
                    }}>
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</>
                      : <><ScanLine className="w-4 h-4" />Analyze with Osiris AI</>}
                  </motion.button>

                  {/* error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                        className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                        style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)' }}>
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
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

                  {/* remaining analyses */}
                  {plan === 'free' && remaining !== null && !error && (
                    <div className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.055)' }}>
                      <span className="text-xs text-white/30 font-display">
                        <span className="text-white/55 font-semibold">{remaining}</span>{' '}
                        free {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                      </span>
                      <a href="/pricing" className="text-[11px] font-display font-bold transition-colors hover:text-[#a3e635]"
                        style={{ color:LIME }}>
                        Upgrade →
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-white/15 font-display">
                    <Cpu style={{ width:11, height:11, color:`${LIME}44` }} className="opacity-60" />
                    <span>Gemini 2.0 Flash Vision → Claude Sonnet Osiris · avg ~8s</span>
                  </div>
                </div>

                {/* ── RIGHT: result ── */}
                <div>
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="result"
                        initial={{ opacity:0, x:16 }}
                        animate={{ opacity:1, x:0 }}
                        exit={{ opacity:0, x:16 }}
                        transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}>
                        <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
                      </motion.div>
                    ) : (
                      <motion.div key="empty"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="h-full min-h-80 rounded-2xl flex flex-col items-center justify-center text-center p-12"
                        style={{ background:'rgba(255,255,255,0.015)', border:'1.5px dashed rgba(255,255,255,0.05)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                          <Zap className="w-6 h-6 text-white/10" />
                        </div>
                        <p className="text-xs text-white/20 font-display leading-relaxed">
                          Upload a chart and click<br />
                          <span className="text-white/35 font-semibold">Analyze with Osiris AI</span><br />
                          to see your signal here
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  )
}
