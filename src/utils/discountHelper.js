import { discountService } from '../services/discountService';

/**
 * Discount Helper Utilities
 * Functions to validate and apply discount limits
 */

export const discountHelper = {
  /**
   * Get maximum allowed discount for employee and product type
   * @param {number} employeeId - Employee ID
   * @param {number|null} productTypeId - Product Type ID (null for all products)
   * @returns {Promise<number>} Maximum discount percentage allowed
   */
  getMaxAllowedDiscount: async (employeeId, productTypeId = null) => {
    try {
      const response = await discountService.getApplicableDiscount(employeeId, productTypeId);
      return response.maxDiscountPercent || 0;
    } catch (error) {
      console.error('Error fetching max discount:', error);
      return 0;
    }
  },

  /**
   * Validate if a discount is within limits
   * @param {number} employeeId - Employee ID
   * @param {number|null} productTypeId - Product Type ID
   * @param {number} discountPercent - Discount percentage to validate
   * @returns {Promise<{allowed: boolean, maxAllowed: number, message: string}>}
   */
  validateDiscount: async (employeeId, productTypeId, discountPercent) => {
    try {
      const response = await discountService.validateDiscount(
        employeeId,
        productTypeId,
        discountPercent
      );
      
      return {
        allowed: response.allowed,
        maxAllowed: response.maxAllowed,
        message: response.allowed 
          ? 'Discount is within limits' 
          : `Maximum allowed discount is ${response.maxAllowed}%`
      };
    } catch (error) {
      console.error('Error validating discount:', error);
      return {
        allowed: false,
        maxAllowed: 0,
        message: 'Error validating discount'
      };
    }
  },

  /**
   * Calculate if discount exceeds limit
   * @param {number} discountPercent - Applied discount
   * @param {number} maxAllowed - Maximum allowed discount
   * @returns {boolean} True if discount exceeds limit
   */
  exceedsLimit: (discountPercent, maxAllowed) => {
    return discountPercent > maxAllowed;
  },

  /**
   * Get discount limit info for display
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Object>} Discount limits summary
   */
  getDiscountSummary: async (employeeId) => {
    try {
      const response = await discountService.getEmployeeDiscountSummary(employeeId);
      return response;
    } catch (error) {
      console.error('Error fetching discount summary:', error);
      return {};
    }
  },

  /**
   * Format discount limit message for UI
   * @param {number} maxDiscount - Maximum discount allowed
   * @param {string} productType - Product type name (optional)
   * @returns {string} Formatted message
   */
  formatLimitMessage: (maxDiscount, productType = null) => {
    if (productType) {
      return `Maximum ${maxDiscount}% discount allowed for ${productType}`;
    }
    return `Maximum ${maxDiscount}% discount allowed`;
  },

  /**
   * Get color code for discount percentage
   * @param {number} discountPercent - Current discount
   * @param {number} maxAllowed - Maximum allowed
   * @returns {string} Color class for UI
   */
  getDiscountColorClass: (discountPercent, maxAllowed) => {
    if (discountPercent > maxAllowed) {
      return 'text-red-600'; // Exceeds limit
    } else if (discountPercent > maxAllowed * 0.8) {
      return 'text-yellow-600'; // Near limit (80%+)
    } else {
      return 'text-green-600'; // Within safe range
    }
  },

  /**
   * Calculate remaining discount margin
   * @param {number} currentDiscount - Current discount applied
   * @param {number} maxAllowed - Maximum allowed discount
   * @returns {number} Remaining discount percentage available
   */
  getRemainingMargin: (currentDiscount, maxAllowed) => {
    return Math.max(0, maxAllowed - currentDiscount);
  },

  /**
   * Check if discount requires approval
   * @param {number} discountPercent - Discount to apply
   * @param {number} maxAllowed - Maximum allowed without approval
   * @param {number} approvalThreshold - Threshold for requiring approval (default 80%)
   * @returns {boolean} True if approval needed
   */
  requiresApproval: (discountPercent, maxAllowed, approvalThreshold = 0.8) => {
    return discountPercent > (maxAllowed * approvalThreshold);
  }
};

/**
 * React Hook for discount validation
 */
export const useDiscountValidation = (employeeId) => {
  const [maxDiscounts, setMaxDiscounts] = useState({});
  const [loading, setLoading] = useState(false);

  const loadDiscountLimits = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const summary = await discountHelper.getDiscountSummary(employeeId);
      setMaxDiscounts(summary);
    } catch (error) {
      console.error('Error loading discount limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateItemDiscount = async (productTypeId, discountPercent) => {
    return await discountHelper.validateDiscount(
      employeeId,
      productTypeId,
      discountPercent
    );
  };

  return {
    maxDiscounts,
    loading,
    loadDiscountLimits,
    validateItemDiscount
  };
};

export default discountHelper;