'use client'

import { useSession } from 'next-auth/react'

interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header
      className="sticky top-0 z-10 flex items-center px-6 gap-4"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(19,0,50,0.15)',
        height: '56px',
      }}
    >
      {/* Page title / breadcrumb */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-baseline gap-2">
            <h1
              className="truncate"
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#130032',
                letterSpacing: '-0.2px',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <span
                style={{ fontSize: '13px', color: 'rgba(19,0,50,0.5)' }}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {actions}

        {/* Agency badge */}
        {session?.user?.agencyName && (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(76,0,255,0.08)',
              color: '#4c00ff',
              border: '1px solid rgba(76,0,255,0.2)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: '#4c00ff' }}
            />
            <span className="truncate max-w-[160px]">
              {session.user.agencyName}
            </span>
          </div>
        )}

        {/* Bell icon */}
        <button
          className="flex items-center justify-center rounded-md transition-colors"
          style={{
            width: '32px',
            height: '32px',
            color: 'rgba(19,0,50,0.4)',
            background: 'transparent',
          }}
          title="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1.5A5.5 5.5 0 003.5 7v2.5l-1.5 2.5h15l-1.5-2.5V7A5.5 5.5 0 009 1.5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 13.5a2 2 0 004 0"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-white cursor-pointer shrink-0"
          style={{
            width: '32px',
            height: '32px',
            background: '#4c00ff',
            fontSize: '13px',
            fontWeight: 600,
          }}
          title={session?.user?.name || session?.user?.email || ''}
        >
          {(session?.user?.name || session?.user?.email || 'U')
            .charAt(0)
            .toUpperCase()}
        </div>
      </div>
    </header>
  )
}
