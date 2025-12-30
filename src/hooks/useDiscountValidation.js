import { useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

/**
 * Hook for validating discount limits
 * Checks if employee can apply requested discount based on role and product type
 */
export const useDiscountValidation = () => {
  const [validating, setValidating] = useState(false);
  const [discountLimits, setDiscountLimits] = useState({});

  /**
   * Get applicable discount limit for employee and product type
   * @param {string} employeeId - Employee ID
   * @param {string} productTypeId - Product Type ID (optional)
   * @returns {Promise<number>} Maximum allowed discount percentage
   */
  const getMaxDiscount = useCallback(async (employeeId, productTypeId = null) => {
    const key = `${employeeId}-${productTypeId || 'all'}`;
    
    // Return cached value if available 
    if (discountLimits[key] !== undefined) {
      return discountLimits[key];
    }

    try {
      const result = await employeeService.getApplicableDiscountLimit(
        employeeId, 
        productTypeId
      ); 
      
      const maxDiscount = result.data.maxDiscountPercent || 100; // 100% if no limit
      
      setDiscountLimits(prev => ({
        ...prev,
        [key]: maxDiscount
      }));
      
      return maxDiscount;
    } catch (error) {
      console.error('Failed to get discount limit:', error);
      // If API fails, assume no limit to not block sales
      return 100;
    }
  }, [discountLimits]);

  /**
   * Validate if discount is within allowed limits
   * @param {string} employeeId - Employee ID
   * @param {string} productTypeId - Product Type ID (optional)
   * @param {number} discountPercent - Requested discount percentage
   * @returns {Promise<{valid: boolean, maxAllowed: number, error?: string}>}
   */
  const validateDiscount = useCallback(async (
    employeeId, 
    productTypeId, 
    discountPercent
  ) => {
    setValidating(true);

    try {
      const maxAllowed = await getMaxDiscount(employeeId, productTypeId);
      
      const valid = discountPercent <= maxAllowed;
      
      setValidating(false);

      return {
        valid,
        maxAllowed,
        error: valid 
          ? null 
          : `Discount cannot exceed ${maxAllowed}% for this ${productTypeId ? 'product type' : 'employee'}`
      };
    } catch (error) {
      setValidating(false);
      console.error('Discount validation error:', error);
      
      return {
        valid: false,
        maxAllowed: 0,
        error: 'Failed to validate discount. Please try again.'
      };
    }
  }, [getMaxDiscount]);

  /**
   * Validate discount using API endpoint (more accurate, checks all rules)
   * @param {string} employeeId - Employee ID
   * @param {string} productTypeId - Product Type ID
   * @param {number} discountPercent - Requested discount percentage
   * @returns {Promise<{valid: boolean, message?: string}>}
   */
  const validateDiscountAPI = useCallback(async (
    employeeId,
    productTypeId,
    discountPercent
  ) => {
    setValidating(true);

    try {
      const result = await employeeService.validateDiscount(
        employeeId,
        productTypeId,
        discountPercent
      );

      setValidating(false);
      return result;
    } catch (error) {
      setValidating(false);
      console.error('API discount validation error:', error);
      
      return {
        valid: false,
        message: error.message || 'Failed to validate discount'
      };
    }
  }, []);

  /**
   * Clear cached discount limits
   */
  const clearCache = useCallback(() => {
    setDiscountLimits({});
  }, []);

  return {
    validating,
    getMaxDiscount,
    validateDiscount,
    validateDiscountAPI,
    clearCache
  };
};

export default useDiscountValidation;