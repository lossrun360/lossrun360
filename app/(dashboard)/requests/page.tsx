import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { STATUS_LABELS, STATUS_COLORS, timeAgo } from '@/lib/utils'

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

  const statusFilters = [
    { value: '', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_SIGNATURE', label: 'Awaiting Signature' },
    { value: 'SIGNED', label: 'Signed' },
    { value: 'SENT_TO_CARRIER', label: 'Sent to Carrier' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
      ]

  const columns = ['NAME', 'DOT# / MC#', 'STATUS', 'CARRIERS', 'CREATED BY', 'LAST MODIFIED']

  return (
        <div className="p-5 space-y-4">
          {/* Page header */}
              <div className="flex items-center justify-between">
                      <h1 className="text-xl font-semibold" style={{ color: '#0D1C38' }}>
                                Loss Run Requests
                      </h1>h1>
                      <Link
                                  href="/requests/new"
                                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-md transition-colors"
                                  style={{ background: '#1654D9' }}
                                >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                                </svg>svg>
                                New Request
                      </Link>Link>
              </div>div>
        
          {/* Filter bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {statusFilters.map((opt) => {
                      const isActive = (searchParams.status || '') === opt.value
                                    return (
                                                    <Link
                                                                      key={opt.value}
                                                                      href={`/requests${opt.value ? `?status=${opt.value}` : ''}`}
                                                                      className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                                                                      style={{
                                                                                          background: isActive ? '#1654D9' : 'white',
                                                                                          color: isActive ? 'white' : '#455270',
                                                                                          borderColor: isActive ? '#1654D9' : '#D8E0EE',
                                                                      }}
                                                                    >
                                                      {opt.label}
                                                    </Link>Link>
                                                  )
                        })}
                      </div>div>
                      <form method="GET" className="flex items-center gap-2 shrink-0">
                        {searchParams.status && (
                      <input type="hidden" name="status" value={searchParams.status} />
                    )}
                                <div className="relative">
                                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: '#7D8EA8' }}>
                                                          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                                                          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>svg>
                                            <input
                                                            type="text"
                                                            name="search"
                                                            defaultValue={searchParams.search}
                                                            placeholder="Find a request..."
                                                            style={{ background: 'white', border: '1px solid #D8E0EE', color: '#0D1C38' }}
                                                            className="pl-8 pr-3 py-1.5 text-xs rounded-md w-52 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                                                          />
                                </div>div>
                                <button
                                              type="submit"
                                              className="px-3 py-1.5 text-xs font-medium rounded-md border transition-colors"
                                              style={{ background: 'white', borderColor: '#D8E0EE', color: '#455270' }}
                                            >
                                            Search
                                </button>button>
                      </form>form>
              </div>div>
        
              <p className="text-xs" style={{ color: '#7D8EA8' }}>
                {total} request{total !== 1 ? 's' : ''}
                {searchParams.status && ` · ${STATUS_LABELS[searchParams.status]}`}
                {searchParams.search && ` · "${searchParams.search}"`}
              </p>p>
        
          {requests.length === 0 ? (
                  <div className="card">
                            <div className="empty-state">
                                        <svg className="empty-state-icon w-10 h-10" viewBox="0 0 48 48" fill="none">
                                                      <path d="M8 6h24l10 10v30H8V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                                      <path d="M32 6v10h10M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>svg>
                                        <p className="empty-state-title">
                                          {searchParams.search || searchParams.status ? 'No matching requests' : 'No requests yet'}
                                        </p>p>
                                        <p className="empty-state-desc">
                                          {searchParams.search || searchParams.status
                                                            ? 'Try adjusting your search or filter'
                                                            : 'Create your first loss run request by looking up a DOT#.'}
                                        </p>p>
                              {!searchParams.search && !searchParams.status && (
                                  <Link href="/requests/new" className="btn-primary btn">Create First Request</Link>Link>
                                        )}
                            </div>div>
                  </div>div>
                ) : (
                  <>
                            <div className="overflow-x-auto rounded-xl bg-white" style={{ border: '1px solid #D8E0EE' }}>
                                        <table className="w-full text-sm">
                                                      <thead style={{ background: '#EEF2FA' }}>
                                                                      <tr>
                                                                        {columns.map((col) => (
                                        <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold tracking-wider" style={{ color: '#455270', borderBottom: '1px solid #D8E0EE' }}>
                                                              <span className="inline-flex items-center gap-1">
                                                                {col}
                                                                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: '#BCC8E0' }}>
                                                                                                                <path d="M5 2v6M2.5 4.5L5 2l2.5 2.5M2.5 5.5L5 8l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                                                                        </svg>svg>
                                                              </span>span>
                                        </th>th>
                                      ))}
                                                                                        <th className="px-4 py-2.5 w-10" style={{ borderBottom: '1px solid #D8E0EE' }} />
                                                                      </tr>tr>
                                                      </thead>thead>
                                                      <tbody>
                                                        {requests.map((req) => (
                                      <tr key={req.id} style={{ borderBottom: '1px solid #EEF2FA' }} className="hover:bg-surface-2/40 transition-colors">
                                                          <td className="px-4 py-3">
                                                                                <Link href={`/requests/${req.id}`} className="font-medium hover:text-primary transition-colors" style={{ color: '#0D1C38' }}>
                                                                                  {req.companyName}
                                                                                  </Link>Link>
                                                                                <p className="text-xs font-mono mt-0.5" style={{ color: '#7D8EA8' }}>#{req.requestNumber.slice(-6)}</p>p>
                                                          </td>td>
                                                          <td className="px-4 py-3">
                                                                                <span className="font-mono text-xs" style={{ color: '#455270' }}>{req.dotNumber}</span>span>
                                                            {req.mcNumber && <p className="text-xs mt-0.5" style={{ color: '#7D8EA8' }}>{req.mcNumber}</p>p>}
                                                          </td>td>
                                                          <td className="px-4 py-3">
                                                                                <span className={`badge ${STATUS_COLORS[req.status]}`}>{STATUS_LABELS[req.status]}</span>span>
                                                          </td>td>
                                                          <td className="px-4 py-3">
                                                            {req.carriers.length === 0 ? (
                                                                <span className="text-xs" style={{ color: '#7D8EA8' }}>—</span>span>
                                                              ) : (
                                                                <div>
                                                                  {req.carriers.slice(0, 2).map((c, i) => (
                                                                                              <p key={i} className="text-xs truncate max-w-[130px]" style={{ color: '#455270' }}>{c.carrierName}</p>p>
                                                                                            ))}
                                                                  {req.carriers.length > 2 && <p className="text-xs" style={{ color: '#7D8EA8' }}>+{req.carriers.length - 2} more</p>p>}
                                                                </div>div>
                                                                                )}
                                                          </td>td>
                                                          <td className="px-4 py-3 text-xs" style={{ color: '#455270' }}>{req.createdBy?.name || req.createdBy?.email}</td>td>
                                                          <td className="px-4 py-3 text-xs" style={{ color: '#7D8EA8' }}>{timeAgo(req.createdAt)}</td>td>
                                                          <td className="px-4 py-3">
                                                                                <Link href={`/requests/${req.id}`} className="w-7 h-7 flex items-center justify-center rounded-md transition-colors" style={{ color: '#7D8EA8' }} title="View">
                                                                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                                                                                                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                                                                                                                                  <circle cx="3" cy="8" r="1.5" fill="currentColor"/>
                                                                                                                                  <circle cx="13" cy="8" r="1.5" fill="currentColor"/>
                                                                                                          </svg>svg>
                                                                                  </Link>Link>
                                                          </td>td>
                                      </tr>tr>
                                    ))}
                                                      </tbody>tbody>
                                        </table>table>
                            </div>div>
                  
                    {totalPages > 1 && (
                                <div className="flex items-center justify-between">
                                              <p className="text-xs" style={{ color: '#7D8EA8' }}>Page {page} of {totalPages}</p>p>
                                              <div className="flex gap-1.5">
                                                {page > 1 && (
                                                    <Link href={`/requests?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="btn-secondary btn-sm btn">← Prev</Link>Link>
                                                              )}
                                                {page < totalPages && (
                                                    <Link href={`/requests?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="btn-secondary btn-sm btn">Next →</Link>Link>
                                                              )}
                                              </div>div>
                                </div>div>
                            )}
                  </>>
                )}
        </div>div>
      )
}</></div>
