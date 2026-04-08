'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0f172a' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px', color: '#fff' }}>
              LossRun<span style={{ color: '#1c6edd' }}>360</span>
            </span>
          </Link>
          <div className="nav-links" style={{ display: 'none', gap: '28px', alignItems: 'center' }}>
            {['Features', 'How It Works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500 }}>{item}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
            <Link href="/register" style={{ fontSize: '14px', background: '#1c6edd', color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '7px 16px', borderRadius: '8px' }}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0f172a', padding: '96px 24px 112px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(28,110,221,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(28,110,221,0.15)', border: '1px solid rgba(28,110,221,0.35)', borderRadius: '999px', padding: '5px 14px', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1c6edd', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Built for commercial trucking agencies</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 20px' }}>
            Loss runs. Faster.{' '}
            <span style={{ color: '#1c6edd' }}>Completely automated.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: '520px' }}>
            Stop chasing carriers by phone and email. LossRun360 sends requests, follows up automatically, and collects signed documents — so you can focus on closing deals.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: '#1c6edd', color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '13px 28px', borderRadius: '10px', fontSize: '16px' }}>
              Start free trial
            </Link>
            <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 500, padding: '13px 28px', borderRadius: '10px', fontSize: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
              See how it works
            </a>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>14-day free trial · No credit card required</p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }} className="stats-grid">
          {[
            { value: '500+', label: 'Carrier database' },
            { value: '3 days', label: 'Avg. response time' },
            { value: '94%', label: 'Collection rate' },
            { value: '10 hrs/wk', label: 'Time saved' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c6edd', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#0f172a', margin: '12px 0 0', letterSpacing: '-0.8px' }}>
              Three steps to stress-free loss runs
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="steps-grid">
            {[
              { n: '01', title: 'Enter DOT number', desc: "Paste a carrier's DOT#. We instantly pull their contact info, authority status, and insurance history from FMCSA." },
              { n: '02', title: 'We send the request', desc: 'A professional, branded email goes out automatically. We follow up at 3, 7, and 10 days if needed — zero effort from you.' },
              { n: '03', title: 'Collect the document', desc: 'When the carrier responds, they e-sign directly in their browser. The completed loss run lands in your dashboard instantly.' },
            ].map(step => (
              <div key={step.n} style={{ background: '#f8fafc', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1c6edd', marginBottom: '16px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{step.n}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '88px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c6edd', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Features</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#0f172a', margin: '12px 0 0', letterSpacing: '-0.8px' }}>
              Everything you need, nothing you don't
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="features-grid">
            {[
              { title: 'Instant FMCSA lookup', desc: 'Auto-fill carrier details from DOT number. No manual data entry.' },
              { title: 'Automated follow-ups', desc: 'Smart multi-step sequences that stop the moment a carrier responds.' },
              { title: 'Built-in e-signature', desc: 'Carriers sign directly in their browser. No PDF back-and-forth.' },
              { title: 'Request dashboard', desc: 'Track every request — pending, sent, signed — in one clean view.' },
              { title: 'Real-time alerts', desc: 'Get notified the moment a loss run is signed and ready to use.' },
              { title: 'Agency branding', desc: 'Your logo and name on every email and document you send.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: '12px', padding: '24px 24px 28px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1c6edd', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard mockup */}
      <section style={{ padding: '88px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', margin: '0 0 12px' }}>
              A dashboard built for speed
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Everything visible at a glance. No digging through email threads.</p>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: '7px', marginBottom: '16px' }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px' }}>
                {['Carrier', 'DOT #', 'Requested', 'Status'].map(h => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {[
                { carrier: 'Swift Transport LLC', dot: '1234567', date: 'Apr 5, 2026', status: 'Signed', statusColor: '#059669', statusBg: '#d1fae5' },
                { carrier: 'Eagle Freight Inc', dot: '2345678', date: 'Apr 4, 2026', status: 'Pending', statusColor: '#d97706', statusBg: '#fef3c7' },
                { carrier: 'Apex Carriers', dot: '3456789', date: 'Apr 3, 2026', status: 'Sent', statusColor: '#1c6edd', statusBg: '#dbeafe' },
                { carrier: 'Midwest Trucking', dot: '4567890', date: 'Apr 1, 2026', status: 'Follow-up', statusColor: '#64748b', statusBg: '#f1f5f9' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', alignItems: 'center', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{row.carrier}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{row.dot}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{row.date}</div>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: row.statusColor, background: row.statusBg }}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '88px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c6edd', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Pricing</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px', letterSpacing: '-0.8px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Start free. Upgrade when you're ready.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="pricing-grid">
            {[
              {
                name: 'Starter', price: '$79', period: '/month',
                desc: 'Perfect for solo agents and small agencies.',
                features: ['25 requests/month', 'FMCSA DOT lookup', 'Automated follow-ups', 'E-signature included', 'Email support'],
                popular: false,
              },
              {
                name: 'Agency', price: '$199', period: '/month',
                desc: 'For growing agencies handling more volume.',
                features: ['Unlimited requests', 'Everything in Starter', 'Custom agency branding', 'Priority support', 'Team members'],
                popular: true,
              },
            ].map(plan => (
              <div key={plan.name} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: plan.popular ? '2px solid #1c6edd' : '1px solid #e2e8f0', position: 'relative' as const }}>
                {plan.popular && (
                  <div style={{ position: 'absolute' as const, top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#1c6edd', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 14px', borderRadius: '999px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>Most Popular</div>
                )}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', margin: '8px 0 6px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px' }}>{plan.price}</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{plan.desc}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3L11 4" stroke="#1c6edd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" style={{ display: 'block', textAlign: 'center' as const, padding: '11px', borderRadius: '8px', background: plan.popular ? '#1c6edd' : '#f8fafc', color: plan.popular ? '#fff' : '#0f172a', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: plan.popular ? 'none' : '1px solid #e2e8f0' }}>
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: '#0f172a', padding: '96px 24px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ position: 'absolute' as const, inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' as const, maxWidth: '540px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px', lineHeight: 1.15 }}>
            Ready to stop chasing carriers?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', margin: '0 0 36px', lineHeight: 1.6 }}>
            Join agencies saving hours every week with automated loss run collection.
          </p>
          <Link href="/register" style={{ display: 'inline-block', background: '#1c6edd', color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '14px 32px', borderRadius: '10px', fontSize: '16px' }}>
            Start your free trial
          </Link>
          <p style={{ marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>14 days free · No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '32px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' }}>
          <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            &copy; 2026 LossRun360. Built for commercial trucking insurance.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map(t => (
              <a key={t} href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @media (min-width: 768px) {
          .nav-links { display: flex !important; }
        }
        @media (max-width: 767px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}
