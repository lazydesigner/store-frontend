// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// App Config
export const APP_NAME = 'Friends Digital';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY hh:mm A';
export const TIME_FORMAT = 'hh:mm A';

// Sale Types
export const SALE_TYPES = {
  DRAFT: 'draft',
  PROFORMA: 'proforma',
  INVOICE: 'invoice'
};

export const SALE_TYPE_LABELS = {
  draft: 'Draft',
  proforma: 'Proforma Invoice',
  invoice: 'Invoice'
};

// Sale Status
export const SALE_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

export const SALE_STATUS_LABELS = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled'
};

export const SALE_STATUS_COLORS = {
  draft: 'warning',
  confirmed: 'success',
  cancelled: 'danger'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  UPI: 'upi',
  BANK: 'bank',
  CHEQUE: 'cheque',
  ONLINE: 'online'
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  upi: 'UPI',
  bank: 'Bank Transfer',
  cheque: 'Cheque',
  online: 'Online Payment'
};

// Delivery Status
export const DELIVERY_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  READY_TO_SHIP: 'ready_to_ship',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

export const DELIVERY_STATUS_LABELS = {
  new: 'New',
  processing: 'Processing',
  ready_to_ship: 'Ready to Ship',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed'
};

export const DELIVERY_STATUS_COLORS = {
  new: 'info',
  processing: 'warning',
  ready_to_ship: 'info',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
  failed: 'danger'
}; 

// Permissions
export const PERMISSIONS = {
  // Sales
  SALES_CREATE: 'SALES_CREATE',
  SALES_VIEW: 'SALES_VIEW',
  SALES_EDIT: 'SALES_EDIT',
  SALES_DELETE: 'SALES_DELETE',
  SALES_DISCOUNT: 'SALES_DISCOUNT',

  // Customers
  CUSTOMER_CREATE: 'CUSTOMER_CREATE',
  CUSTOMER_VIEW: 'CUSTOMER_VIEW',
  CUSTOMER_EDIT: 'CUSTOMER_EDIT',
  CUSTOMER_DELETE: 'CUSTOMER_DELETE',

  // Products
  PRODUCT_CREATE: 'PRODUCT_CREATE',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_EDIT: 'PRODUCT_EDIT',
  PRODUCT_DELETE: 'PRODUCT_DELETE',
  PRODUCT_IMPORT: 'PRODUCT_IMPORT',

  // Inventory
  INVENTORY_VIEW: 'INVENTORY_VIEW',
  INVENTORY_ADJUST: 'INVENTORY_ADJUST',

  // Delivery
  DELIVERY_VIEW: 'DELIVERY_VIEW',
  DELIVERY_ASSIGN: 'DELIVERY_ASSIGN',
  DELIVERY_UPDATE: 'DELIVERY_UPDATE',

  // Employees
  EMPLOYEE_CREATE: 'EMPLOYEE_CREATE',
  EMPLOYEE_VIEW: 'EMPLOYEE_VIEW',
  EMPLOYEE_EDIT: 'EMPLOYEE_EDIT',
  EMPLOYEE_DELETE: 'EMPLOYEE_DELETE',

  // Reports
  REPORT_VIEW: 'REPORT_VIEW',
  REPORTS_SALES: 'REPORTS_SALES',
  REPORTS_STOCK: 'REPORTS_STOCK',
  REPORTS_KITTY: 'REPORTS_KITTY',
  REPORTS_GST: 'REPORTS_GST',

  DISCOUNT_VIEW: 'DISCOUNT_VIEW',
  DISCOUNT_CREATE: 'DISCOUNT_CREATE',
  DISCOUNT_EDIT: 'DISCOUNT_EDIT',
  DISCOUNT_DELETE: 'DISCOUNT_DELETE',

  // Payments
  PAYMENTS_CREATE: 'PAYMENTS_CREATE',
  PAYMENTS_VIEW: 'PAYMENTS_VIEW',

  // Settings
  SETTINGS_VIEW: 'SETTINGS_VIEW',
  SETTINGS_EDIT: 'SETTINGS_EDIT',


  WAREHOUSE_VIEW: 'WAREHOUSE_VIEW',

  // Admin
  ADMIN_FULL: 'ADMIN_FULL'
};

// Roles
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager', 
  SALES: 'Sales',
  DELIVERY: 'Delivery',
  FINANCE: 'Finance'
};

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  EXCEL: ['.xlsx', '.xls'],
  CSV: ['.csv'],
  PDF: ['.pdf'],
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif']
};

// Validation Rules
export const VALIDATION = {
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  GSTIN_REGEX: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PASSWORD_MIN_LENGTH: 8,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10
};

// Table Columns Config
export const TABLE_COLUMNS = {
  PRODUCTS: ['SKU', 'Name', 'Type', 'Company', 'Price Range', 'Stock', 'Status', 'Actions'],
  CUSTOMERS: ['Name', 'Phone', 'Email', 'City', 'Total Orders', 'Actions'],
  EMPLOYEES: ['Name', 'Username', 'Phone', 'Role', 'Status', 'Actions'],
  SALES: ['Invoice No', 'Date', 'Customer', 'Amount', 'Payment', 'Status', 'Actions'],
  DELIVERIES: ['Order No', 'Customer', 'Delivery Person', 'Status', 'Date', 'Actions']
};

// Chart Colors
export const CHART_COLORS = [
  '#2563eb', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899'  // Pink
];

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Import Types
export const IMPORT_TYPES = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory'
};

// Export Formats
export const EXPORT_FORMATS = {
  EXCEL: 'excel',
  CSV: 'csv',
  PDF: 'pdf'
};

// Dashboard Stats Period
export const STATS_PERIOD = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

// GST Rates (India)
export const GST_RATES = [0, 5, 12, 18, 28];

// Discount Types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

// Invoice Settings
export const INVOICE_PREFIX = 'INV';
export const PROFORMA_PREFIX = 'PI';

// OTP Settings
export const OTP_RESEND_TIMEOUT = 60; // seconds

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state'
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Status Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Record created successfully',
    UPDATE: 'Record updated successfully',
    DELETE: 'Record deleted successfully',
    IMPORT: 'Data imported successfully',
    EXPORT: 'Data exported successfully'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'Record not found.',
    VALIDATION: 'Please check the form for errors.'
  }
};