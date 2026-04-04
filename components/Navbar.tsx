'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, CreditCard, Crown, User, ChevronDown, Activity } from 'lucide-react'

interface NavbarProps { plan: string; remaining: number | null }

export function Navbar({ plan, remaining }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const planBadge = {
    free:   { label:'Free',   style:'text-white/40 border-white/[0.07]', bg:'rgba(255,255,255,0.04)' },
    pro:    { label:'Pro',    style:'text-[#84cc16] border-[#84cc16]/20', bg:'rgba(132,204,22,0.07)' },
    trader: { label:'Trader', style:'text-purple-400 border-purple-400/20', bg:'rgba(139,92,246,0.07)' },
  }[plan] || { label:'Free', style:'text-white/40 border-white/[0.07]', bg:'rgba(255,255,255,0.04)' }

  return (
    <header className="border-b border-white/[0.05] sticky top-0 z-30 bg-[#060606]/80 backdrop-blur-xl">
      <nav className="max-w-5xl mx-auto px-5 h-[56px] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#84cc16] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-display font-bold text-[14px] tracking-tight">ChartAI</span>
          <div className="ml-1.5 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.15)' }}>
            <Activity className="w-2.5 h-2.5 text-[#84cc16]" />
            <span className="text-[9px] text-[#84cc16] font-display font-bold tracking-wider uppercase">Live</span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] px-2.5 py-1 rounded-full border font-display font-semibold"
            style={{ color: planBadge.style.includes('text-[#84cc16]') ? '#84cc16' : planBadge.style.includes('purple') ? '#c084fc' : 'rgba(255,255,255,0.4)',
                     background: planBadge.bg, borderColor: planBadge.style.includes('text-[#84cc16]') ? 'rgba(132,204,22,0.2)' : planBadge.style.includes('purple') ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.07)' }}>
            {planBadge.label}
          </span>

          {plan === 'free' && remaining !== null && (
            <span className="hidden sm:block text-[11px] text-white/25 font-display">
              <span className="text-white/50 font-semibold">{remaining}</span> left
            </span>
          )}

          {plan === 'free' && (
            <Link href="/pricing"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-display font-bold px-3 py-1.5 rounded-lg transition-all"
              style={{ background:'rgba(132,204,22,0.08)', border:'1px solid rgba(132,204,22,0.18)', color:'#84cc16' }}>
              <Crown style={{width:'12px',height:'12px'}} /> Upgrade
            </Link>
          )}

          <div ref={menuRef} className="relative">
            <button onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]">
              <User className="w-3.5 h-3.5 text-white/35" />
              <ChevronDown className={`w-3 h-3 text-white/20 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.07)' }}>
                <Link href="/pricing" onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all font-display">
                  <CreditCard style={{width:'13px',height:'13px'}} /> Billing & Plans
                </Link>
                <div className="h-px bg-white/[0.05]" />
                <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all font-display">
                  <LogOut style={{width:'13px',height:'13px'}} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
