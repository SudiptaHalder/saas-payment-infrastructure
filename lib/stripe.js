import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Latest stable API version
  typescript: false,
})

export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly', // Replace with your actual price ID
}

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic features',
      'Up to 3 projects',
      'Community support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 10,
    priceId: PRICE_IDS.PRO_MONTHLY,
    features: [
      'All free features',
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'API access',
    ],
  },
}
