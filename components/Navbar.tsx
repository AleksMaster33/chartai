'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, CreditCard, Crown, User, ChevronDown } from 'lucide-react'

interface NavbarProps {
  plan: string
  remaining: number | null
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'text-white/40 bg-white/[0.05] border-white/[0.08]' },
  pro: { label: 'Pro', color: 'text-lime-400 bg-lime-400/10 border-lime-400/20' },
  trader: { label: 'Trader', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
}

export function Navbar({ plan, remaining }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const planConfig = PLAN_LABELS[plan] || PLAN_LABELS.free

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] max-w-5xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-black" />
        </div>
        <span className="font-semibold">ChartAI</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${planConfig.color}`}>
          {planConfig.label}
        </span>

        {plan === 'free' && (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-1.5 bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs px-3 py-1.5 rounded-lg hover:bg-lime-400/20 transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade
          </Link>
        )}

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg px-3 py-1.5 transition-all"
          >
            <User className="w-4 h-4 text-white/50" />
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden">
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Billing & Plans
              </Link>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors border-t border-white/[0.06]"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
