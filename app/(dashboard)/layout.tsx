import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { TopNav } from '@/components/layout/topnav'
import { SessionProvider } from './session-provider'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      {/* Mobile-only block screen */}
      <style>{`
        .lr360-mobile-block { display: none; }
        @media (max-width: 767px) {
          .lr360-mobile-block { display: flex !important; }
          .lr360-desktop-content { display: none !important; }
        }
      `}</style>

      <div
        className="lr360-mobile-block"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#ffffff',
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#1c6edd',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.3px',
            }}
          >
            LossRun360
          </span>
        </div>

        {/* Monitor icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            background: 'rgba(28, 110, 221, 0.08)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1c6edd"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 12px',
            lineHeight: '1.3',
          }}
        >
          Desktop Experience Required
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0,
            maxWidth: '320px',
            lineHeight: '1.5',
          }}
        >
          LossRun360 is designed for desktop use. Please visit us on a computer
          or tablet for the best experience.
        </p>
      </div>

      {/* Desktop content */}
      <div className="lr360-desktop-content" style={{ height: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
