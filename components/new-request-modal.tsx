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
  const [dotInput, setDotInput] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResult, setLookupResult] = useState<any>(null)
  const [creating, setCreating] = useState(false)

  const reset = useCallback(() => {
    setDotInput('')
    setLookupLoading(false)
    setLookupResult(null)
    setCreating(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose(); reset() } }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose, reset])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      reset()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, reset])

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!dotInput.trim()) return
    setLookupLoading(true)
    setLookupResult(null)
    try {
      const res = await fetch(`/api/dot-lookup?dot=${encodeURIComponent(dotInput.trim())}`)
      const data = await res.json()
      if (!data.found) { toast.error(data.error || 'Carrier not found'); return }
      setLookupResult(data)
    } catch {
      toast.error('Failed to lookup DOT number')
    } finally {
      setLookupLoading(false)
    }
  }

  async function handleCreateDraft() {
    if (!lookupResult) return
    setCreating(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotNumber: dotInput.trim(),
          companyName: lookupResult.companyName,
          dba: lookupResult.dbaName,
          ownerName: lookupResult.ownerName,
          address: lookupResult.address,
          city: lookupResult.city,
          state: lookupResult.state,
          zip: lookupResult.zip,
          phone: lookupResult.phone,
          email: lookupResult.email,
          entityType: lookupResult.entityType,
          operationType: lookupResult.operationType,
          totalTrucks: lookupResult.totalTrucks,
          totalDrivers: lookupResult.totalDrivers,
          yearsRequested: 5,
          policyType: 'Auto Liability',
          insuredEmail: lookupResult.email || '',
          carriers: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create request'); return }
      onClose()
      reset()
      router.push(`/requests/${data.id}`)
      router.refresh()
    } catch {
      toast.error('Failed to create request')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  const inp: React.CSSProperties = { display: 'block', width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }
  const btnP: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 20px', background: '#6366f1', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnS: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 16px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      <div
        style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '460px', boxShadow: '0 24px 64px rgba(15,23,42,0.22)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>New Loss Run Request</h2>
          <button onClick={onClose} style={{ width: '28px', height: '28px', border: 'none', background: '#f1f5f9', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Enter USDOT Number</p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>We’ll pull the carrier’s info from FMCSA automatically.</p>
            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                style={{ ...inp, flex: 1 }}
                placeholder="e.g. 1234567"
                value={dotInput}
                onChange={(e) => { setDotInput(e.target.value.replace(/\D/g, '')); setLookupResult(null) }}
                maxLength={10}
                autoFocus
                required
              />
              <button type="submit" style={{ ...btnS, flexShrink: 0, opacity: lookupLoading || !dotInput.trim() ? 0.7 : 1 }} disabled={lookupLoading || !dotInput.trim()}>
                {lookupLoading ? (
                  <span style={{ width: '13px', height: '13px', border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                ) : null}
                {lookupLoading ? 'Looking up...' : 'Lookup'}
              </button>
            </form>
          </div>

          {lookupResult && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{lookupResult.companyName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    DOT# {dotInput}
                    {lookupResult.operatingStatus && (
                      <span style={{ padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: '#d1fae5', color: '#065f46' }}>{lookupResult.operatingStatus}</span>
                    )}
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.5"/><path d="M5.5 10l3 3L14.5 7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '12px' }}>
                {lookupResult.ownerName && <div><span style={{ color: '#94a3b8' }}>Owner: </span><span style={{ color: '#374151', fontWeight: 500 }}>{lookupResult.ownerName}</span></div>}
                {(lookupResult.city || lookupResult.state) && <div><span style={{ color: '#94a3b8' }}>Location: </span><span style={{ color: '#374151', fontWeight: 500 }}>{[lookupResult.city, lookupResult.state].filter(Boolean).join(', ')}</span></div>}
                {lookupResult.totalTrucks && <div><span style={{ color: '#94a3b8' }}>Power Units: </span><span style={{ color: '#374151', fontWeight: 500 }}>{lookupResult.totalTrucks}</span></div>}
                {lookupResult.totalDrivers && <div><span style={{ color: '#94a3b8' }}>Drivers: </span><span style={{ color: '#374151', fontWeight: 500 }}>{lookupResult.totalDrivers}</span></div>}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={btnS}>Cancel</button>
            <button
              onClick={handleCreateDraft}
              disabled={!lookupResult || creating}
              style={{ ...btnP, flex: 1, opacity: !lookupResult || creating ? 0.6 : 1 }}
            >
              {creating ? (
                <span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              ) : null}
              {creating ? 'Creating...' : 'Create Draft →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
