import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '../(dashboard)/session-provider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </SessionProvider>
  )
}
