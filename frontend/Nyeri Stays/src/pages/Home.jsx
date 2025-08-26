import { useState, useEffect } from 'react'
import { Users, Star, Heart, Shield, Award, Clock, ArrowRight, Play, CheckCircle, HelpCircle, Globe, MapPin, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import PropertyCardSkeleton from '../components/PropertyCardSkeleton'
import { propertiesAPI } from '../services/api'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  // Fetch featured properties on component mount
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true)
        const response = await propertiesAPI.getFeatured(6)
        console.log('Featured properties API response:', response);
        console.log('Featured properties data:', response.data);
        
        if (response.data && response.data.length > 0) {
          console.log('First featured property images:', response.data[0].images);
        }
        
        setFeaturedProperties(response.data || [])
      } catch (error) {
        // Error fetching featured properties
        setError('Failed to load featured properties')
        setFeaturedProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700">
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Decorative elements - hidden on very small screens */}
          <div className="hidden sm:block absolute top-20 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-green-600/20 rounded-full blur-2xl sm:blur-3xl"></div>
          <div className="hidden sm:block absolute bottom-20 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-green-500/20 rounded-full blur-2xl sm:blur-3xl"></div>
          <div className="hidden md:block absolute top-1/2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-green-400/20 rounded-full blur-xl sm:blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center text-white">
            {/* Main heading with gradient text */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
                  Discover
                </span>
                <br />
                <span className="text-white">Amazing Places</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-green-100 max-w-4xl mx-auto leading-relaxed px-2">
                Find unique accommodations in Nyeri and surrounding areas. Experience the beauty of Kenya's highlands.
              </p>
            </div>



            {/* Stats Section */}
            <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-8 max-w-4xl mx-auto px-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-xs sm:text-sm md:text-base text-green-200">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">10K+</div>
                <div className="text-xs sm:text-sm md:text-base text-green-200">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-xs sm:text-sm md:text-base text-green-200">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">4.9</div>
                <div className="text-xs sm:text-sm md:text-base text-green-200">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2.5 sm:h-3 bg-white/70 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
          </div>
        </div>


      </section>

      {/* Featured Properties */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Star size={14} className="sm:w-4 sm:h-4 fill-green-600" />
              Featured Properties
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Handpicked
              <span className="text-green-700"> Accommodations</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-3">
              Discover carefully curated properties that offer the best experience in Nyeri and surrounding areas
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
              {[...Array(6)].map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16 px-3 sm:px-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4 text-base sm:text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-green-600 hover:text-green-800 underline text-base sm:text-lg font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property._id || property.id} property={property} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  View All Properties
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md mx-auto mx-3 sm:mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Search size={24} className="sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">We couldn't find any featured properties at the moment.</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Browse All Properties
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-green-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700"></div>
        {/* Decorative circles - hidden on very small screens */}
        <div className="hidden sm:block absolute top-20 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-green-600/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-green-500/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-green-400/20 rounded-full blur-xl sm:blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-green-800/50 text-green-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Award size={14} className="sm:w-4 sm:h-4" />
              Why Choose Us
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Experience the
              <span className="text-green-200"> Difference</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed px-3">
              We go above and beyond to ensure your stay in Nyeri is nothing short of extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Shield className="text-green-200 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Verified Properties</h3>
              <p className="text-green-100 leading-relaxed text-sm sm:text-base md:text-lg px-2">All our properties are personally verified to ensure quality, safety, and authenticity.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Users className="text-green-200 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Local Experience</h3>
              <p className="text-green-100 leading-relaxed text-sm sm:text-base md:text-lg px-2">Connect with local hosts and experience authentic Kenyan hospitality and culture.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <MapPin className="text-green-200 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Prime Locations</h3>
              <p className="text-green-100 leading-relaxed text-sm sm:text-base md:text-lg px-2">Properties located in the most beautiful and accessible areas of Nyeri and surroundings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Everything You
              <span className="text-green-700"> Need</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-3">
              From luxury villas to cozy cottages, we have accommodations for every preference and budget
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: Shield, title: "Safe & Secure", description: "24/7 security and verified hosts" },
              { icon: Clock, title: "Instant Booking", description: "Book your stay in minutes" },
              { icon: Star, title: "Premium Quality", description: "Handpicked luxury properties" },
              { icon: CheckCircle, title: "Best Prices", description: "Competitive rates guaranteed" }
            ].map((feature, index) => (
              <div key={index} className="text-center group p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors duration-300">
                  <feature.icon className="text-green-700 w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Star size={14} className="sm:w-4 sm:h-4 fill-green-600" />
              What Our Guests Say
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Loved by
              <span className="text-green-700"> Travelers</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-3">
              Don't just take our word for it - hear from our satisfied guests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "Nairobi, Kenya",
                rating: 5,
                comment: "Amazing experience! The property was exactly as described and the host was incredibly welcoming. Will definitely book again!"
              },
              {
                name: "Michael Chen",
                location: "London, UK",
                rating: 5,
                comment: "Perfect location with stunning mountain views. The accommodation was spotless and the amenities were top-notch."
              },
              {
                name: "Amina Hassan",
                location: "Mombasa, Kenya",
                rating: 5,
                comment: "Exceptional service and beautiful properties. Nyeri Stays made our family vacation truly memorable."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-green-700 font-semibold text-base sm:text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <HelpCircle size={14} className="sm:w-4 sm:h-4" />
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Frequently Asked
              <span className="text-green-700"> Questions</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-3">
              Get quick answers to the most common questions about booking with Nyeri Stays
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                question: "How do I book a property on Nyeri Stays?",
                answer: "Search for your preferred dates and property, click 'Book Now,' and follow the payment instructions."
              },
              {
                question: "What payment methods are accepted?",
                answer: "MPESA, debit/credit cards, and select mobile wallets."
              },
              {
                question: "Can I cancel my booking?",
                answer: "Yes, cancellation policies vary by property. Please check the listing details."
              },
              {
                question: "Are prices inclusive of taxes?",
                answer: "Prices shown include applicable taxes unless otherwise stated."
              },
              {
                question: "How are properties verified?",
                answer: "We verify listings through owner documentation and site visits."
              },
              {
                question: "What if I have an issue during my stay?",
                answer: "Contact our 24/7 support team immediately. We're here to help resolve any issues."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold text-sm sm:text-base">{index + 1}</span>
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base pl-9 sm:pl-10">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/legal"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Legal Information
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-r from-green-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Ready to Start Your
            <span className="text-green-200"> Adventure?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-100 mb-6 sm:mb-8 leading-relaxed px-3">
            Join thousands of travelers who have discovered the magic of Nyeri with us
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-800 font-semibold rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Browse Properties
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-200 hover:bg-white hover:text-green-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 