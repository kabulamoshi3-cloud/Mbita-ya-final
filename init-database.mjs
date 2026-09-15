import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function initializeDatabase() {
  console.log('\n🚀 Starting Database Initialization...\n');

  try {
    // Check existing data
    const adminCount = await prisma.adminUser.count();
    const profileCount = await prisma.profile.count();
    
    console.log('📊 Current Status:');
    console.log(`   Admin Users: ${adminCount}`);
    console.log(`   Profiles: ${profileCount}\n`);

    let created = {
      admin: false,
      profile: false,
      settings: false,
      samples: false
    };

    // 1. Create Admin User
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('Mbita@2026', 10);
      await prisma.adminUser.create({
        data: {
          id: 1,
          username: 'Mbita',
          passwordHash,
          failedAttempts: 0,
          totpEnabled: false,
        },
      });
      console.log('✅ Admin user created');
      console.log('   Username: Mbita');
      console.log('   Password: Mbita@2026\n');
      created.admin = true;
    } else {
      const admin = await prisma.adminUser.findFirst();
      console.log(`ℹ️  Admin already exists: ${admin.username}\n`);
    }

    // 2. Create Profile
    if (profileCount === 0) {
      await prisma.profile.create({
        data: {
          id: 1,
          fullName: 'Dr. Deogratis Mbita Emmanuel',
          title: 'Senior Lecturer & Researcher',
          department: 'Department of Computer Science',
          institution: 'University Name',
          email: 'deogratis.mbita@example.com',
          officeLocation: 'Building A, Room 201',
          officeHours: 'Monday-Friday, 2:00 PM - 4:00 PM',
          bio: 'Dr. Deogratis Mbita Emmanuel is a distinguished researcher and educator specializing in computer science and technology.',
          photoUrl: '/images/profile-placeholder.jpg',
          cvUrl: '',
          navbarPhotoUrl: '',
          heroPhotoUrl: '',
          aboutPhotoUrl: '',
          contactPhotoUrl: '',
          footerPhotoUrl: '',
          adminPhotoUrl: '',
          academicProfiles: {
            googleScholar: '',
            researchGate: '',
            orcid: '',
            linkedin: '',
          },
          vision: 'To advance knowledge and innovation in technology for societal impact.',
          mission: 'Empowering students through quality education and cutting-edge research.',
          autoSyncEnabled: false,
        },
      });
      console.log('✅ Profile created\n');
      created.profile = true;
    } else {
      console.log('ℹ️  Profile already exists\n');
    }

    // 3. Create Site Settings
    const settingsCount = await prisma.siteSettings.count();
    if (settingsCount === 0) {
      await prisma.siteSettings.create({
        data: {
          id: 1,
          siteTitle: 'Dr. Deogratis Mbita Emmanuel',
          tagline: 'Academic Portfolio & Research Hub',
          footerText: '© 2026 Dr. Deogratis Mbita Emmanuel. All rights reserved.',
          contactEmail: 'deogratis.mbita@example.com',
          maintenanceMode: false,
          socialLinks: {},
          hiddenSections: [],
          showAnnouncements: true,
          showStats: true,
          showNewsSlider: true,
          showUpcomingEvents: true,
          showPublications: true,
          showTestimonials: true,
          showResearchHighlights: true,
          showAchievements: true,
          showQuickLinks: true,
          heroTitle: 'Welcome to My Academic Portfolio',
          heroSubtitle: 'Advancing Knowledge Through Research and Education',
        },
      });
      console.log('✅ Site settings created\n');
      created.settings = true;
    } else {
      console.log('ℹ️  Site settings already exist\n');
    }

    // 4. Create Sample Data (only if new database)
    if (created.admin && created.profile) {
      // Sample Publication
      await prisma.publication.create({
        data: {
          title: 'Sample Research Publication',
          authors: ['Dr. Deogratis Mbita Emmanuel'],
          venue: 'International Journal of Computer Science',
          year: 2024,
          type: 'journal',
          abstract: 'This is a sample publication. Add your actual research papers through the admin panel.',
          published: true,
        },
      });

      // Sample Course
      await prisma.course.create({
        data: {
          name: 'Introduction to Computer Science',
          code: 'CS101',
          term: 'Fall 2024',
          status: 'active',
          description: 'Sample course. Add your actual courses through the admin panel.',
          published: true,
        },
      });

      // Sample Announcement
      await prisma.announcement.create({
        data: {
          title: 'Welcome to the Academic Portfolio',
          content: 'The website has been successfully set up. Login to the admin panel to customize your content.',
          published: true,
        },
      });

      console.log('✅ Sample data created (publication, course, announcement)\n');
      created.samples = true;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✨ Database Initialization Complete!');
    console.log('='.repeat(50));
    
    if (created.admin || created.profile || created.settings) {
      console.log('\n🔐 Login Credentials:');
      console.log('   URL: https://deogratis-mbita.onrender.com/login');
      console.log('   Username: Mbita');
      console.log('   Password: Mbita@2026');
      console.log('\n⚠️  Remember to change your password after first login!');
    }
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Login to admin panel');
    console.log('   2. Update your profile information');
    console.log('   3. Add your publications, courses, and research');
    console.log('   4. Customize site settings\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
