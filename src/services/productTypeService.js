import { apiService } from './api';

export const productTypeService = {
  // Get all product types
  getAllProductTypes: async (params = {}) => {
    return apiService.get('/product-types', { params });
  },

  // Get single product type by ID
  getProductTypeById: async (id) => {
    return apiService.get(`/product-types/${id}`);
  },

  // Create new product type
  createProductType: async (data) => {
    return apiService.post('/product-types', data);
  },

  // Update product type
  updateProductType: async (id, data) => {
    return apiService.put(`/product-types/${id}`, data);
  },

  // Delete product type
  deleteProductType: async (id) => {
    return apiService.delete(`/product-types/${id}`);
  },

  // Get products count by type
  getProductCount: async (typeId) => {
    return apiService.get(`/product-types/${typeId}/product-count`);
  }
};

export default productTypeService;