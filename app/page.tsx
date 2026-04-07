import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1a1a2e', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px', color: '#1a1a2e' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>

          <div style={{ display: 'none' }} className="nav-links">
            <a href="#features" style={{ textDecoration: 'none', color: 'rgba(26,26,46,0.6)', fontSize: '14px', fontWeight: 500 }}>Features</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: 'rgba(26,26,46,0.6)', fontSize: '14px', fontWeight: 500 }}>How It Works</a>
            <a href="#pricing" style={{ textDecoration: 'none', color: 'rgba(26,26,46,0.6)', fontSize: '14px', fontWeight: 500 }}>Pricing</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/login" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(26,26,46,0.65)', textDecoration: 'none', padding: '7px 14px' }}>
              Sign in
            </Link>
            <Link href="/register" style={{ fontSize: '14px', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: '4px', background: '#1c6edd' }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', background: '#ffffff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(28,110,221,0.08)', border: '1px solid rgba(28,110,221,0.2)', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1c6edd', display: 'inline-block', boxShadow: '0 0 8px rgba(28,110,221,0.4)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c6edd' }}>Built for commercial trucking insurance</span>
          </div>

          {/* headline */}
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-2.5px', lineHeight: 1.05, margin: '0 0 24px' }}>
            Loss Run Requests,<br />
            <span style={{ color: '#1c6edd', fontStyle: 'italic' }}>Done in Minutes.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(26,26,46,0.55)', lineHeight: 1.7, margin: '0 auto 44px', maxWidth: '540px' }}>
            Enter a DOT# and LossRun360 pulls carrier info from FMCSA, generates a PDF, sends for e-signature, and submits to carriers — automatically.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: '#1c6edd', color: '#fff', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(28,110,221,0.3)' }}>
              Start 14-Day Free Trial →
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 24px', background: 'rgba(26,26,46,0.05)', color: 'rgba(26,26,46,0.7)', borderRadius: '4px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(26,26,46,0.12)' }}>
              Sign in
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(26,26,46,0.35)' }}>No credit card required · Cancel anytime</p>
        </div>

        {/* App mockup */}
        <div style={{ maxWidth: '900px', margin: '64px auto 0', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)', background: '#ffffff' }}>
          {/* Fake browser bar */}
          <div style={{ background: '#f1f3f5', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.7 }} />
            </div>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '3px', height: '22px', display: 'flex', alignItems: 'center', paddingLeft: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '11px', color: 'rgba(26,26,46,0.4)' }}>app.lossrun360.com/requests</span>
            </div>
          </div>
          {/* App UI preview */}
          <div style={{ padding: '24px', minHeight: '280px', background: '#fafbfc' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.3px' }}>Loss Run Requests</div>
                <div style={{ fontSize: '12px', color: 'rgba(26,26,46,0.45)', marginTop: '2px' }}>3 pending · 12 completed this month</div>
              </div>
              <div style={{ padding: '8px 16px', background: '#1c6edd', borderRadius: '4px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>+ New Request</div>
            </div>

            {/* Stats row */}
            <div className="mockup-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'This Month', value: '12' },
                { label: 'Pending', value: '3' },
                { label: 'Avg. Turnaround', value: '4.2h' },
                { label: 'Carriers Hit', value: '48' },
              ].map((s) => (
                <div key={s.label} style={{ background: '#ffffff', borderRadius: '4px', padding: '12px 14px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(26,26,46,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Table preview */}
            <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div className="mockup-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '9px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#f8f9fa' }}>
                {['Insured', 'Carrier', 'Status', 'Date'].map((h) => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,46,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
                ))}
              </div>
              {[
                { insured: 'Apex Trucking LLC', carrier: 'Progressive', status: 'Signed', color: '#10b981' },
                { insured: 'Blue Ridge Transport', carrier: 'Sentry Insurance', status: 'Pending', color: '#f59e0b' },
                { insured: 'Summit Freight Co.', carrier: 'Canal Insurance', status: 'Sent', color: '#1c6edd' },
              ].map((r, i) => (
                <div key={i} className="mockup-table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '11px 14px', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(26,26,46,0.85)' }}>{r.insured}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(26,26,46,0.5)' }}>{r.carrier}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: r.color, fontWeight: 500 }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(26,26,46,0.35)' }}>Today</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ───────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '56px 24px', background: '#f7f8fa' }}>
        <div className="stats-grid" style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '5 min', label: 'Average per request' },
            { value: '500+', label: 'Carriers in database' },
            { value: '98%', label: 'FMCSA accuracy' },
            { value: '10×', label: 'Faster than manual' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-1.5px', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(26,26,46,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Features</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-1.5px', margin: '0 0 14px' }}>
              Everything your agency needs
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(26,26,46,0.5)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              Built specifically for commercial trucking agencies. Every workflow automated.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            {[
              { icon: '🔍', title: 'Instant DOT# Lookup', desc: 'Enter a DOT number and get the full carrier profile pulled live from FMCSA in seconds.' },
              { icon: '📋', title: '5-Year Insurance History', desc: 'Automatically retrieve 5 years of auto liability carrier history from FMCSA records.' },
              { icon: '📄', title: 'PDF Generation', desc: 'Generate a branded, pre-filled loss run authorization PDF with a single click.' },
              { icon: '✍️', title: 'E-Signature Workflow', desc: 'Send for digital signature. Once signed, it auto-forwards to every selected carrier.' },
              { icon: '🏢', title: '500+ Carrier Database', desc: 'Pre-loaded with direct loss run contacts for every major trucking insurer.' },
              { icon: '🔔', title: 'Automated Reminders', desc: 'LossRun360 follows up automatically until the insured signs — no chasing needed.' },
            ].map((f) => (
              <div key={f.title} style={{ background: '#ffffff', padding: '32px 28px' }}>
                <div style={{ fontSize: '24px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,46,0.5)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: '#f7f8fa', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-1.5px', margin: '0 0 14px' }}>
              From DOT# to delivered<br />in 4 steps
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(26,26,46,0.5)', lineHeight: 1.7 }}>No manual lookups, copy-pasting, or chasing signatures.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { title: 'Enter a DOT# or company name', desc: 'Type the DOT number. LossRun360 hits FMCSA and returns the full carrier profile plus 5 years of insurance history — instantly.' },
              { title: 'Review and select carriers', desc: 'Confirm the pre-populated insured info, then choose which insurance carriers to request loss runs from.' },
              { title: 'Generate PDF and send for e-signature', desc: 'One click generates the authorization PDF and sends it to the insured. Automated reminders follow until signed.' },
              { title: 'Signed — carriers notified automatically', desc: 'Once signed, LossRun360 emails every selected carrier with the signed authorization attached. Done.' },
            ].map((step, i) => (
              <div key={step.title} style={{ display: 'flex', gap: '20px', paddingBottom: i < 3 ? '36px' : '0', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', left: '19px', top: '48px', width: '1px', height: 'calc(100% - 48px)', background: 'rgba(0,0,0,0.1)' }} />}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c6edd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', flexShrink: 0, zIndex: 1 }}>{i + 1}</div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px', letterSpacing: '-0.3px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(26,26,46,0.5)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-1.5px', margin: '0 0 14px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(26,26,46,0.5)', lineHeight: 1.7 }}>All plans include a 14-day free trial. No credit card required.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {[
              { name: 'Starter', price: 79, desc: '25 requests/mo · 3 users', feats: ['25 requests/month', '3 team members', 'FMCSA DOT# lookup', 'PDF generation', 'Email support'], popular: false },
              { name: 'Professional', price: 199, desc: '100 requests/mo · 10 users', feats: ['100 requests/month', '10 team members', 'Everything in Starter', 'E-signature workflow', 'Automated reminders', 'Priority support'], popular: true },
              { name: 'Enterprise', price: 399, desc: 'Unlimited requests & users', feats: ['Unlimited requests', 'Unlimited users', 'Everything in Pro', 'Custom carrier lists', 'API access', 'Dedicated onboarding'], popular: false },
            ].map((plan) => (
              <div key={plan.name} style={{
                background: plan.popular ? '#f0f7ff' : '#ffffff',
                border: plan.popular ? '2px solid #1c6edd' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '28px',
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 40px rgba(28,110,221,0.12)' : '0 2px 12px rgba(0,0,0,0.04)'
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1c6edd', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Most Popular</div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>                  <span style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-2px' }}>${plan.price}</span>
                  <span style={{ fontSize: '14px', color: 'rgba(26,26,46,0.4)' }}>/mo</span>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,46,0.5)', marginBottom: '22px' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.feats.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: 'rgba(26,26,46,0.7)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M2.5 7l3 3L11 4" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: plan.popular ? '#1c6edd' : 'rgba(26,26,46,0.08)',
                  color: plan.popular ? '#fff' : '#1a1a2e',
                  transition: 'opacity 0.15s'
                }}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: '#f0f7ff', borderTop: '1px solid rgba(28,110,221,0.12)', borderBottom: '1px solid rgba(28,110,221,0.12)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            Ready to transform your agency?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(26,26,46,0.55)', lineHeight: 1.7, marginBottom: '36px' }}>
            Join agencies saving hours every week. Start your free trial — no credit card needed.
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: '#1c6edd', color: '#fff', borderRadius: '4px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(28,110,221,0.3)' }}>
            Start Your Free Trial →
          </Link>
          <p style={{ fontSize: '12px', color: 'rgba(26,26,46,0.3)', marginTop: '16px' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '32px 24px', background: '#1a1a2e' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px', color: '#fff' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            &copy; {new Date().getFullYear()} LossRun360. Built for commercial trucking insurance.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map((t) => (
              <a key={t} href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media (min-width: 768px) { .nav-links { display: flex !important; gap: 28px; } }
        @media (max-width: 640px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
          .mockup-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .mockup-table-head, .mockup-table-row { grid-template-columns: 2fr 1.2fr 1fr !important; }
          .mockup-table-head > div:nth-child(4), .mockup-table-row > div:nth-child(4) { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px 16px !important; }
        }
      `}</style>
    </div>
  )
}
