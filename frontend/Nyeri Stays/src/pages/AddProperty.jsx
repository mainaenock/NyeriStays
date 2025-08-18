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
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">
              Add New Property
            </h1>
            <p className="text-lg text-gray-600 mt-2">Create a stunning listing for your property</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Property Details
              </h2>
              <p className="text-green-100 mt-1">Fill in the information below to create your listing</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-10">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-3">
                      Property Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      placeholder="Cozy Mountain Cabin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-3">
                      Property Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
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
                    <label className="block text-sm font-semibold text-green-700 mb-3">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      placeholder="Describe your property in detail..."
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) => handleInputChange('location.address', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="Nyeri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
                      State/County
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.state}
                      onChange={(e) => handleInputChange('location.state', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="Nyeri County"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-700 mb-3">
                      Price per Night (KES)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.pricing.pricePerNight}
                      onChange={(e) => handleInputChange('pricing.pricePerNight', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-700 mb-3">
                      Cleaning Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.cleaningFee}
                      onChange={(e) => handleInputChange('pricing.cleaningFee', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-700 mb-3">
                      Service Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.serviceFee}
                      onChange={(e) => handleInputChange('pricing.serviceFee', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <h2 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Capacity
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-3">
                      Maximum Guests
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.maxGuests}
                      onChange={(e) => handleInputChange('capacity.maxGuests', e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-3">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bedrooms}
                      onChange={(e) => handleInputChange('capacity.bedrooms', e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-3">
                      Beds
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.beds}
                      onChange={(e) => handleInputChange('capacity.beds', e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-3">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bathrooms}
                      onChange={(e) => handleInputChange('capacity.bathrooms', e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                <h2 className="text-xl font-semibold text-teal-800 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenitiesOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'border-green-500 bg-green-100 text-green-800 shadow-lg shadow-green-200'
                            : 'border-teal-300 hover:border-teal-400 bg-white hover:bg-teal-50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-green-600' : 'text-teal-600'}`} />
                        <div className="text-sm font-medium">{amenity.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  House Rules
                </h2>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                      className="flex-1 px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                      placeholder="Add a house rule..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-orange-200"
                    >
                      Add Rule
                    </button>
                  </div>
                  
                  {formData.rules.length > 0 && (
                    <div className="space-y-3">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                          <span className="text-sm text-gray-700">{rule}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                <h2 className="text-xl font-semibold text-pink-800 mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Images
                </h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                      <p className="text-pink-600 font-medium">Click to upload images</p>
                      <p className="text-pink-500 text-sm mt-1">or drag and drop</p>
                    </label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Host Phone Number */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                <h2 className="text-xl font-semibold text-emerald-800 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Information
                </h2>
              <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-3">
                  Host Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.hostPhone || ''}
                  onChange={e => handleInputChange('hostPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                  placeholder="e.g. +254712345678"
                  pattern="^\+?\d{10,15}$"
                />
                </div>
              </div>

              {/* Legal Information */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Important Information for Hosts
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• By listing your property, you agree to our <Link to="/legal" className="text-green-600 hover:text-green-700 underline font-medium">Terms & Conditions</Link></p>
                  <p>• You are responsible for maintaining accurate property information</p>
                  <p>• Nyeri Stays acts as an intermediary between guests and hosts</p>
                  <p>• All properties are subject to verification and approval</p>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/legal" className="text-sm text-green-600 hover:text-green-700 underline font-medium">
                    View full legal information →
                  </Link>
                </div>
              </div>

              {/* Contact Admin Buttons */}
              <AdminContactButtons
                whatsappMessage={`Hello, I want to add a new property: "${formData.title}" located at ${formData.location.address}, ${formData.location.city}, ${formData.location.state}.`}
                className="pt-6"
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/host/dashboard')}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
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