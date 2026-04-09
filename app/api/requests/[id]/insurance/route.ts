import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lookupByDOT } from '@/lib/fmcsa'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
  })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const history = await prisma.insuranceHistory.findMany({
    where: { requestId: params.id },
    orderBy: { effectiveDate: 'desc' },
  })
  return NextResponse.json({ history })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
  })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()

  // ── FMCSA auto-fetch ───────────────────────────────────────────────────────
  if (body.action === 'fetch_fmcsa') {
    try {
      const result = await lookupByDOT(request.dotNumber)
      const ins = result.insuranceHistory || []

      if (ins.length > 0) {
        await prisma.insuranceHistory.deleteMany({
          where: { requestId: params.id, source: 'FMCSA' },
        })
        await prisma.insuranceHistory.createMany({
          data: ins.map((h: any) => ({
            requestId: params.id,
            dotNumber: request.dotNumber,
            carrierName: h.carrierName,
            policyType: h.policyType || 'AUTO_LIABILITY',
            policyNumber: h.policyNumber || null,
            effectiveDate: h.coverageFrom ? new Date(h.coverageFrom) : null,
            cancellationDate: h.coverageTo ? new Date(h.coverageTo) : null,
            coverageAmount: h.coverageAmount ?? null,
            source: 'FMCSA',
          })),
        })
      }

      const history = await prisma.insuranceHistory.findMany({
        where: { requestId: params.id },
        orderBy: { effectiveDate: 'desc' },
      })
      return NextResponse.json({ history, fetched: ins.length })
    } catch (err: any) {
      console.error('FMCSA insurance fetch error:', err)
      return NextResponse.json(
        { error: err.message || 'Failed to fetch from FMCSA' },
        { status: 500 }
      )
    }
  }

  // ── Manual add ─────────────────────────────────────────────────────────────
  try {
    const effectiveDate = body.effectiveDate ? new Date(body.effectiveDate) : null
    const cancellationDate =
      body.cancellationDate && body.cancellationDate !== 'null'
        ? new Date(body.cancellationDate)
        : null
    const coverageAmount =
      body.coverageAmount != null && body.coverageAmount !== ''
        ? parseFloat(String(body.coverageAmount))
        : null

    const entry = await prisma.insuranceHistory.create({
      data: {
        requestId: params.id,
        dotNumber: request.dotNumber,
        carrierName: body.carrierName || 'Unknown',
        policyType: body.policyType || 'AUTO_LIABILITY',
        policyNumber: body.policyNumber || null,
        effectiveDate,
        cancellationDate,
        coverageAmount: isNaN(coverageAmount as number) ? null : coverageAmount,
        source: 'MANUAL',
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (err: any) {
    console.error('Manual insurance add error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to save policy' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
  })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // The history ID comes from the URL — handled by the [historyId] sub-route.
  // This catch-all DELETE is here as a fallback; real deletes go to [historyId]/route.ts.
  return NextResponse.json({ error: 'Use /insurance/{id} to delete a specific record' }, { status: 400 })
}
