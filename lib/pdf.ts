/**
 * PDF Generation — LossRun360
 *
 * Generates professional loss run request PDF documents using @react-pdf/renderer.
 * Called server-side from API routes.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from '@react-pdf/renderer'
import React from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LossRunPDFData {
  requestNumber: string
  generatedDate: string
  agencyName: string
  agencyAddress?: string
  agencyPhone?: string
  agencyEmail?: string
  agencyLicense?: string
  agentName: string

  insuredName: string
  insuredDBA?: string
  insuredDOT: string
  insuredMC?: string
  insuredAddress?: string
  insuredCity?: string
  insuredState?: string
  insuredZip?: string
  insuredPhone?: string
  insuredEmail?: string
  insuredEntityType?: string
  insuredOperationType?: string

  carrierName: string
  policyType: string
  yearsRequested: number
  effectiveDate?: string
  expirationDate?: string

  signatureDataUrl?: string
  signedName?: string
  signedDate?: string
  isSigned: boolean

  notes?: string
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 48,
    backgroundColor: '#ffffff',
    color: '#18181b',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#050709',
  },
  logoBlock: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#050709',
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 8,
    color: '#71717a',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  requestNum: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 4,
  },
  dateText: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 2,
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  // Grid rows
  grid2: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCell: {
    flex: 1,
  },
  field: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 8,
    color: '#71717a',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 10,
    color: '#18181b',
    fontFamily: 'Helvetica',
  },
  fieldValueBold: {
    fontSize: 10,
    color: '#18181b',
    fontFamily: 'Helvetica-Bold',
  },
  // Authorization Text
  authBox: {
    backgroundColor: '#f4f4f5',
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  authText: {
    fontSize: 10,
    color: '#3f3f46',
    lineHeight: 1.6,
  },
  // Signature
  sigSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
  },
  sigGrid: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 12,
  },
  sigBlock: {
    flex: 1,
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
    height: 32,
    marginBottom: 4,
  },
  sigLabel: {
    fontSize: 8,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signedValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-BoldOblique',
    color: '#1d4ed8',
    paddingBottom: 4,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#a1a1aa',
  },
})

// ─── PDF Document Component ────────────────────────────────────────────────────

function LossRunDocument({ data }: { data: LossRunPDFData }) {
  const fullAddress = [data.insuredAddress, data.insuredCity, data.insuredState, data.insuredZip]
    .filter(Boolean)
    .join(', ')

  const authorizationText = `I, the undersigned, hereby authorize ${data.carrierName} to release complete loss run information, claims history, and insurance records for the above-named insured to ${data.agencyName}. This authorization covers the past ${data.yearsRequested} (${data.yearsRequested}) policy years for all commercial auto liability, general liability, cargo, and/or any other coverage lines held with your company. This release is requested for insurance placement and underwriting purposes only. A photocopy or electronic copy of this authorization shall be as valid as the original.`

  return React.createElement(
    Document,
    {
      title: `Loss Run Request — ${data.insuredName}`,
      author: 'LossRun360',
      subject: 'Loss Run Authorization Request',
    },
    React.createElement(
      Page,
      { size: 'LETTER', style: styles.page },

      // ── Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.logoBlock },
          React.createElement(Text, { style: styles.logoText }, 'LossRun360'),
          React.createElement(Text, { style: styles.logoSub }, 'Commercial Trucking Insurance Platform')
        ),
        React.createElement(
          View,
          { style: styles.headerRight },
          React.createElement(Text, { style: styles.docTitle }, 'Loss Run Request'),
          React.createElement(Text, { style: styles.requestNum }, `Request #${data.requestNumber}`),
          React.createElement(Text, { style: styles.dateText }, `Generated: ${data.generatedDate}`)
        )
      ),

      // ── Agency Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Requesting Agency'),
        React.createElement(
          View,
          { style: styles.grid2 },
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Agency Name'),
              React.createElement(Text, { style: styles.fieldValueBold }, data.agencyName)
            ),
            data.agencyAddress
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Address'),
                  React.createElement(Text, { style: styles.fieldValue }, data.agencyAddress)
                )
              : null
          ),
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Agent Name'),
              React.createElement(Text, { style: styles.fieldValue }, data.agentName)
            ),
            data.agencyPhone
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Phone'),
                  React.createElement(Text, { style: styles.fieldValue }, data.agencyPhone)
                )
              : null,
            data.agencyEmail
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Email'),
                  React.createElement(Text, { style: styles.fieldValue }, data.agencyEmail)
                )
              : null
          )
        )
      ),

      // ── Insured Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Insured Information'),
        React.createElement(
          View,
          { style: styles.grid2 },
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Legal Company Name'),
              React.createElement(Text, { style: styles.fieldValueBold }, data.insuredName)
            ),
            data.insuredDBA
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'DBA'),
                  React.createElement(Text, { style: styles.fieldValue }, data.insuredDBA)
                )
              : null,
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Address'),
              React.createElement(Text, { style: styles.fieldValue }, fullAddress || 'N/A')
            )
          ),
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'USDOT Number'),
              React.createElement(Text, { style: styles.fieldValueBold }, data.insuredDOT)
            ),
            data.insuredMC
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'MC Number'),
                  React.createElement(Text, { style: styles.fieldValue }, data.insuredMC)
                )
              : null,
            data.insuredPhone
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Phone'),
                  React.createElement(Text, { style: styles.fieldValue }, data.insuredPhone)
                )
              : null,
            data.insuredEntityType
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Entity Type'),
                  React.createElement(Text, { style: styles.fieldValue }, data.insuredEntityType)
                )
              : null
          )
        )
      ),

      // ── Request Details
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Request Details'),
        React.createElement(
          View,
          { style: styles.grid2 },
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Insurance Carrier'),
              React.createElement(Text, { style: styles.fieldValueBold }, data.carrierName)
            ),
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Coverage Type'),
              React.createElement(Text, { style: styles.fieldValue }, data.policyType)
            )
          ),
          React.createElement(
            View,
            { style: styles.gridCell },
            React.createElement(
              View,
              { style: styles.field },
              React.createElement(Text, { style: styles.fieldLabel }, 'Years of History Requested'),
              React.createElement(Text, { style: styles.fieldValueBold }, `${data.yearsRequested} Years`)
            ),
            data.effectiveDate
              ? React.createElement(
                  View,
                  { style: styles.field },
                  React.createElement(Text, { style: styles.fieldLabel }, 'Effective Date'),
                  React.createElement(Text, { style: styles.fieldValue }, data.effectiveDate)
                )
              : null
          )
        )
      ),

      // ── Authorization Text
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Authorization'),
        React.createElement(
          View,
          { style: styles.authBox },
          React.createElement(Text, { style: styles.authText }, authorizationText)
        )
      ),

      // ── Signature
      React.createElement(
        View,
        { style: styles.sigSection },
        React.createElement(Text, { style: styles.sectionTitle }, 'Authorized Signature'),
        React.createElement(
          View,
          { style: styles.sigGrid },
          React.createElement(
            View,
            { style: styles.sigBlock },
            data.isSigned && data.signedName
              ? React.createElement(Text, { style: styles.signedValue }, data.signedName)
              : React.createElement(View, { style: styles.sigLine }),
            React.createElement(Text, { style: styles.sigLabel }, 'Authorized Signature')
          ),
          React.createElement(
            View,
            { style: { ...styles.sigBlock, flex: 0.5 } },
            data.isSigned && data.signedDate
              ? React.createElement(Text, { style: styles.fieldValue }, data.signedDate)
              : React.createElement(View, { style: styles.sigLine }),
            React.createElement(Text, { style: styles.sigLabel }, 'Date')
          ),
          React.createElement(
            View,
            { style: styles.sigBlock },
            React.createElement(View, { style: styles.sigLine }),
            React.createElement(Text, { style: styles.sigLabel }, 'Printed Name & Title')
          )
        )
      ),

      // ── Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          Text,
          { style: styles.footerText },
          `LossRun360 | Request #${data.requestNumber}`
        ),
        React.createElement(
          Text,
          { style: styles.footerText },
          'This document was generated by LossRun360 — lossrun360.com'
        )
      )
    )
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export async function generateLossRunPDF(data: LossRunPDFData): Promise<Buffer> {
  const element = React.createElement(LossRunDocument, { data })
  const buffer = await renderToBuffer(element as any)
  return Buffer.from(buffer)
}
