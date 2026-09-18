import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProfileData() {
  try {
    console.log('\n🔧 Updating profile with REAL data...\n');
    
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      console.log('❌ No profile found!');
      return;
    }
    
    console.log('Current profile:', profile.fullName);
    
    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        fullName: 'Dr. Emmanuel Deogratias',
        title: 'Senior Lecturer in Mathematics Education',
        department: 'Department of Mathematics',
        institution: 'Sokoine University of Agriculture (SUA)',
        email: 'emmanuel.deogratias@sua.ac.tz',
        bio: 'Dr. Emmanuel Deogratias is a Senior Lecturer in Mathematics Education at Sokoine University of Agriculture (SUA) in Tanzania. His research focuses on mathematics education, curriculum development, and innovative teaching methodologies in mathematics.',
        officeLocation: 'Department of Mathematics, SUA Campus',
        officeHours: 'Monday-Friday, 10:00 AM - 12:00 PM',
        academicProfiles: [
          { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Emmanuel-Deogratias' },
          { label: 'Academia.edu', url: 'https://sua.academia.edu/EmmanuelDeogratias' }
        ],
      }
    });
    
    console.log('\n✅ Profile updated to:');
    console.log('   Name:', updated.fullName);
    console.log('   Title:', updated.title);
    console.log('   Institution:', updated.institution);
    console.log('   Department:', updated.department);
    console.log('\n✅ Done!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixProfileData();
