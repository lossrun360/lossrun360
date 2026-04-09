/**
 * FMCSA API Integration
 *
 * Uses the FMCSA public mobile API to fetch carrier info, MC numbers, and insurance.
 * Free API key: https://ai.fmcsa.dot.gov/API/index.aspx
 *
 * Confirmed working endpoints (as of 2026-04):
 *   GET /qc/services/carriers/{dotNumber}             — carrier snapshot (no phone in response)
 *   GET /qc/services/carriers/{dotNumber}/mc-numbers  — MC/MX docket numbers
 *   GET /qc/services/carriers/{dotNumber}/authority   — operating authority
 *   GET /qc/services/carriers/name/{name}             — search by name
 *
 * NOTE: /insurance and /authority-history return 404 for many carriers via the mobile API.
 *       Phone/email may not always be available from the carrier snapshot endpoint.
 */

const FMCSA_BASE = 'https://mobile.fmcsa.dot.gov/qc/services'
const FMCSA_API_KEY = process.env.FMCSA_API_KEY || ''

/** Timeout in ms for each FMCSA API call */
const API_TIMEOUT_MS = 6000

/** Create an AbortSignal that fires after `ms` milliseconds */
function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

// Actual shape returned by GET /qc/services/carriers/{dot}
export interface FMCSACarrier {
  dotNumber: string | number
  legalName: string
  dbaName?: string | null
  // carrierOperation is returned as an OBJECT, not a string
  carrierOperation?: { carrierOperationCode: string; carrierOperationDesc: string } | string
  statusCode?: string          // 'A' = Active, 'I' = Inactive
  phyStreet?: string
  phyCity?: string
  phyState?: string
  phyZipcode?: string          // NOTE: the API uses "phyZipcode", NOT "phyZip"
  phyCountry?: string
  mailingStreet?: string
  mailingCity?: string
  mailingState?: string
  mailingZip?: string
  mailingZipcode?: string
  telephone?: string           // May be absent for some carriers
  phyPhone?: string            // May be absent for some carriers
  fax?: string
  email?: string
  mcs150Date?: string
  mcs150FormDate?: string
  mcs150Mileage?: number
  mcs150MileageYear?: number
  totalPowerUnits?: number     // NOTE: API returns "totalPowerUnits", not "nbr_power_unit"
  totalDrivers?: number        // NOTE: API returns "totalDrivers", not "driverTotal"
  // Legacy field name aliases (kept for safety)
  nbr_power_unit?: number
  driverTotal?: number
  phyZip?: string
  mcNumber?: string
  entityType?: string
  operatingStatus?: string
  bipdInsuranceOnFile?: string
  cargoInsuranceOnFile?: string
  ein?: number
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
    const [carrierRes, insuranceRes, mcRes, saferRes] = await Promise.allSettled([
      fetchFMCSACarrier(cleanDOT),
      fetchFMCSAInsurance(cleanDOT),
      fetchFMCSAMcNumber(cleanDOT),
      scrapeSAFERContact(cleanDOT),
    ])

    if (carrierRes.status === 'rejected' || !carrierRes.value) {
      return { found: false, dotNumber: cleanDOT, error: 'Carrier not found in FMCSA database' }
    }

    const carrier = carrierRes.value
    const insurance =
      insuranceRes.status === 'fulfilled' ? insuranceRes.value : []
    const mcNumber =
      mcRes.status === 'fulfilled' ? mcRes.value : null
    const saferContact =
      saferRes.status === 'fulfilled' ? saferRes.value : {}

    // carrierOperation may come back as an object {carrierOperationCode, carrierOperationDesc}
    const operationType =
      carrier.carrierOperation && typeof carrier.carrierOperation === 'object'
        ? (carrier.carrierOperation as { carrierOperationDesc: string }).carrierOperationDesc
        : (carrier.carrierOperation as string | undefined)

    // statusCode 'A' = Active, 'I' = Inactive; fall back to operatingStatus field
    const operatingStatus =
      carrier.statusCode === 'A' ? 'ACTIVE'
      : carrier.statusCode === 'I' ? 'INACTIVE'
      : (carrier.operatingStatus || carrier.statusCode)

    return {
      found: true,
      dotNumber: cleanDOT,
      mcNumber: mcNumber || carrier.mcNumber,
      companyName: carrier.legalName,
      dbaName: carrier.dbaName ?? undefined,
      address: carrier.phyStreet || carrier.mailingStreet,
      city: carrier.phyCity || carrier.mailingCity,
      state: carrier.phyState || carrier.mailingState,
      // API field is "phyZipcode", NOT "phyZip"
      zip: carrier.phyZipcode || carrier.phyZip || carrier.mailingZip || carrier.mailingZipcode,
      // Phone: prefer FMCSA API data, fall back to SAFER HTML scrape
      phone: formatPhone(carrier.phyPhone || carrier.telephone || (carrier as any).phone || saferContact.phone),
      fax: formatPhone(carrier.fax),
      // Email: prefer FMCSA API data, fall back to SAFER HTML scrape
      email: carrier.email || (carrier as any).emailAddress || saferContact.email,
      entityType: carrier.entityType,
      operationType,
      operatingStatus,
      // API returns "totalPowerUnits" and "totalDrivers", not nbr_power_unit / driverTotal
      totalTrucks: carrier.totalPowerUnits ?? carrier.nbr_power_unit,
      totalDrivers: carrier.totalDrivers ?? carrier.driverTotal,
      mcs150Date: carrier.mcs150Date || carrier.mcs150FormDate,
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
    const res = await fetch(url, { next: { revalidate: 300 }, signal: timeoutSignal(API_TIMEOUT_MS) })

    if (!res.ok) return []

    const data = await res.json()
    const carriers: FMCSACarrier[] = Array.isArray(data?.content?.carrier)
      ? data.content.carrier
      : data?.content?.carrier
        ? [data.content.carrier]
        : []

    return carriers.slice(0, 10).map((c) => ({
      found: true,
      dotNumber: String(c.dotNumber),
      mcNumber: c.mcNumber,
      companyName: c.legalName,
      dbaName: c.dbaName ?? undefined,
      city: c.phyCity,
      state: c.phyState,
      operatingStatus: c.statusCode === 'A' ? 'ACTIVE' : c.operatingStatus,
    }))
  } catch {
    return []
  }
}

// ─── Private helpers ──────────────────────────────────────────────────────────

async function fetchFMCSACarrier(dotNumber: string): Promise<FMCSACarrier | null> {
  const url = `${FMCSA_BASE}/carriers/${dotNumber}?webKey=${FMCSA_API_KEY}`
  const res = await fetch(url, { cache: 'no-store', signal: timeoutSignal(API_TIMEOUT_MS) })

  if (!res.ok) return null

  const data = await res.json()
  // The carrier is nested under content.carrier (object, not array, for this endpoint)
  const c = Array.isArray(data?.content?.carrier)
    ? data.content.carrier[0]
    : (data?.content?.carrier || null)
  return c
}

/**
 * Fetch MC/MX docket numbers for a carrier.
 * Returns the first MC number found, formatted as "MC-XXXXXX".
 */
async function fetchFMCSAMcNumber(dotNumber: string): Promise<string | null> {
  const url = `${FMCSA_BASE}/carriers/${dotNumber}/mc-numbers?webKey=${FMCSA_API_KEY}`
  const res = await fetch(url, { cache: 'no-store', signal: timeoutSignal(API_TIMEOUT_MS) })

  if (!res.ok) return null

  const data = await res.json()
  const records: Array<{ prefix: string; docketNumber: number }> = Array.isArray(data?.content)
    ? data.content
    : []

  const mc = records.find((r) => r.prefix === 'MC')
  return mc ? `MC-${mc.docketNumber}` : null
}

async function fetchFMCSAInsurance(dotNumber: string): Promise<FMCSAInsuranceRecord[]> {
  const url = `${FMCSA_BASE}/carriers/${dotNumber}/insurance?webKey=${FMCSA_API_KEY}`
  const res = await fetch(url, { cache: 'no-store', signal: timeoutSignal(API_TIMEOUT_MS) })

  // 404 is normal — many carriers don't have this endpoint
  if (!res.ok) return []

  const data = await res.json()
  const content = data?.content || {}

  const carrier = content.carrier || content.Carrier || content

  // Liability / BIPD insurance records
  const liabilityRecords: any[] =
    (Array.isArray(carrier.liInsuranceOnFile) && carrier.liInsuranceOnFile.length > 0
      ? carrier.liInsuranceOnFile
      : null) ||
    (Array.isArray(carrier.liabilityInsuranceOnFile) && carrier.liabilityInsuranceOnFile.length > 0
      ? carrier.liabilityInsuranceOnFile
      : null) ||
    (Array.isArray(carrier.insuranceOnFile) && carrier.insuranceOnFile.length > 0
      ? carrier.insuranceOnFile
      : null) ||
    (Array.isArray(carrier.liabilityInsuranceData) && carrier.liabilityInsuranceData.length > 0
      ? carrier.liabilityInsuranceData
      : null) ||
    []

  // Cargo insurance records
  const cargoRecords: any[] =
    (Array.isArray(carrier.cargoInsuranceOnFile) && carrier.cargoInsuranceOnFile.length > 0
      ? carrier.cargoInsuranceOnFile
      : null) ||
    []

  const allRecords = [...liabilityRecords, ...cargoRecords]
  if (allRecords.length === 0) return []

  return allRecords.slice(0, 30).map((h: any) => {
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
      coverageFrom: h.effectiveDate || h.coverageFrom || h.postedDate || null,
      coverageTo: h.cancelledDate || h.cancellationDate || h.coverageTo || null,
      coverageAmount: parseCoverage(
        h.bipdAmount || h.bipdOnFile || h.coverageAmount || h.coverageAmnt
      ),
    }
  })
}

/**
 * Scrape the SAFER website HTML to extract phone and email.
 * The FMCSA JSON API often omits phone/email, but the SAFER HTML page shows them.
 */
async function scrapeSAFERContact(dotNumber: string): Promise<{ phone?: string; email?: string }> {
  try {
    const url = `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnap&query_param=USDOT&query_string=${dotNumber}`
    const res = await fetch(url, { signal: timeoutSignal(API_TIMEOUT_MS) })
    if (!res.ok) return {}

    const html = await res.text()

    // Extract phone: look for "Phone:" label followed by a value in the HTML table
    let phone: string | undefined
    const phoneMatch = html.match(/Phone\s*:\s*<\/th>\s*<td[^>]*>\s*([^<]+)/i)
      || html.match(/Phone\s*:\s*<\/td>\s*<td[^>]*>\s*([^<]+)/i)
      || html.match(/Phone[^<]*<[^>]*>\s*<[^>]*>\s*([(\d][\d\s().-]+\d)/i)
    if (phoneMatch) {
      const raw = phoneMatch[1].trim()
      if (raw && raw.replace(/\D/g, '').length >= 10) {
        phone = raw
      }
    }

    // Extract email: look for mailto links or "Email:" label
    let email: string | undefined
    const emailMatch = html.match(/mailto:([^"'\s>]+)/i)
      || html.match(/Email\s*:\s*<\/th>\s*<td[^>]*>\s*([^<]+)/i)
      || html.match(/Email\s*:\s*<\/td>\s*<td[^>]*>\s*([^<]+)/i)
    if (emailMatch) {
      const raw = emailMatch[1].trim()
      if (raw && raw.includes('@')) {
        email = raw
      }
    }

    return { phone, email }
  } catch {
    // SAFER scrape is best-effort — don't fail the whole lookup
    return {}
  }
}

/**
 * Format a raw phone number string into (XXX) XXX-XXXX.
 */
function formatPhone(phone?: string | number): string | undefined {
  if (!phone && phone !== 0) return undefined
  const str = String(phone)
  const digits = str.replace(/\D/g, '')
  if (!digits) return undefined

  let tenDigits = digits
  if (digits.length === 11 && digits[0] === '1') {
    tenDigits = digits.slice(1)
  }
  if (tenDigits.length === 10) {
    return `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`
  }
  return str
}

function parseCoverage(amount?: string): number | undefined {
  if (!amount) return undefined
  const num = parseFloat(String(amount).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? undefined : num
}

// ─── Demo Data (for development without API key) ───────────────────────────────

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
