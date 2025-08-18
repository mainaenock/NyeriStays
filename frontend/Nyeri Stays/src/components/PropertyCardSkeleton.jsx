import React from 'react'

const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-12 bg-white rounded-xl"></div>
        <div className="absolute top-4 left-4 w-16 h-8 bg-green-200 rounded-lg"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-5">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
        
        {/* Location skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        
        {/* Rating and capacity skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-16 ml-1"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        {/* Amenities skeleton */}
        <div className="flex items-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-20 h-8 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        
        {/* Bottom border skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCardSkeleton
