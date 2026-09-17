'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  speed?: number; // 0.5 = slow, 1 = normal, 2 = fast
  overlay?: boolean;
  overlayOpacity?: number;
  minHeight?: string;
  className?: string;
}

/**
 * Professional Parallax Hero Component
 * Industry-standard parallax effect for hero sections
 * Used by: Apple, MIT, Stanford
 * 
 * Features:
 * - Smooth parallax scrolling
 * - Performance optimized with RAF
 * - Respects prefers-reduced-motion
 * - Mobile-optimized (parallax disabled on small screens)
 * - GPU-accelerated transforms
 */
export default function ParallaxHero({
  children,
  backgroundImage,
  speed = 0.5,
  overlay = true,
  overlayOpacity = 0.4,
  minHeight = '60vh',
  className = ''
}: ParallaxHeroProps) {
  const [offset, setOffset] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Parallax scroll handler with RAF for performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.pageYOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Only enable on larger screens and if motion is allowed
    if (window.innerWidth > 768 && !prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [prefersReducedMotion]);

  const parallaxStyle: React.CSSProperties = {
    transform: prefersReducedMotion ? 'none' : `translateY(${offset * speed}px)`,
    willChange: 'transform',
    transition: prefersReducedMotion ? 'none' : undefined,
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Parallax Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 -z-10"
          style={parallaxStyle}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: '120%',
              top: '-10%',
            }}
          />
          {overlay && (
            <div
              className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900/60"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
