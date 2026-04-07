'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { NewRequestModal } from '@/components/new-request-modal'

const navItems = [
  { label: 'Requests', href: '/requests' },
  { label: 'Carriers', href: '/carriers' },
]

export function TopNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <>
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', height: '56px', display: 'flex', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', position: 'sticky', top: 0, zIndex: 40 }}>
        {/* Logo */}
        <Link href="/requests" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginRight: '32px', flexShrink: 0 }}>
          <div style={{ width: '30px', height: '30px', background: '#6366f1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 12L6 4L9 9L11 6L14 12H3Z" fill="white" strokeWidth="0"/>
              <circle cx="11.5" cy="4.5" r="1.5" fill="rgba(255,255,255,0.7)"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
            LossRun<span style={{ color: '#6366f1' }}>360</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13.5px', fontWeight: isActive ? '600' : '500', color: isActive ? '#6366f1' : '#64748b', textDecoration: 'none', background: isActive ? '#eef2ff' : 'transparent' }}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: '#6366f1', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Request
          </button>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px 5px 5px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '7px', cursor: 'pointer' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}>
                {initials}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.name || 'Account'}
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#94a3b8', flexShrink: 0 }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {userMenuOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: '180px', zIndex: 50 }}>
                <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{session?.user?.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{session?.user?.email}</div>
                </div>
                <Link href="/settings" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '6px', fontSize: '13px', color: '#475569', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Settings
                </Link>
                <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/login' }) }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 10px', borderRadius: '6px', fontSize: '13px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 8H2M2 8L5 5M2 8L5 11M9 5V3a1 1 0 011-1h3a1 1 0 011 1v10a1 1 0 01-1 1h-3a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NewRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
