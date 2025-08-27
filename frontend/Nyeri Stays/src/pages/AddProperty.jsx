import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee,
  ChefHat,
  Tv,
  AirVent,
  Plus,
  X,
  Shield,
  Camera,
  FileText,
  Star
} from 'lucide-react';
import { propertiesAPI } from '../services/api';
import HostNavbar from '../components/HostNavbar';
import AdminContactButtons from '../components/AdminContactButtons';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Kenya'
    },
    pricing: {
      pricePerNight: '',
      cleaningFee: '',
      serviceFee: ''
    },
    capacity: {
      maxGuests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: [],
    rules: [],
    images: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');

  const amenitiesOptions = [
    { id: 'WiFi', label: 'WiFi', icon: Wifi },
    { id: 'Parking', label: 'Free Parking', icon: Car },
    { id: 'Kitchen', label: 'Kitchen', icon: ChefHat },
    { id: 'TV', label: 'TV', icon: Tv },
    { id: 'Air Conditioning', label: 'Air Conditioning', icon: AirVent },
    { id: 'Gym', label: 'Gym', icon: Home },
    { id: 'Pool', label: 'Swimming Pool', icon: Home },
    { id: 'Garden', label: 'Garden', icon: Home },
    { id: 'Fireplace', label: 'Fireplace', icon: Home },
    { id: 'Security', label: 'Security', icon: Home }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create property first - exclude images from initial creation
      const { images, ...propertyDataWithoutImages } = formData;
      
      const propertyData = {
        ...propertyDataWithoutImages,
        pricing: {
          pricePerNight: parseFloat(formData.pricing.pricePerNight),
          cleaningFee: parseFloat(formData.pricing.cleaningFee) || 0,
          serviceFee: parseFloat(formData.pricing.serviceFee) || 0
        },
        capacity: {
          maxGuests: parseInt(formData.capacity.maxGuests),
          bedrooms: parseInt(formData.capacity.bedrooms),
          beds: parseInt(formData.capacity.beds),
          bathrooms: parseInt(formData.capacity.bathrooms)
        }
      };

      const response = await propertiesAPI.create(propertyData);

      // Upload images if any
      if (formData.images.length > 0) {
        await propertiesAPI.uploadImages(response.data._id, formData.images);
      }

      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
      setError(error.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <HostNavbar />
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-3 sm:mb-4">
              <Home className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">
              Add New Property
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-2">Create a stunning listing for your property</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-green-100 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Property Details
              </h2>
              <p className="text-green-100 mt-1 text-sm sm:text-base">Fill in the information below to create your listing</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-r-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Error</span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Property Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="Cozy Mountain Cabin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Property Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="cottage">Cottage</option>
                      <option value="cabin">Cabin</option>
                      <option value="lodge">Lodge</option>
                      <option value="farmhouse">Farmhouse</option>
                      <option value="treehouse">Treehouse</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="Describe your property in detail..."
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) => handleInputChange('location.address', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="Nyeri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      State/County
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.state}
                      onChange={(e) => handleInputChange('location.state', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="Nyeri County"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                  Pricing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Price per Night (KES)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.pricing.pricePerNight}
                      onChange={(e) => handleInputChange('pricing.pricePerNight', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Cleaning Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.cleaningFee}
                      onChange={(e) => handleInputChange('pricing.cleaningFee', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="1000"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Service Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.serviceFee}
                      onChange={(e) => handleInputChange('pricing.serviceFee', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Capacity
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Maximum Guests
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.maxGuests}
                      onChange={(e) => handleInputChange('capacity.maxGuests', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bedrooms}
                      onChange={(e) => handleInputChange('capacity.bedrooms', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Beds
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.beds}
                      onChange={(e) => handleInputChange('capacity.beds', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bathrooms}
                      onChange={(e) => handleInputChange('capacity.bathrooms', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {amenitiesOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'border-green-500 bg-green-100 text-green-800 shadow-lg shadow-green-200'
                            : 'border-green-300 hover:border-green-400 bg-white hover:bg-green-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-2 ${isSelected ? 'text-green-600' : 'text-green-600'}`} />
                        <div className="text-xs sm:text-sm font-medium">{amenity.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  House Rules
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                      placeholder="Add a house rule..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg shadow-green-200 text-sm sm:text-base whitespace-nowrap"
                    >
                      Add Rule
                    </button>
                  </div>
                  
                  {formData.rules.length > 0 && (
                    <div className="space-y-3">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                          <span className="text-xs sm:text-sm text-gray-700 pr-2">{rule}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                          >
                            <X size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  Images
                </h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-green-600 font-medium text-sm sm:text-base">Click to upload images</p>
                      <p className="text-green-500 text-xs sm:text-sm mt-1">or drag and drop</p>
                    </label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={10} className="sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Host Phone Number */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                    Host Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.hostPhone || ''}
                    onChange={e => handleInputChange('hostPhone', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    placeholder="e.g. +254712345678"
                    pattern="^\+?\d{10,15}$"
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
                <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Important Information for Hosts
                </h4>
                <div className="text-xs sm:text-sm text-green-700 space-y-2">
                  <p>• By listing your property, you agree to our <Link to="/legal" className="text-green-600 hover:text-green-700 underline font-medium">Terms & Conditions</Link></p>
                  <p>• You are responsible for maintaining accurate property information</p>
                  <p>• Nyeri Stays acts as an intermediary between guests and hosts</p>
                  <p>• All properties are subject to verification and approval</p>
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <Link to="/legal" className="text-xs sm:text-sm text-green-600 hover:text-green-700 underline font-medium">
                    View full legal information →
                  </Link>
                </div>
              </div>

              {/* Contact Admin Buttons */}
              <AdminContactButtons
                whatsappMessage={`Hello, I want to add a new property: "${formData.title}" located at ${formData.location.address}, ${formData.location.city}, ${formData.location.state}.`}
                className="pt-4 sm:pt-6"
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-green-200">
                <button
                  type="button"
                  onClick={() => navigate('/host/dashboard')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Property...
                    </div>
                  ) : (
                    'Create Property'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty; 