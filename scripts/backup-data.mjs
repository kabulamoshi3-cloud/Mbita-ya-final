#!/usr/bin/env node
/**
 * Backup all database data to JSON file
 * Run this manually before deployments to save your data
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

async function backup() {
  console.log('📦 Starting database backup...\n');

  const data = {
    backupDate: new Date().toISOString(),
    adminUser: await prisma.adminUser.findMany(),
    profile: await prisma.profile.findMany(),
    siteSettings: await prisma.siteSettings.findMany(),
    publications: await prisma.publication.findMany(),
    researchProjects: await prisma.researchProject.findMany(),
    courses: await prisma.course.findMany(),
    students: await prisma.student.findMany(),
    awards: await prisma.award.findMany(),
    events: await prisma.event.findMany(),
    collaborators: await prisma.collaborator.findMany(),
    resources: await prisma.resource.findMany(),
    galleryItems: await prisma.galleryItem.findMany(),
    blogPosts: await prisma.blogPost.findMany(),
    testimonials: await prisma.testimonial.findMany(),
    announcements: await prisma.announcement.findMany(),
    teamMembers: await prisma.teamMember.findMany(),
  };

  const filename = `backup-${new Date().toISOString().split('T')[0]}.json`;
  writeFileSync(filename, JSON.stringify(data, null, 2));

  console.log('✅ Backup complete!');
  console.log(`📄 File: ${filename}`);
  console.log('\nData backed up:');
  console.log(`  - Admin Users: ${data.adminUser.length}`);
  console.log(`  - Profile: ${data.profile.length}`);
  console.log(`  - Publications: ${data.publications.length}`);
  console.log(`  - Courses: ${data.courses.length}`);
  console.log(`  - Students: ${data.students.length}`);
  console.log(`  - Awards: ${data.awards.length}`);
  console.log(`  - Events: ${data.events.length}`);
  console.log(`  - Resources: ${data.resources.length}`);
  console.log(`  - Blog Posts: ${data.blogPosts.length}`);
}

backup()
  .catch((e) => {
    console.error('❌ Backup failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
