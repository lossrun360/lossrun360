'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDate, timeAgo } from '@/lib/utils'
import type { LossRunRequest } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_SIGNATURE: 'Awaiting Signature',
  SIGNED: 'Signed',
  SENT_TO_CARRIER: 'Sent to Carrier',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  DRAFT: { color: '#92400e', bg: '#fef3c7' },
  PENDING_SIGNATURE: { color: '#1e40af', bg: '#dbeafe' },
  SIGNED: { color: '#065f46', bg: '#d1fae5' },
  SENT_TO_CARRIER: { color: '#1557c0', bg: '#dbeafe' },
  COMPLETED: { color: '#065f46', bg: '#d1fae5' },
  CANCELLED: { color: '#991b1b', bg: '#fee2e2' },
}

const badge = (color: string, bg: string, text: string) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: bg, color, whiteSpace: 'nowrap' }}>{text}</span>
)

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }

interface InsurancePolicy {
  insurerName: string
  coverageType: string
  policyNumber: string
  startDate: string
  endDate: string
  isManual?: boolean
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<LossRunRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<Record<string, string>>({})

  // Insurance history state
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([])
  const [insuranceLoading, setInsuranceLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPolicy, setNewPolicy] = useState<InsurancePolicy>({
    insurerName: '',
    coverageType: 'BIPD',
    policyNumber: '',
    startDate: '',
    endDate: '',
    isManual: true,
  })

  useEffect(() => {
    fetch(`/api/requests/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setRequest(data); setLoading(false) })
      .catch(() => { toast.error('Failed to load request'); setLoading(false) })
  }, [params.id])

  // Fetch FMCSA insurance history when request loads
  useEffect(() => {
    if (!request?.dotNumber) return
    setInsuranceLoading(true)
    fetch(`/api/fmcsa-insurance?dot=${encodeURIComponent(request.dotNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.policies) setInsurancePolicies(data.policies)
      })
      .catch(() => { /* silently fail */ })
      .finally(() => setInsuranceLoading(false))
  }, [request?.dotNumber])

  async function action(type: string, body?: object) {
    setActionLoading(type)
    try {
      const res = await fetch(`/api/requests/${params.id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Action failed'); return }
      toast.success(data.message || 'Success')
      const updated = await fetch(`/api/requests/${params.id}`).then((r) => r.json())
      setRequest(updated)
    } catch { toast.error('Action failed') } finally { setActionLoading(null) }
  }

  async function generatePDF() {
    setActionLoading('pdf')
    try {
      const res = await fetch(`/api/requests/${params.id}/pdf`, { method: 'POST' })
      if (!res.ok) { toast.error('Failed to generate PDF'); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `LossRunRequest_${request?.dotNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch { toast.error('Failed to generate PDF') } finally { setActionLoading(null) }
  }

  async function deleteRequest() {
    if (!confirm('Delete this request? This cannot be undone.')) return
    setActionLoading('delete')
    try {
      await fetch(`/api/requests/${params.id}`, { method: 'DELETE' })
      toast.success('Request deleted')
      router.push('/requests')
    } catch { toast.error('Failed to delete'); setActionLoading(null) }
  }

  function enterEditMode() {
    if (!request) return
    setEditForm({
      companyName: request.companyName || '',
      dba: request.dba || '',
      ownerName: request.ownerName || '',
      address: request.address || '',
      city: request.city || '',
      state: request.state || '',
      zip: request.zip || '',
      phone: request.phone || '',
      email: request.email || '',
      insuredEmail: request.insuredEmail || '',
      notes: (request as any).notes || '',
    })
    setEditMode(true)
  }

  async function saveEdit() {
    setActionLoading('save')
    try {
      const res = await fetch(`/api/requests/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (!res.ok) { toast.error('Failed to save changes'); return }
      const updated = await res.json()
      setRequest(updated)
      setEditMode(false)
      toast.success('Draft updated!')
    } catch { toast.error('Failed to save changes') } finally { setActionLoading(null) }
  }

  function addManualPolicy() {
    if (!newPolicy.insurerName || !newPolicy.startDate) {
      toast.error('Insurer name and start date are required')
      return
    }
    setInsurancePolicies(prev => [
      { ...newPolicy, isManual: true },
      ...prev,
    ])
    setNewPolicy({ insurerName: '', coverageType: 'BIPD', policyNumber: '', startDate: '', endDate: '', isManual: true })
    setShowAddForm(false)
    toast.success('Policy added')
  }

  function removePolicy(index: number) {
    setInsurancePolicies(prev => prev.filter((_, i) => i !== index))
    toast.success('Policy removed')
  }

  if (loading) {
    return (
      <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: '96px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    )
  }

  if (!request) {
    return (
      <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Request not found</p>
          <Link href="/requests" style={{ display: 'inline-block', padding: '8px 16px', background: '#1c6edd', color: '#fff', borderRadius: '3px', textDecoration: 'none', fontSize: '13px' }}>Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const statusStyle = STATUS_STYLE[request.status] || { color: '#475569', bg: '#f1f5f9' }
  const canSendForSignature = request.status === 'DRAFT' || request.status === 'PENDING_SIGNATURE'
  const canSendToCarrier = request.status === 'SIGNED'
  const canRemind = request.status === 'PENDING_SIGNATURE'

  const btnBase = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '3px', fontSize: '13px', fontWeight: '500', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary = { ...btnBase, background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }
  const btnPrimary = { ...btnBase, background: '#1c6edd', color: '#fff' }
  const btnDanger = { ...btnBase, background: '#fee2e2', color: '#991b1b', width: '100%', justifyContent: 'center' }

  const inp: React.CSSProperties = {
    display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0',
    borderRadius: '4px', fontSize: '13px', color: '#0f172a', background: '#fff',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href="/requests" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '3px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px', margin: 0, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{request.companyName}</h1>
        {badge(statusStyle.color, statusStyle.bg, STATUS_LABELS[request.status] || request.status)}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
          <button onClick={generatePDF} disabled={actionLoading === 'pdf'} style={btnSecondary as any}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2h8l2 2v9H2V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 2v3h3M4 7h5M4 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            {actionLoading === 'pdf' ? 'Generating...' : 'Download PDF'}
          </button>
          {request.status === 'DRAFT' && !editMode && (
            <button onClick={enterEditMode} style={btnSecondary}>Edit Draft</button>
          )}
          {editMode && (
            <>
              <button onClick={saveEdit} disabled={!!actionLoading} style={btnPrimary}>{actionLoading === 'save' ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={() => setEditMode(false)} style={btnSecondary}>Cancel</button>
            </>
          )}
          {canSendForSignature && (
            <button onClick={() => action('send', { type: 'signature' })} disabled={!!actionLoading} style={btnPrimary as any}>
              {actionLoading === 'send' ? 'Sending...' : 'Send for Signature'}
            </button>
          )}
          {canSendToCarrier && (
            <button onClick={() => action('send', { type: 'carriers' })} disabled={!!actionLoading} style={btnPrimary as any}>
              {actionLoading === 'send' ? 'Sending...' : 'Send to Carriers'}
            </button>
          )}
          {canRemind && (
            <button onClick={() => action('remind')} disabled={!!actionLoading} style={btnSecondary as any}>
              Send Reminder
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <div style={{ ...card, padding: '24px', marginTop: '0' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' as const, color: '#94a3b8', marginTop: 0, marginBottom: '20px' }}>Edit Draft</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {([['companyName','Legal Name'],['dba','DBA'],['ownerName','Owner'],['address','Address'],['city','City'],['state','State'],['zip','ZIP'],['phone','Phone'],['email','Email'],['insuredEmail','Insured Email']] as [string,string][]).map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>{label}</label>
                <input
                  value={editForm[key] || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }}
                />
              </div>
            ))}
            <div style={{ gridColumn: 'span 3' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>Notes</label>
              <textarea
                value={editForm['notes'] || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', color: '#0f172a', background: '#fff', resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display: editMode ? 'none' : 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Insured Info */}
          <div style={{ ...card, padding: '24px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', marginTop: 0 }}>Insured Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <InfoField label="Legal Name" value={request.companyName} bold />
              <InfoField label="DBA" value={request.dba} />
              <InfoField label="USDOT#" value={request.dotNumber} mono />
              <InfoField label="Address" value={[request.address, request.city, request.state, request.zip].filter(Boolean).join(', ')} />
              <InfoField label="Phone" value={request.phone} />
              <InfoField label="Email" value={request.email} />
              <InfoField label="Owner" value={request.ownerName} />
            </div>
          </div>

          {/* Request Details */}
          <div style={{ ...card, padding: '24px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', marginTop: 0 }}>Request Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <InfoField label="Years Requested" value={request.yearsRequested ? request.yearsRequested + ' Years' : undefined} bold />
              <InfoField label="Policy Type" value={request.policyType} />
              <InfoField label="Insured Email" value={request.insuredEmail} />
              <InfoField label="CC Emails" value={request.ccEmails?.join(', ')} />
              {request.notes && <div style={{ gridColumn: '1 / -1' }}><InfoField label="Notes" value={request.notes} /></div>}
            </div>
          </div>

          {/* Carriers */}
          <div style={{ ...card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', margin: 0 }}>Selected Carriers</h2>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: '#dbeafe', color: '#1e40af' }}>{request.carriers?.length || 0}</span>
            </div>
            {!request.carriers?.length ? (
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>No carriers selected</p>
            ) : (
              <div>
                {request.carriers.map((c, i) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < request.carriers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', margin: 0 }}>{c.carrierName}</p>
                      {c.carrierEmail && <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{c.carrierEmail}</p>}
                    </div>
                    {c.status === 'SENT' ? badge('#065f46', '#d1fae5', 'Sent') : badge('#475569', '#f1f5f9', c.status || 'Pending')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FMCSA Liability Insurance History */}
          <div style={{ ...card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', margin: 0 }}>FMCSA Liability Insurance History</h2>
                {insurancePolicies.length > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: '#dbeafe', color: '#1e40af' }}>{insurancePolicies.length}</span>
                )}
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{ fontSize: '12px', color: '#1c6edd', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontFamily: 'inherit', fontWeight: '500' }}
              >
                {showAddForm ? 'Cancel' : '+ Add Policy'}
              </button>
            </div>

            {/* Add Policy Form */}
            {showAddForm && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Insurer Name *</label>
                    <input
                      style={inp}
                      placeholder="e.g. Progressive Commercial"
                      value={newPolicy.insurerName}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, insurerName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Coverage Type</label>
                    <select
                      style={inp}
                      value={newPolicy.coverageType}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, coverageType: e.target.value }))}
                    >
                      <option value="BIPD">BIPD</option>
                      <option value="Auto Liability">Auto Liability</option>
                      <option value="General Liability">General Liability</option>
                      <option value="Cargo">Cargo</option>
                      <option value="Physical Damage">Physical Damage</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Policy Number</label>
                    <input
                      style={inp}
                      placeholder="e.g. POL-123456"
                      value={newPolicy.policyNumber}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, policyNumber: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Start Date *</label>
                      <input
                        style={inp}
                        type="date"
                        value={newPolicy.startDate}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>End Date</label>
                      <input
                        style={inp}
                        type="date"
                        value={newPolicy.endDate}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={addManualPolicy}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: '#1c6edd', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Add Policy
                  </button>
                </div>
              </div>
            )}

            {insuranceLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Loading insurance history from FMCSA...</p>
              </div>
            ) : insurancePolicies.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>No liability insurance records found</p>
            ) : (
              <div>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '8px', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Insurer</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Coverage</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Policy #</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Dates</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', width: '24px' }}></span>
                </div>
                {insurancePolicies.map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '8px', padding: '10px 0', borderBottom: i < insurancePolicies.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', margin: 0 }}>{p.insurerName}</p>
                      {p.isManual && <span style={{ fontSize: '10px', color: '#1c6edd', fontWeight: '500' }}>Manual</span>}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{p.coverageType}</p>
                    <p style={{ fontSize: '11px', color: '#475569', margin: 0, fontFamily: 'monospace' }}>{p.policyNumber || 'â'}</p>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                      {p.startDate ? formatDate(p.startDate) : 'â'} â {p.endDate ? formatDate(p.endDate) : 'Present'}
                    </p>
                    <button
                      onClick={() => removePolicy(i)}
                      title="Remove policy"
                      style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', padding: 0 }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status card */}
          <div style={{ ...card, padding: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px', marginTop: 0 }}>Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SidebarRow label="Request" right={badge(statusStyle.color, statusStyle.bg, STATUS_LABELS[request.status] || request.status)} />
              <SidebarRow label="Signature" right={badge(
                request.signatureStatus === 'SIGNED' ? '#065f46' : request.signatureStatus === 'PENDING' ? '#92400e' : '#991b1b',
                request.signatureStatus === 'SIGNED' ? '#d1fae5' : request.signatureStatus === 'PENDING' ? '#fef3c7' : '#fee2e2',
                request.signatureStatus || 'N/A'
              )} />
              {request.signedAt && <SidebarRow label="Signed" value={formatDate(request.signedAt)} />}
              {request.sentToInsuredAt && <SidebarRow label="Sent to insured" value={timeAgo(request.sentToInsuredAt)} />}
              {request.sentToCarrierAt && <SidebarRow label="Sent to carriers" value={timeAgo(request.sentToCarrierAt)} />}
              {request.reminderCount > 0 && <SidebarRow label="Reminders sent" value={String(request.reminderCount)} />}
            </div>
          </div>

          {/* Meta card */}
          <div style={{ ...card, padding: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px', marginTop: 0 }}>Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SidebarRow label="Request #" value={request.requestNumber?.slice(-8)} mono />
              <SidebarRow label="Created" value={timeAgo(request.createdAt)} />
              <SidebarRow label="Updated" value={timeAgo(request.updatedAt)} />
              {request.createdBy?.name && <SidebarRow label="By" value={request.createdBy.name} />}
            </div>
          </div>

          {/* Timeline */}
          {request.timeline && request.timeline.length > 0 && (
            <div style={{ ...card, padding: '20px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px', marginTop: 0 }}>Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {request.timeline.map((t) => (
                  <div key={t.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1c6edd', marginTop: '5px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a', margin: 0 }}>{t.description || t.event}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{timeAgo(t.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete */}
          <div style={{ ...card, padding: '16px', borderColor: '#fecaca' }}>
            <button onClick={deleteRequest} disabled={actionLoading === 'delete'} style={btnDanger as any}>
              {actionLoading === 'delete' ? 'Deleting...' : 'Delete Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoField({ label, value, bold, mono }: { label: string; value?: string | null; bold?: boolean; mono?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.4px', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: bold ? '600' : '400', fontFamily: mono ? 'monospace' : 'inherit', margin: 0 }}>
        {value || 'â'}
      </p>
    </div>
  )
}

function SidebarRow({ label, value, right, mono }: { label: string; value?: string; right?: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</span>
      {right || <span style={{ fontSize: '11px', fontWeight: '500', color: '#0f172a', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || 'â'}</span>}
    </div>
  )
}
