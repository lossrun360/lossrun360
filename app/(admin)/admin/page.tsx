import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, timeAgo } from '@/lib/utils'
import { startOfMonth } from 'date-fns'

export const metadata = { title: 'Super Admin' }

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const [
    totalAgencies,
    totalUsers,
    totalRequests,
    requestsThisMonth,
    recentAgencies,
    activeSubscriptions,
    trialingSubscriptions,
  ] = await Promise.all([
    prisma.agency.count(),
    prisma.user.count(),
    prisma.lossRunRequest.count(),
    prisma.lossRunRequest.count({ where: { createdAt: { gte: startOfMonth(new Date()) } } }),
    prisma.agency.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        subscription: true,
        _count: { select: { users: true, requests: true } },
      },
    }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'TRIALING' } }),
  ])

  const stats = [
    { label: 'Total Agencies', value: totalAgencies, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Users', value: totalUsers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Requests', value: totalRequests, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Requests This Month', value: requestsThisMonth, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Active Subscriptions', value: activeSubscriptions, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Trialing', value: trialingSubscriptions, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border px-6 h-14 flex items-center justify-between bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" className="text-accent" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10.5 5.5H15L11.5 8.5L13 13L8 10.5L3 13L4.5 8.5L1 5.5H5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-sm font-semibold text-text-primary">Super Admin</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/agencies" className="btn-secondary btn-sm btn">Agencies</Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="stat-label text-xs">{stat.label}</p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent agencies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Recent Agencies</h2>
            <Link href="/admin/agencies" className="text-sm text-primary hover:text-primary-light">View all →</Link>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Agency</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Users</th>
                  <th>Requests</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>
                      <p className="font-semibold text-text-primary">{agency.name}</p>
                      <p className="text-xs text-text-muted">{agency.email}</p>
                    </td>
                    <td className="text-text-secondary">{agency.subscription?.planTier || '—'}</td>
                    <td>
                      <span className={`badge ${
                        agency.subscription?.status === 'ACTIVE' ? 'badge-green' :
                        agency.subscription?.status === 'TRIALING' ? 'badge-yellow' :
                        agency.subscription?.status === 'CANCELED' ? 'badge-red' : 'badge-gray'
                      }`}>
                        {agency.subscription?.status || 'No sub'}
                      </span>
                    </td>
                    <td className="text-text-secondary">{agency._count.users}</td>
                    <td className="text-text-secondary">{agency._count.requests}</td>
                    <td className="text-text-muted text-xs">{timeAgo(agency.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
