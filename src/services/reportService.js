import { apiService } from './api';

export const reportService = {
  // Sales Reports
  getSalesReport: async (params = {}) => {
    return apiService.get('/reports/sales', { params });
  },

  // Sales by employee
  getSalesByEmployee: async (params = {}) => {
    return apiService.get('/reports/sales-by-employee', { params });
  },

  // Sales by product type
  getSalesByProductType: async (params = {}) => {
    return apiService.get('/reports/product-type/summary', { params });
  },

  // Sales by company
  getSalesByCompany: async (params = {}) => {
    return apiService.get('/reports/company/summary', { params });
  },

  // Sales by company
  getSalesByWarehouse: async (params = {}) => {
    return apiService.get('/reports/warehouse/summary', { params });
  },

  // Sales by company
  getSalesByCustomer2: async (params = {}) => {
    return apiService.get('/reports/customer/analytics', { params });
  },

  // Sales by company
  getSalesTrend: async (params = {}) => {
    return apiService.get('/reports/sales/trends?period=daily&days=30');
  },

  // Sales by product
  getSalesByProduct: async (params = {}) => {
    return apiService.get('/reports/sales-by-product', { params });
  }, 

  // Sales by customer
  getSalesByCustomer: async (params = {}) => {
    return apiService.get('/reports/sales-by-customer', { params });
  },

  // Stock Reports
  getStockReport: async (params = {}) => {
    return apiService.get('/reports/stock', { params });
  },
  // Stock Reports
  getStockReport2: async (params = {}) => {
    return apiService.get('/reports/warehouse/stock-value', { params });
  },


  // Low stock report
  getLowStockReport: async (params = {}) => {
    return apiService.get('/reports/low-stock', { params });
  },

  // Stock movement report
  getStockMovement: async (params = {}) => {
    return apiService.get('/reports/stock-movement', { params });
  },

  // Kitty (Commission) Reports
  getKittyReport: async (params = {}) => {
    return apiService.get('/reports/kitty', { params });
  },

  getKitty: async (params = {}) => {
    return apiService.get('/reports/employee/leaderboard', { params })
  },

  // Kitty by employee
  getKittyByEmployee: async (employeeId, params = {}) => {
    return apiService.get(`/reports/kitty/employee/${employeeId}`, { params });
  },

  // GST Reports
  getGSTReport: async (params = {}) => {
    return apiService.get('/reports/gst', { params });
  },

  // GSTR-1 data
  getGSTR1: async (month, year) => {
    return apiService.get('/reports/gstr-1', {
      params: { month, year }
    });
  },

  // GSTR-3B data
  getGSTR3B: async (month, year) => {
    return apiService.get('/reports/gstr-3b', {
      params: { month, year }
    });
  },

  // Payment Reports
  getPaymentReport: async (params = {}) => {
    return apiService.get('/reports/payments', { params });
  },

  // Outstanding payments
  getOutstandingPayments: async (params = {}) => {
    return apiService.get('/reports/outstanding-payments', { params });
  },

  // Payment by method
  getPaymentsByMethod: async (params = {}) => {
    return apiService.get('/reports/payments-by-method', { params });
  },

  // Dashboard Statistics
  getDashboardStats: async (period = 'today') => {
    return apiService.get('/reports/dashboard-stats', {
      params: { period }
    });
  },

  // Export report to Excel
  exportReport: async (reportType, params = {}) => {
    return apiService.get(`/reports/${reportType}/export`, {
      params,
      responseType: 'blob'
    });
  },

  // Export report to PDF
  exportReportPDF: async (reportType, params = {}) => {
    return apiService.get(`/reports/${reportType}/pdf`, {
      params,
      responseType: 'blob'
    });
  }, 

  // Profit & Loss
  getProfitLoss: async (params = {}) => {
    return apiService.get('/reports/profit-loss', { params });
  },

  // Customer analytics
  getCustomerAnalytics: async (params = {}) => {
    return apiService.get('/reports/customer-analytics', { params });
  }




};

export default reportService;