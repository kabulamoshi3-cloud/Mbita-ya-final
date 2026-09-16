'use client';

import React, { useEffect, useState } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  gradient?: boolean;
}

/**
 * Animated Page Header Component
 * Professional page header with smooth fade-in and slide animations
 * 
 * Usage:
 * <PageHeader 
 *   title="Publications" 
 *   subtitle="Research & Academic Work"
 *   description="Explore my published research papers and academic contributions"
 *   icon="📚"
 *   gradient={true}
 * />
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  icon,
  gradient = true
}: PageHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`relative mb-8 md:mb-12 overflow-hidden ${gradient ? 'pb-8' : ''}`}>
      {/* Background Gradient */}
      {gradient && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl -z-10"
          style={{
            opacity: isMounted ? 1 : 0,
            transition: 'opacity 0.6s ease-out'
          }}
        />
      )}

      {/* Content */}
      <div className={`${gradient ? 'pt-8 px-6 md:px-8' : ''}`}>
        {/* Icon */}
        {icon && (
          <div
            className="text-5xl md:text-6xl mb-4"
            style={{
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {icon}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-3"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-xl md:text-2xl text-indigo-600 font-medium mb-3"
            style={{
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p
            className="text-base md:text-lg text-navy-600 max-w-3xl"
            style={{
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
            }}
          >
            {description}
          </p>
        )}

        {/* Decorative Line */}
        <div
          className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mt-6"
          style={{
            width: isMounted ? '100px' : '0px',
            opacity: isMounted ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
          }}
        />
      </div>
    </div>
  );
}
