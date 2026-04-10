'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/UploadZone'
import { AnalysisResultCard } from '@/components/AnalysisResultCard'
import { Navbar } from '@/components/Navbar'
import type { AnalysisResult } from '@/lib/ai/analyze'
import {
  ScanLine, Loader2, Crown, Cpu, AlertCircle, ExternalLink,
  TrendingUp, TrendingDown, Minus, ArrowLeft, Zap,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const G     = '#00FF88'
const RED   = '#FF3B5C'
const AMBER = '#FFB800'

function AnalyzeInner() {
  const params   = useSearchParams()
  const router   = useRouter()
  const coin     = params.get('coin')      ?? ''
  const dirParam = params.get('direction') ?? ''

  const baseAsset = coin.replace(/USDT$/i, '')
  const direction = ['LONG','SHORT','NEUTRAL'].includes(dirParam)
    ? dirParam as 'LONG' | 'SHORT' | 'NEUTRAL'
    : null

  const [file, setFile]           = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<AnalysisResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [plan, setPlan]           = useState('free')

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      sb.from('profiles').select('plan,daily_analyses_used').eq('id', user.id).single()
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
      const res  = await fetch('/api/analyze', { method:'POST', body:form })
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

  const dirColor =
    direction === 'LONG'    ? G     :
    direction === 'SHORT'   ? RED   :
    direction === 'NEUTRAL' ? AMBER : 'rgba(255,255,255,0.40)'

  const tvUrl = coin ? `https://www.tradingview.com/chart/?symbol=BINANCE:${coin}` : null

  return (
    <div className="analyze-container" style={{ maxWidth:'64rem', margin:'0 auto', padding:'28px 24px' }}>

      {/* back + heading */}
      <div style={{ marginBottom:24 }}>
        <button
          onClick={() => router.push('/dashboard/discover')}
          style={{
            display:'flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer',
            color:'rgba(255,255,255,0.30)', background:'none', border:'none', marginBottom:16,
            transition:'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
        >
          <ArrowLeft style={{ width:13, height:13 }} /> Back to Discovery
        </button>

        {coin && (
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.35 }}
            style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8, flexWrap:'wrap' }}>

            <div style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:16,
              background:`${dirColor}0a`, border:`1px solid ${dirColor}28`,
            }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <span style={{ fontWeight:800, fontSize:'1.25rem', color:'#E8EDF5' }}>{baseAsset}</span>
                  <span style={{
                    fontSize:11, color:'rgba(255,255,255,0.30)',
                    background:'rgba(255,255,255,0.04)', padding:'2px 8px', borderRadius:4,
                  }}>USDT</span>
                </div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.30)' }}>
                  From Osiris Discovery — pre-screened setup
                </p>
              </div>

              {direction && (
                <div style={{
                  display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:10,
                  fontWeight:700, fontSize:13, marginLeft:16,
                  background:`${dirColor}14`, border:`1px solid ${dirColor}33`, color:dirColor,
                }}>
                  {direction === 'LONG'    && <TrendingUp    style={{ width:14, height:14 }} />}
                  {direction === 'SHORT'   && <TrendingDown  style={{ width:14, height:14 }} />}
                  {direction === 'NEUTRAL' && <Minus         style={{ width:14, height:14 }} />}
                  {direction}
                </div>
              )}
            </div>

            {tvUrl && (
              <a
                href={tvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:12,
                  fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.45)', textDecoration:'none',
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                  transition:'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                <ExternalLink style={{ width:13, height:13 }} />
                Open on TradingView
              </a>
            )}
          </motion.div>
        )}

        {!coin && (
          <div>
            <h1 style={{ fontSize:'1.125rem', fontWeight:800, color:'#E8EDF5', marginBottom:4 }}>
              Chart Analysis
            </h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.30)' }}>
              Upload from TradingView, Binance, Bybit, or any platform
            </p>
          </div>
        )}

        {coin && (
          <p style={{ fontSize:13, color:'rgba(232,237,245,0.35)' }}>
            Open {baseAsset}/USDT on TradingView, take a screenshot and upload it below
            {direction ? ` to confirm the ${direction} setup.` : '.'}
          </p>
        )}
      </div>

      <div className="analyze-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* ── LEFT: upload ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

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
                    position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(0,0,0,0.60)', backdropFilter:'blur(4px)',
                  }}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderRadius:16,
                      background:'rgba(8,11,16,0.95)', border:'1px solid rgba(0,255,136,0.20)', backdropFilter:'blur(16px)',
                    }}>
                      <span style={{
                        width:8, height:8, borderRadius:'50%', background:G, flexShrink:0,
                        animation:'blink 0.8s ease-in-out infinite',
                      }} />
                      <span style={{ fontSize:13, color:'rgba(232,237,245,0.70)' }}>
                        {coin ? `Analyzing ${baseAsset}…` : 'Osiris AI analyzing…'}
                      </span>
                      <Loader2 style={{ width:13, height:13, color:G }} className="animate-spin" />
                    </div>
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
              padding:'14px 0', borderRadius:12, fontSize:15, fontWeight:700, cursor: file && !loading ? 'pointer' : 'not-allowed',
              background: file && !loading ? G : 'rgba(0,255,136,0.20)',
              color:'#000', border:'none',
              opacity: !file ? 0.38 : 1,
              boxShadow: file && !loading ? '0 4px 20px rgba(0,255,136,0.22)' : 'none',
              transition:'all 0.15s',
            }}>
            {loading
              ? <><Loader2 style={{ width:16, height:16 }} className="animate-spin" />Analyzing…</>
              : <><ScanLine style={{ width:16, height:16 }} />Analyze with Osiris AI</>}
          </button>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
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

          {/* remaining */}
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

        {/* ── RIGHT: result ── */}
        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result"
                initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}>
                <AnalysisResultCard result={result} remainingToday={remaining ?? undefined} />
              </motion.div>
            ) : (
              <motion.div key="empty"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{
                  minHeight:320, borderRadius:16,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  textAlign:'center', padding:'48px 32px',
                  background:'rgba(255,255,255,0.015)', border:'1.5px dashed rgba(255,255,255,0.06)',
                }}>
                <div style={{
                  width:56, height:56, borderRadius:14, marginBottom:20,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                }}>
                  <Zap style={{ width:22, height:22, color:'rgba(232,237,245,0.12)' }} />
                </div>
                <p style={{ fontSize:13, color:'rgba(232,237,245,0.22)', lineHeight:1.65, margin:0 }}>
                  {coin
                    ? <>Open <span style={{ color:'rgba(232,237,245,0.42)', fontWeight:600 }}>{baseAsset}/USDT</span> on TradingView,<br />screenshot the chart and upload it</>
                    : <>Upload a chart and click<br /><span style={{ color:'rgba(232,237,245,0.42)', fontWeight:600 }}>Analyze with Osiris AI</span><br />to see your signal here</>}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  const [plan, setPlan]           = useState('free')
  const [remaining, setRemaining] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      sb.from('profiles').select('plan,daily_analyses_used').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan)
            setRemaining(data.plan === 'free' ? Math.max(0, 3 - (data.daily_analyses_used || 0)) : null)
          }
        })
    })
  }, [router])

  return (
    <div style={{ minHeight:'100vh', background:'#080B10', color:'#E8EDF5' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
      </div>
      <div style={{ position:'relative', zIndex:1 }}>
        <Navbar plan={plan} remaining={remaining} />
        <Suspense fallback={
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'96px 0' }}>
            <Loader2 style={{ width:24, height:24, color:G }} className="animate-spin" />
          </div>
        }>
          <AnalyzeInner />
        </Suspense>
      </div>
      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media (max-width: 768px) {
          .analyze-grid { grid-template-columns: 1fr !important; }
          .analyze-container { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
