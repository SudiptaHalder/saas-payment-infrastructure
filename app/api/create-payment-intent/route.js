import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { priceId, userId } = await request.json()

    // Get price details
    const price = await stripe.prices.retrieve(priceId)
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      metadata: {
        userId,
        priceId,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: price.unit_amount / 100,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
