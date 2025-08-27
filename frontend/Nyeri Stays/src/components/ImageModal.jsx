import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const ImageModal = ({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      // Swipe left - go to next image
      onNavigate(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      // Swipe right - go to previous image
      onNavigate(currentIndex - 1);
    }
  };

  const handleZoom = () => {
    if (isZoomed) {
      setZoomLevel(1);
      setIsZoomed(false);
    } else {
      setZoomLevel(2);
      setIsZoomed(true);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) {
          onNavigate(currentIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/20"
        aria-label="Close image modal"
      >
        <X size={24} />
      </button>

      {/* Zoom Button */}
      <button
        onClick={handleZoom}
        className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/20"
        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      >
        {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
      </button>

      {/* Previous Button */}
      {hasMultipleImages && currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Next Button */}
      {hasMultipleImages && currentIndex < images.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/20"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Main Image */}
      <div 
        className="relative flex items-center justify-center w-full h-full p-8"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          ref={imageRef}
          src={currentImage}
          alt={`Property image ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoomLevel})`,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in'
          }}
          onClick={handleZoom}
        />
      </div>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full text-lg font-medium backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Swipe Instructions for Mobile */}
      {hasMultipleImages && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center opacity-70">
          <div className="text-sm">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <span className="text-xs">←</span>
              <span>Swipe to navigate</span>
              <span className="text-xs">→</span>
            </div>
            <div className="text-xs opacity-60">Tap to zoom</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
