import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating academic profile links...');

  const academicProfiles = [
    { label: "Google Scholar", url: "https://scholar.google.com/citations?user=JEeMxH0AAAAJ" },
    { label: "ORCID", url: "https://orcid.org/0000-0000-0000-0000" },
    { label: "ResearchGate", url: "https://www.researchgate.net/profile/Emmanuel-Deogratias" },
    { label: "GitHub", url: "https://github.com/mbita-deo" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/emmanuel-deogratias-mbita" },
    { label: "Scopus", url: "https://www.scopus.com/authid/detail.uri?authorId=0000000000" },
    { label: "Academia.edu", url: "https://sua.academia.edu/EmmanuelMbita" }
  ];

  const profile = await prisma.profile.updateMany({
    data: {
      academicProfiles: academicProfiles
    }
  });

  console.log('✅ Academic profile links updated!');
  console.log('Updated profiles:', profile.count);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
