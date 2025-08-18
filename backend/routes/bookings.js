const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      paymentMethod
    } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if property is available
    const isAvailable = await Booking.checkAvailability(propertyId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Property is not available for the selected dates' });
    }

    // Calculate pricing
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const subtotal = property.pricing.pricePerNight * totalNights;
    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee = property.pricing.serviceFee || 0;
    const total = subtotal + cleaningFee + serviceFee;


    // Generate unique booking code
    const generateBookingCode = async () => {
      try {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        let isUnique = false;
        
        while (!isUnique) {
          code = '';
          for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          // Check if code already exists
          const existingBooking = await Booking.findOne({ bookingCode: code });
          if (!existingBooking) {
            isUnique = true;
          }
        }
        
        console.log('Generated booking code:', code);
        return code;
      } catch (error) {
        console.error('Error generating booking code:', error);
        // Fallback: generate a simple code with timestamp
        const fallbackCode = 'BK' + Date.now().toString().slice(-6);
        console.log('Using fallback booking code:', fallbackCode);
        return fallbackCode;
      }
    };

    // Generate booking code before creating the booking
    const bookingCode = await generateBookingCode();
    console.log('Booking code to be used:', bookingCode);
    
    if (!bookingCode) {
      throw new Error('Failed to generate booking code');
    }

    // Create booking with the generated booking code
    const booking = new Booking({
      property: propertyId,
      guest: req.user.id,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      pricing: {
        pricePerNight: property.pricing.pricePerNight,
        totalNights,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
        currency: property.pricing.currency
      },
      specialRequests,
      paymentMethod,
      isInstantBook: property.availability.instantBookable,
      bookingCode: bookingCode
    });
    
    // Save the booking
    await booking.save();

    // Populate booking with property and user details
    await booking.populate([
      { path: 'property', select: 'title location images pricing' },
      { path: 'host', select: 'firstName lastName email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { guest: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get bookings
    const bookings = await Booking.find(filter)
      .populate('property', 'title location images pricing')
      .populate('host', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get host's bookings (bookings for properties owned by host)
// @route   GET /api/bookings/host
// @access  Private (Hosts only)
const getHostBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { host: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get bookings
    const bookings = await Booking.find(filter)
      .populate('property', 'title location images')
      .populate('guest', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: bookings
    });
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title location images pricing rules')
      .populate('guest', 'firstName lastName email phone')
      .populate('host', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (booking.guest.toString() !== req.user.id && 
        booking.host.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status (host only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Hosts only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, hostNotes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the host
    if (booking.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Ensure booking has a bookingCode (for existing bookings created before the fix)
    if (!booking.bookingCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      booking.bookingCode = code;
      console.log('Generated bookingCode for existing booking:', code);
    }

    // Update booking
    booking.status = status;
    if (hostNotes) {
      booking.hostNotes = hostNotes;
    }

    await booking.save();

    // Populate booking details
    await booking.populate([
      { path: 'property', select: 'title location images' },
      { path: 'guest', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can cancel this booking
    if (booking.guest.toString() !== req.user.id && 
        booking.host.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({ message: 'Booking cannot be cancelled at this time' });
    }

    // Calculate refund
    const refundAmount = booking.calculateRefund();

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancellationDate = new Date();
    booking.refundAmount = refundAmount;

    if (refundAmount > 0) {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review to booking
// @route   POST /api/bookings/:id/review
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the guest
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the guest can add a review' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    if (booking.review.rating) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Add review
    booking.review = {
      rating,
      comment,
      createdAt: new Date()
    };

    await booking.save();

    // Update property ratings
    const property = await Property.findById(booking.property);
    if (property) {
      // Calculate new average rating
      const allBookings = await Booking.find({ 
        property: booking.property, 
        'review.rating': { $exists: true } 
      });
      
      const totalRating = allBookings.reduce((sum, b) => sum + b.review.rating, 0);
      const averageRating = totalRating / allBookings.length;
      
      property.ratings.average = averageRating;
      property.ratings.totalReviews = allBookings.length;
      await property.save();
    }

    res.json({
      success: true,
      message: 'Review added successfully',
      data: booking
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check property availability
// @route   GET /api/bookings/availability/:propertyId
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const { propertyId } = req.params;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const isAvailable = await Booking.checkAvailability(propertyId, checkIn, checkOut);

    res.json({
      success: true,
      data: {
        propertyId,
        checkIn,
        checkOut,
        isAvailable
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin only)
const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        ...stats[0],
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin
// @access  Private (Admin only)
const getAdminBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search by booking code or guest name
    if (req.query.search) {
      filter.$or = [
        { bookingCode: { $regex: req.query.search, $options: 'i' } },
        { 'guest.firstName': { $regex: req.query.search, $options: 'i' } },
        { 'guest.lastName': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      if (filter.createdAt) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      } else {
        filter.createdAt = { $lte: new Date(req.query.endDate) };
      }
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'amount-high':
          sort = { 'pricing.total': -1 };
          break;
        case 'amount-low':
          sort = { 'pricing.total': 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Get bookings
    const bookings = await Booking.find(filter)
      .populate('guest', 'firstName lastName email profilePicture')
      .populate('host', 'firstName lastName email')
      .populate('property', 'title location images')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: bookings
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes - Order matters! Specific routes must come before parameterized routes
router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.get('/admin', protect, authorize('admin'), getAdminBookings);
router.get('/host', protect, authorize('host', 'admin'), getHostBookings);
router.get('/stats', protect, authorize('admin'), getBookingStats);
router.get('/availability/:propertyId', checkAvailability);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, authorize('host', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/review', protect, addReview);

module.exports = router; 