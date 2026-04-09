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
  const [operatingStatus, setOperatingStatus] = useState<string>('')
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
    setOperatingStatus('')
    setForm({ companyName: '', dba: '', address: '', city: '', state: '', zip: '', phone: '', email: '' })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose() } }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

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
      setOperatingStatus(data.operatingStatus || '')
      setStep(2)
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
          insuredEmail: form.email || undefined,
          carriers: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create request'); return }
      toast.success('Draft created!')
      onClose(); resetModal()
      router.push(`/requests/${data.id}`); router.refresh()
    } catch { toast.error('Failed to create request') } finally { setSubmitting(false) }
  }

  if (!isOpen) return null

  const inp: React.CSSProperties = { display: 'block', width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '5px' }
  const btnP: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 16px', background: '#1c6edd', color: '#fff', borderRadius: '3px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnS: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 16px', background: '#f1f5f9', color: '#475569', borderRadius: '3px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      <div style={{ background: '#f8fafc', borderRadius: '4px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 64px rgba(15,23,42,0.22)', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>New Loss Run Request</h2>
          <button onClick={onClose} style={{ width: '28px', height: '28px', border: 'none', background: '#f1f5f9', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Step 1: DOT Lookup */}
          {step === 1 && (
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Enter USDOT Number</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>We&apos;ll pull the carrier&apos;s info and insurance history from FMCSA.</p>
              </div>
              <form onSubmit={handleDOTLookup}>
                <label style={lbl}>USDOT Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    style={{ ...inp, fontSize: '16px', fontFamily: 'monospace', flex: 1 }}
                    placeholder="e.g. 1234567"
                    value={dotInput}
                    onChange={(e) => setDotInput(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    autoFocus
                    required
                  />
                  <button type="submit" style={{ ...btnP, flexShrink: 0, opacity: lookupLoading ? 0.7 : 1 }} disabled={lookupLoading}>
                    {lookupLoading
                      ? <><span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Looking...</>
                      : 'Lookup'}
                  </button>
                </div>
              </form>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', margin: '0 0 8px' }}>WHAT GETS PULLED AUTOMATICALLY</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  {['Legal company name & DBA', 'Address & contact info', 'USDOT & operating status', '5-year insurance history'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>&#10003;</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review Info */}
          {step === 2 && (
            <>
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '3px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '15px' }}>&#10003;</span>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', margin: 0 }}>
                  FMCSA Data Retrieved &mdash; DOT# {dotInput}{operatingStatus ? ` Â· ${operatingStatus}` : ''}
                </p>
              </div>

              <div style={cardStyle}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>Insured Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={lbl}>Legal Company Name *</label>
                    <input style={inp} value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} required />
                  </div>
                  <div>
                    <label style={lbl}>DBA / Trade Name</label>
                    <input style={inp} value={form.dba} onChange={(e) => updateForm('dba', e.target.value)} placeholder="(if different)" />
                  </div>
                  <div>
                    <label style={lbl}>USDOT#</label>
                    <input style={{ ...inp, background: '#f8fafc', color: '#64748b', fontFamily: 'monospace' }} value={dotInput} readOnly />
                  </div>
                  <div>
                    <label style={lbl}>Phone</label>
                    <input style={inp} value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="(555) 555-5555" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Street Address</label>
                    <input style={inp} value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>City</label>
                    <input style={inp} value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={lbl}>State</label>
                      <input style={inp} value={form.state} onChange={(e) => updateForm('state', e.target.value)} maxLength={2} />
                    </div>
                    <div>
                      <label style={lbl}>ZIP</label>
                      <input style={inp} value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Email</label>
                    <input style={inp} type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="contact@company.com" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setStep(1)} style={btnS}>&#8592; Back</button>
                <button
                  onClick={handleSubmit}
                  style={{ ...btnP, opacity: submitting || !form.companyName ? 0.6 : 1 }}
                  disabled={submitting || !form.companyName}
                >
                  {submitting ? 'Creating Draft...' : 'Create Draft'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
