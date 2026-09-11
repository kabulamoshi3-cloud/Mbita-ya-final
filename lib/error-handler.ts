/**
 * Centralized error handling utility
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * Handle Prisma-specific errors
 */
export function handlePrismaError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ValidationError('A record with this value already exists');
      case 'P2025':
        return new NotFoundError('Record not found');
      case 'P2003':
        return new ValidationError('Related record not found');
      case 'P2016':
        return new ValidationError('Query interpretation error');
      default:
        return new DatabaseError(`Database error: ${error.code}`);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Invalid data provided');
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError('Database connection failed');
  }

  return new DatabaseError('Unknown database error');
}

/**
 * Convert any error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError) {
    return handlePrismaError(error);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  return new AppError('An unexpected error occurred', 500);
}

/**
 * Create error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  context?: string
): NextResponse {
  const appError = toAppError(error);
  
  // Log the error
  logger.error(
    context ? `${context}: ${appError.message}` : appError.message,
    error instanceof Error ? error : undefined,
    { code: appError.code, statusCode: appError.statusCode }
  );

  // Return sanitized error to client
  return NextResponse.json(
    {
      error: appError.message,
      code: appError.code || 'INTERNAL_ERROR',
    },
    { status: appError.statusCode }
  );
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return createErrorResponse(error, context);
    }
  };
}
