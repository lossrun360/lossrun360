// ─── Shared TypeScript types for LossRun360 ───────────────────────────────────

export type RequestStatus =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'SIGNED'
  | 'SENT_TO_CARRIER'
  | 'COMPLETED'
  | 'CANCELLED'

export type Role = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENT' | 'VIEWER'
export type PlanTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE'

export interface Agency {
  id: string
  name: string
  slug: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  isActive: boolean
  createdAt: string
  subscription?: Subscription
  _count?: { users: number; requests: number }
}

export interface User {
  id: string
  name?: string
  email: string
  role: Role
  isActive: boolean
  agencyId?: string
  agency?: Agency
  lastLoginAt?: string
  createdAt: string
}

export interface Subscription {
  id: string
  agencyId: string
  planTier: PlanTier
  status: SubscriptionStatus
  requestsPerMonth: number
  usersAllowed: number
  currentPeriodEnd?: string
  trialEndAt?: string
  cancelAtPeriodEnd: boolean
}

export interface LossRunRequest {
  id: string
  requestNumber: string
  status: RequestStatus
  agencyId: string
  agency?: Agency
  createdById: string
  createdBy?: User

  // Insured info
  dotNumber: string
  mcNumber?: string
  companyName: string
  dba?: string
  ownerName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  entityType?: string
  operationType?: string
  totalTrucks?: number
  totalDrivers?: number

  // Request details
  yearsRequested: number
  policyType?: string
  notes?: string

  // Signature
  signatureStatus: 'PENDING' | 'SIGNED' | 'DECLINED' | 'EXPIRED'
  signedAt?: string
  signatureDocUrl?: string

  // Sending
  insuredEmail?: string
  ccEmails: string[]
  sentToInsuredAt?: string
  sentToCarrierAt?: string
  lastReminderSentAt?: string
  reminderCount: number

  // PDF
  pdfUrl?: string
  generatedAt?: string

  carriers: RequestCarrier[]
  history?: InsuranceHistory[]
  timeline?: RequestTimeline[]

  createdAt: string
  updatedAt: string
}

export interface RequestCarrier {
  id: string
  requestId: string
  carrierId?: string
  carrier?: InsuranceCarrier
  carrierName: string
  carrierEmail?: string
  status: string
  sentAt?: string
  responseReceivedAt?: string
}

export interface InsuranceCarrier {
  id: string
  name: string
  shortName?: string
  naic?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  lossRunEmail?: string
  website?: string
  specialties: string[]
  isActive: boolean
}

export interface InsuranceHistory {
  id: string
  dotNumber: string
  carrierName: string
  policyType: string
  policyNumber?: string
  effectiveDate?: string
  cancellationDate?: string
  coverageAmount?: number
  source: string
}

export interface RequestTimeline {
  id: string
  event: string
  description?: string
  createdAt: string
}

export interface DashboardStats {
  totalRequests: number
  pendingSignature: number
  sentToCarrier: number
  completedThisMonth: number
  totalUsers: number
  requestsThisMonth: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
