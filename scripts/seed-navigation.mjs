/**
 * Seed Navigation Menu for Dr. Emmanuel Deogratias Website
 * Run this to populate the navigation menu in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding navigation menu...');

  // Clear existing menu items
  await prisma.navigationMenu.deleteMany({});
  console.log('🧹 Cleared existing navigation menu');

  // Add complete navigation items
  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: '🏠',
      description: 'Homepage',
      order: 1,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'About',
      href: '/about',
      icon: '👤',
      description: 'Learn about Dr. Emmanuel Deogratias',
      order: 2,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Research',
      href: '/research',
      icon: '🔬',
      description: 'Research projects and work',
      order: 3,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Publications',
      href: '/publications',
      icon: '📚',
      description: 'Research publications and papers',
      order: 4,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Teaching',
      href: '/teaching',
      icon: '🎓',
      description: 'Courses and teaching materials',
      order: 5,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Students',
      href: '/students',
      icon: '👩‍🎓',
      description: 'Current students and supervision',
      order: 6,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: '✍️',
      description: 'Blog posts and articles',
      order: 7,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Events',
      href: '/events',
      icon: '📅',
      description: 'Upcoming and past events',
      order: 8,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Gallery',
      href: '/gallery',
      icon: '🖼️',
      description: 'Photos and media',
      order: 9,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: '📧',
      description: 'Get in touch',
      order: 10,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      isMegaMenu: false,
    },
  ];

  for (const item of navItems) {
    await prisma.navigationMenu.create({ data: item });
  }

  console.log('✅ Navigation menu seeded successfully!');
  console.log(`📊 Added ${navItems.length} menu items`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding navigation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
