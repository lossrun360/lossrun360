import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { RequestStatus } from '@prisma/client'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:            { label: 'Draft',              color: '#92400e', bg: '#fef3c7' },
  PENDING_SIGNATURE:{ label: 'Awaiting Signature', color: '#1e40af', bg: '#dbeafe' },
  SIGNED:           { label: 'Signed',             color: '#065f46', bg: '#d1fae5' },
  SENT_TO_CARRIER:  { label: 'Sent to Carrier',    color: '#6b21a8', bg: '#f3e8ff' },
  COMPLETED:        { label: 'Completed',          color: '#065f46', bg: '#d1fae5' },
  CANCELLED:        { label: 'Cancelled',          color: '#991b1b', bg: '#fee2e2' },
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + 'm ago'
  if (s < 86400) return Math.floor(s / 3600) + 'h ago'
  return Math.floor(s / 86400) + 'd ago'
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string }
}) {
  const session = await getServerSession(authOptions)
  const agencyId = (session?.user as any)?.agencyId
  const statusFilter = searchParams.status
  const query = searchParams.q

  const requests = await prisma.lossRunRequest.findMany({
    where: {
      agencyId,
      ...(statusFilter && statusFilter !== 'ALL'
        ? { status: statusFilter as RequestStatus }
        : {}),
      ...(query
        ? {
            OR: [
              { companyName: { contains: query, mode: 'insensitive' } },
              { dotNumber: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { carriers: true, createdBy: true },
  })

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Loss Run Requests</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/requests/new"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', boxShadow: '0 1px 3px rgba(99,102,241,0.3)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1V12M1 6.5H12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          New Request
        </Link>
      </div>

      {/* Filters + Table card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search */}
          <form method="GET" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                name="q"
                defaultValue={query}
                placeholder="Search by company or DOT#..."
                style={{ width: '100%', padding: '7px 10px 7px 30px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', fontWeight: '500', color: '#475569', cursor: 'pointer' }}>
              Search
            </button>
          </form>

          {/* Status tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { value: '',                  label: 'All' },
              { value: 'DRAFT',             label: 'Draft' },
              { value: 'PENDING_SIGNATURE', label: 'Awaiting Sig.' },
              { value: 'SIGNED',            label: 'Signed' },
              { value: 'SENT_TO_CARRIER',   label: 'Sent' },
              { value: 'COMPLETED',         label: 'Completed' },
              { value: 'CANCELLED',         label: 'Cancelled' },
            ].map((tab) => {
              const isActive = (statusFilter || '') === tab.value
              return (
                <a
                  key={tab.value}
                  href={tab.value ? '?status=' + tab.value : '/requests'}
                  style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', textDecoration: 'none', background: isActive ? '#6366f1' : 'transparent', color: isActive ? '#fff' : '#64748b', border: isActive ? 'none' : '1px solid transparent', transition: 'all 0.1s' }}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Table */}
        {requests.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>No requests found</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 18px' }}>
              {query || statusFilter ? 'Try adjusting your filters.' : 'Create your first loss run request to get started.'}
            </p>
            <Link href="/requests/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '7px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
              + New Request
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Company', 'DOT# / MC#', 'Status', 'Carriers', 'Agent', 'Created', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => {
                const s = STATUS_CONFIG[req.status] || { label: req.status, color: '#475569', bg: '#f1f5f9' }
                return (
                  <tr key={req.id} style={{ borderBottom: i < requests.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{req.companyName}</div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>{req.dotNumber}</div>
                      {req.mcNumber && <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{req.mcNumber}</div>}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#64748b' }}>
                      {req.carriers.length > 0 ? (
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          {req.carriers.slice(0, 2).map((c) => c.carrierName).join(', ')}
                          {req.carriers.length > 2 && <span style={{ color: '#94a3b8' }}> +{req.carriers.length - 2}</span>}
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{req.createdBy?.name || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{timeAgo(req.createdAt)}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <Link href={'/requests/' + req.id} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: '500', whiteSpace: 'nowrap' }}>
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
