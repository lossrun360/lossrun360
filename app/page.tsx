import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          {/* Logo */}
          <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>
          {/* Centered nav links */}
          <div style={{ display: 'none' }} className="nav-links">
            <a href="#features" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Features</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>How It Works</a>
            <a href="#pricing" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Pricing</a>
          </div>
          {/* Buttons right-aligned */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <Link href="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '7px 14px' }}>
              Sign in
            </Link>
            <Link href="/register" style={{ fontSize: '14px', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px', background: '#1c6edd' }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 60px', background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 55%, #f5f3ff 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,110,221,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(28,110,221,0.08)', border: '1px solid rgba(28,110,221,0.2)', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1c6edd', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c6edd' }}>Built for commercial trucking insurance</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 20px' }}>
            Loss Run Requests,<br />
            <span style={{ color: '#1c6edd' }}>Done in Minutes.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#64748b', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '520px' }}>
            Enter a DOT# and LossRun360 pulls carrier info from FMCSA, generates a PDF, sends for e-signature, and submits to carriers — automatically.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: '#1c6edd', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(28,110,221,0.35)' }}>
              Start 14-Day Free Trial →
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 24px', background: '#fff', color: '#475569', borderRadius: '10px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
              Sign in
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>No credit card required · Cancel anytime</p>
        </div>

        {/* App mockup */}
        <div style={{ maxWidth: '900px', margin: '48px auto 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 24px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.8)', background: '#fff' }}>
          {/* Fake browser bar */}
          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.5 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.5 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.5 }} />
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: '5px', height: '22px', display: 'flex', alignItems: 'center', paddingLeft: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>app.lossrun360.com/requests</span>
            </div>
          </div>
          {/* App UI preview */}
          <div style={{ padding: '24px', background: '#fff' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>Loss Run Requests</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>3 pending · 12 completed this month</div>
              </div>
              <div style={{ padding: '8px 16px', background: '#1c6edd', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>+ New Request</div>
            </div>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'This Month', value: '12', color: '#1c6edd', bg: '#eff6ff' },
                { label: 'Pending', value: '3', color: '#d97706', bg: '#fffbeb' },
                { label: 'Avg. Turnaround', value: '4.2h', color: '#059669', bg: '#f0fdf4' },
                { label: 'Carriers Hit', value: '48', color: '#7c3aed', bg: '#f5f3ff' },
              ].map((s) => (
                <div key={s.label} style={{ background: s.bg, borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                </div>
              ))}
            </div>
            {/* Table preview */}
            <div style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '9px 14px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Insured', 'Carrier', 'Status', 'Date'].map((h) => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
                ))}
              </div>
              {[
                { insured: 'Apex Trucking LLC', carrier: 'Progressive', status: 'Signed', color: '#065f46', bg: '#d1fae5' },
                { insured: 'Blue Ridge Transport', carrier: 'Sentry Insurance', status: 'Pending', color: '#92400e', bg: '#fef3c7' },
                { insured: 'Summit Freight Co.', carrier: 'Canal Insurance', status: 'Sent', color: '#1e40af', bg: '#dbeafe' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '11px 14px', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{r.insured}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{r.carrier}</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, background: r.bg, color: r.color, whiteSpace: 'nowrap' }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Today</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ───────────────────────────────────────────── */}
      <section style={{ padding: '52px 24px', background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '5 min', label: 'Average per request', color: '#1c6edd' },
            { value: '500+', label: 'Carriers in database', color: '#059669' },
            { value: '98%', label: 'FMCSA accuracy', color: '#d97706' },
            { value: '10×', label: 'Faster than manual', color: '#7c3aed' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: s.color, letterSpacing: '-1.5px', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Features</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '0 0 12px' }}>
              Everything your agency needs
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              Built specifically for commercial trucking agencies. Every workflow automated.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🔍', title: 'Instant DOT# Lookup', desc: 'Enter a DOT number and get the full carrier profile pulled live from FMCSA in seconds.', bg: '#eff6ff' },
              { icon: '📋', title: '5-Year Insurance History', desc: 'Automatically retrieve 5 years of auto liability carrier history from FMCSA records.', bg: '#f0fdf4' },
              { icon: '📄', title: 'PDF Generation', desc: 'Generate a branded, pre-filled loss run authorization PDF with a single click.', bg: '#fffbeb' },
              { icon: '✍️', title: 'E-Signature Workflow', desc: 'Send for digital signature. Once signed, it auto-forwards to every selected carrier.', bg: '#f5f3ff' },
              { icon: '🏢', title: '500+ Carrier Database', desc: 'Pre-loaded with direct loss run contacts for every major trucking insurer.', bg: '#fdf2f8' },
              { icon: '🔔', title: 'Automated Reminders', desc: 'LossRun360 follows up automatically until the insured signs — no chasing needed.', bg: '#fff7ed' },
            ].map((f) => (
              <div key={f.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '0 0 12px' }}>
              From DOT# to delivered<br />in 4 steps
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7 }}>No manual lookups, copy-pasting, or chasing signatures.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { title: 'Enter a DOT# or company name', desc: 'Type the DOT number. LossRun360 hits FMCSA and returns the full carrier profile plus 5 years of insurance history — instantly.' },
              { title: 'Review and select carriers', desc: 'Confirm the pre-populated insured info, then choose which insurance carriers to request loss runs from.' },
              { title: 'Generate PDF and send for e-signature', desc: 'One click generates the authorization PDF and sends it to the insured. Automated reminders follow until signed.' },
              { title: 'Signed — carriers notified automatically', desc: 'Once signed, LossRun360 emails every selected carrier with the signed authorization attached. Done.' },
            ].map((step, i) => (
              <div key={step.title} style={{ display: 'flex', gap: '20px', paddingBottom: i < 3 ? '36px' : '0', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', left: '19px', top: '48px', width: '2px', height: 'calc(100% - 48px)', background: 'linear-gradient(to bottom, rgba(28,110,221,0.4), rgba(28,110,221,0.08))' }} />}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c6edd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', flexShrink: 0, zIndex: 1, boxShadow: '0 4px 12px rgba(28,110,221,0.3)' }}>{i + 1}</div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1c6edd', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '0 0 12px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7 }}>All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {[
              { name: 'Starter', price: 79, desc: '25 requests/mo · 3 users', feats: ['25 requests/month', '3 team members', 'FMCSA DOT# lookup', 'PDF generation', 'Email support'], popular: false },
              { name: 'Professional', price: 199, desc: '100 requests/mo · 10 users', feats: ['100 requests/month', '10 team members', 'Everything in Starter', 'E-signature workflow', 'Automated reminders', 'Priority support'], popular: true },
              { name: 'Enterprise', price: 399, desc: 'Unlimited requests & users', feats: ['Unlimited requests', 'Unlimited users', 'Everything in Pro', 'Custom carrier lists', 'API access', 'Dedicated onboarding'], popular: false },
            ].map((plan) => (
              <div key={plan.name} style={{ background: plan.popular ? '#1c6edd' : '#fff', border: plan.popular ? 'none' : '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', position: 'relative', boxShadow: plan.popular ? '0 20px 60px rgba(28,110,221,0.3)' : '0 1px 4px rgba(15,23,42,0.05)' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Most Popular</div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: plan.popular ? '#fff' : '#0f172a', margin: '0 0 6px' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: plan.popular ? '#fff' : '#0f172a', letterSpacing: '-2px' }}>${plan.price}</span>
                  <span style={{ fontSize: '14px', color: plan.popular ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>/mo</span>
                </div>
                <p style={{ fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.65)' : '#94a3b8', marginBottom: '22px' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.feats.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.85)' : '#64748b' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M2.5 7l3 3L11 4" stroke={plan.popular ? 'rgba(255,255,255,0.9)' : '#10b981'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', background: plan.popular ? 'rgba(255,255,255,0.18)' : '#1c6edd', color: '#fff' }}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #1c6edd 0%, #1557c0 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            Ready to transform your agency?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '36px' }}>
            Join agencies saving hours every week. Start your free trial — no credit card needed.
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: '#fff', color: '#1c6edd', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>
            Start Your Free Trial →
          </Link>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '16px' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '32px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            LossRun<span style={{ color: '#1c6edd' }}>360</span>
          </span>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            &copy; {new Date().getFullYear()} LossRun360. Built for commercial trucking insurance.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map((t) => (
              <a key={t} href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media (min-width: 768px) {
          .nav-links { display: flex !important; gap: 28px; }
        }
        @media (max-width: 640px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}
