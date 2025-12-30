import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { useNotification } from '../context/NotificationContext';
import { companyService } from '../services/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    contact_person: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const companyData = await companyService.getAllCompanies()
       
      setCompanies(companyData.data);
    } catch (err) {
      showError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      gstin: '',
      contact_person: '',
      phone: '',
      email: '',
      website: '',
      address: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      gstin: company.gstin || '',
      contact_person: company.contact_person || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      address: company.address || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (company) => {
    if (company.productCount > 0) {
      showError(`Cannot delete "${company.name}". It has ${company.productCount} products associated with it.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
      try {
        await companyService.deleteCompany(company.id);
        success('Company deleted successfully');
        fetchCompanies();
      } catch (err) {
        showError('Failed to delete company');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      errors.gstin = 'Invalid GSTIN format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, formData);
        success('Company updated successfully');
      } else {
        await companyService.createCompany(formData);
        success('Company created successfully');
      }
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      showError(editingCompany ? 'Failed to update company' : 'Failed to create company');
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
      label: 'Company Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded">
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            {row.gstin && <p className="text-xs text-gray-500 font-mono">{row.gstin}</p>}
          </div>
        </div>
      )
    },
    {
      key: 'contact_person',
      label: 'Contact Person',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{value || '-'}</p>
          {row.phone && <p className="text-xs text-gray-500">{row.phone}</p>}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>
    },
    {
      key: 'website',
      label: 'Website',
      render: (value) => value ? (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
          {value}
        </a>
      ) : '-'
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
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Manage product brands and manufacturers</p>
        </div>
        <Button icon={Plus} onClick={handleAdd}>
          Add Company
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={companies}
          loading={loading}
          hover={true}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCompany ? 'Edit Company' : 'Add Company'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Apple, Samsung"
              error={formErrors.name}
              required
              className="md:col-span-2"
            />

            <Input
              label="GSTIN (Optional)"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              error={formErrors.gstin}
            />

            <Input
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Contact person name"
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
              placeholder="contact@company.com"
              required
              error={formErrors.email}
            />

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="www.company.com"
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
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company address"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingCompany ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;