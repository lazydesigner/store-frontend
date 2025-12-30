import React, { useState } from 'react';
import { User, Package, MapPin } from 'lucide-react';
import Select from '../common/Select';
import Button from '../common/Button';

const DeliveryAssignment = ({ delivery, employees = [], onAssign, onCancel }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAssign(delivery.id, selectedEmployee);
    } catch (error) {
      console.error('Assignment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.name} (${emp.activeDeliveries || 0} active deliveries)`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-3">
          <Package className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-semibold text-gray-900">{delivery.orderNo}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 mb-3">
          <User className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium text-gray-900">{delivery.customer}</p>
            <p className="text-sm text-gray-600">{delivery.phone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="text-sm text-gray-900">{delivery.address}</p>
          </div>
        </div>
      </div>

      <Select
        label="Select Delivery Person"
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        options={employeeOptions}
        required
        placeholder="Choose delivery person"
      />

      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
        <strong>Note:</strong> Customer will receive SMS with delivery person details and OTP.
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Assign & Notify
        </Button>
      </div>
    </form>
  );
};

export default DeliveryAssignment;