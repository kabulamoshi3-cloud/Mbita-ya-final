/**
 * Shared type definitions to replace 'any' types
 */

import { Prisma } from '@prisma/client';

// ============================================================================
// Database Query Types
// ============================================================================

export type WhereClause<T> = T extends keyof Prisma.TypeMap['model']
  ? Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where']
  : Record<string, unknown>;

export type OrderByClause<T> = T extends keyof Prisma.TypeMap['model']
  ? Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy']
  : Record<string, unknown>;

// Generic filter type for API queries
export interface QueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Session Types (extend existing SessionData)
// ============================================================================

export interface StudentSession {
  studentId: string;
  email: string;
  name: string;
}

export interface AdminSession {
  username: string;
  createdAt: number;
  mfaVerified?: boolean;
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  username: string;
  password: string;
  totpToken?: string;
}

// ============================================================================
// Marketplace Types
// ============================================================================

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
}

export interface CheckoutData {
  productId: string;
  quantity: number;
  paymentMethod: 'stripe' | 'paypal';
}

// ============================================================================
// Research Network Types
// ============================================================================

export interface ResearcherMatch {
  id: string;
  name: string;
  institution: string;
  expertise: string[];
  matchScore: number;
  commonInterests: string[];
}

export interface CollaborationProposalData {
  title: string;
  description: string;
  researchArea: string;
  duration: string;
  funding?: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface MetricData {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CitationData {
  year: number;
  citations: number;
  hIndex?: number;
  i10Index?: number;
}

// ============================================================================
// Upload Types
// ============================================================================

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  buffer: Buffer;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface NotificationData {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Scheduling Types
// ============================================================================

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  reason?: string;
}

export interface AppointmentBooking {
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  notes?: string;
}

// ============================================================================
// Lab Experiment Types
// ============================================================================

export interface ExperimentData {
  title: string;
  objective: string;
  procedure: string[];
  materials: string[];
  expectedResults: string;
}

export interface ExperimentResult {
  observations: string;
  data: Record<string, unknown>;
  conclusions: string;
  images?: string[];
}

// ============================================================================
// Utility Types
// ============================================================================

export type NonEmptyArray<T> = [T, ...T[]];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = T | null;

export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : unknown;

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface FieldValidation {
  field: string;
  message: string;
  type: 'error' | 'warning';
}
