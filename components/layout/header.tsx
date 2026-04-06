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
        <header className="h-16 bg-white sticky top-0 z-10 flex items-center px-6 gap-4"
                style={{ borderBottom: '1px solid #E2E8F0' }}>

          {/* Page title */}
                <div className="flex-1 min-w-0">
                  {title && (
                            <div className="flex items-center gap-2">
                                        <h1 className="text-base font-semibold truncate" style={{ color: '#0D1C38' }}>
                                          {title}
                                        </h1>h1>
                              {subtitle && (
                                            <span className="text-sm" style={{ color: '#94A3B8' }}>
                                                            — {subtitle}
                                            </span>span>
                                        )}
                            </div>div>
                        )}
                </div>div>
        
          {/* Right actions */}
              <div className="flex items-center gap-2">
                {actions}
              
                {/* Agency pill */}
                {session?.user?.agencyName && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                                          style={{ background: '#F0F4FF', color: '#1654D9', border: '1px solid #C7D8FA' }}>
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{ background: '#1654D9' }} />
                                        <span className="truncate max-w-[160px]">{session.user.agencyName}</span>span>
                            </div>div>
                      )}
              
                {/* Notifications */}
                      <button
                                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative"
                                  style={{ color: '#64748B' }}
                                  title="Notifications"
                                >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M9 1.5A5.5 5.5 0 003.5 7v3l-1.5 2.5h15L15.5 10V7A5.5 5.5 0 009 1.5zM7 13.5a2 2 0 004 0"
                                                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>svg>
                      </button>button>
              
                {/* New Request */}
                      <Link
                                  href="/requests/new"
                                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm"
                                  style={{ background: '#1654D9' }}
                                  onMouseEnter={e => (e.currentTarget.style.background = '#1244BB')}
                                  onMouseLeave={e => (e.currentTarget.style.background = '#1654D9')}
                                >
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>svg>
                                New Request
                      </Link>Link>
              </div>div>
        </header>header>
      )
}</div>
