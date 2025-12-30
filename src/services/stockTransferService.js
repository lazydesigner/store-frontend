import { apiService } from './api';

export const stockTransferService = {
  // Get all stock transfers
  getAllTransfers: async (params = {}) => {
    return apiService.get('/stock-transfers', { params });
  },

  // Get single transfer by ID
  getTransferById: async (id) => {
    return apiService.get(`/stock-transfers/${id}`);
  },

  // Create new stock transfer
  createTransfer: async (data) => {
    return apiService.post('/stock-transfers', data);
  },

  // Approve transfer
  approveTransfer: async (id, approvedBy) => {
    return apiService.post(`/stock-transfers/${id}/approve`, { approved_by: approvedBy });
  },

  // Reject transfer
  rejectTransfer: async (id, reason, rejectedBy) => {
    return apiService.post(`/stock-transfers/${id}/reject`, { 
      reason, 
      rejected_by: rejectedBy 
    });
  },

  // Mark as dispatched
  dispatchTransfer: async (id, dispatchedBy, remarks) => {
    return apiService.post(`/stock-transfers/${id}/dispatch`, { 
      dispatched_by: dispatchedBy,
      remarks 
    });
  },

  // Mark as received
  receiveTransfer: async (id, receivedBy, actualQuantity, remarks) => {
    return apiService.post(`/stock-transfers/${id}/receive`, { 
      received_by: receivedBy,
      actual_quantity: actualQuantity,
      remarks 
    });
  },

  // Cancel transfer
  cancelTransfer: async (id, reason) => {
    return apiService.post(`/stock-transfers/${id}/cancel`, { reason });
  },

  // Get transfer history for a product
  getProductTransferHistory: async (productId, params = {}) => {
    return apiService.get(`/stock-transfers/product/${productId}`, { params });
  },

  // Get transfers by warehouse
  getWarehouseTransfers: async (warehouseId, type = 'all', params = {}) => {
    // type: 'all', 'incoming', 'outgoing'
    return apiService.get(`/stock-transfers/warehouse/${warehouseId}`, { 
      params: { ...params, type } 
    });
  },

  // Get pending approvals
  getPendingApprovals: async (params = {}) => {
    return apiService.get('/stock-transfers/pending-approvals', { params });
  }
};

export default stockTransferService;