import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Phone, MessageCircle, Info } from 'lucide-react';

const AdminContactButtons = ({ 
  phoneNumber = "+254759589964",
  whatsappMessage = "Hello, I need assistance.",
  className = "",
  showIcons = true,
  buttonText = { call: "Call Admin", whatsapp: "WhatsApp Admin" }
}) => {
  const { isAuthenticated, user } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleContactClick = (type) => {
    if (!isAuthenticated) {
      // Show tooltip briefly before redirecting
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        // Redirect to login page with return URL
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }, 1500);
      return;
    }

    // If authenticated, proceed with the contact action
    if (type === 'call') {
      window.location.href = `tel:${phoneNumber}`;
    } else if (type === 'whatsapp') {
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`, '_blank');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg shadow-lg z-10 flex items-center max-w-xs text-center">
          <Info size={14} className="sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Please log in to contact admin</span>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => handleContactClick('call')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-200 text-center flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          {showIcons && (
            <Phone size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
          )}
          <span className="hidden xs:inline">{buttonText.call}</span>
          <span className="xs:hidden">Call</span>
        </button>
        
        <button
          onClick={() => handleContactClick('whatsapp')}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-200 text-center flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          {showIcons && (
            <MessageCircle size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
          )}
          <span className="hidden xs:inline">{buttonText.whatsapp}</span>
          <span className="xs:hidden">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default AdminContactButtons;
