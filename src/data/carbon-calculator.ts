// Seattle coordinates (origin for all shipments)
export const SEATTLE_COORDS = {
  lat: 47.6062,
  lng: -122.3321,
}

// Average CO2 emissions for air freight in kg per tonne-km
// Source: IPCC estimates for air cargo ~0.5-0.6 kg CO2 per tonne-km
// We'll use 0.55 kg CO2 per tonne-km as average
export const AIR_FREIGHT_CO2_PER_TONNE_KM = 0.55

// Average water bottle weight in kg (500ml plastic bottle)
export const BOTTLE_WEIGHT_KG = 0.025

// Popular city coordinates for autocomplete/suggestions
export const POPULAR_CITIES: Record<string, { lat: number; lng: number; country: string }> = {
  'New York': { lat: 40.7128, lng: -74.006, country: 'USA' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'USA' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'USA' },
  'Miami': { lat: 25.7617, lng: -80.1918, country: 'USA' },
  'London': { lat: 51.5074, lng: -0.1278, country: 'UK' },
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'Berlin': { lat: 52.52, lng: 13.405, country: 'Germany' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'Singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  'Dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
  'Mumbai': { lat: 19.076, lng: 72.8777, country: 'India' },
  'São Paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  'Toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada' },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  'Stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, country: 'China' },
  'Seoul': { lat: 37.5665, lng: 126.978, country: 'South Korea' },
  'Mexico City': { lat: 19.4326, lng: -99.1332, country: 'Mexico' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  'Moscow': { lat: 55.7558, lng: 37.6173, country: 'Russia' },
  'Beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'Cairo': { lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816, country: 'Argentina' },
  'Lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  'Jakarta': { lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
  'Manila': { lat: 14.5995, lng: 120.9842, country: 'Philippines' },
  'Bangkok': { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  'Johannesburg': { lat: -26.2041, lng: 28.0473, country: 'South Africa' },
  'Nairobi': { lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  'Tel Aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
  'Dublin': { lat: 53.3498, lng: -6.2603, country: 'Ireland' },
  'Zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  'Vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
  'Prague': { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
  'Warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
  'Athens': { lat: 37.9838, lng: 23.7275, country: 'Greece' },
  'Rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  'Madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
  'Barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain' },
  'Lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  'Brussels': { lat: 50.8503, lng: 4.3517, country: 'Belgium' },
  'Copenhagen': { lat: 55.6761, lng: 12.5683, country: 'Denmark' },
  'Oslo': { lat: 59.9139, lng: 10.7522, country: 'Norway' },
  'Helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
  'Reykjavik': { lat: 64.1466, lng: -21.9426, country: 'Iceland' },
  'Auckland': { lat: -36.8485, lng: 174.7633, country: 'New Zealand' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, country: 'Canada' },
  'Montreal': { lat: 45.5017, lng: -73.5673, country: 'Canada' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, country: 'USA' },
  'Boston': { lat: 42.3601, lng: -71.0589, country: 'USA' },
  'Denver': { lat: 39.7392, lng: -104.9903, country: 'USA' },
  'Atlanta': { lat: 33.749, lng: -84.388, country: 'USA' },
  'Houston': { lat: 29.7604, lng: -95.3698, country: 'USA' },
  'Dallas': { lat: 32.7767, lng: -96.797, country: 'USA' },
  'Phoenix': { lat: 33.4484, lng: -112.074, country: 'USA' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, country: 'USA' },
  'Washington DC': { lat: 38.9072, lng: -77.0369, country: 'USA' },
  'Seattle': { lat: 47.6062, lng: -122.3321, country: 'USA' },
  'Kuala Lumpur': { lat: 3.139, lng: 101.6869, country: 'Malaysia' },
  'Taipei': { lat: 25.033, lng: 121.5654, country: 'Taiwan' },
  'Doha': { lat: 25.2854, lng: 51.531, country: 'Qatar' },
  'Riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Calculate carbon footprint for shipping a water bottle from Seattle to a destination
export function calculateCarbonFootprint(destLat: number, destLng: number): {
  distanceKm: number
  carbonKg: number
  carbonGrams: number
} {
  const distanceKm = calculateDistance(
    SEATTLE_COORDS.lat,
    SEATTLE_COORDS.lng,
    destLat,
    destLng
  )

  // Convert bottle weight to tonnes for calculation
  const bottleWeightTonnes = BOTTLE_WEIGHT_KG / 1000

  // Calculate CO2 emissions: distance * weight in tonnes * emission factor
  const carbonKg = distanceKm * bottleWeightTonnes * AIR_FREIGHT_CO2_PER_TONNE_KM

  return {
    distanceKm: Math.round(distanceKm),
    carbonKg,
    carbonGrams: carbonKg * 1000,
  }
}

// Bottle submission type
export interface BottleSubmission {
  id: string
  city: string
  country: string
  lat: number
  lng: number
  distanceKm: number
  carbonGrams: number
  submittedAt: string
}

// Local storage keys (for user preferences, not shared data)
export const STORAGE_KEYS = {
  USER_SUBMITTED: 'bottle_tracker_user_submitted',
  USER_SUBMISSION_COUNT: 'bottle_tracker_submission_count',
  ADMIN_MODE: 'bottle_tracker_admin_mode',
}

// Maximum bottles a user can submit
export const MAX_USER_SUBMISSIONS = 5

// Get user's submission count
export function getUserSubmissionCount(): number {
  if (typeof window === 'undefined') return 0
  const count = localStorage.getItem(STORAGE_KEYS.USER_SUBMISSION_COUNT)
  return count ? parseInt(count, 10) : 0
}

// Check if user has reached their submission limit
export function hasUserReachedLimit(): boolean {
  return getUserSubmissionCount() >= MAX_USER_SUBMISSIONS
}

// Check if user has already submitted (legacy - now checks if reached limit)
export function hasUserSubmitted(): boolean {
  return hasUserReachedLimit()
}

// Increment user submission count
export function incrementSubmissionCount(): number {
  const currentCount = getUserSubmissionCount()
  const newCount = currentCount + 1
  localStorage.setItem(STORAGE_KEYS.USER_SUBMISSION_COUNT, String(newCount))
  return newCount
}

// Mark user as having submitted (legacy - now increments count)
export function markUserAsSubmitted(): void {
  incrementSubmissionCount()
}

// Check if admin mode is enabled
export function isAdminMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.ADMIN_MODE) === 'true'
}

// Toggle admin mode
export function toggleAdminMode(): boolean {
  const newValue = !isAdminMode()
  localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(newValue))
  return newValue
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

// Calculate total carbon footprint from all submissions
export function calculateTotalFootprint(submissions: BottleSubmission[]): {
  totalBottles: number
  totalDistanceKm: number
  totalCarbonGrams: number
  totalCarbonKg: number
} {
  return submissions.reduce(
    (acc, sub) => ({
      totalBottles: acc.totalBottles + 1,
      totalDistanceKm: acc.totalDistanceKm + sub.distanceKm,
      totalCarbonGrams: acc.totalCarbonGrams + sub.carbonGrams,
      totalCarbonKg: acc.totalCarbonKg + sub.carbonGrams / 1000,
    }),
    { totalBottles: 0, totalDistanceKm: 0, totalCarbonGrams: 0, totalCarbonKg: 0 }
  )
}

// Format carbon footprint for display
export function formatCarbonDisplay(carbonGrams: number): string {
  if (carbonGrams >= 1000) {
    return `${(carbonGrams / 1000).toFixed(2)} kg CO₂`
  }
  return `${carbonGrams.toFixed(2)} g CO₂`
}

// Get equivalents for carbon footprint (for context)
export function getCarbonEquivalent(carbonKg: number): string {
  // 1 kg CO2 ≈ driving ~4 km in average car
  const drivingKm = carbonKg * 4
  if (drivingKm < 1) {
    return `driving ${(drivingKm * 1000).toFixed(0)} meters`
  }
  if (drivingKm < 100) {
    return `driving ${drivingKm.toFixed(1)} km`
  }
  return `driving ${Math.round(drivingKm)} km`
}

// Clear user submission flag (allow them to submit again)
export function resetUserSubmission(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_SUBMITTED)
  localStorage.removeItem(STORAGE_KEYS.USER_SUBMISSION_COUNT)
}

// Geocoding result type
export interface GeocodingResult {
  city: string
  country: string
  lat: number
  lng: number
  displayName: string
}

// Search for cities using Nominatim (OpenStreetMap) API
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '8',
          featuretype: 'city',
        }),
      {
        headers: {
          'User-Agent': 'Bottle-Tracker/1.0',
        },
      }
    )

    if (!response.ok) return []

    const data = await response.json()

    return data
      .filter((item: Record<string, unknown>) => {
        // Filter for places that are cities/towns
        const type = item.type as string
        return ['city', 'town', 'village', 'municipality', 'administrative'].includes(type)
      })
      .map((item: Record<string, unknown>) => {
        const address = item.address as Record<string, string> | undefined
        const city =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          (item.name as string) ||
          ''
        const country = address?.country || ''

        return {
          city,
          country,
          lat: parseFloat(item.lat as string),
          lng: parseFloat(item.lon as string),
          displayName: item.display_name as string,
        }
      })
  } catch (error) {
    console.error('Geocoding error:', error)
    return []
  }
}

