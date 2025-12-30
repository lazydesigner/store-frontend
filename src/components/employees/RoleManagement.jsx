import React, { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import { getPermissionsByModule } from '../../utils/permissions';
import roleService from '../../services/roleService';

const RoleManagement = ({ roles = [], onSave }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const permissionsByModule = getPermissionsByModule();
//console.log(permissionsByModule)
  useEffect(()=>{
    permissionsByModule2()
  },[])
 
  const permissionsByModule2 = async () => {
    const Allpermissions = await roleService.getAllPermissions()
    //console.log(Allpermissions)
  }

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId); 
    
    // Load permissions for selected role
    const role = roles.find(r => r.id === Number(roleId)); 
    if (role && role.permissions) {
      const permMap = {};
      role.permissions.forEach(perm => {
        permMap[perm.key] = true;
      });
      setPermissions(permMap); 
    } else {
      setPermissions({});
      //console.log('No Permissions')
    }
  };

  const handlePermissionToggle = (permissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  const handleSelectAll = (modulePermissions) => {
    const newPermissions = { ...permissions };
    const allSelected = modulePermissions.every(p => permissions[p.key]);
    
    modulePermissions.forEach(p => {
      newPermissions[p.key] = !allSelected;
    });
    
    setPermissions(newPermissions);
  };

  const handleSave = async () => {
    setLoading(true);
    try { 
      const selectedPermissions = Object.keys(permissions).filter(key => permissions[key]);
      await onSave(selectedRole, selectedPermissions);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: `${role.name}`
  }));

  return ( 
    <div className="space-y-6">
      <Card>
        <Select
          label="Select Role to Manage"
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          options={roleOptions}
          placeholder="Choose a role"
        />
      </Card>

      {selectedRole && (
        <>
          <Card title="Manage Permissions">
            <div className="space-y-6">
              {Object.entries(permissionsByModule).map(([moduleName, modulePerms]) => {
                const allSelected = modulePerms.every(p => permissions[p.key]); 
                const someSelected = modulePerms.some(p => permissions[p.key]);

                return (
                  <div key={moduleName} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        {moduleName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(modulePerms)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {modulePerms.map(permission => (
                        <label
                          key={permission.key}
                          className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                            permissions[permission.key]
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={permissions[permission.key] || false}
                            onChange={() => handlePermissionToggle(permission.key)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setSelectedRole('')}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={loading}>
              Save Permissions
            </Button>
          </div>
        </>
      )}

      {!selectedRole && (
        <Card>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a role to manage its permissions</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoleManagement;