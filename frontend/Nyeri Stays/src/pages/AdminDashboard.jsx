import { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  Calendar, 
  BarChart3, 
  Settings, 
  UserPlus, 
  Shield, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Star,
  Plus,
  MapPin,
  Bed,
  Bath,
  X,
  Camera
} from 'lucide-react';
import { authAPI, usersAPI, propertiesAPI, bookingsAPI } from '../services/api';
import UserModal from '../components/UserModal';
import PropertyModal from '../components/PropertyModal';
import BookingModal from '../components/BookingModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeProperties: 0,
    pendingBookings: 0
  });
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    type: 'house',
    hostFirstName: '',
    hostLastName: '',
    hostEmail: '',
    hostPhone: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Kenya',
      coordinates: { lat: 0, lng: 0 }
    },
    pricing: {
      pricePerNight: '',
      cleaningFee: '',
      serviceFee: ''
    },
    capacity: {
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      beds: 1
    },
    amenities: [],
    rules: [],
    newRule: '',
    images: [],
    status: 'active'
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const [userStats, propertyStats, bookingStats] = await Promise.all([
        usersAPI.getStats(),
        propertiesAPI.getStats(),
        bookingsAPI.getStats()
      ]);

      setStats({
        totalUsers: userStats.data?.totalUsers || 0,
        totalProperties: propertyStats.data?.totalProperties || 0,
        totalBookings: bookingStats.data?.totalBookings || 0,
        totalRevenue: bookingStats.data?.totalRevenue || 0,
        activeProperties: propertyStats.data?.activeProperties || 0,
        pendingBookings: bookingStats.data?.pendingBookings || 0
      });

      // Fetch lists
      const [usersData, propertiesData, bookingsData] = await Promise.all([
        usersAPI.getAll(),
        propertiesAPI.getAllAdmin(),
        bookingsAPI.getAll()
      ]);

  setUsers(usersData.data || []);
  setProperties(propertiesData.data || []);
  setBookings(bookingsData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = properties.filter(property => {
  const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesSearch;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handler functions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setModalMode('view');
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setShowPropertyModal(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertiesAPI.delete(propertyId);
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property: ' + error.message);
      }
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setModalMode('view');
    setShowBookingModal(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setModalMode('edit');
    setShowBookingModal(true);
  };

  const handleBookingSave = async () => {
    try {
      await fetchDashboardData();
    } catch (error) {
      console.error('Error refreshing booking data:', error);
      alert('Booking updated but failed to refresh data. Please refresh the page.');
    }
  };

  const handleExportData = () => {
    // Create CSV data for export
    const exportData = {
      users: users.map(user => ({
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Role: user.role,
        Status: user.isActive ? 'Active' : 'Inactive',
        'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
        'Created At': new Date(user.createdAt).toLocaleDateString()
      })),
      properties: properties.map(property => ({
        Title: property.title,
        Type: property.type,
        Location: `${property.location?.city}, ${property.location?.state}`,
        'Price per Night': `KES ${property.pricing?.pricePerNight?.toLocaleString()}`,
        Status: property.status,
        Host: `${property.host?.firstName} ${property.host?.lastName}`,
        'Created At': new Date(property.createdAt).toLocaleDateString()
      })),
      bookings: bookings.map(booking => ({
        'Booking Code': booking.bookingCode,
        Guest: `${booking.guest?.firstName} ${booking.guest?.lastName}`,
        Property: booking.property?.title,
        Status: booking.status,
        'Check In': new Date(booking.checkIn).toLocaleDateString(),
        'Check Out': new Date(booking.checkOut).toLocaleDateString(),
        'Total Amount': `KES ${booking.totalAmount?.toLocaleString()}`,
        'Created At': new Date(booking.createdAt).toLocaleDateString()
      }))
    };

    // Convert to CSV and download
    const csvContent = [
      'Users\n' + convertToCSV(exportData.users),
      '\nProperties\n' + convertToCSV(exportData.properties),
      '\nBookings\n' + convertToCSV(exportData.bookings)
    ].join('');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nyeri-stays-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ];
    return csvRows.join('\n');
  };

  const handleAddUser = () => {
    // For now, just show a message - in a real app, you'd open a modal
    alert('Add User functionality would open a modal to create a new user. This feature can be implemented later.');
  };

  const handleAddProperty = () => {
    // Reset the form completely when opening
    setNewProperty({
      title: '',
      description: '',
      type: 'house',
      hostFirstName: '',
      hostLastName: '',
      hostEmail: '',
      hostPhone: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: 'Kenya',
        coordinates: { lat: 0, lng: 0 }
      },
      pricing: {
        pricePerNight: '',
        cleaningFee: '',
        serviceFee: ''
      },
      capacity: {
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        beds: 1
      },
      amenities: [],
      rules: [],
      newRule: '',
      images: [],
      status: 'active'
    });
    setShowAddPropertyModal(true);
  };

  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare property data for admin creation
      const { images, ...propertyDataWithoutImages } = newProperty;
      
      const propertyData = {
        ...propertyDataWithoutImages,
        // Ensure required fields are properly formatted
        pricing: {
          pricePerNight: parseFloat(newProperty.pricing.pricePerNight) || 0,
          cleaningFee: parseFloat(newProperty.pricing.cleaningFee) || 0,
          serviceFee: parseFloat(newProperty.pricing.serviceFee) || 0
        },
        capacity: {
          bedrooms: parseInt(newProperty.capacity.bedrooms) || 1,
          bathrooms: parseInt(newProperty.capacity.bathrooms) || 1,
          maxGuests: parseInt(newProperty.capacity.maxGuests) || 2,
          beds: parseInt(newProperty.capacity.beds) || 1
        },
        // Set default values for missing fields
        amenities: newProperty.amenities || [],
        rules: newProperty.rules || [],
        featured: false,
        verified: true, // Admin-created properties are verified by default
        createdAt: new Date().toISOString()
      };

      // Clean up amenities to ensure they're valid
      if (propertyData.amenities.length > 0) {
        propertyData.amenities = propertyData.amenities.filter(amenity => 
          ['WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'TV', 'Garden', 'Security'].includes(amenity)
        );
      }

      
      
      // Create property using the API
      const response = await propertiesAPI.create(propertyData);
      
      
      
      // Check if creation was successful (adjust based on your backend response format)
      if (response._id || response.id || response.success) {
        // Upload images if any
        if (newProperty.images.length > 0) {
          try {
            await propertiesAPI.uploadImages(response.data._id || response._id || response.id, newProperty.images);
    
          } catch (imageError) {
            console.error('Error uploading images:', imageError);
            // Don't fail the entire operation if image upload fails
            alert('Property created successfully, but there was an issue uploading some images. You can add images later.');
          }
        }
        
        alert('Property created successfully!');
        setShowAddPropertyModal(false);
        
        // Reset form
        setNewProperty({
          title: '',
          description: '',
          type: 'house',
          hostFirstName: '',
          hostLastName: '',
          hostEmail: '',
          hostPhone: '',
          location: {
            address: '',
            city: '',
            state: '',
            country: 'Kenya',
            coordinates: { lat: 0, lng: 0 }
          },
          pricing: {
            pricePerNight: '',
            cleaningFee: '',
            serviceFee: ''
          },
          capacity: {
            bedrooms: 1,
            bathrooms: 1,
            maxGuests: 2,
            beds: 1
          },
          amenities: [],
          rules: [],
          newRule: '',
          images: [],
          status: 'active'
        });
        
        // Refresh dashboard data
        await fetchDashboardData();
      } else {
        throw new Error('Property creation failed - no ID returned');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert(`Failed to create property: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewProperty(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewProperty(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewProperty(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    setNewProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddRule = () => {
    if (newProperty.newRule && newProperty.newRule.trim()) {
      setNewProperty(prev => ({
        ...prev,
        rules: [...(prev.rules || []), prev.newRule.trim()],
        newRule: ''
      }));
    }
  };

  const handleRemoveRule = (index) => {
    setNewProperty(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleToggleFeatured = async (propertyId, currentFeaturedStatus) => {
    try {
      setLoading(true);
      const response = await propertiesAPI.toggleFeatured(propertyId);
      
      // Update the properties list with the new featured status
      setProperties(prevProperties => 
        prevProperties.map(property => 
          property._id === propertyId 
            ? { ...property, featured: !currentFeaturedStatus }
            : property
        )
      );
      
      alert(response.message || `Property ${!currentFeaturedStatus ? 'marked as featured' : 'removed from featured'} successfully!`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status, type = 'default' }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'active':
        case 'completed':
        case 'approved':
          return 'bg-green-100 text-green-800';
        case 'pending':
        case 'draft':
          return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
        case 'inactive':
        case 'rejected':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading component

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 shadow-lg border-b border-green-600">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 sm:py-8 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-green-100">Manage Nyeri Stays platform</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button 
                onClick={handleExportData}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download size={16} className="mr-2 inline" />
                <span className="hidden xs:inline">Export </span>Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'properties', label: 'Properties', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 sm:space-x-3 py-3 px-4 sm:px-6 border-b-2 font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-green-600 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <tab.icon size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-700" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-600 truncate">Total Users</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <Home className="h-6 w-6 sm:h-8 sm:w-8 text-green-700" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-600 truncate">Total Properties</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{stats.totalProperties}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-700" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-600 truncate">Total Bookings</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-700" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-600 truncate">Total Revenue</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">KES {stats.totalRevenue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-green-100">
                <div className="px-6 py-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
                  <h3 className="text-lg font-semibold text-green-800">Recent Users</h3>
                </div>
                <div className="p-6">
                  {users.slice(0, 5).map((user) => (
                    <div key={user._id} className="flex items-center justify-between py-3 border-b border-green-100 last:border-b-0 hover:bg-green-50 transition-colors rounded-lg px-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-700">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={user.role} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-green-100">
                <div className="px-6 py-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
                  <h3 className="text-lg font-semibold text-green-800">Recent Bookings</h3>
                </div>
                <div className="p-6">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between py-3 border-b border-green-100 last:border-b-0 hover:bg-green-50 transition-colors rounded-lg px-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.guest?.firstName} {booking.guest?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{booking.bookingCode}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-100">
            <div className="px-6 py-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-800">Users Management</h3>
                  <p className="text-sm sm:text-base text-green-600 mt-1">Manage all users on the platform</p>
                </div>
                <button 
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Add User
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.isVerified ? 'verified' : 'pending'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewUser(user)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-100">
            <div className="px-6 py-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-800">Properties Management</h3>
                  <p className="text-sm sm:text-base text-green-600 mt-1">Manage all properties on the platform</p>
                </div>
                <button 
                  onClick={handleAddProperty}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Property
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Properties Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.map((property) => (
                      <tr key={property._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Home className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{property.title}</div>
                              <div className="text-sm text-gray-500">{property.location?.city}, {property.location?.state}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {property.host?.firstName} {property.host?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          KES {property.pricing?.pricePerNight?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={property.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(property._id, property.featured)}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              property.featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <Star 
                              size={12} 
                              className={`mr-1 ${property.featured ? 'fill-current' : ''}`} 
                            />
                            {property.featured ? 'Featured' : 'Not Featured'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewProperty(property)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditProperty(property)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProperty(property._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-100">
            <div className="px-6 py-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-800">Bookings Management</h3>
                  <p className="text-sm sm:text-base text-green-600 mt-1">Manage all bookings on the platform</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2">
                  <Calendar size={18} />
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-3 sm:p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.bookingCode}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.guest?.firstName} {booking.guest?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.property?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          KES {booking.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewBooking(booking)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditBooking(booking)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-100">
            <div className="px-6 py-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-800">Admin Settings</h3>
                <p className="text-sm sm:text-base text-green-600 mt-1">Configure platform settings and security</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Platform Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="Nyeri Stays"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="nyeristays@gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Security Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Backup & Maintenance</h4>
                  <div className="space-y-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                      <Download size={16} className="mr-2 inline" />
                      Export Database
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                      <Settings size={16} className="mr-2 inline" />
                      Maintenance Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        mode={modalMode}
        onSave={fetchDashboardData}
      />

      <PropertyModal
        property={selectedProperty}
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setSelectedProperty(null);
        }}
        mode={modalMode}
        onSave={fetchDashboardData}
      />

      <BookingModal
        booking={selectedBooking}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedBooking(null);
        }}
        mode={modalMode}
        onSave={handleBookingSave}
      />

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">Add New Property</h2>
                <button
                  onClick={() => setShowAddPropertyModal(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddPropertySubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                  <input
                    type="text"
                    value={newProperty.title}
                    onChange={(e) => handlePropertyInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="Enter property title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <select
                    value={newProperty.type}
                    onChange={(e) => handlePropertyInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    required
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
              </div>

              {/* Host Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Host Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host First Name *</label>
                    <input
                      type="text"
                      value={newProperty.hostFirstName}
                      onChange={(e) => handlePropertyInputChange('hostFirstName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                      placeholder="Enter host's first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Last Name *</label>
                    <input
                      type="text"
                      value={newProperty.hostLastName}
                      onChange={(e) => handlePropertyInputChange('hostLastName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                      placeholder="Enter host's last name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Email *</label>
                    <input
                      type="email"
                      value={newProperty.hostEmail}
                      onChange={(e) => handlePropertyInputChange('hostEmail', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                      placeholder="Enter host's email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Phone *</label>
                    <input
                      type="tel"
                      value={newProperty.hostPhone}
                      onChange={(e) => handlePropertyInputChange('hostPhone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                      placeholder="Enter host's phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newProperty.description}
                  onChange={(e) => handlePropertyInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  placeholder="Describe the property..."
                  required
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    value={newProperty.location.address}
                    onChange={(e) => handlePropertyInputChange('location.address', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={newProperty.location.city}
                    onChange={(e) => handlePropertyInputChange('location.city', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/County *</label>
                  <input
                    type="text"
                    value={newProperty.location.state}
                    onChange={(e) => handlePropertyInputChange('location.state', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="State/County"
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night (KES) *</label>
                  <input
                    type="number"
                    value={newProperty.pricing.pricePerNight}
                    onChange={(e) => handlePropertyInputChange('pricing.pricePerNight', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Fee (KES)</label>
                  <input
                    type="number"
                    value={newProperty.pricing.cleaningFee}
                    onChange={(e) => handlePropertyInputChange('pricing.cleaningFee', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee (KES)</label>
                  <input
                    type="number"
                    value={newProperty.pricing.serviceFee}
                    onChange={(e) => handlePropertyInputChange('pricing.serviceFee', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
                  <input
                    type="number"
                    value={newProperty.capacity.bedrooms}
                    onChange={(e) => handlePropertyInputChange('capacity.bedrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
                  <input
                    type="number"
                    value={newProperty.capacity.bathrooms}
                    onChange={(e) => handlePropertyInputChange('capacity.bathrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beds *</label>
                  <input
                    type="number"
                    value={newProperty.capacity.beds}
                    onChange={(e) => handlePropertyInputChange('capacity.beds', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests *</label>
                  <input
                    type="number"
                    value={newProperty.capacity.maxGuests}
                    onChange={(e) => handlePropertyInputChange('capacity.maxGuests', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'TV', 'Garden', 'Security'].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProperty.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProperty(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity]
                            }));
                          } else {
                            setNewProperty(prev => ({
                              ...prev,
                              amenities: prev.amenities.filter(a => a !== amenity)
                            }));
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">House Rules</label>
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newProperty.newRule || ''}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, newRule: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                      placeholder="Add a house rule..."
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                    >
                      Add Rule
                    </button>
                  </div>
                  
                  {newProperty.rules && newProperty.rules.length > 0 && (
                    <div className="space-y-2">
                      {newProperty.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="admin-image-upload"
                    />
                    <label htmlFor="admin-image-upload" className="cursor-pointer">
                      <Camera className="w-10 h-10 text-green-500 mx-auto mb-3" />
                      <p className="text-green-600 font-medium">Click to upload images</p>
                      <p className="text-green-500 text-sm mt-1">or drag and drop</p>
                    </label>
                  </div>
                  
                  {newProperty.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newProperty.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  value={newProperty.status}
                  onChange={(e) => handlePropertyInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Property...
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Create Property
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPropertyModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-300 hover:text-green-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 