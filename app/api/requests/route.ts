import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateRequestNumber } from '@/lib/utils'
import { z } from 'zod'

const CreateRequestSchema = z.object({
  dotNumber: z.string().min(1),
  mcNumber: z.string().optional(),
  companyName: z.string().min(1),
  dba: z.string().optional(),
  ownerName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  entityType: z.string().optional(),
  operationType: z.string().optional(),
  totalTrucks: z.number().optional(),
  totalDrivers: z.number().optional(),
  yearsRequested: z.number().default(5),
  policyType: z.string().optional(),
  insuredEmail: z.string().optional(),
  ccEmails: z.array(z.string()).default([]),
  notes: z.string().optional(),
  carriers: z
    .array(
      z.object({
        carrierId: z.string().optional().nullable(),
        carrierName: z.string(),
        carrierEmail: z.string().optional().nullable(),
      })
    )
    .default([]),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = 20
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: any = { createdById: session.user.id }
  if (status) where.status = status
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { dotNumber: { contains: search } },
    ]
  }

  const [requests, total] = await Promise.all([
    prisma.lossRunRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { createdBy: { select: { name: true } }, carriers: true },
    }),
    prisma.lossRunRequest.count({ where }),
  ])

  return NextResponse.json({ requests, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { agencyId: session.user.agencyId },
  })

  if (subscription) {
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const monthCount = await prisma.lossRunRequest.count({
      where: { agencyId: session.user.agencyId, createdAt: { gte: thisMonthStart } },
    })
    if (
      subscription.requestsPerMonth < 999999 &&
      monthCount >= subscription.requestsPerMonth
    ) {
      return NextResponse.json(
        { error: 'Monthly request limit reached. Please upgrade your plan.' },
        { status: 402 }
      )
    }
  }

  let body: z.infer<typeof CreateRequestSchema>
  try {
    body = CreateRequestSchema.parse(await req.json())
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request data', details: err.errors }, { status: 400 })
  }

  try {
    const request = await prisma.lossRunRequest.create({
      data: {
        requestNumber: generateRequestNumber(),
        dotNumber: body.dotNumber,
        mcNumber: body.mcNumber,
        companyName: body.companyName,
        dba: body.dba,
        ownerName: body.ownerName,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        phone: body.phone,
        email: body.email,
        entityType: body.entityType,
        operationType: body.operationType,
        totalTrucks: body.totalTrucks,
        totalDrivers: body.totalDrivers,
        yearsRequested: body.yearsRequested,
        policyType: body.policyType,
        insuredEmail: body.insuredEmail,
        ccEmails: body.ccEmails,
        notes: body.notes,
        status: 'DRAFT',
        agencyId: session.user.agencyId,
        createdById: session.user.id,
        carriers: {
          create: body.carriers.map((c) => ({
            carrierId: c.carrierId || undefined,
            carrierName: c.carrierName,
            carrierEmail: c.carrierEmail,
          })),
        },
        timeline: {
          create: {
            event: 'REQUEST_CREATED',
            description: `Request created by ${session.user.name || session.user.email}`,
          },
        },
      },
      include: { carriers: true },
    })
    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }
}
