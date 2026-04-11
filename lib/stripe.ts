import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    dailyLimit: 3,
  },
  basic: {
    name: 'Basic',
    price: 19.99,
    get priceId() { return process.env.STRIPE_BASIC_PRICE_ID! },
    dailyLimit: 3,
  },
  pro: {
    name: 'Pro',
    price: 44.90,
    get priceId() { return process.env.STRIPE_PRO_PRICE_ID! },
    dailyLimit: 10,
  },
  trader: {
    name: 'Unlimited',
    price: 125,
    get priceId() { return process.env.STRIPE_TRADER_PRICE_ID! },
    dailyLimit: 50,
  },
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  returnUrl: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${returnUrl}/dashboard?upgraded=true`,
    cancel_url: `${returnUrl}/pricing`,
    metadata: { userId },
    allow_promotion_codes: true,
  })
}

export async function createOrRetrieveCustomer(email: string, userId: string) {
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) return existing.data[0].id

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })
  return customer.id
}
