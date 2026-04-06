'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { ROLE_LABELS, formatDate, timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { User } from '@/types'

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'AGENT' })
  const [inviting, setInviting] = useState(false)

  const isAdmin = session?.user?.role === 'AGENCY_ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function inviteUser(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed'); return }
      toast.success('User invited!')
      setUsers((prev) => [...prev, data.user])
      setShowInvite(false)
      setInviteForm({ name: '', email: '', role: 'AGENT' })
    } catch { toast.error('Failed') }
    finally { setInviting(false) }
  }

  async function toggleUser(userId: string, isActive: boolean) {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: !isActive } : u))
      toast.success(isActive ? 'User deactivated' : 'User activated')
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <Header title="Team & Users" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm">{users.length} member{users.length !== 1 ? 's' : ''}</p>
          {isAdmin && (
            <button onClick={() => setShowInvite(true)} className="btn-primary btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Invite User
            </button>
          )}
        </div>

        {/* Invite form */}
        {showInvite && (
          <div className="card p-5">
            <h3 className="text-base font-bold mb-4">Invite Team Member</h3>
            <form onSubmit={inviteUser} className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Name</label>
                <input className="input" value={inviteForm.name} onChange={(e) => setInviteForm(p => ({...p, name: e.target.value}))} required placeholder="Jane Smith"/>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={inviteForm.email} onChange={(e) => setInviteForm(p => ({...p, email: e.target.value}))} required placeholder="jane@agency.com"/>
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={inviteForm.role} onChange={(e) => setInviteForm(p => ({...p, role: e.target.value}))}>
                  <option value="AGENT">Agent</option>
                  <option value="AGENCY_ADMIN">Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
              <div className="col-span-3 flex gap-2">
                <button type="submit" className="btn-primary btn" disabled={inviting}>
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </button>
                <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary btn">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl"/>)}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Joined</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{user.name || '—'}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'AGENCY_ADMIN' || user.role === 'SUPER_ADMIN' ? 'badge-blue' : 'badge-gray'}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-text-secondary text-sm">{user.lastLoginAt ? timeAgo(user.lastLoginAt) : 'Never'}</td>
                    <td className="text-text-secondary text-sm">{formatDate(user.createdAt)}</td>
                    {isAdmin && (
                      <td>
                        {user.id !== session?.user?.id && (
                          <button
                            onClick={() => toggleUser(user.id, user.isActive)}
                            className={`btn-sm btn ${user.isActive ? 'btn-danger' : 'btn-secondary'}`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
