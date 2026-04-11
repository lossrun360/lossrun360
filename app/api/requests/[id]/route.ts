import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: {
      id: params.id,
      createdById: session.user.id, // Scope to current user
    },
    include: {
      createdBy: { select: { name: true, email: true } },
      carriers: { include: { carrier: true } },
      history: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(request)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Only allow updating certain fields
  const allowed = [
    'companyName', 'dba', 'ownerName', 'address', 'city', 'state', 'zip',
    'phone', 'email', 'mcNumber', 'entityType', 'operationType',
    'totalTrucks', 'totalDrivers', 'yearsRequested', 'policyType',
    'insuredEmail', 'ccEmails', 'notes', 'status',
  ]
  const updateData: any = {}
  for (const key of allowed) {
    if (key in body) updateData[key] = body[key]
  }

  const request = await prisma.lossRunRequest.updateMany({
    where: { id: params.id, createdById: session.user.id },
    data: updateData,
  })

  if (request.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.lossRunRequest.findUnique({ where: { id: params.id } })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Soft-delete by cancelling, or hard delete for drafts
  const req2 = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, createdById: session.user.id },
  })

  if (!req2) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (req2.status === 'DRAFT') {
    await prisma.lossRunRequest.delete({ where: { id: params.id } })
  } else {
    await prisma.lossRunRequest.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })
  }

  return NextResponse.json({ success: true })
}
