import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const KittyReport = ({ data = {}, dateRange }) => {
  const {
    totalCommission = 0,
    paidOut = 0,
    pending = 0,
    employeeCommissions = []
  } = data;


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Commission</p>
              <h3 className="text-2xl font-bold text-purple-600">
                ₹{totalCommission.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-green-600">
                ₹{paidOut.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {pending}
              </h3> 
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Commission Details */}
      <Card 
        title="Employee Commission Details"
        headerActions={''}
      >
        <div className="space-y-4">
          {employeeCommissions.map((emp, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="font-bold text-purple-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{emp.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-600">{emp.items} items</p><span>|</span>
                    <p className="text-sm text-gray-600">{emp.orders} orders</p><span>|</span>
                    <p className="text-sm text-gray-600">₹{emp.revenue.toLocaleString()} revenue</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  ₹{emp.commission.toLocaleString()}
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Process Payment
                </Button>
              </div>
            </div>
          ))}

          {employeeCommissions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No commission data available</p>
          )}
        </div>
      </Card>

      {/* Commission Breakdown */}
      <Card title="Commission Calculation">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How Commission is Calculated:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Commission = (Selling Price - Minimum Price) × Quantity</li>
            <li>Maximum commission capped at: (Maximum Price - Minimum Price) × Quantity</li>
            <li>Commission calculated per product line item</li>
            <li>Total commission is sum of all line items in sales made by employee</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Example:</strong> If min price is ₹100, max price is ₹150, and employee sells at ₹130 for 10 units:
            Commission = (₹130 - ₹100) × 10 = ₹300
          </p>
        </div>
      </Card>
    </div>
  );
};

export default KittyReport;