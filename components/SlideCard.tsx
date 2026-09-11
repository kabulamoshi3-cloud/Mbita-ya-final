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
 * Universal Slide Card Component
 * Add slide animations to any card from any direction
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
  duration = 0.6,
  distance = 60,
  className = '',
  hover = true
}: SlideCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
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
    transition: `all ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'transform, opacity'
  };

  return (
    <div
      ref={ref}
      className={`${className} ${hover ? 'hover:scale-105 hover:shadow-2xl hover:-translate-y-2' : ''} transition-all duration-300`}
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
