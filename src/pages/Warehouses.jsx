import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Warehouse, MapPin } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { useNotification } from '../context/NotificationContext';
import { warehouseService } from '../services/warehouseService';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    capacity: 0
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);

      const warehouseData = await warehouseService.getAllWarehouses()

      setWarehouses(warehouseData.data);
    } catch (err) {
      showError('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      code: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      capacity: 0
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      contact_person: warehouse.contact_person || '',
      phone: warehouse.phone || '',
      email: warehouse.email || '',
      address: warehouse.address || '',
      city: warehouse.city || '',
      state: warehouse.state || '',
      pincode: warehouse.pincode || '',
      capacity: warehouse.capacity || 0
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (warehouse) => {
    if (warehouse.productCount > 0) {
      showError(`Cannot delete "${warehouse.name}". It has ${warehouse.productCount} products in stock.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${warehouse.name}"?`)) {
      try {
        await warehouseService.deleteWarehouse(warehouse.id);
        success('Warehouse deleted successfully');
        fetchWarehouses();
      } catch (err) {
        showError('Failed to delete warehouse');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Warehouse name is required';
    }

    if (!formData.code.trim()) {
      errors.code = 'Warehouse code is required';
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'PIN code must be 6 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingWarehouse) {
        await warehouseService.updateWarehouse(editingWarehouse.id, formData);
        success('Warehouse updated successfully');
      } else {
        await warehouseService.createWarehouse(formData);
        success('Warehouse created successfully');
      }
      setShowModal(false);
      fetchWarehouses();
    } catch (err) {
      showError(editingWarehouse ? 'Failed to update warehouse' : 'Failed to create warehouse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Warehouse',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded">
            <Warehouse className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 font-mono">{row.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (_, row) => (
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-900">{row.city}, {row.state}</p>
            <p className="text-xs text-gray-500">{row.address}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>
    },
    {
      key: 'productCount',
      label: 'Products',
      sortable: true,
      render: (value) => <Badge variant="info">{value} items</Badge>
    },
    {
      key: 'totalStock',
      label: 'Total Stock',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value.toLocaleString()} units</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={value === 'active' ? 'success' : 'secondary'}>{value}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 hover:bg-yellow-50 rounded text-yellow-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 hover:bg-red-50 rounded text-red-600"
            title="Delete"
            disabled={row.productCount > 0}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-gray-500 mt-1">Manage warehouse locations and inventory</p>
        </div>
        <Button icon={Plus} onClick={handleAdd}>
          Add Warehouse
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={warehouses}
          loading={loading}
          hover={true}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Warehouse Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Warehouse"
              error={formErrors.name}
              required
            />

            <Input
              label="Warehouse Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., WH-001"
              error={formErrors.code}
              required
            />

            <Input
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Manager name"
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile"
              error={formErrors.phone}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="warehouse@email.com"
              className="md:col-span-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />

            <Input
              label="PIN Code"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN"
              error={formErrors.pincode}
            />
          </div>

          <Input
            label="Storage Capacity (Optional)"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Maximum storage capacity"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingWarehouse ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Warehouses;