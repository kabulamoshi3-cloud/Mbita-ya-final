'use client';

import React, { ReactNode } from 'react';
import AnimatedCard from './AnimatedCard';

interface AnimatedGridProps {
  children: ReactNode[];
  columns?: 1 | 2 | 3 | 4;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'popIn' | 'flipIn' | 'blurIn';
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'tilt' | 'borderGlow' | 'none';
  staggerDelay?: number;
  className?: string;
  gap?: 4 | 6 | 8;
}

export default function AnimatedGrid({
  children,
  columns = 3,
  animation = 'fadeInUp',
  hoverEffect = 'lift',
  staggerDelay = 0.1,
  className = '',
  gap = 6
}: AnimatedGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gapClass[gap]} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <AnimatedCard
          animation={animation}
          hoverEffect={hoverEffect}
          delay={index * staggerDelay}
        >
          {child}
        </AnimatedCard>
      ))}
    </div>
  );
}
