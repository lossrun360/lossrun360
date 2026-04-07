import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RequestStatus } from '@prisma/client'
import { RequestsTable } from '@/components/requests-table'
import { NewRequestButton } from '@/components/new-request-button'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: '#92400e', bg: '#fef3c7' },
  PENDING_SIGNATURE: { label: 'Awaiting Signature', color: '#1e40af', bg: '#dbeafe' },
  SIGNED: { label: 'Signed', color: '#065f46', bg: '#d1fae5' },
  SENT_TO_CARRIER: { label: 'Sent to Carrier', color: '#6b21a8', bg: '#f3e8ff' },
  COMPLETED: { label: 'Completed', color: '#065f46', bg: '#d1fae5' },
  CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
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

  const [requests, totalRequests, awaitingSignature, sentToCarriers, completedThisMonth] = await Promise.all([
    prisma.lossRunRequest.findMany({
      where: {
        agencyId,
        ...(statusFilter && statusFilter !== 'ALL' ? { status: statusFilter as RequestStatus } : {}),
        ...(query ? { OR: [{ companyName: { contains: query, mode: 'insensitive' } }, { dotNumber: { contains: query, mode: 'insensitive' } }] } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { carriers: true, createdBy: true },
    }),
    prisma.lossRunRequest.count({ where: { agencyId } }),
    prisma.lossRunRequest.count({ where: { agencyId, status: 'PENDING_SIGNATURE' } }),
    prisma.lossRunRequest.count({ where: { agencyId, status: 'SENT_TO_CARRIER' } }),
    prisma.lossRunRequest.count({ where: { agencyId, status: 'COMPLETED', updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
  ])

  const metrics = [
    { label: 'Total Requests', value: totalRequests, iconBg: '#eef2ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label: 'Awaiting Signature', value: awaitingSignature, iconBg: '#fef3c7', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: 'Sent to Carriers', value: sentToCarriers, iconBg: '#dbeafe', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
    { label: 'Completed This Month', value: completedThisMonth, iconBg: '#d1fae5', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  ]

  const serializedRequests = requests.map((req) => ({
    id: req.id,
    companyName: req.companyName,
    dotNumber: req.dotNumber,
    status: req.status,
    carriers: req.carriers.map((c) => ({ id: c.id, carrierName: c.carrierName })),
    createdBy: req.createdBy ? { name: req.createdBy.name } : null,
    createdAt: req.createdAt.toISOString(),
  }))

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{(session?.user as any)?.agencyName || 'Your agency'}</p>
        </div>
        <NewRequestButton />
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px 22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.4px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>{m.label}</div>
                <div style={{ fontSize: '30px', fontWeight: '700', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{m.value}</div>
              </div>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <form method="GET" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input name="q" defaultValue={query} placeholder="Search by company or DOT#..." style={{ width: '100%', padding: '7px 10px 7px 30px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '500', color: '#475569', cursor: 'pointer' }}>Search</button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { value: '', label: 'All' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PENDING_SIGNATURE', label: 'Awaiting Sig.' },
              { value: 'SIGNED', label: 'Signed' },
              { value: 'SENT_TO_CARRIER', label: 'Sent' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ].map((tab) => {
              const isActive = (statusFilter || '') === tab.value
              return (
                <a key={tab.value} href={tab.value ? '?status=' + tab.value : '/requests'} style={{ padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '500', textDecoration: 'none', background: isActive ? '#6366f1' : 'transparent', color: isActive ? '#fff' : '#64748b', border: isActive ? 'none' : '1px solid transparent' }}>
                  {tab.label}
                </a>
              )
            })}
          </div>
        </div>

        {requests.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>No requests found</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 18px' }}>
              {query || statusFilter ? 'Try adjusting your filters.' : 'Click "+ New Request" to get started.'}
            </p>
          </div>
        ) : (
          <RequestsTable requests={serializedRequests} />
        )}
      </div>
    </div>
  )
}
