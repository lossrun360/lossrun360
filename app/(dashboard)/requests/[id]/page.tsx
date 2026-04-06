'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { STATUS_LABELS, STATUS_COLORS, formatDate, timeAgo } from '@/lib/utils'
import type { LossRunRequest } from '@/types'

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<LossRunRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/requests/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setRequest(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load request')
        setLoading(false)
      })
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
      if (!res.ok) {
        toast.error(data.error || 'Action failed')
        return
      }
      toast.success(data.message || 'Success')
      // Refresh
      const updated = await fetch(`/api/requests/${params.id}`).then((r) => r.json())
      setRequest(updated)
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function generatePDF() {
    setActionLoading('pdf')
    try {
      const res = await fetch(`/api/requests/${params.id}/pdf`, { method: 'POST' })
      if (!res.ok) {
        toast.error('Failed to generate PDF')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `LossRunRequest_${request?.dotNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('Failed to generate PDF')
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteRequest() {
    if (!confirm('Delete this request? This cannot be undone.')) return
    setActionLoading('delete')
    try {
      await fetch(`/api/requests/${params.id}`, { method: 'DELETE' })
      toast.success('Request deleted')
      router.push('/requests')
    } catch {
      toast.error('Failed to delete')
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!request) {
    return (
      <div className="p-6">
        <div className="card">
          <div className="empty-state">
            <p className="empty-state-title">Request not found</p>
            <Link href="/requests" className="btn-primary btn mt-2">Back to Requests</Link>
          </div>
        </div>
      </div>
    )
  }

  const canSendForSignature = request.status === 'DRAFT' || request.status === 'PENDING_SIGNATURE'
  const canSendToCarrier = request.status === 'SIGNED'
  const canRemind = request.status === 'PENDING_SIGNATURE'

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 h-14 flex items-center gap-3">
          <Link href="/requests" className="text-text-muted hover:text-text-primary transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="text-sm font-semibold text-text-primary truncate">{request.companyName}</h1>
          <span className={`badge ${STATUS_COLORS[request.status]} ml-2`}>
            {STATUS_LABELS[request.status]}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={generatePDF}
              disabled={actionLoading === 'pdf'}
              className="btn-secondary btn-sm btn"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h8l2 2v9H2V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 2v3h3M4 7h5M4 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {actionLoading === 'pdf' ? 'Generating...' : 'Download PDF'}
            </button>
            {canSendForSignature && (
              <button
                onClick={() => action('send', { type: 'signature' })}
                disabled={!!actionLoading}
                className="btn-primary btn-sm btn"
              >
                {actionLoading === 'send' ? 'Sending...' : 'Send for Signature'}
              </button>
            )}
            {canSendToCarrier && (
              <button
                onClick={() => action('send', { type: 'carriers' })}
                disabled={!!actionLoading}
                className="btn-primary btn-sm btn"
              >
                {actionLoading === 'send' ? 'Sending...' : 'Send to Carriers'}
              </button>
            )}
            {canRemind && (
              <button
                onClick={() => action('remind')}
                disabled={!!actionLoading}
                className="btn-secondary btn-sm btn"
              >
                Send Reminder
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Insured info */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Insured Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoField label="Legal Name" value={request.companyName} bold />
                <InfoField label="DBA" value={request.dba} />
                <InfoField label="USDOT#" value={request.dotNumber} mono />
                <InfoField label="MC#" value={request.mcNumber} mono />
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

            {/* Request details */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Request Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoField label="Years Requested" value={`${request.yearsRequested} Years`} bold />
                <InfoField label="Policy Type" value={request.policyType} />
                <InfoField label="Insured Email" value={request.insuredEmail} />
                <InfoField label="CC Emails" value={request.ccEmails?.join(', ')} />
                {request.notes && (
                  <div className="col-span-2">
                    <InfoField label="Notes" value={request.notes} />
                  </div>
                )}
              </div>
            </div>

            {/* Carriers */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                Selected Carriers
                <span className="ml-2 badge badge-blue font-normal">{request.carriers?.length || 0}</span>
              </h2>
              {!request.carriers?.length ? (
                <p className="text-text-muted text-sm">No carriers selected</p>
              ) : (
                <div className="space-y-2">
                  {request.carriers.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{c.carrierName}</p>
                        {c.carrierEmail && <p className="text-xs text-text-muted">{c.carrierEmail}</p>}
                      </div>
                      <span className={`badge ${c.status === 'SENT' ? 'badge-green' : 'badge-gray'}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Insurance history */}
            {request.history && request.history.length > 0 && (
              <div className="card p-5">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                  FMCSA Insurance History
                </h2>
                <div className="space-y-2">
                  {request.history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm">
                      <div>
                        <p className="font-medium text-text-primary">{h.carrierName}</p>
                        <p className="text-xs text-text-muted">{h.policyType}</p>
                      </div>
                      <div className="text-right text-xs text-text-secondary">
                        <p>{formatDate(h.effectiveDate)} – {formatDate(h.cancellationDate)}</p>
                        {h.coverageAmount && (
                          <p className="text-emerald-400 font-medium">${Number(h.coverageAmount).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Status</h3>
              <div className="space-y-3">
                <StatusRow
                  label="Request"
                  badge={<span className={`badge ${STATUS_COLORS[request.status]}`}>{STATUS_LABELS[request.status]}</span>}
                />
                <StatusRow
                  label="Signature"
                  badge={
                    <span className={`badge ${
                      request.signatureStatus === 'SIGNED' ? 'badge-green' :
                      request.signatureStatus === 'PENDING' ? 'badge-yellow' : 'badge-red'
                    }`}>
                      {request.signatureStatus}
                    </span>
                  }
                />
                {request.signedAt && (
                  <StatusRow label="Signed" value={formatDate(request.signedAt)} />
                )}
                {request.sentToInsuredAt && (
                  <StatusRow label="Sent to insured" value={timeAgo(request.sentToInsuredAt)} />
                )}
                {request.sentToCarrierAt && (
                  <StatusRow label="Sent to carriers" value={timeAgo(request.sentToCarrierAt)} />
                )}
                {request.reminderCount > 0 && (
                  <StatusRow label="Reminders sent" value={String(request.reminderCount)} />
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Details</h3>
              <div className="space-y-2.5 text-xs">
                <StatusRow label="Request #" value={request.requestNumber.slice(-8)} mono />
                <StatusRow label="Created" value={timeAgo(request.createdAt)} />
                <StatusRow label="Updated" value={timeAgo(request.updatedAt)} />
                {request.createdBy?.name && (
                  <StatusRow label="By" value={request.createdBy.name} />
                )}
              </div>
            </div>

            {/* Timeline */}
            {request.timeline && request.timeline.length > 0 && (
              <div className="card p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Timeline</h3>
                <div className="space-y-3">
                  {request.timeline.map((t) => (
                    <div key={t.id} className="flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-text-primary">{t.description || t.event}</p>
                        <p className="text-xs text-text-muted">{timeAgo(t.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger zone */}
            <div className="card p-4 border-red-500/10">
              <button
                onClick={deleteRequest}
                disabled={actionLoading === 'delete'}
                className="btn-danger btn w-full btn-sm"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoField({ label, value, bold, mono }: {
  label: string
  value?: string | null
  bold?: boolean
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-text-primary ${bold ? 'font-semibold' : ''} ${mono ? 'font-mono text-xs' : ''}`}>
        {value || '—'}
      </p>
    </div>
  )
}

function StatusRow({ label, value, badge, mono }: {
  label: string
  value?: string
  badge?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-text-muted">{label}</span>
      {badge || (
        <span className={`text-xs text-text-primary font-medium ${mono ? 'font-mono' : ''}`}>
          {value || '—'}
        </span>
      )}
    </div>
  )
}
