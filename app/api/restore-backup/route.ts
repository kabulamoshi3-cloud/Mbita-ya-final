import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import backupData from '../../../backup-2026-09-19.json';

const prisma = new PrismaClient();

// Helper to clean data for Prisma
function cleanData(data: any) {
  const cleaned = { ...data };
  // Convert date strings to Date objects
  if (cleaned.updatedAt) cleaned.updatedAt = new Date(cleaned.updatedAt);
  if (cleaned.createdAt) cleaned.createdAt = new Date(cleaned.createdAt);
  if (cleaned.lastSyncAt) cleaned.lastSyncAt = cleaned.lastSyncAt ? new Date(cleaned.lastSyncAt) : null;
  if (cleaned.lockedUntil) cleaned.lockedUntil = cleaned.lockedUntil ? new Date(cleaned.lockedUntil) : null;
  return cleaned;
}

export async function POST(request: Request) {
  try {
    console.log('🔄 Starting data restore from backup...');

    // Restore Admin Users
    if (backupData.adminUser && backupData.adminUser.length > 0) {
      for (const item of backupData.adminUser) {
        const cleaned = cleanData(item);
        await prisma.adminUser.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.adminUser.length} admin users`);
    }

    // Restore Profile
    if (backupData.profile && backupData.profile.length > 0) {
      for (const item of backupData.profile) {
        const cleaned = cleanData(item);
        await prisma.profile.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.profile.length} profiles`);
    }

    // Restore Site Settings
    if (backupData.siteSettings && backupData.siteSettings.length > 0) {
      for (const item of backupData.siteSettings) {
        const cleaned = cleanData(item);
        await prisma.siteSettings.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.siteSettings.length} site settings`);
    }

    // Restore Publications
    if (backupData.publications && backupData.publications.length > 0) {
      for (const item of backupData.publications) {
        const cleaned = cleanData(item);
        await prisma.publication.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.publications.length} publications`);
    }

    // Restore Courses
    if (backupData.courses && backupData.courses.length > 0) {
      for (const item of backupData.courses) {
        const cleaned = cleanData(item);
        await prisma.course.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.courses.length} courses`);
    }

    // Restore Students
    if (backupData.students && backupData.students.length > 0) {
      for (const item of backupData.students) {
        const cleaned = cleanData(item);
        await prisma.student.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.students.length} students`);
    }

    // Restore Awards
    if (backupData.awards && backupData.awards.length > 0) {
      for (const item of backupData.awards) {
        const cleaned = cleanData(item);
        await prisma.award.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.awards.length} awards`);
    }

    // Restore Events
    if (backupData.events && backupData.events.length > 0) {
      for (const item of backupData.events) {
        const cleaned = cleanData(item);
        await prisma.event.upsert({
          where: { id: cleaned.id },
          update: cleaned,
          create: cleaned,
        });
      }
      console.log(`✓ Restored ${backupData.events.length} awards`);
    }

    console.log('✅ Restore complete!');

    return NextResponse.json({
      success: true,
      message: 'Data restored successfully',
      restored: {
        adminUsers: backupData.adminUser?.length || 0,
        profiles: backupData.profile?.length || 0,
        publications: backupData.publications?.length || 0,
        courses: backupData.courses?.length || 0,
        students: backupData.students?.length || 0,
        awards: backupData.awards?.length || 0,
        events: backupData.events?.length || 0,
      }
    });

  } catch (error: any) {
    console.error('❌ Restore failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
