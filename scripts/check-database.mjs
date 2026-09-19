#!/usr/bin/env node
/**
 * Check what's in the database right now
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log('🔍 Checking database contents...\n');

  try {
    const adminUser = await prisma.adminUser.findMany();
    const profile = await prisma.profile.findMany();
    const publications = await prisma.publication.findMany();
    const courses = await prisma.course.findMany();
    const students = await prisma.student.findMany();
    const awards = await prisma.award.findMany();
    const events = await prisma.event.findMany();
    const resources = await prisma.resource.findMany();

    console.log('📊 Database Status:');
    console.log('==================');
    console.log(`✓ Admin Users: ${adminUser.length}`);
    console.log(`✓ Profile: ${profile.length}`);
    console.log(`✓ Publications: ${publications.length}`);
    console.log(`✓ Courses: ${courses.length}`);
    console.log(`✓ Students: ${students.length}`);
    console.log(`✓ Awards: ${awards.length}`);
    console.log(`✓ Events: ${events.length}`);
    console.log(`✓ Resources: ${resources.length}`);

    console.log('\n📝 Publications:');
    publications.forEach((pub, i) => {
      console.log(`  ${i + 1}. ${pub.title} (${pub.year})`);
    });

    if (publications.length === 0) {
      console.log('  ⚠️  No publications found!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

check()
  .finally(() => prisma.$disconnect());
