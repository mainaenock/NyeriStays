import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Search, 
  Filter,
  Check,
  X,
  Clock,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import { bookingsAPI } from '../services/api';
import HostNavbar from '../components/HostNavbar';

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getHostBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === 'confirm') {
        await bookingsAPI.updateStatus(bookingId, 'confirmed');
      } else if (action === 'reject') {
        await bookingsAPI.updateStatus(bookingId, 'cancelled');
      }
      
      // Refresh booking data
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchBookings}
            className="px-4 py-2 bg-gradient-to-r from-green-800 to-amber-900 text-white rounded-lg hover:from-green-700 hover:to-amber-800 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <HostNavbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage all bookings for your properties</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Total Bookings */}
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-soft">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-800 to-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{booking.property?.title}</h3>
                          <p className="text-gray-600 text-sm sm:text-base">
                            Booked by {booking.guest?.firstName} {booking.guest?.lastName}
                          </p>
                        </div>
                        <div className="text-right sm:text-left lg:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">KES {booking.totalAmount?.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Check-in</p>
                            <p className="font-medium text-sm">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Check-out</p>
                            <p className="font-medium text-sm">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="font-medium text-sm">{(booking.guests?.adults || 0) + (booking.guests?.children || 0) + (booking.guests?.infants || 0)} guest{((booking.guests?.adults || 0) + (booking.guests?.children || 0) + (booking.guests?.infants || 0)) > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Booked on</p>
                            <p className="font-medium text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Guest Contact Info */}
                      <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-lg p-4 mb-4 border border-green-100">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Users className="w-4 h-4 text-green-600 mr-2" />
                          Guest Contact Information
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600 break-all">{booking.guest?.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">{booking.guest?.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'confirm')}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
                              >
                                Confirm Booking
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'reject')}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
                              >
                                Reject Booking
                              </button>
                            </>
                          )}
                        </div>
                        <Link
                          to={`/host/bookings/${booking._id}`}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostBookings; 