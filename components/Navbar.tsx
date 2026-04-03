'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, CreditCard, Crown, User, ChevronDown } from 'lucide-react'

interface NavbarProps { plan: string; remaining: number | null }

const PLAN_CONFIG: Record<string, { label: string; style: string }> = {
  free:   { label: 'Free',   style: 'text-white/40 bg-white/[0.04] border-white/[0.06]' },
  pro:    { label: 'Pro',    style: 'text-[#84cc16] bg-[#84cc16]/10 border-[#84cc16]/20' },
  trader: { label: 'Trader', style: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
}

export function Navbar({ plan, remaining }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const cfg = PLAN_CONFIG[plan] || PLAN_CONFIG.free

  const signOut = async () => { await supabase.auth.signOut(); router.push('/') }

  return (
    <nav className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] max-w-5xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#84cc16] rounded-lg flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-black" />
        </div>
        <span className="font-display font-bold tracking-tight">ChartAI</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-display font-semibold ${cfg.style}`}>
          {cfg.label}
        </span>

        {plan === 'free' && remaining !== null && (
          <span className="hidden sm:block text-xs text-white/30 font-display">
            <span className="text-white/60">{remaining}</span> left today
          </span>
        )}

        {plan === 'free' && (
          <Link href="/pricing"
            className="hidden sm:flex items-center gap-1.5 bg-[#84cc16]/10 border border-[#84cc16]/20 text-[#84cc16] text-xs px-3 py-1.5 rounded-lg hover:bg-[#84cc16]/20 transition-all font-display font-semibold">
            <Crown className="w-3.5 h-3.5" />
            Upgrade
          </Link>
        )}

        <div className="relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-lg px-3 py-1.5 transition-all">
            <User className="w-3.5 h-3.5 text-white/40" />
            <ChevronDown className={`w-3 h-3 text-white/25 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-44 glass border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
              <Link href="/pricing" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors font-display">
                <CreditCard className="w-3.5 h-3.5" /> Billing
              </Link>
              <button onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors border-t border-white/[0.06] font-display">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
