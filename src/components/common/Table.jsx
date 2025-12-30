import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({
  columns = [],
  data = [],
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  striped = false,
  hover = true,
  className = ''
}) => {
  const handleSort = (column) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;
    
    if (sortColumn === column.key) {
      return sortDirection === 'asc' 
        ? <ChevronUp className="h-4 w-4" />
        : <ChevronDown className="h-4 w-4" />;
    }
    
    return <ChevronDown className="h-4 w-4 opacity-30" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                } ${column.headerClassName || ''}`}
                style={{ width: column.width }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className={`bg-white divide-y divide-gray-200 ${hover ? 'table-hover' : ''}`}>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`${
                  onRowClick ? 'cursor-pointer' : ''
                } ${
                  striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.cellClassName || ''}`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;