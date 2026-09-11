'use client';

import React, { ReactNode } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface AnimatedCardProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'popIn' | 'flipIn' | 'blurIn';
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'tilt' | 'borderGlow' | 'none';
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedCard({
  children,
  animation = 'fadeInUp',
  hoverEffect = 'lift',
  delay = 0,
  className = '',
  onClick
}: AnimatedCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true
  });

  const animationStyles: Record<string, React.CSSProperties> = {
    fadeInUp: inView ? {
      animation: `fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'translateY(60px)' },
    
    fadeInDown: inView ? {
      animation: `fadeInDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'translateY(-60px)' },
    
    fadeInLeft: inView ? {
      animation: `fadeInLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'translateX(-60px)' },
    
    fadeInRight: inView ? {
      animation: `fadeInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'translateX(60px)' },
    
    scaleIn: inView ? {
      animation: `scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'scale(0.8)' },
    
    popIn: inView ? {
      animation: `popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'scale(0.5)' },
    
    flipIn: inView ? {
      animation: `flipIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`
    } : { opacity: 0, transform: 'perspective(1000px) rotateY(-90deg)' },
    
    blurIn: inView ? {
      animation: `blurIn 0.7s ease-out ${delay}s forwards`
    } : { opacity: 0, filter: 'blur(10px)' }
  };

  const hoverClasses: Record<string, string> = {
    lift: 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out',
    scale: 'hover:scale-105 transition-transform duration-300 ease-out',
    glow: 'hover:shadow-blue-500/40 hover:shadow-xl transition-shadow duration-300',
    tilt: 'hover:rotate-1 transition-transform duration-300 ease-out',
    borderGlow: 'border-2 border-transparent hover:border-blue-500 transition-colors duration-300',
    none: ''
  };

  return (
    <div
      ref={ref}
      className={`${className} ${hoverClasses[hoverEffect]}`}
      style={animationStyles[animation]}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
