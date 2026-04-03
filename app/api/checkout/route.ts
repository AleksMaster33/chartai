import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, createOrRetrieveCustomer, PLANS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await req.json()
  const planConfig = PLANS[plan as keyof typeof PLANS]

  if (!planConfig || plan === 'free' || !('priceId' in planConfig)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const customerId = await createOrRetrieveCustomer(user.email!, user.id)

  const session = await createCheckoutSession(
    customerId,
    planConfig.priceId,
    user.id,
    process.env.NEXT_PUBLIC_APP_URL!
  )

  return NextResponse.json({ url: session.url })
}
