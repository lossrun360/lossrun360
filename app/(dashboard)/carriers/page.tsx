import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'

export const metadata = { title: 'Carrier Database' }

export default async function CarriersPage({
  searchParams,
}: {
  searchParams: { search?: string; state?: string }
}) {
  const where: any = { isActive: true }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { shortName: { contains: searchParams.search, mode: 'insensitive' } },
      { naic: { contains: searchParams.search } },
    ]
  }
  if (searchParams.state) where.state = searchParams.state

  const carriers = await prisma.insuranceCarrier.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 100,
  })

  return (
    <div>
      <Header title="Carrier Database" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <form method="GET" className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search by carrier name or NAIC..."
              className="input max-w-sm"
            />
            <button type="submit" className="btn-secondary btn">Search</button>
            {searchParams.search && (
              <a href="/carriers" className="btn-ghost btn">Clear</a>
            )}
          </form>
          <p className="text-sm text-text-muted">{carriers.length} carriers</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Carrier</th>
                <th>NAIC</th>
                <th>Location</th>
                <th>Loss Run Email</th>
                <th>Phone</th>
                <th>Specialties</th>
              </tr>
            </thead>
            <tbody>
              {carriers.map((carrier) => (
                <tr key={carrier.id}>
                  <td>
                    <p className="font-semibold text-text-primary">{carrier.name}</p>
                    {carrier.shortName && <p className="text-xs text-text-muted">{carrier.shortName}</p>}
                  </td>
                  <td className="font-mono text-sm text-text-secondary">{carrier.naic || '—'}</td>
                  <td className="text-text-secondary text-sm">
                    {[carrier.city, carrier.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td>
                    {carrier.lossRunEmail ? (
                      <a href={`mailto:${carrier.lossRunEmail}`} className="text-primary hover:underline text-sm truncate block max-w-[200px]">
                        {carrier.lossRunEmail}
                      </a>
                    ) : (
                      <span className="text-text-muted text-sm">—</span>
                    )}
                  </td>
                  <td className="text-text-secondary text-sm">{carrier.phone || '—'}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {carrier.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="badge badge-gray text-xs capitalize">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
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
