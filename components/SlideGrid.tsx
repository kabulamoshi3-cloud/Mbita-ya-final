'use client';

import React, { ReactNode } from 'react';
import SlideCard from './SlideCard';

interface SlideGridProps {
  children: ReactNode[];
  columns?: 1 | 2 | 3 | 4;
  direction?: 'left' | 'right' | 'up' | 'down' | 'alternate';
  staggerDelay?: number;
  gap?: 4 | 6 | 8;
  className?: string;
}

/**
 * Slide Grid - Automatically animates all cards in a grid - IMPROVED VERSION
 * 
 * Improvements:
 * - Better stagger timing for smoother reveals
 * - Improved spacing and layout
 * - Better responsive behavior
 * 
 * Usage:
 * <SlideGrid columns={3} direction="alternate">
 *   <Card1 />
 *   <Card2 />
 *   <Card3 />
 * </SlideGrid>
 */
export default function SlideGrid({
  children,
  columns = 3,
  direction = 'alternate',
  staggerDelay = 0.08, // Reduced from 0.1 for smoother stagger
  gap = 6,
  className = ''
}: SlideGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  const getDirection = (index: number) => {
    if (direction === 'alternate') {
      // Alternate between left and right for more dynamic effect
      return index % 2 === 0 ? 'left' : 'right';
    }
    return direction;
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gapClass[gap]} ${className} w-full`}>
      {React.Children.map(children, (child, index) => (
        <SlideCard
          direction={getDirection(index)}
          delay={index * staggerDelay}
          duration={0.7}
          distance={40}
        >
          {child}
        </SlideCard>
      ))}
    </div>
  );
}
