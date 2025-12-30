import { apiService } from './api';
import { downloadBlob } from '../utils/helpers';

export const exportService = {
  // Export Products 
  exportProducts: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/products', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `products_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export products error:', error);
      throw error;
    }
  },

  // Export Customers
  exportCustomers: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/customers', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `customers_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export customers error:', error);
      throw error;
    }
  },

  // Export Employees
  exportEmployees: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/employees', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `employees_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export employees error:', error);
      throw error;
    }
  },

  // Export Sales
  exportSales: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/sales/export', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `sales_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export sales error:', error);
      throw error;
    }
  },

  // Export Stock Report
  exportStockReport: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/inventory', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `stock_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export stock report error:', error);
      throw error;
    }
  },

  // Export Sales Report
  exportSalesReport: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/sales', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `sales_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export sales report error:', error);
      throw error;
    }
  },

  // Export Kitty Report
  exportKittyReport: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/export/kitty', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `kitty_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export kitty report error:', error);
      throw error;
    }
  },

  // Export GST Report
  exportGSTReport: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/reports/gst/export', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `gst_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export GST report error:', error);
      throw error;
    }
  },

  // Export GSTR-1
  exportGSTR1: async (month, year, format = 'excel') => {
    try {
      const response = await apiService.get('/reports/gstr-1/export', {
        params: { month, year, format },
        responseType: 'blob'
      });
      
      const filename = `GSTR1_${month}_${year}.${format === 'excel' ? 'xlsx' : 'json'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export GSTR-1 error:', error);
      throw error;
    }
  },

  // Export GSTR-3B
  exportGSTR3B: async (month, year, format = 'excel') => {
    try {
      const response = await apiService.get('/reports/gstr-3b/export', {
        params: { month, year, format },
        responseType: 'blob'
      });
      
      const filename = `GSTR3B_${month}_${year}.${format === 'excel' ? 'xlsx' : 'json'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export GSTR-3B error:', error);
      throw error;
    }
  },

  // Export Stock Transfers
  exportStockTransfers: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/stock-transfers/export', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `stock_transfers_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export stock transfers error:', error);
      throw error;
    }
  },

  // Export Invoice PDF
  exportInvoicePDF: async (saleId) => {
    try {
      const response = await apiService.get(`/sales/${saleId}/pdf`, {
        responseType: 'blob'
      });
      
      const filename = `invoice_${saleId}.pdf`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export invoice error:', error);
      throw error;
    }
  },

  // Bulk export invoices
  exportInvoicesBulk: async (saleIds = []) => {
    try {
      const response = await apiService.post('/sales/export-invoices-bulk', {
        sale_ids: saleIds
      }, {
        responseType: 'blob'
      });
      
      const filename = `invoices_${new Date().toISOString().split('T')[0]}.zip`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Bulk export invoices error:', error);
      throw error;
    }
  },

  // Export Deliveries
  exportDeliveries: async (params = {}, format = 'excel') => {
    try {
      const response = await apiService.get('/deliveries/export', {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const filename = `deliveries_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, filename);
      return { success: true };
    } catch (error) {
      console.error('Export deliveries error:', error);
      throw error;
    }
  },

  // Generic export with custom endpoint
  exportData: async (endpoint, params = {}, format = 'excel', filename = 'export') => {
    try {
      const response = await apiService.get(endpoint, {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      const fullFilename = `${filename}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      downloadBlob(response, fullFilename);
      return { success: true };
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }
};

export default exportService;