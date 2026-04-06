import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { lookupByDOT, searchByName } from '@/lib/fmcsa'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const dot = searchParams.get('dot')
  const name = searchParams.get('name')

  if (!dot && !name) {
    return NextResponse.json({ error: 'dot or name parameter required' }, { status: 400 })
  }

  try {
    // Track API usage
    await prisma.apiUsage.create({
      data: {
        agencyId: session.user.agencyId,
        userId: session.user.id,
        endpoint: 'dot-lookup',
        dotNumber: dot || undefined,
      },
    }).catch(() => {}) // Non-blocking

    if (dot) {
      const result = await lookupByDOT(dot)
      return NextResponse.json(result)
    }

    if (name) {
      const results = await searchByName(name)
      return NextResponse.json({ results })
    }
  } catch (error) {
    console.error('DOT lookup error:', error)
    return NextResponse.json(
      { found: false, error: 'Lookup service unavailable' },
      { status: 503 }
    )
  }
}
