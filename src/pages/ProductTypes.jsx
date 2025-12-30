import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { useNotification } from '../context/NotificationContext';
import { productTypeService } from '../services/productTypeService';

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);

      const productType = await productTypeService.getAllProductTypes() 
      setProductTypes(productType.data);
    } catch (err) {
      showError('Failed to load product types');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({ name: type.name, description: type.description || '' });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (type) => {
    if (type.productCount > 0) {
      showError(`Cannot delete "${type.name}". It has ${type.productCount} products associated with it.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${type.name}"?`)) {
      try {
        await productTypeService.deleteProductType(type.id);
        success('Product type deleted successfully');
        fetchProductTypes();
      } catch (err) {
        showError('Failed to delete product type');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Product type name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingType) {
        await productTypeService.updateProductType(editingType.id, formData);
        success('Product type updated successfully');
      } else {
        await productTypeService.createProductType(formData);
        success('Product type created successfully');
      }
      setShowModal(false);
      fetchProductTypes();
    } catch (err) {
      showError(editingType ? 'Failed to update product type' : 'Failed to create product type');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Type',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-2 rounded">
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>
    },
    {
      key: 'productCount',
      label: 'Products',
      sortable: true,
      render: (value) => <Badge variant="info">{value} products</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Product Types</h1>
          <p className="text-gray-500 mt-1">Manage product categories and types</p>
        </div>
        <Button icon={Plus} onClick={handleAdd}>
          Add Product Type
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={productTypes}
          loading={loading}
          hover={true}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingType ? 'Edit Product Type' : 'Add Product Type'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Type Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Smartphone, Laptop"
            error={formErrors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description about this product type"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingType ? 'Update' : 'Create'} 
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductTypes;