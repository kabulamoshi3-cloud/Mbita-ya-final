/**
 * Deduplication utilities for publications synced from multiple platforms
 * 
 * Strategy:
 * 1. DOI matching (highest confidence)
 * 2. Title + Year exact match (high confidence)
 * 3. Fuzzy title matching with year (medium confidence, threshold 85%)
 * 4. Title normalization to handle variations
 */

import { PrismaClient, Publication, PublicationType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Normalize a title for comparison by:
 * - Converting to lowercase
 * - Removing punctuation
 * - Removing extra whitespace
 * - Removing common stop words
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
    .replace(/\b(the|a|an|and|or|of|in|on|at|to|for|with|from|by)\b/g, '') // Remove common words
    .replace(/\s+/g, ' ') // Collapse whitespace again
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching of titles
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str1.length][str2.length];
}

/**
 * Calculate similarity percentage between two strings
 * Returns a value between 0 (completely different) and 100 (identical)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100; // Both empty strings

  const distance = levenshteinDistance(str1, str2);
  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Check if a publication matches an existing one based on DOI
 */
export async function findByDOI(doi: string): Promise<Publication | null> {
  if (!doi || doi.trim() === '') return null;

  return await prisma.publication.findFirst({
    where: {
      doi: {
        equals: doi.trim().toLowerCase(),
        mode: 'insensitive',
      },
    },
  });
}

/**
 * Check if a publication matches an existing one based on exact title and year
 */
export async function findByTitleAndYear(
  title: string,
  year: number
): Promise<Publication | null> {
  const normalizedTitle = normalizeTitle(title);

  const allPubs = await prisma.publication.findMany({
    where: { year },
  });

  // Check each publication for normalized title match
  for (const pub of allPubs) {
    if (normalizeTitle(pub.title) === normalizedTitle) {
      return pub;
    }
  }

  return null;
}

/**
 * Check if a publication matches an existing one using fuzzy title matching
 * Returns the best match if similarity is above threshold (default 85%)
 */
export async function findByFuzzyTitle(
  title: string,
  year: number,
  threshold: number = 85
): Promise<{ publication: Publication; similarity: number } | null> {
  const normalizedTitle = normalizeTitle(title);

  // Get publications from the same year and adjacent years
  const allPubs = await prisma.publication.findMany({
    where: {
      year: {
        gte: year - 1,
        lte: year + 1,
      },
    },
  });

  let bestMatch: { publication: Publication; similarity: number } | null = null;

  for (const pub of allPubs) {
    const pubNormalizedTitle = normalizeTitle(pub.title);
    const similarity = calculateSimilarity(normalizedTitle, pubNormalizedTitle);

    if (similarity >= threshold) {
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { publication: pub, similarity };
      }
    }
  }

  return bestMatch;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchedPublication?: Publication;
  matchMethod?: 'doi' | 'exact' | 'fuzzy';
  confidence?: 'high' | 'medium';
  similarity?: number;
}

/**
 * Main deduplication function
 * Checks if a publication already exists using multiple strategies
 */
export async function checkForDuplicate(
  title: string,
  year: number,
  doi?: string | null
): Promise<DuplicateCheckResult> {
  // Strategy 1: DOI matching (highest confidence)
  if (doi) {
    const matchByDOI = await findByDOI(doi);
    if (matchByDOI) {
      return {
        isDuplicate: true,
        matchedPublication: matchByDOI,
        matchMethod: 'doi',
        confidence: 'high',
      };
    }
  }

  // Strategy 2: Exact title + year match (high confidence)
  const matchByExact = await findByTitleAndYear(title, year);
  if (matchByExact) {
    return {
      isDuplicate: true,
      matchedPublication: matchByExact,
      matchMethod: 'exact',
      confidence: 'high',
    };
  }

  // Strategy 3: Fuzzy title matching (medium confidence)
  const matchByFuzzy = await findByFuzzyTitle(title, year, 85);
  if (matchByFuzzy) {
    return {
      isDuplicate: true,
      matchedPublication: matchByFuzzy.publication,
      matchMethod: 'fuzzy',
      confidence: 'medium',
      similarity: matchByFuzzy.similarity,
    };
  }

  // No duplicate found
  return { isDuplicate: false };
}

export interface ImportResult {
  imported: number;
  skipped: number;
  updated: number;
  errors: number;
  details: Array<{
    title: string;
    action: 'imported' | 'skipped' | 'updated' | 'error';
    reason?: string;
  }>;
}

/**
 * Import publications from SyncedContent to Publication table
 * with deduplication and merging
 */
export async function importSyncedPublications(
  platform?: string
): Promise<ImportResult> {
  const result: ImportResult = {
    imported: 0,
    skipped: 0,
    updated: 0,
    errors: 0,
    details: [],
  };

  try {
    // Get all unimported synced content (or filter by platform)
    const syncedPubs = await prisma.syncedContent.findMany({
      where: {
        contentType: 'publication',
        importedToDb: false,
        ...(platform && { platform }),
      },
      orderBy: { lastFetchedAt: 'desc' },
    });

    console.log(`📥 Processing ${syncedPubs.length} synced publications...`);

    for (const synced of syncedPubs) {
      try {
        const metadata = synced.metadata as any;
        const year = metadata.year || synced.publishedDate?.getFullYear() || new Date().getFullYear();
        const doi = metadata.doi || null;

        // Check for duplicates
        const duplicateCheck = await checkForDuplicate(
          synced.title,
          year,
          doi
        );

        if (duplicateCheck.isDuplicate && duplicateCheck.matchedPublication) {
          // Update existing publication with new data
          const updated = await mergePublicationData(
            duplicateCheck.matchedPublication.id,
            synced,
            duplicateCheck.matchMethod || 'exact'
          );

          if (updated) {
            result.updated++;
            result.details.push({
              title: synced.title,
              action: 'updated',
              reason: `Merged with existing (${duplicateCheck.matchMethod}, confidence: ${duplicateCheck.confidence})`,
            });
          } else {
            result.skipped++;
            result.details.push({
              title: synced.title,
              action: 'skipped',
              reason: `Duplicate found but no updates needed (${duplicateCheck.matchMethod})`,
            });
          }

          // Mark as imported
          await prisma.syncedContent.update({
            where: { id: synced.id },
            data: { importedToDb: true },
          });
        } else {
          // Create new publication
          await prisma.publication.create({
            data: {
              title: synced.title,
              authors: metadata.authors || synced.authors || [],
              venue: metadata.venue || 'Unknown',
              year,
              type: determinePublicationType(metadata),
              doi: doi || undefined,
              url: synced.url || metadata.url || undefined,
              abstract: synced.content || metadata.abstract || undefined,
              pdfUrl: metadata.pdfUrl || undefined,
              published: true,
            },
          });

          // Mark as imported
          await prisma.syncedContent.update({
            where: { id: synced.id },
            data: { importedToDb: true },
          });

          result.imported++;
          result.details.push({
            title: synced.title,
            action: 'imported',
            reason: 'New publication',
          });
        }
      } catch (error: any) {
        console.error(`Error processing "${synced.title}":`, error.message);
        result.errors++;
        result.details.push({
          title: synced.title,
          action: 'error',
          reason: error.message,
        });
      }
    }

    console.log(`✅ Import complete: ${result.imported} new, ${result.updated} updated, ${result.skipped} skipped, ${result.errors} errors`);

    return result;
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Merge synced publication data with existing publication
 * Returns true if any updates were made
 */
async function mergePublicationData(
  publicationId: string,
  syncedContent: any,
  matchMethod: string
): Promise<boolean> {
  const existing = await prisma.publication.findUnique({
    where: { id: publicationId },
  });

  if (!existing) return false;

  const metadata = syncedContent.metadata as any;
  const updates: any = {};
  let hasUpdates = false;

  // Update DOI if missing
  if (!existing.doi && metadata.doi) {
    updates.doi = metadata.doi;
    hasUpdates = true;
  }

  // Update URL if missing
  if (!existing.url && (syncedContent.url || metadata.url)) {
    updates.url = syncedContent.url || metadata.url;
    hasUpdates = true;
  }

  // Update abstract if missing or shorter
  if (syncedContent.content && (!existing.abstract || existing.abstract.length < syncedContent.content.length)) {
    updates.abstract = syncedContent.content;
    hasUpdates = true;
  }

  // Update PDF URL if missing
  if (!existing.pdfUrl && metadata.pdfUrl) {
    updates.pdfUrl = metadata.pdfUrl;
    hasUpdates = true;
  }

  // Always update if changes exist
  if (hasUpdates) {
    await prisma.publication.update({
      where: { id: publicationId },
      data: updates,
    });
    console.log(`📝 Updated publication: ${existing.title}`);
    return true;
  }

  return false;
}

/**
 * Determine publication type from metadata
 */
function determinePublicationType(metadata: any): PublicationType {
  const venue = (metadata.venue || '').toLowerCase();

  if (venue.includes('conference') || venue.includes('proceedings') || venue.includes('symposium')) {
    return 'conference';
  }
  if (venue.includes('journal') || venue.includes('transactions')) {
    return 'journal';
  }
  if (venue.includes('book chapter')) {
    return 'book_chapter';
  }
  if (venue.includes('book')) {
    return 'book';
  }
  if (venue.includes('technical report') || venue.includes('report')) {
    return 'technical_report';
  }

  return 'journal'; // Default
}

/**
 * Get deduplication statistics
 */
export async function getDeduplicationStats(): Promise<{
  totalSynced: number;
  imported: number;
  pending: number;
  byPlatform: Record<string, { total: number; imported: number }>;
}> {
  const synced = await prisma.syncedContent.findMany({
    where: { contentType: 'publication' },
    select: { platform: true, importedToDb: true },
  });

  const stats = {
    totalSynced: synced.length,
    imported: synced.filter((s) => s.importedToDb).length,
    pending: synced.filter((s) => !s.importedToDb).length,
    byPlatform: {} as Record<string, { total: number; imported: number }>,
  };

  // Calculate per-platform stats
  synced.forEach((item) => {
    if (!stats.byPlatform[item.platform]) {
      stats.byPlatform[item.platform] = { total: 0, imported: 0 };
    }
    stats.byPlatform[item.platform].total++;
    if (item.importedToDb) {
      stats.byPlatform[item.platform].imported++;
    }
  });

  await prisma.$disconnect();
  return stats;
}
