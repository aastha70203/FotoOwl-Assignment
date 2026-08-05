import { describe, it, expect } from '@jest/globals';
import {
  validateEmail,
  validateMobileNumber,
  evaluatePasswordStrength,
  validateRegistrationForm,
  sanitizeInput,
  hashPassword,
} from '../src/utils/validation';

describe('Validation & Security Utilities', () => {
  describe('validateEmail', () => {
    it('returns error for empty email', () => {
      expect(validateEmail('')).toBe('Email address is required.');
    });

    it('returns error for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe('Enter a valid email address (e.g. user@domain.com).');
      expect(validateEmail('user@')).toBe('Enter a valid email address (e.g. user@domain.com).');
      expect(validateEmail('@domain.com')).toBe('Enter a valid email address (e.g. user@domain.com).');
    });

    it('returns null for valid email address', () => {
      expect(validateEmail('test.candidate@fotoowl.ai')).toBeNull();
    });
  });

  describe('validateMobileNumber', () => {
    it('returns error for empty mobile number', () => {
      expect(validateMobileNumber('')).toBe('Mobile number is required.');
    });

    it('returns error for non-numeric input', () => {
      expect(validateMobileNumber('98765abcde')).toBe('Mobile number must contain numeric digits only.');
    });

    it('returns error for number not equal to 10 digits', () => {
      expect(validateMobileNumber('987654321')).toBe('Mobile number must be exactly 10 digits.');
      expect(validateMobileNumber('98765432100')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns null for valid 10 digit mobile number', () => {
      expect(validateMobileNumber('9876543210')).toBeNull();
    });
  });

  describe('evaluatePasswordStrength', () => {
    it('evaluates weak passwords', () => {
      const res = evaluatePasswordStrength('12345');
      expect(res.score).toBeLessThan(40);
      expect(res.label).toBe('Weak');
    });

    it('evaluates strong passwords with mixed criteria', () => {
      const res = evaluatePasswordStrength('PassWord123!');
      expect(res.score).toBeGreaterThanOrEqual(65);
      expect(res.hasMinLength).toBe(true);
      expect(res.hasNumber).toBe(true);
      expect(res.hasSpecialChar).toBe(true);
      expect(res.hasUppercase).toBe(true);
    });
  });

  describe('validateRegistrationForm', () => {
    it('detects mismatched passwords', () => {
      const form = {
        fullName: 'Test User',
        email: 'test@fotoowl.ai',
        gender: 'Male',
        mobileNumber: '9876543210',
        address: '123 Test St',
        city: 'Pune',
        password: 'Password123',
        confirmPassword: 'DifferentPassword',
      };
      const errors = validateRegistrationForm(form);
      expect(errors.confirmPassword).toBe('Passwords do not match.');
    });
  });

  describe('sanitizeInput', () => {
    it('escapes dangerous HTML/XSS characters', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
  });

  describe('hashPassword', () => {
    it('produces a non-empty hashed string', () => {
      const hash = hashPassword('MySecretPass');
      expect(hash).toContain('sec_hash_');
    });
  });
});
