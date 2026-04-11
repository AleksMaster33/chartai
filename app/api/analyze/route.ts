import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeChart } from '@/lib/ai/analyze'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile + check rate limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Reset daily count if 24h passed
    const lastReset = new Date(profile.daily_reset_at)
    const now = new Date()
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

    if (hoursSinceReset >= 24) {
      await supabase
        .from('profiles')
        .update({ daily_analyses_used: 0, daily_reset_at: now.toISOString() })
        .eq('id', user.id)
      profile.daily_analyses_used = 0
    }

    // Block free users entirely — subscription required
    if (profile.plan === 'free') {
      return NextResponse.json(
        { error: 'Subscription required', upgrade_url: '/pricing' },
        { status: 403 }
      )
    }

    // Daily limits per plan
    const dailyLimit =
      profile.plan === 'basic'  ? 3      :
      profile.plan === 'pro'    ? 10     : 999999  // trader / unlimited

    if (profile.daily_analyses_used >= dailyLimit) {
      return NextResponse.json(
        { error: 'Daily limit reached', plan: profile.plan, limit: dailyLimit, upgrade_url: '/pricing' },
        { status: 429 }
      )
    }

    // Parse the uploaded image
    const formData = await req.formData()
    const file = formData.get('image') as File
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, or WebP.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Convert to base64 for AI
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData } = await supabase.storage
      .from('charts')
      .upload(fileName, buffer, { contentType: file.type })

    const imageUrl = uploadData?.path
      ? supabase.storage.from('charts').getPublicUrl(uploadData.path).data.publicUrl
      : ''

    // Run AI pipeline (Gemini Vision → Claude Signal)
    const analysis = await analyzeChart(base64, file.type)

    // Save to DB
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        ticker: analysis.ticker,
        timeframe: analysis.timeframe,
        trend: analysis.trend,
        pattern: analysis.pattern,
        signal: analysis.signal,
        entry_price: analysis.entry_price,
        stop_loss: analysis.stop_loss,
        take_profit_1: analysis.take_profit_1,
        take_profit_2: analysis.take_profit_2,
        take_profit_3: analysis.take_profit_3,
        risk_reward: analysis.risk_reward,
        support_level: analysis.support_level,
        resistance_level: analysis.resistance_level,
        confidence: analysis.confidence,
        rationale: analysis.rationale,
        key_levels: analysis.key_levels,
        indicators: analysis.indicators,
      })
      .select()
      .single()

    if (saveError) console.error('Failed to save analysis:', saveError)

    // Increment daily usage
    await supabase
      .from('profiles')
      .update({
        daily_analyses_used: profile.daily_analyses_used + 1,
        total_analyses: (profile.total_analyses || 0) + 1,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      analysis,
      analysisId: savedAnalysis?.id,
      remainingToday: dailyLimit >= 999999 ? null : Math.max(0, dailyLimit - profile.daily_analyses_used - 1),
      plan: profile.plan,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
