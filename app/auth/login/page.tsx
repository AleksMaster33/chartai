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
    <div className="min-h-screen bg-[#060606] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 line-grid opacity-40 pointer-events-none" />
      <div className="fixed w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 65%)' }} />

      <Link href="/" className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/55 transition-colors font-display">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <Link href="/" className="relative z-10 flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 bg-[#84cc16] rounded-xl flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-black" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">ChartAI</span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl p-7" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)' }}>
                <Mail className="w-6 h-6 text-[#84cc16]" />
              </div>
              <h2 className="font-display font-bold text-xl mb-2">Check your inbox</h2>
              <p className="text-white/35 text-sm leading-relaxed">
                Magic link sent to<br />
                <span className="text-white/65 font-display">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-2xl mb-1">Welcome back</h1>
              <p className="text-white/35 text-sm mb-7">Sign in to analyze charts</p>

              <button onClick={signInGoogle} disabled={!!loading}
                className="w-full flex items-center justify-center gap-2.5 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-60 mb-4 text-sm font-display">
                {loading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-[11px] text-white/20 font-display">or</span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              <form onSubmit={signInEmail} className="space-y-2.5">
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm font-display placeholder-white/20 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
                <button type="submit" disabled={!!loading || !email}
                  className="w-full py-3 rounded-xl text-sm font-display font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-45"
                  style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#84cc16' }}>
                  {loading === 'email' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Send magic link
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-[11px] text-white/20 text-center mt-5 font-display">3 free analyses daily · No credit card required</p>
      </div>
    </div>
  )
}
