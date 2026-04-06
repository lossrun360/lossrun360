'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [agency, setAgency] = useState<any>(null)

  const [agencyForm, setAgencyForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', zip: '', website: '', licenseNumber: '',
  })
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        setAgency(d.agency)
        setAgencyForm({
          name: d.agency?.name || '',
          phone: d.agency?.phone || '',
          address: d.agency?.address || '',
          city: d.agency?.city || '',
          state: d.agency?.state || '',
          zip: d.agency?.zip || '',
          website: d.agency?.website || '',
          licenseNumber: d.agency?.licenseNumber || '',
        })
        setProfileForm({ name: d.user?.name || '', email: d.user?.email || '' })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function saveAgency(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings/agency', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agencyForm),
      })
      if (!res.ok) { toast.error('Failed to save'); return }
      toast.success('Agency settings saved')
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) { toast.error('Failed to save'); return }
      await update({ name: profileForm.name })
      toast.success('Profile updated')
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordForm.newPass !== passwordForm.confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: passwordForm.current, newPassword: passwordForm.newPass }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed'); return }
      toast.success('Password changed')
      setPasswordForm({ current: '', newPass: '', confirm: '' })
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const isAdmin = session?.user?.role === 'AGENCY_ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  if (loading) return (
    <div className="p-6 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-xl"/>)}
    </div>
  )

  return (
    <div>
      <Header title="Settings" />
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        {/* Agency settings — admin only */}
        {isAdmin && (
          <div className="card p-6">
            <h2 className="text-base font-bold mb-4">Agency Settings</h2>
            <form onSubmit={saveAgency} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Agency Name</label>
                  <input className="input" value={agencyForm.name} onChange={(e) => setAgencyForm(p => ({...p, name: e.target.value}))} required/>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={agencyForm.phone} onChange={(e) => setAgencyForm(p => ({...p, phone: e.target.value}))}/>
                </div>
                <div>
                  <label className="label">License Number</label>
                  <input className="input" value={agencyForm.licenseNumber} onChange={(e) => setAgencyForm(p => ({...p, licenseNumber: e.target.value}))}/>
                </div>
                <div className="col-span-2">
                  <label className="label">Street Address</label>
                  <input className="input" value={agencyForm.address} onChange={(e) => setAgencyForm(p => ({...p, address: e.target.value}))}/>
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" value={agencyForm.city} onChange={(e) => setAgencyForm(p => ({...p, city: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label">State</label>
                    <input className="input" value={agencyForm.state} maxLength={2} onChange={(e) => setAgencyForm(p => ({...p, state: e.target.value}))}/>
                  </div>
                  <div>
                    <label className="label">ZIP</label>
                    <input className="input" value={agencyForm.zip} onChange={(e) => setAgencyForm(p => ({...p, zip: e.target.value}))}/>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="label">Website</label>
                  <input className="input" type="url" value={agencyForm.website} onChange={(e) => setAgencyForm(p => ({...p, website: e.target.value}))} placeholder="https://..."/>
                </div>
              </div>
              <button type="submit" className="btn-primary btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Agency Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Profile */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-4">Your Profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="label">Display Name</label>
              <input className="input" value={profileForm.name} onChange={(e) => setProfileForm(p => ({...p, name: e.target.value}))}/>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({...p, email: e.target.value}))} disabled/>
              <p className="text-xs text-text-muted mt-1">Contact support to change your email.</p>
            </div>
            <button type="submit" className="btn-primary btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-4">Change Password</h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input className="input" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({...p, current: e.target.value}))} required/>
            </div>
            <div>
              <label className="label">New Password</label>
              <input className="input" type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm(p => ({...p, newPass: e.target.value}))} required minLength={8}/>
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input className="input" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({...p, confirm: e.target.value}))} required/>
            </div>
            <button type="submit" className="btn-primary btn" disabled={saving}>
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
