import { useState, useEffect } from 'react'
import { Bell, X, Check, Clock, Users, Calendar, DollarSign } from 'lucide-react'
import { bookingsAPI } from '../services/api'

const BookingNotification = ({ onBookingUpdate }) => {
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Check for new bookings every 30 seconds
    const interval = setInterval(checkNewBookings, 30000)
    checkNewBookings() // Check immediately on mount

    return () => clearInterval(interval)
  }, [])

  const checkNewBookings = async () => {
    try {
      const response = await bookingsAPI.getHostBookings()
      const recentBookings = response.data?.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        const now = new Date()
        const diffInMinutes = (now - bookingDate) / (1000 * 60)
        return diffInMinutes <= 5 // Show notifications for bookings made in last 5 minutes
      }) || []

      setNotifications(recentBookings)
    } catch (error) {
      console.error('Error checking new bookings:', error)
    }
  }

  const markAsRead = (bookingId) => {
    setNotifications(prev => prev.filter(n => n._id !== bookingId))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <X className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">New Bookings</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-2">
            {notifications.map((booking) => (
              <div
                key={booking._id}
                className="p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {booking.guest?.firstName} {booking.guest?.lastName}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {booking.property?.title}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>KES {booking.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                      
                      <button
                        onClick={() => markAsRead(booking._id)}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => {
                setShowNotifications(false)
                onBookingUpdate?.()
              }}
              className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingNotification 