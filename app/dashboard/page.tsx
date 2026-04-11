'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import { Zap, History, Loader2, Crown, Cpu, ScanLine, AlertCircle, Check, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const G    = '#00FF88'
const GLOW = 'rgba(0,255,136,0.20)'

/* ── Paywall overlay shown to free/unsubscribed users ──────── */
function PaywallGate() {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
      style={{
        maxWidth:680, margin:'60px auto', padding:'0 24px',
        display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      }}
    >
      {/* icon */}
      <div style={{
        width:64, height:64, borderRadius:18, marginBottom:24,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.20)',
      }}>
        <ScanLine style={{ width:28, height:28, color:G }} />
      </div>

      <h2 style={{ fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:12 }}>
        Subscription required
      </h2>
      <p style={{ fontSize:14, color:'rgba(232,237,245,0.40)', lineHeight:1.7, maxWidth:440, marginBottom:40 }}>
        Choose a plan to unlock the Osiris AI engine, real-time market scanner,
        and full signal breakdowns with entry, stop-loss and take-profit levels.
      </p>

      {/* plan cards */}
      <div className="paywall-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, width:'100%', marginBottom:32 }}>

        {/* Basic */}
        <Link href="/pricing" style={{ textDecoration:'none' }}>
          <div style={{
            padding:'20px 16px', borderRadius:14, cursor:'pointer',
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
            transition:'border-color 0.15s',
            display:'flex', flexDirection:'column', gap:8,
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <Zap style={{ width:18, height:18, color:'rgba(232,237,245,0.40)', marginBottom:4 }} />
            <p style={{ fontSize:11, fontWeight:700, color:'rgba(232,237,245,0.35)', textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>Basic</p>
            <p style={{ fontSize:'1.5rem', fontWeight:800, color:'#E8EDF5', margin:0 }}>$19.99</p>
            <p style={{ fontSize:11, color:'rgba(232,237,245,0.30)', margin:0 }}>/month</p>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
              {['3 analyses/day', 'Market scanner', 'Full signal breakdown'].map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Check style={{ width:11, height:11, color:'rgba(255,255,255,0.30)', flexShrink:0 }} />
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.45)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Pro — highlighted */}
        <Link href="/pricing" style={{ textDecoration:'none' }}>
          <div style={{
            padding:'20px 16px', borderRadius:14, cursor:'pointer', position:'relative',
            background:'rgba(0,255,136,0.05)', border:`1px solid rgba(0,255,136,0.25)`,
            boxShadow:`0 0 24px rgba(0,255,136,0.08)`,
            display:'flex', flexDirection:'column', gap:8,
          }}>
            <div style={{
              position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
              fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:999,
              background:G, color:'#000', whiteSpace:'nowrap',
            }}>Most Popular</div>
            <Crown style={{ width:18, height:18, color:G, marginBottom:4 }} />
            <p style={{ fontSize:11, fontWeight:700, color:'rgba(0,255,136,0.70)', textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>Pro</p>
            <p style={{ fontSize:'1.5rem', fontWeight:800, color:'#E8EDF5', margin:0 }}>$44.90</p>
            <p style={{ fontSize:11, color:'rgba(232,237,245,0.30)', margin:0 }}>/month</p>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
              {['10 analyses/day', 'Market scanner', 'Unlimited history'].map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Check style={{ width:11, height:11, color:`rgba(0,255,136,0.60)`, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.55)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Unlimited */}
        <Link href="/pricing" style={{ textDecoration:'none' }}>
          <div style={{
            padding:'20px 16px', borderRadius:14, cursor:'pointer',
            background:'rgba(139,92,246,0.05)', border:'1px solid rgba(139,92,246,0.18)',
            transition:'border-color 0.15s',
            display:'flex', flexDirection:'column', gap:8,
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.18)')}
          >
            <Rocket style={{ width:18, height:18, color:'#a78bfa', marginBottom:4 }} />
            <p style={{ fontSize:11, fontWeight:700, color:'rgba(167,139,250,0.70)', textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>Unlimited</p>
            <p style={{ fontSize:'1.5rem', fontWeight:800, color:'#E8EDF5', margin:0 }}>$125</p>
            <p style={{ fontSize:11, color:'rgba(232,237,245,0.30)', margin:0 }}>/month</p>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
              {['50 analyses/day', 'Priority speed', 'Swing analysis'].map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Check style={{ width:11, height:11, color:'rgba(167,139,250,0.50)', flexShrink:0 }} />
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.45)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <Link href="/pricing" style={{
        display:'inline-flex', alignItems:'center', gap:8,
        padding:'14px 36px', borderRadius:12,
        background:G, color:'#000', fontWeight:700, fontSize:15,
        textDecoration:'none',
        boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 8px 28px ${GLOW}`,
      }}>
        <Crown style={{ width:16, height:16 }} />
        View Plans & Subscribe
      </Link>
      <p style={{ marginTop:12, fontSize:11, color:'rgba(232,237,245,0.22)' }}>
        Cancel anytime · No hidden fees
      </p>
    </motion.div>
  )
}

/* ── Main dashboard ────────────────────────────────────────── */
export default function DashboardPage() {
  const [tab, setTab]           = useState<'analyze' | 'history'>('analyze')
  const [file, setFile]         = useState<File | null>(null)
  const [preview, setPreview]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<AnalysisResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [plan, setPlan]         = useState('free')
  const [loaded, setLoaded]     = useState(false)
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
            if (data.plan !== 'free') {
              const limit = data.plan === 'basic' ? 3 : data.plan === 'pro' ? 10 : null
              setRemaining(limit ? Math.max(0, limit - (data.daily_analyses_used || 0)) : null)
            }
          }
          setLoaded(true)
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
        setError(res.status === 403
          ? 'Subscription required. Choose a plan to start analyzing.'
          : res.status === 429
          ? 'Daily limit reached. Upgrade your plan for more analyses.'
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

        {/* loading spinner */}
        {!loaded && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 0' }}>
            <Loader2 style={{ width:24, height:24, color:G }} className="animate-spin" />
          </div>
        )}

        {/* paywall for free users */}
        {loaded && plan === 'free' && <PaywallGate />}

        {/* full dashboard for paid users */}
        {loaded && plan !== 'free' && (
          <>
            {/* ── TAB BAR ── */}
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

            {/* ── CONTENT ── */}
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
                    className="dash-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}
                  >
                    {/* LEFT: upload + controls */}
                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                      <div>
                        <h1 style={{ fontSize:'1.25rem', fontWeight:800, letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:4 }}>
                          Chart Analysis
                        </h1>
                        <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)' }}>
                          Upload from TradingView, Binance, Bybit, or any platform
                        </p>
                      </div>

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
                        }}>
                        {loading
                          ? <><Loader2 style={{ width:16, height:16 }} className="animate-spin" />Analyzing…</>
                          : <><ScanLine style={{ width:16, height:16 }} />Analyze with Osiris AI</>}
                      </button>

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
                              {(error.includes('limit') || error.includes('Subscription')) && (
                                <a href="/pricing" style={{
                                  display:'inline-flex', alignItems:'center', gap:5, marginTop:6,
                                  fontSize:11, fontWeight:700, color:G, textDecoration:'none',
                                }}>
                                  <Crown style={{ width:11, height:11 }} />
                                  View plans →
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {remaining !== null && !error && (
                        <div style={{
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          borderRadius:12, padding:'10px 16px',
                          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
                        }}>
                          <span style={{ fontSize:12, color:'rgba(232,237,245,0.32)' }}>
                            <span style={{ fontWeight:600, color:'rgba(232,237,245,0.58)' }}>{remaining}</span>{' '}
                            {remaining === 1 ? 'analysis' : 'analyses'} remaining today
                          </span>
                          <a href="/pricing" style={{ fontSize:11, fontWeight:700, color:G, textDecoration:'none' }}>
                            Upgrade →
                          </a>
                        </div>
                      )}

                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(232,237,245,0.18)' }}>
                        <Cpu style={{ width:11, height:11, color:'rgba(0,255,136,0.35)' }} />
                        Gemini 2.0 Flash Vision → Claude Sonnet Osiris · avg ~8s
                      </div>
                    </div>

                    {/* RIGHT: result or empty state */}
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
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .paywall-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
