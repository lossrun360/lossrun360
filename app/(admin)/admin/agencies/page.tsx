import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, timeAgo } from '@/lib/utils'

export const metadata = { title: 'All Agencies — Admin' }

export default async function AdminAgenciesPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const where: any = {}
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { email: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  const agencies = await prisma.agency.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      subscription: true,
      _count: { select: { users: true, requests: true } },
    },
  })

  return (
    <div>
      <div className="border-b border-border px-6 h-14 flex items-center gap-3 bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <Link href="/admin" className="text-text-muted hover:text-text-primary">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-text-primary">All Agencies ({agencies.length})</h1>
      </div>

      <div className="p-6 space-y-5">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search agencies..."
            className="input max-w-sm"
          />
          <button type="submit" className="btn-secondary btn">Search</button>
        </form>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Agency</th>
                <th>Plan</th>
                <th>Billing Status</th>
                <th>Users</th>
                <th>Requests</th>
                <th>Trial Ends</th>
                <th>Joined</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id}>
                  <td>
                    <p className="font-semibold text-text-primary">{agency.name}</p>
                    <p className="text-xs text-text-muted">{agency.email}</p>
                    {agency.phone && <p className="text-xs text-text-muted">{agency.phone}</p>}
                  </td>
                  <td className="font-semibold text-text-secondary">{agency.subscription?.planTier || '—'}</td>
                  <td>
                    <span className={`badge ${
                      agency.subscription?.status === 'ACTIVE' ? 'badge-green' :
                      agency.subscription?.status === 'TRIALING' ? 'badge-yellow' :
                      agency.subscription?.status === 'CANCELED' ? 'badge-red' : 'badge-gray'
                    }`}>
                      {agency.subscription?.status || 'No Plan'}
                    </span>
                  </td>
                  <td className="text-text-secondary">{agency._count.users}</td>
                  <td className="text-text-secondary">{agency._count.requests}</td>
                  <td className="text-text-secondary text-sm">
                    {agency.subscription?.trialEndAt ? formatDate(agency.subscription.trialEndAt) : '—'}
                  </td>
                  <td className="text-text-muted text-xs">{formatDate(agency.createdAt)}</td>
                  <td>
                    <span className={`badge ${agency.isActive ? 'badge-green' : 'badge-red'}`}>
                      {agency.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
