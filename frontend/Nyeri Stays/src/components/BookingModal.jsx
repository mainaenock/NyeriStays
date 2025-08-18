import { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Home, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { bookingsAPI } from '../services/api';

const BookingModal = ({ booking, isOpen, onClose, mode = 'view', onSave }) => {
  const [formData, setFormData] = useState({
    status: 'pending',
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
      setFormData({
        status: booking.status || 'pending',
        checkIn: booking.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] : '',
        checkOut: booking.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] : '',
        guests: booking.guests || 1,
        totalAmount: booking.totalAmount || 0
      });
    }
  }, [booking]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'edit') {
        const response = await bookingsAPI.updateStatus(booking._id, formData.status);
        
        // Show success message
        alert(`Booking status updated to ${formData.status} successfully!`);
        
        // Call onSave callback to refresh data
        if (onSave) {
          await onSave();
        }
      }
      onClose();
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking status';
      setError(errorMessage);
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'view' ? 'Booking Details' : 'Edit Booking'}
              </h3>
              <p className="text-sm text-gray-500">
                {mode === 'view' ? 'View booking information' : 'Update booking status'}
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
            {/* Booking Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Calendar size={16} className="mr-2" />
                Booking Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Code
                  </label>
                  <input
                    type="text"
                    value={booking?.bookingCode || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Clock size={16} className="mr-2" />
                Dates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Guest Info */}
            {booking?.guest && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <User size={16} className="mr-2" />
                  Guest Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {booking.guest.firstName} {booking.guest.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {booking.guest.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Guests:</span> {formData.guests}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {booking.guest.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Info */}
            {booking?.property && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Home size={16} className="mr-2" />
                  Property Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Property:</span> {booking.property.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {booking.property.location?.city}, {booking.property.location?.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Host:</span> {booking.host?.firstName} {booking.host?.lastName}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <DollarSign size={16} className="mr-2" />
                Pricing
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total Amount:</span> KES {formData.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Price per Night:</span> KES {booking?.property?.pricing?.pricePerNight?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cleaning Fee:</span> KES {booking?.property?.pricing?.cleaningFee?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Service Fee:</span> KES {booking?.property?.pricing?.serviceFee?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
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
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Update Status
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

export default BookingModal; 