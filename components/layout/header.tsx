'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header
      className="h-16 bg-white sticky top-0 z-10 flex items-center px-6 gap-4"
      style={{ borderBottom: '1px solid #E2E8F0' }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold truncate" style={{ color: '#0D1C38' }}>
              {title}
            </h1>
            {subtitle && (
              <span className="text-sm" style={{ color: '#94A3B8' }}>
                — {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {actions}

        {/* Agency pill */}
        {session?.user?.agencyName && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: '#F0F4FF', color: '#1654D9', border: '1px solid #C7D8FA' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: '#1654D9' }}
            />
            <span className="truncate max-w-[160px]">{session.user.agencyName}</span>
          </div>
        )}

        {/* Notifications */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative"
          style={{ color: '#64748B' }}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1.5A5.5 5.5 0 003.5 7v2.5l-1.5 2.5h15l-1.5-2.5V7A5.5 5.5 0 009 1.5z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M7 13.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white cursor-pointer"
          style={{ background: '#1654D9' }}
          title={session?.user?.name || session?.user?.email || ''}
        >
          {(session?.user?.name || session?.user?.email || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
