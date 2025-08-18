import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import StarRating from './StarRating';

const ReviewList = ({ propertyId, reviews = [], onReviewAdded }) => {
  const [allReviews, setAllReviews] = useState(reviews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllReviews(reviews);
  }, [reviews]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (allReviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 bg-gray-50 rounded-lg">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium mb-2">No reviews yet</p>
        <p className="text-sm mb-4">Be the first to review this property!</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Share your experience with future guests</p>
          <p>• Help hosts improve their properties</p>
          <p>• Build trust in the Nyeri Stays community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allReviews.map((review, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">
                  {review.guestName || 'Anonymous Guest'}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <StarRating
                  rating={review.rating}
                  readonly={true}
                  size={16}
                  showValue={false}
                />
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 