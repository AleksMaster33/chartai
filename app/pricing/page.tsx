'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Check, X, Loader2, ArrowLeft, Shield, Zap, Crown, Rocket, CheckCircle2 } from 'lucide-react'

const G    = '#00FF88'
const GLOW = 'rgba(0,255,136,0.22)'

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: '$19.99', period: '/month', icon: Zap,
    badge: null as string | null,
    features: ['3 full analyses per day', 'Market scanner included', 'Complete 7-filter breakdown', 'Entry · SL · TP · Leverage', 'Signal history (30 days)'],
    missing: ['Signal history (unlimited)', 'Priority analysis speed', 'Swing analysis (4H / Daily)'],
    cta: 'Get Started', ctaHref: '/auth/login' as string | null,
    accent: false, purple: false,
  },
  {
    id: 'pro', name: 'Pro', price: '$44.90', period: '/month', icon: Crown,
    badge: 'Most Popular' as string | null,
    features: ['10 full analyses per day', 'Market scanner included', 'Complete 7-filter breakdown', 'Entry · SL · TP · Leverage', 'Signal history (unlimited)', 'Priority analysis speed'],
    missing: ['Swing analysis (4H / Daily)'],
    cta: 'Get Started', ctaHref: null as string | null,
    accent: true, purple: false,
  },
  {
    id: 'trader', name: 'Unlimited', price: '$125', period: '/month', icon: Rocket,
    badge: null as string | null,
    features: ['50 analyses per day', 'Market scanner included', 'Complete 7-filter breakdown', 'Entry · SL · TP · Leverage', 'Signal history (unlimited)', 'Priority analysis speed', 'Swing analysis (4H / Daily)'],
    missing: [],
    cta: 'Get Started', ctaHref: null as string | null,
    accent: false, purple: true,
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?',           a: 'Yes — cancel at any time. You keep access until the end of the billing period. No questions asked.' },
  { q: 'What charts are supported?',      a: 'Any screenshot from any platform — TradingView, Binance, Bybit, OKX, or custom charts. PNG, JPG, WebP.' },
  { q: 'Is a credit card required?',      a: 'No. All plans include a 3-analysis free trial. No credit card required to start.' },
  { q: 'What is the Osiris methodology?', a: '7 filters: Fuel, Tension, Trend Sync, BTC Shield, Market Structure, Entry Zone, and Trigger — all applied before a signal reaches you. Every signal includes the full filter-by-filter reasoning.' },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const d = await res.json()
      if (d.url) window.location.href = d.url
      else if (res.status === 401) window.location.href = '/auth/login'
    } catch { alert('Something went wrong.') }
    finally { setLoading(null) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080B10', overflowX:'hidden', color:'#E8EDF5' }}>

      {/* bg ambient */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div style={{
          position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:900, height:600,
          background:'radial-gradient(ellipse at center top, rgba(0,255,136,0.05) 0%, transparent 60%)',
        }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, height:64, zIndex:50,
        background:'rgba(8,11,16,0.92)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px',
      }}>
        <Link href="/" style={{
          display:'flex', alignItems:'center', gap:10, textDecoration:'none',
        }}>
          <div style={{
            width:32, height:32, borderRadius:8, background:G, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <TrendingUp style={{ width:16, height:16, color:'#000' }} />
          </div>
          <span style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.02em', color:'#E8EDF5' }}>ChartAI</span>
        </Link>
        <Link href="/dashboard" style={{
          display:'flex', alignItems:'center', gap:6,
          fontSize:13, color:'rgba(232,237,245,0.40)', textDecoration:'none', fontWeight:500,
        }}>
          <ArrowLeft style={{ width:14, height:14 }} />
          Dashboard
        </Link>
      </nav>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main style={{ paddingTop:64, position:'relative', zIndex:1 }}>

        {/* ── HERO ──────────────────────────────────────── */}
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'5rem 1.5rem 3rem', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:12 }}>
            PRICING
          </p>
          <h1 style={{
            fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:800,
            letterSpacing:'-0.03em', color:'#E8EDF5', marginBottom:12,
          }}>
            Start free. Scale when you&apos;re ready.
          </h1>
          <p style={{ fontSize:15, color:'rgba(232,237,245,0.38)', maxWidth:480, margin:'0 auto' }}>
            No hidden fees. Cancel anytime. Every plan includes full Osiris signal breakdowns.
          </p>
        </div>

        {/* ── PLAN CARDS ────────────────────────────────── */}
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'0 1.5rem 2rem' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr 1fr',
            gap:20,
            maxWidth:960,
            margin:'0 auto',
          }}>

            {/* Basic */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16,
              background:'rgba(13,17,23,0.80)',
              border:'1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                width:36, height:36, borderRadius:9,
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16,
              }}>
                <Zap style={{ width:17, height:17, color:'rgba(232,237,245,0.45)' }} />
              </div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,237,245,0.35)', marginBottom:8 }}>Basic</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$19.99</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.28)' }}>/month</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['3 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (30 days)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13 }}>
                    <Check style={{ width:14, height:14, flexShrink:0, color:'rgba(255,255,255,0.28)' }} />
                    <span style={{ color:'rgba(232,237,245,0.58)' }}>{f}</span>
                  </li>
                ))}
                {['Signal history (unlimited)','Priority analysis speed','Swing analysis (4H / Daily)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13 }}>
                    <X style={{ width:14, height:14, flexShrink:0, color:'rgba(232,237,245,0.12)' }} />
                    <span style={{ color:'rgba(232,237,245,0.18)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" style={{
                display:'block', textAlign:'center', padding:'13px 0',
                borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none',
                border:'1px solid rgba(255,255,255,0.09)', color:'rgba(232,237,245,0.48)',
              }}>
                Get Started
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16, position:'relative',
              background:'rgba(0,255,136,0.04)',
              border:'1px solid rgba(0,255,136,0.25)',
              boxShadow:'0 0 0 1px rgba(0,255,136,0.08), 0 20px 60px rgba(0,255,136,0.07)',
              marginTop:-12, marginBottom:-12,
            }}>
              {/* top glow line */}
              <div style={{
                position:'absolute', top:0, left:'15%', right:'15%', height:1,
                background:`linear-gradient(90deg,transparent,${G}66,transparent)`,
              }} />
              {/* badge */}
              <div style={{
                position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)',
                background:G, color:'#000', fontSize:10, fontWeight:800,
                padding:'4px 14px', borderRadius:999,
                letterSpacing:'0.08em', textTransform:'uppercase', whiteSpace:'nowrap',
              }}>
                Most Popular
              </div>

              <div style={{
                width:36, height:36, borderRadius:9,
                background:G, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, marginTop:8,
              }}>
                <Crown style={{ width:17, height:17, color:'#000' }} />
              </div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(0,255,136,0.65)', marginBottom:8 }}>Pro</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$44.90</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.28)' }}>/month</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['10 full analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13 }}>
                    <Check style={{ width:14, height:14, flexShrink:0, color:G }} />
                    <span style={{ color:'rgba(232,237,245,0.70)' }}>{f}</span>
                  </li>
                ))}
                {['Swing analysis (4H / Daily)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13 }}>
                    <X style={{ width:14, height:14, flexShrink:0, color:'rgba(232,237,245,0.12)' }} />
                    <span style={{ color:'rgba(232,237,245,0.18)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => checkout('pro')}
                disabled={!!loading}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10,
                  fontSize:13, fontWeight:700, cursor:'pointer',
                  background:G, color:'#000', border:'none',
                  boxShadow:`0 4px 20px ${GLOW}`,
                  opacity: loading ? 0.6 : 1,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}
              >
                {loading === 'pro' && <Loader2 style={{ width:14, height:14 }} />}
                Get Started
              </button>
            </div>

            {/* Unlimited */}
            <div style={{
              display:'flex', flexDirection:'column',
              padding:'28px 24px', borderRadius:16,
              background:'rgba(139,92,246,0.03)',
              border:'1px solid rgba(139,92,246,0.18)',
            }}>
              <div style={{
                width:36, height:36, borderRadius:9,
                background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.22)',
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16,
              }}>
                <Rocket style={{ width:17, height:17, color:'#a78bfa' }} />
              </div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(167,139,250,0.55)', marginBottom:8 }}>Unlimited</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.03em', color:'#E8EDF5' }}>$125</span>
                <span style={{ fontSize:13, color:'rgba(232,237,245,0.28)' }}>/month</span>
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {['50 analyses per day','Market scanner included','Complete 7-filter breakdown','Entry · SL · TP · Leverage','Signal history (unlimited)','Priority analysis speed','Swing analysis (4H / Daily)'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13 }}>
                    <Check style={{ width:14, height:14, flexShrink:0, color:'#a78bfa' }} />
                    <span style={{ color:'rgba(232,237,245,0.58)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => checkout('trader')}
                disabled={!!loading}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10,
                  fontSize:13, fontWeight:700, cursor:'pointer',
                  background:'transparent', color:'#a78bfa',
                  border:'1px solid rgba(139,92,246,0.25)',
                  opacity: loading ? 0.6 : 1,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}
              >
                {loading === 'trader' && <Loader2 style={{ width:14, height:14 }} />}
                Get Started
              </button>
            </div>
          </div>

          {/* trust note */}
          <div style={{
            maxWidth:960, margin:'24px auto 0',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            padding:'14px 20px', borderRadius:12,
            background:'rgba(0,255,136,0.04)', border:'1px solid rgba(0,255,136,0.10)',
          }}>
            <Shield style={{ width:15, height:15, flexShrink:0, color:'rgba(0,255,136,0.55)' }} />
            <span style={{ fontSize:13, color:'rgba(232,237,245,0.40)' }}>
              All plans include a 3-analysis free trial · No credit card required to start · Cancel anytime
            </span>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────── */}
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'4rem 1.5rem' }}>
          <h2 style={{
            fontSize:'clamp(1.25rem,2.5vw,1.75rem)', fontWeight:800,
            letterSpacing:'-0.02em', color:'#E8EDF5',
            textAlign:'center', marginBottom:32,
          }}>
            Frequently asked questions
          </h2>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:16,
          }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{
                padding:'20px 22px', borderRadius:12,
                background:'rgba(255,255,255,0.025)',
                border:'1px solid rgba(255,255,255,0.055)',
              }}>
                <p style={{ fontSize:14, fontWeight:600, color:'rgba(232,237,245,0.82)', marginBottom:8 }}>{q}</p>
                <p style={{ fontSize:13, color:'rgba(232,237,245,0.38)', lineHeight:1.65, margin:0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ────────────────────────────────── */}
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'0 1.5rem 5rem' }}>
          <div style={{
            borderRadius:20, padding:'3.5rem 2rem', textAlign:'center',
            position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(8,11,16,1) 60%)',
            border:'1px solid rgba(0,255,136,0.12)',
          }}>
            <div style={{
              position:'absolute', inset:0, pointerEvents:'none',
              background:'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.07) 0%, transparent 55%)',
            }} />
            <div style={{ position:'absolute', top:0, left:'25%', right:'25%', height:1, background:`linear-gradient(90deg,transparent,${G}44,transparent)` }} />

            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8, marginBottom:20,
                padding:'6px 14px', borderRadius:999,
                background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.18)',
              }}>
                <CheckCircle2 style={{ width:12, height:12, color:G }} />
                <span style={{ fontSize:11, fontWeight:700, color:'rgba(0,255,136,0.9)' }}>
                  3 free analyses — no credit card required
                </span>
              </div>
              <h2 style={{
                fontSize:'clamp(1.5rem,3vw,2.25rem)', fontWeight:800,
                letterSpacing:'-0.02em', color:'#E8EDF5', marginBottom:12,
              }}>
                Ready to trade with a system?
              </h2>
              <p style={{ fontSize:15, color:'rgba(232,237,245,0.40)', maxWidth:400, margin:'0 auto 28px' }}>
                Scan the market. Identify the setup. Understand the signal. Enter with confidence.
              </p>
              <Link href="/auth/login" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'14px 28px', borderRadius:12,
                background:G, color:'#000', fontWeight:700, fontSize:15,
                textDecoration:'none',
                boxShadow:`0 0 0 1px rgba(0,255,136,0.28), 0 8px 32px ${GLOW}`,
              }}>
                Start Your Free Analysis →
              </Link>
            </div>
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────── */}
        <footer style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{
            maxWidth:'72rem', margin:'0 auto', padding:'1.75rem 1.5rem',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:G, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TrendingUp style={{ width:12, height:12, color:'black' }} />
              </div>
              <span style={{ fontWeight:700, fontSize:13, color:'rgba(232,237,245,0.50)' }}>ChartAI</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              <Link href="/" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Home</Link>
              <Link href="/auth/login" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Sign in</Link>
              <Link href="/dashboard" style={{ fontSize:12, color:'rgba(232,237,245,0.28)', textDecoration:'none' }}>Dashboard</Link>
            </div>
            <p style={{ fontSize:11, color:'rgba(232,237,245,0.18)', margin:0 }}>
              © 2026 ChartAI. Not financial advice. Trade responsibly.
            </p>
          </div>
        </footer>

      </main>
    </div>
  )
}
