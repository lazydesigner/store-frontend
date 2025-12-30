import { apiService } from './api';

export const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    return apiService.get('/products', { params });
  },

  // Get single product by ID
  getProductById: async (id) => {
    return apiService.get(`/products/${id}`);
  },

  // Create new product
  createProduct: async (productData) => {
    return apiService.post('/products', productData);
  },

  // Update product
  updateProduct: async (id, productData) => {
    return apiService.put(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: async (id) => { 
    return apiService.delete(`/products/${id}`);
  },

  // Import products from Excel
  importProducts: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.post('/imports/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    });
  },

  // Commit import after preview
  commitImport: async (importId) => {
    return apiService.post(`/products/import/commit/${importId}`);
  },

  // Export products to Excel
  exportProducts: async (params = {}) => {
    return apiService.get('/products/export', {
      params,
      responseType: 'blob'
    });
  },

  // Get stock by warehouse
  getStockByWarehouse: async (warehouseId, productId = null) => {
    const params = productId ? { product_id: productId } : {};
    return apiService.get(`/warehouses/${warehouseId}/inventory`, { params });
  },
 
  getProductsByWarehouse: async (warehouseId) => {
  const response = await apiService.get(
    `/products/warehouse/${warehouseId}?in_stock_only=true&is_active=true`
  );
  return response.data;
  },

  // Update stock
  updateStock: async (productId, warehouseId, quantity) => {
    return apiService.post('/inventory/adjust', {
      product_id: productId,
      warehouse_id: warehouseId,
      quantity
    });
  },

  // Get product types
  getProductTypes: async () => {
    return apiService.get('/products/types/all');
  },

  // Get companies
  getCompanies: async () => {
    return apiService.get('/companies');
  }
};

export default productService;