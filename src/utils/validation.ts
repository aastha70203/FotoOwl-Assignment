// Validation & Security Utilities for FotoOwl Application

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  score: number; // 0 - 100
  label: 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  color: string;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasUppercase: boolean;
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MOBILE_REGEX = /^[0-9]{10}$/;

/**
 * Validates Email address format
 */
export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address (e.g. user@domain.com).';
  return null;
};

/**
 * Validates 10-digit mobile number
 */
export const validateMobileNumber = (mobile: string): string | null => {
  const trimmed = mobile.trim();
  if (!trimmed) return 'Mobile number is required.';
  if (!/^\d+$/.test(trimmed)) return 'Mobile number must contain numeric digits only.';
  if (!MOBILE_REGEX.test(trimmed)) return 'Mobile number must be exactly 10 digits.';
  return null;
};

/**
 * Computes password strength and criteria metrics
 */
export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: 'Weak',
      color: '#FF6B6B',
      hasMinLength: false,
      hasNumber: false,
      hasSpecialChar: false,
      hasUppercase: false,
    };
  }

  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  let score = 0;
  if (hasMinLength) score += 40;
  if (password.length >= 8) score += 15;
  if (hasNumber) score += 15;
  if (hasSpecialChar) score += 15;
  if (hasUppercase) score += 15;

  let label: PasswordStrength['label'] = 'Weak';
  let color = '#FF6B6B';

  if (score >= 85) {
    label = 'Excellent';
    color = '#2ED573';
  } else if (score >= 65) {
    label = 'Strong';
    color = '#00CEC9';
  } else if (score >= 40) {
    label = 'Fair';
    color = '#FFA502';
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    hasUppercase,
  };
};

/**
 * Validates registration form fields
 */
export const validateRegistrationForm = (data: RegistrationFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Full Name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  // Email
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  // Gender
  if (!data.gender) {
    errors.gender = 'Please select a gender option.';
  }

  // Mobile Number
  const mobileErr = validateMobileNumber(data.mobileNumber);
  if (mobileErr) errors.mobileNumber = mobileErr;

  // Address
  if (!data.address.trim()) {
    errors.address = 'Address is required.';
  }

  // City
  if (!data.city.trim()) {
    errors.city = 'Please select a city.';
  }

  // Password
  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

/**
 * Basic XSS sanitizer for input strings
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  return text.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return char;
    }
  });
};

/**
 * Client-side mock hash function for stored password security
 */
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sec_hash_${Math.abs(hash)}_${password.length * 7}`;
};
