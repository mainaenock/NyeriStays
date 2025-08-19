import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Shield, Award, Clock, Play, CheckCircle, HelpCircle, Globe } from 'lucide-react'
import logo from '../assets/logo.jpg'
import { authAPI } from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }))
    }
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    setIsLoading(true)
    
    try {
      await authAPI.forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({ general: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src={logo} 
                  alt="Nyeri Stays Logo" 
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Check your <span className="text-green-600">email</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                We've sent you a secure password reset link
              </p>
            </div>

            {/* Success Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 shadow-lg">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Password reset email sent! 🎉
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We've sent a secure password reset link to{' '}
                  <span className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                    {email}
                  </span>
                </p>
                
                {/* Email Details */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Email Details</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-2">
                    <div><strong>From:</strong> nyeristays@gmail.com</div>
                    <div><strong>Subject:</strong> Reset your Nyeri Stays password</div>
                    <div><strong>Check:</strong> Inbox and spam folder</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  <strong>Tip:</strong> If you don't see the email, check your spam folder or try again with a different email address.
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Send another email
                  </button>
                  
                  <Link
                    to="/login"
                    className="w-full flex justify-center items-center gap-2 py-4 px-6 border-2 border-green-200 text-green-700 font-semibold rounded-2xl hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                  >
                    <ArrowLeft size={20} />
                    Back to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src={logo} 
                alt="Nyeri Stays Logo" 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Reset your <span className="text-green-600">password</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Enter your email address and we'll send you a secure link to reset your password
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
            {/* Security Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Secure Password Reset</h3>
                  <p className="text-sm text-green-700 leading-relaxed">
                    Your security is our priority. We use industry-standard encryption and the reset link expires automatically for your protection.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Display */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <span className="font-medium">{errors.general}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full pl-12 pr-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Send reset link
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">or</span>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="mt-8">
              <Link
                to="/login"
                className="w-full flex justify-center items-center gap-3 py-4 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                Back to sign in
              </Link>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">
                  <strong>Reset emails sent from:</strong>{' '}
                  <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                    nyeristays@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Sparkles size={16} className="text-green-500" />
              <span>Need help? Contact our support team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword 