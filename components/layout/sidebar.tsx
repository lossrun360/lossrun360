'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
        <path d="M3 2h7l4 4v8H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 2v4h4M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Carriers',
    href: '/carriers',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside
      className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col overflow-y-auto"
      style={{ background: '#ffffff', borderRight: '1px solid rgba(19,0,50,0.15)' }}
    >
      {/* Logo */}
      <div
        className="h-14 flex items-center px-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(19,0,50,0.15)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: '#4c00ff' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: '#130032' }}
          >
            LossRun<span style={{ color: '#4c00ff' }}>360</span>
          </span>
        </Link>
      </div>

      {/* New Request CTA */}
      <div className="px-3 py-3 shrink-0">
        <Link
          href="/requests/new"
          className="flex items-center justify-center gap-2 w-full rounded-md text-sm font-semibold text-white transition-colors"
          style={{ background: '#4c00ff', height: '40px' }}
          onMouseOver={e => (e.currentTarget.style.background = '#3d1eb2')}
          onMouseOut={e => (e.currentTarget.style.background = '#4c00ff')}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          New Request
        </Link>
      </div>

      {/* Nav section */}
      <nav className="flex-1 overflow-y-auto">
        <p
          className="px-4 mt-2 mb-1 text-[10px] font-medium uppercase tracking-widest"
          style={{ color: 'rgba(19,0,50,0.4)' }}
        >
          Menu
        </p>
        <ul>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 text-[13px] transition-colors relative"
                  style={{
                    padding: '8px 16px',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#4c00ff' : 'rgba(19,0,50,0.6)',
                    background: isActive ? 'rgba(76,0,255,0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #4c00ff' : '3px solid transparent',
                  }}
                >
                  <span style={{ color: isActive ? '#4c00ff' : 'rgba(19,0,50,0.4)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div
        className="p-3 shrink-0"
        style={{ borderTop: '1px solid rgba(19,0,50,0.15)' }}
      >
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: '#4c00ff' }}
          >
            {(session?.user?.name || session?.user?.email || 'U')
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] font-medium truncate"
              style={{ color: '#130032' }}
            >
              {session?.user?.name || 'User'}
            </p>
            <p
              className="text-[11px] truncate"
              style={{ color: 'rgba(19,0,50,0.5)' }}
            >
              {session?.user?.role ? ROLE_LABELS[session.user.role] : ''}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="shrink-0 p-1 rounded transition-colors"
            style={{ color: 'rgba(19,0,50,0.4)' }}
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path
                d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-3-3-3M13 7.5H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
