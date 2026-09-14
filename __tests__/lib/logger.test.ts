import { logger } from '@/lib/utils/logger';

describe('Logger Utility', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    info: jest.SpyInstance;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
    };
  });

  afterEach(() => {
    // Restore console methods
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe('logger.info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test info message'
      );
    });

    it('should log info with additional data', () => {
      const data = { userId: '123', action: 'login' };
      logger.info('User action', data);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'User action',
        data
      );
    });
  });

  describe('logger.error', () => {
    it('should log error messages', () => {
      logger.error('Test error message');
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error message'
      );
    });

    it('should log error objects', () => {
      const error = new Error('Test error');
      logger.error('An error occurred', error);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'An error occurred',
        error
      );
    });
  });

  describe('logger.warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'Test warning message'
      );
    });
  });

  describe('logger.debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.debug('Test debug message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Test debug message'
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.debug('Test debug message');
      expect(consoleSpy.log).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
