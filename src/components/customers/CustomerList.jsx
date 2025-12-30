import React from 'react';
import CustomerCard from './CustomerCard';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import { Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../common/Badge';
import {formatDateTime} from '../../utils/formatters';

const CustomerList = ({ 
  customers = [], 
  viewMode = 'list',
  onEdit, 
  onDelete, 
  onView,
  pagination,
  onPageChange,
  onPageSizeChange 
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Phone className="h-3 w-3 mr-1" />
            {row.phone}
          </p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <span className="text-sm text-gray-600 flex items-center">
          <Mail className="h-4 w-4 mr-1" />
          {value}
        </span>
      )
    },
    {
      key: 'billingAddress',
      label: 'City',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          { value.city }
        </span>
      )
    },
    {
      key: 'totalOrders',
      label: 'Total Orders',
      sortable: true,
      render: (value) => <Badge variant="info">{value} orders</Badge>
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ₹{value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Order',
      render: (value) => <span className="text-sm text-gray-500">{formatDateTime(value)}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-blue-50 rounded text-blue-600"
            onClick={() => onView(row)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            className="p-1 hover:bg-yellow-50 rounded text-yellow-600" 
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="p-1 hover:bg-red-50 rounded text-red-600" 
            onClick={() => onDelete(row)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (viewMode === 'grid') {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>

        {pagination && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Table columns={columns} data={customers} hover={true} />
      
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};

export default CustomerList;