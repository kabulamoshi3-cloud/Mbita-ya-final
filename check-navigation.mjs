import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNavigation() {
  try {
    const navCount = await prisma.navigationMenu.count();
    console.log(`\n📊 Navigation Menu Items: ${navCount}`);
    
    if (navCount > 0) {
      const items = await prisma.navigationMenu.findMany({
        select: {
          id: true,
          label: true,
          href: true,
          isVisible: true,
        }
      });
      console.log('\nItems:');
      items.forEach(item => {
        console.log(`  - ${item.label} (${item.href}) - Visible: ${item.isVisible}`);
      });
    } else {
      console.log('✅ NavigationMenu is empty - using hardcoded Navbar with glassmorphism');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkNavigation();
