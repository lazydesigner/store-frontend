import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package, User, Building2, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import SalesTrendChart from './SalesTrendChart';
import exportService from '../../services/exportService';

const SalesReport = ({ data = {}, dateRange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    totalRevenue = 0,
    totalOrders = 0,
    averageOrderValue = 0,
    growth = 0,
    salesByEmployee = [], 
    salesByProduct = [],
    salesByProductType = [],
    salesByCompany = [],
    salesByWarehouse = [],
    salesByCustomer = [],
    salesTrend = []
  } = data;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ShoppingCart },
    { id: 'product-type', name: 'By Product Type', icon: Package },
    { id: 'company', name: 'By Company', icon: Building2 },
    { id: 'employee', name: 'By Employee', icon: User },
    { id: 'customer', name: 'By Customer', icon: User },
    { id: 'warehouse', name: 'By Warehouse', icon: Package },
    { id: 'trend', name: 'Trends', icon: Calendar }
  ];
 
  const productTypeReport = async () =>{
    await exportService.exportProducts() 
  }

  const customerReport = async () => {
    await exportService.exportCustomers()
  } 

  const employeeReport = async () => {
    await exportService.exportEmployees()
  }

  const exportSalesReport = async () =>{
    await exportService.exportSalesReport()
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{growth}% from last period
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-blue-600">{totalOrders}</h3>
              <p className="text-sm text-blue-600 mt-1">This period</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
              <h3 className="text-2xl font-bold text-purple-600">
                ₹{averageOrderValue.toLocaleString()}
              </h3>
              <p className="text-sm text-purple-600 mt-1">Per order</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Sales by Product <Button size="sm" variant="outline">View All</Button>*/}
      <Card 
        title="Top Selling Products"
        headerActions={''}
      >
        <div className="space-y-3">
          {salesByProduct.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sold} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{product.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Top Product Types">
          <div className="space-y-3">
            {salesByProductType.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(item.revenue / 100000).toFixed(2)}L</p>
                  {/* <Badge variant={item.growth > 0 ? 'success' : 'danger'} size="sm">
                    {item.growth > 0 ? '+' : ''}{item.growth}%
                  </Badge> */}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Companies">
          <div className="space-y-3">
            {salesByCompany.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.company}</p>
                    <p className="text-sm text-gray-500">{item.marketShare}% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(item.revenue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-gray-500">{item.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProductTypeReport = () => (
    <div className="space-y-6">
      <Card 
        title="Sales by Product Type"
        subtitle="Detailed breakdown of sales performance by product category"
        headerActions={<Button size="sm" variant="outline" onClick={productTypeReport}>Export</Button>}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity Sold</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Price</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Growth</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesByProductType.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.orders}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.quantity} units</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{item.revenue?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{item.avgPrice?.toLocaleString()}
                  </td>
                  {/* <td className="px-6 py-4">
                    <Badge variant={item.growth > 0 ? 'success' : 'danger'}>
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </Badge>
                  </td> */}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {salesByProductType.reduce((sum, item) => sum + item.orders, 0)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {salesByProductType.reduce((sum, item) => sum + item.quantity, 0)} units
                </td>
                <td className="px-6 py-4 text-sm text-green-600">
                  ₹{salesByProductType.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Product Type Performance Chart */}
      <Card title="Product Type Distribution">
        <div className="space-y-4">
          {salesByProductType.map((item, index) => {
            const totalRevenue = salesByProductType.reduce((sum, i) => sum + i.revenue, 0);
            const percentage = ((item.revenue / totalRevenue) * 100).toFixed(2);
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                  <span className="text-sm text-gray-600">{percentage}% (₹{(item.revenue / 100000).toFixed(2)}L)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderCompanyReport = () => (
    <Card 
      title="Sales by Company/Brand"
      subtitle="Performance analysis by manufacturer"
      headerActions={''}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
              {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Products</th> */}
              {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Growth</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesByCompany.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <Building2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.orders}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  ₹{item.revenue.toLocaleString()}
                </td>
                {/* <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${item.marketShare}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{item.marketShare}%</span>
                  </div>
                </td> */}
                {/* <td className="px-6 py-4">
                  <Badge variant={item.growth > 0 ? 'success' : 'danger'}>
                    {item.growth > 0 ? '+' : ''}{item.growth}%
                  </Badge>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderEmployeeReport = () => (
    <Card 
      title="Sales by Employee" 
      subtitle="Individual performance tracking"
      headerActions={<Button size="sm" variant="outline" onClick={employeeReport}>Export</Button>}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesByEmployee.map((emp, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.orders}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  ₹{emp.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                  ₹{emp.commission.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderCustomerReport = () => (
    <Card 
      title="Sales by Customer"
      subtitle="Top customers and purchase patterns"
      headerActions={<Button size="sm" variant="outline" onClick={customerReport}>Export</Button>}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesByCustomer.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{customer.customer}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{customer.orders}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  ₹{customer.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{customer.avgOrder.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={customer.type === 'VIP' ? 'success' : 'info'}>
                    {
                    new Date(customer.type).toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderWarehouseReport = () => (
    <Card 
      title="Sales by Warehouse"
      subtitle="Location-wise performance"
      headerActions={''}
    >
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesByWarehouse.map((wh, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{wh.warehouse}</p>
                      <p className="text-sm text-gray-500">{wh.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{wh.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{wh.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{wh.percentage} Prodcuts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );

  const renderTrendReport = () => (
    <Card 
      title="Sales Trend Analysis"
      subtitle="Daily sales performance over time"
      headerActions={<Button size="sm" variant="outline" onClick={exportSalesReport}>Export</Button>}
    >
      <div className="space-y-6">
        {/* Trend Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesTrend.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{day.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{day.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{(day.revenue / day.orders).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Chart Placeholder */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <SalesTrendChart 
            data={salesTrend.length > 0 ? salesTrend : salesTrend} 
            chartType="area" 
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'product-type' && renderProductTypeReport()}
      {activeTab === 'company' && renderCompanyReport()}
      {activeTab === 'employee' && renderEmployeeReport()}
      {activeTab === 'customer' && renderCustomerReport()}
      {activeTab === 'warehouse' && renderWarehouseReport()}
      {activeTab === 'trend' && renderTrendReport()}
    </div>
  );
};

export default SalesReport;