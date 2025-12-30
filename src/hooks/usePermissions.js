import { useMemo } from 'react';
import useAuth from './useAuth';

/**
 * Permissions hook - provides permission checking utilities
 * 
 * @returns {object} Permission checking functions
 */
export const usePermissions = () => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  const permissions = useMemo(() => {
    return user?.permissions || [];
  }, [user]);

  const can = (permission) => {
    return hasPermission(permission);
  };

  const canAny = (permissionArray) => {
    return hasAnyPermission(permissionArray);
  };

  const canAll = (permissionArray) => {
    return hasAllPermissions(permissionArray);
  };

  const isAdmin = useMemo(() => {
    return user?.role === 'Admin' || hasPermission('ADMIN_FULL');
  }, [user, hasPermission]);

  const isManager = useMemo(() => {
    return user?.role === 'Manager' || isAdmin;
  }, [user, isAdmin]);

  return {
    permissions,
    can,
    canAny,
    canAll,
    isAdmin,
    isManager
  };
};

export default usePermissions;