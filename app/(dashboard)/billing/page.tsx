'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { PLANS } from '@/lib/stripe'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BillingPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/billing/subscription')
      .then((r) => r.json())
      .then((d) => { setSubscription(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function startCheckout(tier: string) {
    setCheckoutLoading(tier)
    try {
      const plan = PLANS[tier as keyof typeof PLANS]
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, priceId: plan.priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Failed to start checkout')
    } catch { toast.error('Failed') }
    finally { setCheckoutLoading(null) }
  }

  async function openPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Failed')
    } catch { toast.error('Failed') }
    finally { setPortalLoading(false) }
  }

  const currentTier = subscription?.planTier || 'STARTER'
  const isActive = subscription?.status === 'ACTIVE' || subscription?.status === 'TRIALING'

  return (
    <div>
      <Header title="Billing & Subscription" />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Current plan */}
        {!loading && subscription && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">Current Plan</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-black text-text-primary">{subscription.planTier}</span>
                  <span className={`badge ${isActive ? 'badge-green' : 'badge-yellow'}`}>
                    {subscription.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {subscription.requestsPerMonth >= 999999 ? 'Unlimited' : subscription.requestsPerMonth} requests/month ·{' '}
                  {subscription.usersAllowed >= 999999 ? 'Unlimited' : subscription.usersAllowed} users
                </p>
                {subscription.currentPeriodEnd && (
                  <p className="text-xs text-text-muted mt-1">
                    {subscription.cancelAtPeriodEnd ? 'Cancels' : 'Renews'}{' '}
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}
                {subscription.trialEndAt && subscription.status === 'TRIALING' && (
                  <p className="text-xs text-accent mt-1">
                    Free trial ends {formatDate(subscription.trialEndAt)}
                  </p>
                )}
              </div>
              {subscription.stripeCustomerId && (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="btn-secondary btn"
                >
                  {portalLoading ? 'Loading...' : 'Manage Billing'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plan cards */}
        <h2 className="text-lg font-bold text-text-primary">Choose a Plan</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {Object.values(PLANS).map((plan) => {
            const isCurrent = currentTier === plan.tier && isActive
            return (
              <div
                key={plan.tier}
                className={`card p-5 relative flex flex-col ${
                  'popular' in plan && plan.popular ? 'border-primary ring-1 ring-primary/30' : ''
                }`}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black">${plan.price}</span>
                    <span className="text-text-muted text-sm">/month</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {plan.requests === -1 ? 'Unlimited requests' : `${plan.requests} requests/month`}
                  </p>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div className="btn btn-secondary w-full cursor-default opacity-70">Current Plan ✓</div>
                ) : (
                  <button
                    onClick={() => startCheckout(plan.tier)}
                    disabled={!!checkoutLoading}
                    className={`btn w-full ${'popular' in plan && plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {checkoutLoading === plan.tier ? 'Loading...' : isCurrent ? 'Current Plan' : 'Select Plan'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-text-muted text-center">
          All plans include a 14-day free trial. Cancel anytime. Prices are per agency per month.
          Secure billing powered by Stripe.
        </p>
      </div>
    </div>
  )
}
