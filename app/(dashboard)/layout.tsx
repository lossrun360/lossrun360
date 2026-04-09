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
      <div style={{ height: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav />
        <main style={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
