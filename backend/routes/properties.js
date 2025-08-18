const express = require('express');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect, optionalAuth, authorize, checkOwnership } = require('../middleware/auth');
const { uploadPropertyImages } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: { $in: ['active', 'draft'] } }; // Show both active and draft properties

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'location.city': { $regex: req.query.search, $options: 'i' } },
        { 'location.state': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (req.query.city) {
      filter['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    if (req.query.state) {
      filter['location.state'] = { $regex: req.query.state, $options: 'i' };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter['pricing.pricePerNight'] = {};
      if (req.query.minPrice) filter['pricing.pricePerNight'].$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter['pricing.pricePerNight'].$lte = parseFloat(req.query.maxPrice);
    }

    // Filter by property type
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Filter by amenities
    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      filter.amenities = { $all: amenities };
    }

    // Filter by capacity
    if (req.query.guests) {
      filter['capacity.maxGuests'] = { $gte: parseInt(req.query.guests) };
    }

    if (req.query.bedrooms) {
      filter['capacity.bedrooms'] = { $gte: parseInt(req.query.bedrooms) };
    }

    // Filter by rating
    if (req.query.minRating) {
      filter['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { 'pricing.pricePerNight': 1 };
          break;
        case 'price-high':
          sort = { 'pricing.pricePerNight': -1 };
          break;
        case 'rating':
          sort = { 'ratings.average': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Get properties
    const properties = await Property.find(filter)
      .populate('host', 'firstName lastName email profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const properties = await Property.find({ 
      status: 'active', 
      featured: true 
    })
      .populate('host', 'firstName lastName')
      .sort({ 'ratings.average': -1 })
      .limit(limit);

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all properties (Admin only)
// @route   GET /api/properties/admin
// @access  Private (Admin only)
const getAdminProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'location.city': { $regex: req.query.search, $options: 'i' } },
        { 'location.state': { $regex: req.query.search, $options: 'i' } }
      ];
    }


    // Filter by host
    if (req.query.host) {
      filter.host = req.query.host;
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { 'pricing.pricePerNight': 1 };
          break;
        case 'price-high':
          sort = { 'pricing.pricePerNight': -1 };
          break;
        case 'rating':
          sort = { 'ratings.average': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Get properties
    const properties = await Property.find(filter)
      .populate('host', 'firstName lastName email profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: properties
    });
  } catch (error) {
    console.error('Get admin properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'firstName lastName email phone profilePicture');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment views
    await property.incrementViews();

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Hosts only)
const createProperty = async (req, res) => {
  try {
    // Add host to property data
    const propertyData = {
      ...req.body,
      host: req.user.id,
      status: 'active' // Set status to active by default
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Create property error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Property owner or admin)
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'firstName lastName');

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Update property error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Property owner or admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's properties
// @route   GET /api/properties/my-properties
// @access  Private
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user.id })
      .populate('host', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private (Property owner)
const uploadImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to upload images for this property' });
    }

    // Add uploaded images to property
    const newImages = req.uploadedFiles.map((file, index) => ({
      url: file.url,
      caption: `Property image ${index + 1}`,
      isPrimary: index === 0 // First image is primary
    }));

    // Update property with new images
    property.images = [...property.images, ...newImages];
    await property.save();

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: newImages,
        totalImages: property.images.length
      }
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private (Property owner)
const deleteImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete images for this property' });
    }

    // Find the image to delete
    const imageIndex = property.images.findIndex(img => img._id.toString() === req.params.imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove image from array
    const deletedImage = property.images.splice(imageIndex, 1)[0];
    await property.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        deletedImage,
        totalImages: property.images.length
      }
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Private (Admin only)
const getPropertyStats = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          activeProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          averagePrice: { $avg: '$pricing.pricePerNight' },
          averageRating: { $avg: '$ratings.average' }
        }
      }
    ]);

    const typeStats = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...stats[0],
        typeDistribution: typeStats
      }
    });
  } catch (error) {
    console.error('Get property stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get property reviews
// @route   GET /api/properties/:id/reviews
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if property exists
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Get bookings with reviews for this property
    const bookings = await Booking.find({
      property: id,
      'review.rating': { $exists: true }
    })
    .populate('guest', 'firstName lastName profilePicture')
    .sort({ 'review.createdAt': -1 })
    .skip(skip)
    .limit(limit);

    // Transform reviews data
    const reviews = bookings.map(booking => ({
      id: booking._id,
      rating: booking.review.rating,
      comment: booking.review.comment,
      createdAt: booking.review.createdAt,
      guestName: booking.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Anonymous Guest',
      guestPicture: booking.guest?.profilePicture
    }));

    // Get total count for pagination
    const total = await Booking.countDocuments({
      property: id,
      'review.rating': { $exists: true }
    });

    res.json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: reviews
    });
  } catch (error) {
    console.error('Get property reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle property featured status
// @route   PUT /api/properties/:id/featured
// @access  Private (Admin only)
const toggleFeaturedStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Toggle the featured status
    property.featured = !property.featured;
    await property.save();

    console.log(`Property ${property._id} featured status changed to: ${property.featured}`);

    res.json({
      message: `Property ${property.featured ? 'marked as featured' : 'removed from featured'}`,
      property: {
        _id: property._id,
        title: property.title,
        featured: property.featured
      }
    });
  } catch (error) {
    console.error('Toggle featured status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes - Order matters! Specific routes must come before parameterized routes
router.get('/', optionalAuth, getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/admin', protect, authorize('admin'), getAdminProperties);
router.get('/my-properties', protect, getMyProperties);
router.get('/stats', protect, authorize('admin'), getPropertyStats);
router.get('/:id', optionalAuth, getProperty);
router.get('/:id/reviews', getPropertyReviews);

router.post('/', protect, authorize('host', 'admin'), createProperty);
router.post('/:id/images', protect, uploadPropertyImages, uploadImages);
router.delete('/:id/images/:imageId', protect, deleteImage);

router.put('/:id', protect, updateProperty);
router.put('/:id/featured', protect, authorize('admin'), toggleFeaturedStatus);

router.delete('/:id', protect, deleteProperty);

module.exports = router; 