import React from 'react';
import { User, Phone, Mail, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const CustomerCard = ({ customer, onView, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6">
      {/* Customer Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
            <p className="text-sm text-gray-500">ID: #{customer.id}</p>
          </div>
        </div>
        <Badge variant={customer.totalOrders > 10 ? 'success' : customer.totalOrders > 5 ? 'info' : 'secondary'}>
          {customer.totalOrders > 10 ? 'VIP' : customer.totalOrders > 5 ? 'Regular' : 'New'}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {customer.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {customer.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {customer.billingAddress.city}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
        <div>
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <ShoppingBag className="h-3 w-3 mr-1" />
            Total Orders
          </div>
          <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
        </div>
        <div>
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <DollarSign className="h-3 w-3 mr-1" />
            Total Spent
          </div>
          <p className="text-lg font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Last Order */}
      <div className="text-xs text-gray-500 mb-4">
        Last order: {customer.lastOrder}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={() => onView(customer)} className="flex-1">
          View Details
        </Button>
        <Button size="sm" onClick={() => onEdit(customer)} className="flex-1">
          Edit
        </Button>
      </div>
    </div>
  );
};

export default CustomerCard;