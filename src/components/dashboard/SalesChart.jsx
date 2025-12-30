import React from 'react';
import Card from '../common/Card';
import { TrendingUp } from 'lucide-react';

const SalesChart = ({ data = [] }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card 
      title="Sales Trend" 
      subtitle="Last 7 days"
      headerActions={
        <div className="flex items-center text-green-600 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+12% vs last week</span>
        </div>
      }
    >
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-semibold">
                    ₹{item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-16 text-right text-sm font-semibold text-gray-900">
              {item.orders}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-lg font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.orders, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg/Day</p>
          <p className="text-lg font-bold text-purple-600">
            ₹{Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SalesChart;