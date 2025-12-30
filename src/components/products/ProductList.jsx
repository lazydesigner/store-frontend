import React, { useState } from 'react';
import ProductCard from './ProductCard';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import { Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../common/Badge';

const ProductList = ({ 
  products = [], 
  viewMode = 'grid', 
  onEdit, 
  onDelete, 
  onView,
  pagination,
  onPageChange,
  onPageSizeChange 
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value) => <span className="font-mono text-xs text-gray-600">{value}</span>
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <span className="font-medium text-gray-900">{value}</span>
          <p className="text-xs text-gray-500">HSN: {row.hsn_code} SKU: {row.sku}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      render: (_, row) => (
        <span className="text-sm text-gray-900">
          ₹{row.minPrice.toLocaleString()} - ₹{row.maxPrice.toLocaleString()}
        </span>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (value) => (
        <Badge variant={value < 10 ? 'danger' : value < 20 ? 'warning' : 'success'}>
          {value} units
        </Badge>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
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
      <Table
        columns={columns}
        data={products}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        hover={true}
      />

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

export default ProductList;