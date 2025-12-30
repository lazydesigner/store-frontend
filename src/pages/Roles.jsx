import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users, Key } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import PermissionMatrix from '../components/employees/PermissionMatrix';
import { useNotification } from '../context/NotificationContext';

import roleService from '../services/roleService';

const Roles = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [roleAndPermission, setRoleAndPermission] = useState([]);

  const { success, error } = useNotification();

  const [createRoleData, setCreateRoleData] = useState({
    name: '',
    description: '',
  });

  const handelRoleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateRoleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedRole) {
        // Update existing role
        await roleService.updateRole(selectedRole.id, createRoleData);
        success('Role updated successfully');
      } else {
        // Create new role
        await roleService.createRole(createRoleData);
        success('Role created successfully');
      }
      setShowAddModal(false);
      setSelectedRole(null);
      // Refresh roles list
      const summaryResponse = await roleService.getSummary();
      setRoles(summaryResponse.data);
    } catch (error) {
      console.error('Error submitting role data:', error);
      error('Failed to submit role data');
    }
  };

  const saveAndUpdatePermissions = async (permissions) => {
    try {
      await roleService.bulkUpdatePermissions(permissions);
      success('Permissions updated successfully');

      const [summaryResponse, roleAndPermissionResponse] = await Promise.all([
        roleService.getSummary(),
        roleService.getAllRoles(),
      ]);
      setRoles(summaryResponse.data);
      setRoleAndPermission(roleAndPermissionResponse.data);
    } catch (error) {
      console.error('Error updating permissions:', error);
      error('Failed to update permissions');
    }
  };


  useEffect(() => { 
    const fetchRoleData = async () => {
      try {
        // Run both requests in parallel
        const [summaryResponse, permissionsResponse, roleAndPermissionResponse] = await Promise.all([
          roleService.getSummary(),
          roleService.getAllPermissions(),
          roleService.getAllRoles(),
        ]);

        // Set roles and log responses
        setRoles(summaryResponse.data);
        setAllPermissions(permissionsResponse.data.all);
        setRoleAndPermission(roleAndPermissionResponse.data); 
      } catch (error) {
        console.error('Error fetching role data:', error);
        error('Failed to fetch role data');
      }
    };

    fetchRoleData();
  }, []);

  const deleteRole = async (roleId) => {
    try {
      const yes = window.confirm('Are you sure you want to delete this role?');
      if (!yes) return;
      await roleService.deleteRole(roleId);
      success('Role deleted successfully');
      // Refresh roles list
     const [summaryResponse, roleAndPermissionResponse] = await Promise.all([
        roleService.getSummary(),
        roleService.getAllRoles(),
      ]);
      setRoles(summaryResponse.data);
      setRoleAndPermission(roleAndPermissionResponse.data);
    } catch (error) {
      console.error('Error deleting role:', error);
      error('Failed to delete role');
    }
  };




  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'employeeCount',
      label: 'Employees',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'permissionCount',
      label: 'Permissions',
      sortable: true,
      render: (value) => (
        <Badge variant="info">{value} permissions</Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-blue-50 rounded text-blue-600"
            onClick={() => {
              setSelectedRole(row);
              setShowPermissionMatrix(true);
            }}
            title="Manage Permissions"
          >
            <Key className="h-4 w-4" />
          </button>
          <button
            className="p-1 hover:bg-yellow-50 rounded text-yellow-600"
            onClick={() => {
              setSelectedRole(row);
              setShowAddModal(true);
            }}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-1 hover:bg-red-50 rounded text-red-600"
            onClick={() => deleteRole(row.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={Key}
            onClick={() => setShowPermissionMatrix(true)}
          >
            Permission Matrix
          </Button>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Role
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Roles</p>
            <h3 className="text-2xl font-bold text-gray-900">{roles.length}</h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Employees</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {roles.reduce((sum, r) => sum + r.employeeCount, 0)}
            </h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Permissions</p>
            <h3 className="text-2xl font-bold text-purple-600">{allPermissions?.length}</h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Roles</p>
            <h3 className="text-2xl font-bold text-green-600">{roles.length}</h3>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Table columns={columns} data={roles} hover={true} />
      </Card>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedRole(null);
        }}
        title={selectedRole ? 'Edit Role' : 'Add New Role'}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setSelectedRole(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{selectedRole ? 'Update' : 'Create'} Role</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Role Name"
            placeholder="Enter role name"
            defaultValue={selectedRole?.name}
            name="name"
            // value={createRoleData.name}
            onChange={handelRoleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              onChange={handelRoleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role description"
              defaultValue={selectedRole?.description}
            // value={createRoleData.description}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <strong>Note:</strong> After creating the role, you can assign permissions using the Permission Matrix.
          </div>
        </div>
      </Modal>

      {/* Permission Matrix Modal */}
      <Modal
        isOpen={showPermissionMatrix}
        onClose={() => {
          setShowPermissionMatrix(false);
          setSelectedRole(null);
        }}
        title="Permission Matrix"
        size="full"
      >
        <PermissionMatrix
          roles={roleAndPermission}
          permissions={allPermissions}
          onSave={(permissions) => {
            //console.log('Saving permissions:', permissions);
            saveAndUpdatePermissions(permissions);
            setShowPermissionMatrix(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Roles;