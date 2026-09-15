'use client';

import React, { ReactNode } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface SlideCardProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  hover?: boolean;
}

/**
 * Universal Slide Card Component - IMPROVED VERSION
 * Add smooth slide animations to any card from any direction
 * - Better visibility with reduced distance
 * - Smoother animations with optimized easing
 * - Prevents overflow/clipping issues
 * - Professional hover effects
 * 
 * Usage:
 * <SlideCard direction="left">
 *   <YourCard />
 * </SlideCard>
 */
export default function SlideCard({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 40, // Reduced from 60 for better visibility
  className = '',
  hover = true
}: SlideCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.05, // Reduced from 0.1 - triggers earlier
    triggerOnce: true
  });

  const directionStyles: Record<string, React.CSSProperties> = {
    up: {
      transform: inView ? 'translateY(0)' : `translateY(${distance}px)`,
      opacity: inView ? 1 : 0
    },
    down: {
      transform: inView ? 'translateY(0)' : `translateY(-${distance}px)`,
      opacity: inView ? 1 : 0
    },
    left: {
      transform: inView ? 'translateX(0)' : `translateX(${distance}px)`,
      opacity: inView ? 1 : 0
    },
    right: {
      transform: inView ? 'translateX(0)' : `translateX(-${distance}px)`,
      opacity: inView ? 1 : 0
    }
  };

  const baseStyle: React.CSSProperties = {
    ...directionStyles[direction],
    // Improved easing curve for smoother animation
    transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity ${duration}s ease-out ${delay}s`,
    willChange: 'transform, opacity'
  };

  return (
    <div
      ref={ref}
      className={`${className} ${hover ? 'hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1' : ''} transition-all duration-300 ease-out`}
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
