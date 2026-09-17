'use client';

import React, { useEffect } from 'react';

interface SmoothScrollProps {
  duration?: number;
  offset?: number;
}

/**
 * Smooth Scroll Navigation Component
 * Enhances anchor link navigation with smooth scrolling
 * Industry standard for modern websites
 * 
 * Features:
 * - Smooth scroll to anchor links
 * - Customizable duration and offset
 * - Respects prefers-reduced-motion
 * - Works with Next.js routing
 * 
 * Usage: Wrap your layout or add to specific pages
 */
export default function SmoothScroll({ duration = 800, offset = 80 }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const smoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      
      // Check if it's an anchor link
      if (
        target.tagName === 'A' &&
        target.hash &&
        target.origin === window.location.origin &&
        target.pathname === window.location.pathname
      ) {
        e.preventDefault();
        
        const targetElement = document.querySelector(target.hash);
        
        if (targetElement) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          if (prefersReducedMotion) {
            // Instant scroll for reduced motion preference
            window.scrollTo(0, targetPosition);
          } else {
            // Smooth scroll
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();

            const easeInOutCubic = (t: number): number => {
              return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            const animation = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const ease = easeInOutCubic(progress);
              
              window.scrollTo(0, startPosition + distance * ease);
              
              if (progress < 1) {
                requestAnimationFrame(animation);
              } else {
                // Update URL hash after scroll completes
                history.pushState(null, '', target.hash);
              }
            };

            requestAnimationFrame(animation);
          }
        }
      }
    };

    document.addEventListener('click', smoothScroll);

    return () => {
      document.removeEventListener('click', smoothScroll);
    };
  }, [duration, offset]);

  return null; // This component doesn't render anything
}

/**
 * Scroll to Top Button Component
 * Appears when user scrolls down
 */
export function ScrollToTop({ showAfter = 300 }: { showAfter?: number }) {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > showAfter);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial state

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-primary-hover transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
