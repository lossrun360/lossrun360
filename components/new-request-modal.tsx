'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NewRequestModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [dotInput, setDotInput] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    dba: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  })

  const resetModal = useCallback(() => {
    setStep(1)
    setDotInput('')
    setLookupLoading(false)
    setSubmitting(false)
    setForm({ companyName: '', dba: '', address: '', city: '', state: '', zip: '', phone: '', email: '' })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose() } }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose, resetModal])

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = ''; resetModal() }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, resetModal])

  function updateForm(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleDOTLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!dotInput.trim()) return
    setLookupLoading(true)
    try {
      const res = await fetch(`/api/dot-lookup?dot=${encodeURIComponent(dotInput.trim())}`)
      const data = await res.json()
      if (!data.found) { toast.error(data.error || 'Carrier not found.'); return }
      setForm(prev => ({
        ...prev,
        companyName: data.companyName || '',
        dba: data.dbaName || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        phone: data.phone || '',
        email: data.email || '',
      }))
      setStep(2)
      toast.success(`Found: ${data.companyName}`)
    } catch { toast.error('Failed to lookup DOT number') } finally { setLookupLoading(false) }
  }

  async function handleSubmit() {
    if (!form.companyName || !dotInput) { toast.error('Company name and DOT# are required'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotNumber: dotInput.trim(),
          companyName: form.companyName,
          dba: form.dba,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
          email: form.email,
          insuredEmail: form.email,
          carriers: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create request'); return }
      toast.success('Request created!')
      onClose(); resetModal()
      router.push(`/requests/${data.id}`); router.refresh()
    } catch { toast.error('Failed to create request') } finally { setSubmitting(false) }
  }

  if (!isOpen) return null

  const ovl: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }
  const box: React.CSSProperties = { background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '540px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }
  const hdr: React.CSSProperties = { background: '#1c6edd', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
  const inp: React.CSSProperties = { display: 'block', width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }
  const btnP: React.CSSProperties = { flex: 1, padding: '11px', background: '#1c6edd', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }
  const btnS: React.CSSProperties = { padding: '11px 20px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div style={ovl} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={box}>
        <div style={hdr}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: 0 }}>New Loss Run Request</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: '2px 0 0' }}>
              {step === 1 ? 'Look up carrier by USDOT number' : 'Review and confirm carrier information'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>&#x2715;</button>
        </div>
        <div style={{ padding: '24px' }}>
          {step === 1 && (
            <form onSubmit={handleDOTLookup}>
              <label style={lbl}>USDOT Number *</label>
              <input
                style={{ ...inp, fontSize: '16px', padding: '12px', letterSpacing: '1px' }}
                placeholder="e.g. 1234567"
                value={dotInput}
                onChange={(e) => setDotInput(e.target.value)}
                autoFocus
              />
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 20px' }}>Enter the carrier&apos;s USDOT number to auto-fill information from FMCSA.</p>
              <button type="submit" style={{ ...btnP, display: 'block', width: '100%', opacity: lookupLoading || !dotInput.trim() ? 0.6 : 1 }} disabled={lookupLoading || !dotInput.trim()}>
                {lookupLoading ? 'Looking up...' : 'Look Up Carrier'}
              </button>
            </form>
          )}
          {step === 2 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Legal Company Name *</label>
                  <input style={inp} value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} placeholder="Legal company name" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>DBA / Trade Name</label>
                  <input style={inp} value={form.dba} onChange={(e) => updateForm('dba', e.target.value)} placeholder="DBA or trade name (if different)" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>USDOT #</label>
                  <input style={{ ...inp, background: '#f8fafc', color: '#64748b' }} value={dotInput} readOnly />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Street Address</label>
                  <input style={inp} value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Street address" />
                </div>
                <div>
                  <label style={lbl}>City</label>
                  <input style={inp} value={form.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="City" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={lbl}>State</label>
                    <input style={inp} value={form.state} onChange={(e) => updateForm('state', e.target.value)} placeholder="ST" maxLength={2} />
                  </div>
                  <div>
                    <label style={lbl}>Zip</label>
                    <input style={inp} value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} placeholder="12345" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Phone</label>
                  <input style={inp} value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="(555) 555-5555" />
                </div>
                <div>
                  <label style={lbl}>Email</label>
                  <input style={inp} type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="contact@company.com" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(1)} style={btnS}>Back</button>
                <button onClick={handleSubmit} style={{ ...btnP, opacity: submitting || !form.companyName ? 0.6 : 1 }} disabled={submitting || !form.companyName}>
                  {submitting ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}