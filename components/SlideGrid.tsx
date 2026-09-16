'use client';

import React, { ReactNode } from 'react';
import SlideCard from './SlideCard';

interface SlideGridProps {
  children: ReactNode[];
  columns?: 1 | 2 | 3 | 4;
  direction?: 'left' | 'right' | 'up' | 'down' | 'alternate' | 'wave';
  staggerDelay?: number;
  gap?: 4 | 6 | 8;
  className?: string;
}

/**
 * Slide Grid - Professional animated grid layout
 * 
 * Improvements:
 * - Wave pattern for dynamic cascading effect
 * - Better stagger timing for smoother reveals
 * - Improved spacing and responsive behavior
 * - Scale animations for depth
 * 
 * Patterns:
 * - 'alternate': Cards alternate left-right
 * - 'wave': Cards cascade diagonally (recommended)
 * - 'left/right/up/down': All cards slide from same direction
 * 
 * Usage:
 * <SlideGrid columns={3} direction="wave" staggerDelay={0.08}>
 *   <Card1 />
 *   <Card2 />
 *   <Card3 />
 * </SlideGrid>
 */
export default function SlideGrid({
  children,
  columns = 3,
  direction = 'wave',
  staggerDelay = 0.08,
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
      // Alternate between left and right
      return index % 2 === 0 ? 'left' : 'right';
    } else if (direction === 'wave') {
      // Wave pattern - creates diagonal cascade effect
      const row = Math.floor(index / columns);
      const col = index % columns;
      const position = row + col;
      
      if (position % 2 === 0) {
        return 'left';
      } else {
        return 'right';
      }
    }
    return direction;
  };

  const getDelay = (index: number) => {
    if (direction === 'wave') {
      // Wave delay - diagonal cascade
      const row = Math.floor(index / columns);
      const col = index % columns;
      return (row + col) * staggerDelay;
    }
    // Standard sequential delay
    return index * staggerDelay;
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gapClass[gap]} ${className} w-full`}>
      {React.Children.map(children, (child, index) => (
        <SlideCard
          direction={getDirection(index)}
          delay={getDelay(index)}
          duration={0.8}
          distance={50}
          scale={true}
        >
          {child}
        </SlideCard>
      ))}
    </div>
  );
}
