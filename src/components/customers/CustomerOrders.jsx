import React from 'react';
import { ShoppingCart, Download, Eye } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDateTime } from '../../utils/formatters';

const CustomerOrders = ({ customerId, orders = [], onViewOrder, onCreateOrder }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <Button icon={ShoppingCart} onClick={() => onCreateOrder(customerId)}>
          Create New Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Button onClick={() => onCreateOrder(customerId)}>
            Create First Order
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-blue-600">{order.number}</p>
                  <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
                </div>
                <Badge variant={
                  order.status === 'delivered' ? 'success' :
                  order.status === 'out_for_delivery' ? 'warning' :
                  order.status === 'confirmed' ? 'info' : 'secondary'
                }>
                  {order.status}
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">Items:</p>
                <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item.product.name} × {item.qty}</li>
                  ))}
                  {order.items?.length > 3 && (
                    <li className="text-gray-500">+{order.items.length - 3} more items</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">₹{order.grand_total?.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2 hidden">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-green-50 rounded text-green-600"
                    title="Download Invoice"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;