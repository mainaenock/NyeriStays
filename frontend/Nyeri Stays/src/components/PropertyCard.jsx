import { useState } from 'react'
import { Heart, MapPin, Wifi, Coffee, Car, Mountain, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { getImageURL } from '../config/env'

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false)

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />
      case 'kitchen':
        return <Coffee size={16} />
      case 'parking':
        return <Car size={16} />
      case 'hiking':
      case 'mountain views':
        return <Mountain size={16} />
      default:
        return <Coffee size={16} />
    }
  }

  return (
    <Link to={`/property/${property._id || property.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={getImageURL(property.images?.[0]?.url || property.image)}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
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
            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110 z-10"
          >
            <Heart
              size={18}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <div className="text-center">
              <span className="font-bold text-lg text-gray-900">
                KES {(property.pricing?.pricePerNight || property.price || 0).toLocaleString()}
              </span>
              <div className="text-gray-600 text-sm">per night</div>
            </div>
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
            {property.type || 'Property'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors text-lg leading-tight line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-2 text-green-600" />
            <span className="text-sm">
              {typeof property.location === 'string' 
                ? property.location 
                : `${property.location?.city || ''}, ${property.location?.state || ''}`
              }
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <StarRating
                rating={property.ratings?.average || property.rating || 0}
                readonly={true}
                size={16}
                showValue={false}
                className="mr-2"
              />
              <span className="font-semibold text-gray-900">{property.ratings?.average || property.rating || 0}</span>
              <span className="text-gray-500 ml-1">({property.ratings?.totalReviews || property.reviews || 0})</span>
            </div>
            
            {/* Capacity */}
            <div className="flex items-center text-gray-600">
              <Users size={16} className="mr-1" />
              <span className="text-sm">{property.capacity?.maxGuests || property.maxGuests || 1} guest{(property.capacity?.maxGuests || property.maxGuests || 1) > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center flex-wrap gap-2">
            {(property.amenities || []).slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                {getAmenityIcon(amenity)}
                <span className="ml-1.5">{amenity}</span>
              </div>
            ))}
            {(property.amenities || []).length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                +{(property.amenities || []).length - 3} more
              </span>
            )}
          </div>

          {/* Hover Effect Indicator */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-green-600 font-medium text-sm">
              <span>View Details</span>
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <div className="w-2 h-2 bg-green-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard 