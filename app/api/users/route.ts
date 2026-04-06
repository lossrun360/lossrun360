import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    where: { agencyId: session.user.agencyId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, name: true, email: true, role: true,
      isActive: true, lastLoginAt: true, createdAt: true,
    },
  })

  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'AGENCY_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check user limit
  const subscription = await prisma.subscription.findUnique({
    where: { agencyId: session.user.agencyId },
  })
  const currentUserCount = await prisma.user.count({
    where: { agencyId: session.user.agencyId, isActive: true },
  })
  if (subscription && subscription.usersAllowed < 999999 && currentUserCount >= subscription.usersAllowed) {
    return NextResponse.json({ error: 'User limit reached. Please upgrade your plan.' }, { status: 402 })
  }

  const body = await req.json()
  const { name, email, role } = body

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

  // Create user with temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + 'A1!'
  const hashed = await bcrypt.hash(tempPassword, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'AGENT',
      agencyId: session.user.agencyId,
    },
    select: {
      id: true, name: true, email: true, role: true, isActive: true, createdAt: true,
    },
  })

  // Send welcome email (non-blocking)
  sendWelcomeEmail({
    to: email,
    name: name || email,
    agencyName: session.user.agencyName,
    loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  }).catch(console.error)

  return NextResponse.json({ user }, { status: 201 })
}
