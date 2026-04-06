import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendReminderEmail } from '@/lib/email'
import { differenceInDays } from 'date-fns'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
    include: { agency: true },
  })

  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!request.insuredEmail) return NextResponse.json({ error: 'No insured email' }, { status: 400 })
  if (request.status !== 'PENDING_SIGNATURE') {
    return NextResponse.json({ error: 'Reminder only available for pending signature requests' }, { status: 400 })
  }

  // Rate limit: don't send more than 1 reminder per day
  if (request.lastReminderSentAt) {
    const hoursSince = (Date.now() - new Date(request.lastReminderSentAt).getTime()) / (1000 * 60 * 60)
    if (hoursSince < 24) {
      return NextResponse.json(
        { error: 'Reminder already sent in the last 24 hours' },
        { status: 429 }
      )
    }
  }

  try {
    const daysAgo = request.sentToInsuredAt
      ? differenceInDays(new Date(), new Date(request.sentToInsuredAt))
      : 1

    await sendReminderEmail({
      to: request.insuredEmail,
      insuredName: request.ownerName || request.companyName,
      agencyName: request.agency.name,
      agentName: session.user.name || session.user.email,
      requestId: request.id,
      companyName: request.companyName,
      daysAgo,
    })

    await prisma.lossRunRequest.update({
      where: { id: request.id },
      data: {
        lastReminderSentAt: new Date(),
        reminderCount: { increment: 1 },
      },
    })

    await prisma.requestTimeline.create({
      data: {
        requestId: request.id,
        event: 'REMINDER_SENT',
        description: `Reminder sent to ${request.insuredEmail}`,
      },
    })

    return NextResponse.json({ message: `Reminder sent to ${request.insuredEmail}` })
  } catch (err) {
    console.error('Send reminder error:', err)
    return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 })
  }
}
