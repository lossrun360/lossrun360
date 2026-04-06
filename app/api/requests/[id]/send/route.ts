import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSignatureRequestEmail, sendCarrierRequestEmail } from '@/lib/email'
import { generateLossRunPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const type = body.type as 'signature' | 'carriers'

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
    include: {
      carriers: { include: { carrier: true } },
      agency: true,
    },
  })

  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const agency = request.agency

  if (type === 'signature') {
    if (!request.insuredEmail) {
      return NextResponse.json({ error: 'No insured email on record' }, { status: 400 })
    }

    try {
      await sendSignatureRequestEmail({
        to: request.insuredEmail,
        cc: request.ccEmails,
        insuredName: request.ownerName || request.companyName,
        agencyName: agency.name,
        agentName: session.user.name || session.user.email,
        requestId: request.id,
        dotNumber: request.dotNumber,
        companyName: request.companyName,
      })

      await prisma.lossRunRequest.update({
        where: { id: request.id },
        data: {
          status: 'PENDING_SIGNATURE',
          sentToInsuredAt: new Date(),
        },
      })

      await prisma.requestTimeline.create({
        data: {
          requestId: request.id,
          event: 'SENT_FOR_SIGNATURE',
          description: `Signature request sent to ${request.insuredEmail}`,
        },
      })

      return NextResponse.json({ message: `Signature request sent to ${request.insuredEmail}` })
    } catch (err) {
      console.error('Send signature error:', err)
      return NextResponse.json({ error: 'Failed to send signature request' }, { status: 500 })
    }
  }

  if (type === 'carriers') {
    if (request.status !== 'SIGNED' && request.status !== 'SENT_TO_CARRIER') {
      return NextResponse.json(
        { error: 'Request must be signed before sending to carriers' },
        { status: 400 }
      )
    }

    if (!request.carriers.length) {
      return NextResponse.json({ error: 'No carriers selected' }, { status: 400 })
    }

    try {
      // Generate PDF
      const pdfData = {
        requestNumber: request.requestNumber,
        generatedDate: formatDate(new Date()),
        agencyName: agency.name,
        agencyAddress: [agency.address, agency.city, agency.state].filter(Boolean).join(', '),
        agencyPhone: agency.phone || undefined,
        agencyEmail: agency.email,
        agentName: session.user.name || session.user.email,
        insuredName: request.companyName,
        insuredDBA: request.dba || undefined,
        insuredDOT: request.dotNumber,
        insuredMC: request.mcNumber || undefined,
        insuredAddress: request.address || undefined,
        insuredCity: request.city || undefined,
        insuredState: request.state || undefined,
        insuredZip: request.zip || undefined,
        insuredPhone: request.phone || undefined,
        insuredEntityType: request.entityType || undefined,
        carrierName: request.carriers.map((c) => c.carrierName).join(', '),
        policyType: request.policyType || 'Auto Liability',
        yearsRequested: request.yearsRequested,
        isSigned: request.signatureStatus === 'SIGNED',
        signedDate: request.signedAt ? formatDate(request.signedAt) : undefined,
      }

      const pdfBuffer = await generateLossRunPDF(pdfData)

      // Send to each carrier
      const results = await Promise.allSettled(
        request.carriers.map(async (rc) => {
          if (!rc.carrierEmail) return { skipped: true, carrier: rc.carrierName }

          await sendCarrierRequestEmail(
            {
              to: rc.carrierEmail,
              carrierName: rc.carrierName,
              agencyName: agency.name,
              agentName: session.user.name || session.user.email,
              agentEmail: agency.email,
              agentPhone: agency.phone || undefined,
              insuredName: request.companyName,
              dotNumber: request.dotNumber,
              mcNumber: request.mcNumber || undefined,
              policyType: request.policyType || 'Auto Liability',
              yearsRequested: request.yearsRequested,
            },
            pdfBuffer
          )

          await prisma.requestCarrier.update({
            where: { id: rc.id },
            data: { status: 'SENT', sentAt: new Date() },
          })

          return { sent: true, carrier: rc.carrierName }
        })
      )

      const sent = results.filter((r) => r.status === 'fulfilled').length

      await prisma.lossRunRequest.update({
        where: { id: request.id },
        data: { status: 'SENT_TO_CARRIER', sentToCarrierAt: new Date() },
      })

      await prisma.requestTimeline.create({
        data: {
          requestId: request.id,
          event: 'SENT_TO_CARRIERS',
          description: `Request sent to ${sent} carrier${sent !== 1 ? 's' : ''}`,
        },
      })

      return NextResponse.json({ message: `Request sent to ${sent} carrier${sent !== 1 ? 's' : ''}` })
    } catch (err) {
      console.error('Send to carriers error:', err)
      return NextResponse.json({ error: 'Failed to send to carriers' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
