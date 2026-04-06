import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateLossRunPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const request = await prisma.lossRunRequest.findFirst({
    where: { id: params.id, agencyId: session.user.agencyId },
    include: { agency: true, carriers: true },
  })

  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const pdfBuffer = await generateLossRunPDF({
      requestNumber: request.requestNumber,
      generatedDate: formatDate(new Date()),
      agencyName: request.agency.name,
      agencyAddress: [request.agency.address, request.agency.city, request.agency.state].filter(Boolean).join(', '),
      agencyPhone: request.agency.phone || undefined,
      agencyEmail: request.agency.email,
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
      carrierName: request.carriers.map((c) => c.carrierName).join(', ') || 'All Carriers',
      policyType: request.policyType || 'Auto Liability',
      yearsRequested: request.yearsRequested,
      isSigned: request.signatureStatus === 'SIGNED',
      signedName: request.companyName,
      signedDate: request.signedAt ? formatDate(request.signedAt) : undefined,
    })

    // Mark PDF as generated
    await prisma.lossRunRequest.update({
      where: { id: request.id },
      data: { generatedAt: new Date() },
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="LossRunRequest_${request.dotNumber}_${request.companyName.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
