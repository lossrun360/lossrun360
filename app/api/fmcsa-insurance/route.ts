import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const FMCSA_BASE = 'https://mobile.fmcsa.dot.gov/qc/services'
const FMCSA_API_KEY = process.env.FMCSA_API_KEY || ''

interface ConsolidatedPolicy {
  insurerName: string
  coverageType: string
  policyNumber: string
  startDate: string
  endDate: string
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dot = req.nextUrl.searchParams.get('dot')
  if (!dot) return NextResponse.json({ error: 'dot parameter required' }, { status: 400 })

  const cleanDOT = dot.replace(/\D/g, '')

  // Demo data for development without API key
  if (!FMCSA_API_KEY && process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      policies: [
        { insurerName: 'Progressive Commercial Insurance', coverageType: 'BIPD', policyNumber: 'PCT-20231234', startDate: '2023-01-01', endDate: '2024-12-31' },
        { insurerName: 'Great West Casualty Company', coverageType: 'BIPD', policyNumber: 'GW-20210987', startDate: '2021-01-01', endDate: '2023-01-01' },
        { insurerName: 'National Interstate Insurance', coverageType: 'BIPD', policyNumber: 'NI-2019445', startDate: '2019-06-15', endDate: '2021-01-01' },
      ]
    })
  }

  try {
    const url = `${FMCSA_BASE}/carriers/${cleanDOT}/authority-history?webKey=${FMCSA_API_KEY}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ policies: [] })

    const data = await res.json()
    const history: any[] = data?.content?.authorityHistory || []

    // Group by insurer name (normalized)
    const byInsurer: Record<string, { insurerDisplay: string; coverageType: string; policyNumber: string; start: string; end: string }[]> = {}

    for (const h of history) {
      const insurer = (h.insurerName || h.carrierName || 'Unknown').trim()
      const start = h.effectiveDate || h.insertedDate || h.postedDate || ''
      const end = h.cancellationDate || h.cancelledDate || ''
      if (!start) continue

      const key = insurer.toLowerCase()
      if (!byInsurer[key]) byInsurer[key] = []
      byInsurer[key].push({
        insurerDisplay: insurer,
        coverageType: h.bipdInsurType || h.coverageType || 'BIPD',
        policyNumber: h.policyNumber || '',
        start,
        end: end || start,
      })
    }

    const policies: ConsolidatedPolicy[] = []

    for (const [, entries] of Object.entries(byInsurer)) {
      // Sort by start date ascending
      entries.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

      let groupStart = entries[0].start
      let groupEnd = entries[0].end
      const policyNums = new Set(entries[0].policyNumber ? [entries[0].policyNumber] : [])
      const displayName = entries[0].insurerDisplay

      for (let i = 1; i < entries.length; i++) {
        const gapMs = new Date(entries[i].start).getTime() - new Date(groupEnd).getTime()
        const gapDays = gapMs / (1000 * 60 * 60 * 24)

        if (gapDays <= 60) {
          // No significant gap - consolidate
          if (new Date(entries[i].end) > new Date(groupEnd)) {
            groupEnd = entries[i].end
          }
          if (entries[i].policyNumber) policyNums.add(entries[i].policyNumber)
        } else {
          // Gap found - push current group and start new
          policies.push({
            insurerName: displayName,
            coverageType: entries[0].coverageType,
            policyNumber: Array.from(policyNums).join(', '),
            startDate: groupStart,
            endDate: groupEnd,
          })
          groupStart = entries[i].start
          groupEnd = entries[i].end
          policyNums.clear()
          if (entries[i].policyNumber) policyNums.add(entries[i].policyNumber)
        }
      }

      // Push the last group
      policies.push({
        insurerName: displayName,
        coverageType: entries[entries.length - 1].coverageType,
        policyNumber: Array.from(policyNums).join(', '),
        startDate: groupStart,
        endDate: groupEnd,
      })
    }

    // Sort most recent first
    policies.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

    // Only return last 5 years
    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
    const filtered = policies.filter(p => new Date(p.endDate) >= fiveYearsAgo)

    return NextResponse.json({ policies: filtered })
  } catch (error) {
    console.error('FMCSA insurance fetch error:', error)
    return NextResponse.json({ policies: [] })
  }
}
