import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProfileData() {
  try {
    console.log('\n🔍 Checking Profile Data...\n');
    
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      console.log('❌ No profile found in database!');
      console.log('\n📝 Creating default profile...\n');
      
      const newProfile = await prisma.profile.create({
        data: {
          fullName: 'Dr. Emmanuel Deogratias',
          title: 'Senior Lecturer in Mathematics Education',
          department: 'Department of Mathematics',
          institution: 'Sokoine University of Agriculture (SUA)',
          email: 'emmanuel.deogratias@sua.ac.tz',
          officeLocation: 'Office Building, Room TBA',
          officeHours: 'Monday-Friday, 10:00 AM - 12:00 PM',
          bio: 'Dr. Emmanuel Deogratias is a dedicated mathematics education researcher and lecturer at Sokoine University of Agriculture.',
          photoUrl: '',
          navbarPhotoUrl: '',
          heroPhotoUrl: '',
          aboutPhotoUrl: '',
          contactPhotoUrl: '',
          footerPhotoUrl: '',
          adminPhotoUrl: '',
          cvUrl: '',
          academicProfiles: [
            { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Emmanuel-Deogratias' },
            { label: 'Academia.edu', url: 'https://sua.academia.edu/EmmanuelDeogratias' }
          ],
          skills: [],
          languages: ['English', 'Swahili'],
          memberships: [],
          education: [],
          workExperience: [],
          certifications: [],
          faq: [],
          leadershipPositions: [],
          mediaAppearances: [],
        }
      });
      
      console.log('✅ Profile created:', newProfile.fullName);
    } else {
      console.log('✅ Profile found:', profile.fullName);
      console.log('\n📋 Profile Details:');
      console.log('   Title:', profile.title || 'NOT SET');
      console.log('   Department:', profile.department || 'NOT SET');
      console.log('   Institution:', profile.institution || 'NOT SET');
      console.log('   Email:', profile.email || 'NOT SET');
      console.log('   Bio:', profile.bio ? `${profile.bio.substring(0, 50)}...` : 'NOT SET');
      console.log('   Office Location:', profile.officeLocation || 'NOT SET');
      console.log('   Office Hours:', profile.officeHours || 'NOT SET');
      
      // Check for missing required fields
      const missingFields = [];
      if (!profile.fullName) missingFields.push('fullName');
      if (!profile.title) missingFields.push('title');
      if (!profile.department) missingFields.push('department');
      if (!profile.institution) missingFields.push('institution');
      if (!profile.email) missingFields.push('email');
      if (!profile.officeLocation) missingFields.push('officeLocation');
      if (!profile.officeHours) missingFields.push('officeHours');
      if (!profile.bio) missingFields.push('bio');
      
      if (missingFields.length > 0) {
        console.log('\n⚠️  Missing required fields:', missingFields.join(', '));
        console.log('\n🔧 Fixing missing fields...\n');
        
        const updateData = {};
        if (!profile.fullName) updateData.fullName = 'Dr. Emmanuel Deogratias';
        if (!profile.title) updateData.title = 'Senior Lecturer in Mathematics Education';
        if (!profile.department) updateData.department = 'Department of Mathematics';
        if (!profile.institution) updateData.institution = 'Sokoine University of Agriculture (SUA)';
        if (!profile.email) updateData.email = 'emmanuel.deogratias@sua.ac.tz';
        if (!profile.officeLocation) updateData.officeLocation = 'Office Building, Room TBA';
        if (!profile.officeHours) updateData.officeHours = 'Monday-Friday, 10:00 AM - 12:00 PM';
        if (!profile.bio) updateData.bio = 'Dr. Emmanuel Deogratias is a dedicated mathematics education researcher and lecturer at Sokoine University of Agriculture.';
        
        const updated = await prisma.profile.update({
          where: { id: profile.id },
          data: updateData
        });
        
        console.log('✅ Profile updated with missing fields');
      } else {
        console.log('\n✅ All required fields are present');
      }
    }
    
    console.log('\n✅ Profile check complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

checkProfileData();
