import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { tier, priceId } = body

  if (!tier || !priceId) {
    return NextResponse.json({ error: 'tier and priceId required' }, { status: 400 })
  }

  const agency = await prisma.agency.findUnique({ where: { id: session.user.agencyId } })
  if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 })

  try {
    const checkoutSession = await createCheckoutSession({
      agencyId: session.user.agencyId,
      agencyEmail: agency.email,
      priceId,
      tier,
    })
    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create checkout' }, { status: 500 })
  }
}
