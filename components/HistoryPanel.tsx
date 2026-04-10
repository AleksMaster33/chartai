'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, Minus, Clock, ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'

const G     = '#00FF88'
const RED   = '#FF3B5C'
const AMBER = '#FFB800'

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
  if (signal === 'LONG')  return <TrendingUp   style={{ width:16, height:16, color:G }}     />
  if (signal === 'SHORT') return <TrendingDown style={{ width:16, height:16, color:RED }}   />
  return                         <Minus        style={{ width:16, height:16, color:AMBER }} />
}

function signalColor(s: string) {
  if (s === 'LONG')  return G
  if (s === 'SHORT') return RED
  return AMBER
}

function signalBg(s: string) {
  if (s === 'LONG')  return 'rgba(0,255,136,0.08)'
  if (s === 'SHORT') return 'rgba(255,59,92,0.08)'
  return 'rgba(255,184,0,0.08)'
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
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 0' }}>
        <div style={{
          width:24, height:24, borderRadius:'50%',
          border:`2px solid ${G}`, borderTopColor:'transparent',
          animation:'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (plan === 'free') {
    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'80px 0', textAlign:'center',
      }}>
        <div style={{
          width:64, height:64, borderRadius:16, marginBottom:20,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
        }}>
          <Lock style={{ width:28, height:28, color:'rgba(255,255,255,0.20)' }} />
        </div>
        <h2 style={{ fontSize:'1.125rem', fontWeight:700, marginBottom:8, color:'#E8EDF5' }}>
          History is a Pro feature
        </h2>
        <p style={{ fontSize:13, color:'rgba(232,237,245,0.40)', lineHeight:1.65, marginBottom:24, maxWidth:280 }}>
          Upgrade to Pro to access your full analysis history and track your performance over time.
        </p>
        <Link href="/pricing" style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          padding:'12px 24px', borderRadius:12,
          background:G, color:'#000', fontSize:14, fontWeight:700, textDecoration:'none',
        }}>
          Upgrade to Pro — €12/mo
        </Link>
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'80px 0' }}>
        <p style={{ color:'rgba(232,237,245,0.40)', fontSize:14 }}>
          No analyses yet. Go to the Analyze tab to get started.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <h2 style={{ fontSize:'1.125rem', fontWeight:700, color:'#E8EDF5' }}>Analysis History</h2>
        <span style={{ fontSize:13, color:'rgba(232,237,245,0.40)' }}>{analyses.length} analyses</span>
      </div>

      {analyses.map((a) => (
        <div
          key={a.id}
          style={{
            borderRadius:12, padding:16, cursor:'pointer',
            background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
            transition:'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:32, height:32, borderRadius:8,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: signalBg(a.signal),
              }}>
                <SignalIcon signal={a.signal} />
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontWeight:600, color:'#E8EDF5' }}>{a.ticker || 'CHART'}</span>
                  <span style={{
                    fontSize:11, padding:'2px 6px', borderRadius:4,
                    color:'rgba(232,237,245,0.30)', background:'rgba(255,255,255,0.04)',
                  }}>{a.timeframe}</span>
                  <span style={{ fontSize:12, fontWeight:600, color: signalColor(a.signal) }}>{a.signal}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.30)', display:'flex', alignItems:'center', gap:4 }}>
                    <Clock style={{ width:11, height:11 }} />
                    {new Date(a.created_at).toLocaleDateString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </span>
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.30)' }}>
                    Confidence: <span style={{ color:'rgba(232,237,245,0.55)' }}>{a.confidence}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:11, color:'rgba(232,237,245,0.30)', marginBottom:2 }}>Entry</p>
                <p style={{ fontSize:14, fontWeight:600, fontFamily:'monospace', color:'#E8EDF5' }}>
                  {a.entry_price > 0 ? a.entry_price.toLocaleString(undefined, { maximumFractionDigits:6 }) : '—'}
                </p>
              </div>
              <ChevronRight style={{ width:16, height:16, color:'rgba(232,237,245,0.20)' }} />
            </div>
          </div>

          {a.rationale && (
            <p style={{
              fontSize:12, color:'rgba(232,237,245,0.30)', marginTop:12,
              lineHeight:1.55, display:'-webkit-box',
              WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
            }}>{a.rationale}</p>
          )}
        </div>
      ))}
    </div>
  )
}
