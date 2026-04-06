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
      <div className="min-h-screen flex flex-col" style={{ background: '#F4F7FC' }}>
        <TopNav />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
