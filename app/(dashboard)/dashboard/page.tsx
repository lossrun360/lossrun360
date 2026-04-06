import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'
import { STATUS_LABELS, STATUS_COLORS, formatDate, timeAgo } from '@/lib/utils'
import { startOfMonth } from 'date-fns'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const agencyId = session.user.agencyId

  // Fetch stats
  const [totalRequests, pendingSignature, sentToCarrier, completedThisMonth, recentRequests, subscription] =
    await Promise.all([
      prisma.lossRunRequest.count({ where: { agencyId } }),
      prisma.lossRunRequest.count({ where: { agencyId, status: 'PENDING_SIGNATURE' } }),
      prisma.lossRunRequest.count({ where: { agencyId, status: 'SENT_TO_CARRIER' } }),
      prisma.lossRunRequest.count({
        where: { agencyId, status: 'COMPLETED', createdAt: { gte: startOfMonth(new Date()) } },
      }),
      prisma.lossRunRequest.findMany({
        where: { agencyId },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { createdBy: { select: { name: true } }, carriers: true },
      }),
      prisma.subscription.findUnique({ where: { agencyId } }),
    ])

  const stats = [
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 2h11l4 4v13H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M14 2v4h4M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Awaiting Signature',
      value: pendingSignature,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 15l3-1 8-8a1.41 1.41 0 00-2-2l-8 8-1 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M5 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Sent to Carriers',
      value: sentToCarrier,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 4l8 5 8-5M2 4v12h16V4M2 4h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Completed This Month',
      value: completedThisMonth,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6.5 10l2.5 2.5L13.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  // Trial warning
  const trialEndsAt = subscription?.trialEndAt
  const isTrialing = subscription?.status === 'TRIALING'
  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div>
      <Header title="Dashboard" subtitle={session.user.agencyName} />

      <div className="p-6 space-y-6">
        {/* Trial banner */}
        {isTrialing && daysLeft <= 7 && (
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" className="text-accent shrink-0" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v4M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-sm font-medium text-text-primary">
                Your free trial ends in{' '}
                <span className="text-accent font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>.
                Upgrade to keep access to all features.
              </p>
            </div>
            <Link href="/billing" className="btn-secondary btn-sm btn shrink-0">
              Upgrade Now
            </Link>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">{stat.label}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text-primary">Recent Requests</h2>
              <Link href="/requests" className="text-sm text-primary hover:text-primary-light transition-colors">
                View all →
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <svg className="empty-state-icon w-12 h-12" viewBox="0 0 48 48" fill="none">
                    <path d="M8 6h24l10 10v30H8V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M32 6v10h10M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="empty-state-title">No requests yet</p>
                  <p className="empty-state-desc">Start by looking up a DOT# to create your first request.</p>
                  <Link href="/requests/new" className="btn-primary btn">
                    Create First Request
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>DOT#</th>
                      <th>Status</th>
                      <th>Carriers</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <Link href={`/requests/${req.id}`} className="font-medium text-text-primary hover:text-primary transition-colors">
                            {req.companyName}
                          </Link>
                          {req.createdBy?.name && (
                            <p className="text-xs text-text-muted">{req.createdBy.name}</p>
                          )}
                        </td>
                        <td className="font-mono text-xs text-text-secondary">{req.dotNumber}</td>
                        <td>
                          <span className={`badge ${STATUS_COLORS[req.status]}`}>
                            {STATUS_LABELS[req.status]}
                          </span>
                        </td>
                        <td className="text-text-secondary">{req.carriers.length}</td>
                        <td className="text-text-secondary text-xs">{timeAgo(req.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions + Subscription */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div>
              <h2 className="text-base font-bold text-text-primary mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/requests/new"
                  className="flex items-center gap-3 p-4 card-hover rounded-xl hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">New Request</p>
                    <p className="text-xs text-text-muted">Lookup a DOT# and start</p>
                  </div>
                </Link>

                <Link
                  href="/requests?status=PENDING_SIGNATURE"
                  className="flex items-center gap-3 p-4 card-hover rounded-xl hover:border-yellow-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 14l3-1 9-9a1.41 1.41 0 00-2-2l-9 9-1 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Pending Signatures</p>
                    <p className="text-xs text-text-muted">
                      {pendingSignature} request{pendingSignature !== 1 ? 's' : ''} awaiting
                    </p>
                  </div>
                </Link>

                <Link
                  href="/carriers"
                  className="flex items-center gap-3 p-4 card-hover rounded-xl hover:border-border-2 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-3 text-text-secondary flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 5l8-3 8 3v4c0 5-3.5 9-8 10.5C5.5 18 2 14 2 9V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Carrier Database</p>
                    <p className="text-xs text-text-muted">Browse 500+ carriers</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Subscription card */}
            {subscription && (
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-text-primary">Subscription</h3>
                  <span className={`badge ${subscription.status === 'ACTIVE' || subscription.status === 'TRIALING' ? 'badge-green' : 'badge-yellow'}`}>
                    {subscription.status === 'TRIALING' ? 'Trial' : subscription.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-text-primary mb-0.5">{subscription.planTier}</p>
                <p className="text-xs text-text-muted mb-3">
                  {subscription.requestsPerMonth >= 999999
                    ? 'Unlimited requests'
                    : `${subscription.requestsPerMonth} requests/month`}
                </p>
                {trialEndsAt && isTrialing && (
                  <p className="text-xs text-accent mb-3">Trial ends {formatDate(trialEndsAt)}</p>
                )}
                <Link href="/billing" className="btn-secondary btn-sm btn w-full">
                  Manage Billing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
