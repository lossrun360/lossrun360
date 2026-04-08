'use client'
import { useRouter } from 'next/navigation'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: '#92400e', bg: '#fef3c7' },
  PENDING_SIGNATURE: { label: 'Awaiting Signature', color: '#1e40af', bg: '#dbeafe' },
  SIGNED: { label: 'Signed', color: '#065f46', bg: '#d1fae5' },
  SENT_TO_CARRIER: { label: 'Sent to Carrier', color: '#1557c0', bg: '#dbeafe' },
  COMPLETED: { label: 'Completed', color: '#065f46', bg: '#d1fae5' },
  CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + 'm ago'
  if (s < 86400) return Math.floor(s / 3600) + 'h ago'
  return Math.floor(s / 86400) + 'd ago'
}

interface RequestRow {
  id: string
  companyName: string
  dotNumber: string
  status: string
  carriers: { id: string; carrierName?: string | null }[]
  createdBy?: { name?: string | null } | null
  createdAt: string
}

export function RequestsTable({ requests }: { requests: RequestRow[] }) {
  const router = useRouter()
  if (requests.length === 0) return null

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {['Company', 'DOT#', 'Status', 'Carriers', 'Agent', 'Created'].map((h) => (
            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {requests.map((req, i) => {
          const s = STATUS_CONFIG[req.status] || { label: req.status, color: '#475569', bg: '#f1f5f9' }
          return (
            <tr
              key={req.id}
              onClick={() => router.push('/requests/' + req.id)}
              style={{ borderBottom: i < requests.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#fafbff' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '' }}
            >
              <td style={{ padding: '17px 16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{req.companyName}</div>
              </td>
              <td style={{ padding: '17px 16px' }}>
                <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>{req.dotNumber}</div>
              </td>
              <td style={{ padding: '17px 16px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>
              </td>
              <td style={{ padding: '17px 16px' }}>
                {req.carriers.length > 0 ? (
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {req.carriers.slice(0, 2).map((c) => c.carrierName).join(', ')}
                    {req.carriers.length > 2 && <span style={{ color: '#94a3b8' }}> +{req.carriers.length - 2}</span>}
                  </div>
                ) : <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>}
              </td>
              <td style={{ padding: '17px 16px', fontSize: '12px', color: '#64748b' }}>{req.createdBy?.name || '—'}</td>
              <td style={{ padding: '17px 16px', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{timeAgo(req.createdAt)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
