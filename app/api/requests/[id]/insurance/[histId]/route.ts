import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
    { params }: { params: { id: string; histId: string } }
    ) {
      const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
          const request = await prisma.lossRunRequest.findFirst({
              where: { id: params.id, agencyId: session.user.agencyId },
                })
                  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
                    try {
                        await prisma.insuranceHistory.delete({ where: { id: params.histId } })
                            return NextResponse.json({ success: true })
                              } catch {
                                  return NextResponse.json({ error: 'Not found' }, { status: 404 })
                                    }
                                    }