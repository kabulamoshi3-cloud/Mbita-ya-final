/**
 * Production-ready logger utility
 * Replaces console.log/error/warn with structured logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    const parts = [`[${timestamp}] [${level.toUpperCase()}] ${message}`];
    
    if (context && Object.keys(context).length > 0) {
      parts.push(JSON.stringify(context));
    }
    
    if (error) {
      parts.push(error.stack || error.message);
    }
    
    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // In production, you might send this to a logging service
    // For now, we only log in development or errors
    if (this.isDevelopment || level === 'error') {
      const formatted = this.formatEntry(entry);
      
      switch (level) {
        case 'error':
          console.error(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'info':
        case 'debug':
          if (this.isDevelopment) {
            console.log(formatted);
          }
          break;
      }
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    const errorObj = error instanceof Error ? error : undefined;
    const errorContext = {
      ...context,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
    this.log('error', message, errorContext, errorObj);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }
}

// Export singleton instance
export const logger = new Logger();
