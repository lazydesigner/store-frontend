import { apiService } from './api';

export const employeeService = {
  // Get all employees with filters
  getAllEmployees: async (params = {}) => {
    return apiService.get('/employees', { params });
  },

  // Get single employee by ID
  getEmployeeById: async (id) => {
    return apiService.get(`/employees/${id}`);
  },

  // Get employees by role
  getByRole: async (roleId = null, roleName = null) => {
    const params = new URLSearchParams();
    if (roleId) params.append('role_id', roleId);
    if (roleName) params.append('role_name', roleName);
    
    const response = await apiService.get(`/employees/by-role?${params}`);
    return response.data;
  },

  // Get all delivery employees
  getDeliveryEmployees: async () => {
    const response = await apiService.get('/employees/delivery/all');
    return response.data;
  },

  // Get delivery employee details
  getDeliveryEmployeeDetails: async (employeeId) => {
    const response = await apiService.get(`/employees/delivery/${employeeId}/details`);
    return response.data;
  },

  // Get employees workload (smart assignment)
  getEmployeesWorkload: async (roleName = null) => {
    const url = roleName 
      ? `/employees/workload?role_name=${roleName}`
      : '/employees/workload';
    
    const response = await apiService.get(url);
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    return apiService.post('/employees', employeeData);
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    return apiService.put(`/employees/${id}`, employeeData);
  },

  // Delete employee
  deleteEmployee: async (id) => {
    return apiService.delete(`/employees/${id}`);
  },

  // Get all roles
  getAllRoles: async () => {
    return apiService.get('/roles');
  },

  // Create role
  createRole: async (roleData) => {
    return apiService.post('/roles', roleData);
  },

  // Update role
  updateRole: async (id, roleData) => {
    return apiService.put(`/roles/${id}`, roleData);
  },

  // Get role permissions
  getRolePermissions: async (roleId) => {
    return apiService.get(`/roles/${roleId}/permissions`);
  },

  // Update role permissions
  updateRolePermissions: async (roleId, permissions) => {
    return apiService.post(`/roles/${roleId}/permissions`, { permissions });
  },

  // // Get discount limits
  // getDiscountLimits: async (params = {}) => {
  //   return apiService.get('/discount-limits', { params });
  // },

  // Create discount limit
  createDiscountLimit: async (limitData) => {
    return apiService.post('/discount-limits', limitData);
  },

  // Update discount limit
  updateDiscountLimit: async (id, limitData) => {
    return apiService.put(`/discount-limits/${id}`, limitData);
  },

  // Delete discount limit
  deleteDiscountLimit: async (id) => {
    return apiService.delete(`/discount-limits/${id}`);
  },

  // Assign role to employee
  assignRole: async (employeeId, roleId) => {
    return apiService.post('/employee-roles', {
      employee_id: employeeId,
      role_id: roleId
    });
  },

  // Remove role from employee
  removeRole: async (employeeId, roleId) => {
    return apiService.delete(`/employee-roles/${employeeId}/${roleId}`);
  },

  // Get all discount limits with filters
  getDiscountLimits: async (params = {}) => {
    return apiService.get('/discount-limits', { params });
  },

  // Get discount limit by ID
  getDiscountLimitById: async (id) => {
    return apiService.get(`/discount-limits/${id}`);
  },

  // Get discount limits for specific employee
  getDiscountLimitsByEmployee: async (employeeId) => {
    return apiService.get('/discount-limits', { 
      params: { employee_id: employeeId } 
    });
  },

  // Get discount limits for specific role
  getDiscountLimitsByRole: async (roleId) => {
    return apiService.get('/discount-limits', { 
      params: { role_id: roleId } 
    });
  },

  // Get applicable discount limit for employee and product type
  getApplicableDiscountLimit: async (employeeId, productTypeId = null) => {
    const params = { employee_id: employeeId };
    if (productTypeId) {
      params.product_type_id = productTypeId;
    }
    return apiService.get('/discount-limits/applicable', { params });
  },

  // Create discount limit
  createDiscountLimit: async (limitData) => {
    /*
    limitData structure:
    {
      applicationType: 'role' | 'employee',
      roleId?: string,           // Required if applicationType is 'role'
      employeeId?: string,       // Required if applicationType is 'employee'
      productTypeId?: string,    // Optional - null means applies to all products
      maxDiscountPercent: number,
      isActive: boolean
    }
    */
    return apiService.post('/discount-limits', limitData);
  },

  // Update discount limit
  updateDiscountLimit: async (id, limitData) => {
    return apiService.put(`/discount-limits/${id}`, limitData);
  },

  // Delete discount limit
  deleteDiscountLimit: async (id) => {
    return apiService.delete(`/discount-limits/${id}`);
  },

  // Validate discount for a sale
  validateDiscount: async (employeeId, productTypeId, discountPercent) => {
    return apiService.post('/discount-limits/validate', {
      employee_id: employeeId,
      product_type_id: productTypeId,
      discount_percent: discountPercent
    });
  },

  // Bulk create discount limits
  bulkCreateDiscountLimits: async (limits) => {
    return apiService.post('/discount-limits/bulk', { limits });
  },
 
  // Get employee statistics
  getEmployeeStats: async (employeeId, params = {}) => {
    return apiService.get(`/employees/${employeeId}/stats`, { params });
  },

  // Get employee sales performance
  getEmployeePerformance: async (employeeId, startDate, endDate) => {
    return apiService.get(`/employees/${employeeId}/performance`, {
      params: { start_date: startDate, end_date: endDate }
    });
  }


};

export default employeeService;