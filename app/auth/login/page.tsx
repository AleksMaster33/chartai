'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { TrendingUp, Mail, Globe, Loader2, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<'google'|'email'|null>(null)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const signInGoogle = async () => {
    setLoading('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const signInEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading('email')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    setLoading(null)
    if (!error) setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="fixed pointer-events-none overflow-hidden inset-0">
        <div className="orb w-[500px] h-[500px] bg-[#84cc16] opacity-[0.04] -top-48 left-1/2 -translate-x-1/2" />
      </div>

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-display">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <Link href="/" className="relative z-10 flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 bg-[#84cc16] rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-black" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">ChartAI</span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="glass border border-white/[0.08] rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#84cc16]/10 border border-[#84cc16]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-[#84cc16]" />
              </div>
              <h2 className="font-display font-bold text-xl mb-2">Check your inbox</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Magic link sent to<br />
                <span className="text-white/70 font-display">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-2xl mb-1">Welcome back</h1>
              <p className="text-white/40 text-sm mb-8">Sign in to analyze charts</p>

              <button onClick={signInGoogle} disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 transition-all disabled:opacity-60 mb-5 font-display">
                {loading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-white/20 font-display">or email</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <form onSubmit={signInEmail} className="space-y-3">
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm placeholder-white/20 focus:outline-none focus:border-[#84cc16]/40 transition-colors font-display" />
                <button type="submit" disabled={!!loading || !email}
                  className="w-full bg-[#84cc16]/10 border border-[#84cc16]/20 text-[#84cc16] font-semibold py-3 rounded-xl hover:bg-[#84cc16]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-display">
                  {loading === 'email' && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send magic link
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-xs text-white/20 text-center mt-6 font-display">3 free analyses daily · No credit card</p>
      </div>
    </div>
  )
}
