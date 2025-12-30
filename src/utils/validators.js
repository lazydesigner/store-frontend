import { VALIDATION } from './constants';

export const validators = {
  // Phone number validation (Indian format)
  phone: (value) => {
    if (!value) return 'Phone number is required';
    if (!VALIDATION.PHONE_REGEX.test(value)) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value) return 'Email is required';
    if (!VALIDATION.EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  // GSTIN validation
  gstin: (value) => {
    if (!value) return null; // Optional field
    if (!VALIDATION.GSTIN_REGEX.test(value)) {
      return 'Please enter a valid GST number';
    }
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }
    return null;
  },

  // Required field validation
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Number validation
  number: (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) {
      return `${fieldName} is required`;
    }
    if (isNaN(value)) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  // Minimum value validation
  min: (value, minValue, fieldName = 'This field') => {
    if (Number(value) < minValue) {
      return `${fieldName} must be at least ${minValue}`;
    }
    return null;
  },

  // Maximum value validation
  max: (value, maxValue, fieldName = 'This field') => {
    if (Number(value) > maxValue) {
      return `${fieldName} must not exceed ${maxValue}`;
    }
    return null;
  },

  // Price range validation
  priceRange: (minPrice, maxPrice) => {
    const errors = {};
    
    if (!minPrice) {
      errors.minPrice = 'Minimum price is required';
    }
    if (!maxPrice) {
      errors.maxPrice = 'Maximum price is required';
    }
    
    if (minPrice && maxPrice && Number(minPrice) >= Number(maxPrice)) {
      errors.maxPrice = 'Maximum price must be greater than minimum price';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Discount validation
  discount: (discountPercent, maxDiscount) => {
    if (!discountPercent) return null;
    
    const discount = Number(discountPercent);
    if (discount < 0) {
      return 'Discount cannot be negative';
    }
    if (discount > 100) {
      return 'Discount cannot exceed 100%';
    }
    if (maxDiscount && discount > maxDiscount) {
      return `Discount cannot exceed ${maxDiscount}%`;
    }
    return null;
  },

  // SKU validation (alphanumeric with hyphens)
  sku: (value) => {
    if (!value) return 'SKU is required';
    if (!/^[A-Z0-9-]+$/i.test(value)) {
      return 'SKU can only contain letters, numbers, and hyphens';
    }
    return null;
  },

  // Username validation
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-z0-9._]+$/i.test(value)) {
      return 'Username can only contain letters, numbers, dots, and underscores';
    }
    return null;
  },

  // OTP validation
  otp: (value) => {
    if (!value) return 'OTP is required';
    if (value.length !== VALIDATION.OTP_LENGTH) {
      return `OTP must be ${VALIDATION.OTP_LENGTH} digits`;
    }
    if (!/^\d+$/.test(value)) {
      return 'OTP must contain only numbers';
    }
    return null;
  },

  // PIN code validation (Indian)
  pincode: (value) => {
    if (!value) return 'PIN code is required';
    if (!/^\d{6}$/.test(value)) {
      return 'PIN code must be 6 digits';
    }
    return null;
  }
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default validators;