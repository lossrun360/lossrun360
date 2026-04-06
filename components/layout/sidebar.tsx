'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
                </svg>svg>
              ),
  },
  {
        label: 'Loss Run Requests',
        href: '/requests',
        icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 6h6M5 8.5h4M5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>svg>
              ),
  },
  {
        label: 'Carrier Database',
        href: '/carriers',
        icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4l6-2 6 2v3c0 3.5-2.5 6.5-6 7.5C4.5 13.5 2 10.5 2 7V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M6 8l1.5 1.5L10 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>svg>
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
                </svg>svg>
              ),
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
                  </svg>svg>
                ),
    },
    {
          label: 'Settings',
          href: '/settings',
          icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>svg>
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
                  
                    return (
                          <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-white overflow-y-auto"
                                  style={{ borderRight: '1px solid #E2E8F0' }}>
                          
                            {/* Logo */}
                                <div className="px-5 h-16 flex items-center" style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <Link href="/dashboard" className="flex items-center gap-2.5">
                                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                                style={{ background: '#1654D9' }}>
                                                              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                                                                            <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                                              </svg>svg>
                                                  </div>div>
                                                  <span className="font-bold text-base tracking-tight" style={{ color: '#0D1C38' }}>
                                                              LossRun<span style={{ color: '#E8691A' }}>360</span>span>
                                                  </span>span>
                                        </Link>Link>
                                </div>div>
                          
                            {/* New Request CTA */}
                                <div className="px-4 pt-5 pb-1">
                                        <Link
                                                    href="/requests/new"
                                                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-white text-sm font-semibold transition-all shadow-sm"
                                                    style={{ background: '#1654D9' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#1244BB')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = '#1654D9')}
                                                  >
                                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                                                              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                  </svg>svg>
                                                  New Request
                                        </Link>Link>
                                </div>div>
                          
                            {/* Nav section label */}
                                <div className="px-5 pt-5 pb-1">
                                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                                                  Menu
                                        </p>p>
                                </div>div>
                          
                            {/* Navigation */}
                                <nav className="flex-1 px-3 pb-2">
                                        <div className="space-y-0.5">
                                          {navigation.map((item) => (
                                                <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className={cn(
                                                                                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                                                                )}
                                                                style={
                                                                                  isActive(item.href)
                                                                                    ? { background: '#EEF3FD', color: '#1654D9' }
                                                                                    : { color: '#475569' }
                                                                }
                                                              >
                                                              <span className="shrink-0">{item.icon}</span>span>
                                                  {item.label}
                                                  {isActive(item.href) && (
                                                                                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                                                                                                    style={{ background: '#1654D9' }} />
                                                                              )}
                                                </Link>Link>
                                              ))}
                                        </div>div>
                                
                                  {session?.user?.role === 'SUPER_ADMIN' && (
                                              <>
                                                          <div className="my-4" style={{ borderTop: '1px solid #E2E8F0' }} />
                                                          <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest"
                                                                          style={{ color: '#94A3B8' }}>
                                                                        Admin
                                                          </p>p>
                                                          <Link
                                                                          href="/admin"
                                                                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                                                                          style={
                                                                                            pathname.startsWith('/admin')
                                                                                              ? { background: '#FFF4EE', color: '#E8691A' }
                                                                                              : { color: '#475569' }
                                                                          }
                                                                        >
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                        <path d="M8 1L10.5 5.5H15L11.5 8.5L13 13L8 10.5L3 13L4.5 8.5L1 5.5H5.5L8 1Z"
                                                                                                            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                                                        </svg>svg>
                                                                        Super Admin
                                                          </Link>Link>
                                              </>>
                                            )}
                                </nav>nav>
                          
                            {/* Bottom nav */}
                                <div className="px-3 py-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                                        <div className="space-y-0.5">
                                          {bottomNavigation.map((item) => (
                                                <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                                                                style={
                                                                                  isActive(item.href)
                                                                                    ? { background: '#EEF3FD', color: '#1654D9' }
                                                                                    : { color: '#475569' }
                                                                }
                                                              >
                                                              <span className="shrink-0">{item.icon}</span>span>
                                                  {item.label}
                                                </Link>Link>
                                              ))}
                                        </div>div>
                                </div>div>
                          
                            {/* User profile */}
                                <div className="px-4 py-4" style={{ borderTop: '1px solid #E2E8F0' }}>
                                        <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                                                  text-xs font-bold text-white"
                                                                style={{ background: '#1654D9' }}>
                                                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                  </div>div>
                                                  <div className="flex-1 min-w-0">
                                                              <p className="text-sm font-semibold truncate" style={{ color: '#0D1C38' }}>
                                                                {session?.user?.name || 'User'}
                                                              </p>p>
                                                              <p className="text-xs truncate" style={{ color: '#94A3B8' }}>
                                                                {ROLE_LABELS[session?.user?.role || ''] || session?.user?.role}
                                                              </p>p>
                                                  </div>div>
                                                  <button
                                                                onClick={() => signOut({ callbackUrl: '/login' })}
                                                                className="rounded-lg p-1.5 transition-colors"
                                                                style={{ color: '#94A3B8' }}
                                                                title="Sign out"
                                                              >
                                                              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6"
                                                                                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                              </svg>svg>
                                                  </button>button>
                                        </div>div>
                                </div>div>
                          </aside>aside>
                        )
                      }</></svg>
