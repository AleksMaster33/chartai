import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scanMarket } from '@/lib/discovery/binance'

export const maxDuration = 60

const CACHE_TTL_MINUTES = 15

export async function POST() {
  try {
    const supabase = await createClient()

    // ── Auth ────────────────────────────────────────────────────────────────
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Profile + shared rate-limit pool ────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Reset daily count if 24 h elapsed
    const hoursSinceReset =
      (Date.now() - new Date(profile.daily_reset_at).getTime()) / 3_600_000
    if (hoursSinceReset >= 24) {
      await supabase
        .from('profiles')
        .update({ daily_analyses_used: 0, daily_reset_at: new Date().toISOString() })
        .eq('id', user.id)
      profile.daily_analyses_used = 0
    }

    // Check shared daily limit (same pool as /api/analyze)
    const dailyLimit = profile.plan === 'free' ? 3 : 999_999
    if (profile.daily_analyses_used >= dailyLimit) {
      return NextResponse.json(
        { error: 'Daily limit reached', upgrade_url: '/pricing' },
        { status: 429 },
      )
    }

    // ── Cache check ──────────────────────────────────────────────────────────
    const { data: cached } = await supabase
      .from('discovery_cache')
      .select('results, scanned_at')
      .eq('id', 1)
      .single()

    if (cached) {
      const ageMinutes =
        (Date.now() - new Date(cached.scanned_at).getTime()) / 60_000
      if (ageMinutes < CACHE_TTL_MINUTES) {
        // Cache hit — don't consume a daily analysis
        return NextResponse.json({
          success:   true,
          coins:     cached.results,
          scannedAt: cached.scanned_at,
          cached:    true,
          remainingToday: Math.max(0, dailyLimit - profile.daily_analyses_used),
        })
      }
    }

    // ── Run scan ─────────────────────────────────────────────────────────────
    const coins = await scanMarket()
    const now   = new Date().toISOString()

    // Upsert cache row (single global row, id = 1)
    await supabase
      .from('discovery_cache')
      .upsert({ id: 1, results: coins, scanned_at: now })

    // Consume 1 from daily pool (only on fresh scan)
    await supabase
      .from('profiles')
      .update({
        daily_analyses_used: profile.daily_analyses_used + 1,
        total_analyses: (profile.total_analyses || 0) + 1,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success:   true,
      coins,
      scannedAt: now,
      cached:    false,
      remainingToday: Math.max(0, dailyLimit - profile.daily_analyses_used - 1),
    })
  } catch (err) {
    console.error('Discovery error:', err)
    return NextResponse.json(
      { error: 'Market scan failed. Please try again.' },
      { status: 500 },
    )
  }
}
