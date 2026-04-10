'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, CreditCard, Crown, User, ChevronDown, ScanLine, Zap } from 'lucide-react'

interface NavbarProps { plan: string; remaining: number | null }

const G = '#00FF88'

export function Navbar({ plan, remaining }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const planConfig = {
    free:   { label:'Free',     color:'rgba(232,237,245,0.40)', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)' },
    pro:    { label:'Pro',      color:G,                        bg:'rgba(0,255,136,0.08)',   border:'rgba(0,255,136,0.20)'   },
    trader: { label:'Unlimited',color:'#a78bfa',                bg:'rgba(139,92,246,0.08)',  border:'rgba(139,92,246,0.20)'  },
  }[plan] ?? { label:'Free', color:'rgba(232,237,245,0.40)', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)' }

  const isAnalyze   = pathname === '/dashboard'
  const isDiscover  = pathname?.startsWith('/dashboard/discover') || pathname?.startsWith('/dashboard/analyze')

  return (
    <>
      <header style={{
        position:'sticky', top:0, zIndex:30,
        background:'rgba(8,11,16,0.92)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <nav style={{
          maxWidth:'80rem', margin:'0 auto', padding:'0 24px',
          height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>

          {/* left: logo + nav links */}
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <Link href="/dashboard" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
              <div style={{
                width:30, height:30, borderRadius:8, background:G, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
              }}>
                <TrendingUp style={{ width:15, height:15, color:'#000' }} />
                <span style={{
                  position:'absolute', top:-2, right:-2, width:8, height:8,
                  borderRadius:'50%', background:G,
                  border:'2px solid #080B10',
                  animation:'blink 1.8s ease-in-out infinite',
                }} />
              </div>
              <span style={{ fontWeight:800, fontSize:14, letterSpacing:'-0.02em', color:'#E8EDF5' }}>ChartAI</span>
            </Link>

            {/* nav links */}
            <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Link href="/dashboard" style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 12px', borderRadius:8,
                fontSize:12, fontWeight:600, textDecoration:'none',
                color: isAnalyze ? G : 'rgba(232,237,245,0.32)',
                background: isAnalyze ? 'rgba(0,255,136,0.07)' : 'transparent',
              }}>
                <Zap style={{ width:12, height:12 }} />
                Analyze
              </Link>
              <Link href="/dashboard/discover" style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 12px', borderRadius:8,
                fontSize:12, fontWeight:600, textDecoration:'none',
                color: isDiscover ? G : 'rgba(232,237,245,0.32)',
                background: isDiscover ? 'rgba(0,255,136,0.07)' : 'transparent',
              }}>
                <ScanLine style={{ width:12, height:12 }} />
                Discover
              </Link>
            </div>
          </div>

          {/* right */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* plan badge */}
            <span style={{
              fontSize:11, padding:'3px 10px', borderRadius:999, fontWeight:600,
              color:planConfig.color, background:planConfig.bg, border:`1px solid ${planConfig.border}`,
            }}>
              {planConfig.label}
            </span>

            {/* remaining */}
            {plan === 'free' && remaining !== null && (
              <span className="nav-remaining" style={{ fontSize:11, color:'rgba(232,237,245,0.28)', whiteSpace:'nowrap' }}>
                <span style={{ fontWeight:600, color:'rgba(232,237,245,0.55)' }}>{remaining}</span> left today
              </span>
            )}

            {/* upgrade */}
            {plan === 'free' && (
              <Link href="/pricing" className="nav-upgrade" style={{
                display:'flex', alignItems:'center', gap:5,
                fontSize:11, fontWeight:700, textDecoration:'none',
                padding:'6px 12px', borderRadius:8,
                color:G, background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.18)',
              }}>
                <Crown style={{ width:11, height:11 }} />
                Upgrade
              </Link>
            )}

            {/* user menu */}
            <div ref={menuRef} style={{ position:'relative' }}>
              <button onClick={() => setOpen(v => !v)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 12px', borderRadius:8, cursor:'pointer',
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
              }}>
                <User style={{ width:14, height:14, color:'rgba(232,237,245,0.38)' }} />
                <ChevronDown style={{
                  width:12, height:12, color:'rgba(232,237,245,0.22)',
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition:'transform 0.15s',
                }} />
              </button>

              {open && (
                <div style={{
                  position:'absolute', right:0, top:'calc(100% + 6px)', width:176,
                  borderRadius:12, overflow:'hidden', zIndex:50,
                  background:'#0D1117', border:'1px solid rgba(255,255,255,0.08)',
                  boxShadow:'0 16px 48px rgba(0,0,0,0.55)',
                }}>
                  <Link href="/pricing" onClick={() => setOpen(false)} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'10px 16px', fontSize:12, textDecoration:'none',
                    color:'rgba(232,237,245,0.45)',
                  }}>
                    <CreditCard style={{ width:13, height:13 }} />
                    Billing &amp; Plans
                  </Link>
                  <div style={{ height:1, background:'rgba(255,255,255,0.05)' }} />
                  <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'10px 16px', fontSize:12, cursor:'pointer',
                    background:'none', border:'none', color:'rgba(232,237,245,0.45)',
                    textAlign:'left',
                  }}>
                    <LogOut style={{ width:13, height:13 }} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav style={{
        display:'none',
        position:'fixed', bottom:0, left:0, right:0, zIndex:50,
        height:60,
        background:'rgba(8,11,16,0.97)', backdropFilter:'blur(20px)',
        borderTop:'1px solid rgba(255,255,255,0.07)',
      }} className="mobile-bottom-nav">
        <div style={{ display:'flex', height:'100%' }}>
          <Link href="/dashboard" style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:4, textDecoration:'none',
            color: isAnalyze ? G : 'rgba(232,237,245,0.32)',
            borderTop: isAnalyze ? `2px solid ${G}` : '2px solid transparent',
          }}>
            <Zap style={{ width:18, height:18 }} />
            <span style={{ fontSize:10, fontWeight:600 }}>Analyze</span>
          </Link>
          <Link href="/dashboard/discover" style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:4, textDecoration:'none',
            color: isDiscover ? G : 'rgba(232,237,245,0.32)',
            borderTop: isDiscover ? `2px solid ${G}` : '2px solid transparent',
          }}>
            <ScanLine style={{ width:18, height:18 }} />
            <span style={{ fontSize:10, fontWeight:600 }}>Discover</span>
          </Link>
          <Link href="/pricing" style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:4, textDecoration:'none',
            color: 'rgba(232,237,245,0.32)',
            borderTop: '2px solid transparent',
          }}>
            <Crown style={{ width:18, height:18 }} />
            <span style={{ fontSize:10, fontWeight:600 }}>Upgrade</span>
          </Link>
        </div>
      </nav>

      {/* spacer so content is not hidden behind bottom nav on mobile */}
      <div className="mobile-bottom-spacer" style={{ display:'none', height:60 }} />

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media (max-width: 600px) {
          .nav-links { display: none !important; }
          .nav-remaining { display: none !important; }
          .nav-upgrade { display: none !important; }
          .mobile-bottom-nav { display: block !important; }
          .mobile-bottom-spacer { display: block !important; }
        }
      `}</style>
    </>
  )
}
