'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { DOTLookupResult } from '@/lib/fmcsa'
import type { InsuranceCarrier } from '@/types'

type Step = 1 | 2 | 3

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NewRequestModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [dotInput, setDotInput] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResult, setLookupResult] = useState<DOTLookupResult | null>(null)
  const [carriers, setCarriers] = useState<InsuranceCarrier[]>([])
  const [selectedCarrierIds, setSelectedCarrierIds] = useState<string[]>([])
  const [customCarriers, setCustomCarriers] = useState<{ name: string; email: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    companyName: '', dba: '', ownerName: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '', mcNumber: '', entityType: '', operationType: '',
    totalTrucks: '', totalDrivers: '', yearsRequested: '5', policyType: 'Auto Liability',
    insuredEmail: '', ccEmails: '', notes: '',
  })

  const resetModal = useCallback(() => {
    setStep(1); setDotInput(''); setLookupLoading(false); setLookupResult(null)
    setCarriers([]); setSelectedCarrierIds([]); setCustomCarriers([]); setSubmitting(false)
    setForm({ companyName: '', dba: '', ownerName: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '', mcNumber: '', entityType: '', operationType: '',
      totalTrucks: '', totalDrivers: '', yearsRequested: '5', policyType: 'Auto Liability',
      insuredEmail: '', ccEmails: '', notes: '' })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose(); resetModal() } }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose, resetModal])

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = ''; resetModal() }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, resetModal])

  function updateForm(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleDOTLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!dotInput.trim()) return
    setLookupLoading(true)
    try {
      const res = await fetch(`/api/dot-lookup?dot=${encodeURIComponent(dotInput.trim())}`)
      const data = await res.json()
      if (!data.found) { toast.error(data.error || 'Carrier not found.'); return }
      setLookupResult(data)
      setForm((prev) => ({ ...prev, companyName: data.companyName || '', dba: data.dbaName || '',
        ownerName: data.ownerName || '', address: data.address || '', city: data.city || '',
        state: data.state || '', zip: data.zip || '', phone: data.phone || '', email: data.email || '',
        mcNumber: data.mcNumber || '', entityType: data.entityType || '', operationType: data.operationType || '',
        totalTrucks: data.totalTrucks?.toString() || '', totalDrivers: data.totalDrivers?.toString() || '',
        insuredEmail: data.email || '' }))
      const carriersRes = await fetch('/api/carriers?specialties=trucking&limit=50')
      const carriersData = await carriersRes.json()
      setCarriers(carriersData.carriers || [])
      setStep(2)
      toast.success(`Found: ${data.companyName}`)
    } catch { toast.error('Failed to lookup DOT number') }
    finally { setLookupLoading(false) }
  }

  async function handleSubmit() {
    if (!form.companyName || !dotInput) { toast.error('Company name and DOT# are required'); return }
    if (!form.insuredEmail) { toast.error('Insured email is required'); return }
    const allCarriers = [
      ...selectedCarrierIds.map((id) => { const c = carriers.find((x) => x.id === id); return c ? { carrierId: c.id, carrierName: c.name, carrierEmail: c.lossRunEmail } : null }).filter(Boolean),
      ...customCarriers.filter((c) => c.name),
    ]
    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dotNumber: dotInput.trim(), mcNumber: form.mcNumber, companyName: form.companyName,
          dba: form.dba, ownerName: form.ownerName, address: form.address, city: form.city, state: form.state,
          zip: form.zip, phone: form.phone, email: form.email, entityType: form.entityType,
          operationType: form.operationType, totalTrucks: form.totalTrucks ? parseInt(form.totalTrucks) : undefined,
          totalDrivers: form.totalDrivers ? parseInt(form.totalDrivers) : undefined,
          yearsRequested: parseInt(form.yearsRequested), policyType: form.policyType, insuredEmail: form.insuredEmail,
          ccEmails: form.ccEmails ? form.ccEmails.split(/[,;\n]/).map((e) => e.trim()).filter(Boolean) : [],
          notes: form.notes, carriers: allCarriers }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create request'); return }
      toast.success('Request created!')
      onClose(); resetModal()
      router.push(`/requests/${data.id}`); router.refresh()
    } catch { toast.error('Failed to create request') }
    finally { setSubmitting(false) }
  }

  const toggleCarrier = (id: string) => setSelectedCarrierIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const addCustomCarrier = () => setCustomCarriers((prev) => [...prev, { name: '', email: '' }])
  const updateCustomCarrier = (i: number, key: 'name' | 'email', value: string) => setCustomCarriers((prev) => { const next = [...prev]; next[i] = { ...next[i], [key]: value }; return next })
  const removeCustomCarrier = (i: number) => setCustomCarriers((prev) => prev.filter((_, idx) => idx !== i))

  if (!isOpen) return null

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }
  const inp: React.CSSProperties = { display: 'block', width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '5px' }
  const btnP: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '3px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnS: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 16px', background: '#f1f5f9', color: '#475569', borderRadius: '3px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      <div style={{ background: '#f8fafc', borderRadius: '4px', width: '100%', maxWidth: '680px', boxShadow: '0 24px 64px rgba(15,23,42,0.22)', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>New Loss Run Request</h2>
          <button onClick={onClose} style={{ width: '28px', height: '28px', border: 'none', background: '#f1f5f9', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Enter USDOT Number</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>We'll pull the carrier's info and insurance history from FMCSA.</p>
              </div>
              <form onSubmit={handleDOTLookup}>
                <label style={lbl}>USDOT Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" style={{ ...inp, fontSize: '16px', fontFamily: 'monospace', flex: 1 }} placeholder="e.g. 1234567" value={dotInput} onChange={(e) => setDotInput(e.target.value.replace(/\D/g, ''))} maxLength={10} autoFocus required />
                  <button type="submit" style={{ ...btnP, flexShrink: 0, opacity: lookupLoading ? 0.7 : 1 }} disabled={lookupLoading}>
                    {lookupLoading ? <><span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Looking...</> : 'Lookup'}
                  </button>
                </div>
              </form>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', margin: '0 0 8px' }}>WHAT GETS PULLED AUTOMATICALLY</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  {['Legal company name & DBA', 'Owner / operator name', 'Address & contact info', 'Entity type', 'Fleet size (trucks & drivers)', '5-year insurance history'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>&#10003;</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && lookupResult && (
            <>
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '3px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '15px' }}>&#10003;</span>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', margin: 0 }}>FMCSA Data Retrieved &mdash; DOT# {dotInput} &middot; {lookupResult.operatingStatus || 'ACTIVE'} &middot; {lookupResult.insuranceHistory?.length || 0} records</p>
                </div>
              </div>

              <div style={card}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>Insured Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><label style={lbl}>Legal Company Name *</label><input style={inp} value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} required /></div>
                  <div><label style={lbl}>DBA / Trade Name</label><input style={inp} value={form.dba} onChange={(e) => updateForm('dba', e.target.value)} placeholder="(if different)" /></div>
                  <div><label style={lbl}>USDOT#</label><input style={{ ...inp, background: '#f8fafc', color: '#64748b', fontFamily: 'monospace' }} value={dotInput} disabled /></div>
                  <div><label style={lbl}>MC# / FF#</label><input style={inp} value={form.mcNumber} onChange={(e) => updateForm('mcNumber', e.target.value)} placeholder="MC-000000" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Street Address</label><input style={inp} value={form.address} onChange={(e) => updateForm('address', e.target.value)} /></div>
                  <div><label style={lbl}>City</label><input style={inp} value={form.city} onChange={(e) => updateForm('city', e.target.value)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><label style={lbl}>State</label><input style={inp} value={form.state} onChange={(e) => updateForm('state', e.target.value)} maxLength={2} /></div>
                    <div><label style={lbl}>ZIP</label><input style={inp} value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} /></div>
                  </div>
                  <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} /></div>
                  <div><label style={lbl}>Owner / Operator</label><input style={inp} value={form.ownerName} onChange={(e) => updateForm('ownerName', e.target.value)} /></div>
                  <div>
                    <label style={lbl}>Entity Type</label>
                    <select style={inp} value={form.entityType} onChange={(e) => updateForm('entityType', e.target.value)}>
                      <option value="">Select...</option>
                      {['Sole Proprietor','Partnership','Corporation','Limited Liability Company','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Operation Type</label>
                    <select style={inp} value={form.operationType} onChange={(e) => updateForm('operationType', e.target.value)}>
                      <option value="">Select...</option>
                      {['Common Carrier','Contract Carrier','Exempt Carrier','Private Carrier','Broker','Freight Forwarder'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label style={lbl}># of Power Units</label><input style={inp} type="number" value={form.totalTrucks} onChange={(e) => updateForm('totalTrucks', e.target.value)} min="0" /></div>
                  <div><label style={lbl}># of Drivers</label><input style={inp} type="number" value={form.totalDrivers} onChange={(e) => updateForm('totalDrivers', e.target.value)} min="0" /></div>
                </div>
              </div>

              {lookupResult.insuranceHistory && lookupResult.insuranceHistory.length > 0 && (
                <div style={card}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px' }}>
                    Insurance History from FMCSA{' '}
                    <span style={{ marginLeft: '6px', background: '#ede9fe', color: '#6366f1', fontSize: '10px', fontWeight: '600', padding: '1px 7px', borderRadius: '4px' }}>{lookupResult.insuranceHistory.length} records</span>
                  </h4>
                  {lookupResult.insuranceHistory.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < lookupResult.insuranceHistory!.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div><p style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a', margin: '0 0 1px' }}>{h.insurerName}</p><p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{h.policyType} &middot; #{h.policyNumber || 'N/A'}</p></div>
                      <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                        {h.coverageFrom && <p style={{ margin: 0 }}>{h.coverageFrom}</p>}
                        {h.coverageTo && <p style={{ margin: 0 }}>to {h.coverageTo}</p>}
                        {h.coverageAmount && <p style={{ margin: 0, color: '#10b981', fontWeight: '500' }}>${h.coverageAmount.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={card}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>Request Settings</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={lbl}>Years of History</label>
                    <select style={inp} value={form.yearsRequested} onChange={(e) => updateForm('yearsRequested', e.target.value)}>
                      {[3,4,5,6,7].map(y => <option key={y} value={y}>{y} Years</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Policy / Coverage Type</label>
                    <select style={inp} value={form.policyType} onChange={(e) => updateForm('policyType', e.target.value)}>
                      {['Auto Liability','General Liability','Cargo','Physical Damage','Non-Trucking Liability','All Lines'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={card}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Select Carriers</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>Choose which carriers to send the loss run request to.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {carriers.map((carrier) => (
                    <label key={carrier.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '3px', border: `1px solid ${selectedCarrierIds.includes(carrier.id) ? 'rgba(99,102,241,0.4)' : '#e2e8f0'}`, background: selectedCarrierIds.includes(carrier.id) ? 'rgba(99,102,241,0.04)' : '#fff', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: '14px', height: '14px', accentColor: '#6366f1' }} checked={selectedCarrierIds.includes(carrier.id)} onChange={() => toggleCarrier(carrier.id)} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a', margin: 0 }}>{carrier.name}</p>
                        {carrier.lossRunEmail && <p style={{ fontSize: '11px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{carrier.lossRunEmail}</p>}
                      </div>
                    </label>
                  ))}
                </div>
                {customCarriers.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Custom Carriers</p>
                    {customCarriers.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input style={{ ...inp, flex: 1 }} placeholder="Carrier name" value={c.name} onChange={(e) => updateCustomCarrier(i, 'name', e.target.value)} />
                        <input style={{ ...inp, flex: 1 }} placeholder="Loss run email" type="email" value={c.email} onChange={(e) => updateCustomCarrier(i, 'email', e.target.value)} />
                        <button type="button" onClick={() => removeCustomCarrier(i)} style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>&#10005;</button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={addCustomCarrier} style={{ marginTop: '10px', fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>+ Add custom carrier</button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep(1)} style={btnS}>&#8592; Back</button>
                <button onClick={() => setStep(3)} style={{ ...btnP, flex: 1, opacity: !form.companyName ? 0.5 : 1 }} disabled={!form.companyName}>Continue &#8594;</button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div style={card}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>Request Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px' }}>Insured</p>
                    <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 2px' }}>{form.companyName}</p>
                    <p style={{ color: '#64748b', margin: '0 0 1px', fontSize: '12px' }}>DOT# {dotInput}{form.mcNumber ? ` Â· ${form.mcNumber}` : ''}</p>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>{[form.city, form.state].filter(Boolean).join(', ')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px' }}>Request</p>
                    <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 2px' }}>{form.yearsRequested} Years &middot; {form.policyType}</p>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>{selectedCarrierIds.length + customCarriers.filter(c => c.name).length} carrier(s) selected</p>
                  </div>
                </div>
              </div>

              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Signature & Delivery</h4>
                <div>
                  <label style={lbl}>Insured&apos;s Email *</label>
                  <input type="email" style={inp} placeholder="insured@company.com" value={form.insuredEmail} onChange={(e) => updateForm('insuredEmail', e.target.value)} required />
                  <p style={{ marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>The authorization form will be sent here for e-signature.</p>
                </div>
                <div>
                  <label style={lbl}>CC Emails (Optional)</label>
                  <textarea style={{ display: 'block', width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none' }} rows={2} placeholder="agent@agency.com, manager@agency.com" value={form.ccEmails} onChange={(e) => updateForm('ccEmails', e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Notes (Optional)</label>
                  <textarea style={{ display: 'block', width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none' }} rows={2} placeholder="Any additional notes..." value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep(2)} style={btnS}>&#8592; Back</button>
                <button onClick={handleSubmit} style={{ ...btnP, flex: 1, opacity: submitting || !form.insuredEmail ? 0.6 : 1 }} disabled={submitting || !form.insuredEmail}>
                  {submitting ? <><span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Creating...</> : 'Create & Send for Signature'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
