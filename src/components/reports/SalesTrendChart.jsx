import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react'; 
import Button from '../common/Button';

const SalesTrendChart = ({ data = [], chartType = 'line' }) => {
  // Format data for charts
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short' 
    }),
    orders: item.orders,
    revenue: item.revenue / 100000, // Convert to Lakhs for better readability
    fullDate: item.date
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            Orders: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-sm text-green-600">
            Revenue: <span className="font-bold">₹{payload[1].value.toFixed(2)}L</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Render Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#3b82f6"
          style={{ fontSize: '12px' }}
          label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6' } }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="#10b981"
          style={{ fontSize: '12px' }}
          label={{ value: 'Revenue (₹ Lakhs)', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="orders" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', r: 5 }}
          activeDot={{ r: 7 }}
          name="Orders"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 5 }}
          activeDot={{ r: 7 }}
          name="Revenue (₹L)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Render Area Chart
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#3b82f6"
          style={{ fontSize: '12px' }}
          label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6' } }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="#10b981"
          style={{ fontSize: '12px' }}
          label={{ value: 'Revenue (₹ Lakhs)', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        <Area 
          yAxisId="left"
          type="monotone" 
          dataKey="orders" 
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorOrders)"
          name="Orders"
        />
        <Area 
          yAxisId="right"
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          name="Revenue (₹L)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Render Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#3b82f6"
          style={{ fontSize: '12px' }}
          label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6' } }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="#10b981"
          style={{ fontSize: '12px' }}
          label={{ value: 'Revenue (₹ Lakhs)', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        <Bar 
          yAxisId="left"
          dataKey="orders" 
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
          name="Orders"
        />
        <Bar 
          yAxisId="right"
          dataKey="revenue" 
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          name="Revenue (₹L)"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend Analysis</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={chartType === 'line' ? 'primary' : 'outline'}
            onClick={() => {}}
          >
            Line
          </Button>
          <Button 
            size="sm" 
            variant={chartType === 'area' ? 'primary' : 'outline'}
            onClick={() => {}}
          >
            Area
          </Button>
          <Button 
            size="sm" 
            variant={chartType === 'bar' ? 'primary' : 'outline'}
            onClick={() => {}}
          >
            Bar
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-blue-900">
            {chartData.reduce((sum, item) => sum + item.orders, 0)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-900">
            ₹{chartData.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}L
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 mb-1">Avg Orders/Day</p>
          <p className="text-2xl font-bold text-purple-900">
            {(chartData.reduce((sum, item) => sum + item.orders, 0) / chartData.length).toFixed(0)}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 mb-1">Avg Revenue/Day</p>
          <p className="text-2xl font-bold text-orange-900">
            ₹{(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toFixed(2)}L
          </p>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {chartType === 'line' && renderLineChart()}
        {chartType === 'area' && renderAreaChart()}
        {chartType === 'bar' && renderBarChart()}
      </div> 
    </div>
  );
};

export default SalesTrendChart;