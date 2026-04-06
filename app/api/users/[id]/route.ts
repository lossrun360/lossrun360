import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'AGENCY_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { isActive, role } = body

  const user = await prisma.user.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(isActive !== undefined ? { isActive } : {}),
      ...(role ? { role } : {}),
    },
  })

  return NextResponse.json({ success: true })
}
