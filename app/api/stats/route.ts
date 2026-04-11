import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { count } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    return NextResponse.json({ signalsThisWeek: count ?? 0 }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch {
    return NextResponse.json({ signalsThisWeek: 0 })
  }
}
