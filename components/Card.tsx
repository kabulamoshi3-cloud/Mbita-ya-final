'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  badge?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'bordered' | 'gradient' | 'glass';
  className?: string;
}

export default function Card({
  title,
  description,
  image,
  link,
  badge,
  icon,
  footer,
  children,
  variant = 'default',
  className = ''
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-md',
    bordered: 'bg-white border-2 border-blue-500/20',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200',
    glass: 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl'
  };

  const cardContent = (
    <div className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${className}`}>
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {badge && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
              {badge}
            </span>
          )}
        </div>
      )}
      
      <div className="p-6">
        {icon && (
          <div className="mb-4 text-blue-600">
            {icon}
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        {children}
      </div>
      
      {footer && (
        <div className="px-6 pb-6 pt-0">
          {footer}
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block group">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

// Pre-built card variants

export function PublicationCard({ 
  title, 
  authors, 
  year, 
  journal, 
  link 
}: { 
  title: string; 
  authors: string; 
  year: number; 
  journal: string; 
  link?: string;
}) {
  return (
    <Card
      title={title}
      variant="bordered"
      link={link}
      badge={year.toString()}
      footer={
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{authors}</span>
          <span className="text-blue-600 font-medium">{journal}</span>
        </div>
      }
    />
  );
}

export function ResearchCard({
  title,
  description,
  status,
  image,
  link
}: {
  title: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  image?: string;
  link?: string;
}) {
  const statusColors = {
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    upcoming: 'bg-orange-500'
  };

  return (
    <Card
      title={title}
      description={description}
      image={image}
      link={link}
      variant="gradient"
      badge={status.toUpperCase()}
      footer={
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
          <span className="text-sm text-gray-600 capitalize">{status}</span>
        </div>
      }
    />
  );
}

export function EventCard({
  title,
  date,
  time,
  location,
  description,
  image,
  link
}: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  image?: string;
  link?: string;
}) {
  return (
    <Card
      title={title}
      description={description}
      image={image}
      link={link}
      variant="glass"
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      footer={
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {date} at {time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        </div>
      }
    />
  );
}

export function BlogCard({
  title,
  excerpt,
  author,
  date,
  readTime,
  image,
  category,
  link
}: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  category?: string;
  link?: string;
}) {
  return (
    <Card
      title={title}
      description={excerpt}
      image={image}
      link={link}
      variant="default"
      badge={category}
      footer={
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
          <span>{readTime} read</span>
        </div>
      }
    />
  );
}
