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
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <TopNav />
        <main style={{ minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
