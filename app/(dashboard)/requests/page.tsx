import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { STATUS_LABELS, STATUS_COLORS, formatDate, timeAgo } from '@/lib/utils'

export const metadata = { title: 'Loss Run Requests' }

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string; page?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { agencyId: session.user.agencyId }
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.search) {
    where.OR = [
      { companyName: { contains: searchParams.search, mode: 'insensitive' } },
      { dotNumber: { contains: searchParams.search } },
      { requestNumber: { contains: searchParams.search } },
    ]
  }

  const [requests, total] = await Promise.all([
    prisma.lossRunRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: { carrier: { select: { name: true } } },
    }),
    prisma.lossRunRequest.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Awaiting Signature', value: 'PENDING_SIGNATURE' },
    { label: 'Signed', value: 'SIGNED' },
    { label: 'Sent to Carrier', value: 'SENT_TO_CARRIER' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ]

  const activeStatus = searchParams.status ?? ''
  const activeSearch = searchParams.search ?? ''

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0 bg-white" style={{ borderColor: '#D8E0EE' }}>
        <h1 className="text-lg font-semibold" style={{ color: '#0D1C38' }}>Loss Run Requests</h1>
        <Link href="/requests/new" className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-md" style={{ background: '#1654D9' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          New Request
        </Link>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b bg-white shrink-0 flex-wrap" style={{ borderColor: '#D8E0EE' }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const isActive = activeStatus === f.value
            return (
              <Link key={f.value} href={"/requests" + (f.value ? "?status=" + f.value : "")} className="px-3 py-1 rounded-full text-xs font-medium border transition-colors" style={{ background: isActive ? '#1654D9' : 'white', color: isActive ? 'white' : '#455270', borderColor: isActive ? '#1654D9' : '#D8E0EE' }}>
                {f.label}
              </Link>
            )
          })}
        </div>
        <form method="GET" action="/requests" className="flex items-center">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <div className="relative">
            <input name="search" type="text" defaultValue={activeSearch} placeholder="Search company, DOT, #..." className="pl-8 pr-3 py-1.5 text-xs border rounded-md outline-none" style={{ borderColor: '#D8E0EE', color: '#0D1C38', width: '220px' }} />
          </div>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mt-4 font-semibold text-sm" style={{ color: '#0D1C38' }}>No requests found</p>
            <p className="text-xs mt-1" style={{ color: '#7D8EA8' }}>{activeSearch || activeStatus ? 'Try adjusting your filters.' : 'Create your first request to get started.'}</p>
            {!activeSearch && !activeStatus && (
              <Link href="/requests/new" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-md" style={{ background: '#1654D9' }}>New Request</Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: '#F4F7FC' }}>
              <tr>
                {['Request #', 'Company', 'Carrier', 'Status', 'Created', 'Updated', ''].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide" style={{ color: '#455270', borderBottom: '1px solid #D8E0EE' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #EEF2FA' }}>
                  <td className="px-4 py-3"><Link href={"/requests/" + req.id} className="font-mono text-xs font-semibold hover:underline" style={{ color: '#1654D9' }}>{req.requestNumber}</Link></td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm" style={{ color: '#0D1C38' }}>{req.companyName}</p>
                    {req.dotNumber && <p className="text-xs mt-0.5" style={{ color: '#7D8EA8' }}>DOT {req.dotNumber}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#455270' }}>{req.carrier?.name ?? '—'}</td>
                  <td className="px-4 py-3"><span className={"badge " + (STATUS_COLORS[req.status] ?? 'badge-gray')}>{STATUS_LABELS[req.status] ?? req.status}</span></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#7D8EA8' }}>{formatDate(req.createdAt)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#7D8EA8' }}>{timeAgo(req.updatedAt)}</td>
                  <td className="px-4 py-3"><Link href={"/requests/" + req.id} className="text-xs font-medium hover:underline" style={{ color: '#1654D9' }}>View →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: '#D8E0EE' }}>
            <p className="text-xs" style={{ color: '#7D8EA8' }}>Showing {skip + 1}–{Math.min(skip + pageSize, total)} of {total} requests</p>
            <div className="flex items-center gap-1">
              {page > 1 && <Link href={"/requests?page=" + (page-1) + (activeStatus ? "&status="+activeStatus : "") + (activeSearch ? "&search="+activeSearch : "")} className="px-3 py-1.5 text-xs border rounded-md" style={{ borderColor: '#D8E0EE', color: '#455270' }}>Previous</Link>}
              {page < totalPages && <Link href={"/requests?page=" + (page+1) + (activeStatus ? "&status="+activeStatus : "") + (activeSearch ? "&search="+activeSearch : "")} className="px-3 py-1.5 text-xs border rounded-md" style={{ borderColor: '#D8E0EE', color: '#455270' }}>Next</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
