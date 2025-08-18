import { useState } from 'react'
import { MapPin, Users, Shield, Award, Heart, Globe, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">Nyeri Stays</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connecting travelers with unique accommodations in the heart of Kenya's highlands. 
              Discover the beauty of Nyeri through authentic local experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To provide travelers with authentic, comfortable, and memorable stays in Nyeri and surrounding areas, 
                while supporting local hosts and promoting sustainable tourism in Kenya's beautiful highlands.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the leading platform for unique accommodations in Central Kenya, 
                fostering cultural exchange and economic growth for local communities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Local Hosts</h4>
                  <p className="text-sm text-gray-600">Supporting local families</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Authentic Experience</h4>
                  <p className="text-sm text-gray-600">Real local culture</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Safe & Secure</h4>
                  <p className="text-sm text-gray-600">Verified accommodations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Quality Assured</h4>
                  <p className="text-sm text-gray-600">Curated properties</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nyeri */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Nyeri?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the unique charm of Kenya's highlands through our carefully selected accommodations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prime Location</h3>
              <p className="text-gray-600">
                Located in the heart of Central Kenya, Nyeri offers easy access to Mount Kenya, 
                Aberdare National Park, and other natural wonders.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Richness</h3>
              <p className="text-gray-600">
                Experience the rich culture of the Kikuyu people, traditional farming practices, 
                and warm Kenyan hospitality.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Accommodations</h3>
              <p className="text-gray-600">
                From cozy cottages to luxury lodges, we offer a range of accommodations 
                that meet international standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="text-lg text-gray-600 space-y-6 leading-relaxed">
              <p>
                Nyeri Stays was born from a deep love for the beautiful highlands of Central Kenya. 
                Our founders, having grown up in this region, recognized the need to share its beauty 
                with the world while supporting local communities.
              </p>
              <p>
                What started as a small collection of family-owned properties has grown into a 
                comprehensive platform connecting travelers with authentic local experiences. 
                We believe that the best way to experience a destination is through the eyes of locals.
              </p>
              <p>
                Today, we're proud to work with hundreds of local hosts who open their homes 
                and hearts to travelers, creating meaningful connections and unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Nyeri?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of travelers who have discovered the magic of Kenya's highlands
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Properties
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors"
            >
              Contact Us
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
