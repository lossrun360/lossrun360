'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import toast from 'react-hot-toast'
import type { DOTLookupResult } from '@/lib/fmcsa'
import type { InsuranceCarrier } from '@/types'

type Step = 1 | 2 | 3

export default function NewRequestPage() {
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
    companyName: '',
    dba: '',
    ownerName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    mcNumber: '',
    entityType: '',
    operationType: '',
    totalTrucks: '',
    totalDrivers: '',
    yearsRequested: '5',
    policyType: 'Auto Liability',
    insuredEmail: '',
    ccEmails: '',
    notes: '',
  })

  function updateForm(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // ── Step 1: DOT Lookup ───────────────────────────────────────────────────────
  async function handleDOTLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!dotInput.trim()) return

    setLookupLoading(true)
    try {
      const res = await fetch(`/api/dot-lookup?dot=${encodeURIComponent(dotInput.trim())}`)
      const data = await res.json()

      if (!data.found) {
        toast.error(data.error || 'Carrier not found. Try a different DOT number.')
        return
      }

      setLookupResult(data)

      // Pre-fill form from FMCSA data
      setForm((prev) => ({
        ...prev,
        companyName: data.companyName || '',
        dba: data.dbaName || '',
        ownerName: data.ownerName || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        phone: data.phone || '',
        email: data.email || '',
        mcNumber: data.mcNumber || '',
        entityType: data.entityType || '',
        operationType: data.operationType || '',
        totalTrucks: data.totalTrucks?.toString() || '',
        totalDrivers: data.totalDrivers?.toString() || '',
        insuredEmail: data.email || '',
      }))

      // Fetch carrier database for step 2
      const carriersRes = await fetch('/api/carriers?specialties=trucking&limit=50')
      const carriersData = await carriersRes.json()
      setCarriers(carriersData.carriers || [])

      setStep(2)
      toast.success(`Found: ${data.companyName}`)
    } catch {
      toast.error('Failed to lookup DOT number')
    } finally {
      setLookupLoading(false)
    }
  }

  // ── Step 3: Submit ───────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!form.companyName || !dotInput) {
      toast.error('Company name and DOT# are required')
      return
    }
    if (!form.insuredEmail) {
      toast.error('Insured email is required to send for signature')
      return
    }

    const allCarriers = [
      ...selectedCarrierIds.map((id) => {
        const c = carriers.find((x) => x.id === id)
        return c ? { carrierId: c.id, carrierName: c.name, carrierEmail: c.lossRunEmail } : null
      }).filter(Boolean),
      ...customCarriers.filter((c) => c.name),
    ]

    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotNumber: dotInput.trim(),
          mcNumber: form.mcNumber,
          companyName: form.companyName,
          dba: form.dba,
          ownerName: form.ownerName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
          email: form.email,
          entityType: form.entityType,
          operationType: form.operationType,
          totalTrucks: form.totalTrucks ? parseInt(form.totalTrucks) : undefined,
          totalDrivers: form.totalDrivers ? parseInt(form.totalDrivers) : undefined,
          yearsRequested: parseInt(form.yearsRequested),
          policyType: form.policyType,
          insuredEmail: form.insuredEmail,
          ccEmails: form.ccEmails
            ? form.ccEmails.split(/[,;\n]/).map((e) => e.trim()).filter(Boolean)
            : [],
          notes: form.notes,
          carriers: allCarriers,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create request')
        return
      }

      toast.success('Request created successfully!')
      router.push(`/requests/${data.id}`)
    } catch {
      toast.error('Failed to create request')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCarrier = (id: string) => {
    setSelectedCarrierIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const addCustomCarrier = () => {
    setCustomCarriers((prev) => [...prev, { name: '', email: '' }])
  }

  const updateCustomCarrier = (i: number, key: 'name' | 'email', value: string) => {
    setCustomCarriers((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [key]: value }
      return next
    })
  }

  const removeCustomCarrier = (i: number) => {
    setCustomCarriers((prev) => prev.filter((_, idx) => idx !== i))
  }

  // ── Progress steps ───────────────────────────────────────────────────────────
  const steps = [
    { num: 1, label: 'DOT# Lookup' },
    { num: 2, label: 'Review & Carriers' },
    { num: 3, label: 'Send & Confirm' },
  ]

  return (
    <div>
      <Header title="New Loss Run Request" />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`step-dot ${
                    step > s.num ? 'completed' : step === s.num ? 'active' : 'pending'
                  }`}
                >
                  {step > s.num ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step === s.num ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${step > s.num ? 'bg-emerald-500/40' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: DOT Lookup ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Enter USDOT Number</h2>
              <p className="text-text-secondary text-sm">
                We&apos;ll instantly pull the carrier&apos;s info and 5-year insurance history from FMCSA.
              </p>
            </div>

            <form onSubmit={handleDOTLookup} className="space-y-4">
              <div>
                <label className="label">USDOT Number</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="input text-lg font-mono"
                    placeholder="e.g. 1234567"
                    value={dotInput}
                    onChange={(e) => setDotInput(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    autoFocus
                    required
                  />
                  <button
                    type="submit"
                    className="btn-primary btn px-6 shrink-0"
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Looking up...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Lookup
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  Don&apos;t know the DOT#? Try searching by company name below.
                </p>
              </div>
            </form>

            {/* Info box */}
            <div className="rounded-xl bg-surface-2 border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">What gets pulled automatically:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Legal company name & DBA',
                  'Owner / operator name',
                  'Address & contact info',
                  'Entity type',
                  'Fleet size (trucks & drivers)',
                  '5-year insurance carrier history',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Review & Carriers ──────────────────────────────────── */}
        {step === 2 && lookupResult && (
          <div className="space-y-5">
            {/* FMCSA result header */}
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-400">FMCSA Data Retrieved</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  DOT# {dotInput} · {lookupResult.operatingStatus || 'ACTIVE'} ·{' '}
                  {lookupResult.insuranceHistory?.length || 0} insurance records found
                </p>
              </div>
            </div>

            {/* Editable insured info */}
            <div className="card p-6 space-y-4">
              <h3 className="text-base font-bold">Insured Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Legal Company Name *</label>
                  <input className="input" value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} required/>
                </div>
                <div>
                  <label className="label">DBA / Trade Name</label>
                  <input className="input" value={form.dba} onChange={(e) => updateForm('dba', e.target.value)} placeholder="(if different)"/>
                </div>
                <div>
                  <label className="label">USDOT#</label>
                  <input className="input font-mono" value={dotInput} disabled/>
                </div>
                <div>
                  <label className="label">MC# / FF#</label>
                  <input className="input" value={form.mcNumber} onChange={(e) => updateForm('mcNumber', e.target.value)} placeholder="MC-000000"/>
                </div>
                <div className="col-span-2">
                  <label className="label">Street Address</label>
                  <input className="input" value={form.address} onChange={(e) => updateForm('address', e.target.value)}/>
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={(e) => updateForm('city', e.target.value)}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label">State</label>
                    <input className="input" value={form.state} onChange={(e) => updateForm('state', e.target.value)} maxLength={2}/>
                  </div>
                  <div>
                    <label className="label">ZIP</label>
                    <input className="input" value={form.zip} onChange={(e) => updateForm('zip', e.target.value)}/>
                  </div>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)}/>
                </div>
                <div>
                  <label className="label">Owner / Operator Name</label>
                  <input className="input" value={form.ownerName} onChange={(e) => updateForm('ownerName', e.target.value)}/>
                </div>
                <div>
                  <label className="label">Entity Type</label>
                  <select className="input" value={form.entityType} onChange={(e) => updateForm('entityType', e.target.value)}>
                    <option value="">Select...</option>
                    {['Sole Proprietor','Partnership','Corporation','Limited Liability Company','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Operation Type</label>
                  <select className="input" value={form.operationType} onChange={(e) => updateForm('operationType', e.target.value)}>
                    <option value="">Select...</option>
                    {['Common Carrier','Contract Carrier','Exempt Carrier','Private Carrier','Broker','Freight Forwarder'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label"># of Power Units</label>
                  <input className="input" type="number" value={form.totalTrucks} onChange={(e) => updateForm('totalTrucks', e.target.value)} min="0"/>
                </div>
                <div>
                  <label className="label"># of Drivers</label>
                  <input className="input" type="number" value={form.totalDrivers} onChange={(e) => updateForm('totalDrivers', e.target.value)} min="0"/>
                </div>
              </div>
            </div>

            {/* FMCSA Insurance History */}
            {lookupResult.insuranceHistory && lookupResult.insuranceHistory.length > 0 && (
              <div className="card p-5">
                <h3 className="text-base font-bold mb-3">
                  Insurance History from FMCSA
                  <span className="ml-2 badge badge-blue text-xs">{lookupResult.insuranceHistory.length} records</span>
                </h3>
                <div className="space-y-2">
                  {lookupResult.insuranceHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{h.insurerName}</p>
                        <p className="text-xs text-text-muted">{h.policyType} · #{h.policyNumber || 'N/A'}</p>
                      </div>
                      <div className="text-right text-xs text-text-secondary">
                        {h.coverageFrom && <p>{h.coverageFrom}</p>}
                        {h.coverageTo && <p>to {h.coverageTo}</p>}
                        {h.coverageAmount && (
                          <p className="text-emerald-400 font-medium">
                            ${h.coverageAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request settings */}
            <div className="card p-5">
              <h3 className="text-base font-bold mb-4">Request Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Years of History</label>
                  <select className="input" value={form.yearsRequested} onChange={(e) => updateForm('yearsRequested', e.target.value)}>
                    {[3,4,5,6,7].map(y => <option key={y} value={y}>{y} Years</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Policy / Coverage Type</label>
                  <select className="input" value={form.policyType} onChange={(e) => updateForm('policyType', e.target.value)}>
                    {['Auto Liability','General Liability','Cargo','Physical Damage','Non-Trucking Liability','All Lines'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Carrier selection */}
            <div className="card p-5">
              <h3 className="text-base font-bold mb-1">Select Carriers to Request From</h3>
              <p className="text-sm text-text-muted mb-4">
                Choose which insurance carriers to send the loss run request to.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {carriers.map((carrier) => (
                  <label
                    key={carrier.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCarrierIds.includes(carrier.id)
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border hover:border-border-2'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded text-primary w-4 h-4 shrink-0"
                      checked={selectedCarrierIds.includes(carrier.id)}
                      onChange={() => toggleCarrier(carrier.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{carrier.name}</p>
                      {carrier.lossRunEmail && (
                        <p className="text-xs text-text-muted truncate">{carrier.lossRunEmail}</p>
                      )}
                    </div>
                    {carrier.state && (
                      <span className="text-xs text-text-muted shrink-0">{carrier.state}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Custom carriers */}
              {customCarriers.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Custom Carriers</p>
                  {customCarriers.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className="input flex-1"
                        placeholder="Carrier name"
                        value={c.name}
                        onChange={(e) => updateCustomCarrier(i, 'name', e.target.value)}
                      />
                      <input
                        className="input flex-1"
                        placeholder="Loss run email"
                        type="email"
                        value={c.email}
                        onChange={(e) => updateCustomCarrier(i, 'email', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomCarrier(i)}
                        className="btn-ghost btn-icon btn text-danger"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addCustomCarrier}
                className="mt-3 text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Add custom carrier
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary btn">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary btn flex-1"
                disabled={!form.companyName}
              >
                Continue to Review →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm & Send ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="card p-5">
              <h3 className="text-base font-bold mb-4">Request Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Insured</p>
                  <p className="font-semibold text-text-primary">{form.companyName}</p>
                  <p className="text-text-secondary">DOT# {dotInput}{form.mcNumber ? ` · ${form.mcNumber}` : ''}</p>
                  <p className="text-text-secondary">{[form.city, form.state].filter(Boolean).join(', ')}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Request</p>
                  <p className="font-semibold text-text-primary">{form.yearsRequested} Years · {form.policyType}</p>
                  <p className="text-text-secondary">
                    {selectedCarrierIds.length + customCarriers.filter((c) => c.name).length} carrier{(selectedCarrierIds.length + customCarriers.filter((c) => c.name).length) !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
            </div>

            {/* Sending */}
            <div className="card p-5 space-y-4">
              <h3 className="text-base font-bold">Signature & Delivery</h3>
              <div>
                <label className="label">Insured&apos;s Email Address *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="insured@company.com"
                  value={form.insuredEmail}
                  onChange={(e) => updateForm('insuredEmail', e.target.value)}
                  required
                />
                <p className="mt-1.5 text-xs text-text-muted">
                  The authorization form will be sent here for signature.
                </p>
              </div>
              <div>
                <label className="label">CC Emails (Optional)</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  placeholder="agent@agency.com, manager@agency.com"
                  value={form.ccEmails}
                  onChange={(e) => updateForm('ccEmails', e.target.value)}
                />
                <p className="mt-1.5 text-xs text-text-muted">Separate multiple emails with commas.</p>
              </div>
              <div>
                <label className="label">Notes (Optional)</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  placeholder="Any additional notes for the request..."
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                />
              </div>
            </div>

            {/* What happens next */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
              <p className="text-sm font-semibold text-primary mb-2">What happens after you submit:</p>
              <ol className="space-y-1.5">
                {[
                  'A professional PDF authorization is generated',
                  `The PDF is emailed to ${form.insuredEmail || 'the insured'} for e-signature`,
                  'Once signed, the authorization is automatically sent to all selected carriers',
                  'You\'ll receive status updates as responses come in',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary btn">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary btn flex-1"
                disabled={submitting || !form.insuredEmail}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating & Sending...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8l12-6-5 14-2-6-5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    Create & Send for Signature
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
