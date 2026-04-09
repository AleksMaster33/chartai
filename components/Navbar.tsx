'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, CreditCard, Crown, User, ChevronDown } from 'lucide-react'

interface NavbarProps { plan: string; remaining: number | null }

const LIME = '#84cc16'

export function Navbar({ plan, remaining }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const planConfig = {
    free:   { label:'Free',   color:'rgba(255,255,255,0.4)',  bg:'rgba(255,255,255,0.04)',  border:'rgba(255,255,255,0.08)' },
    pro:    { label:'Pro',    color:LIME,                     bg:'rgba(132,204,22,0.08)',   border:'rgba(132,204,22,0.2)'   },
    trader: { label:'Trader', color:'#a78bfa',                bg:'rgba(139,92,246,0.08)',   border:'rgba(139,92,246,0.2)'   },
  }[plan] ?? { label:'Free', color:'rgba(255,255,255,0.4)', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)' }

  return (
    <header
      className="border-b border-white/[0.05] sticky top-0 z-30"
      style={{ background:'rgba(9,9,9,0.88)', backdropFilter:'blur(20px)' }}>
      <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center relative"
            style={{ background:LIME }}>
            <TrendingUp className="w-3.5 h-3.5 text-black" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[#090909]"
              style={{ background:LIME, animation:'blink 1.8s ease-in-out infinite' }} />
          </div>
          <span className="font-display font-extrabold text-[14px] tracking-tight group-hover:text-[#84cc16] transition-colors">
            ChartAI
          </span>
        </Link>

        {/* right */}
        <div className="flex items-center gap-2">

          {/* plan badge */}
          <span className="text-[11px] px-2.5 py-1 rounded-full font-display font-semibold"
            style={{ color:planConfig.color, background:planConfig.bg, border:`1px solid ${planConfig.border}` }}>
            {planConfig.label}
          </span>

          {/* remaining */}
          {plan === 'free' && remaining !== null && (
            <span className="hidden sm:block text-[11px] text-white/25 font-display">
              <span className="text-white/50 font-semibold">{remaining}</span> left today
            </span>
          )}

          {/* upgrade */}
          {plan === 'free' && (
            <Link href="/pricing"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-display font-bold px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
              style={{ background:'rgba(132,204,22,0.1)', border:'1px solid rgba(132,204,22,0.2)', color:LIME }}>
              <Crown style={{ width:12, height:12 }} /> Upgrade
            </Link>
          )}

          {/* user menu */}
          <div ref={menuRef} className="relative">
            <button onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]">
              <User className="w-3.5 h-3.5 text-white/35" />
              <ChevronDown className={`w-3 h-3 text-white/20 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background:'#0e0e0e', border:'1px solid rgba(255,255,255,0.08)' }}>
                <Link href="/pricing" onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/45 hover:text-white/75 hover:bg-white/[0.04] transition-all font-display">
                  <CreditCard style={{ width:13, height:13 }} /> Billing & Plans
                </Link>
                <div className="h-px bg-white/[0.05]" />
                <button
                  onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/45 hover:text-white/75 hover:bg-white/[0.04] transition-all font-display">
                  <LogOut style={{ width:13, height:13 }} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </header>
  )
}
