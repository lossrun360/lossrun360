import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { agencyName, name, email, password, phone, slug } = body

  if (!agencyName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const existingAgency = await prisma.agency.findUnique({ where: { slug } })
  const finalSlug = existingAgency
    ? `${slug}-${Date.now()}`
    : slug

  const hashedPassword = await bcrypt.hash(password, 12)

  const agency = await prisma.agency.create({
    data: {
      name: agencyName,
      slug: finalSlug,
      email: email.toLowerCase(),
      phone,
    },
  })

  // Create 14-day trial subscription
  await prisma.subscription.create({
    data: {
      agencyId: agency.id,
      planTier: 'STARTER',
      status: 'TRIALING',
      requestsPerMonth: 25,
      usersAllowed: 3,
      trialEndAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  })

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'AGENCY_ADMIN',
      agencyId: agency.id,
    },
  })

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
}
