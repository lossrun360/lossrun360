import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lookupByDOT } from '@/lib/fmcsa'
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const request = await prisma.lossRunRequest.findFirst({ where: { id: params.id, agencyId: session.user.agencyId } })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const history = await prisma.insuranceHistory.findMany({ where: { requestId: params.id }, orderBy: { effectiveDate: 'desc' } })
  return NextResponse.json({ history })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const request = await prisma.lossRunRequest.findFirst({ where: { id: params.id, agencyId: session.user.agencyId } })
        if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
          const body = await req.json()
            if (body.action === 'fetch_fmcsa') {
                try {
                      const result = await lookupByDOT(request.dotNumber)
                            const ins = result.insuranceHistory || []
                                  if (ins.length > 0) {
                                          await prisma.insuranceHistory.deleteMany({ where: { requestId: params.id, source: 'FMCSA' } })
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
                                                                                                                                                                                                                                      } catch (err) {
                                                                                                                                                                                                                                            console.error('FMCSA insurance fetch error:', err)
                                                                                                                                                                                                                                                  return NextResponse.json({ error: 'Failed to fetch from FMCSA' }, { status: 500 })
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                          // Manual add
                                                                                                                                                                                                                                                            const entry = await prisma.insuranceHistory.create({
                                                                                                                                                                                                                                                                data: {
                                                                                                                                                                                                                                                                      requestId: params.id,
                                                                                                                                                                                                                                                                            dotNumber: request.dotNumber,
                                                                                                                                                                                                                                                                                  carrierName: body.carrierName || 'Unknown',
                                                                                                                                                                                                                                                                                        policyType: body.policyType || 'AUTO_LIABILITY',
                                                                                                                                                                                                                                                                                              policyNumber: body.policyNumber || null,
                                                                                                                                                                                                                                                                                                    effectiveDate: body.effectiveDate ? new Date(body.effectiveDate) : null,
                                                                                                                                                                                                                                                                                                          cancellationDate: body.cancellationDate ? new Date(body.cancellationDate) : null,
                                                                                                                                                                                                                                                                                                                coverageAmount: body.coverageAmount ? parseFloat(body.coverageAmount) : null,
                                                                                                                                                                                                                                                                                                                      source: 'MANUAL',
                                                                                                                                                                                                                                                                                                                          },
                                                                                                                                                                                                                                                                                                                            })
                                                                                                                                                                                                                                                                                                                              return NextResponse.json(entry, { status: 201 })
                                                                                                                                                                                                                                                                                                                              }