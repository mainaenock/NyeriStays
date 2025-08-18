import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Check, 
  X, 
  Shield, 
  ArrowRight, 
  Home, 
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SignUp = () => {
  const { register, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', met: formData.password.length >= 8 },
    { id: 'uppercase', text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { id: 'lowercase', text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { id: 'number', text: 'One number', met: /\d/.test(formData.password) },
    { id: 'special', text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!passwordRequirements.every(req => req.met)) {
      newErrors.password = 'Password does not meet requirements'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms & Conditions to proceed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    clearError()
    
    try {
      const { firstName, lastName, email, phone, password } = formData
      await register({ firstName, lastName, email, phone, password })
      
      // Redirect to login page after successful signup
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' }
      })
    } catch (error) {
      console.error('Sign up error:', error)
      setErrors({ general: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative elements */}
        <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-green-600/20 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield size={16} className="fill-green-300" />
              Join Our Community
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Start Your Journey with
              <span className="text-green-200"> Nyeri Stays</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Create your account and discover amazing places to stay in Nyeri
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 max-w-md mx-auto">
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </a>
            <span>/</span>
            <span className="text-green-600 font-medium">Sign Up</span>
          </nav>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow-xl rounded-2xl border border-gray-100">
            {(errors.general || authError) && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 sm:py-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium">{errors.general || authError}</span>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                                           className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                       errors.firstName ? 'border-red-300' : 'border-gray-200'
                     }`}
                      placeholder="First name"
                    />
                                         <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                   </div>
                   {errors.firstName && (
                     <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                   )}
                 </div>

                 <div>
                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                     Last name
                   </label>
                   <div className="relative">
                     <input
                       id="lastName"
                       name="lastName"
                       type="text"
                       required
                       value={formData.lastName}
                       onChange={handleInputChange}
                       className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                         errors.lastName ? 'border-red-300' : 'border-gray-200'
                       }`}
                       placeholder="Last name"
                     />
                     <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                                         className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                       errors.email ? 'border-red-300' : 'border-gray-200'
                     }`}
                    placeholder="Enter your email"
                  />
                                      <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                                         className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                       errors.phone ? 'border-red-300' : 'border-gray-200'
                     }`}
                    placeholder="+254 700 000 000"
                  />
                                      <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                                         className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                       errors.password ? 'border-red-300' : 'border-gray-200'
                     }`}
                    placeholder="Create a password"
                  />
                                       <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                   <button
                     type="button"
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     onClick={() => setShowPassword(!showPassword)}
                   >
                     {showPassword ? (
                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                     ) : (
                       <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                     )}
                   </button>
                   {errors.password && (
                     <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                   )}
                 </div>

                 {/* Password Requirements */}
                 {formData.password && (
                   <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <h4 className="text-sm font-medium text-gray-700 mb-2">Password requirements:</h4>
                     <div className="space-y-1">
                       {passwordRequirements.map((requirement) => (
                         <div key={requirement.id} className="flex items-center text-xs sm:text-sm">
                           {requirement.met ? (
                             <CheckCircle className="h-3 h-4 w-3 w-4 text-green-500 mr-2 flex-shrink-0" />
                           ) : (
                             <X className="h-3 h-4 w-3 w-4 text-red-500 mr-2 flex-shrink-0" />
                           )}
                           <span className={requirement.met ? 'text-green-600' : 'text-red-600'}>
                             {requirement.text}
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <div>
                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                   Confirm password
                 </label>
                 <div className="relative">
                   <input
                     id="confirmPassword"
                     name="confirmPassword"
                     type={showConfirmPassword ? 'text' : 'password'}
                     autoComplete="new-password"
                     required
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     className={`appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 bg-gray-50 hover:bg-white ${
                       errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                     }`}
                     placeholder="Confirm your password"
                   />
                   <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions Agreement */}
              <div className="flex items-start gap-3">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                />
                <div className="text-sm text-gray-700">
                  <label htmlFor="agreeToTerms" className="font-medium cursor-pointer">
                    I agree to the{' '}
                    <Link to="/legal" className="text-green-600 hover:text-green-700 underline font-medium">
                      Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/legal" className="text-green-600 hover:text-green-700 underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center items-center py-2.5 sm:py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-green-300 transition-all duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button className="w-full inline-flex justify-center items-center py-2.5 sm:py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-green-300 transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp 