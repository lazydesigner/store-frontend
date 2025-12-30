/**
 * Excel Template Generator
 * Generates downloadable Excel templates for imports
 */

// Function to generate product import template
export const generateProductTemplate = () => {
  const headers = [
    'name',
    'sku',
    'product_type',
    'company',
    'warehouse',
    'hsn_code',
    'tax_rate',
    'min_price',
    'max_price',
    'quantity',
    'description'
  ];

  const sampleData = [
    {
      name: 'iPhone 14 Pro 256GB Black',
      sku: 'IP14P-256-BL',
      product_type: 'Smartphone',
      company: 'Apple',
      warehouse: 'Main Warehouse',
      hsn_code: '8517',
      tax_rate: '18',
      min_price: '115000',
      max_price: '129900',
      quantity: '50',
      description: 'iPhone 14 Pro with 256GB storage in Black color'
    },
    {
      name: 'Samsung Galaxy S23 128GB',
      sku: 'SGS23-128-BK',
      product_type: 'Smartphone',
      company: 'Samsung',
      warehouse: 'Main Warehouse',
      hsn_code: '8517',
      tax_rate: '18',
      min_price: '74999',
      max_price: '84999',
      quantity: '30',
      description: 'Samsung Galaxy S23 with 128GB storage'
    }
  ];

  return { headers, sampleData };
};

// Function to generate customer import template
export const generateCustomerTemplate = () => {
  const headers = [
    'name',
    'phone',
    'email',
    'gstin',
    'billing_address',
    'billing_city',
    'billing_state',
    'billing_pincode',
    'shipping_address',
    'shipping_city',
    'shipping_state',
    'shipping_pincode'
  ];

  const sampleData = [
    {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@email.com',
      gstin: '22AAAAA0000A1Z5',
      billing_address: '123 Main Street, Sector 15',
      billing_city: 'Mumbai',
      billing_state: 'Maharashtra',
      billing_pincode: '400001',
      shipping_address: '123 Main Street, Sector 15',
      shipping_city: 'Mumbai',
      shipping_state: 'Maharashtra',
      shipping_pincode: '400001'
    }
  ];

  return { headers, sampleData };
};

// Function to convert template to CSV format
export const generateCSV = (headers, data) => {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add sample data
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

// Function to download CSV file
export const downloadCSV = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Main function to download product template
export const downloadProductTemplate = () => {
  const { headers, sampleData } = generateProductTemplate();
  const csv = generateCSV(headers, sampleData);
  downloadCSV('product_import_template.csv', csv);
};

// Main function to download customer template
export const downloadCustomerTemplate = () => {
  const { headers, sampleData } = generateCustomerTemplate();
  const csv = generateCSV(headers, sampleData);
  downloadCSV('customer_import_template.csv', csv);
};

// Function to parse CSV file
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('File is empty or invalid'));
          return;
        }
        
        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row);
        }
        
        resolve({ headers, data });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Function to validate product import data
export const validateProductData = (data) => {
  const errors = [];
  const requiredFields = ['name', 'sku', 'product_type', 'company', 'warehouse', 'min_price', 'max_price'];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and we have header row
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push({
          row: rowNumber,
          column: field,
          message: `${field} is required`
        });
      }
    });
    
    // Validate SKU uniqueness
    const duplicates = data.filter(r => r.sku === row.sku);
    if (duplicates.length > 1 && duplicates[0] === row) {
      errors.push({
        row: rowNumber,
        column: 'sku',
        message: 'Duplicate SKU found in file'
      });
    }
    
    // Validate price range
    const minPrice = parseFloat(row.min_price);
    const maxPrice = parseFloat(row.max_price);
    
    if (isNaN(minPrice) || minPrice < 0) {
      errors.push({
        row: rowNumber,
        column: 'min_price',
        message: 'Invalid minimum price'
      });
    }
    
    if (isNaN(maxPrice) || maxPrice < 0) {
      errors.push({
        row: rowNumber,
        column: 'max_price',
        message: 'Invalid maximum price'
      });
    }
    
    if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice >= maxPrice) {
      errors.push({
        row: rowNumber,
        column: 'max_price',
        message: 'Maximum price must be greater than minimum price'
      });
    }
    
    // Validate quantity
    const quantity = parseInt(row.quantity);
    if (row.quantity && (isNaN(quantity) || quantity < 0)) {
      errors.push({
        row: rowNumber,
        column: 'quantity',
        message: 'Invalid quantity'
      });
    }
    
    // Validate tax rate
    const taxRate = parseFloat(row.tax_rate);
    if (row.tax_rate && (isNaN(taxRate) || taxRate < 0 || taxRate > 100)) {
      errors.push({
        row: rowNumber,
        column: 'tax_rate',
        message: 'Tax rate must be between 0 and 100'
      });
    }
  });
  
  return errors;
};

export default {
  generateProductTemplate,
  generateCustomerTemplate,
  downloadProductTemplate,
  downloadCustomerTemplate,
  parseCSV,
  validateProductData
};