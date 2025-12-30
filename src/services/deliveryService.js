import { apiService } from './api';

export const deliveryService = {
  // Get all deliveries with filters
  getAllDeliveries: async (params = {}) => {
    return apiService.get('/deliveries', { params });
  },

  // Get single delivery by ID
  getDeliveryById: async (id) => {
    return apiService.get(`/deliveries/${id}`);
  },

  // Create delivery (usually auto-created on sale confirmation)
  createDelivery: async (deliveryData) => {
    return apiService.post('/deliveries', deliveryData);
  },

  // Assign delivery person 
  assignDeliveryPerson: async (deliveryId, employeeId) => {
    return apiService.put(`/deliveries/${deliveryId}/assign`, {
      assigned_employee_id: employeeId
    });
  },

  // Update delivery status
  updateDeliveryStatus: async (deliveryId, status, remarks = '') => {
    return apiService.post(`/deliveries/${deliveryId}/status`, {
      status,
      remarks
    });
  },

  // Generate OTP (called when status changes to 'out_for_delivery')
  generateOTP: async (deliveryId) => {
    return apiService.post(`/deliveries/${deliveryId}/generate-otp`);
  },

  // Verify OTP
  verifyOTP: async (deliveryId, otp) => {
    return apiService.post(`/deliveries/${deliveryId}/verify-otp`, {
      otp: otp
    });
  },

  // Get delivery events (timeline)
  getDeliveryEvents: async (deliveryId) => {
    return apiService.get(`/deliveries/${deliveryId}/timeline`);
  },

  // Get deliveries by employee
  getDeliveriesByEmployee: async (employeeId, params = {}) => {
    return apiService.get(`/deliveries/employee/${employeeId}`, { params });
  },

  // Get delivery statistics
  getDeliveryStats: async (params = {}) => {
    return apiService.get('/deliveries/stats', { params });
  },

  // Cancel delivery
  cancelDelivery: async (deliveryId, reason) => {
    return apiService.post(`/deliveries/${deliveryId}/cancel`, {
      reason
    });
  },

  // Mark as failed
  markAsFailed: async (deliveryId, reason) => {
    return apiService.post(`/deliveries/${deliveryId}/failed`, {
      reason
    });
  },

  // Resend OTP
  resendOTP: async (deliveryId) => {
    return apiService.post(`/deliveries/${deliveryId}/resend-otp`);
  }
};

export default deliveryService;