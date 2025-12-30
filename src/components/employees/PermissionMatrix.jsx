import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const PermissionMatrix = ({ roles = [], permissions = [], onSave }) => {
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Group permissions by module 
  const permissionsByModule = permissions.reduce((acc, perm) => {
    const module = perm.key.split('_')[0];
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {}); 
 
  useEffect(() => {
    if (roles.length > 0) {
      const rolePermMap = roles.reduce((acc, role) => {
        acc[role.id] = role.permissions?.map(p => p.id) || [];
        return acc;
      }, {});
      //console.log(rolePermMap)
      setRolePermissions(rolePermMap);
    } 
  }, [roles]);
 
  

  const handleToggle = (roleId, permissionKey) => {
  setRolePermissions(prev => {
    const currentPermissions = prev[roleId] || [];

    const isAlreadyPresent = currentPermissions.includes(permissionKey);

    return {
      ...prev,
      [roleId]: isAlreadyPresent
        ? currentPermissions.filter(id => id !== permissionKey) // remove
        : [...currentPermissions, permissionKey]               // add
    };
  });
};


 const handleToggleAll = (roleId, module) => {
  const modulePerms = permissionsByModule[module]; // array of permissions
  const currentPermissions = rolePermissions[roleId] || [];

  // Check if all module permissions are already selected
  const allChecked = modulePerms.every(p => currentPermissions.includes(p.id));

  setRolePermissions(prev => {
    let updatedPermissions;

    if (allChecked) {
      // 🗑️ Remove all permissions from this module
      updatedPermissions = currentPermissions.filter(
        id => !modulePerms.some(p => p.id === id)
      );
    } else {
      // ➕ Add all permissions (ensure no duplicates)
      const moduleIds = modulePerms.map(p => p.id);
      const merged = [...currentPermissions, ...moduleIds];
      updatedPermissions = Array.from(new Set(merged)); // remove duplicates
    }

    return {
      ...prev,
      [roleId]: updatedPermissions
    };
  });
};


  const handleSave = async () => {
    setLoading(true);
    try {
      const formatted = Object.entries(rolePermissions).map(([roleId, permissions]) => ({
  roleId: Number(roleId),
  permissions
}));
      await onSave(formatted);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  }; 
 

  return (
    <div className="space-y-6">
      <Card 
        title="Role-Permission Matrix"
        subtitle="Manage permissions for each role"
        headerActions={
          <Button onClick={handleSave} loading={loading}>
            Save All Changes
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50 z-10">
                  Permission
                </th>
                {roles.map(role => (
                  <th
                    key={role.id}
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Shield className="h-4 w-4" />
                      <span>{role.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <React.Fragment key={module}>
                  {/* Module Header Row */}
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-semibold text-blue-900 sticky left-0 bg-blue-50">
                      {module.toUpperCase()}
                    </td>
                    {roles.map(role => (
                      <td key={role.id} className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleAll(role.id, module)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Toggle All
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Permission Rows */}
                  {perms.map(perm => (
                    <tr key={perm.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 sticky left-0 bg-white">
                        <div>
                          <p className="font-medium">{perm.key}</p>
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        </div>
                      </td>
                      {roles.map(role => { 
                        const rolePermSet = new Set(rolePermissions[role.id] || []);
                        const isChecked = rolePermSet.has(perm.id); 

                        return (
                          <td key={role.id} className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleToggle(role.id, perm.id)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            > 
                              {isChecked ? (
                                <Check className="h-5 w-5" />
                                
                              ) : (
                                <X className="h-5 w-5" />
                              )} 
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <Card>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Permission Granted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
              <X className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">Permission Denied</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PermissionMatrix;




// import React from 'react';
// import { Shield, Check, X } from 'lucide-react';
// import Card from '../common/Card';
// import { getPermissionsByModule } from '../../utils/permissions';

// const PermissionMatrix = ({ roles = [] }) => {
//   const permissionsByModule = getPermissionsByModule();

//   const hasPermission = (role, permissionKey) => {
//     return role.permissions && role.permissions.includes(permissionKey);
//   };

//   return (
//     <Card title="Permission Matrix" subtitle="View all role permissions at a glance">
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead className="bg-gray-50 sticky top-0">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50">
//                 Permission
//               </th>
//               {roles.map((role) => (
//                 <th key={role.id} className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
//                   <div className="flex items-center justify-center space-x-1">
//                     <Shield className="h-4 w-4" />
//                     <span>{role.name}</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {Object.entries(permissionsByModule).map(([moduleName, modulePerms]) => (
//               <React.Fragment key={moduleName}>
//                 {/* Module Header */}
//                 <tr className="bg-blue-50">
//                   <td colSpan={roles.length + 1} className="px-6 py-2 text-sm font-semibold text-blue-900">
//                     {moduleName}
//                   </td>
//                 </tr>
                
//                 {/* Permissions */}
//                 {modulePerms.map((permission) => (
//                   <tr key={permission.key} className="hover:bg-gray-50">
//                     <td className="px-6 py-3 text-sm text-gray-900 sticky left-0 bg-white">
//                       {permission.name}
//                     </td>
//                     {roles.map((role) => (
//                       <td key={role.id} className="px-6 py-3 text-center">
//                         {hasPermission(role, permission.key) ? (
//                           <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
//                             <Check className="h-4 w-4 text-green-600" />
//                           </div>
//                         ) : (
//                           <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
//                             <X className="h-4 w-4 text-gray-400" />
//                           </div>
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default PermissionMatrix;