import React from 'react'

const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-32 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full"></div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-20 h-10 sm:w-24 sm:h-12 bg-white rounded-xl"></div>
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-14 h-6 sm:w-16 sm:h-8 bg-green-200 rounded-lg"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-3 sm:p-4 lg:p-5">
        {/* Title skeleton */}
        <div className="h-5 sm:h-6 bg-gray-200 rounded-lg mb-2 sm:mb-3"></div>
        
        {/* Location skeleton */}
        <div className="flex items-center mb-2 sm:mb-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded mr-1.5 sm:mr-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-28 sm:w-32"></div>
        </div>
        
        {/* Rating and capacity skeleton */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-1.5 sm:mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-6 sm:w-8"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16 ml-1"></div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
          </div>
        </div>
        
        {/* Amenities skeleton */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        
        {/* Bottom border skeleton */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCardSkeleton
