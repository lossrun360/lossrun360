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
  SENT_TO_CARRIER: { color: '#6b21a8', bg: '#f3e8ff' },
  COMPLETED: { color: '#065f46', bg: '#d1fae5' },
  CANCELLED: { color: '#991b1b', bg: '#fee2e2' },
}

const badge = (color: string, bg: string, text: string) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: bg, color, whiteSpace: 'nowrap' }}>{text}</span>
)

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<LossRunRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/requests/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setRequest(data); setLoading(false) })
      .catch(() => { toast.error('Failed to load request'); setLoading(false) })
  }, [params.id])

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
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
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
    } catch { toast.error('Failed to generate PDF') }
    finally { setActionLoading(null) }
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
          <Link href="/requests" style={{ display: 'inline-block', padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '3px', textDecoration: 'none', fontSize: '13px' }}>Back to Dashboard</Link>
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
  const btnPrimary = { ...btnBase, background: '#6366f1', color: '#fff' }
  const btnDanger = { ...btnBase, background: '#fee2e2', color: '#991b1b', width: '100%', justifyContent: 'center' }

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

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
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
              <InfoField label="Entity Type" value={request.entityType} />
              <InfoField label="Operation" value={request.operationType} />
              <InfoField label="Power Units" value={request.totalTrucks?.toString()} />
              <InfoField label="Drivers" value={request.totalDrivers?.toString()} />
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
                    {c.status === 'SENT'
                      ? badge('#065f46', '#d1fae5', 'Sent')
                      : badge('#475569', '#f1f5f9', c.status || 'Pending')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FMCSA Insurance History */}
          {request.history && request.history.length > 0 && (
            <div style={{ ...card, padding: '24px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', marginTop: 0 }}>FMCSA Insurance History</h2>
              <div>
                {request.history.map((h, i) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < request.history!.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', margin: 0 }}>{h.carrierName}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{h.policyType}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{formatDate(h.effectiveDate)} – {formatDate(h.cancellationDate)}</p>
                      {h.coverageAmount && <p style={{ fontSize: '11px', color: '#059669', fontWeight: '500', margin: '2px 0 0' }}>${Number(h.coverageAmount).toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Status card */}
          <div style={{ ...card, padding: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px', marginTop: 0 }}>Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SidebarRow label="Request" right={badge(statusStyle.color, statusStyle.bg, STATUS_LABELS[request.status] || request.status)} />
              <SidebarRow
                label="Signature"
                right={badge(
                  request.signatureStatus === 'SIGNED' ? '#065f46' : request.signatureStatus === 'PENDING' ? '#92400e' : '#991b1b',
                  request.signatureStatus === 'SIGNED' ? '#d1fae5' : request.signatureStatus === 'PENDING' ? '#fef3c7' : '#fee2e2',
                  request.signatureStatus || 'N/A'
                )}
              />
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
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', marginTop: '5px', flexShrink: 0 }} />
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
        {value || '—'}
      </p>
    </div>
  )
}

function SidebarRow({ label, value, right, mono }: { label: string; value?: string; right?: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</span>
      {right || <span style={{ fontSize: '11px', fontWeight: '500', color: '#0f172a', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || '—'}</span>}
    </div>
  )
}
