import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutCompleted(session)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await handleSubscriptionUpdated(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session) {
  const { userId } = session.metadata
  const customerId = session.customer
  const subscriptionId = session.subscription

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Store in database using Prisma
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionId },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  // Record payment
  await prisma.payment.create({
    data: {
      userId,
      stripePaymentIntentId: session.payment_intent,
      amount: session.amount_total,
      currency: session.currency,
      status: 'succeeded',
    },
  })
}

async function handlePaymentSucceeded(invoice) {
  if (!invoice.subscription) return

  // Update subscription period end
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription)

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  // Record payment
  await prisma.payment.create({
    data: {
      userId: subscription.metadata.userId,
      stripePaymentIntentId: invoice.payment_intent,
      amount: invoice.total,
      currency: invoice.currency,
      status: 'succeeded',
    },
  })
}

async function handleSubscriptionUpdated(subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}
