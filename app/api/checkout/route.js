import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { priceId } = await request.json()
    
    // Get the cookie store (await it since it returns a Promise in Next.js 15)
    const cookieStore = await cookies()
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          async get(name) {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          },
          set() {
            // Not needed for this route
          },
          remove() {
            // Not needed for this route
          },
        },
      }
    )

    // Get the user session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Supabase session error:', error)
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      )
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Please sign in to subscribe' },
        { status: 401 }
      )
    }

    console.log('Creating checkout for user:', session.user.id)

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
    })

    console.log('Checkout session created:', checkoutSession.id)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
