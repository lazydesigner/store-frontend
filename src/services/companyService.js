import { apiService } from './api';

export const companyService = {
  // Get all companies
  getAllCompanies: async (params = {}) => {
    return apiService.get('/companies', { params });
  },

  // Get single company by ID
  getCompanyById: async (id) => {
    return apiService.get(`/companies/${id}`);
  },

  // Create new company
  createCompany: async (data) => {
    return apiService.post('/companies', data);
  },

  // Update company
  updateCompany: async (id, data) => {
    return apiService.put(`/companies/${id}`, data);
  },

  // Delete company
  deleteCompany: async (id) => {
    return apiService.delete(`/companies/${id}`);
  },

  // Get products count by company
  getProductCount: async (companyId) => {
    return apiService.get(`/companies/${companyId}/product-count`);
  },

  // Toggle company status
  toggleStatus: async (id, status) => {
    return apiService.patch(`/companies/${id}/status`, { status });
  }
};

export default companyService;