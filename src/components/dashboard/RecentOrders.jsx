import React from 'react'; 
import { Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const RecentOrders = ({ orders = [], onView }) => {
  const getStatusVariant = (status) => {
    const variants = {
      confirmed: 'success',
      draft: 'warning',
      cancelled: 'danger',
      pending: 'info'
    };
    return variants[status] || 'secondary';
  };

  return (
    <Card title="Recent Orders" headerActions={<a href='/sales'><Button size="sm" variant="ghost">View All</Button></a>}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Invoice</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="py-3 px-2 text-sm text-gray-900">{order.customer}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-900">{order.amount}</td>
                  <td className="py-3 px-2 text-sm">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-500">{order.date}</td>
                  <td className="py-3 px-2 text-sm">
                    <button 
                      onClick={() => onView(order)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentOrders;