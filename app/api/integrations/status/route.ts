import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get profile with academic links
    const profile = await prisma.profile.findFirst({
      select: {
        academicProfiles: true,
      },
    });

    // Get connected accounts from database
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: { isActive: true },
    });

    // Map academic profiles to platform status
    const academicProfiles = Array.isArray(profile?.academicProfiles) 
      ? profile.academicProfiles as Array<{label: string, url: string}>
      : [];

    const platforms = [
      {
        id: 'google_scholar',
        name: 'Google Scholar',
        icon: '🎓',
        description: 'Sync publications, citations, and h-index',
        status: getAccountStatus('google_scholar', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('Google Scholar', academicProfiles),
        lastSyncedAt: getLastSync('google_scholar', connectedAccounts),
        syncedCount: getSyncedCount('google_scholar', connectedAccounts),
        category: 'academic',
      },
      {
        id: 'orcid',
        name: 'ORCID',
        icon: '🆔',
        description: 'Sync publications with DOI and career information',
        status: getAccountStatus('orcid', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('ORCID', academicProfiles),
        lastSyncedAt: getLastSync('orcid', connectedAccounts),
        syncedCount: getSyncedCount('orcid', connectedAccounts),
        category: 'academic',
      },
      {
        id: 'researchgate',
        name: 'ResearchGate',
        icon: '🔬',
        description: 'Sync papers, projects, and Q&A',
        status: getAccountStatus('researchgate', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('ResearchGate', academicProfiles),
        lastSyncedAt: getLastSync('researchgate', connectedAccounts),
        syncedCount: getSyncedCount('researchgate', connectedAccounts),
        category: 'academic',
      },
      {
        id: 'scopus',
        name: 'Scopus',
        icon: '📊',
        description: 'Sync citation metrics and author metrics',
        status: getAccountStatus('scopus', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('Scopus', academicProfiles),
        lastSyncedAt: getLastSync('scopus', connectedAccounts),
        syncedCount: getSyncedCount('scopus', connectedAccounts),
        category: 'academic',
      },
      {
        id: 'academia',
        name: 'Academia.edu',
        icon: '🏛️',
        description: 'Sync papers and research interests',
        status: getAccountStatus('academia', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('Academia.edu', academicProfiles),
        lastSyncedAt: getLastSync('academia', connectedAccounts),
        syncedCount: getSyncedCount('academia', connectedAccounts),
        category: 'academic',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        description: 'Sync professional experience and posts',
        status: getAccountStatus('linkedin', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('LinkedIn', academicProfiles),
        lastSyncedAt: getLastSync('linkedin', connectedAccounts),
        syncedCount: getSyncedCount('linkedin', connectedAccounts),
        category: 'social',
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: '💻',
        description: 'Sync code repositories and contributions',
        status: getAccountStatus('github', academicProfiles, connectedAccounts),
        profileUrl: getProfileUrl('GitHub', academicProfiles),
        lastSyncedAt: getLastSync('github', connectedAccounts),
        syncedCount: getSyncedCount('github', connectedAccounts),
        category: 'social',
      },
    ];

    return NextResponse.json({ success: true, platforms });
  } catch (error: any) {
    console.error('Error fetching platform status:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getAccountStatus(
  platformId: string,
  academicProfiles: Array<{label: string, url: string}>,
  connectedAccounts: any[]
): 'connected' | 'disconnected' | 'syncing' | 'error' {
  // Check if profile URL exists
  const hasProfile = academicProfiles.some(p => 
    p.label.toLowerCase().includes(platformId.replace('_', ' ')) ||
    p.url.toLowerCase().includes(platformId.replace('_', ''))
  );

  // Check connected account
  const account = connectedAccounts.find(a => a.platform === platformId);
  
  if (account) {
    if (account.syncStatus === 'syncing') return 'syncing';
    if (account.syncStatus === 'error') return 'error';
    return 'connected';
  }

  return hasProfile ? 'connected' : 'disconnected';
}

function getProfileUrl(
  label: string,
  academicProfiles: Array<{label: string, url: string}>
): string | undefined {
  const profile = academicProfiles.find(p => p.label === label);
  return profile?.url;
}

function getLastSync(
  platformId: string,
  connectedAccounts: any[]
): string | undefined {
  const account = connectedAccounts.find(a => a.platform === platformId);
  return account?.lastSyncedAt?.toISOString();
}

function getSyncedCount(
  platformId: string,
  connectedAccounts: any[]
): number | undefined {
  const account = connectedAccounts.find(a => a.platform === platformId);
  const metadata = account?.metadata as any;
  return metadata?.syncedCount;
}
