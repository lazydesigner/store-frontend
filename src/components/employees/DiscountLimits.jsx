import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { employeeService } from '../../services/employeeService';
import roleService from '../../services/roleService';
import { useNotification } from '../../context/NotificationContext';
import { productTypeService } from '../../services/productTypeService';

const DiscountLimits = () => {
  const [limits, setLimits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    applicationType: 'role', // 'role' or 'employee'
    roleId: '',
    employeeId: '',
    productTypeId: '', // Optional - for specific product types
    maxDiscountPercent: '',
    isActive: true
  });

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    loadDiscountLimits();
    loadEmployees();
    loadRoles();
    loadProductTypes();
  }, []);

  const loadDiscountLimits = async () => {
    try {
      const data = await employeeService.getDiscountLimits();
      setLimits(data.data);
    } catch (err) {
      console.error('Failed to load discount limits:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAllRoles();
      setRoles(data.data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadProductTypes = async () => {
    try {
      setLoading(true);

      const productType = await productTypeService.getAllProductTypes()
      // This should come from product service
      setProductTypes(productType.data.map(type => ({
        id: type.id,
        name: type.name
      })));
    } catch (err) {
      console.error('Failed to load product types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLimit(null);
    setFormData({
      applicationType: 'role',
      roleId: '',
      employeeId: '',
      productTypeId: '',
      maxDiscountPercent: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (limit) => {
    setEditingLimit(limit);
    setFormData({
      applicationType: limit.applicationType,
      roleId: limit.roleId || '',
      employeeId: limit.employeeId || '',
      productTypeId: limit.productTypeId || '',
      maxDiscountPercent: limit.maxDiscountPercent,
      isActive: limit.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discount limit?')) {
      return;
    }

    try {
      await employeeService.deleteDiscountLimit(id);
      success('Discount limit deleted successfully');
      loadDiscountLimits();
    } catch (err) {
      error('Failed to delete discount limit');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        maxDiscountPercent: parseFloat(formData.maxDiscountPercent)
      };

      // Remove unused fields based on application type
      if (dataToSubmit.applicationType === 'role') {
        delete dataToSubmit.employeeId;
      } else {
        delete dataToSubmit.roleId;
      }

      // If no product type selected, it applies to all products
      if (!dataToSubmit.productTypeId) {
        delete dataToSubmit.productTypeId;
      }

      if (editingLimit) {
        await employeeService.updateDiscountLimit(editingLimit.id, dataToSubmit);
        success('Discount limit updated successfully');
      } else {
        await employeeService.createDiscountLimit(dataToSubmit);
        success('Discount limit created successfully');
      }

      setShowModal(false);
      loadDiscountLimits();
    } catch (err) {
      error('Failed to save discount limit');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const columns = [
    {
      key: 'applicationType',
      label: 'Applied To',
      render: (value, row) => (
        <div>
          <Badge variant={value === 'role' ? 'info' : 'success'}>
            {value === 'role' ? 'Role' : 'Employee'}
          </Badge>
          <p className="text-sm text-gray-900 mt-1 font-medium">
            {value === 'role' ? row.roleName : row.employeeName}
          </p>
        </div>
      )
    },
    {
      key: 'productTypeName',
      label: 'Product Type',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || <Badge variant="secondary">All Products</Badge>}
        </span>
      )
    },
    {
      key: 'maxDiscountPercent',
      label: 'Max Discount',
      render: (value) => (
        <div className="flex items-center">
          <span className="text-lg font-bold text-orange-600">{value}%</span>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-yellow-50 rounded text-yellow-600"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-1 hover:bg-red-50 rounded text-red-600"
            onClick={() => handleDelete(row.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.name} - ${emp.role}`
  }));

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  const productTypeOptions = [
    { value: '', label: 'All Products' },
    ...productTypes.map(type => ({
      value: type.id,
      label: type.name
    }))
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Discount Limits"
        subtitle="Configure maximum discount percentages for roles or individual employees"
        headerActions={
          <Button icon={Plus} onClick={handleAdd}>
            Add Discount Limit
          </Button>
        }
      >
        <Table columns={columns} data={limits} hover={true} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLimit ? 'Edit Discount Limit' : 'Add Discount Limit'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Application Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apply To <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, applicationType: 'role', employeeId: '' }))}
                className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${formData.applicationType === 'role'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <span className="font-medium">Role</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, applicationType: 'employee', roleId: '' }))}
                className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${formData.applicationType === 'employee'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <span className="font-medium">Employee</span>
              </button>
            </div>
          </div>

          {/* Role or Employee Selection */}
          {formData.applicationType === 'role' ? (
            <Select
              label="Select Role"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              options={roleOptions}
              required
              placeholder="Choose a role"
            />
          ) : (
            <Select
              label="Select Employee"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              options={employeeOptions}
              required
              placeholder="Choose an employee"
            />
          )}

          {/* Product Type (Optional) */}
          <Select
            label="Product Type (Optional)"
            name="productTypeId"
            value={formData.productTypeId}
            onChange={handleChange}
            options={productTypeOptions}
            helperText="Leave as 'All Products' to apply to all product types"
          />

          {/* Max Discount Percentage */}
          <Input
            label="Maximum Discount Percentage"
            name="maxDiscountPercent"
            type="number"
            value={formData.maxDiscountPercent}
            onChange={handleChange}
            placeholder="e.g., 10"
            min="0"
            max="100"
            step="0.01"
            required
            helperText="Maximum discount this role/employee can apply"
          />

          {/* Active Status */}
          <div className="pt-4 border-t">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <strong>Note:</strong> When creating a sale, the system will check the discount limit
            based on the employee's role and any individual limits. The most restrictive limit will apply.
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingLimit ? 'Update' : 'Create'} Limit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Instructions */}
      <Card>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">How Discount Limits Work:</h4>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li><strong>Role-based limits:</strong> Apply to all employees with that role</li>
            <li><strong>Employee-specific limits:</strong> Override role-based limits for specific employees</li>
            <li><strong>Product type limits:</strong> Restrict discounts for specific product categories</li>
            <li><strong>Validation:</strong> System prevents exceeding limits when creating sales invoices</li>
            <li><strong>Priority:</strong> Most restrictive limit applies when multiple limits exist</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Example:</strong> If Sales role has 10% max discount, but John (Sales) has 15% limit,
            John can give up to 15% discount. If there's also a 5% limit on Smartphones, John can only
            give 5% on Smartphones but 15% on other products.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DiscountLimits;