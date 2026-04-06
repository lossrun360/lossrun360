import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const portalSession = await createBillingPortalSession(session.user.agencyId)
    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to open billing portal' }, { status: 500 })
  }
}
