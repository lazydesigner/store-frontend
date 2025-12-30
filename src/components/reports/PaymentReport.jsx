 import React from 'react';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const PaymentReport = ({ data = {} }) => {
  const {
    totalCollected = 0,
    totalPending = 0,
    paymentsByMethod = [],
    recentPayments = []
  } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Collected</p>
              <h3 className="text-3xl font-bold text-green-600">
                ₹{totalCollected.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">This period</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Pending</p>
              <h3 className="text-3xl font-bold text-orange-600">
                ₹{totalPending.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Outstanding</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payments by Method */}
      <Card 
        title="Payments by Method"
        headerActions={''}
      >
        <div className="space-y-4">
          {paymentsByMethod.map((method, index) => {
            const percentage = (method.amount / totalCollected) * 100;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{method.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{method.count} transactions</p>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Payments */}
      <Card title="Recent Payments">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reference</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{payment.invoice}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.reference || '-'}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentReport;