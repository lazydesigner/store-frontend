import React from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import { Eye, Download, Trash2, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalesList = ({ sales = [], onView, onDownload, onPayment, onDelete }) => {
  const columns = [
    {
      key: 'invoiceNo',
      label: 'Invoice/Draft No',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-blue-600">{value}</p>
          <Badge 
            variant={row.type === 'invoice' ? 'success' : row.type === 'proforma' ? 'warning' : 'secondary'} 
            size="sm" 
            className="mt-1"
          >
            {row.type}
          </Badge>
          <small> <b>Date:</b> {row.date}</small>
        </div>
      )
    },
    {
      key: 'EmployeeName',
      label: 'Emp Name',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">₹{value?.toLocaleString()}</span>
      )
    },
        {
          key: 'remainingAmount',
          label: 'Due Amount',
          render: (value) => value > 0 ? (
            <span className="font-semibold text-red-600">{formatCurrency(value)}</span>
          ) : (
            <span className="text-green-600">₹0</span>
          )
        },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value, row) => (
        <div>
          <Badge variant={value === 'paid' ? 'success' : value === 'partial' ? 'warning' : 'danger'}>
            {value}
          </Badge>
          {row.paid > 0 && row.paid < row.amount && (
            <p className="text-xs text-gray-500 mt-1">₹{row.paid?.toLocaleString()} paid</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'confirmed' ? 'success' : value === 'draft' ? 'warning' : 'danger'}>
          {value}
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
            title="View Invoice"
          >
            <Eye className="h-4 w-4" />
          </button>
         {row.type != 'draft' && ( <button 
            className="p-1 hover:bg-green-50 rounded text-green-600" 
            onClick={() => onPayment(row)}
            title="Payments"
          >
            <CreditCard className="h-4 w-4" />
          </button> )}
          {row.status === 'draft' && (
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-600" 
              onClick={() => onDelete(row)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return <Table columns={columns} data={sales} hover={true} />;
};

export default SalesList;