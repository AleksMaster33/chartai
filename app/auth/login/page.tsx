'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { TrendingUp, Mail, Globe, Loader2, ArrowLeft, Shield, Zap, Target, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

const G    = '#00FF88'
const GLOW = 'rgba(0,255,136,0.20)'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<'google' | 'email' | null>(null)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const signInGoogle = async () => {
    setLoading('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signInEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading('email')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(null)
    if (!error) setSent(true)
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#080B10', color:'#E8EDF5',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'24px 16px', position:'relative', overflowX:'hidden',
    }}>

      {/* bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:800, height:800, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 60%)',
        }} />
        <div style={{
          position:'absolute', bottom:0, right:0,
          width:400, height:400,
          background:'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }} />
      </div>

      {/* back link */}
      <Link href="/" style={{
        position:'absolute', top:20, left:20, zIndex:10,
        display:'flex', alignItems:'center', gap:6,
        fontSize:12, color:'rgba(232,237,245,0.35)', textDecoration:'none', fontWeight:500,
      }}>
        <ArrowLeft style={{ width:13, height:13 }} />
        Back
      </Link>

      {/* logo */}
      <div style={{ position:'relative', zIndex:1, marginBottom:32 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{
            width:36, height:36, borderRadius:9, background:G,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <TrendingUp style={{ width:18, height:18, color:'#000' }} />
          </div>
          <span style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.02em', color:'#E8EDF5' }}>ChartAI</span>
        </Link>
      </div>

      {/* card */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400 }}>
        <div style={{
          borderRadius:20, overflow:'hidden',
          background:'rgba(13,17,23,0.90)',
          border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:`0 0 0 1px rgba(0,255,136,0.06), 0 32px 80px rgba(0,0,0,0.55)`,
        }}>
          {/* top accent line */}
          <div style={{
            height:1, width:'100%',
            background:`linear-gradient(90deg,transparent,${G}44,transparent)`,
          }} />

          <div style={{ padding:32 }}>
            {sent ? (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{
                  width:56, height:56, borderRadius:16, margin:'0 auto 20px',
                  background:'rgba(0,255,136,0.08)', border:`1px solid rgba(0,255,136,0.18)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Mail style={{ width:24, height:24, color:G }} />
                </div>
                <h2 style={{ fontSize:'1.25rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:8, color:'#E8EDF5' }}>
                  Check your inbox
                </h2>
                <p style={{ fontSize:14, color:'rgba(232,237,245,0.38)', lineHeight:1.65, marginBottom:20 }}>
                  Magic link sent to<br />
                  <span style={{ fontWeight:600, color:'rgba(232,237,245,0.70)' }}>{email}</span>
                </p>
                <button onClick={() => setSent(false)} style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontSize:12, color:'rgba(232,237,245,0.28)',
                }}>
                  Use a different email →
                </button>
              </div>
            ) : (
              /* ── SIGN IN FORM ── */
              <>
                <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:6, color:'#E8EDF5' }}>
                  Welcome back
                </h1>
                <p style={{ fontSize:13, color:'rgba(232,237,245,0.38)', marginBottom:28 }}>
                  Sign in to analyze charts with Osiris AI
                </p>

                {/* Google button */}
                <button
                  onClick={signInGoogle}
                  disabled={!!loading}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                    padding:'13px 0', borderRadius:12, marginBottom:16,
                    background:'#ffffff', color:'#111', fontSize:14, fontWeight:600,
                    border:'none', cursor:'pointer', opacity: loading ? 0.6 : 1,
                    transition:'opacity 0.15s',
                  }}
                >
                  {loading === 'google'
                    ? <Loader2 style={{ width:16, height:16, color:'#111' }} />
                    : <Globe style={{ width:16, height:16, color:'#111' }} />
                  }
                  Continue with Google
                </button>

                {/* divider */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.05)' }} />
                  <span style={{ fontSize:11, color:'rgba(232,237,245,0.22)' }}>or</span>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.05)' }} />
                </div>

                {/* email form */}
                <form onSubmit={signInEmail} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width:'100%', padding:'13px 16px', borderRadius:12,
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.08)',
                      color:'rgba(232,237,245,0.85)',
                      fontSize:14, outline:'none', boxSizing:'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(0,255,136,0.35)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <button
                    type="submit"
                    disabled={!!loading || !email}
                    style={{
                      width:'100%', padding:'13px 0', borderRadius:12,
                      background:'rgba(0,255,136,0.08)', border:`1px solid rgba(0,255,136,0.22)`,
                      color:G, fontSize:14, fontWeight:600, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      opacity: (loading || !email) ? 0.45 : 1,
                      transition:'opacity 0.15s, background 0.15s',
                    }}
                  >
                    {loading === 'email' && <Loader2 style={{ width:14, height:14 }} />}
                    Send magic link
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* trust badges */}
        <div style={{
          marginTop:16, display:'grid',
          gridTemplateColumns:'1fr 1fr 1fr', gap:10,
        }}>
          {[
            { icon:Zap,    label:'3 free/day',   sub:'No card needed'     },
            { icon:Shield, label:'Osiris AI',     sub:'7-filter system'    },
            { icon:Target, label:'Any chart',     sub:'Any platform'       },
          ].map(({ icon:Icon, label, sub }) => (
            <div key={label} style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              gap:6, padding:'14px 10px', borderRadius:12, textAlign:'center',
              background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
            }}>
              <Icon style={{ width:15, height:15, color:'rgba(0,255,136,0.55)' }} />
              <span style={{ fontSize:12, fontWeight:600, color:'rgba(232,237,245,0.55)' }}>{label}</span>
              <span style={{ fontSize:10, color:'rgba(232,237,245,0.25)' }}>{sub}</span>
            </div>
          ))}
        </div>

        {/* footer note */}
        <div style={{
          marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>
          <CheckCircle2 style={{ width:12, height:12, color:'rgba(0,255,136,0.40)' }} />
          <p style={{ fontSize:11, color:'rgba(232,237,245,0.22)', margin:0 }}>
            No credit card required · Educational purposes only
          </p>
        </div>
      </div>
    </div>
  )
}
