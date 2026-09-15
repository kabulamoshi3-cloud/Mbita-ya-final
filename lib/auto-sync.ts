/**
 * Auto-Sync Service
 * Automatically fetches content from connected academic accounts
 * Supports: Google Scholar, ORCID, ResearchGate, GitHub, etc.
 */

import { prisma } from "@/lib/prisma";

// Platform-specific fetchers
interface SyncResult {
  success: boolean;
  itemsFetched: number;
  error?: string;
}

// Google Scholar Scraper (uses serpapi.com or scholarpy)
async function syncGoogleScholar(account: any): Promise<SyncResult> {
  try {
    const scholarId = account.accountId;
    
    // Use SerpAPI or direct scraping
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=${account.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    const articles = data.articles || [];
    
    let imported = 0;
    
    for (const article of articles) {
      await prisma.syncedContent.upsert({
        where: {
          platform_externalId: {
            platform: "google-scholar",
            externalId: article.citation_id || article.link,
          },
        },
        create: {
          platform: "google-scholar",
          externalId: article.citation_id || article.link,
          contentType: "publication",
          title: article.title,
          content: article.snippet || "",
          metadata: article,
          authors: article.authors?.split(",").map((a: string) => a.trim()) || [],
          publishedDate: article.year ? new Date(article.year, 0, 1) : null,
          citations: parseInt(article.cited_by?.value || "0"),
          url: article.link,
        },
        update: {
          title: article.title,
          content: article.snippet || "",
          metadata: article,
          citations: parseInt(article.cited_by?.value || "0"),
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, itemsFetched: imported };
  } catch (error: any) {
    return { success: false, itemsFetched: 0, error: error.message };
  }
}

// ORCID API Integration
async function syncORCID(account: any): Promise<SyncResult> {
  try {
    const orcidId = account.accountId;
    const accessToken = account.accessToken;
    
    const response = await fetch(
      `https://pub.orcid.org/v3.0/${orcidId}/works`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`ORCID API error: ${response.status}`);
    }
    
    const data = await response.json();
    const works = data.group || [];
    
    let imported = 0;
    
    for (const work of works) {
      const summary = work["work-summary"]?.[0];
      if (!summary) continue;
      
      await prisma.syncedContent.upsert({
        where: {
          platform_externalId: {
            platform: "orcid",
            externalId: summary["put-code"].toString(),
          },
        },
        create: {
          platform: "orcid",
          externalId: summary["put-code"].toString(),
          contentType: "publication",
          title: summary.title?.title?.value || "Untitled",
          content: summary.subtitle?.subtitle?.value || "",
          metadata: summary,
          authors: summary.contributors?.contributor?.map((c: any) => 
            c["credit-name"]?.value || ""
          ) || [],
          publishedDate: summary["publication-date"] 
            ? new Date(
                summary["publication-date"].year.value,
                (summary["publication-date"].month?.value || 1) - 1,
                summary["publication-date"].day?.value || 1
              )
            : null,
          url: summary["external-ids"]?.["external-id"]?.[0]?.["external-id-url"]?.value,
        },
        update: {
          title: summary.title?.title?.value || "Untitled",
          content: summary.subtitle?.subtitle?.value || "",
          metadata: summary,
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, itemsFetched: imported };
  } catch (error: any) {
    return { success: false, itemsFetched: 0, error: error.message };
  }
}

// ResearchGate Scraper (no official API)
async function syncResearchGate(account: any): Promise<SyncResult> {
  try {
    // ResearchGate doesn't have public API
    // Would need web scraping or third-party service
    // Placeholder for now
    
    console.log("ResearchGate sync not yet implemented");
    return { success: true, itemsFetched: 0 };
  } catch (error: any) {
    return { success: false, itemsFetched: 0, error: error.message };
  }
}

// GitHub Repositories
async function syncGitHub(account: any): Promise<SyncResult> {
  try {
    const username = account.accountId;
    
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(account.accessToken && { Authorization: `token ${account.accessToken}` }),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    let imported = 0;
    
    for (const repo of repos) {
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
          content: repo.description || "",
          metadata: repo,
          authors: [repo.owner.login],
          publishedDate: new Date(repo.created_at),
          url: repo.html_url,
        },
        update: {
          title: repo.name,
          content: repo.description || "",
          metadata: repo,
          lastFetchedAt: new Date(),
        },
      });
      imported++;
    }
    
    return { success: true, itemsFetched: imported };
  } catch (error: any) {
    return { success: false, itemsFetched: 0, error: error.message };
  }
}

// Main sync function - syncs all connected accounts
export async function syncAllAccounts(): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: any[];
}> {
  const accounts = await prisma.connectedAccount.findMany({
    where: { isActive: true },
  });
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  for (const account of accounts) {
    console.log(`Syncing ${account.platform} account: ${account.accountId}`);
    
    // Update status to syncing
    await prisma.connectedAccount.update({
      where: { id: account.id },
      data: { syncStatus: "syncing" },
    });
    
    let result: SyncResult;
    
    switch (account.platform) {
      case "google-scholar":
        result = await syncGoogleScholar(account);
        break;
      case "orcid":
        result = await syncORCID(account);
        break;
      case "researchgate":
        result = await syncResearchGate(account);
        break;
      case "github":
        result = await syncGitHub(account);
        break;
      default:
        result = { success: false, itemsFetched: 0, error: "Unsupported platform" };
    }
    
    // Update account sync status
    await prisma.connectedAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: result.success ? "success" : "error",
        syncError: result.error || null,
        lastSyncedAt: new Date(),
      },
    });
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
    
    results.push({
      platform: account.platform,
      accountId: account.accountId,
      ...result,
    });
  }
  
  // Update profile last sync time
  await prisma.profile.update({
    where: { id: 1 },
    data: { lastSyncAt: new Date() },
  });
  
  return {
    total: accounts.length,
    successful,
    failed,
    results,
  };
}

// Sync specific platform
export async function syncPlatform(platform: string): Promise<SyncResult> {
  const account = await prisma.connectedAccount.findFirst({
    where: { platform, isActive: true },
  });
  
  if (!account) {
    return { success: false, itemsFetched: 0, error: "Account not found" };
  }
  
  await prisma.connectedAccount.update({
    where: { id: account.id },
    data: { syncStatus: "syncing" },
  });
  
  let result: SyncResult;
  
  switch (platform) {
    case "google-scholar":
      result = await syncGoogleScholar(account);
      break;
    case "orcid":
      result = await syncORCID(account);
      break;
    case "researchgate":
      result = await syncResearchGate(account);
      break;
    case "github":
      result = await syncGitHub(account);
      break;
    default:
      result = { success: false, itemsFetched: 0, error: "Unsupported platform" };
  }
  
  await prisma.connectedAccount.update({
    where: { id: account.id },
    data: {
      syncStatus: result.success ? "success" : "error",
      syncError: result.error || null,
      lastSyncedAt: new Date(),
    },
  });
  
  return result;
}

// Auto-import synced content to main database tables
export async function importSyncedContent(limit = 100): Promise<{
  imported: number;
  skipped: number;
  errors: number;
  details: any[];
}> {
  const content = await prisma.syncedContent.findMany({
    where: { importedToDb: false },
    take: limit,
    orderBy: { publishedDate: "desc" },
  });
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const details = [];
  
  for (const item of content) {
    try {
      let result = null;
      
      // ========================================
      // PUBLICATIONS (Journal, Conference, Book)
      // ========================================
      if (item.contentType === "publication") {
        // Determine publication type from metadata
        const metadata = item.metadata as any;
        let pubType = "journal"; // default
        
        if (metadata?.type?.includes("conference") || metadata?.type?.includes("proceedings")) {
          pubType = "conference";
        } else if (metadata?.type?.includes("book")) {
          pubType = "book";
        } else if (metadata?.type?.includes("chapter")) {
          pubType = "book_chapter";
        } else if (metadata?.type?.includes("report")) {
          pubType = "technical_report";
        }
        
        result = await prisma.publication.create({
          data: {
            title: item.title,
            type: pubType as any,
            abstract: item.content || "",
            year: item.publishedDate?.getFullYear() || new Date().getFullYear(),
            authors: Array.isArray(item.authors) ? item.authors : [String(item.authors || "Unknown")],
            url: item.url || "",
            pdfUrl: metadata?.pdf_url || metadata?.pdfUrl || "",
            doi: metadata?.doi || "",
            venue: metadata?.venue || metadata?.journal || metadata?.conference || "External Source",
            published: true, // Auto-publish synced content
          },
        });
        
        details.push({
          type: "publication",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // RESEARCH PROJECTS
      // ========================================
      else if (item.contentType === "research" || item.contentType === "project") {
        const metadata = item.metadata as any;
        
        result = await prisma.researchProject.create({
          data: {
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100),
            title: item.title,
            description: item.content || "",
            status: metadata?.status === "active" ? "active" : "completed",
            startYear: item.publishedDate?.getFullYear() || new Date().getFullYear(),
            endYear: metadata?.endYear ? parseInt(metadata.endYear) : null,
            fundingSources: metadata?.funding ? [metadata.funding] : [],
            collaborators: Array.isArray(item.authors) ? item.authors : [],
            published: true,
            imageUrl: metadata?.imageUrl || "",
            tags: metadata?.tags || [],
            externalUrl: item.url || "",
          },
        });
        
        details.push({
          type: "research_project",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // CODE REPOSITORIES / GITHUB PROJECTS
      // ========================================
      else if (item.contentType === "code" || item.contentType === "repository") {
        const metadata = item.metadata as any;
        
        // Check if ResearchProject table exists for code projects
        try {
          result = await prisma.researchProject.create({
            data: {
              slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100),
              title: item.title,
              description: item.content || metadata?.description || "",
              status: metadata?.archived ? "completed" : "active",
              startYear: item.publishedDate?.getFullYear() || new Date().getFullYear(),
              collaborators: Array.isArray(item.authors) ? item.authors : [],
              published: true,
              imageUrl: metadata?.owner?.avatar_url || "",
              tags: metadata?.topics || (metadata?.language ? [metadata.language] : []),
              githubUrl: item.url || "",
              externalUrl: item.url || "",
            },
          });
          
          details.push({
            type: "code_repository",
            title: item.title,
            status: "imported",
            id: result.id,
          });
        } catch (err) {
          console.log(`Note: Could not import repository as research project: ${err}`);
          skipped++;
          continue;
        }
      }
      
      // ========================================
      // BLOG POSTS / ARTICLES
      // ========================================
      else if (item.contentType === "blog" || item.contentType === "article") {
        const metadata = item.metadata as any;
        
        result = await prisma.blogPost.create({
          data: {
            title: item.title,
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100),
            excerpt: item.content?.substring(0, 200) || "",
            content: item.content || "",
            draft: false, // Auto-publish synced content
            publishedAt: item.publishedDate || new Date(),
            featuredImage: metadata?.image || "",
            tags: metadata?.tags || [],
          },
        });
        
        details.push({
          type: "blog_post",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // AWARDS / GRANTS / HONORS
      // ========================================
      else if (item.contentType === "award" || item.contentType === "grant" || item.contentType === "honor") {
        const metadata = item.metadata as any;
        
        let category: "award" | "grant" | "fellowship" | "honor" | "distinction" = "award";
        if (item.contentType === "grant") category = "grant";
        if (item.contentType === "honor") category = "honor";
        if (metadata?.type === "fellowship") category = "fellowship";
        
        result = await prisma.award.create({
          data: {
            name: item.title,
            organization: metadata?.organization || metadata?.funder || "External Organization",
            year: item.publishedDate?.getFullYear() || new Date().getFullYear(),
            category: category,
            amount: metadata?.amount || metadata?.funding || null,
            fundingPeriod: metadata?.period || null,
            description: item.content || "",
            imageUrl: metadata?.imageUrl || "",
            published: true,
          },
        });
        
        details.push({
          type: "award",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // COURSES / TEACHING MATERIALS
      // ========================================
      else if (item.contentType === "course" || item.contentType === "teaching") {
        const metadata = item.metadata as any;
        
        result = await prisma.course.create({
          data: {
            name: item.title,
            code: metadata?.code || `EXT-${Date.now()}`,
            term: metadata?.term || `${new Date().getFullYear()}`,
            description: item.content || "",
            status: metadata?.status === "archived" ? "archived" : "active",
            syllabusUrl: metadata?.syllabus || "",
            published: true,
            schedule: metadata?.schedule || null,
            materials: metadata?.materials || null,
            externalUrl: item.url || "",
          },
        });
        
        details.push({
          type: "course",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // EVENTS / CONFERENCES / TALKS
      // ========================================
      else if (item.contentType === "event" || item.contentType === "talk" || item.contentType === "conference") {
        const metadata = item.metadata as any;
        
        result = await prisma.event.create({
          data: {
            name: item.title,
            description: item.content || "",
            date: item.publishedDate || new Date(),
            location: metadata?.location || "External Venue",
            published: true,
            posterImage: metadata?.imageUrl || "",
            externalUrl: item.url || "",
            registrationUrl: metadata?.registrationLink || item.url || "",
            streamUrl: metadata?.meetingLink || metadata?.link || "",
          },
        });
        
        details.push({
          type: "event",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // GALLERY ITEMS (Photos/Videos)
      // ========================================
      else if (item.contentType === "photo" || item.contentType === "video" || item.contentType === "media") {
        const metadata = item.metadata as any;
        
        result = await prisma.galleryItem.create({
          data: {
            imageUrl: item.url || metadata?.url || "",
            alt: item.title,
            caption: item.content || "",
            category: metadata?.category || "research",
            published: true,
          },
        });
        
        details.push({
          type: "gallery_item",
          title: item.title,
          status: "imported",
          id: result.id,
        });
      }
      
      // ========================================
      // UNSUPPORTED CONTENT TYPE
      // ========================================
      else {
        console.log(`Skipping unsupported content type: ${item.contentType}`);
        skipped++;
        details.push({
          type: item.contentType,
          title: item.title,
          status: "skipped",
          reason: "unsupported_type",
        });
        continue;
      }
      
      // Mark as imported
      if (result) {
        await prisma.syncedContent.update({
          where: { id: item.id },
          data: { importedToDb: true },
        });
        imported++;
      }
      
    } catch (error: any) {
      console.error(`Error importing content ${item.id}:`, error);
      errors++;
      details.push({
        type: item.contentType,
        title: item.title,
        status: "error",
        error: error.message,
      });
    }
  }
  
  return {
    imported,
    skipped,
    errors,
    details,
  };
}
