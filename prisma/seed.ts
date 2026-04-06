import { PrismaClient, Role, PlanTier, SubscriptionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding LossRun360 database...')

  // ─── Seed Insurance Carriers ──────────────────────────────────────────────
  const carriers = [
    {
      name: 'Progressive Commercial Insurance',
      shortName: 'Progressive',
      naic: '24260',
      address: '6300 Wilson Mills Rd',
      city: 'Mayfield Village',
      state: 'OH',
      zip: '44143',
      phone: '1-800-776-4737',
      lossRunEmail: 'lossruns@progressive.com',
      website: 'https://www.progressivecommercial.com',
      specialties: ['trucking', 'commercial_auto', 'cargo'],
    },
    {
      name: 'Old Republic Insurance Company',
      shortName: 'Old Republic',
      naic: '24147',
      address: '307 N Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '1-800-552-1015',
      lossRunEmail: 'lossruns@oldrepublictrucking.com',
      website: 'https://www.oldrepublictrucking.com',
      specialties: ['trucking', 'commercial_auto'],
    },
    {
      name: 'Canal Insurance Company',
      shortName: 'Canal',
      naic: '10464',
      address: 'PO Box 7',
      city: 'Greenville',
      state: 'SC',
      zip: '29602',
      phone: '1-800-365-9758',
      lossRunEmail: 'lossruns@canalinsurance.com',
      website: 'https://www.canalinsurance.com',
      specialties: ['trucking', 'commercial_auto', 'specialty'],
    },
    {
      name: 'Great West Casualty Company',
      shortName: 'Great West',
      naic: '11371',
      address: '1100 W 29th St',
      city: 'South Sioux City',
      state: 'NE',
      zip: '68776',
      phone: '1-402-494-2411',
      lossRunEmail: 'lossruns@gwccnet.com',
      website: 'https://www.gwccnet.com',
      specialties: ['trucking', 'commercial_auto', 'cargo'],
    },
    {
      name: 'National Interstate Insurance Company',
      shortName: 'National Interstate',
      naic: '32620',
      address: '3250 Interstate Dr',
      city: 'Richfield',
      state: 'OH',
      zip: '44286',
      phone: '1-800-929-1500',
      lossRunEmail: 'lossruns@natinterstate.com',
      website: 'https://www.natinterstatecom',
      specialties: ['trucking', 'commercial_auto', 'specialty'],
    },
    {
      name: 'Protective Insurance Company',
      shortName: 'Protective',
      naic: '12638',
      address: '111 Congressional Blvd',
      city: 'Carmel',
      state: 'IN',
      zip: '46032',
      phone: '1-800-644-5501',
      lossRunEmail: 'lossruns@protectiveinsurance.com',
      website: 'https://www.protectiveinsurance.com',
      specialties: ['trucking', 'fleet'],
    },
    {
      name: 'Markel Insurance Company',
      shortName: 'Markel',
      naic: '38970',
      address: '4521 Highwoods Pkwy',
      city: 'Glen Allen',
      state: 'VA',
      zip: '23060',
      phone: '1-800-431-1270',
      lossRunEmail: 'lossruns@markel.com',
      website: 'https://www.markel.com',
      specialties: ['trucking', 'specialty', 'cargo'],
    },
    {
      name: 'Sentry Insurance',
      shortName: 'Sentry',
      naic: '24988',
      address: '1800 N Point Dr',
      city: 'Stevens Point',
      state: 'WI',
      zip: '54481',
      phone: '1-800-473-6879',
      lossRunEmail: 'lossruns@sentry.com',
      website: 'https://www.sentry.com',
      specialties: ['trucking', 'commercial_auto'],
    },
    {
      name: 'OOIDA Risk Retention Group',
      shortName: 'OOIDA',
      naic: '10340',
      address: '1 NW OOIDA Dr',
      city: 'Grain Valley',
      state: 'MO',
      zip: '64029',
      phone: '1-800-444-5791',
      lossRunEmail: 'lossruns@ooida.com',
      website: 'https://www.ooida.com',
      specialties: ['trucking', 'owner_operator'],
    },
    {
      name: 'National Indemnity Company',
      shortName: 'National Indemnity',
      naic: '20087',
      address: '3024 Harney St',
      city: 'Omaha',
      state: 'NE',
      zip: '68131',
      phone: '1-402-916-3000',
      lossRunEmail: 'lossruns@nationalindemnity.com',
      website: 'https://www.nationalindemnity.com',
      specialties: ['trucking', 'commercial_auto', 'specialty'],
    },
    {
      name: 'Zurich North America',
      shortName: 'Zurich',
      naic: '16535',
      address: '1299 Zurich Way',
      city: 'Schaumburg',
      state: 'IL',
      zip: '60196',
      phone: '1-800-382-2150',
      lossRunEmail: 'lossruns@zurichna.com',
      website: 'https://www.zurichna.com',
      specialties: ['trucking', 'fleet', 'commercial_auto'],
    },
    {
      name: 'Travelers Insurance',
      shortName: 'Travelers',
      naic: '25658',
      address: '485 Lexington Ave',
      city: 'New York',
      state: 'NY',
      zip: '10017',
      phone: '1-800-328-2189',
      lossRunEmail: 'lossruns@travelers.com',
      website: 'https://www.travelers.com',
      specialties: ['trucking', 'commercial_auto', 'cargo', 'fleet'],
    },
    {
      name: 'Liberty Mutual Insurance',
      shortName: 'Liberty Mutual',
      naic: '23035',
      address: '175 Berkeley St',
      city: 'Boston',
      state: 'MA',
      zip: '02116',
      phone: '1-800-290-8711',
      lossRunEmail: 'lossruns@libertymutual.com',
      website: 'https://www.libertymutual.com',
      specialties: ['trucking', 'fleet', 'commercial_auto'],
    },
    {
      name: 'Hartford Fire Insurance Company',
      shortName: 'Hartford',
      naic: '19682',
      address: 'One Hartford Plaza',
      city: 'Hartford',
      state: 'CT',
      zip: '06155',
      phone: '1-860-547-5000',
      lossRunEmail: 'lossruns@thehartford.com',
      website: 'https://www.thehartford.com',
      specialties: ['trucking', 'commercial_auto', 'cargo'],
    },
    {
      name: 'ACE American Insurance Company',
      shortName: 'Chubb/ACE',
      naic: '22667',
      address: '436 Walnut St',
      city: 'Philadelphia',
      state: 'PA',
      zip: '19106',
      phone: '1-800-372-4822',
      lossRunEmail: 'lossruns@chubb.com',
      website: 'https://www.chubb.com',
      specialties: ['trucking', 'fleet', 'specialty'],
    },
  ]

  console.log(`  Creating ${carriers.length} insurance carriers...`)
  for (const carrier of carriers) {
    await prisma.insuranceCarrier.upsert({
      where: { naic: carrier.naic },
      update: carrier,
      create: carrier,
    })
  }

  // ─── Seed Super Admin ────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@LossRun360!', 12)

  const adminAgency = await prisma.agency.upsert({
    where: { slug: 'lossrun360-admin' },
    update: {},
    create: {
      name: 'LossRun360',
      slug: 'lossrun360-admin',
      email: 'admin@lossrun360.com',
      phone: '1-800-000-0000',
      address: '123 Admin St',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@lossrun360.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@lossrun360.com',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      agencyId: adminAgency.id,
    },
  })

  // ─── Seed Demo Agency ────────────────────────────────────────────────────
  const demoPassword = await bcrypt.hash('Demo@123!', 12)

  const demoAgency = await prisma.agency.upsert({
    where: { slug: 'apex-insurance-group' },
    update: {},
    create: {
      name: 'Apex Insurance Group',
      slug: 'apex-insurance-group',
      email: 'info@apexinsurance.com',
      phone: '555-123-4567',
      address: '456 Main Street, Suite 200',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
  })

  await prisma.subscription.upsert({
    where: { agencyId: demoAgency.id },
    update: {},
    create: {
      agencyId: demoAgency.id,
      planTier: PlanTier.PROFESSIONAL,
      status: SubscriptionStatus.TRIALING,
      requestsPerMonth: 100,
      usersAllowed: 10,
      trialEndAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  })

  const demoAdmin = await prisma.user.upsert({
    where: { email: 'demo@apexinsurance.com' },
    update: {},
    create: {
      name: 'Demo Admin',
      email: 'demo@apexinsurance.com',
      password: demoPassword,
      role: Role.AGENCY_ADMIN,
      agencyId: demoAgency.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'agent@apexinsurance.com' },
    update: {},
    create: {
      name: 'Demo Agent',
      email: 'agent@apexinsurance.com',
      password: demoPassword,
      role: Role.AGENT,
      agencyId: demoAgency.id,
    },
  })

  // ─── Seed Sample Requests ─────────────────────────────────────────────
  const carrier1 = await prisma.insuranceCarrier.findFirst({
    where: { shortName: 'Progressive' },
  })
  const carrier2 = await prisma.insuranceCarrier.findFirst({
    where: { shortName: 'Great West' },
  })

  const sampleRequest = await prisma.lossRunRequest.create({
    data: {
      dotNumber: '1234567',
      mcNumber: 'MC-987654',
      companyName: 'Sunrise Freight LLC',
      ownerName: 'John Martinez',
      address: '7890 Truck Rd',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      phone: '713-555-9876',
      email: 'jmartinez@sunrisefreight.com',
      entityType: 'Limited Liability Company',
      operationType: 'Common Carrier',
      totalTrucks: 12,
      totalDrivers: 14,
      yearsRequested: 5,
      policyType: 'Auto Liability',
      status: 'COMPLETED',
      signatureStatus: 'SIGNED',
      signedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sentToCarrierAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      insuredEmail: 'jmartinez@sunrisefreight.com',
      agencyId: demoAgency.id,
      createdById: demoAdmin.id,
      carriers: {
        create: [
          {
            carrierId: carrier1?.id,
            carrierName: 'Progressive Commercial Insurance',
            carrierEmail: 'lossruns@progressive.com',
            status: 'SENT',
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            carrierId: carrier2?.id,
            carrierName: 'Great West Casualty Company',
            carrierEmail: 'lossruns@gwccnet.com',
            status: 'SENT',
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  })

  // Add timeline events for sample request
  await prisma.requestTimeline.createMany({
    data: [
      {
        requestId: sampleRequest.id,
        event: 'REQUEST_CREATED',
        description: 'Loss run request created',
      },
      {
        requestId: sampleRequest.id,
        event: 'SENT_FOR_SIGNATURE',
        description: 'Request sent to insured for signature',
      },
      {
        requestId: sampleRequest.id,
        event: 'SIGNED',
        description: 'Insured signed the loss run request',
      },
      {
        requestId: sampleRequest.id,
        event: 'SENT_TO_CARRIERS',
        description: 'Request sent to 2 carriers',
      },
    ],
  })

  await prisma.lossRunRequest.create({
    data: {
      dotNumber: '9876543',
      mcNumber: 'MC-123456',
      companyName: 'Blue Ridge Transport Inc',
      ownerName: 'Sarah Thompson',
      address: '321 Highway Blvd',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301',
      phone: '404-555-1234',
      email: 'sthompson@blueridgetransport.com',
      entityType: 'Corporation',
      operationType: 'Contract Carrier',
      totalTrucks: 5,
      totalDrivers: 6,
      yearsRequested: 5,
      policyType: 'Auto Liability',
      status: 'PENDING_SIGNATURE',
      signatureStatus: 'PENDING',
      insuredEmail: 'sthompson@blueridgetransport.com',
      sentToInsuredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      agencyId: demoAgency.id,
      createdById: demoAdmin.id,
    },
  })

  await prisma.lossRunRequest.create({
    data: {
      dotNumber: '5432109',
      companyName: 'Lone Star Hauling Co',
      ownerName: 'Mike Davis',
      address: '999 I-35 Service Rd',
      city: 'San Antonio',
      state: 'TX',
      zip: '78201',
      phone: '210-555-7890',
      email: 'mike@lonestarhauling.com',
      entityType: 'Sole Proprietor',
      operationType: 'Common Carrier',
      totalTrucks: 2,
      totalDrivers: 2,
      yearsRequested: 5,
      status: 'DRAFT',
      agencyId: demoAgency.id,
      createdById: demoAdmin.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('  Demo login credentials:')
  console.log('  Email:    demo@apexinsurance.com')
  console.log('  Password: Demo@123!')
  console.log('')
  console.log('  Super Admin:')
  console.log('  Email:    admin@lossrun360.com')
  console.log('  Password: Admin@LossRun360!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
