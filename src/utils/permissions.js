/**
 * Permission definitions and role configurations
 */

// All available permissions
export const ALL_PERMISSIONS = {
  // Sales
  SALES_CREATE: { key: 'SALES_CREATE', name: 'Create Sales', module: 'Sales' },
  SALES_VIEW: { key: 'SALES_VIEW', name: 'View Sales', module: 'Sales' },
  SALES_EDIT: { key: 'SALES_EDIT', name: 'Edit Sales', module: 'Sales' },
  SALES_DELETE: { key: 'SALES_DELETE', name: 'Delete Sales', module: 'Sales' },
  SALES_DISCOUNT: { key: 'SALES_DISCOUNT', name: 'Apply Discount', module: 'Sales' },
  
  // Customers
  CUSTOMER_CREATE: { key: 'CUSTOMER_CREATE', name: 'Create Customer', module: 'Customers' },
  CUSTOMER_VIEW: { key: 'CUSTOMER_VIEW', name: 'View Customers', module: 'Customers' },
  CUSTOMER_EDIT: { key: 'CUSTOMER_EDIT', name: 'Edit Customer', module: 'Customers' },
  CUSTOMER_DELETE: { key: 'CUSTOMER_DELETE', name: 'Delete Customer', module: 'Customers' },
  
  // Products
  PRODUCT_CREATE: { key: 'PRODUCT_CREATE', name: 'Create Product', module: 'Products' },
  PRODUCT_VIEW: { key: 'PRODUCT_VIEW', name: 'View Products', module: 'Products' },
  PRODUCT_EDIT: { key: 'PRODUCT_EDIT', name: 'Edit Product', module: 'Products' },
  PRODUCT_DELETE: { key: 'PRODUCT_DELETE', name: 'Delete Product', module: 'Products' },
  PRODUCT_IMPORT: { key: 'PRODUCT_IMPORT', name: 'Import Products', module: 'Products' },
  
  // Inventory
  INVENTORY_VIEW: { key: 'INVENTORY_VIEW', name: 'View Inventory', module: 'Inventory' },
  INVENTORY_ADJUST: { key: 'INVENTORY_ADJUST', name: 'Adjust Inventory', module: 'Inventory' },
  
  // Delivery
  DELIVERY_VIEW: { key: 'DELIVERY_VIEW', name: 'View Deliveries', module: 'Delivery' },
  DELIVERY_ASSIGN: { key: 'DELIVERY_ASSIGN', name: 'Assign Delivery', module: 'Delivery' },
  DELIVERY_UPDATE: { key: 'DELIVERY_UPDATE', name: 'Update Delivery', module: 'Delivery' },
  
  // Employees
  EMPLOYEE_CREATE: { key: 'EMPLOYEE_CREATE', name: 'Create Employee', module: 'Employees' },
  EMPLOYEE_VIEW: { key: 'EMPLOYEE_VIEW', name: 'View Employees', module: 'Employees' },
  EMPLOYEE_EDIT: { key: 'EMPLOYEE_EDIT', name: 'Edit Employee', module: 'Employees' },
  EMPLOYEE_DELETE: { key: 'EMPLOYEE_DELETE', name: 'Delete Employee', module: 'Employees' },
   
  // Reports
  REPORT_VIEW: { key: 'REPORT_VIEW', name: 'View Reports', module: 'Reports' },
  REPORTS_SALES: { key: 'REPORTS_SALES', name: 'Sales Reports', module: 'Reports' },
  REPORTS_STOCK: { key: 'REPORTS_STOCK', name: 'Stock Reports', module: 'Reports' },
  REPORTS_KITTY: { key: 'REPORTS_KITTY', name: 'Kitty Reports', module: 'Reports' },
  REPORTS_GST: { key: 'REPORTS_GST', name: 'GST Reports', module: 'Reports' },
  
  // Payments
  PAYMENT_CREATE: { key: 'PAYMENT_CREATE', name: 'Create Payment', module: 'Payments' },
  PAYMENT_VIEW: { key: 'PAYMENT_VIEW', name: 'View Payments', module: 'Payments' },
  PAYMENT_REFUND: { key: 'PAYMENT_REFUND', name: 'Refund Payments', module: 'Payments' },

  
   DISCOUNT_VIEW :  { key: 'DISCOUNT_VIEW', name: 'discount limits', module: 'Discounts ' },
   DISCOUNT_CREATE :  { key: 'DISCOUNT_CREATE', name: 'discount limits', module: 'Discounts '  },
    DISCOUNT_EDIT  :{ key: 'DISCOUNT_EDIT', name: 'discount limits', module: 'Discounts '  },
    DISCOUNT_DELETE:  { key: 'DISCOUNT_DELETE', name: 'discount limits', module: 'Discounts '  },
  
  // Settings
  SETTINGS_VIEW: { key: 'SETTINGS_VIEW', name: 'View Settings', module: 'Settings' },
  SETTINGS_EDIT: { key: 'SETTINGS_EDIT', name: 'Edit Settings', module: 'Settings' },
  
  // Admin
  ADMIN_FULL: { key: 'ADMIN_FULL', name: 'Full Admin Access', module: 'Admin' }
};

// Default role configurations
export const DEFAULT_ROLE_PERMISSIONS = {
  Admin: Object.keys(ALL_PERMISSIONS),
  
  Manager: [ 
    'SALES_CREATE', 'SALES_VIEW', 'SALES_EDIT', 'SALES_DISCOUNT',
    'CUSTOMER_CREATE', 'CUSTOMER_VIEW', 'CUSTOMER_EDIT',
    'PRODUCT_VIEW', 'PRODUCT_EDIT',
    'INVENTORY_VIEW', 'INVENTORY_ADJUST',
    'DELIVERY_VIEW', 'DELIVERY_ASSIGN', 'DELIVERY_UPDATE',
    'EMPLOYEE_VIEW',
    'REPORTS_VIEW', 'REPORTS_SALES', 'REPORTS_STOCK', 'REPORTS_KITTY', 'REPORT_GST',
    'PAYMENTS_CREATE', 'PAYMENTS_VIEW',
    'SETTINGS_VIEW', 'SETTINGS_EDIT'
  ],
  
  Sales: [
    'SALES_CREATE', 'SALES_VIEW', 'SALES_DISCOUNT',
    'CUSTOMER_CREATE', 'CUSTOMER_VIEW', 'CUSTOMER_EDIT',
    'PRODUCT_VIEW',
    'INVENTORY_VIEW',
    'PAYMENTS_CREATE', 'PAYMENTS_VIEW'
  ],
  
  Delivery: [
    'DELIVERY_VIEW', 'DELIVERY_UPDATE',
    'CUSTOMER_VIEW',
    'SALES_VIEW'
  ],
  
  Finance: [
    'SALES_VIEW',
    'CUSTOMER_VIEW',
    'PAYMENTS_CREATE', 'PAYMENTS_VIEW',
    'REPORTS_VIEW', 'REPORTS_SALES', 'REPORT_GST'
  ]
};

// Get permissions by module
export const getPermissionsByModule = () => {
  const modules = {};
  
  Object.values(ALL_PERMISSIONS).forEach(permission => {
    if (!modules[permission.module]) {
      modules[permission.module] = [];
    }
    modules[permission.module].push(permission);
  });
  
  return modules;
};

// Check if permission exists
export const isValidPermission = (permissionKey) => {
  return !!ALL_PERMISSIONS[permissionKey];
};

// Get permission display name
export const getPermissionName = (permissionKey) => {
  return ALL_PERMISSIONS[permissionKey]?.name || permissionKey;
};

// Get permissions for a role
export const getRolePermissions = (role) => {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
};

export default {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getPermissionsByModule,
  isValidPermission,
  getPermissionName,
  getRolePermissions
};