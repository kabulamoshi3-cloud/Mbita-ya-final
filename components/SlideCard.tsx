'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface SlideCardProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  hover?: boolean;
  scale?: boolean;
}

/**
 * Universal Slide Card Component - PROFESSIONAL VERSION
 * Premium slide animations with:
 * - Smooth spring-like easing for natural movement
 * - Proper client-side rendering
 * - Scale effect for depth perception
 * - Professional hover effects with lift and shadow
 * - Optimized performance
 * 
 * Usage:
 * <SlideCard direction="left" delay={0.1}>
 *   <YourCard />
 * </SlideCard>
 */
export default function SlideCard({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
  hover = true,
  scale = true
}: SlideCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Ensure animations only run on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTransform = () => {
    if (!isMounted || !inView) {
      // Initial state - hidden with offset and scale
      const scaleValue = scale ? 'scale(0.95)' : 'scale(1)';
      switch (direction) {
        case 'up':
          return `translateY(${distance}px) ${scaleValue}`;
        case 'down':
          return `translateY(-${distance}px) ${scaleValue}`;
        case 'left':
          return `translateX(${distance}px) ${scaleValue}`;
        case 'right':
          return `translateX(-${distance}px) ${scaleValue}`;
        default:
          return scaleValue;
      }
    }
    // Final state - visible
    return 'translateY(0) translateX(0) scale(1)';
  };

  const baseStyle: React.CSSProperties = {
    transform: getTransform(),
    opacity: (isMounted && inView) ? 1 : 0,
    transition: isMounted 
      ? `all ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`
      : 'none',
    willChange: 'transform, opacity'
  };

  return (
    <div
      ref={ref}
      className={`${className} ${hover ? 'hover:scale-105 hover:shadow-2xl hover:-translate-y-2' : ''} transition-all duration-300 ease-out`}
      style={baseStyle}
    >
      {children}
    </div>
  );
}

// Pre-configured variants for common use cases

export function SlideCardLeft({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <SlideCard direction="left" delay={delay} className={className}>{children}</SlideCard>;
}

export function SlideCardRight({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <SlideCard direction="right" delay={delay} className={className}>{children}</SlideCard>;
}

export function SlideCardUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <SlideCard direction="up" delay={delay} className={className}>{children}</SlideCard>;
}

export function SlideCardDown({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <SlideCard direction="down" delay={delay} className={className}>{children}</SlideCard>;
}
