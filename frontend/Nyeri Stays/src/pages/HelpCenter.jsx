import { useState } from 'react'
import { Search, BookOpen, CreditCard, Calendar, Shield, Users, MapPin, Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaqs, setExpandedFaqs] = useState({})

  const toggleFaq = (id) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const faqs = [
    {
      id: 1,
      question: "How do I book a property on Nyeri Stays?",
      answer: "Booking is simple! Browse our properties, select your dates and number of guests, and click 'Reserve Now'. You'll need to create an account or log in to complete your booking. We accept M-Pesa, bank transfers, and cash payments."
    },
    {
      id: 2,
      question: "What is your cancellation policy?",
      answer: "Cancellation policies vary by property. Most properties offer free cancellation up to 24-48 hours before check-in. Please check the specific property's cancellation policy when booking. For urgent cancellations, contact our support team."
    },
    {
      id: 3,
      question: "How do I contact a host?",
      answer: "Once you've made a booking, you can contact your host through our messaging system. Hosts typically respond within a few hours. For urgent matters, you can also contact our support team at +254 759 589 964."
    },
    {
      id: 4,
      question: "What happens if I have an issue during my stay?",
      answer: "If you encounter any issues during your stay, first try to resolve them with your host. If the issue persists, contact our 24/7 support team immediately. We're here to help ensure your stay is comfortable and enjoyable."
    },
    {
      id: 5,
      question: "Do you offer refunds?",
      answer: "Refunds are processed according to each property's cancellation policy. If you're eligible for a refund, it will be processed within 5-10 business days. Contact our support team if you have questions about refunds."
    },
    {
      id: 6,
      question: "How do I become a host?",
      answer: "To become a host, visit our 'Become a Host' page and fill out the application form. We'll review your property and guide you through the listing process. Hosting with us is a great way to earn extra income!"
    },
    {
      id: 7,
      question: "Are the properties verified and safe?",
      answer: "Yes! All properties on Nyeri Stays are personally verified by our team. We conduct thorough inspections and background checks on all hosts to ensure your safety and comfort."
    },
    {
      id: 8,
      question: "What amenities are included?",
      answer: "Amenities vary by property. Each listing clearly shows what's included (WiFi, kitchen, parking, etc.). If you need specific amenities, use our search filters or contact us for recommendations."
    }
  ]

  const helpCategories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Booking & Reservations",
      description: "Learn how to book properties and manage your reservations",
      link: "#booking"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payments & Billing",
      description: "Information about payment methods and billing",
      link: "#payments"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Cancellations & Changes",
      description: "How to modify or cancel your bookings",
      link: "#cancellations"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety & Security",
      description: "Your safety is our priority",
      link: "#safety"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hosting",
      description: "Become a host and earn extra income",
      link: "/become-host"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Property Information",
      description: "Details about our properties and locations",
      link: "#properties"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              How can we <span className="text-green-600">help you?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Find answers to common questions and get the support you need for your Nyeri Stays experience.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Help Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the information you need quickly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <Link 
                  to={category.link}
                  className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                >
                  Learn more
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to the most common questions
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaqs[faq.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaqs[faq.id] && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still need help?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you 24/7
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+254 759 589 964</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">nyeristays@gmail.com</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Contact Support
              <MessageCircle size={20} />
            </Link>
            <a
              href="tel:+254759589964"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors"
            >
              Call Now
              <Phone size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenter
