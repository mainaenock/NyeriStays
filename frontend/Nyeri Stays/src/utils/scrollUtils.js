// Utility functions for controlled scrolling

/**
 * Smooth scroll to a specific element
 * @param {string|HTMLElement} target - CSS selector or DOM element
 * @param {number} offset - Additional offset from top (default: 0)
 */
export const smoothScrollTo = (target, offset = 0) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to top of page with smooth behavior
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Scroll to top of page instantly (no smooth behavior)
 */
export const scrollToTopInstant = () => {
  window.scrollTo(0, 0);
};
