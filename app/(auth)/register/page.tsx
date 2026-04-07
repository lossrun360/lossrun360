'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    agencyName: '',
    yourName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName: form.agencyName,
          name: form.yourName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          slug: slugify(form.agencyName),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }

      toast.success('Account created! Signing you in...')
      router.push('/login?registered=true')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    transition: 'all 0.12s ease',
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: '13px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '6px',
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
        className="register-panel"
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div style={{ position: 'relative' }}>
          {/* Logo */}
          <div style={{ marginBottom: '64px' }}>
            <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', color: '#fff' }}>
              LossRun<span style={{ color: '#1c6edd' }}>360</span>
            </span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Start your free trial.<br />No credit card needed.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '40px' }}>
            The professional platform built for commercial trucking insurance agencies.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              '14-day free trial included',
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

      {/* Right register panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        {/* Mobile logo */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Start your 14-day free trial — no credit card required</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle} htmlFor="agencyName">Agency Name</label>
                <input
                  id="agencyName"
                  type="text"
                  placeholder="Apex Insurance Group"
                  value={form.agencyName}
                  onChange={(e) => update('agencyName', e.target.value)}
                  required
                  autoFocus
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="yourName">Your Name</label>
                <input
                  id="yourName"
                  type="text"
                  placeholder="John Smith"
                  value={form.yourName}
                  onChange={(e) => update('yourName', e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="email">Work Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@agency.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="phone">Phone <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle} htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Min 8 chars"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="confirmPassword">Confirm</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    required
                    autoComplete="new-password"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid #1c6edd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,221,0.1)' }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                By creating an account, you agree to our{' '}
                <a href="#" style={{ color: '#1c6edd', textDecoration: 'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#1c6edd', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: loading ? '#93c5fd' : '#1c6edd', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1557c0' }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1c6edd' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </form>

            {/* Trial highlights */}
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  '14-day free trial',
                  '25 requests included',
                  'Full FMCSA integration',
                  'Cancel anytime',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2.5 7l3 3L11 4" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1c6edd', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media (min-width: 1024px) {
          .register-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
