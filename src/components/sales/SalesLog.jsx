import React from 'react';
import { FileText, User, Package, Building } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const SalesLog = ({ logs = [] }) => {
  const getActionColor = (action) => {
    const colors = {
      create: 'success',
      update: 'warning',
      cancel: 'danger',
      confirm: 'info'
    };
    return colors[action] || 'secondary';
  };

  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sales logs found</p>
          </div>
        </Card>
      ) : (
        logs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="hidden md:flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  log.action === 'create' ? 'bg-green-100' :
                  log.action === 'update' ? 'bg-yellow-100' :
                  log.action === 'cancel' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <FileText className={`h-6 w-6 ${
                    log.action === 'create' ? 'text-green-600' :
                    log.action === 'update' ? 'text-yellow-600' :
                    log.action === 'cancel' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                </div>
              </div>

              <div className="block md:flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{log.invoiceNo}</h3>
                    <Badge variant={getActionColor(log.action)} size="sm">
                      {log.action.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Package className="h-4 w-4 mr-1" />
                      <span>Product</span>
                    </div>
                    <p className="font-medium text-gray-900">{log.productName}</p>
                    <p className="text-xs text-gray-500">{log.productSKU}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <User className="h-4 w-4 mr-1" />
                      <span>Customer</span>
                    </div>
                    <p className="font-medium text-gray-900">{log.customerName}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <User className="h-4 w-4 mr-1" />
                      <span>Employee</span>
                    </div>
                    <p className="font-medium text-gray-900">{log.employeeName}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Building className="h-4 w-4 mr-1" />
                      <span>Warehouse</span>
                    </div>
                    <p className="font-medium text-gray-900">{log.warehouse}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-500">Qty: </span>
                      <span className="font-medium text-gray-900">{log.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price: </span>
                      <span className="font-semibold text-blue-600">₹{log.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total: </span>
                      <span className="font-semibold text-green-600">
                        ₹{(log.quantity * log.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="text-xs text-gray-500 italic">{log.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default SalesLog;