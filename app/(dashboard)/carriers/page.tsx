import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Carrier Database – LossRun360' }

export default async function CarriersPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const where: any = { isActive: true }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { shortName: { contains: searchParams.search, mode: 'insensitive' } },
      { naic: { contains: searchParams.search } },
    ]
  }

  const carriers = await prisma.insuranceCarrier.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 100,
  })

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
            Carrier Database
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', marginBottom: 0 }}>
            {carriers.length} carrier{carriers.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <form method="GET" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                name="search"
                defaultValue={searchParams.search}
                placeholder="Search carrier name or NAIC..."
                style={{ width: '100%', padding: '7px 10px 7px 30px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
              Search
            </button>
            {searchParams.search && (
              <a href="/carriers" style={{ padding: '7px 12px', fontSize: '12px', color: '#94a3b8', textDecoration: 'none', borderRadius: '6px' }}>
                Clear
              </a>
            )}
          </form>
        </div>

        {carriers.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>No carriers found</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              {searchParams.search ? 'Try a different search term.' : 'No carriers have been added yet.'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Carrier', 'Contact'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {carriers.map((carrier, i) => (
                <tr key={carrier.id} style={{ borderBottom: i < carriers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  {/* Carrier name + short name + NAIC stacked */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{carrier.name}</div>
                    {carrier.shortName && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{carrier.shortName}</div>
                    )}
                    {carrier.naic && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                        NAIC {carrier.naic}
                      </div>
                    )}
                  </td>
                  {/* Email + phone stacked */}
                  <td style={{ padding: '13px 16px' }}>
                    {carrier.lossRunEmail ? (
                      <a href={'mailto:' + carrier.lossRunEmail} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', display: 'block', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {carrier.lossRunEmail}
                      </a>
                    ) : (
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                    )}
                    {carrier.phone && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{carrier.phone}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
