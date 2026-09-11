import { prisma } from "@/lib/prisma";

/**
 * Log an admin action to the ActivityLog table.
 * Call this after every successful create, update, delete, or publish/unpublish operation.
 */
export async function logAction(
  action: string,
  section: string,
  itemId: string | null,
  itemTitle: string | null,
  performedBy: string
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        section,
        itemId: itemId ?? undefined,
        itemTitle: itemTitle ?? undefined,
        performedBy,
      },
    });
  } catch (err) {
    // Non-fatal — log but don't throw
    // Note: Avoid importing logger here to prevent circular dependencies
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to write activity log:", err);
    }
  }
}
