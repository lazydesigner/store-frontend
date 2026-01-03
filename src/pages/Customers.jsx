import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Eye, ShoppingCart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import CustomerList from '../components/customers/CustomerList';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerOrders from '../components/customers/CustomerOrders';
import CustomerMerge from '../components/customers/CustomerMerge';
import ImportCustomersModal from '../components/customers/ImportCustomersModal';
import Badge from '../components/common/Badge';
import customerService from '../services/customerService';
import exportService from '../services/exportService';
import { useNotification } from '../context/NotificationContext';
import { formatDateTime } from '../utils/formatters';

const Customers = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  // Mock data - replace with API calls
  const [customers, setCustomers] = useState([])

  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    try {
      await exportService.exportCustomers();
      success('Customers exported successfully!');
    } catch (err) {
      error('Failed to export customers' + err);
    }
  };



  useEffect(() => {
    // Fetch customers from API
    fetchCustomers();
  }, []);



  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error(err);
      error('Failed to fetch customers');
    }
  };


  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowOrdersModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowAddModal(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        const response = await customerService.deleteCustomer(customer.id);
        fetchCustomers();
        success('Customer deleted successfully');

      } catch (err) {
        console.error(err);
        error('Failed to delete customers');
      }
    }
  };

  const handleCreateOrder = (customerId) => {
    // Navigate to sales page with pre-selected customer
    navigate('/sales', { state: { customerId } });
  };

  const handleViewOrder = (order) => {
    navigate(`/sales/${order.id}`);
  };

  const handleSubmitCustomer = async (data) => {

    console.log(data)

    if (data.id) {
      try {
        const id = data.id;
        delete data.id;
        // Update existing customer
        const response = await customerService.updateCustomer(id, data);

        success('Customer updated successfully');
        // Refresh customer list
        setCustomers(prev => prev.map(c => c.id === data.id ? response.data : c));
      } catch (err) {
        error('Failed to update customer');
      }


    } else {
      try {
        const response = await customerService.createCustomer(data);

        if (response.success) {
          success('Customer saved successfully');
          // Refresh customer list
          setCustomers(prev => [...prev, response.data]);
        } else {
          error('Failed to save customer');
          return;
        }
      } catch (err) {
        error('Failed to save customer');
        return;
      }
    }

    // API call to create/update
    setShowAddModal(false);
    setSelectedCustomer(null);
  };


  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //console.log(customers)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage customer database and orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Upload}
            onClick={() => setShowImportModal(true)}>
            Import
          </Button>
          <Button variant="outline" icon={Download}
            onClick={handleExport}>
            Export
          </Button>
          <Button icon={Plus} onClick={() => {
            setSelectedCustomer(null);
            setShowAddModal(true);
          }}>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Customers</p>
            <h3 className="text-2xl font-bold text-blue-600">{customers.length}</h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-green-600">
              ₹{customers.reduce((sum, c) => parseFloat(sum) + parseFloat(c.totalSpent), 0).toLocaleString()}
            </h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
            <h3 className="text-2xl font-bold text-purple-600">
              ₹{Math.round(customers.reduce((sum, c) => parseFloat(sum) + parseFloat(c.totalSpent), 0) / customers.reduce((sum, c) => parseFloat(sum) + parseFloat(c.totalOrders), 0)).toLocaleString()}
            </h3>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Customers</p>
            <h3 className="text-2xl font-bold text-orange-600">
              {customers.filter(c => c.totalOrders > 0).length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by name, phone or email..."
            className="flex-1 max-w-md mb-0"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer List */}
      <Card>
        <CustomerList
          customers={filteredCustomers}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Card>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCustomer(null);
        }}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleSubmitCustomer}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedCustomer(null);
          }}
        />
      </Modal>

      {/* View Customer Orders Modal */}
      <Modal
        isOpen={showOrdersModal}
        onClose={() => {
          setShowOrdersModal(false);
          setSelectedCustomer(null);
        }}
        title={`${selectedCustomer?.name} - Order History`}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ₹{selectedCustomer.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{formatDateTime(selectedCustomer.updated_at)}</p>
                <p className="text-sm text-gray-500">Last Order</p>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
              </div>
            </div>

            {/* Orders */}
            <CustomerOrders
              customerId={selectedCustomer.id}
              orders={selectedCustomer.orders}
              onViewOrder={handleViewOrder}
              onCreateOrder={handleCreateOrder}
            />
          </div>
        )}
      </Modal>
      <ImportCustomersModal
        isOpen={showImportModal}
        onClose={() => { setShowImportModal(false); window.location.reload() }}
      />
    </div>
  );
};

export default Customers;