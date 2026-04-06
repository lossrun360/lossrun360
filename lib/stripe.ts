/**
 * Stripe Billing Integration — LossRun360
 *
 * Handles subscription management, checkout sessions, and webhooks.
 * Configure Stripe keys in .env.local
 */

import Stripe from 'stripe'
import { prisma } from './prisma'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

// ─── Plan Configuration ───────────────────────────────────────────────────────

export const PLANS = {
  STARTER: {
    name: 'Starter',
    tier: 'STARTER' as const,
    price: 79,
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    requests: 25,
    users: 3,
    features: [
      '25 loss run requests/month',
      'Up to 3 users',
      'FMCSA auto-lookup',
      'PDF generation',
      'Email sending',
      'Basic dashboard',
    ],
  },
  PROFESSIONAL: {
    name: 'Professional',
    tier: 'PROFESSIONAL' as const,
    price: 199,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    requests: 150,
    users: 10,
    features: [
      '150 loss run requests/month',
      'Up to 10 users',
      'Everything in Starter',
      'Carrier database (500+ carriers)',
      'Automated reminders',
      'Role-based access control',
      'Usage analytics',
      'Priority support',
    ],
    popular: true,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    tier: 'ENTERPRISE' as const,
    price: 499,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    requests: -1, // unlimited
    users: -1, // unlimited
    features: [
      'Unlimited requests',
      'Unlimited users',
      'Everything in Professional',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
    ],
  },
} as const

// ─── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckoutSession({
  agencyId,
  agencyEmail,
  priceId,
  tier,
}: {
  agencyId: string
  agencyEmail: string
  priceId: string
  tier: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Get or create Stripe customer
  const subscription = await prisma.subscription.findUnique({
    where: { agencyId },
  })

  let customerId = subscription?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: agencyEmail,
      metadata: { agencyId },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?success=true`,
    cancel_url: `${appUrl}/billing?canceled=true`,
    metadata: { agencyId, tier },
    subscription_data: {
      trial_period_days: 14,
      metadata: { agencyId, tier },
    },
  })

  return session
}

export async function createBillingPortalSession(agencyId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const subscription = await prisma.subscription.findUnique({
    where: { agencyId },
  })

  if (!subscription?.stripeCustomerId) {
    throw new Error('No billing account found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/billing`,
  })

  return session
}

// ─── Webhook Handler ──────────────────────────────────────────────────────────

export async function handleStripeWebhook(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      await syncSubscription(sub)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await cancelSubscription(sub)
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await handlePaymentFailed(invoice)
      break
    }
  }

  return { received: true }
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  if (!session.metadata?.agencyId) return

  const agencyId = session.metadata.agencyId
  const tier = (session.metadata.tier as keyof typeof PLANS) || 'STARTER'
  const plan = PLANS[tier]

  await prisma.subscription.upsert({
    where: { agencyId },
    update: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      planTier: tier,
      status: 'ACTIVE',
      requestsPerMonth: plan.requests === -1 ? 999999 : plan.requests,
      usersAllowed: plan.users === -1 ? 999999 : plan.users,
    },
    create: {
      agencyId,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      planTier: tier,
      status: 'ACTIVE',
      requestsPerMonth: plan.requests === -1 ? 999999 : plan.requests,
      usersAllowed: plan.users === -1 ? 999999 : plan.users,
    },
  })
}

async function syncSubscription(sub: Stripe.Subscription) {
  const agencyId = sub.metadata?.agencyId
  if (!agencyId) return

  const statusMap: Record<string, string> = {
    active: 'ACTIVE',
    trialing: 'TRIALING',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
  }

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: {
      status: (statusMap[sub.status] || 'ACTIVE') as any,
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  })
}

async function cancelSubscription(sub: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { status: 'CANCELED' },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await prisma.subscription.updateMany({
    where: { stripeCustomerId: invoice.customer as string },
    data: { status: 'PAST_DUE' },
  })
}

