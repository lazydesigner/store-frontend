import { apiService } from './api';

export const roleService = {
  // Get all roles
  getAllRoles: async (params = {}) => {
    return apiService.get('/employees/roles/all', { params });
  }, 

  getSummary: async () => {
    return apiService.get('/employees/roles/summary');
  },

  // Get single role by ID
  getRoleById: async (id) => {
    return apiService.get(`/employees/roles/${id}`);
  },

  // Create new role
  createRole: async (roleData) => {
    return apiService.post('/employees/roles', roleData);
  },

  // Update role
  updateRole: async (id, roleData) => {
    return apiService.put(`/employees/roles/${id}`, roleData);
  },

  // Delete role
  deleteRole: async (id) => {
    return apiService.delete(`/employees/roles/${id}`);
  },

  // Get all permissions
  getAllPermissions: async () => {
    return apiService.get('/employees/permissions/all');
  },

  // Get role permissions
  getRolePermissions: async (roleId) => {
    return apiService.get(`/employees/roles/${roleId}/permissions`);
  },

  // Update role permissions
  updateRolePermissions: async (roleId, permissions) => {
    return apiService.post(`/employees/roles/${roleId}/permissions`, { permissions });
  },

  // Bulk update permissions for multiple roles
  bulkUpdatePermissions: async (rolePermissions) => {
    return apiService.post('/employees/roles/permissions/bulk-update', { rolePermissions });
  },

  // Get permission matrix (all roles with their permissions)
  getPermissionMatrix: async () => {
    return apiService.get('/employees/roles/permission-matrix');
  },

  // Get role statistics
  getRoleStats: async (roleId) => {
    return apiService.get(`/employees/roles/${roleId}/stats`);
  }
};

export default roleService;