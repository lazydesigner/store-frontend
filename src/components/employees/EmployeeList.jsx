import React from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import { Edit, Trash2, Shield } from 'lucide-react';

const EmployeeList = ({ employees = [], onEdit, onDelete, onManagePermissions }) => {
  const columns = [
    {
      key: 'name',
      label: 'Employee Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">@{row.username}</p>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => {
        const roleColors = {
          Admin: 'danger',
          Manager: 'warning',
          Sales: 'info',
          Delivery: 'success',
          Finance: 'secondary'
        };
        return <Badge variant={roleColors[value]}>{value}</Badge>;
      }
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>
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
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="p-1 hover:bg-blue-50 rounded text-blue-600" 
            onClick={() => onManagePermissions(row)}
            title="Permissions"
          >
            <Shield className="h-4 w-4" />
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

  return <Table columns={columns} data={employees} hover={true} />;
};

export default EmployeeList;