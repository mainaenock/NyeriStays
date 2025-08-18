import { useState, useEffect } from 'react';
import { X, Save, Home, MapPin, DollarSign, User, CheckCircle, XCircle, Camera, Plus } from 'lucide-react';
import { propertiesAPI } from '../services/api';

const PropertyModal = ({ property, isOpen, onClose, mode = 'view', onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    status: 'active',
    pricing: {
      pricePerNight: 0,
      cleaningFee: 0,
      serviceFee: 0
    },
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Kenya',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    amenities: [],
    rules: [],
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'apartment',
        status: property.status || 'active',
        pricing: {
          pricePerNight: property.pricing?.pricePerNight || 0,
          cleaningFee: property.pricing?.cleaningFee || 0,
          serviceFee: property.pricing?.serviceFee || 0
        },
        location: {
          address: property.location?.address || '',
          city: property.location?.city || '',
          state: property.location?.state || '',
          country: property.location?.country || 'Kenya',
          coordinates: {
            lat: property.location?.coordinates?.lat || 0,
            lng: property.location?.coordinates?.lng || 0
          }
        },
        amenities: property.amenities || [],
        rules: property.rules || [],
        maxGuests: property.maxGuests || 1,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        images: property.images || []
      });
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageId) => {
    if (!property?._id) return;
    
    try {
      await propertiesAPI.deleteImage(property._id, imageId);
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img._id !== imageId)
      }));
    } catch (error) {
      console.error('Error removing image:', error);
      setError('Failed to remove image. Please try again.');
    }
  };

  const handleAddRule = () => {
    if (newRule.trim() && !formData.rules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'edit') {
        // Update property first
        await propertiesAPI.update(property._id, formData);
        
        // Upload new images if any
        if (newImages.length > 0) {
          setUploadingImages(true);
          try {
            await propertiesAPI.uploadImages(property._id, newImages);
    
          } catch (imageError) {
            console.error('Error uploading images:', imageError);
            setError('Property updated successfully, but there was an issue uploading some images. You can add images later.');
          } finally {
            setUploadingImages(false);
          }
        }
        
        onSave && onSave();
      }
      onClose();
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'view' ? 'Property Details' : 'Edit Property'}
              </h3>
              <p className="text-sm text-gray-500">
                {mode === 'view' ? 'View property information' : 'Update property details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={mode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={mode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <MapPin size={16} className="mr-2" />
                Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <DollarSign size={16} className="mr-2" />
                Pricing
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night (KES)
                  </label>
                  <input
                    type="number"
                    name="pricing.pricePerNight"
                    value={formData.pricing.pricePerNight}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cleaning Fee (KES)
                  </label>
                  <input
                    type="number"
                    name="pricing.cleaningFee"
                    value={formData.pricing.cleaningFee}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Fee (KES)
                  </label>
                  <input
                    type="number"
                    name="pricing.serviceFee"
                    value={formData.pricing.serviceFee}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Home size={16} className="mr-2" />
                Property Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'TV', 'Garden', 'Security'].map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            amenities: [...prev.amenities, amenity]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            amenities: prev.amenities.filter(a => a !== amenity)
                          }));
                        }
                      }}
                      disabled={mode === 'view'}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">House Rules</h4>
              {formData.rules && formData.rules.length > 0 ? (
                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{rule}</span>
                      </div>
                      {mode === 'edit' && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              rules: prev.rules.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No house rules set</p>
              )}
              
              {mode === 'edit' && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                    placeholder="Add a new house rule..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Rule
                  </button>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Camera size={16} className="mr-2" />
                Property Images
              </h4>
              
              {/* Existing Images */}
              {formData.images && formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={image._id || index} className="relative group">
                        <img
                          src={image.url || image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        {mode === 'edit' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(image._id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="property-image-upload"
                      />
                      <label htmlFor="property-image-upload" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-600 font-medium text-sm">Click to upload new images</p>
                        <p className="text-green-500 text-xs">or drag and drop</p>
                      </label>
                    </div>
                    
                    {newImages.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Images to Upload</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {newImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`New image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove new image"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Status</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {formData.status === 'active' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Property Status</span>
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={mode === 'view'}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Host Info */}
            {property?.host && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <User size={16} className="mr-2" />
                  Host Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Host:</span> {property.host.firstName} {property.host.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {property.host.email}
                  </p>
                </div>
                {property.hostPhone && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {property.hostPhone}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              {uploadingImages && (
                <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Uploading images...</span>
                </div>
              )}
              
              {mode === 'view' ? (
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading || uploadingImages ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal; 