import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Save
} from 'lucide-react';
import { propertiesAPI } from '../services/api';
import HostNavbar from '../components/HostNavbar';

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
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

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertiesAPI.getById(id);
      const property = response.data;
      
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'house',
        location: {
          address: property.location?.address || '',
          city: property.location?.city || '',
          state: property.location?.state || '',
          zipCode: property.location?.zipCode || '',
          country: property.location?.country || 'Kenya'
        },
        pricing: {
          pricePerNight: property.pricing?.pricePerNight?.toString() || '',
          cleaningFee: property.pricing?.cleaningFee?.toString() || '',
          serviceFee: property.pricing?.serviceFee?.toString() || ''
        },
        capacity: {
          maxGuests: property.capacity?.maxGuests || 1,
          bedrooms: property.capacity?.bedrooms || 1,
          beds: property.capacity?.beds || 1,
          bathrooms: property.capacity?.bathrooms || 1
        },
        amenities: property.amenities || [],
        rules: property.rules || [],
        images: property.images || []
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setUploadingImages(true);
    
    // Add files to form data for preview
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Upload images to backend
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      await propertiesAPI.uploadImages(id, formData);
      
      // Refresh property data to get updated images
      const response = await propertiesAPI.getById(id);
      const updatedProperty = response.data;
      
      setFormData(prev => ({
        ...prev,
        images: updatedProperty.images || []
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = formData.images[index];
    
    // If it's a new file (not uploaded yet), just remove from state
    if (imageToRemove instanceof File) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      return;
    }

    // If it's an uploaded image, delete from backend
    try {
      await propertiesAPI.deleteImage(id, imageToRemove._id);
      
      // Remove from state
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const propertyData = {
        ...formData,
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

      await propertiesAPI.update(id, propertyData);
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error updating property:', error);
      setError(error.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/host/dashboard')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostNavbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600">Update your property information</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cozy Mountain Cabin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your property..."
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) => handleInputChange('location.address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nyeri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/County
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.state}
                      onChange={(e) => handleInputChange('location.state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nyeri County"
                    />
                  </div>


                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Night (KES)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.pricing.pricePerNight}
                      onChange={(e) => handleInputChange('pricing.pricePerNight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cleaning Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.cleaningFee}
                      onChange={(e) => handleInputChange('pricing.cleaningFee', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Fee (KES)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.serviceFee}
                      onChange={(e) => handleInputChange('pricing.serviceFee', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Guests
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.maxGuests}
                      onChange={(e) => handleInputChange('capacity.maxGuests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bedrooms}
                      onChange={(e) => handleInputChange('capacity.bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beds
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.beds}
                      onChange={(e) => handleInputChange('capacity.beds', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity.bathrooms}
                      onChange={(e) => handleInputChange('capacity.bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenitiesOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        <div className="text-sm font-medium">{amenity.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
                
                {/* Current Images */}
                {formData.images && formData.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Current Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url ? `http://localhost:4000${image.url}` : URL.createObjectURL(image)}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Add New Images</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {uploadingImages && (
                      <div className="mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload images or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB each
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h2>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a house rule..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="px-4 py-2 bg-gradient-to-r from-green-800 to-amber-900 text-white rounded-md hover:from-green-700 hover:to-amber-800"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.rules.length > 0 && (
                    <div className="space-y-2">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <span className="text-sm">{rule}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/host/dashboard')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-green-800 to-amber-900 text-white rounded-md hover:from-green-700 hover:to-amber-800 disabled:opacity-50 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty; 