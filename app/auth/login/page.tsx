'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Mail, Globe, Loader2, ArrowLeft, Shield, Zap, Target } from 'lucide-react'

export const dynamic = 'force-dynamic'

const LIME = '#84cc16'

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
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background:'radial-gradient(circle,rgba(132,204,22,0.04) 0%,transparent 60%)' }} />
      </div>

      {/* back */}
      <Link href="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-display z-10">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      {/* logo */}
      <motion.div
        initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4 }}
        className="relative z-10 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:LIME }}>
            <TrendingUp className="w-4.5 h-4.5 text-black" style={{ width:18, height:18 }} />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">ChartAI</span>
        </Link>
      </motion.div>

      {/* card */}
      <motion.div
        initial={{ opacity:0, y:18, scale:0.98 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ delay:0.08, duration:0.5, ease:[0.22,1,0.36,1] }}
        className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl overflow-hidden"
          style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.08)',
            boxShadow:'0 0 0 1px rgba(132,204,22,0.05), 0 32px 80px rgba(0,0,0,0.5)',
          }}>

          {/* top bar */}
          <div className="h-px w-full"
            style={{ background:'linear-gradient(90deg,transparent,rgba(132,204,22,0.35),transparent)' }} />

          <div className="p-7">
            {sent ? (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }}
                  transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background:'rgba(132,204,22,0.1)', border:'1px solid rgba(132,204,22,0.2)' }}>
                  <Mail className="w-6 h-6" style={{ color:LIME }} />
                </motion.div>
                <h2 className="font-display font-bold text-xl mb-2">Check your inbox</h2>
                <p className="text-white/35 text-sm leading-relaxed">
                  Magic link sent to<br />
                  <span className="font-display font-semibold" style={{ color:'rgba(255,255,255,0.65)' }}>{email}</span>
                </p>
                <button onClick={() => setSent(false)}
                  className="mt-5 text-xs text-white/25 hover:text-white/50 transition-colors font-display">
                  Use a different email →
                </button>
              </div>
            ) : (
              <>
                <h1 className="font-display font-extrabold text-2xl mb-1">Welcome back</h1>
                <p className="text-white/35 text-sm mb-7">Sign in to analyze charts with Osiris AI</p>

                {/* Google */}
                <button onClick={signInGoogle} disabled={!!loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-60 mb-4 text-sm font-display">
                  {loading === 'google'
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Globe className="w-4 h-4" />}
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/[0.05]" />
                  <span className="text-[11px] text-white/20 font-display">or</span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                <form onSubmit={signInEmail} className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm font-display placeholder-white/20 focus:outline-none transition-all"
                    style={{
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.07)',
                      color:'rgba(255,255,255,0.85)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(132,204,22,0.35)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                  />
                  <button type="submit" disabled={!!loading || !email}
                    className="w-full py-3 rounded-xl text-sm font-display font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-45"
                    style={{
                      background:'rgba(132,204,22,0.1)',
                      border:'1px solid rgba(132,204,22,0.22)',
                      color:LIME,
                    }}>
                    {loading === 'email' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Send magic link
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* trust */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.35, duration:0.4 }}
          className="mt-5 grid grid-cols-3 gap-3">
          {[
            { icon:Zap,    text:'3 free/day' },
            { icon:Shield, text:'Osiris AI' },
            { icon:Target, text:'Any chart' },
          ].map(({ icon:Icon, text }) => (
            <div key={text}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
              <Icon className="w-3.5 h-3.5 opacity-40" style={{ color:LIME }} />
              <span className="text-[10px] text-white/25 font-display">{text}</span>
            </div>
          ))}
        </motion.div>

        <p className="text-[11px] text-white/18 text-center mt-5 font-display">
          No credit card required · Educational purposes only
        </p>
      </motion.div>
    </div>
  )
}
