/**
 * FMCSA API Integration
 *
 * Uses the FMCSA public API to fetch carrier info, insurance history, and more.
 * Free API key: https://ai.fmcsa.dot.gov/API/index.aspx
 *
 * Primary endpoints:
 *   GET /safety/carriers/{dotNumber}          — carrier info
 *   GET /safety/carriers/{dotNumber}/cargo-carried
 *   GET /safety/carriers/{dotNumber}/insurance
 *   GET /safety/carriers/name/{name}          — search by name
 */

const FMCSA_BASE = 'https://mobile.fmcsa.dot.gov/qc/services'
const FMCSA_API_KEY = process.env.FMCSA_API_KEY || ''

export interface FMCSACarrier {
  dotNumber: string
  legalName: string
  dbaName?: string
  carrierOperation?: string
  hmFlag?: string
  pcFlag?: string
  phyStreet?: string
  phyCity?: string
  phyState?: string
  phyZip?: string
  phyCountry?: string
  mailingStreet?: string
  mailingCity?: string
  mailingState?: string
  mailingZip?: string
  telephone?: string
  fax?: string
  email?: string
  mcs150Date?: string
  mcs150Mileage?: number
  mcs150MileageYear?: number
  addDate?: string
  oicState?: string
  nbr_power_unit?: number
  driverTotal?: number
  mcNumber?: string
  entityType?: string
  operatingStatus?: string
}

export interface FMCSAInsuranceRecord {
  carrierName: string
  policyType: string
  insurerName: string
  policyNumber?: string
  postedDate?: string
  coverageFrom?: string
  coverageTo?: string
  coverageAmount?: number
}

export interface DOTLookupResult {
  found: boolean
  dotNumber: string
  mcNumber?: string
  companyName?: string
  dbaName?: string
  ownerName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  fax?: string
  email?: string
  entityType?: string
  operationType?: string
  operatingStatus?: string
  totalTrucks?: number
  totalDrivers?: number
  mcs150Date?: string
  insuranceHistory?: FMCSAInsuranceRecord[]
  error?: string
}

/**
 * Look up a carrier by DOT number.
 * Falls back to demo data in development if FMCSA_API_KEY is not set.
 */
export async function lookupByDOT(dotNumber: string): Promise<DOTLookupResult> {
  const cleanDOT = dotNumber.replace(/\D/g, '')
  if (!cleanDOT || cleanDOT.length < 5) {
    return { found: false, dotNumber: cleanDOT, error: 'Invalid DOT number format' }
  }

  // If no API key, return demo data in development
  if (!FMCSA_API_KEY && process.env.NODE_ENV !== 'production') {
    return getDemoCarrier(cleanDOT)
  }

  try {
    const [carrierRes, insuranceRes] = await Promise.allSettled([
      fetchFMCSACarrier(cleanDOT),
      fetchFMCSAInsurance(cleanDOT),
    ])

    if (carrierRes.status === 'rejected' || !carrierRes.value) {
      return { found: false, dotNumber: cleanDOT, error: 'Carrier not found in FMCSA database' }
    }

    const carrier = carrierRes.value
    const insurance = insuranceRes.status === 'fulfilled' ? insuranceRes.value : []

    return {
      found: true,
      dotNumber: cleanDOT,
      mcNumber: carrier.mcNumber,
      companyName: carrier.legalName,
      dbaName: carrier.dbaName,
      address: carrier.phyStreet || carrier.mailingStreet,
      city: carrier.phyCity || carrier.mailingCity,
      state: carrier.phyState || carrier.mailingState,
      zip: carrier.phyZip || carrier.mailingZip,
      phone: formatPhone(carrier.telephone),
      fax: formatPhone(carrier.fax),
      email: carrier.email,
      entityType: carrier.entityType,
      operationType: carrier.carrierOperation,
      operatingStatus: carrier.operatingStatus,
      totalTrucks: carrier.nbr_power_unit,
      totalDrivers: carrier.driverTotal,
      mcs150Date: carrier.mcs150Date,
      insuranceHistory: insurance,
    }
  } catch (error) {
    console.error('FMCSA lookup error:', error)
    return { found: false, dotNumber: cleanDOT, error: 'Failed to connect to FMCSA database' }
  }
}

/**
 * Search carriers by company name.
 */
export async function searchByName(name: string): Promise<DOTLookupResult[]> {
  if (!FMCSA_API_KEY) return []
  try {
    const url = `${FMCSA_BASE}/carriers/name/${encodeURIComponent(name)}?webKey=${FMCSA_API_KEY}&start=0&size=10`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()
    const carriers = data?.content?.carrier || []
    return carriers.slice(0, 10).map((c: FMCSACarrier) => ({
      found: true,
      dotNumber: c.dotNumber,
      mcNumber: c.mcNumber,
      companyName: c.legalName,
      dbaName: c.dbaName,
      city: c.phyCity,
      state: c.phyState,
      operatingStatus: c.operatingStatus,
    }))
  } catch {
    return []
  }
}

// ─── Private helpers ──────────────────────────────────────────────────────────

async function fetchFMCSACarrier(dotNumber: string): Promise<FMCSACarrier | null> {
  const url = `${FMCSA_BASE}/carriers/${dotNumber}?webKey=${FMCSA_API_KEY}`
  const res = await fetch(url, { cache: 'no-store' }) // always fresh — carrier phone/email must not be stale
  if (!res.ok) return null
  const data = await res.json()
  return Array.isArray(data?.content?.carrier)
    ? data.content.carrier[0]
    : (data?.content?.carrier || null)
}

async function fetchFMCSAInsurance(dotNumber: string): Promise<FMCSAInsuranceRecord[]> {
  const url = `${FMCSA_BASE}/carriers/${dotNumber}/insurance?webKey=${FMCSA_API_KEY}`
  // Disable caching — insurance data changes and stale empty responses would hide real records
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  const content = data?.content || {}

  // Log the raw response structure to diagnose field name issues
  console.log('[FMCSA insurance] DOT:', dotNumber, 'content keys:', Object.keys(content))
  if (content.carrier) {
    console.log('[FMCSA insurance] carrier keys:', Object.keys(content.carrier))
  }

  // The FMCSA mobile API nests insurance records under content.carrier (lowercase).
  // Some API versions use content.Carrier (capitalized) or put records at the top level.
  // Resolve the nesting once, then check all known field name variants on that object.
  const carrier = content.carrier || content.Carrier || content

  // Liability / BIPD insurance
  const liabilityRecords: any[] =
    (Array.isArray(carrier.liInsuranceOnFile) && carrier.liInsuranceOnFile.length > 0
      ? carrier.liInsuranceOnFile : null) ||
    (Array.isArray(carrier.liabilityInsuranceOnFile) && carrier.liabilityInsuranceOnFile.length > 0
      ? carrier.liabilityInsuranceOnFile : null) ||
    (Array.isArray(carrier.insuranceOnFile) && carrier.insuranceOnFile.length > 0
      ? carrier.insuranceOnFile : null) ||
    (Array.isArray(carrier.liabilityInsuranceData) && carrier.liabilityInsuranceData.length > 0
      ? carrier.liabilityInsuranceData : null) ||
    []

  // Cargo insurance
  const cargoRecords: any[] =
    (Array.isArray(carrier.cargoInsuranceOnFile) && carrier.cargoInsuranceOnFile.length > 0
      ? carrier.cargoInsuranceOnFile : null) ||
    []

  const allRecords = [...liabilityRecords, ...cargoRecords]
  if (allRecords.length === 0) return []

  return allRecords.slice(0, 30).map((h: any) => {
    // Determine coverage type from typeDesc or policyType fields
    const rawType = h.typeDesc || h.policyType || ''
    const coverageType = rawType.toLowerCase().includes('cargo')
      ? 'Cargo'
      : rawType.toLowerCase().includes('bond')
      ? 'Surety Bond'
      : 'BIPD/Primary'

    return {
      carrierName: h.insCompany || h.insuranceCompany || h.insName || h.carrierName || 'Unknown',
      policyType: coverageType,
      insurerName: h.insCompany || h.insuranceCompany || h.insName || 'Unknown',
      policyNumber: h.policyNumber || h.policyNbr || null,
      postedDate: h.postedDate || null,
      // effectiveDate is when coverage started; cancelledDate is when it ended
      coverageFrom: h.effectiveDate || h.coverageFrom || h.postedDate || null,
      coverageTo: h.cancelledDate || h.cancellationDate || h.coverageTo || null,
      coverageAmount: parseCoverage(
        h.bipdAmount || h.bipdOnFile || h.coverageAmount || h.coverageAmnt
      ),
    }
  })
}

/**
 * Format a raw phone number string into (XXX) XXX-XXXX.
 * Handles both 10-digit and 11-digit (with leading country code 1) numbers.
 */
function formatPhone(phone?: string): string | undefined {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (!digits) return undefined
  // Strip leading country code '1' for US numbers
  let tenDigits = digits
  if (digits.length === 11 && digits[0] === '1') {
    tenDigits = digits.slice(1)
  }
  if (tenDigits.length === 10) {
    return `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`
  }
  // Return original if we can't format it cleanly
  return phone
}

function parseCoverage(amount?: string): number | undefined {
  if (!amount) return undefined
  const num = parseFloat(String(amount).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? undefined : num
}

// ─── Demo Data (for development without API key) ──────────────────────────────

function getDemoCarrier(dotNumber: string): DOTLookupResult {
  const demos: Record<string, DOTLookupResult> = {
    '1234567': {
      found: true,
      dotNumber: '1234567',
      mcNumber: 'MC-987654',
      companyName: 'Sunrise Freight LLC',
      dbaName: '',
      ownerName: 'John Martinez',
      address: '7890 Truck Rd',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      phone: '(713) 555-9876',
      email: 'jmartinez@sunrisefreight.com',
      entityType: 'Limited Liability Company',
      operationType: 'Common Carrier',
      operatingStatus: 'ACTIVE',
      totalTrucks: 12,
      totalDrivers: 14,
      insuranceHistory: [
        {
          carrierName: 'Progressive Commercial',
          policyType: 'BIPD/Primary',
          insurerName: 'Progressive Commercial Insurance',
          policyNumber: 'PCT-20231234',
          coverageFrom: '2023-01-01',
          coverageTo: '2024-01-01',
          coverageAmount: 1000000,
        },
        {
          carrierName: 'Great West Casualty',
          policyType: 'BIPD/Primary',
          insurerName: 'Great West Casualty Company',
          policyNumber: 'GW-20210987',
          coverageFrom: '2021-01-01',
          coverageTo: '2023-01-01',
          coverageAmount: 1000000,
        },
      ],
    },
    '9876543': {
      found: true,
      dotNumber: '9876543',
      mcNumber: 'MC-123456',
      companyName: 'Blue Ridge Transport Inc',
      address: '321 Highway Blvd',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301',
      phone: '(404) 555-1234',
      email: 'info@blueridgetransport.com',
      entityType: 'Corporation',
      operationType: 'Contract Carrier',
      operatingStatus: 'ACTIVE',
      totalTrucks: 5,
      totalDrivers: 6,
      insuranceHistory: [],
    },
  }

  return (
    demos[dotNumber] || {
      found: true,
      dotNumber,
      mcNumber: `MC-${Math.floor(Math.random() * 900000 + 100000)}`,
      companyName: 'Sample Trucking Company LLC',
      address: '123 Highway Dr',
      city: 'Nashville',
      state: 'TN',
      zip: '37201',
      phone: '(615) 555-0100',
      email: 'info@sampletrucking.com',
      entityType: 'Limited Liability Company',
      operationType: 'Common Carrier',
      operatingStatus: 'ACTIVE',
      totalTrucks: 8,
      totalDrivers: 9,
      insuranceHistory: [
        {
          carrierName: 'Travelers Insurance',
          policyType: 'BIPD/Primary',
          insurerName: 'Travelers Insurance',
          coverageFrom: '2023-06-01',
          coverageTo: '2024-06-01',
          coverageAmount: 750000,
        },
      ],
    }
  )
}
