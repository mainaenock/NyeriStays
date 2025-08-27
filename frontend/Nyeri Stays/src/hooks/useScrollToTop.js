import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      // Scroll to top when pathname changes
      window.scrollTo(0, 0);
      
      // Also try to reset scroll position in case of any browser quirks
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
};

export default useScrollToTop;
