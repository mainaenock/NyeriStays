const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  pricing: {
    pricePerNight: {
      type: Number,
      required: true
    },
    totalNights: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank_transfer', 'cash'],
    default: 'mpesa'
  },
  paymentId: String,
  specialRequests: {
    type: String,
    maxlength: 500
  },
  cancellationReason: String,
  cancellationDate: Date,
  refundAmount: Number,
  hostNotes: String,
  guestNotes: String,
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: Date
  },
  isInstantBook: {
    type: Boolean,
    default: false
  },
  bookingCode: {
    type: String,
    unique: true,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ host: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingCode: 1 });

// Generate booking code function
const generateBookingCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code already exists
    const existingBooking = await mongoose.model('Booking').findOne({ bookingCode: code });
    if (!existingBooking) {
      isUnique = true;
    }
  }
  
  return code;
};

// Generate unique booking code
bookingSchema.pre('save', async function() {
  if (!this.bookingCode) {
    this.bookingCode = await generateBookingCode();
  }
});

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
  return this.guests.adults + this.guests.children + this.guests.infants;
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.checkOut - this.checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const checkInDate = new Date(this.checkIn);
  const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
  
  // Can cancel if more than 24 hours before check-in
  return daysUntilCheckIn > 1 && this.status === 'confirmed';
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canBeCancelled()) {
    return 0;
  }
  
  const now = new Date();
  const checkInDate = new Date(this.checkIn);
  const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
  
  // Full refund if more than 7 days before check-in
  if (daysUntilCheckIn > 7) {
    return this.pricing.total;
  }
  
  // 50% refund if 2-7 days before check-in
  if (daysUntilCheckIn > 1) {
    return this.pricing.total * 0.5;
  }
  
  return 0;
};

// Static method to check property availability
bookingSchema.statics.checkAvailability = async function(propertyId, checkIn, checkOut) {
  const conflictingBookings = await this.find({
    property: propertyId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  });
  
  return conflictingBookings.length === 0;
};

// Static method to get property bookings
bookingSchema.statics.getPropertyBookings = async function(propertyId, startDate, endDate) {
  return await this.find({
    property: propertyId,
    checkIn: { $gte: startDate },
    checkOut: { $lte: endDate }
  }).populate('guest', 'firstName lastName email');
};

module.exports = mongoose.model('Booking', bookingSchema); 