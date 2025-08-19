import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Home, 
  Calendar, 
  DollarSign, 
  Star, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  TrendingUp,
  Settings,
  ArrowRight,
  MapPin,
  Shield,
  Award,
  Clock,
  Play,
  CheckCircle,
  HelpCircle,
  Globe
} from 'lucide-react';
import { propertiesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import HostNavbar from '../components/HostNavbar';
import BookingNotification from '../components/BookingNotification';
import { config, getImageURL } from '../config/env';

const HostDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        propertiesAPI.getMyProperties(),
        bookingsAPI.getHostBookings()
      ]);

      setProperties(propertiesRes.data || []);
      setBookings(bookingsRes.data || []);

      // Calculate stats
      const totalEarnings = bookingsRes.data?.reduce((sum, booking) => 
        sum + (booking.totalAmount || 0), 0) || 0;
      
      const totalRating = propertiesRes.data?.reduce((sum, property) => 
        sum + (property.ratings?.average || 0), 0) || 0;
      const averageRating = propertiesRes.data?.length > 0 ? 
        totalRating / propertiesRes.data.length : 0;

      setStats({
        totalProperties: propertiesRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalEarnings,
        averageRating: Math.round(averageRating * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching host data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertiesAPI.delete(propertyId);
        setProperties(properties.filter(p => p._id !== propertyId));
        fetchHostData(); // Refresh stats
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
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
      fetchHostData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchHostData}
            className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostNavbar />
      
      {/* Booking Notifications */}
      <BookingNotification onBookingUpdate={fetchHostData} />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <Link
              to="/host/properties/new"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-800 to-amber-900 text-white font-semibold rounded-lg hover:from-green-700 hover:to-amber-800 transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">KES {stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Properties</h2>
          </div>
          <div className="p-4 sm:p-6">
            {properties.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Home className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Start by adding your first property to begin hosting guests.</p>
                <Link
                  to="/host/properties/new"
                  className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-800 to-amber-900 text-white font-semibold rounded-lg hover:from-green-700 hover:to-amber-800 transition-all text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {properties.map((property) => (
                  <div key={property._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={getImageURL(property.images[0].url)}
                          alt={property.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                          <Home className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{property.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2">{property.location?.city}, {property.location?.state}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900">KES {property.pricing?.pricePerNight?.toLocaleString()}/night</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 mr-1" />
                          <span className="text-xs sm:text-sm text-gray-600">{property.ratings?.average || 0}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          to={`/host/properties/${property._id}/edit`}
                          className="flex-1 flex items-center justify-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Edit size={14} className="sm:w-4 sm:h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="flex-1 flex items-center justify-center px-2 sm:px-3 py-2 border border-red-300 rounded-md text-xs sm:text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                to="/host/bookings"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All Bookings
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-sm sm:text-base text-gray-600">When guests book your properties, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3 sm:gap-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-800 to-amber-900 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{booking.property?.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Booked by {booking.guest?.firstName} {booking.guest?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base sm:text-lg text-gray-900">KES {booking.totalAmount?.toLocaleString()}</p>
                        <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Check-in</p>
                          <p className="text-xs sm:text-sm font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Check-out</p>
                          <p className="text-xs sm:text-sm font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="text-xs sm:text-sm font-medium">{(booking.guests?.adults || 0) + (booking.guests?.children || 0) + (booking.guests?.infants || 0)} guest{((booking.guests?.adults || 0) + (booking.guests?.children || 0) + (booking.guests?.infants || 0)) > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-3 sm:gap-0">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleBookingAction(booking._id, 'confirm')}
                              className="px-2 sm:px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking._id, 'reject')}
                              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          to={`/host/bookings/${booking._id}`}
                          className="px-2 sm:px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard; 