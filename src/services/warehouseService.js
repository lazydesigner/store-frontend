import { apiService } from './api';

export const warehouseService = {
  // Get all warehouses
  getAllWarehouses: async (params = {}) => {
    return apiService.get('/warehouses', { params });
  },

  // Get single warehouse by ID
  getWarehouseById: async (id) => {
    return apiService.get(`/warehouses/${id}`);
  },

  // Create new warehouse
  createWarehouse: async (warehouseData) => {
    return apiService.post('/warehouses', warehouseData);
  },

  // Update warehouse
  updateWarehouse: async (id, warehouseData) => {
    return apiService.put(`/warehouses/${id}`, warehouseData);
  },

  // Delete warehouse
  deleteWarehouse: async (id) => {
    return apiService.delete(`/warehouses/${id}`);
  },

  // Get warehouse stock
  getWarehouseStock: async (warehouseId, params = {}) => {
    return apiService.get(`/warehouses/${warehouseId}/stock`, { params });
  },

  // Transfer stock between warehouses
  transferStock: async (transferData) => {
    return apiService.post('/inventory/transfer', transferData);
  },

  // Get warehouse statistics
  getWarehouseStats: async (warehouseId) => {
    return apiService.get(`/warehouses/${warehouseId}/stats`);
  },

  // Get low stock items in warehouse
  getLowStockItems: async (warehouseId) => {
    return apiService.get(`/warehouses/${warehouseId}/low-stock`);
  },

   
  // Get warehouse stock summary
  getStockSummary: async (id) => {
    return apiService.get(`/warehouses/${id}/stock-summary`);
  },

  // Get warehouse inventory
  getInventory: async (id, params = {}) => {
    return apiService.get(`/warehouses/${id}/inventory`, { params });
  }

};

export default warehouseService; 