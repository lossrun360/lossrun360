/**
 * Email Service — LossRun360
 *
 * Uses Nodemailer with SMTP (SendGrid, Mailgun, etc.)
 * Configure via environment variables in .env.local
 */

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'apikey',
    pass: process.env.EMAIL_SERVER_PASSWORD || '',
  },
})

const FROM = `"${process.env.EMAIL_FROM_NAME || 'LossRun360'}" <${process.env.EMAIL_FROM || 'noreply@lossrun360.com'}>`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SignatureRequestEmail {
  to: string
  cc?: string[]
  insuredName: string
  agencyName: string
  agentName: string
  requestId: string
  dotNumber: string
  companyName: string
}

interface CarrierRequestEmail {
  to: string
  carrierName: string
  agencyName: string
  agentName: string
  agentPhone?: string
  agentEmail: string
  insuredName: string
  dotNumber: string
  mcNumber?: string
  policyType: string
  yearsRequested: number
  signedDocumentUrl?: string
  pdfAttachment?: Buffer
}

interface ReminderEmail {
  to: string
  insuredName: string
  agencyName: string
  agentName: string
  requestId: string
  companyName: string
  daysAgo: number
}

interface WelcomeEmail {
  to: string
  name: string
  agencyName: string
  loginUrl: string
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; color: #18181b; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: #050709; padding: 28px 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .body { padding: 32px; }
    h1 { font-size: 22px; font-weight: 700; color: #09090b; margin-bottom: 12px; }
    p { font-size: 15px; line-height: 1.6; color: #52525b; margin-bottom: 16px; }
    .info-box { background: #f4f4f5; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e4e4e7; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #3f3f46; font-size: 14px; }
    .info-value { color: #18181b; font-size: 14px; }
    .btn { display: inline-block; background: #3b82f6; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .footer { padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center; }
    .footer p { font-size: 12px; color: #a1a1aa; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">LossRun<span>360</span></div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>LossRun360 — Commercial Trucking Insurance Platform</p>
        <p style="margin-top: 4px;">© ${new Date().getFullYear()} LossRun360. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ─── Send Functions ───────────────────────────────────────────────────────────

export async function sendSignatureRequestEmail(params: SignatureRequestEmail) {
  const signUrl = `${APP_URL}/sign/${params.requestId}`

  const content = `
    <h1>Loss Run Request — Signature Required</h1>
    <p>Dear ${params.insuredName},</p>
    <p>
      <strong>${params.agencyName}</strong> is requesting your authorization to obtain
      loss run reports from your insurance carrier(s). Please review and sign the
      attached authorization form at your earliest convenience.
    </p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Company / DOT#</span>
        <span class="info-value">${params.companyName} / ${params.dotNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Requested By</span>
        <span class="info-value">${params.agentName} — ${params.agencyName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Purpose</span>
        <span class="info-value">Loss Run History Request (5 Years)</span>
      </div>
    </div>
    <p>Please click the button below to review and sign the authorization form:</p>
    <a href="${signUrl}" class="btn">Review &amp; Sign Authorization</a>
    <p style="font-size: 13px; color: #71717a;">
      If you have questions, please contact ${params.agentName} at ${params.agencyName}.
      This link will expire in 7 days.
    </p>
  `

  return transporter.sendMail({
    from: FROM,
    to: params.to,
    cc: params.cc?.length ? params.cc : undefined,
    subject: `Signature Required: Loss Run Authorization — ${params.companyName}`,
    html: baseTemplate(content, 'Loss Run Signature Request'),
  })
}

export async function sendCarrierRequestEmail(
  params: CarrierRequestEmail,
  pdfBuffer?: Buffer
) {
  const content = `
    <h1>Loss Run Request — ${params.insuredName}</h1>
    <p>Dear ${params.carrierName} Loss Runs Department,</p>
    <p>
      We are requesting loss run reports on behalf of our insured. Please see the details
      below and provide the requested information at your earliest convenience.
    </p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Insured Name</span>
        <span class="info-value">${params.insuredName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">DOT Number</span>
        <span class="info-value">${params.dotNumber}</span>
      </div>
      ${params.mcNumber ? `
      <div class="info-row">
        <span class="info-label">MC Number</span>
        <span class="info-value">${params.mcNumber}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Policy Type</span>
        <span class="info-value">${params.policyType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Years Requested</span>
        <span class="info-value">${params.yearsRequested} Years</span>
      </div>
      <div class="info-row">
        <span class="info-label">Requesting Agency</span>
        <span class="info-value">${params.agencyName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Agent Contact</span>
        <span class="info-value">${params.agentName} — ${params.agentEmail}${params.agentPhone ? ` / ${params.agentPhone}` : ''}</span>
      </div>
    </div>
    <p>
      The signed authorization from the insured is attached to this email.
      Please send loss runs to <strong>${params.agentEmail}</strong> or reply to this email.
    </p>
    <p>Thank you for your prompt attention to this request.</p>
    <p>
      Sincerely,<br/>
      <strong>${params.agentName}</strong><br/>
      ${params.agencyName}
    </p>
  `

  const attachments = []
  if (pdfBuffer) {
    attachments.push({
      filename: `LossRunRequest_${params.dotNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    })
  }

  return transporter.sendMail({
    from: FROM,
    to: params.to,
    replyTo: params.agentEmail,
    subject: `Loss Run Request — ${params.insuredName} (DOT# ${params.dotNumber})`,
    html: baseTemplate(content, 'Loss Run Request'),
    attachments,
  })
}

export async function sendReminderEmail(params: ReminderEmail) {
  const signUrl = `${APP_URL}/sign/${params.requestId}`

  const content = `
    <h1>Reminder: Signature Still Required</h1>
    <p>Dear ${params.insuredName},</p>
    <p>
      This is a friendly reminder that your signature is still needed on the loss run
      authorization form for <strong>${params.companyName}</strong>.
      The request was sent ${params.daysAgo} day${params.daysAgo !== 1 ? 's' : ''} ago and has not yet been signed.
    </p>
    <p>Please take a moment to review and sign by clicking the button below:</p>
    <a href="${signUrl}" class="btn">Sign Authorization Now</a>
    <p style="font-size: 13px; color: #71717a;">
      If you have already signed, please disregard this reminder.
      Contact ${params.agentName} at ${params.agencyName} if you have questions.
    </p>
  `

  return transporter.sendMail({
    from: FROM,
    to: params.to,
    subject: `Reminder: Loss Run Signature Needed — ${params.companyName}`,
    html: baseTemplate(content, 'Signature Reminder'),
  })
}

export async function sendWelcomeEmail(params: WelcomeEmail) {
  const content = `
    <h1>Welcome to LossRun360!</h1>
    <p>Hi ${params.name},</p>
    <p>
      You've been added to <strong>${params.agencyName}</strong> on LossRun360 —
      the fastest way to manage trucking loss run requests.
    </p>
    <p>Click below to log in and get started:</p>
    <a href="${params.loginUrl}" class="btn">Log In to LossRun360</a>
    <p style="font-size: 13px; color: #71717a;">
      If you did not expect this invitation, please ignore this email.
    </p>
  `

  return transporter.sendMail({
    from: FROM,
    to: params.to,
    subject: `Welcome to LossRun360 — ${params.agencyName}`,
    html: baseTemplate(content, 'Welcome to LossRun360'),
  })
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch {
    return false
  }
}
