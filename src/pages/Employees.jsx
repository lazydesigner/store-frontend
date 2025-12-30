import React, { useState, useEffect } from 'react';
import { Plus, Shield, Key, Grid } from 'lucide-react';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import RoleManagement from '../components/employees/RoleManagement';
import PermissionMatrix from '../components/employees/PermissionMatrix';
import DiscountLimits from '../components/employees/DiscountLimits';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import { useNotification } from '../context/NotificationContext';

import employeeService from '../services/employeeService';
import roleService from '../services/roleService';

const Employees = () => {
  const { success, error } = useNotification();
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [discountLimits, setDiscountLimits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('employees'); // employees, roles, permissions, discounts
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const fetchEmployes = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAllEmployees();
      // setEmployees(response.data); 
      const employeesData = response.data.map(emp => ({
        id: emp.id,
        name: emp.name,
        username: emp.username,
        phone: emp.phone,
        photo: emp.photo,
        email: emp.email,
        accountNo: emp.accountNo,
        starRating: emp.starRating,
        employeeAddress: emp.employeeAddress,
        role: emp.roles?.[0]?.name || 'N/A',
        roleId: emp.roles?.[0]?.EmployeeRole?.role_id || 'N/A',
        isActive: emp.is_active,
        joinDate: emp.created_at?.split('T')[0] || ''
      }));

      setEmployees(employeesData);
    } catch (err) {
      error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };


  const mockDiscountLimits = [
    { id: 1, targetType: 'role', targetName: 'Sales', productTypeName: 'All Products', maxDiscount: 10 },
    { id: 2, targetType: 'employee', targetName: 'Rahul Verma', productTypeName: 'Smartphones', maxDiscount: 15 }
  ];

  useEffect(() => {
    fetchData();
    fetchEmployes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roleAndPermissionResponse] = await Promise.all([
        roleService.getAllRoles(),
      ]);
      setRoles(roleAndPermissionResponse.data);
      setDiscountLimits(mockDiscountLimits);
    } catch (err) {
      error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => { 
    try {
      

      if (employeeData?.id) {

        const newData = {
          email: employeeData.email,
          is_active: employeeData.is_active,
          name: employeeData.name,
          phone: employeeData.phone,
          role_ids: employeeData.role_ids,
          accountNo: employeeData.accountNo,
          photo: employeeData.photo,
          starRating: employeeData.starRating,
          employeeAddress: employeeData.employeeAddress,
        }
        const response = await employeeService.updateEmployee(employeeData.id, newData)
      } else {
        const response = await employeeService.createEmployee(employeeData)
      }

      success('Employee added successfully!');

      if (employeeData?.role_ids) {

      } else {

      }

      setShowAddModal(false);
      fetchEmployes();
    } catch (err) {
      const message = err?.message || String(err);

      if (message.includes("409")) {
        error("Duplicate entry — employee already exists");
        return;
      }
      error('Failed to add employee');

    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try { 
        employeeService.deleteEmployee(employee.id)
        success('Employee deleted successfully');
        fetchData();
      } catch (err) {
        error('Failed to delete employee');
      }
    }
  };

  const handleManagePermissions = (employee) => {
    //console.log('Manage permissions for:', employee);
    setActiveTab('roles');
  };

  const handleSavePermissions = async (roleId, permissions) => {
    try {
      //console.log('Saving permissions:', { roleId, permissions });
      success('Permissions updated successfully!');
    } catch (err) {
      error('Failed to update permissions');
    }
  };

  const handleAddDiscountLimit = async (limitData) => {
    try {
      //console.log('Adding discount limit:', limitData);
      success('Discount limit added successfully!');
      fetchData();
    } catch (err) {
      error('Failed to add discount limit');
    }
  };

  const handleEditDiscountLimit = async (id, limitData) => {
    try {
      //console.log('Updating discount limit:', { id, limitData });
      success('Discount limit updated successfully!');
      fetchData();
    } catch (err) {
      error('Failed to update discount limit');
    }
  };

  const handleDeleteDiscountLimit = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount limit?')) {
      try {
        success('Discount limit deleted successfully');
        fetchData();
      } catch (err) {
        error('Failed to delete discount limit');
      }
    }
  };

  const tabs = [
    { id: 'employees', name: 'Employees', icon: null },
    // { id: 'roles', name: 'Roles & Permissions', icon: Shield }, 
    { id: 'discounts', name: 'Discount Limits', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">Manage employees and permissions</p>
        </div>
        {activeTab === 'employees' && (
          <Button icon={Plus} onClick={() => {
            setSelectedEmployee(null);
            setShowAddModal(true);
          }}>
            Add Employee
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon && <tab.icon className="h-5 w-5" />}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Employee List Tab */}
      {activeTab === 'employees' && (
        <>
          <Card>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by name, username or phone..."
              className="mb-0"
            />
          </Card>

          <Card>
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading employees...</p>
              </div>
            ) : (
              <EmployeeList
                employees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                onManagePermissions={handleManagePermissions}
              />
            )}
          </Card>
        </>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <RoleManagement
          roles={roles}
          onSave={handleSavePermissions}
        />
      )}

      {/* Discount Limits Tab */}
      {activeTab === 'discounts' && (
        <DiscountLimits
          limits={discountLimits}
          onAdd={handleAddDiscountLimit}
          onEdit={handleEditDiscountLimit}
          onDelete={handleDeleteDiscountLimit}
        />
      )}

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="md"
      >
        <EmployeeForm
          roles={roles}
          employee={selectedEmployee}
          onSubmit={handleAddEmployee}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedEmployee(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Employees;