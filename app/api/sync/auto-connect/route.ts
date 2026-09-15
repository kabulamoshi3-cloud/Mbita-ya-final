import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Auto-connect accounts from Profile's academicProfiles
 * Extracts IDs from URLs and creates ConnectedAccount entries
 */

// Extract Google Scholar ID from URL
function extractScholarId(url: string): string | null {
  if (!url) return null;
  // https://scholar.google.com/citations?user=ABC123 or ?hl=en&user=ABC123
  const match = url.match(/[?&]user=([^&]+)/);
  return match ? match[1] : null;
}

// Extract ORCID ID from URL
function extractOrcidId(url: string): string | null {
  if (!url) return null;
  // https://orcid.org/0000-0001-2345-6789
  const match = url.match(/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/);
  return match ? match[1] : null;
}

// Extract ResearchGate username from URL
function extractResearchGateId(url: string): string | null {
  if (!url) return null;
  // https://www.researchgate.net/profile/John-Doe
  const match = url.match(/profile\/([^/?]+)/);
  return match ? match[1] : null;
}

// Extract LinkedIn username from URL
function extractLinkedInId(url: string): string | null {
  if (!url) return null;
  // https://www.linkedin.com/in/johndoe
  const match = url.match(/linkedin\.com\/in\/([^/?]+)/);
  return match ? match[1] : null;
}

export async function POST() {
  try {
    // Get profile with academic profiles
    const profile = await prisma.profile.findFirst({
      select: {
        id: true,
        fullName: true,
        academicProfiles: true,
      },
    });

    if (!profile) {
      return NextResponse.json({
        success: false,
        error: "Profile not found",
      }, { status: 404 });
    }

    const academicProfiles = profile.academicProfiles as any || {};
    const results = [];
    let connected = 0;
    let skipped = 0;

    // Google Scholar
    if (academicProfiles.googleScholar) {
      const scholarId = extractScholarId(academicProfiles.googleScholar);
      if (scholarId) {
        try {
          await prisma.connectedAccount.upsert({
            where: {
              platform_accountId: {
                platform: "google-scholar",
                accountId: scholarId,
              },
            },
            create: {
              platform: "google-scholar",
              accountId: scholarId,
              isActive: true,
              syncStatus: "pending",
              metadata: { source: "academicProfiles" },
            },
            update: {
              isActive: true,
              metadata: { source: "academicProfiles" },
            },
          });
          results.push({ platform: "Google Scholar", id: scholarId, status: "connected" });
          connected++;
        } catch (error: any) {
          results.push({ platform: "Google Scholar", status: "error", error: error.message });
        }
      } else {
        results.push({ platform: "Google Scholar", status: "skipped", reason: "Invalid URL format" });
        skipped++;
      }
    }

    // ORCID
    if (academicProfiles.orcid) {
      const orcidId = extractOrcidId(academicProfiles.orcid);
      if (orcidId) {
        try {
          await prisma.connectedAccount.upsert({
            where: {
              platform_accountId: {
                platform: "orcid",
                accountId: orcidId,
              },
            },
            create: {
              platform: "orcid",
              accountId: orcidId,
              isActive: true,
              syncStatus: "pending",
              metadata: { source: "academicProfiles" },
            },
            update: {
              isActive: true,
              metadata: { source: "academicProfiles" },
            },
          });
          results.push({ platform: "ORCID", id: orcidId, status: "connected" });
          connected++;
        } catch (error: any) {
          results.push({ platform: "ORCID", status: "error", error: error.message });
        }
      } else {
        results.push({ platform: "ORCID", status: "skipped", reason: "Invalid URL format" });
        skipped++;
      }
    }

    // ResearchGate
    if (academicProfiles.researchGate) {
      const rgId = extractResearchGateId(academicProfiles.researchGate);
      if (rgId) {
        try {
          await prisma.connectedAccount.upsert({
            where: {
              platform_accountId: {
                platform: "researchgate",
                accountId: rgId,
              },
            },
            create: {
              platform: "researchgate",
              accountId: rgId,
              isActive: false, // Not implemented yet
              syncStatus: "pending",
              metadata: { source: "academicProfiles", note: "Not yet implemented" },
            },
            update: {
              metadata: { source: "academicProfiles", note: "Not yet implemented" },
            },
          });
          results.push({ platform: "ResearchGate", id: rgId, status: "connected (not active - no API)" });
          connected++;
        } catch (error: any) {
          results.push({ platform: "ResearchGate", status: "error", error: error.message });
        }
      } else {
        results.push({ platform: "ResearchGate", status: "skipped", reason: "Invalid URL format" });
        skipped++;
      }
    }

    // LinkedIn
    if (academicProfiles.linkedin) {
      const linkedinId = extractLinkedInId(academicProfiles.linkedin);
      if (linkedinId) {
        try {
          await prisma.connectedAccount.upsert({
            where: {
              platform_accountId: {
                platform: "linkedin",
                accountId: linkedinId,
              },
            },
            create: {
              platform: "linkedin",
              accountId: linkedinId,
              isActive: false, // Not implemented yet
              syncStatus: "pending",
              metadata: { source: "academicProfiles", note: "Not yet implemented" },
            },
            update: {
              metadata: { source: "academicProfiles", note: "Not yet implemented" },
            },
          });
          results.push({ platform: "LinkedIn", id: linkedinId, status: "connected (not active - no API)" });
          connected++;
        } catch (error: any) {
          results.push({ platform: "LinkedIn", status: "error", error: error.message });
        }
      } else {
        results.push({ platform: "LinkedIn", status: "skipped", reason: "Invalid URL format" });
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auto-connected ${connected} accounts from academic profiles`,
      connected,
      skipped,
      results,
      nextSteps: [
        "Note: Google Scholar requires SerpAPI key - add it via /admin/auto-sync",
        "Note: ORCID requires OAuth token - add it via /admin/auto-sync",
        "Visit /admin/auto-sync to manage and sync",
      ],
    });

  } catch (error: any) {
    console.error('Error auto-connecting accounts:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to auto-connect accounts",
      details: error.message,
    }, { status: 500 });
  }
}

// GET endpoint for browser access
export async function GET() {
  return POST();
}
