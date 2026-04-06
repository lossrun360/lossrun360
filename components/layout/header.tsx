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
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10 flex items-center px-6 gap-4">
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-text-primary truncate">{title}</h1>
            {subtitle && <span className="text-text-muted text-sm">— {subtitle}</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {/* Agency badge */}
        {session?.user?.agencyName && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-text-secondary truncate max-w-[160px]">
              {session.user.agencyName}
            </span>
          </div>
        )}

        {/* Notifications placeholder */}
        <button className="btn-icon btn-ghost relative" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5A5.5 5.5 0 003.5 7v3l-1.5 2.5h15L15.5 10V7A5.5 5.5 0 009 1.5zM7 13.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Quick new request */}
        <Link href="/requests/new" className="btn-primary btn-sm hidden sm:flex">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Request
        </Link>
      </div>
    </header>
  )
}
