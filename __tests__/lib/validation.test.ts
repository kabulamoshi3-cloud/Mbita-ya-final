import { validateEmail, validateUrl, validateRequired } from '@/lib/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
      expect(validateUrl('https://sub.example.com/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateUrl(null as any)).toBe(false);
      expect(validateUrl(undefined as any)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      expect(validateRequired('text')).toBe(true);
      expect(validateRequired('  text  ')).toBe(true);
    });

    it('should reject empty or whitespace strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateRequired(null as any)).toBe(false);
      expect(validateRequired(undefined as any)).toBe(false);
    });
  });
});
