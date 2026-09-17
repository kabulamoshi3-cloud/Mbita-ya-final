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

  // Add basic navigation items
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
      label: 'Publications',
      href: '/publications',
      icon: '📚',
      description: 'Research publications and papers',
      order: 3,
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
      order: 4,
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
      order: 5,
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
