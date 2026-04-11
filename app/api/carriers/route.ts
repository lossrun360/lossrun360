import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get('search')
  const specialties = searchParams.get('specialties')
  const limit = parseInt(searchParams.get('limit') || '100')

  const where: any = { isActive: true }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortName: { contains: search, mode: 'insensitive' } },
      { naic: { contains: search } },
    ]
  }
  if (specialties) {
    where.specialties = { hasSome: specialties.split(',') }
  }

  const carriers = await prisma.insuranceCarrier.findMany({
    where,
    orderBy: { name: 'asc' },
    take: Math.min(limit, 200),
  })

  return NextResponse.json({ carriers })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only admins can add carriers
  if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENCY_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  const carrier = await prisma.insuranceCarrier.create({
    data: {
      name: body.name,
      shortName: body.shortName,
      naic: body.naic,
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
      phone: body.phone,
      lossRunEmail: body.lossRunEmail,
      website: body.website,
      specialties: body.specialties || ['trucking'],
    },
  })

  return NextResponse.json(carrier, { status: 201 })
}
