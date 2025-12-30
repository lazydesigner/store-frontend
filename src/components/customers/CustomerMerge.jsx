import React, { useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';

const CustomerMerge = ({ customers = [], onMerge, onCancel }) => {
  const [primaryCustomer, setPrimaryCustomer] = useState(null);
  const [duplicateCustomers, setDuplicateCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleSelectPrimary = (customer) => {
    setPrimaryCustomer(customer);
    setDuplicateCustomers(duplicateCustomers.filter(c => c.id !== customer.id));
  };

  const handleSelectDuplicate = (customer) => {
    if (primaryCustomer?.id === customer.id) {
      return;
    }
    
    if (duplicateCustomers.find(c => c.id === customer.id)) {
      setDuplicateCustomers(duplicateCustomers.filter(c => c.id !== customer.id));
    } else {
      setDuplicateCustomers([...duplicateCustomers, customer]);
    }
  };

  const handleMerge = async () => {
    if (!primaryCustomer || duplicateCustomers.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onMerge(primaryCustomer.id, duplicateCustomers.map(c => c.id));
    } catch (error) {
      console.error('Merge error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Merge Duplicate Customers</p>
            <p className="text-sm text-yellow-800 mt-1">
              Select one primary customer account to keep, then select duplicate accounts to merge.
              All orders and data from duplicate accounts will be transferred to the primary account.
            </p>
          </div>
        </div>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        placeholder="Search customers by name or phone..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Customer Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Select Primary Customer (Keep)
          </h3>
          <div className="border-2 border-green-200 rounded-lg p-4 min-h-[200px]">
            {primaryCustomer ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{primaryCustomer.name}</p>
                  <button
                    onClick={() => setPrimaryCustomer(null)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-600">{primaryCustomer.phone}</p>
                <p className="text-sm text-gray-600">{primaryCustomer.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{primaryCustomer.totalOrders} orders</span>
                  <span>₹{primaryCustomer.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Select a customer from the list below</p>
              </div>
            )}
          </div>
        </div>

        {/* Duplicate Customers Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Select Duplicate Customers (Merge)
          </h3>
          <div className="border-2 border-red-200 rounded-lg p-4 min-h-[200px]">
            {duplicateCustomers.length > 0 ? (
              <div className="space-y-2">
                {duplicateCustomers.map((customer) => (
                  <div key={customer.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                      <button
                        onClick={() => handleSelectDuplicate(customer)}
                        className="text-red-600 text-xs hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">{customer.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No duplicates selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">All Customers</h3>
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          {filteredCustomers.map((customer) => {
            const isPrimary = primaryCustomer?.id === customer.id;
            const isDuplicate = duplicateCustomers.find(c => c.id === customer.id);

            return (
              <div
                key={customer.id}
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                  isPrimary ? 'bg-green-50' : isDuplicate ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone} • {customer.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {customer.totalOrders} orders • ₹{customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!isPrimary && (
                      <Button
                        size="sm"
                        variant={isDuplicate ? 'secondary' : 'outline'}
                        onClick={() => handleSelectDuplicate(customer)}
                      >
                        {isDuplicate ? 'Selected' : 'Mark Duplicate'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={isPrimary ? 'success' : 'outline'}
                      onClick={() => handleSelectPrimary(customer)}
                    >
                      {isPrimary ? 'Primary' : 'Set Primary'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleMerge}
          loading={loading}
          disabled={!primaryCustomer || duplicateCustomers.length === 0}
        >
          Merge {duplicateCustomers.length} Customer{duplicateCustomers.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default CustomerMerge;