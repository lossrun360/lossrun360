import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch {
    return '—'
  }
}

export function timeAgo(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_SIGNATURE: 'Awaiting Signature',
  SIGNED: 'Signed',
  SENT_TO_CARRIER: 'Sent to Carrier',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'badge-gray',
  PENDING_SIGNATURE: 'badge-yellow',
  SIGNED: 'badge-blue',
  SENT_TO_CARRIER: 'badge-purple',
  COMPLETED: 'badge-green',
  CANCELLED: 'badge-red',
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  AGENCY_ADMIN: 'Admin',
  AGENT: 'Agent',
  VIEWER: 'Viewer',
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateRequestNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `LR${year}-${rand}`
}

export function truncate(str: string, length = 40): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '…'
}

export function parseEmails(input: string): string[] {
  return input
    .split(/[,;\n]/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
}
