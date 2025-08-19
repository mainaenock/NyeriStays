const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number']
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'cottage', 'cabin', 'lodge', 'farmhouse', 'treehouse', 'other'],
    required: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State/County is required']
    },
    country: {
      type: String,
      default: 'Kenya'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    zipCode: String
  },
  pricing: {
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'KES'
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    weeklyDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    monthlyDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  capacity: {
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative']
    },
    maxGuests: {
      type: Number,
      required: [true, 'Maximum number of guests is required'],
      min: [1, 'Maximum guests must be at least 1']
    },
    beds: {
      type: Number,
      default: 0
    }
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'Heating',
      'Washer', 'Dryer', 'TV', 'Workspace', 'Gym', 'Restaurant', 'Garden',
      'Fireplace', 'Security', 'Safari', 'Fishing', 'Hiking', 'Mountain Views',
      'Nature Walks', 'Bird Watching', 'Farm Tours', 'Historical Tours'
    ]
  }],
  images: {
    type: [{
      url: {
        type: String,
        required: true
      },
      publicId: {  // Add this field for Cloudinary
        type: String,
        required: false
      },
      caption: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    default: []
  },
  rules: {
    checkIn: {
      type: String,
      default: '15:00'
    },
    checkOut: {
      type: String,
      default: '11:00'
    },
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    },
    parties: {
      type: Boolean,
      default: false
    },
    children: {
      type: Boolean,
      default: true
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    minimumStay: {
      type: Number,
      default: 1,
      min: 1
    },
    maximumStay: {
      type: Number,
      default: 30,
      min: 1
    },
    instantBookable: {
      type: Boolean,
      default: false
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    cleanliness: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    checkIn: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    location: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    value: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'suspended'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.state': 1 });
propertySchema.index({ host: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ 'pricing.pricePerNight': 1 });
propertySchema.index({ 'ratings.average': -1 });
propertySchema.index({ createdAt: -1 });

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// Virtual for total price calculation
propertySchema.virtual('totalPrice').get(function() {
  return this.pricing.pricePerNight + this.pricing.cleaningFee + this.pricing.serviceFee;
});

// Method to update average rating
propertySchema.methods.updateAverageRating = function() {
  const ratings = [
    this.ratings.cleanliness,
    this.ratings.communication,
    this.ratings.checkIn,
    this.ratings.accuracy,
    this.ratings.location,
    this.ratings.value
  ].filter(rating => rating > 0);
  
  if (ratings.length > 0) {
    this.ratings.average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }
  
  return this.save();
};

// Method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Pre-save middleware to ensure at least one primary image
propertySchema.pre('save', function(next) {
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema); 