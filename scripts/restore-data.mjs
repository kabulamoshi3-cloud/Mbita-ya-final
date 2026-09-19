#!/usr/bin/env node
/**
 * Restore database data from JSON backup file
 * Usage: node scripts/restore-data.mjs backup-2025-01-15.json
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function restore() {
  const filename = process.argv[2];
  if (!filename) {
    console.error('❌ Please provide backup file: node scripts/restore-data.mjs <backup-file.json>');
    process.exit(1);
  }

  console.log(`📦 Restoring from ${filename}...\n`);

  const data = JSON.parse(readFileSync(filename, 'utf8'));

  // Restore in order (respecting foreign keys)
  
  // 1. Core settings (no dependencies)
  if (data.adminUser?.length) {
    console.log('Restoring admin users...');
    for (const item of data.adminUser) {
      await prisma.adminUser.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.profile?.length) {
    console.log('Restoring profiles...');
    for (const item of data.profile) {
      await prisma.profile.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.siteSettings?.length) {
    console.log('Restoring site settings...');
    for (const item of data.siteSettings) {
      await prisma.siteSettings.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  // 2. Content
  if (data.publications?.length) {
    console.log('Restoring publications...');
    for (const item of data.publications) {
      await prisma.publication.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.researchProjects?.length) {
    console.log('Restoring research projects...');
    for (const item of data.researchProjects) {
      await prisma.researchProject.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.courses?.length) {
    console.log('Restoring courses...');
    for (const item of data.courses) {
      await prisma.course.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.students?.length) {
    console.log('Restoring students...');
    for (const item of data.students) {
      await prisma.student.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.awards?.length) {
    console.log('Restoring awards...');
    for (const item of data.awards) {
      await prisma.award.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.events?.length) {
    console.log('Restoring events...');
    for (const item of data.events) {
      await prisma.event.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.collaborators?.length) {
    console.log('Restoring collaborators...');
    for (const item of data.collaborators) {
      await prisma.collaborator.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.resources?.length) {
    console.log('Restoring resources...');
    for (const item of data.resources) {
      await prisma.resource.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.galleryItems?.length) {
    console.log('Restoring gallery items...');
    for (const item of data.galleryItems) {
      await prisma.galleryItem.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.blogPosts?.length) {
    console.log('Restoring blog posts...');
    for (const item of data.blogPosts) {
      await prisma.blogPost.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.testimonials?.length) {
    console.log('Restoring testimonials...');
    for (const item of data.testimonials) {
      await prisma.testimonial.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.announcements?.length) {
    console.log('Restoring announcements...');
    for (const item of data.announcements) {
      await prisma.announcement.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  if (data.teamMembers?.length) {
    console.log('Restoring team members...');
    for (const item of data.teamMembers) {
      await prisma.teamMember.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  console.log('\n✅ Restore complete!');
  console.log(`📅 Backup was from: ${data.backupDate}`);
}

restore()
  .catch((e) => {
    console.error('❌ Restore failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
