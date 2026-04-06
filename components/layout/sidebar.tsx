'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Logo } from './logo'
import { cn } from '@/lib/utils'
import { ROLE_LABELS } from '@/lib/utils'

const navigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Loss Run Requests',
    href: '/requests',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 6h6M5 8.5h4M5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Carrier Database',
    href: '/carriers',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4l6-2 6 2v3c0 3.5-2.5 6.5-6 7.5C4.5 13.5 2 10.5 2 7V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M6 8l1.5 1.5L10 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Team & Users',
    href: '/users',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 13c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 3c1.38 0 2.5 1.12 2.5 2.5S12.38 8 11 8M15 13c0-1.87-1.5-3-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    adminOnly: false,
  },
]

const bottomNavigation = [
  {
    label: 'Billing',
    href: '/billing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 10.5h2M10 10.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const isAdmin =
    session?.user?.role === 'AGENCY_ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-surface border-r border-border overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Logo href="/dashboard" />
      </div>

      {/* New Request CTA */}
      <div className="px-3 pt-4">
        <Link
          href="/requests/new"
          className="flex items-center gap-2 w-full px-3 py-2.5 bg-primary hover:bg-primary-hover rounded-lg text-white text-sm font-semibold transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Request
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 pb-2">
        <div className="space-y-0.5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              )}
            >
              <span className={cn(isActive(item.href) ? 'text-primary' : 'text-text-muted')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        {session?.user?.role === 'SUPER_ADMIN' && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="px-3 mb-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Admin
            </p>
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                <path d="M8 1L10.5 5.5H15L11.5 8.5L13 13L8 10.5L3 13L4.5 8.5L1 5.5H5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Super Admin
            </Link>
          </>
        )}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-2 border-t border-border pt-3">
        <div className="space-y-0.5">
          {bottomNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              )}
            >
              <span className={cn(isActive(item.href) ? 'text-primary' : 'text-text-muted')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-xs font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-text-muted truncate">
              {ROLE_LABELS[session?.user?.role || ''] || session?.user?.role}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-text-muted hover:text-text-primary transition-colors shrink-0"
            title="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
