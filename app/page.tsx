import Link from 'next/link'

const FEATURES = [
  {
    title: 'Instant DOT# Lookup',
    description: 'Enter a DOT number and get the full carrier profile — name, address, owners, fleet size — pulled live from FMCSA.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    title: '5-Year Insurance History',
    description: 'Automatically retrieve historical auto liability carrier data for the past 5 years from FMCSA — no manual research.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10a7 7 0 1014 0A7 7 0 003 10z" stroke="currentColor" strokeWidth="1.8"/><path d="M10 6.5V10l2.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    title: 'Professional PDF Generation',
    description: 'Generate a branded, pre-filled loss run authorization PDF with one click — ready to send or print.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2h9l4 4v13H4V2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M13 2v4h4M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    title: 'E-Signature Workflow',
    description: 'Send the authorization to the insured for digital signature. Once signed, it auto-forwards to every selected carrier.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 14l3-1 8-8a1.41 1.41 0 00-2-2l-8 8-1 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 17h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    title: '500+ Carrier Database',
    description: 'Pre-loaded with direct loss run contact emails for every major trucking insurer. Add custom carriers anytime.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" stroke="currentColor" strokeWidth="1.8"/></svg>,
  },
  {
    title: 'Automated Reminders',
    description: 'Never chase down a signature again. LossRun360 sends automatic reminders until the insured signs.',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2A6 6 0 004 8v3l-1.5 3h15L16 11V8a6 6 0 00-6-6zM8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
]

const STEPS = [
  { title: 'Enter a DOT# or company name', description: "Type the carrier's USDOT number. LossRun360 hits FMCSA instantly and returns the full carrier profile plus 5 years of insurance history." },
  { title: 'Review and select carriers', description: 'Confirm pre-populated info, then select which insurance carriers to request loss runs from. We have direct contacts for every major trucking insurer.' },
  { title: 'Generate PDF and send for e-signature', description: 'One click generates a professional authorization PDF and sends it to the insured. Automatic reminders follow until it's signed.' },
  { title: 'Signed — carriers notified automatically', description: 'The moment it's signed, LossRun360 emails every selected carrier with the signed authorization attached.' },
]

const PLANS = [
  { name: 'Starter', price: 79, requests: 25, users: 3, features: ['25 requests/month', '3 team members', 'FMCSA DOT# lookup', 'PDF generation', 'Email support'], popular: false },
  { name: 'Professional', price: 199, requests: 100, users: 10, features: ['100 requests/month', '10 team members', 'Everything in Starter', 'E-signature workflow', 'Automated reminders', 'Priority support'], popular: true },
  { name: 'Enterprise', price: 399, requests: -1, users: -1, features: ['Unlimited requests', 'Unlimited users', 'Everything in Professional', 'Custom carrier lists', 'API access', 'Dedicated onboarding'], popular: false },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}>
              LossRun<span style={{ color: '#6366f1' }}>360</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#64748b' }}>
              <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
              <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How It Works</a>
              <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="/login" style={{ fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none', padding: '7px 14px', borderRadius: '7px' }}>
                Sign in
              </Link>
              <Link href="/register" style={{ fontSize: '13px', fontWeight: '600', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: '7px', background: '#6366f1', boxShadow: '0 1px 3px rgba(99,102,241,0.3)' }}>
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 24px 80px', textAlign: 'center', background: 'linear-gradient(180deg, #fafafe 0%, #ffffff 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: '#eef2ff', border: '1px solid #c7d2fe', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#4f46e5', letterSpacing: '0.2px' }}>Built for commercial trucking insurance</span>
          </div>

          <h1 style={{ fontSize: '60px', fontWeight: '800', color: '#0f172a', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 20px' }}>
            Loss Run Requests,<br />
            <span style={{ color: '#6366f1' }}>Done in Minutes.</span>
          </h1>

          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '560px' }}>
            Enter a DOT# and LossRun360 pulls carrier info from FMCSA, generates an authorization form, sends it for e-signature, and submits to carriers — automatically.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#6366f1', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              Start 14-Day Free Trial
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: '#fff', color: '#475569', borderRadius: '10px', fontSize: '15px', fontWeight: '500', textDecoration: 'none', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
              View demo
            </Link>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8' }}>No credit card required · Cancel anytime</p>
        </div>

        {/* App mockup */}
        <div style={{ maxWidth: '900px', margin: '64px auto 0', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 32px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
          {/* Browser bar */}
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 16px', height: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#fca5a5' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#fde68a' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#86efac' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#e2e8f0', borderRadius: '6px', padding: '3px 16px', fontSize: '11px', color: '#64748b' }}>
                app.lossrun360.com/requests/new
              </div>
            </div>
          </div>
          {/* Fake app interior */}
          <div style={{ background: '#f8fafc', padding: '0' }}>
            {/* TopNav */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', height: '52px', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '24px' }}>
              <div style={{ width: '90px', height: '16px', background: '#6366f1', borderRadius: '4px', opacity: 0.9 }} />
              {['Dashboard', 'Requests', 'Carriers'].map((t) => (
                <div key={t} style={{ fontSize: '12px', color: t === 'Requests' ? '#6366f1' : '#94a3b8', fontWeight: t === 'Requests' ? '600' : '400' }}>{t}</div>
              ))}
              <div style={{ marginLeft: 'auto', width: '100px', height: '26px', background: '#6366f1', borderRadius: '6px', opacity: 0.9 }} />
            </div>
            {/* Content */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
              {/* DOT lookup */}
              <div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ width: '120px', height: '10px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, height: '36px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>DOT# 1234567</span>
                    </div>
                    <div style={{ width: '90px', height: '36px', background: '#6366f1', borderRadius: '7px' }} />
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <div style={{ width: '140px', height: '10px', background: '#d1fae5', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {['Sunrise Freight LLC', 'Houston, TX 77001', 'DOT# 1234567', '12 Trucks · 14 Drivers'].map((t) => (
                      <div key={t}>
                        <div style={{ width: '50px', height: '8px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '5px' }} />
                        <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Side panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ width: '80px', height: '10px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
                  {[1,2,3].map(i => <div key={i} style={{ height: '32px', background: '#f8fafc', borderRadius: '7px', marginBottom: '6px', border: '1px solid #f1f5f9' }} />)}
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ width: '70px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginBottom: '10px' }} />
                  <div style={{ width: '120px', height: '14px', background: 'rgba(255,255,255,0.8)', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ width: '90px', height: '10px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '5 min', label: 'Average per request' },
            { value: '500+', label: 'Carriers in database' },
            { value: '98%', label: 'FMCSA data accuracy' },
            { value: '10×', label: 'Faster than manual' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '96px 24px', background: '#fafafe' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.2px', margin: '0 0 12px' }}>
              Everything your agency needs
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              Built specifically for commercial trucking agencies — not a generic tool adapted for trucking.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '14px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.2px', margin: '0 0 12px' }}>
              From DOT# to delivered in 4 steps
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>
              No more manual lookups, copy-pasting, or chasing signatures.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((step, i) => (
              <div key={step.title} style={{ display: 'flex', gap: '20px', paddingBottom: i < STEPS.length - 1 ? '32px' : '0', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', top: '44px', width: '2px', height: 'calc(100% - 44px)', background: '#e2e8f0' }} />
                )}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0, zIndex: 1 }}>
                  {i + 1}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#0f172a', margin: '0 0 6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#fafafe', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.2px', margin: '0 0 12px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start' }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{ background: plan.popular ? '#0f172a' : '#fff', border: plan.popular ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: plan.popular ? '0 8px 32px rgba(15,23,42,0.2)' : '0 1px 3px rgba(15,23,42,0.04)', position: 'relative' }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 12px', borderRadius: '999px', letterSpacing: '0.3px' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: plan.popular ? '#fff' : '#0f172a', margin: '0 0 6px' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '800', color: plan.popular ? '#fff' : '#0f172a', letterSpacing: '-1.5px' }}>${plan.price}</span>
                  <span style={{ fontSize: '14px', color: plan.popular ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>/mo</span>
                </div>
                <p style={{ fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: '20px' }}>
                  {plan.requests === -1 ? 'Unlimited requests' : `${plan.requests} requests/month`}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.75)' : '#475569' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M2.5 7l3 3 6-6" stroke={plan.popular ? '#818cf8' : '#10b981'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', background: plan.popular ? '#6366f1' : '#f1f5f9', color: plan.popular ? '#fff' : '#475569', boxShadow: plan.popular ? '0 2px 8px rgba(99,102,241,0.4)' : 'none' }}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 24px', background: '#0f172a', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#fff', letterSpacing: '-1.2px', margin: '0 0 16px' }}>
            Ready to transform your agency?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '32px' }}>
            Join hundreds of trucking insurance agencies saving hours every week with LossRun360.
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: '#6366f1', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            Start Your Free Trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '14px' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '28px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>LossRun<span style={{ color: '#6366f1' }}>360</span></span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            &copy; {new Date().getFullYear()} LossRun360. Built for commercial trucking insurance.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Contact'].map((t) => (
              <a key={t} href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
