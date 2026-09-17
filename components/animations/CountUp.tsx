'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  start?: number;
  delay?: number;
}

/**
 * Professional Count-Up Animation Component
 * Animates numbers from start to end when scrolled into view
 * Used by: Apple, Google Analytics dashboards, statistics sections
 * 
 * Features:
 * - Smooth easing function
 * - Triggers only when in viewport
 * - Supports decimals and formatting
 * - Performance optimized with RAF
 * - Runs only once
 */
export default function CountUp({
  end,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  start = 0,
  delay = 0
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!inView || hasAnimated) return;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime + delay;
      }

      const elapsed = currentTime - startTimeRef.current;

      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - ease out cubic for natural deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (end - start) * easeOutCubic;
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setHasAnimated(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [inView, end, start, duration, delay, hasAnimated]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    
    // Add thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    return parts.join('.');
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

// Pre-configured variants
export function CountUpPercent({ end, className = '' }: { end: number; className?: string }) {
  return <CountUp end={end} suffix="%" className={className} />;
}

export function CountUpPlus({ end, className = '' }: { end: number; className?: string }) {
  return <CountUp end={end} suffix="+" className={className} />;
}

export function CountUpCurrency({ end, className = '' }: { end: number; className?: string }) {
  return <CountUp end={end} prefix="$" decimals={2} className={className} />;
}
