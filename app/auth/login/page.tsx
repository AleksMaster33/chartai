'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { TrendingUp, Mail, Globe, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<'google' | 'email' | null>(null)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const signInWithGoogle = async () => {
    setLoading('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signInWithEmail = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-black" />
        </div>
        <span className="font-semibold text-xl">ChartAI</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-lime-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-white/50 text-sm">
                We sent a login link to <span className="text-white/80">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1">Sign in</h1>
              <p className="text-white/50 text-sm mb-8">Start analyzing charts for free</p>

              {/* Google */}
              <button
                onClick={signInWithGoogle}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-60 mb-4"
              >
                {loading === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email magic link */}
              <form onSubmit={signInWithEmail} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-lime-400/40 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={!!loading || !email}
                  className="w-full bg-lime-400/10 border border-lime-400/20 text-lime-400 font-medium py-3 rounded-xl hover:bg-lime-400/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading === 'email' && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send magic link
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-xs text-white/30 text-center mt-6">
          By signing in, you agree to our Terms of Service.
          <br />3 free analyses per day · No credit card needed.
        </p>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
