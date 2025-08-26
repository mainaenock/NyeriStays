import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Calendar, Users, Star, Heart, SlidersHorizontal, X, ArrowRight, Home, TrendingUp, Award } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import PropertyCardSkeleton from '../components/PropertyCardSkeleton'
import { propertiesAPI } from '../services/api'
import { getImageURL } from '../config/env'

const PropertyList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [sortBy, setSortBy] = useState('recommended')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Initialize search from URL parameters
  useEffect(() => {
    const location = searchParams.get('location')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const guests = searchParams.get('guests')
    
    if (location) {
      setSearchQuery(location)
    }
    
    // You can add more URL parameter handling here if needed
    // For now, we'll focus on the location search
  }, [searchParams])

  // Update URL when search changes
  const updateSearchParams = (newSearchQuery) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (newSearchQuery) {
      newSearchParams.set('location', newSearchQuery)
    } else {
      newSearchParams.delete('location')
    }
    setSearchParams(newSearchParams)
  }

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value)
    updateSearchParams(value)
  }

  // Transform property data from backend to frontend format
  const transformProperty = (property) => ({
    id: property._id,
    title: property.title,
    location: `${property.location.city}, ${property.location.state}`,
    price: property.pricing.pricePerNight,
    rating: property.ratings.average || 0,
    reviews: property.ratings.totalReviews || 0,
    // Keep the original images array structure for PropertyCard
    images: property.images || [],
    amenities: property.amenities || [],
    description: property.description,
    type: property.type,
    capacity: property.capacity
  })

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await propertiesAPI.getAll(filters)
      console.log('Properties API response:', response);
      console.log('Properties data:', response.data);
      
      if (response.data && response.data.length > 0) {
        console.log('First property images:', response.data[0].images);
      }
      
      setProperties(response.data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update filters when search/filter values change
  useEffect(() => {
    const newFilters = {}
    
    if (searchQuery) {
      newFilters.search = searchQuery
    }
    
    if (priceRange[1] < 50000) { // Check if max price is not the default max
      newFilters.maxPrice = priceRange[1]
    }
    
    if (selectedAmenities.length > 0) {
      newFilters.amenities = selectedAmenities.join(',')
    }
    
    if (sortBy !== 'recommended') {
      newFilters.sort = sortBy
    }
    
    setFilters(newFilters)
  }, [searchQuery, priceRange, selectedAmenities, sortBy])

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties()
  }, [filters])

  const amenities = ["WiFi", "Kitchen", "Pool", "Parking", "Gym", "Restaurant", "Garden", "Fireplace", "Security", "Safari"]

  // Transform fetched properties for display
  const transformedProperties = properties.map(transformProperty)

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Award size={16} className="fill-green-300" />
                Discover Amazing Places
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect
                <span className="text-green-200"> Stay</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Explore handpicked accommodations in Nyeri and surrounding areas
              </p>
            </div>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Award size={16} className="fill-green-300" />
                Discover Amazing Places
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect
                <span className="text-green-200"> Stay</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Explore handpicked accommodations in Nyeri and surrounding areas
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-4">{error}</h3>
              <button 
                onClick={fetchProperties}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <TrendingUp size={18} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative elements */}
        <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-green-600/20 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-24 h-24 bg-green-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Award size={16} className="fill-green-300" />
              Discover Amazing Places
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="text-green-200"> Stay</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore handpicked accommodations in Nyeri and surrounding areas
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{transformedProperties.length}+</div>
                <div className="text-sm sm:text-base text-green-200">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-sm sm:text-base text-green-200">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">4.9</div>
                <div className="text-sm sm:text-base text-green-200">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm sm:text-base text-green-200">Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </a>
            <span>/</span>
            <span className="text-green-600 font-medium">Properties</span>
          </nav>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Places to stay in Nyeri</h2>
              <p className="text-gray-600">{transformedProperties.length} properties found</p>
              
              {/* Search Parameters Indicator */}
              {(searchQuery || searchParams.get('location')) && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Searching for:</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <MapPin size={12} />
                    {searchQuery || searchParams.get('location')}
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchParams({})
                    }}
                    className="text-green-600 hover:text-green-800 text-xs font-medium underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <SlidersHorizontal size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Home size={16} />
                <span>Nyeri, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-green-600" />
                  Filters
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Mobile Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (KES)</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                      KES {priceRange[0].toLocaleString()}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                      KES {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity])
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                          }
                        }}
                        className="rounded border-2 border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-green-700 transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="recommended">✨ Recommended</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                </select>
              </div>

              {/* Mobile Clear All */}
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange([0, 50000])
                  setSelectedAmenities([])
                  setSortBy('recommended')
                  // Clear URL search parameters
                  setSearchParams({})
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-green-600" />
                  Filters
                </h3>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setPriceRange([0, 50000])
                    setSelectedAmenities([])
                    setSortBy('recommended')
                    // Clear URL search parameters
                    setSearchParams({})
                  }}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (KES)</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                      KES {priceRange[0].toLocaleString()}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                      KES {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                <div className="space-y-3">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity])
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                          }
                        }}
                        className="rounded border-2 border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-green-700 transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="recommended">✨ Recommended</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {transformedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {transformedProperties.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">No properties found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms to find more options.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setPriceRange([0, 50000])
                      setSelectedAmenities([])
                      setSortBy('recommended')
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ArrowRight size={18} />
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyList 