import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const agencyId = (session?.user as any)?.agencyId

  const [totalRequests, awaitingSignature, sentToCarriers, completedThisMonth] = await Promise.all([
    prisma.lossRunRequest.count({ where: { agencyId } }),
    prisma.lossRunRequest.count({ where: { agencyId, status: 'PENDING_SIGNATURE' } }),
    prisma.lossRunRequest.count({ where: { agencyId, status: 'SENT_TO_CARRIER' } }),
    prisma.lossRunRequest.count({
      where: {
        agencyId,
        status: 'COMPLETED',
        updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ])

  const recentRequests = await prisma.lossRunRequest.findMany({
    where: { agencyId },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { carriers: true, createdBy: true },
  })

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    DRAFT: { label: 'Draft', color: '#92400e', bg: '#fef3c7' },
    PENDING_SIGNATURE: { label: 'Awaiting Signature', color: '#1e40af', bg: '#dbeafe' },
    SIGNED: { label: 'Signed', color: '#065f46', bg: '#d1fae5' },
    SENT_TO_CARRIER: { label: 'Sent to Carrier', color: '#6b21a8', bg: '#f3e8ff' },
    COMPLETED: { label: 'Completed', color: '#065f46', bg: '#d1fae5' },
    CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
  }

  function timeAgo(date: Date) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return Math.floor(s / 60) + 'm ago'
    if (s < 86400) return Math.floor(s / 3600) + 'h ago'
    return Math.floor(s / 86400) + 'd ago'
  }

  const metrics = [
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      iconBg: '#eef2ff',
    },
    {
      label: 'Awaiting Signature',
      value: awaitingSignature,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      iconBg: '#fef3c7',
    },
    {
      label: 'Sent to Carriers',
      value: sentToCarriers,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      ),
      iconBg: '#dbeafe',
    },
    {
      label: 'Completed This Month',
      value: completedThisMonth,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
      iconBg: '#d1fae5',
    },
  ]

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
          {(session?.user as any)?.agencyName || 'Your agency'} &middot;{' '}
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px 22px',
              boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.4px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '30px', fontWeight: '700', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>
                  {m.value}
                </div>
              </div>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Recent requests table */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Recent Requests</h2>
            <Link href="/requests" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              View all &rarr;
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>No requests yet</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Create your first loss run request to get started.</p>
              <Link href="/requests/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: '#6366f1', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
                + New Request
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Company', 'DOT#', 'Status', 'Carriers', 'Created'].map(h => (
                    <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: '600', letterSpacing: '0.4px', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req, i) => {
                  const s = statusConfig[req.status] || { label: req.status, color: '#475569', bg: '#f1f5f9' }
                  return (
                    <tr key={req.id} style={{ borderBottom: i < recentRequests.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.08s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={'/requests/' + req.id} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{req.companyName}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{req.dotNumber}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '500', background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{req.carriers.length}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8' }}>{timeAgo(req.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick actions */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Quick Actions</h2>
            </div>
            <div style={{ padding: '8px' }}>
              {[
                {
                  href: '/requests/new',
                  label: 'New Request',
                  desc: 'Lookup DOT# and start',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
                  iconBg: '#eef2ff',
                },
                {
                  href: '/requests?status=PENDING_SIGNATURE',
                  label: 'Pending Signatures',
                  desc: awaitingSignature + ' awaiting',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                  iconBg: '#fef3c7',
                },
                {
                  href: '/carriers',
                  label: 'Carrier Database',
                  desc: 'Browse 500+ carriers',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                  iconBg: '#d1fae5',
                },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.1s' }}
                >
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: a.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '500', color: '#0f172a' }}>{a.label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Subscription */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Subscription</span>
              <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 7px', background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', borderRadius: '999px' }}>Trial</span>
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px', marginBottom: '3px' }}>Professional</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>100 requests / month</div>
            <Link
              href="/billing"
              style={{ display: 'block', textAlign: 'center', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '500', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.1s' }}
            >
              Manage Billing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
