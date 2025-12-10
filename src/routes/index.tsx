import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Droplets,
  Plane,
  MapPin,
  Leaf,
  Plus,
  Settings,
  Globe,
  TrendingUp,
  Search,
  Trash2,
  X,
  Loader2,
  Shield,
  RefreshCw,
} from 'lucide-react'
import {
  POPULAR_CITIES,
  calculateCarbonFootprint,
  hasUserSubmitted,
  markUserAsSubmitted,
  isAdminMode,
  toggleAdminMode,
  generateId,
  calculateTotalFootprint,
  formatCarbonDisplay,
  getCarbonEquivalent,
  resetUserSubmission,
  searchCities,
  type BottleSubmission,
  type GeocodingResult,
} from '../data/carbon-calculator'
import ForestVisualization from '../components/ForestVisualization'

export const Route = createFileRoute('/')({ component: App })

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// API functions for shared storage
async function fetchBottles(): Promise<BottleSubmission[]> {
  try {
    const response = await fetch('/api/bottles')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Error fetching bottles:', error)
    return []
  }
}

async function createBottle(bottle: BottleSubmission): Promise<BottleSubmission | null> {
  try {
    const response = await fetch('/api/bottles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bottle),
    })
    if (!response.ok) throw new Error('Failed to create')
    return await response.json()
  } catch (error) {
    console.error('Error creating bottle:', error)
    return null
  }
}

async function deleteBottle(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/bottles?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    return response.ok
  } catch (error) {
    console.error('Error deleting bottle:', error)
    return false
  }
}

function App() {
  const [submissions, setSubmissions] = useState<BottleSubmission[]>([])
  const [userSubmitted, setUserSubmitted] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Geocoding state
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGeoResult, setSelectedGeoResult] = useState<GeocodingResult | null>(null)

  // Selected from popular cities
  const [selectedCity, setSelectedCity] = useState('')

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Load data on mount
  useEffect(() => {
    setIsClient(true)
    setUserSubmitted(hasUserSubmitted())
    setAdminMode(isAdminMode())

    // Fetch bottles from API
    fetchBottles().then((bottles) => {
      setSubmissions(bottles)
      setIsLoading(false)
    })
  }, [])

  // Refresh bottles periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBottles().then(setSubmissions)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Search for cities when query changes
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setGeocodingResults([])
      return
    }

    // Check if it matches a popular city first
    const matchesPopular = Object.entries(POPULAR_CITIES).some(
      ([city]) => city.toLowerCase() === debouncedSearch.toLowerCase()
    )
    if (matchesPopular) {
      setGeocodingResults([])
      return
    }

    setIsSearching(true)
    searchCities(debouncedSearch)
      .then((results) => {
        setGeocodingResults(results)
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [debouncedSearch])

  // Filter popular cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery) return Object.entries(POPULAR_CITIES)
    const query = searchQuery.toLowerCase()
    return Object.entries(POPULAR_CITIES).filter(
      ([city, data]) =>
        city.toLowerCase().includes(query) ||
        data.country.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Calculate totals
  const totals = useMemo(
    () => calculateTotalFootprint(submissions),
    [submissions]
  )

  // Get the selected location (either from popular cities or geocoding)
  const selectedLocation = useMemo(() => {
    if (selectedGeoResult) {
      return {
        city: selectedGeoResult.city,
        country: selectedGeoResult.country,
        lat: selectedGeoResult.lat,
        lng: selectedGeoResult.lng,
      }
    }
    if (selectedCity && POPULAR_CITIES[selectedCity]) {
      return {
        city: selectedCity,
        country: POPULAR_CITIES[selectedCity].country,
        lat: POPULAR_CITIES[selectedCity].lat,
        lng: POPULAR_CITIES[selectedCity].lng,
      }
    }
    return null
  }, [selectedCity, selectedGeoResult])

  // Handle city selection and submission
  const handleSubmit = useCallback(async () => {
    if (!selectedLocation || isSubmitting) return

    setIsSubmitting(true)

    const footprint = calculateCarbonFootprint(selectedLocation.lat, selectedLocation.lng)

    const submission: BottleSubmission = {
      id: generateId(),
      city: selectedLocation.city,
      country: selectedLocation.country,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      distanceKm: footprint.distanceKm,
      carbonGrams: footprint.carbonGrams,
      submittedAt: new Date().toISOString(),
    }

    const created = await createBottle(submission)

    if (created) {
      setSubmissions([...submissions, created])

      if (!adminMode) {
        markUserAsSubmitted()
        setUserSubmitted(true)
      }

      setSelectedCity('')
      setSelectedGeoResult(null)
      setSearchQuery('')
      setGeocodingResults([])
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }

    setIsSubmitting(false)
  }, [selectedLocation, submissions, adminMode, isSubmitting])

  // Handle deleting a submission (admin only)
  const handleDelete = useCallback(async (id: string) => {
    const success = await deleteBottle(id)
    if (success) {
      setSubmissions(submissions.filter((s) => s.id !== id))
    }
  }, [submissions])

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    const bottles = await fetchBottles()
    setSubmissions(bottles)
    setIsLoading(false)
  }, [])

  // Handle admin mode toggle
  const handleToggleAdmin = useCallback(() => {
    const newAdminMode = toggleAdminMode()
    setAdminMode(newAdminMode)
    if (!newAdminMode) {
      setShowAdminPanel(false)
    }
  }, [])

  // Handle reset user submission
  const handleResetUserSubmission = useCallback(() => {
    resetUserSubmission()
    setUserSubmitted(false)
  }, [])

  // Handle selecting a geocoding result
  const handleSelectGeoResult = useCallback((result: GeocodingResult) => {
    setSelectedGeoResult(result)
    setSelectedCity('')
    setSearchQuery(result.city)
    setGeocodingResults([])
  }, [])

  // Handle selecting a popular city
  const handleSelectPopularCity = useCallback((city: string) => {
    setSelectedCity(city)
    setSelectedGeoResult(null)
    setGeocodingResults([])
  }, [])

  const canSubmit = !userSubmitted || adminMode

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-12 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Droplets className="w-14 h-14 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-black text-white [letter-spacing:-0.04em]">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Bottle Tracker
              </span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-2 font-light">
            Track the carbon footprint of water bottles shipped worldwide
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Every bottle shipped by DHL air freight from Seattle leaves a carbon
            footprint. Add your city to see the environmental impact.
          </p>
        </div>
      </section>

      {/* Admin Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => adminMode ? setShowAdminPanel(!showAdminPanel) : handleToggleAdmin()}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            adminMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
          }`}
          title={adminMode ? 'Admin Panel' : 'Enable Admin Mode'}
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Panel */}
      {adminMode && showAdminPanel && (
        <div className="fixed bottom-16 right-4 z-50 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Panel
            </h3>
            <button
              onClick={() => setShowAdminPanel(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Admin Mode</span>
              <button
                onClick={handleToggleAdmin}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs"
              >
                Disable
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Reset My Submission</span>
              <button
                onClick={handleResetUserSubmission}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Refresh Data</span>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-xs text-gray-500">
                As admin, you can add multiple bottles and delete entries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-6 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <Droplets className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {isClient ? (isLoading ? '...' : totals.totalBottles) : '-'}
            </p>
            <p className="text-gray-400 text-xs">Total Bottles</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <Plane className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {isClient ? (isLoading ? '...' : totals.totalDistanceKm.toLocaleString()) : '-'}
            </p>
            <p className="text-gray-400 text-xs">Total Km</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <Leaf className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {isClient ? (isLoading ? '...' : formatCarbonDisplay(totals.totalCarbonGrams)) : '-'}
            </p>
            <p className="text-gray-400 text-xs">Total CO₂</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">
              {isClient && !isLoading && totals.totalCarbonKg > 0
                ? getCarbonEquivalent(totals.totalCarbonKg)
                : '-'}
            </p>
            <p className="text-gray-400 text-xs">Equivalent</p>
          </div>
        </div>
      </section>

      {/* Forest Visualization Section */}
      <section className="py-6 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Environmental Impact
          </h2>
          {isClient && (
            <ForestVisualization 
              bottleCount={submissions.length} 
              maxTrees={50}
            />
          )}
        </div>
      </section>

      {/* Add City Section */}
      <section className="py-6 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Add Your Bottle's Destination
            </h2>
            {adminMode && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                <Settings className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>

          {!canSubmit && isClient ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg mb-3">
                <Leaf className="w-5 h-5" />
                <span>You've already added your bottle!</span>
              </div>
              <p className="text-gray-400 text-sm">
                Thank you for participating in tracking our carbon footprint.
              </p>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedCity('')
                    setSelectedGeoResult(null)
                  }}
                  placeholder="Search for any city in the world..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Geocoding Results Dropdown */}
              {geocodingResults.length > 0 && (
                <div className="mb-4 bg-slate-700/80 rounded-lg border border-slate-600 overflow-hidden">
                  <p className="px-3 py-2 text-xs text-gray-400 border-b border-slate-600">
                    Search Results
                  </p>
                  {geocodingResults.map((result, index) => (
                    <button
                      key={`${result.lat}-${result.lng}-${index}`}
                      onClick={() => handleSelectGeoResult(result)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-600/50 transition-colors border-b border-slate-600/50 last:border-0"
                    >
                      <p className="text-white text-sm font-medium">{result.city}</p>
                      <p className="text-gray-400 text-xs truncate">{result.displayName}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Cities Label */}
              {filteredCities.length > 0 && !selectedGeoResult && (
                <p className="text-xs text-gray-400 mb-2">
                  {searchQuery ? 'Matching cities' : 'Popular cities'} - or type to search any city
                </p>
              )}

              {/* City Grid */}
              {!selectedGeoResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto mb-4 p-1">
                  {filteredCities.slice(0, 16).map(([city, data]) => (
                    <button
                      key={city}
                      onClick={() => handleSelectPopularCity(city)}
                      className={`p-2 rounded-lg text-left transition-all duration-200 ${
                        selectedCity === city
                          ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border-2 border-transparent'
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{city}</p>
                      <p className="text-xs opacity-70">{data.country}</p>
                    </button>
                  ))}
                </div>
              )}

              {filteredCities.length === 0 && geocodingResults.length === 0 && !isSearching && searchQuery && (
                <p className="text-center text-gray-400 py-4 text-sm">
                  No cities found. Try a different search.
                </p>
              )}

              {/* Selected City Preview */}
              {selectedLocation && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        {selectedLocation.city}, {selectedLocation.country}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Distance from Seattle:{' '}
                        {calculateCarbonFootprint(
                          selectedLocation.lat,
                          selectedLocation.lng
                        ).distanceKm.toLocaleString()}{' '}
                        km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">
                        {formatCarbonDisplay(
                          calculateCarbonFootprint(
                            selectedLocation.lat,
                            selectedLocation.lng
                          ).carbonGrams
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">Carbon Footprint</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedLocation || isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  selectedLocation && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {isSubmitting ? 'Adding...' : 'Add Bottle to Tracker'}
              </button>
            </>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-center">
              <p className="text-emerald-400 font-medium text-sm">
                Bottle added successfully! Thank you for tracking your carbon footprint.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Submissions List */}
      {(submissions.length > 0 || isLoading) && (
        <section className="py-6 px-6 max-w-6xl mx-auto pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Bottles Around the World {!isLoading && `(${submissions.length})`}
            </h2>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {isClient &&
                submissions
                  .slice()
                  .reverse()
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {submission.city}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {submission.country}
                          </p>
                        </div>
                        <div className="text-right flex items-start gap-2">
                          <div>
                            <p className="text-emerald-400 font-bold text-sm">
                              {formatCarbonDisplay(submission.carbonGrams)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {submission.distanceKm.toLocaleString()} km
                            </p>
                          </div>
                          {adminMode && (
                            <button
                              onClick={() => handleDelete(submission.id)}
                              className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete this entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </section>
      )}

      {/* Footer Info */}
      <section className="py-6 px-6 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-xs">
            Carbon calculations based on average DHL air freight emissions
            (~0.55 kg CO₂ per tonne-km) from Seattle, WA.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            City search powered by OpenStreetMap Nominatim.
          </p>
        </div>
      </section>
    </div>
  )
}
