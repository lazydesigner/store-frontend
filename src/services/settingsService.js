// ==== src/services/settingsService.js (Frontend) ====
import {apiService} from './api';

const settingsService = {
  // Get all settings grouped by category
  getAllSettings: async () => {
    const response = await apiService.get('/settings');
    return response.data;
  },

  // Get settings by specific category
  getSettings: async (category) => {
    const response = await apiService.get(`/settings/${category}`);
    return response.data;
  },

  // Update company settings
  updateCompanySettings: async (data) => {
    const response = await apiService.put('/settings/company', data);
    return response.data;
  },

  // Update invoice settings
  updateInvoiceSettings: async (data) => {
    const response = await apiService.put('/settings/invoice', data);
    return response.data;
  },

  // Update SMS settings
  updateSmsSettings: async (data) => {
    const response = await apiService.put('/settings/sms', data);
    return response.data;
  },

  // Update email settings
  updateEmailSettings: async (data) => {
    const response = await apiService.put('/settings/email', data);
    return response.data;
  },

  // Update security settings
  updateSecuritySettings: async (data) => {
    const response = await apiService.put('/settings/security', data);
    return response.data;
  },

  // Test SMS configuration
  testSmsSettings: async (phoneNumber) => {
    const response = await apiService.post('/settings/sms/test', {
      phoneNumber
    });
    return response.data;
  },

  // Test email configuration
  testEmailSettings: async (emailAddress) => {
    const response = await apiService.post('/settings/email/test', {
      emailAddress
    });
    return response.data;
  },

  // Bulk update settings
  bulkUpdateSettings: async (settings) => {
    const response = await apiService.put('/settings/bulk', {
      settings
    });
    return response.data;
  },

  // Reset category to defaults
  resetToDefault: async (category) => {
    const response = await apiService.post(`/settings/reset/${category}`);
    return response.data;
  }
};

export default settingsService;


