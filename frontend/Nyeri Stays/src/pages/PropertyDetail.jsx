import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, MapPin, Wifi, Coffee, Car, Mountain, Users, Calendar, Share2, ArrowLeft, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { propertiesAPI, bookingsAPI, authAPI } from '../services/api'
import StarRating from '../components/StarRating'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import AdminContactButtons from '../components/AdminContactButtons'
import ImageModal from '../components/ImageModal'
import { getImageURL } from '../config/env'

const PropertyDetail = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Debug state changes
  useEffect(() => {
    console.log('Modal state changed:', { showImageModal, selectedImageIndex });
  }, [showImageModal, selectedImageIndex]);
  // Booking feedback states
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingSuccess(null);
    setBookingError(null);
    try {
      if (!authAPI.isAuthenticated()) {
        setBookingError('You must be logged in to book.');
        setBookingLoading(false);
        return;
      }
      if (!checkIn || !checkOut || !guests) {
        setBookingError('Please select check-in, check-out dates, and number of guests.');
        setBookingLoading(false);
        return;
      }
      const bookingData = {
        propertyId: id,
        checkIn,
        checkOut,
        guests: { adults: guests },
        paymentMethod: 'mpesa', // default, could be extended
      };
      const response = await bookingsAPI.create(bookingData);
      setBookingSuccess('Booking successful! Check your bookings page for details.');
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
    } catch (error) {
      setBookingError(error.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  // Transform property data for display
  const propertyData = property ? {
    id: property._id,
    title: property.title,
    location: `${property.location.city}, ${property.location.state}`,
    price: property.pricing.pricePerNight,
    rating: property.ratings.average || 0,
    reviews: property.ratings.totalReviews || 0,
    host: property.host ? `${property.host.firstName} ${property.host.lastName}` : 'Host',
    description: property.description,
    images: property.images && property.images.length > 0 
      ? property.images.map(img => {
          // Handle both string URLs and object URLs
          const imageUrl = typeof img === 'string' ? img : img.url;
          // Use the helper function to get proper URL
          return getImageURL(imageUrl);
        })
      : [],
    amenities: property.amenities || [],
    bedrooms: property.capacity?.bedrooms || 0,
    bathrooms: property.capacity?.bathrooms || 0,
    maxGuests: property.capacity?.maxGuests || 0
  } : null

  // Fetch property data from API
  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await propertiesAPI.getById(id)
      setProperty(response.data)
    } catch (error) {
      console.error('Error fetching property:', error)
      setError('Failed to load property details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch property reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await propertiesAPI.getReviews(id)
      if (response.success) {
        setReviews(response.data || [])
      } else {
        console.error('Failed to fetch reviews:', response.message)
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  // Fetch user data and bookings
  const fetchUserData = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        const userResponse = await authAPI.getCurrentUser()
        setUser(userResponse.data)
        
        // Fetch user's bookings to check if they can review this property
        const bookingsResponse = await bookingsAPI.getMyBookings()
        setUserBookings(bookingsResponse.data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProperty()
      fetchReviews()
      fetchUserData()
    }
  }, [id])

  // Image navigation functions
  const nextImage = () => {
    if (propertyData?.images && propertyData.images.length > 1) {
      // This function is no longer needed as image modal is removed
      // Keeping it for now in case it's re-introduced later, but it will do nothing
    }
  }

  const prevImage = () => {
    if (propertyData?.images && propertyData.images.length > 1) {
      // This function is no longer needed as image modal is removed
      // Keeping it for now in case it's re-introduced later, but it will do nothing
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !property || !propertyData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
          <Link 
            to="/properties"
            className="px-4 py-2 bg-gradient-to-r from-green-800 to-amber-900 text-white rounded-lg hover:from-green-700 hover:to-amber-800"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={20} />
      case 'kitchen':
        return <Coffee size={20} />
      case 'parking':
        return <Car size={20} />
      case 'pool':
        return <Mountain size={20} />
      default:
        return <Coffee size={20} />
    }
  }

  // Check if user can review this property
  const canUserReview = () => {
    if (!user || !userBookings.length) return false
    
    // Check if user has a completed booking for this property
    const completedBooking = userBookings.find(booking => 
      booking && booking.property && booking.property._id === id && 
      booking.status === 'completed' &&
      !booking.review?.rating // No existing review
    )
    
    return !!completedBooking
  }

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      setReviewLoading(true)
      
      // Find the completed booking for this property
      const completedBooking = userBookings.find(booking => 
        booking && booking.property && booking.property._id === id && booking.status === 'completed'
      )
      
      if (!completedBooking) {
        throw new Error('You can only review properties you have completed stays at')
      }
      
      if (completedBooking.review?.rating) {
        throw new Error('You have already reviewed this property')
      }
      
      // Submit review
      const response = await bookingsAPI.addReview(completedBooking._id, reviewData)
      
      if (response.success) {
        // Show success message
        setReviewSuccess('Review submitted successfully!')
        
        // Clear success message after 5 seconds
        setTimeout(() => setReviewSuccess(''), 5000)
        
        // Refresh reviews and user bookings
        await fetchReviews()
        await fetchUserData()
        
        // Close review form
        setShowReviewForm(false)
      } else {
        throw new Error(response.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error.message || 'Failed to submit review. Please try again.')
    } finally {
      setReviewLoading(false)
    }
  }

  const totalPrice = propertyData.price * 3 // Assuming 3 nights

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-16 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <Link to="/properties" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm sm:text-base">Back to properties</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Image Gallery Container */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Property Photos</h2>
                    <p className="text-sm text-gray-600">Click on any image to view it in full size</p>
                  </div>
                  {propertyData.images && propertyData.images.length > 0 && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {propertyData.images.length} photo{propertyData.images.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
                  {/* Display all images in a grid */}
                  {propertyData.images && propertyData.images.length > 0 ? (
                    propertyData.images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative overflow-hidden rounded-lg bg-gray-100 aspect-square flex items-center justify-center`}
                        style={{ height: '100%' }}
                      >
                        <img
                          src={image}
                          alt={`${propertyData.title} - Photo ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => {
                            console.log('Image clicked:', index);
                            console.log('Setting selectedImageIndex to:', index);
                            console.log('Setting showImageModal to true');
                            setSelectedImageIndex(index);
                            setShowImageModal(true);
                            console.log('State updated, modal should open');
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Hover overlay with zoom icon */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="bg-white bg-opacity-90 rounded-full p-2">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show placeholder if no images
                    <div className="col-span-2 relative overflow-hidden rounded-lg bg-gray-100 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No images available</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Image counter */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  {propertyData.images && propertyData.images.length > 0 ? `${propertyData.images.length} photos available` : 'No photos available'}
                </div>
              </div>
            </div>

            {/* Property Title and Location */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{propertyData.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span className="text-lg">{propertyData.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarRating
                    rating={propertyData.rating}
                    readonly={true}
                    size={18}
                    showValue={false}
                    className="mr-2"
                  />
                  <span className="font-medium text-lg">{propertyData.rating}</span>
                  <span className="text-gray-600 ml-2 text-lg">({propertyData.reviews} reviews)</span>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart size={24} className={isLiked ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
                  <div className="font-semibold text-xl">{propertyData.bedrooms}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Bathrooms</div>
                  <div className="font-semibold text-xl">{propertyData.bathrooms}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Max Guests</div>
                  <div className="font-semibold text-xl">{propertyData.maxGuests}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-xl capitalize">{property.type}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{propertyData.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    {getAmenityIcon(amenity)}
                    <span className="ml-3 text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Reviews</h2>
                  <div className="flex items-center">
                    <StarRating
                      rating={propertyData.rating}
                      readonly={true}
                      size={20}
                      showValue={true}
                      className="mr-2"
                    />
                    <span className="text-gray-600">({propertyData.reviews} reviews)</span>
                  </div>
                </div>
                
                {/* Review Button */}
                {authAPI.isAuthenticated() && canUserReview() && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-800 to-amber-900 text-white rounded-lg font-medium hover:from-green-700 hover:to-amber-800 transition-all duration-200"
                  >
                    Write a Review
                  </button>
                )}
                
                {/* Show message if user can't review */}
                {authAPI.isAuthenticated() && !canUserReview() && userBookings.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {userBookings.find(b => b && b.property && b.property._id === id)?.status === 'completed' 
                      ? 'You have already reviewed this property'
                      : 'You can review after completing your stay'
                    }
                  </div>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                    loading={reviewLoading}
                  />
                </div>
              )}

              {/* Success Message */}
              {reviewSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">{reviewSuccess}</span>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : (
                <ReviewList
                  propertyId={id}
                  reviews={reviews}
                  onReviewAdded={fetchReviews}
                />
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">KES {propertyData.price?.toLocaleString()}</span>
                    <span className="text-gray-600 text-lg"> / night</span>
                  </div>
                  <div className="flex items-center">
                    <StarRating
                      rating={propertyData.rating}
                      readonly={true}
                      size={18}
                      showValue={false}
                      className="mr-1"
                    />
                    <span className="font-medium">{propertyData.rating}</span>
                    <span className="text-gray-600 ml-1">({propertyData.reviews})</span>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleBookingSubmit}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {[...Array(propertyData.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-xl transform hover:scale-105 group flex items-center justify-center gap-2"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Reserve Now</span>
                      </>
                    )}
                  </button>
                    {/* Contact Admin Buttons */}
                    <AdminContactButtons
                      whatsappMessage={`Hello, I'm interested in the property \"${propertyData.title}\" for ${guests} guest(s) from ${checkIn} to ${checkOut}.`}
                      className="pt-4"
                    />
                  {bookingSuccess && (
                    <div className="mt-4 text-green-700 bg-green-100 rounded-lg px-4 py-2 text-center">{bookingSuccess}</div>
                  )}
                  {bookingError && (
                    <div className="mt-4 text-red-700 bg-red-100 rounded-lg px-4 py-2 text-center">{bookingError}</div>
                  )}
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  You won't be charged yet
                </div>

                {/* Legal Information */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-green-600" />
                    Important Booking Information
                  </h4>
                  <div className="text-xs text-gray-600 space-y-2">
                    <p>• By booking, you agree to our <Link to="/legal" className="text-green-600 hover:text-green-700 underline">Terms & Conditions</Link></p>
                    <p>• Cancellation policies vary by property - check listing details</p>
                    <p>• Prices include applicable taxes unless stated otherwise</p>
                    <p>• Nyeri Stays acts as an intermediary between guests and hosts</p>
                  </div>
                  <div className="mt-3 text-center">
                    <Link to="/legal" className="text-xs text-green-600 hover:text-green-700 underline">
                      View full legal information →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Image Modal */}
      {console.log('Modal render check:', { showImageModal, selectedImageIndex, hasImages: propertyData?.images?.length })}
      {showImageModal && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2>Test Modal - Image {selectedImageIndex + 1}</h2>
            <p>Modal is working!</p>
            <button 
              onClick={() => setShowImageModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail 