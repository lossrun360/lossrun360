import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h7l4 4v8H3V2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 2v4h4M5 8h6M5 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.3px' }}>LossRun<span style={{ color: '#6366f1' }}>360</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#64748b' }}>
              <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
              <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How It Works</a>
              <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/login" style={{ fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none', padding: '7px 14px' }}>Sign in</Link>
              <Link href="/register" style={{ fontSize: '13px', fontWeight: '600', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: '7px', background: '#6366f1' }}>Start free trial</Link>
            </div>
          </div>
        </div>
      </nav>

      <section style={{ padding: '96px 24px 80px', textAlign: 'center', background: 'linear-gradient(180deg, #fafafe 0%, #fff 100%)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: '#eef2ff', border: '1px solid #c7d2fe', marginBottom: '24px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#4f46e5' }}>Built for commercial trucking insurance</span>
          </div>
          <h1 style={{ fontSize: '58px', fontWeight: '800', color: '#0f172a', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 20px' }}>
            Loss Run Requests,<br />
            <span style={{ color: '#6366f1' }}>Done in Minutes.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '520px' }}>
            Enter a DOT# and LossRun360 pulls carrier info from FMCSA, generates a PDF, sends for e-signature, and submits to carriers automatically.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#6366f1', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              Start 14-Day Free Trial
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: '#fff', color: '#475569', borderRadius: '10px', fontSize: '15px', fontWeight: '500', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
              View demo
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>No credit card required &middot; Cancel anytime</p>
        </div>
      </section>

      <section style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '5 min', label: 'Average per request' },
            { value: '500+', label: 'Carriers in database' },
            { value: '98%', label: 'FMCSA data accuracy' },
            { value: '10x', label: 'Faster than manual' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ padding: '96px 24px', background: '#fafafe' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 12px' }}>Everything your agency needs</h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>Built specifically for commercial trucking agencies.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { title: 'Instant DOT# Lookup', desc: 'Enter a DOT number and get the full carrier profile pulled live from FMCSA.' },
              { title: '5-Year Insurance History', desc: 'Automatically retrieve 5 years of auto liability carrier history from FMCSA.' },
              { title: 'PDF Generation', desc: 'Generate a branded, pre-filled loss run authorization PDF with one click.' },
              { title: 'E-Signature Workflow', desc: 'Send for digital signature. Once signed, it auto-forwards to selected carriers.' },
              { title: '500+ Carrier Database', desc: 'Pre-loaded with direct loss run contacts for every major trucking insurer.' },
              { title: 'Automated Reminders', desc: 'LossRun360 sends automatic reminders until the insured signs.' },
            ].map((f, i) => (
              <div key={f.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>{i + 1}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '96px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 12px' }}>From DOT# to delivered in 4 steps</h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>No more manual lookups, copy-pasting, or chasing signatures.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { title: 'Enter a DOT# or company name', desc: 'Type the DOT number. LossRun360 hits FMCSA and returns the full carrier profile plus 5 years of insurance history.' },
              { title: 'Review and select carriers', desc: 'Confirm pre-populated info, then select which insurance carriers to request loss runs from.' },
              { title: 'Generate PDF and send for e-signature', desc: 'One click generates the authorization PDF and sends it to the insured. Reminders follow until signed.' },
              { title: 'Signed — carriers notified automatically', desc: 'Once signed, LossRun360 emails every selected carrier with the signed authorization attached.' },
            ].map((step, i) => (
              <div key={step.title} style={{ display: 'flex', gap: '20px', paddingBottom: i < 3 ? '32px' : '0', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', left: '19px', top: '44px', width: '2px', height: 'calc(100% - 44px)', background: '#e2e8f0' }} />}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0, zIndex: 1 }}>{i + 1}</div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#0f172a', margin: '0 0 6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '96px 24px', background: '#fafafe', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 12px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start' }}>
            {[
              { name: 'Starter', price: 79, desc: '25 requests/mo &middot; 3 users', feats: ['25 requests/month', '3 team members', 'FMCSA DOT# lookup', 'PDF generation', 'Email support'], popular: false },
              { name: 'Professional', price: 199, desc: '100 requests/mo &middot; 10 users', feats: ['100 requests/month', '10 team members', 'Everything in Starter', 'E-signature workflow', 'Automated reminders', 'Priority support'], popular: true },
              { name: 'Enterprise', price: 399, desc: 'Unlimited requests and users', feats: ['Unlimited requests', 'Unlimited users', 'Everything in Professional', 'Custom carrier lists', 'API access', 'Dedicated onboarding'], popular: false },
            ].map((plan) => (
              <div key={plan.name} style={{ background: plan.popular ? '#0f172a' : '#fff', border: plan.popular ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 12px', borderRadius: '999px' }}>Most Popular</div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: plan.popular ? '#fff' : '#0f172a', margin: '0 0 6px' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '800', color: plan.popular ? '#fff' : '#0f172a', letterSpacing: '-1.5px' }}>${plan.price}</span>
                  <span style={{ fontSize: '14px', color: plan.popular ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>/mo</span>
                </div>
                <p style={{ fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: '20px' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.feats.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.75)' : '#475569' }}>
                      <span style={{ color: plan.popular ? '#818cf8' : '#16a34a', flexShrink: 0 }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', background: plan.popular ? '#6366f1' : '#f1f5f9', color: plan.popular ? '#fff' : '#475569' }}>Start Free Trial</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 24px', background: '#0f172a', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>Ready to transform your agency?</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '32px' }}>Join hundreds of trucking insurance agencies saving hours every week with LossRun360.</p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: '#6366f1', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>Start Your Free Trial</Link>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '14px' }}>No credit card required &middot; Cancel anytime</p>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '28px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>LossRun<span style={{ color: '#6366f1' }}>360</span></span>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>&copy; {new Date().getFullYear()} LossRun360. Built for commercial trucking insurance.</p>
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
