import { useState, useEffect, useRef } from 'react'
import { Search, Menu, User, Globe, Heart, LogOut, Settings, Home, MapPin, Calendar, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.jpg'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: ''
  })
  const profileRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search input changes
  const handleSearchChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle search submission
  const handleSearch = () => {
    if (searchData.location.trim()) {
      // Navigate to properties page with search parameters
      const searchParams = new URLSearchParams()
      if (searchData.location) searchParams.append('location', searchData.location)
      if (searchData.checkIn) searchParams.append('checkIn', searchData.checkIn)
      if (searchData.checkOut) searchParams.append('checkOut', searchData.checkOut)
      if (searchData.guests) searchParams.append('guests', searchData.guests)
      
      navigate(`/properties?${searchParams.toString()}`)
    }
  }

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Close mobile menu when profile dropdown opens
  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsMenuOpen(false) // Close mobile menu when profile opens
  }

  // Close profile dropdown when mobile menu opens
  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsProfileOpen(false) // Close profile dropdown when mobile menu opens
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Nyeri Stays Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-gray-900">Nyeri Stays</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
            <div className="relative flex items-center">
              <MapPin className="absolute left-2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.location}
                onChange={(e) => handleSearchChange('location', e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="outline-none text-sm w-64 pl-8 pr-2"
              />
            </div>
            <div className="border-l border-gray-300 mx-2 h-4"></div>
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="outline-none text-sm w-24 pl-8 pr-2"
              />
            </div>
            <div className="border-l border-gray-300 mx-2 h-4"></div>
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="outline-none text-sm w-24 pl-8 pr-2"
              />
            </div>
            <div className="border-l border-gray-300 mx-2 h-4"></div>
            <div className="relative flex items-center">
              <Users className="absolute left-2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder="Guests"
                value={searchData.guests}
                onChange={(e) => handleSearchChange('guests', e.target.value)}
                onKeyPress={handleSearchKeyPress}
                min="1"
                className="outline-none text-sm w-20 pl-8 pr-2"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="ml-2 bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-full hover:from-green-500 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            {isAuthenticated && user?.role === 'host' && (
              <Link to="/host/dashboard" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                <span className="text-sm font-medium">View Dashboard</span>
              </Link>
            )}
            {isAuthenticated && user?.role !== 'host' && (
              <Link to="/become-host" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                <span className="text-sm font-medium">Become a Host</span>
              </Link>
            )}
            
            {!isAuthenticated && (
              <Link to="/signup" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                <span className="text-sm font-medium">Sign Up</span>
              </Link>
            )}
            
            {/* Legal Information Link */}
            <Link to="/legal" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
              <span className="text-sm font-medium">Legal & Support</span>
            </Link>
            
            <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
              <Globe size={20} className="text-gray-700" />
            </button>

            <div className="flex items-center space-x-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition-shadow">
              <button className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100">
                <Menu size={16} className="text-gray-700" />
              </button>
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={handleProfileToggle}
                    className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full hover:from-green-500 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <User size={20} className="text-white" />
                  </button>
                  
                  {/* User dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[60] border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-gray-500">{user?.email}</div>
                      </div>
                      {user?.role === 'host' && (
                        <Link
                          to="/host/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Home size={16} className="mr-2" />
                          Host Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full hover:from-green-500 hover:to-green-600 transition-all shadow-md hover:shadow-lg">
                  <User size={20} className="text-white" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={handleMobileMenuToggle}
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <>
            {/* Mobile menu backdrop */}
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
            <div className="md:hidden border-t border-gray-200 bg-white relative z-50" ref={mobileMenuRef}>
              <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              {isAuthenticated && user?.role === 'host' && (
                <Link
                  to="/host/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Host Dashboard
                </Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated && user?.role !== 'host' && (
                <Link
                  to="/become-host"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Host
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  Logout
                </button>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              )}
              
              {/* Legal Information */}
              <Link
                to="/legal"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Legal & Support
              </Link>
            </div>
          </div>
        </>
        )}

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all">
            <div className="relative flex items-center flex-1">
              <MapPin className="absolute left-2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.location}
                onChange={(e) => handleSearchChange('location', e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="outline-none text-sm flex-1 pl-8 pr-2"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="ml-2 bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-full hover:from-green-500 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 