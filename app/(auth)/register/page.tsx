'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Logo href="/" size="lg" className="justify-center" />
          <p className="mt-2 text-text-secondary text-sm">
            Start your 14-day free trial — no credit card required
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="agencyName">Agency Name</label>
              <input
                id="agencyName"
                type="text"
                className="input"
                placeholder="Apex Insurance Group"
                value={form.agencyName}
                onChange={(e) => update('agencyName', e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label" htmlFor="yourName">Your Name</label>
              <input
                id="yourName"
                type="text"
                className="input"
                placeholder="John Smith"
                value={form.yourName}
                onChange={(e) => update('yourName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Work Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@agency.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">Phone (Optional)</label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Min 8 chars"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="label" htmlFor="confirmPassword">Confirm</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <p className="text-xs text-text-muted">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" className="btn-primary btn w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Trial highlights */}
          <div className="mt-5 pt-5 border-t border-border">
            <ul className="space-y-2">
              {[
                '14-day free trial, no credit card',
                '25 loss run requests included',
                'Full FMCSA integration',
                'Cancel anytime',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
