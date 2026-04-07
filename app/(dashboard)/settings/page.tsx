'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PLANS } from '@/lib/stripe'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingAgency, setEditingAgency] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)

  const [agencyForm, setAgencyForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', zip: '', website: '', licenseNumber: '',
  })
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [subscription, setSubscription] = useState<any>(null)
  const [billingLoading, setBillingLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        setAgencyForm({
          name: d.agency?.name || '', phone: d.agency?.phone || '',
          address: d.agency?.address || '', city: d.agency?.city || '',
          state: d.agency?.state || '', zip: d.agency?.zip || '',
          website: d.agency?.website || '', licenseNumber: d.agency?.licenseNumber || '',
        })
        setProfileForm({ name: d.user?.name || '', email: d.user?.email || '' })
        setLoading(false)
      })
      .catch(() => setLoading(false))
    fetch('/api/billing/subscription')
      .then((r) => r.json())
      .then((d) => { setSubscription(d); setBillingLoading(false) })
      .catch(() => setBillingLoading(false))
  }, [])

  async function saveAgency(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings/agency', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agencyForm),
      })
      if (!res.ok) { toast.error('Failed to save'); return }
      toast.success('Agency settings saved')
      setEditingAgency(false)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileForm),
      })
      if (!res.ok) { toast.error('Failed to save'); return }
      await update({ name: profileForm.name })
      toast.success('Profile updated')
      setEditingProfile(false)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordForm.newPass !== passwordForm.confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: passwordForm.current, newPassword: passwordForm.newPass }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed'); return }
      toast.success('Password changed')
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      setEditingPassword(false)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  async function startCheckout(tier: string) {
    setCheckoutLoading(tier)
    try {
      const plan = PLANS[tier as keyof typeof PLANS]
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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

  const isAdmin = session?.user?.role === 'AGENCY_ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  const currentTier = subscription?.planTier || 'STARTER'
  const isActive = subscription?.status === 'ACTIVE' || subscription?.status === 'TRIALING'

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }
  const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '4px' }
  const btnP: React.CSSProperties = { padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
  const btnS: React.CSSProperties = { padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
  const btnEdit: React.CSSProperties = { padding: '5px 12px', background: 'transparent', color: '#6366f1', border: '1px solid #6366f1', borderRadius: '3px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }

  if (loading) return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 40px' }}>
      <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '4px' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', marginBottom: 0 }}>Manage your agency, profile, and billing</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Agency Settings */}
        {isAdmin && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Agency Settings</h2>
              {!editingAgency && (
                <button onClick={() => setEditingAgency(true)} style={btnEdit}>Edit</button>
              )}
            </div>
            {editingAgency ? (
              <form onSubmit={saveAgency}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Agency Name</label>
                    <input style={inp} value={agencyForm.name} onChange={(e) => setAgencyForm(p => ({...p, name: e.target.value}))} required />
                  </div>
                  <div>
                    <label style={lbl}>Phone</label>
                    <input style={inp} value={agencyForm.phone} onChange={(e) => setAgencyForm(p => ({...p, phone: e.target.value}))} />
                  </div>
                  <div>
                    <label style={lbl}>License Number</label>
                    <input style={inp} value={agencyForm.licenseNumber} onChange={(e) => setAgencyForm(p => ({...p, licenseNumber: e.target.value}))} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Street Address</label>
                    <input style={inp} value={agencyForm.address} onChange={(e) => setAgencyForm(p => ({...p, address: e.target.value}))} />
                  </div>
                  <div>
                    <label style={lbl}>City</label>
                    <input style={inp} value={agencyForm.city} onChange={(e) => setAgencyForm(p => ({...p, city: e.target.value}))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={lbl}>State</label>
                      <input style={inp} value={agencyForm.state} maxLength={2} onChange={(e) => setAgencyForm(p => ({...p, state: e.target.value}))} />
                    </div>
                    <div>
                      <label style={lbl}>ZIP</label>
                      <input style={inp} value={agencyForm.zip} onChange={(e) => setAgencyForm(p => ({...p, zip: e.target.value}))} />
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Website</label>
                    <input style={inp} type="url" value={agencyForm.website} onChange={(e) => setAgencyForm(p => ({...p, website: e.target.value}))} placeholder="https://..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={btnP} disabled={saving}>{saving ? 'Saving...' : 'Save Agency Settings'}</button>
                  <button type="button" style={btnS} onClick={() => setEditingAgency(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <ReadOnlyField label="Agency Name" value={agencyForm.name} wide />
                <ReadOnlyField label="Phone" value={agencyForm.phone} />
                <ReadOnlyField label="License Number" value={agencyForm.licenseNumber} />
                <ReadOnlyField label="Address" value={[agencyForm.address, agencyForm.city, agencyForm.state, agencyForm.zip].filter(Boolean).join(', ')} wide />
                <ReadOnlyField label="Website" value={agencyForm.website} wide />
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Your Profile</h2>
              {!editingProfile && (
                <button onClick={() => setEditingProfile(true)} style={btnEdit}>Edit</button>
              )}
            </div>
            {editingProfile ? (
              <form onSubmit={saveProfile}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={lbl}>Display Name</label>
                  <input style={inp} value={profileForm.name} onChange={(e) => setProfileForm(p => ({...p, name: e.target.value}))} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Email</label>
                  <input style={{ ...inp, opacity: 0.6 }} type="email" value={profileForm.email} disabled />
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', marginBottom: 0 }}>Contact support to change your email.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={btnP} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
                  <button type="button" style={btnS} onClick={() => setEditingProfile(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <ReadOnlyField label="Display Name" value={profileForm.name} />
                <ReadOnlyField label="Email" value={profileForm.email} />
              </div>
            )}
          </div>

          {/* Password */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Change Password</h2>
              {!editingPassword && (
                <button onClick={() => setEditingPassword(true)} style={btnEdit}>Edit</button>
              )}
            </div>
            {editingPassword ? (
              <form onSubmit={changePassword}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={lbl}>Current Password</label>
                  <input style={inp} type="password" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({...p, current: e.target.value}))} required />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={lbl}>New Password</label>
                  <input style={inp} type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm(p => ({...p, newPass: e.target.value}))} required minLength={8} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Confirm New Password</label>
                  <input style={inp} type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({...p, confirm: e.target.value}))} required />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={btnP} disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
                  <button type="button" style={btnS} onClick={() => setEditingPassword(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', margin: '0 0 2px' }}>Password</p>
                  <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, letterSpacing: '2px' }}>••••••••</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Billing */}
      <div style={{ ...card }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Billing & Subscription</h2>
          {subscription?.stripeCustomerId && (
            <button onClick={openPortal} disabled={portalLoading} style={btnS}>
              {portalLoading ? 'Loading...' : 'Manage Billing'}
            </button>
          )}
        </div>
        {!billingLoading && subscription && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Current Plan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{subscription.planTier}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: isActive ? '#d1fae5' : '#fef3c7', color: isActive ? '#065f46' : '#92400e' }}>
                  {subscription.status}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                {subscription.requestsPerMonth >= 999999 ? 'Unlimited' : subscription.requestsPerMonth} requests/month &middot;{' '}
                {subscription.usersAllowed >= 999999 ? 'Unlimited' : subscription.usersAllowed} users
              </p>
            </div>
            {subscription.currentPeriodEnd && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {subscription.cancelAtPeriodEnd ? 'Cancels' : 'Renews'} {formatDate(subscription.currentPeriodEnd)}
                </div>
                {subscription.trialEndAt && subscription.status === 'TRIALING' && (
                  <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '2px' }}>
                    Free trial ends {formatDate(subscription.trialEndAt)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Object.values(PLANS).map((plan) => {
            const isCurrent = currentTier === plan.tier && isActive
            const isPopular = 'popular' in plan && plan.popular
            return (
              <div key={plan.tier} style={{ background: '#fff', border: `1px solid ${isPopular ? '#6366f1' : '#e2e8f0'}`, borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: isPopular ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none' }}>
                {isPopular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                    <span style={{ background: '#6366f1', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Most Popular</span>
                  </div>
                )}
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>${plan.price}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>/month</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', marginBottom: 0 }}>
                    {plan.requests === -1 ? 'Unlimited requests' : `${plan.requests} requests/month`}
                  </p>
                </div>
                <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px', fontSize: '12px', color: '#64748b' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
                        <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div style={{ ...btnS, textAlign: 'center', opacity: 0.7, cursor: 'default' }}>Current Plan ✓</div>
                ) : (
                  <button onClick={() => startCheckout(plan.tier)} disabled={!!checkoutLoading} style={{ padding: '8px 16px', background: isPopular ? '#6366f1' : '#f1f5f9', color: isPopular ? '#fff' : '#475569', border: isPopular ? 'none' : '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                    {checkoutLoading === plan.tier ? 'Loading...' : 'Select Plan'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
          All plans include a 14-day free trial. Cancel anytime. Prices are per agency per month. Secure billing powered by Stripe.
        </p>
      </div>
    </div>
  )
}

function ReadOnlyField({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : {}}>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#0f172a', margin: 0 }}>{value || <span style={{ color: '#cbd5e1' }}>—</span>}</p>
    </div>
  )
}
