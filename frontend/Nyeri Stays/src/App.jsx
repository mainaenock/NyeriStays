import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import HostDashboard from './pages/HostDashboard'
import HostBookings from './pages/HostBookings'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import BecomeHost from './pages/BecomeHost'
import AdminDashboard from './pages/AdminDashboard'
import Legal from './pages/Legal'
import About from './pages/About'
import Contact from './pages/Contact'
import HelpCenter from './pages/HelpCenter'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Footer from './components/Footer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
                                <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/properties" element={<PropertyList />} />
                      <Route path="/property/:id" element={<PropertyDetail />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route path="/become-host" element={<BecomeHost />} />
                      <Route path="/legal" element={<Legal />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help-center" element={<HelpCenter />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute requireAuth={true}>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Host Routes */}
                      <Route 
                        path="/host/dashboard" 
                        element={
                          <ProtectedRoute requireAuth={true} requireHost={true}>
                            <HostDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/host/bookings" 
                        element={
                          <ProtectedRoute requireAuth={true} requireHost={true}>
                            <HostBookings />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/host/properties/new" 
                        element={
                          <ProtectedRoute requireAuth={true} requireHost={true}>
                            <AddProperty />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/host/properties/:id/edit" 
                        element={
                          <ProtectedRoute requireAuth={true} requireHost={true}>
                            <EditProperty />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Admin Routes */}
                      <Route 
                        path="/admin/dashboard" 
                        element={
                          <ProtectedRoute requireAuth={true} requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Catch-all route for SPA routing */}
                      <Route path="*" element={<Home />} />
                    </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
