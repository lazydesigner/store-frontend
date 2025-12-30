import { apiService } from './api';

export const salesService = {
  // Get all sales with filters
  getAllSales: async (params = {}) => {
    return apiService.get('/sales', { params });
  },

  // Get single sale by ID
  getSaleById: async (id) => {
    return apiService.get(`/sales/${id}`);
  },

   // Get single sale by ID
  getSaleStats: async () => {
    return apiService.get(`/sales/stats`);
  },

  // Create new sale (draft/proforma/invoice)
  createSale: async (saleData) => {
    return apiService.post('/sales', saleData);
  },

  // Update sale (only draft/proforma)
  updateSale: async (id, saleData) => {
    return apiService.put(`/sales/${id}`, saleData);
  },

  sendinvoice: async (id) => {
    return apiService.post(`/sales/${id}/send-invoice`);
  },

  // Confirm sale (convert to invoice)
  confirmSale: async (id) => {
    return apiService.post(`/sales/${id}/confirm`);
  },

  // Delete sale (only draft)
  deleteSale: async (id) => {
    return apiService.delete(`/sales/${id}`);
  },

  // Get sale PDF
  getSalePDF: async (id) => {
    return apiService.get(`/sales/${id}/pdf`, {
      responseType: 'blob'
    });
  },

  // Add payment
  addPayment: async (saleId, paymentData) => {
    return apiService.post(`/sales/${saleId}/payments`, paymentData);
  },

  // Get payments for a sale
  getPayments: async (saleId) => {
    return apiService.get(`/sales/${saleId}/payments`);
  },

  // Get sales log (audit trail)
  getSalesLog: async (params = {}) => {
    return apiService.get('/sales/log/all', { params });
  },

  // Get draft by customer phone
  getDraftByPhone: async (phone) => {
    return apiService.get('/sales/draft', { params: { phone } });
  },

  // Convert proforma to invoice
  convertToInvoice: async (id, data) => {
    return apiService.post(`/sales/${id}/convert-to-invoice`, { params: { data } });
  },

  // Cancel sale
  cancelSale: async (id, reason) => {
    return apiService.post(`/sales/${id}/cancel`, { reason });
  }
};

export default salesService;