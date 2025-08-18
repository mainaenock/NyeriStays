import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BecomeHost = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBecomeHost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.upgradeToHost();
      
      // Update the user in context with new role
      updateUser({
        ...user,
        role: 'host'
      });

      // Redirect to host dashboard
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error upgrading to host:', error);
      setError(error.message || 'Failed to upgrade to host role');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: 'List Your Property',
      description: 'Share your space with travelers and earn money',
      icon: Home
    },
    {
      title: 'Flexible Pricing',
      description: 'Set your own rates and availability',
      icon: CheckCircle
    },
    {
      title: 'Full Control',
      description: 'Manage bookings, reviews, and property details',
      icon: UserCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Host
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start earning money by sharing your space with travelers. 
            Join thousands of hosts who are already making extra income.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Why Become a Host?
            </h2>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to get started?
              </h3>
              <p className="text-blue-700">
                Upgrade your account to host status and start listing your property today.
              </p>
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-800 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Upgrade Your Account
              </h2>
              <p className="text-gray-600">
                Get access to host features and start earning
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Current Account</h3>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">
                    {user?.firstName} {user?.lastName} ({user?.role || 'user'})
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">After Upgrade</h3>
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700">
                    {user?.firstName} {user?.lastName} (host)
                  </span>
                </div>
              </div>

              <button
                onClick={handleBecomeHost}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-800 to-amber-900 text-white font-semibold rounded-lg hover:from-green-700 hover:to-amber-800 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Upgrading...
                  </>
                ) : (
                  <>
                    Upgrade to Host
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            What's Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upgrade Account</h3>
              <p className="text-gray-600">Get host privileges and access to property management tools</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Your Property</h3>
              <p className="text-gray-600">Create detailed listings with photos, amenities, and pricing</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Earning</h3>
              <p className="text-gray-600">Receive bookings and start making money from your property</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost; 