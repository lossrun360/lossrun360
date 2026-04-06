import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'
import { STATUS_LABELS, STATUS_COLORS, formatDate, timeAgo } from '@/lib/utils'

export const metadata = { title: 'Loss Run Requests' }

interface SearchParams {
  status?: string
  search?: string
  page?: string
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: any = { agencyId: session.user.agencyId }
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.search) {
    where.OR = [
      { companyName: { contains: searchParams.search, mode: 'insensitive' } },
      { dotNumber: { contains: searchParams.search } },
      { mcNumber: { contains: searchParams.search } },
    ]
  }

  const [requests, total] = await Promise.all([
    prisma.lossRunRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        createdBy: { select: { name: true, email: true } },
        carriers: { select: { carrierName: true, status: true } },
      },
    }),
    prisma.lossRunRequest.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_SIGNATURE', label: 'Awaiting Signature' },
    { value: 'SIGNED', label: 'Signed' },
    { value: 'SENT_TO_CARRIER', label: 'Sent to Carrier' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  return (
    <div>
      <Header title="Loss Run Requests" />

      <div className="p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form method="GET" className="flex gap-2 flex-1">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search by company name or DOT#..."
              className="input max-w-sm"
            />
            {searchParams.status && (
              <input type="hidden" name="status" value={searchParams.status} />
            )}
            <button type="submit" className="btn-secondary btn">Search</button>
          </form>

          <div className="flex gap-2">
            <div className="flex gap-1 flex-wrap">
              {statusOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/requests${opt.value ? `?status=${opt.value}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (searchParams.status || '') === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-text-secondary border border-border hover:border-border-2'
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            <Link href="/requests/new" className="btn-primary btn shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Request
            </Link>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-text-muted">
          {total} request{total !== 1 ? 's' : ''}
          {searchParams.status && ` — ${STATUS_LABELS[searchParams.status]}`}
        </p>

        {/* Table */}
        {requests.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <svg className="empty-state-icon w-12 h-12" viewBox="0 0 48 48" fill="none">
                <path d="M8 6h24l10 10v30H8V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M32 6v10h10M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="empty-state-title">
                {searchParams.search || searchParams.status ? 'No matching requests' : 'No requests yet'}
              </p>
              <p className="empty-state-desc">
                {searchParams.search || searchParams.status
                  ? 'Try adjusting your search or filter'
                  : 'Create your first loss run request by looking up a DOT#.'}
              </p>
              {!searchParams.search && !searchParams.status && (
                <Link href="/requests/new" className="btn-primary btn">
                  Create First Request
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>DOT# / MC#</th>
                    <th>Status</th>
                    <th>Carriers</th>
                    <th>Agent</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <Link
                          href={`/requests/${req.id}`}
                          className="font-semibold text-text-primary hover:text-primary transition-colors"
                        >
                          {req.companyName}
                        </Link>
                        <p className="text-xs text-text-muted font-mono">
                          #{req.requestNumber.slice(-6)}
                        </p>
                      </td>
                      <td>
                        <span className="font-mono text-sm">{req.dotNumber}</span>
                        {req.mcNumber && (
                          <p className="text-xs text-text-muted">{req.mcNumber}</p>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[req.status]}`}>
                          {STATUS_LABELS[req.status]}
                        </span>
                      </td>
                      <td>
                        {req.carriers.length === 0 ? (
                          <span className="text-text-muted text-xs">None</span>
                        ) : (
                          <div className="space-y-0.5">
                            {req.carriers.slice(0, 2).map((c, i) => (
                              <p key={i} className="text-xs text-text-secondary truncate max-w-[140px]">
                                {c.carrierName}
                              </p>
                            ))}
                            {req.carriers.length > 2 && (
                              <p className="text-xs text-text-muted">+{req.carriers.length - 2} more</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="text-text-secondary text-sm">
                        {req.createdBy?.name || req.createdBy?.email}
                      </td>
                      <td className="text-text-muted text-xs">{timeAgo(req.createdAt)}</td>
                      <td>
                        <Link
                          href={`/requests/${req.id}`}
                          className="btn-ghost btn-sm btn"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/requests?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                      className="btn-secondary btn-sm btn"
                    >
                      ← Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/requests?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                      className="btn-secondary btn-sm btn"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
