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

const G    = '#00FF88'
const GLOW = 'rgba(0,255,136,0.20)'

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
    <div style={{ minHeight:'100vh', background:'#080B10', color:'#E8EDF5' }}>

      {/* bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div style={{
          position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:600, height:400,
          background:'radial-gradient(ellipse at top, rgba(0,255,136,0.04) 0%, transparent 60%)',
        }} />
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        <Navbar plan={plan} remaining={remaining} />

        {/* ── TAB BAR ─────────────────────────────────── */}
        <div style={{
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'rgba(8,11,16,0.70)', backdropFilter:'blur(12px)',
        }}>
          <div style={{ maxWidth:'80rem', margin:'0 auto', padding:'0 24px', display:'flex' }}>
            {([
              { id:'analyze' as const, label:'Analyze', icon:Zap },
              { id:'history' as const, label:'History',  icon:History },
            ]).map(({ id, label, icon:Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                position:'relative', display:'flex', alignItems:'center', gap:6,
                padding:'14px 20px', fontSize:12, fontWeight:600, cursor:'pointer',
                background:'none', border:'none',
                color: tab === id ? G : 'rgba(232,237,245,0.28)',
                transition:'color 0.15s',
              }}>
                <Icon style={{ width:13, height:13 }} />
                {label}
                {tab === id && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position:'absolute', bottom:0, left:0, right:0, height:2,
                      borderRadius:'2px 2px 0 0', background:G,
                    }}
                    transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ─────────────────────────────────── */}
        <div style={{ maxWidth:'80rem', margin:'0 auto', padding:'32px 24px' }}>
          <AnimatePresence mode="wait">

            {tab === 'history' ? (
              <motion.div key="history"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.25 }}>
                <HistoryPanel />
              </motion.div>
            ) : (
              <motion.div key="analyze"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.25 }}
                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}
              >

                {/* ── LEFT: upload + controls ── */}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                  {/* heading */}
                  <div>
                    <h1 style={{ fontSize:'1.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:4 }}>
                      Chart Analysis
                    </h1>
                    <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)' }}>
                      Upload from TradingView, Binance, Bybit, or any platform
                    </p>
                  </div>

                  {/* upload zone with loading overlay */}
                  <div style={{ position:'relative' }}>
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
                          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                          style={{
                            position:'absolute', inset:0, borderRadius:16, overflow:'hidden',
                            border:'1px solid rgba(0,255,136,0.20)',
                          }}>
                          <div className="scan-beam" />
                          <div style={{
                            position:'absolute', inset:0,
                            background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                          }}>
                            <motion.div
                              initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                              style={{
                                display:'flex', alignItems:'center', gap:10,
                                padding:'12px 20px', borderRadius:12,
                                background:'rgba(8,11,16,0.95)', backdropFilter:'blur(16px)',
                                border:'1px solid rgba(0,255,136,0.18)',
                              }}>
                              <span style={{
                                width:8, height:8, borderRadius:'50%', background:G, flexShrink:0,
                                animation:'blink 0.8s ease-in-out infinite',
                              }} />
                              <span style={{ fontSize:13, color:'rgba(232,237,245,0.70)' }}>Osiris AI analyzing…</span>
                              <Loader2 style={{ width:14, height:14, color:G }} className="animate-spin" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* analyze button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      padding:'14px 0', borderRadius:12, fontSize:15, fontWeight:700,
                      cursor: file && !loading ? 'pointer' : 'not-allowed',
                      background: file && !loading ? G : 'rgba(0,255,136,0.20)',
                      color:'#000', border:'none',
                      opacity: !file ? 0.38 : 1,
                      boxShadow: file && !loading ? `0 4px 20px ${GLOW}` : 'none',
                      transition:'all 0.15s',
                    }}
                  >
                    {loading
                      ? <><Loader2 style={{ width:16, height:16 }} className="animate-spin" />Analyzing…</>
                      : <><ScanLine style={{ width:16, height:16 }} />Analyze with Osiris AI</>
                    }
                  </button>

                  {/* error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                        style={{
                          borderRadius:12, padding:'12px 16px',
                          display:'flex', alignItems:'flex-start', gap:10,
                          background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)',
                        }}>
                        <AlertCircle style={{ width:15, height:15, color:'#f87171', marginTop:1, flexShrink:0 }} />
                        <div>
                          <p style={{ fontSize:13, color:'#f87171', margin:0 }}>{error}</p>
                          {error.includes('limit') && (
                            <a href="/pricing" style={{
                              display:'inline-flex', alignItems:'center', gap:5, marginTop:6,
                              fontSize:11, fontWeight:700, color:G, textDecoration:'none',
                            }}>
                              <Crown style={{ width:11, height:11 }} />
                              Upgrade to Pro →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* remaining analyses */}
                  {plan === 'free' && remaining !== null && !error && (
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      borderRadius:12, padding:'10px 16px',
                      background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
                    }}>
                      <span style={{ fontSize:12, color:'rgba(232,237,245,0.32)' }}>
                        <span style={{ fontWeight:600, color:'rgba(232,237,245,0.58)' }}>{remaining}</span>{' '}
                        free {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                      </span>
                      <a href="/pricing" style={{
                        fontSize:11, fontWeight:700, color:G, textDecoration:'none',
                      }}>
                        Upgrade →
                      </a>
                    </div>
                  )}

                  {/* pipeline info */}
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(232,237,245,0.18)' }}>
                    <Cpu style={{ width:11, height:11, color:'rgba(0,255,136,0.35)' }} />
                    Gemini 2.0 Flash Vision → Claude Sonnet Osiris · avg ~8s
                  </div>
                </div>

                {/* ── RIGHT: result or empty state ── */}
                <div>
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="result"
                        initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                        transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}>
                        <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
                      </motion.div>
                    ) : (
                      <motion.div key="empty"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{
                          minHeight:320, borderRadius:16,
                          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                          textAlign:'center', padding:'48px 32px',
                          background:'rgba(255,255,255,0.015)',
                          border:'1.5px dashed rgba(255,255,255,0.06)',
                        }}>
                        <div style={{
                          width:52, height:52, borderRadius:14, marginBottom:16,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                        }}>
                          <Zap style={{ width:22, height:22, color:'rgba(232,237,245,0.12)' }} />
                        </div>
                        <p style={{ fontSize:13, color:'rgba(232,237,245,0.22)', lineHeight:1.65, margin:0 }}>
                          Upload a chart and click<br />
                          <span style={{ color:'rgba(232,237,245,0.42)', fontWeight:600 }}>Analyze with Osiris AI</span><br />
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
