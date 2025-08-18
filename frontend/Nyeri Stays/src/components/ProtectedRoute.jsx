import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireHost = false, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin role is required but user is not an admin
  if (requireAdmin && user?.role !== 'admin') {
    // Redirect to home page if user is authenticated but not an admin
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If host role is required but user is not a host
  if (requireHost && user?.role !== 'host' && user?.role !== 'admin') {
    // Redirect to become host page if user is authenticated but not a host
    if (isAuthenticated) {
      return <Navigate to="/become-host" replace />;
    }
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and has required role, render the component
  return children;
};

export default ProtectedRoute; 