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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left branding panel */}
      <div
        style={{
          display: 'none',
          width: '42%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          background: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-panel"
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div style={{ position: 'relative' }}>
          {/* Logo */}
          <div style={{ marginBottom: '64px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', color: '#fff' }}>
                LossRun<span style={{ color: '#1c6edd' }}>360</span>
              </span>
            </Link>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Loss run requests,<br />done in minutes.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '40px' }}>
            The professional platform built for commercial trucking insurance agencies.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Automated carrier outreach',
              'E-signature built in',
              'FMCSA DOT# lookup',
              '500+ carrier database',
            ].map((feat) => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(28,110,221,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          &copy; {new Date().getFullYear()} LossRun360. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        {/* Mobile logo */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', color: '#0f172a' }}>
              LossRun<span style={{ color: '#1c6edd' }}>360</span>
            </span>
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>Welcome back</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Sign in to your agency account</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }} htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" style={{ fontSize: '12px', color: '#1c6edd', textDecoration: 'none', fontWeight: '500' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: loading ? '#93c5fd' : '#1c6edd', color: '#fff', fontSize: '14px', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s', boxShadow: '0 1px 3px rgba(28,110,221,0.3)' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1557c0' }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1c6edd' }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Demo account</p>
              <button
                type="button"
                onClick={() => { setEmail('demo@apexinsurance.com'); setPassword('Demo@123!') }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc' }}
              >
                <span style={{ fontWeight: '600', color: '#0f172a' }}>demo@apexinsurance.com</span>
                {' · '}Demo@123!
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#1c6edd', fontWeight: '600', textDecoration: 'none' }}>
              Start free trial
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media (min-width: 1024px) {
          .login-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
