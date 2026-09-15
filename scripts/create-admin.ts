import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { id: 1 },
    update: { username, passwordHash },
    create: {
      id: 1,
      username,
      passwordHash,
    },
  });

  console.log(`✅ Admin user created/updated:`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Please change the password after first login!`);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
