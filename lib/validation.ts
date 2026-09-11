/**
 * Input validation utilities
 */

import { z } from 'zod';
import { ValidationError } from './error-handler';

/**
 * Validate and parse request body using Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
    }
    throw new ValidationError('Invalid request body');
  }
}

/**
 * Validate search params
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  try {
    const params = Object.fromEntries(searchParams.entries());
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new ValidationError(`Invalid query parameters: ${errors.join(', ')}`);
    }
    throw new ValidationError('Invalid query parameters');
  }
}

// ============================================================================
// Common Validation Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const emailSchema = z.string().email('Invalid email address');

export const urlSchema = z.string().url('Invalid URL');

export const dateSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  'Invalid date format'
);

// ============================================================================
// Specific Validation Schemas
// ============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  totpToken: z.string().length(6, 'TOTP token must be 6 digits').optional(),
});

export const productFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
});

export const appointmentSchema = z.object({
  instructorId: z.string().min(1),
  date: dateSchema,
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  purpose: z.string().min(10).max(500),
  notes: z.string().max(1000).optional(),
});

export const experimentSchema = z.object({
  title: z.string().min(5).max(200),
  objective: z.string().min(10).max(1000),
  procedure: z.array(z.string().min(5)).min(1),
  materials: z.array(z.string().min(2)).min(1),
  expectedResults: z.string().min(10).max(2000),
});

// ============================================================================
// Sanitization Helpers
// ============================================================================

/**
 * Sanitize HTML input (basic XSS prevention)
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): string {
  const sanitized = sanitizeString(email.toLowerCase());
  const result = emailSchema.safeParse(sanitized);
  if (!result.success) {
    throw new ValidationError('Invalid email format');
  }
  return sanitized;
}

/**
 * Validate UUID
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate CUID (Prisma default ID format)
 */
export function isValidCuid(cuid: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(cuid);
}
