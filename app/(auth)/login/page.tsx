'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F7FC' }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
        style={{ background: '#1654D9' }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              LossRun<span style={{ color: '#FFB347' }}>360</span>
            </span>
          </div>
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Loss run requests,<br />done in minutes.
            </h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.72)' }}>
              The professional platform built for commercial trucking insurance agencies.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {[
              'Automated carrier outreach',
              'E-signature built in',
              'FMCSA DOT# lookup',
              '500+ carrier database',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          &copy; {new Date().getFullYear()} LossRun360. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden mb-10 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#1654D9' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-base" style={{ color: '#0D1C38' }}>
            LossRun<span style={{ color: '#E8691A' }}>360</span>
          </span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#0D1C38' }}>Welcome back</h1>
            <p className="mt-1.5 text-sm" style={{ color: '#64748B' }}>Sign in to your agency account</p>
          </div>

          <div
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: '0 2px 16px rgba(14,28,62,0.10), 0 0 0 1px rgba(14,28,62,0.06)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-colors"
                  style={{ border: '1px solid #D1D9E6', color: '#0D1C38', outline: 'none', background: '#FAFBFD' }}
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  onFocus={e => { e.currentTarget.style.border = '1px solid #1654D9'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,84,217,0.12)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid #D1D9E6'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium" style={{ color: '#374151' }} htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium" style={{ color: '#1654D9' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-colors"
                  style={{ border: '1px solid #D1D9E6', color: '#0D1C38', outline: 'none', background: '#FAFBFD' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  onFocus={e => { e.currentTarget.style.border = '1px solid #1654D9'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,84,217,0.12)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid #D1D9E6'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm mt-1"
                style={{ background: loading ? '#6B96E8' : '#1654D9' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1244BB' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1654D9' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #EEF2F8' }}>
              <p className="text-xs text-center mb-3" style={{ color: '#94A3B8' }}>Try the demo account</p>
              <button
                type="button"
                onClick={() => { setEmail('demo@apexinsurance.com'); setPassword('Demo@123!') }}
                className="w-full px-3 py-2.5 rounded-lg text-xs text-left"
                style={{ background: '#F8FAFD', border: '1px solid #E2E8F0', color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#EEF2FA')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFD')}
              >
                <span className="font-semibold" style={{ color: '#0D1C38' }}>demo@apexinsurance.com</span>
                {' · '}Demo@123!
              </button>
            </div>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: '#1654D9' }}>
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
