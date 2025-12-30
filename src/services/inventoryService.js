import { apiService } from './api';

export const inventoryService = {
  // Get inventory for a specific product across all warehouses
  getProductInventory: async (productId) => {
    return apiService.get(`/inventory/product/${productId}`);
  },

  // Get inventory for a specific warehouse
  getWarehouseInventory: async (warehouseId, params = {}) => {
    return apiService.get(`/inventory/warehouse/${warehouseId}`, { params });
  },

  // Add product to warehouse (create inventory entry)
  addProductToWarehouse: async (data) => {
    // data: { product_id, warehouse_id, quantity, reorder_level }
    return apiService.post('/inventory', data);
  },

  // Update inventory quantity
  updateInventoryQuantity: async (inventoryId, data) => {
    // data: { quantity, reason, notes }
    return apiService.put(`/inventory/${inventoryId}`, data);
  },

  // Adjust stock (add or remove)
  adjustStock: async (data) => {
    // data: { product_id, warehouse_id, adjustment_type, quantity, reason, notes }
    return apiService.post('/inventory/adjust', data);
  },

  // Transfer stock between warehouses
  transferStock: async (data) => {
    // data: { product_id, from_warehouse_id, to_warehouse_id, quantity, reason, notes }
    return apiService.post('/inventory/transfer', data);
  },

  // Get stock movements history
  getStockMovements: async (params = {}) => {
    return apiService.get('/inventory/movements', { params });
  },

  // Get low stock items across all warehouses
  getLowStockItems: async (params = {}) => {
    return apiService.get('/inventory/alerts/low-stock', { params });
  },

  // Delete inventory entry (remove product from warehouse)
  deleteInventory: async (inventoryId) => {
    return apiService.delete(`/inventory/${inventoryId}`);
  },

  // Check stock availability
  checkStockAvailability: async (productId, warehouseId, quantity) => {
    return apiService.get('/inventory/check-availability', {
      params: { product_id: productId, warehouse_id: warehouseId, quantity }
    });
  }
};

export default inventoryService;