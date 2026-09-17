'use client';

import React, { useEffect, useState } from 'react';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  showPercentage?: boolean;
  position?: 'top' | 'bottom';
}

/**
 * Professional Scroll Progress Indicator
 * Shows reading progress on long pages
 * Used by: Medium, Dev.to, modern blogs
 * 
 * Features:
 * - Smooth progress updates
 * - Optional percentage display
 * - Customizable color and position
 * - Performance optimized
 */
export default function ScrollProgress({
  color = '#3b82f6',
  height = 3,
  showPercentage = false,
  position = 'top'
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;

      setProgress(Math.min(scrollProgress, 100));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <>
      {/* Progress Bar */}
      <div
        className={`fixed left-0 ${positionClass} w-full z-50 transition-opacity duration-300`}
        style={{ 
          height: `${height}px`,
          opacity: progress > 0 ? 1 : 0
        }}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>

      {/* Optional Percentage Display */}
      {showPercentage && progress > 5 && (
        <div
          className="fixed top-20 right-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg text-sm font-semibold"
          style={{ color }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}
