/**
 * Auto-Sync from Profile Academic URLs
 * Uses academic profile links directly from Profile.academicProfiles
 * No need for separate ConnectedAccount entries
 */

import { prisma } from "@/lib/prisma";

interface SyncResult {
  success: boolean;
  platform: string;
  itemsFetched: number;
  error?: string;
}

/**
 * Extract profile ID from academic URLs
 */
function extractProfileIds(academicProfiles: any[]): Record<string, string> {
  const ids: Record<string, string> = {};
  
  for (const profile of academicProfiles) {
    const url = profile.url?.toLowerCase() || "";
    const label = profile.label?.toLowerCase() || "";
    
    // Google Scholar
    if (url.includes("scholar.google.") && url.includes("user=")) {
      const match = url.match(/user=([^&]+)/);
      if (match) ids.googleScholar = match[1];
    }
    
    // ORCID
    if (url.includes("orcid.org/")) {
      const match = url.match(/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/);
      if (match) ids.orcid = match[1];
    }
    
    // ResearchGate
    if (url.includes("researchgate.net/profile/")) {
      const match = url.match(/profile\/([^/?]+)/);
      if (match) ids.researchGate = match[1];
    }
    
    // GitHub
    if (url.includes("github.com/") && !url.includes("github.com/orgs")) {
      const match = url.match(/github\.com\/([^/?]+)/);
      if (match) ids.github = match[1];
    }
    
    // LinkedIn
    if (url.includes("linkedin.com/in/")) {
      const match = url.match(/\/in\/([^/?]+)/);
      if (match) ids.linkedin = match[1];
    }
  }
  
  return ids;
}

/**
 * Sync from Google Scholar using SerpAPI
 */
async function syncGoogleScholar(scholarId: string, apiKey?: string): Promise<SyncResult> {
  try {
    if (!apiKey) {
      return { 
        success: false, 
        platform: "Google Scholar", 
        itemsFetched: 0, 
        error: "SerpAPI key required" 
      };
    }
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=${apiKey}&num=100`
    );
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    const articles = data.articles || [];
    
    let imported = 0;
    
    for (const article of articles) {
      const externalId = article.citation_id || article.link || `gs-${article.title}`;
      
      await prisma.syncedContent.upsert({
        where: {
          platform_externalId: {
            platform: "google-scholar",
            externalId,
          },
        },
        create: {
          platform: "google-scholar",
          externalId,
          contentType: "publication",
          title: article.title,
          content: article.snippet || article.title,
          metadata: article,
          authors: article.authors?.split(",").map((a: string) => a.trim()) || [],
          publishedDate: article.year ? new Date(article.year, 0, 1) : null,
          citations: parseInt(article.cited_by?.value || "0"),
          url: article.link,
        },
        update: {
          title: article.title,
          content: article.snippet || article.title,
          metadata: article,
          citations: parseInt(article.cited_by?.value || "0"),
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, platform: "Google Scholar", itemsFetched: imported };
  } catch (error: any) {
    return { 
      success: false, 
      platform: "Google Scholar", 
      itemsFetched: 0, 
      error: error.message 
    };
  }
}

/**
 * Sync from ORCID (public API - no auth needed for public profiles)
 */
async function syncORCID(orcidId: string): Promise<SyncResult> {
  try {
    const response = await fetch(
      `https://pub.orcid.org/v3.0/${orcidId}/works`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    const works = data.group || [];
    
    let imported = 0;
    
    for (const work of works) {
      const summary = work["work-summary"]?.[0];
      if (!summary) continue;
      
      const title = summary.title?.title?.value;
      const putCode = summary["put-code"];
      
      if (!title || !putCode) continue;
      
      await prisma.syncedContent.upsert({
        where: {
          platform_externalId: {
            platform: "orcid",
            externalId: `${orcidId}-${putCode}`,
          },
        },
        create: {
          platform: "orcid",
          externalId: `${orcidId}-${putCode}`,
          contentType: summary.type || "publication",
          title,
          content: summary.title?.subtitle?.value || title,
          metadata: summary,
          authors: [],
          publishedDate: summary["publication-date"]?.year 
            ? new Date(summary["publication-date"].year.value, 0, 1) 
            : null,
          url: summary.url?.value || `https://orcid.org/${orcidId}`,
        },
        update: {
          title,
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, platform: "ORCID", itemsFetched: imported };
  } catch (error: any) {
    return { 
      success: false, 
      platform: "ORCID", 
      itemsFetched: 0, 
      error: error.message 
    };
  }
}

/**
 * Sync from GitHub repositories
 */
async function syncGitHub(username: string): Promise<SyncResult> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const repos = await response.json();
    let imported = 0;
    
    for (const repo of repos) {
      if (repo.fork) continue; // Skip forked repos
      
      await prisma.syncedContent.upsert({
        where: {
          platform_externalId: {
            platform: "github",
            externalId: repo.id.toString(),
          },
        },
        create: {
          platform: "github",
          externalId: repo.id.toString(),
          contentType: "code",
          title: repo.name,
          content: repo.description || repo.name,
          metadata: {
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            topics: repo.topics,
          },
          authors: [repo.owner.login],
          publishedDate: repo.created_at ? new Date(repo.created_at) : null,
          url: repo.html_url,
        },
        update: {
          title: repo.name,
          content: repo.description || repo.name,
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, platform: "GitHub", itemsFetched: imported };
  } catch (error: any) {
    return { 
      success: false, 
      platform: "GitHub", 
      itemsFetched: 0, 
      error: error.message 
    };
  }
}

/**
 * Main sync function - uses academic profile URLs from Profile table
 */
export async function syncFromProfileUrls(serpApiKey?: string): Promise<{
  success: boolean;
  results: SyncResult[];
  total: number;
}> {
  try {
    // Get profile with academic URLs
    const profile = await prisma.profile.findFirst({
      select: {
        id: true,
        academicProfiles: true,
        autoSyncEnabled: true,
      },
    });
    
    if (!profile || !profile.autoSyncEnabled) {
      return {
        success: false,
        results: [{
          success: false,
          platform: "System",
          itemsFetched: 0,
          error: "Auto-sync is not enabled",
        }],
        total: 0,
      };
    }
    
    // Extract profile IDs from URLs
    const ids = extractProfileIds(profile.academicProfiles as any[]);
    
    if (Object.keys(ids).length === 0) {
      return {
        success: false,
        results: [{
          success: false,
          platform: "System",
          itemsFetched: 0,
          error: "No academic profile URLs found. Add them in Profile Settings.",
        }],
        total: 0,
      };
    }
    
    // Sync from each platform
    const results: SyncResult[] = [];
    
    if (ids.googleScholar) {
      const result = await syncGoogleScholar(ids.googleScholar, serpApiKey);
      results.push(result);
    }
    
    if (ids.orcid) {
      const result = await syncORCID(ids.orcid);
      results.push(result);
    }
    
    if (ids.github) {
      const result = await syncGitHub(ids.github);
      results.push(result);
    }
    
    // Update last sync time
    await prisma.profile.update({
      where: { id: profile.id as any },
      data: { lastSyncAt: new Date() },
    });
    
    const totalFetched = results.reduce((sum, r) => sum + r.itemsFetched, 0);
    
    return {
      success: results.some(r => r.success),
      results,
      total: totalFetched,
    };
  } catch (error: any) {
    return {
      success: false,
      results: [{
        success: false,
        platform: "System",
        itemsFetched: 0,
        error: error.message,
      }],
      total: 0,
    };
  }
}
