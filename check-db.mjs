import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const adminCount = await prisma.adminUser.count();
    const profileCount = await prisma.profile.count();
    const settingsCount = await prisma.siteSettings.count();
    
    console.log('\n📊 Database Status:');
    console.log('==================');
    console.log(`Admin Users: ${adminCount}`);
    console.log(`Profiles: ${profileCount}`);
    console.log(`Site Settings: ${settingsCount}`);
    
    if (adminCount === 0) {
      console.log('\n⚠️  No admin account found!');
      console.log('Run initialization: node init-db.mjs');
    } else {
      const admin = await prisma.adminUser.findFirst();
      console.log(`\n✅ Admin exists: ${admin.username}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
