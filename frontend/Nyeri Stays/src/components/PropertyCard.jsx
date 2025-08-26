import { useState, useEffect } from 'react'
import { Heart, MapPin, Wifi, Coffee, Car, Mountain, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { getImageURL } from '../config/env'

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false)

  // Debug logging to see property structure
  useEffect(() => {
    console.log('PropertyCard received property:', {
      id: property._id || property.id,
      title: property.title,
      images: property.images,
      image: property.image,
      'images[0]?.url': property.images?.[0]?.url
    });
  }, [property]);

  // Helper function to get the best available image
  const getBestImage = () => {
    // Try to get image from images array first
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      if (typeof firstImage === 'string') {
        return getImageURL(firstImage);
      }
      if (firstImage && firstImage.url) {
        return getImageURL(firstImage.url);
      }
    }
    
    // Fallback to property.image
    if (property.image) {
      return getImageURL(property.image);
    }
    
    // Default placeholder
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={14} />
      case 'kitchen':
        return <Coffee size={14} />
      case 'parking':
        return <Car size={14} />
      case 'hiking':
      case 'mountain views':
        return <Mountain size={14} />
      default:
        return <Coffee size={14} />
    }
  }

  return (
    <Link to={`/property/${property._id || property.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-32 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
          <img
            src={getBestImage()}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              console.log('Image failed to load for property:', property.title);
              console.log('Attempted image URL:', e.target.src);
              console.log('Property images data:', property.images);
              e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110 z-10"
          >
            <Heart
              size={16}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Price Badge */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/70 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-white/30">
            <div className="text-center">
              <span className="font-bold text-xs sm:text-sm text-gray-900">
                KES {(property.pricing?.pricePerNight || property.price || 0).toLocaleString()}
              </span>
              <div className="text-gray-600 text-xs">per night</div>
            </div>
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium shadow-lg">
            {property.type || 'Property'}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-5">
          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-700 transition-colors text-xs sm:text-sm lg:text-base leading-tight line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
            <MapPin size={14} className="mr-1.5 sm:mr-2 text-green-600" />
            <span className="text-xs">
              {typeof property.location === 'string' 
                ? property.location 
                : `${property.location?.city || ''}, ${property.location?.state || ''}`
              }
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center">
              <StarRating
                rating={property.ratings?.average || property.rating || 0}
                readonly={true}
                size={14}
                showValue={false}
                className="mr-1.5 sm:mr-2"
              />
              <span className="font-semibold text-gray-900 text-xs">{property.ratings?.average || property.rating || 0}</span>
              <span className="text-gray-500 ml-1 text-xs">({property.ratings?.totalReviews || property.reviews || 0})</span>
            </div>
            
            {/* Capacity */}
            <div className="flex items-center text-gray-600">
              <Users size={14} className="mr-1" />
              <span className="text-xs">{property.capacity?.maxGuests || property.maxGuests || 1} guest{(property.capacity?.maxGuests || property.maxGuests || 1) > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {(property.amenities || []).slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center justify-center bg-green-50 text-green-700 w-8 h-8 sm:w-10 sm:h-10 rounded-lg">
                {getAmenityIcon(amenity)}
              </div>
            ))}
            {(property.amenities || []).length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                +{(property.amenities || []).length - 3} more
              </span>
            )}
          </div>

          {/* Hover Effect Indicator */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-green-600 font-medium text-xs">
              <span>View Details</span>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard 