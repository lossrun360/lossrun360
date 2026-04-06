import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { PLANS } from '@/lib/stripe'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" href="/" />
          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost btn text-sm">Sign In</Link>
            <Link href="/register" className="btn-primary btn text-sm">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Built for Commercial Trucking Insurance
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Loss Run Requests,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
              Done in Minutes.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter a DOT# and LossRun360 instantly pulls carrier info from FMCSA, generates a
            professional authorization form, sends it for e-signature, and submits to carriers —
            all automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-primary btn btn-lg w-full sm:w-auto">
              Start 14-Day Free Trial
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/login" className="btn-secondary btn btn-lg w-full sm:w-auto">
              View Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-text-muted">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        {/* Hero mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="rounded-2xl border border-border bg-surface shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-surface-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-5 bg-surface-3 rounded-md max-w-sm mx-auto flex items-center justify-center">
                  <span className="text-xs text-text-muted">app.lossrun360.com/requests/new</span>
                </div>
              </div>
            </div>
            {/* Fake dashboard */}
            <div className="flex h-[360px]">
              {/* Fake sidebar */}
              <div className="w-48 bg-surface border-r border-border p-3 space-y-1 hidden md:block">
                <div className="h-7 bg-primary/10 rounded-lg mb-3" />
                {['Dashboard', 'Requests', 'Carriers', 'Team'].map((item, i) => (
                  <div key={item} className={`h-8 rounded-lg flex items-center px-2 gap-2 ${i === 1 ? 'bg-primary/10' : ''}`}>
                    <div className={`w-3 h-3 rounded ${i === 1 ? 'bg-primary/60' : 'bg-surface-3'}`} />
                    <div className={`h-2 rounded ${i === 1 ? 'bg-primary/30 w-16' : 'bg-surface-3 w-14'}`} />
                  </div>
                ))}
              </div>
              {/* Fake content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-7 w-48 bg-surface-2 rounded-lg" />
                  <div className="ml-auto h-8 w-28 bg-primary/20 rounded-lg" />
                </div>
                {/* DOT lookup box */}
                <div className="bg-surface-2 rounded-xl border border-border p-5 mb-4">
                  <div className="h-3 w-32 bg-surface-3 rounded mb-3" />
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-surface-3 rounded-lg border border-border flex items-center px-3">
                      <span className="text-sm text-text-muted font-mono">1234567</span>
                    </div>
                    <div className="h-10 w-28 bg-primary rounded-lg" />
                  </div>
                </div>
                {/* Results */}
                <div className="bg-surface-2 rounded-xl border border-emerald-500/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="h-3 w-40 bg-emerald-400/20 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Sunrise Freight LLC', ''],
                      ['DOT# 1234567', ''],
                      ['Houston, TX 77001', ''],
                      ['12 Trucks · 14 Drivers', ''],
                    ].map(([label], i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-2 w-16 bg-surface-3 rounded" />
                        <div className="h-3 w-32 bg-text-muted/20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-surface py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '5 min', label: 'Average time per request' },
            { value: '500+', label: 'Insurance carriers in database' },
            { value: '98%', label: 'FMCSA data accuracy' },
            { value: '10×', label: 'Faster than manual process' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Everything your agency needs
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Built specifically for commercial trucking insurance agencies — not a generic tool adapted for trucking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6 hover:border-border-2 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">From DOT# to delivered — in 4 steps</h2>
            <p className="text-text-secondary text-lg">No more manual lookups, copy-pasting, or chasing signatures.</p>
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute ml-6 mt-14 w-0.5 h-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Simple, transparent pricing</h2>
            <p className="text-text-secondary text-lg">All plans include a 14-day free trial. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(PLANS).map((plan) => (
              <div
                key={plan.tier}
                className={`card p-6 relative flex flex-col ${
                  'popular' in plan && plan.popular ? 'border-primary ring-1 ring-primary/30' : ''
                }`}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">${plan.price}</span>
                    <span className="text-text-muted text-sm">/month</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">
                    {plan.requests === -1 ? 'Unlimited requests' : `${plan.requests} requests/month`}
                    {' · '}
                    {plan.users === -1 ? 'Unlimited users' : `${plan.users} users`}
                  </p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn w-full ${'popular' in plan && plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            Ready to transform your agency&apos;s workflow?
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Join hundreds of trucking insurance agencies saving hours every week with LossRun360.
          </p>
          <Link href="/register" className="btn-primary btn btn-lg">
            Start Your Free Trial Today
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} LossRun360. Built for commercial trucking insurance.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-secondary">Privacy</a>
            <a href="#" className="hover:text-text-secondary">Terms</a>
            <a href="#" className="hover:text-text-secondary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Instant DOT# Lookup',
    description:
      'Enter a DOT number and get the full carrier profile — company name, address, owners, phone, fleet size — pulled live from FMCSA.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: '5-Year Insurance History',
    description:
      'Automatically retrieve historical auto liability carrier data for the past 5 years from FMCSA — no manual research needed.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10a7 7 0 1014 0A7 7 0 003 10z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 6.5V10l2.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Professional PDF Generation',
    description:
      'Generate a branded, pre-filled loss run authorization PDF with one click — ready to send or print.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 2h9l4 4v13H4V2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M13 2v4h4M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'E-Signature Workflow',
    description:
      'Send the authorization to the insured for digital signature. Once signed, the system automatically forwards to selected carriers.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 14l3-1 8-8a1.41 1.41 0 00-2-2l-8 8-1 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M4 17h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Carrier Database',
    description:
      'Pre-loaded database of 500+ trucking insurance carriers with direct loss run contact emails. Add custom carriers anytime.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <ellipse cx="10" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    title: 'Team & Agency Management',
    description:
      'Invite team members with role-based access. Admins see everything; agents manage their own requests. Full audit trail.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M1 17c0-3.31 2.69-5 6-5s6 1.69 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M13.5 3.5a3 3 0 010 6M19 17c0-2.76-2-4.5-4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Automated Reminders',
    description:
      'Never chase down a signature again. LossRun360 automatically sends reminders to insureds who haven\'t signed yet.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2A6 6 0 004 8v3l-1.5 3h15L16 11V8a6 6 0 00-6-6zM8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Full Request History',
    description:
      'Every request is logged with a complete timeline. See who created it, when it was signed, and when carriers received it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4v6l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3.05 6a8 8 0 100 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 2v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Subscription Management',
    description:
      'Flexible plans that grow with your agency. Upgrade, downgrade, or cancel anytime through self-serve billing.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4.5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 8h16" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 12h3M13 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const steps = [
  {
    title: 'Enter a DOT# or company name',
    description:
      'Type the carrier\'s USDOT number or search by company name. LossRun360 instantly hits the FMCSA database and returns the full carrier profile — name, address, owner, phone, fleet size, and 5 years of insurance carrier history.',
  },
  {
    title: 'Review, edit, and select carriers',
    description:
      'Confirm the pre-populated information, add any missing details, and select which insurance carriers you need to request loss runs from. Our database has direct loss-run contact emails for every major trucking insurer.',
  },
  {
    title: 'Generate PDF and send for signature',
    description:
      'With one click, generate a professional authorization PDF and send it to the insured for e-signature. LossRun360 automatically follows up with reminders until it\'s signed.',
  },
  {
    title: 'Signed? Sent to carriers automatically',
    description:
      'Once the insured signs, LossRun360 automatically emails the signed authorization to every selected carrier — with the PDF attached, CC\'d to your team, and logged in your request history.',
  },
]
