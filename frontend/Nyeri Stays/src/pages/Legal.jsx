import React from 'react'
import { 
  Shield, 
  FileText, 
  HelpCircle, 
  Lock, 
  Users, 
  CreditCard, 
  Home, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Eye,
  Database,
  Globe,
  Mail,
  Phone
} from 'lucide-react'

const Legal = () => {
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
              Legal & Information
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Legal Information &
              <span className="text-green-200"> Support</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about our policies, terms, and frequently asked questions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </a>
            <span>/</span>
            <span className="text-green-600 font-medium">Legal & Information</span>
          </nav>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Frequently Asked Questions */}
            <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle size={24} className="text-green-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I book a property on Nyeri Stays?</h3>
                  <p className="text-gray-600">Search for your preferred dates and property, click "Book Now," and follow the payment instructions.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods are accepted?</h3>
                  <p className="text-gray-600">MPESA, debit/credit cards, and select mobile wallets.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my booking?</h3>
                  <p className="text-gray-600">Yes, cancellation policies vary by property. Please check the listing details.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Are prices inclusive of taxes?</h3>
                  <p className="text-gray-600">Prices shown include applicable taxes unless otherwise stated.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How are properties verified?</h3>
                  <p className="text-gray-600">We verify listings through owner documentation and site visits.</p>
                </div>
              </div>
            </section>

            {/* Terms & Conditions */}
            <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={24} className="text-green-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms & Conditions</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <p>Book only for lawful purposes.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <p>Provide accurate personal and payment information.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <p>Respect each property's house rules.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <p>Understand that Nyeri Stays acts as an intermediary between guests and hosts.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <p>Refunds and cancellations are subject to each property's policy.</p>
                </div>
              </div>
            </section>

            {/* Privacy Policy */}
            <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Lock size={24} className="text-green-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacy Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Database size={20} className="text-green-600" />
                    Information Collection
                  </h3>
                  <p className="text-gray-600">We collect personal details (name, contact info) and booking data to process reservations.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye size={20} className="text-green-600" />
                    Use of Information
                  </h3>
                  <p className="text-gray-600">For booking management, customer service, and marketing (with consent).</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={20} className="text-green-600" />
                    Data Protection
                  </h3>
                  <p className="text-gray-600">We use SSL encryption and secure servers to protect your information.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={20} className="text-green-600" />
                    Third-Party Sharing
                  </h3>
                  <p className="text-gray-600">Limited to payment processors, service providers, or when legally required.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={20} className="text-green-600" />
                    Your Rights
                  </h3>
                  <p className="text-gray-600">You may request access, correction, or deletion of your data at any time.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-green-600" />
                Quick Links
              </h3>
              <div className="space-y-3">
                <a 
                  href="#faq" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-green-700">FAQs</span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600" />
                </a>
                <a 
                  href="#terms" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-green-700">Terms & Conditions</span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600" />
                </a>
                <a 
                  href="#privacy" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-green-700">Privacy Policy</span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600" />
                </a>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle size={20} className="text-green-600" />
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-3">
                <a 
                  href="mailto:nyeristays@gmail.com" 
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <Mail size={16} />
                  nyeristays@gmail.com
                </a>
                <a 
                  href="tel:+254759589964" 
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <Phone size={16} />
                  +254 759 589 964
                </a>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Important Notice</h4>
                  <p className="text-green-700 text-sm">
                    By using our platform, you agree to these terms and policies. Please read them carefully before making any bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Legal
