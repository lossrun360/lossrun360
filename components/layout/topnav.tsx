'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Requests', href: '/requests' },
  { label: 'Carriers', href: '/carriers' },
  { label: 'Clients', href: '/clients' },
]

export function TopNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header
      className="h-14 bg-white sticky top-0 z-30 flex items-center px-6 gap-6"
      style={{ borderBottom: '1px solid #E2E8F0' }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: '#1654D9' }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: '#0D1C38' }}>
          LossRun<span style={{ color: '#E8691A' }}>360</span>
        </span>
      </Link>

      {/* Divider */}
      <div className="w-px h-5 shrink-0" style={{ background: '#E2E8F0' }} />

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{
                background: isActive ? '#EEF3FD' : 'transparent',
                color: isActive ? '#1654D9' : '#64748B',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* New Request button */}
        <Link
          href="/requests/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors"
          style={{ background: '#1654D9' }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Request
        </Link>

        {/* Notifications */}
        <button
          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
          style={{ color: '#94A3B8' }}
          title="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5A4.5 4.5 0 003.5 6v2l-1.5 2.5h12L12.5 8V6A4.5 4.5 0 008 1.5z"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M6.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md transition-colors"
            style={{ color: '#0D1C38' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
              style={{ background: '#1654D9' }}
            >
              {(session?.user?.name || session?.user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: '#0D1C38' }}>
              {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#94A3B8' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-lg py-1 z-50"
              style={{ background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            >
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
                style={{ color: '#475569' }}
                onClick={() => setUserMenuOpen(false)}
              >
                Settings
              </Link>
              <div style={{ borderTop: '1px solid #F1F5F9' }} className="my-1" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2.5 px-3 py-2 text-sm w-full text-left transition-colors"
                style={{ color: '#DC2626' }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
