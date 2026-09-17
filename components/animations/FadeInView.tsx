'use client';

import React, { ReactNode } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  blur?: boolean;
  scale?: boolean;
}

/**
 * Enhanced Fade-In Component
 * Modern entrance animation with multiple effects
 * 
 * Features:
 * - Fade in with optional blur
 * - Scale effect for depth
 * - Customizable timing
 * - Accessibility compliant
 * - Performance optimized
 * 
 * Perfect for: Images, cards, content sections
 */
export default function FadeInView({
  children,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = '',
  blur = false,
  scale = false
}: FadeInViewProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getInitialStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: 1 };
    }

    return {
      opacity: 0,
      filter: blur ? 'blur(10px)' : undefined,
      transform: scale ? 'scale(0.95)' : undefined,
    };
  };

  const getAnimatedStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: 1 };
    }

    return {
      opacity: inView ? 1 : 0,
      filter: inView ? (blur ? 'blur(0px)' : undefined) : (blur ? 'blur(10px)' : undefined),
      transform: inView ? 'scale(1)' : (scale ? 'scale(0.95)' : undefined),
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={inView || prefersReducedMotion ? getAnimatedStyle() : getInitialStyle()}
    >
      {children}
    </div>
  );
}

// Pre-configured variants
export function FadeInBlur({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <FadeInView blur delay={delay} className={className}>
      {children}
    </FadeInView>
  );
}

export function FadeInScale({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <FadeInView scale delay={delay} className={className}>
      {children}
    </FadeInView>
  );
}

export function FadeInBlurScale({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <FadeInView blur scale delay={delay} className={className}>
      {children}
    </FadeInView>
  );
}
