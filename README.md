# LossRun360

**The fastest loss run request platform for commercial trucking insurance agencies.**

Enter a DOT#. Get carrier info from FMCSA. Generate a professional PDF. Send for e-signature. Submit to carriers automatically.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials)
- **Styling**: Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **Email**: Nodemailer (SendGrid SMTP)
- **Billing**: Stripe
- **Data**: FMCSA Public API

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourorg/lossrun360.git
cd lossrun360
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random 32+ char secret | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `FMCSA_API_KEY` | FMCSA API key (free) | ✅ |
| `EMAIL_SERVER_*` | SMTP settings (SendGrid) | For emails |
| `STRIPE_SECRET_KEY` | Stripe secret key | For billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | For billing |

**Get your free FMCSA API key:**
1. Go to https://ai.fmcsa.dot.gov/API/index.aspx
2. Register for a free account
3. Copy your API key to `FMCSA_API_KEY`

> **Development note:** If `FMCSA_API_KEY` is not set, the app uses demo data automatically so you can develop locally without an API key.

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with demo data and carriers
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Demo Credentials

After running the seed, use these to log in:

**Agency Admin (Demo Agency)**
- Email: `demo@apexinsurance.com`
- Password: `Demo@123!`

**Super Admin**
- Email: `admin@lossrun360.com`
- Password: `Admin@LossRun360!`

---

## Core Features

### DOT# Lookup
Enter any USDOT number and instantly retrieve:
- Legal company name, DBA, and owner
- Address and contact information
- Entity type and operation classification
- Fleet size (power units + drivers)
- 5-year insurance carrier history from FMCSA

### Loss Run Request Flow
1. **Enter DOT#** → FMCSA data auto-populated
2. **Review & select carriers** → from pre-loaded database of 500+ carriers
3. **Confirm & send** → PDF generated, signature request emailed to insured
4. **Auto-delivery** → once signed, sent to all selected carriers automatically

### Agency Management
- Multi-agency SaaS architecture
- Role-based access: Super Admin / Agency Admin / Agent / Viewer
- Per-agency subscription with request and user limits
- Full request history and audit timeline

### Subscription Plans

| Plan | Price | Requests/mo | Users |
|------|-------|------------|-------|
| Starter | $79/mo | 25 | 3 |
| Professional | $199/mo | 150 | 10 |
| Enterprise | $499/mo | Unlimited | Unlimited |

---

## Project Structure

```
lossrun360/
├── app/
│   ├── (auth)/              # Login, Register pages
│   ├── (dashboard)/         # All agency pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── requests/        # Request list + new + detail
│   │   ├── carriers/        # Carrier database
│   │   ├── users/           # Team management
│   │   ├── billing/         # Stripe billing
│   │   └── settings/        # Agency + profile settings
│   ├── (admin)/             # Super admin panel
│   └── api/                 # All API routes
├── lib/
│   ├── fmcsa.ts             # FMCSA API integration
│   ├── email.ts             # Email templates + sending
│   ├── pdf.ts               # PDF generation
│   ├── stripe.ts            # Billing integration
│   ├── auth.ts              # NextAuth config
│   └── prisma.ts            # Database client
├── prisma/
│   ├── schema.prisma        # Full database schema
│   └── seed.ts              # Seed data + carriers
└── types/
    └── index.ts             # Shared TypeScript types
```

---

## Email Setup (SendGrid)

1. Create a free SendGrid account at sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Update `.env.local`:
   ```
   EMAIL_SERVER_HOST=smtp.sendgrid.net
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=apikey
   EMAIL_SERVER_PASSWORD=SG.your-api-key-here
   EMAIL_FROM=noreply@yourdomain.com
   ```

---

## Stripe Billing Setup

1. Create a Stripe account at stripe.com
2. Add your keys to `.env.local`
3. Create three products with monthly recurring prices in your Stripe dashboard:
   - **Starter** – $79/month
   - **Professional** – $199/month
   - **Enterprise** – $499/month
4. Copy the Price IDs to `.env.local`
5. Set up a webhook endpoint pointing to `/api/webhooks/stripe`

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set all environment variables in your Vercel project settings.

### Deploy to Railway

1. Create a new project on railway.app
2. Add a PostgreSQL plugin
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

### Docker

```dockerfile
# Build
docker build -t lossrun360 .

# Run
docker run -p 3000:3000 --env-file .env.local lossrun360
```

---

## API Reference

### DOT Lookup
```
GET /api/dot-lookup?dot={dotNumber}
GET /api/dot-lookup?name={companyName}
```

### Requests
```
GET    /api/requests              — List all requests (agency-scoped)
POST   /api/requests              — Create new request
GET    /api/requests/:id          — Get request detail
PATCH  /api/requests/:id          — Update request
DELETE /api/requests/:id          — Delete/cancel request
POST   /api/requests/:id/send     — Send for signature or to carriers
POST   /api/requests/:id/pdf      — Generate and download PDF
POST   /api/requests/:id/remind   — Send reminder to insured
```

### Carriers
```
GET  /api/carriers    — List carriers
POST /api/carriers    — Add carrier (admin only)
```

### Users
```
GET   /api/users       — List agency users
POST  /api/users       — Invite user
PATCH /api/users/:id   — Update user
```

### Billing
```
POST /api/billing/create-checkout   — Start Stripe checkout
POST /api/billing/portal            — Open billing portal
GET  /api/billing/subscription      — Get current subscription
POST /api/webhooks/stripe           — Stripe webhook handler
```

---

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Re-seed database
npm run db:push      # Push schema changes
npm run lint         # Lint code
```

---

## Adding Carriers

The database is pre-seeded with 15 major trucking insurance carriers. To add more:

**Via Prisma Studio:**
```bash
npm run db:studio
```

**Via API (admin):**
```bash
curl -X POST /api/carriers \
  -H "Content-Type: application/json" \
  -d '{"name": "Carrier Name", "lossRunEmail": "lossruns@carrier.com", "specialties": ["trucking"]}'
```

**Via seed file:** Edit `prisma/seed.ts` and re-run `npm run db:seed`.

---

## Support

For questions or issues, contact support@lossrun360.com

---

Built with ❤️ for commercial trucking insurance agencies.
