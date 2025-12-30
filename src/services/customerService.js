import { apiService } from './api';

export const customerService = {
  // Get all customers with filters
  getAllCustomers: async (params = {}) => {
    return apiService.get('/customers', { params });
  },

  // Get single customer by ID
  getCustomerById: async (id) => { 
    return apiService.get(`/customers/${id}`);
  },

  // Get customer by phone
  getCustomerByPhone: async (phone) => {
    return apiService.get('/customers/by-phone', { params: { phone } });
  },

  // Create new customer
  createCustomer: async (customerData) => {
    return apiService.post('/customers', customerData);
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    return apiService.put(`/customers/${id}`, customerData);
  },

  // Delete customer
  deleteCustomer: async (id) => {
    return apiService.delete(`/customers/${id}`);
  },

  // Import customers from Excel
  importCustomers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.post('/customers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }); 
  },

  // Export customers to Excel
  // exportCustomers: async (params = {}) => {
  //   return apiService.get('/customers/export', {
  //     params,
  //     responseType: 'blob'
  //   });
  // },

  // Merge duplicate customers
  mergeCustomers: async (primaryId, secondaryIds) => {
    return apiService.post('/customers/merge', {
      primary_id: primaryId,
      secondary_ids: secondaryIds
    });
  },

  // Get customer statistics
  getCustomerStats: async (id) => {
    return apiService.get(`/customers/${id}/stats`);
  },

  // Get customer orders
  getCustomerOrders: async (id, params = {}) => {
    return apiService.get(`/customers/${id}/orders`, { params });
  },


  // NEW: Import/Export methods
  previewImport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiService.post('/customers/import/preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  commitImport: async (importId) => {
    const response = await apiService.post(`/customers/import/commit/${importId}`);
    return response.data;
  },

  exportCustomers: async (filters = {}) => {
    const response = await apiService.get('/export/customers', {
      params: filters,
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customers_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadTemplate: async () => {
    const response = await apiService.get('/customers/export/template', {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customer_import_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }


};

export default customerService;