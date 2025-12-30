import React from 'react';
import { Package, AlertCircle, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import exportService from '../../services/exportService';

const StockReport = ({ data = {}, dateRange }) => {
  const { 
    totalProducts = 0,
    totalStockValue = 0,
    lowStockItems = 0,
    outOfStock = 0,
    inventoryByWarehouse = [],
    lowStockProducts = []
  } = data;

  const exportStockReport = async () => {
    await exportService.exportStockReport()
  }


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <h3 className="text-2xl font-bold text-blue-600">{totalProducts}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Stock Value</p>
              <h3 className="text-2xl font-bold text-green-600">
                ₹{totalStockValue.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock</p>
              <h3 className="text-2xl font-bold text-yellow-600">{lowStockItems}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
              <h3 className="text-2xl font-bold text-red-600">{outOfStock}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory by Warehouse */}
      <Card 
        title="Inventory by Warehouse"
        headerActions={<Button size="sm" variant="outline" onClick={exportStockReport}>Export</Button>}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Units</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Min Stock Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventoryByWarehouse.map((warehouse, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{warehouse.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{warehouse.items}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{warehouse.units}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{warehouse.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={warehouse.lowStock > 0 ? 'warning' : 'success'}>
                      {warehouse.lowStock > 0 ? `${warehouse.lowStock} low stock` : 'Healthy'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Products */}
      <Card 
        title="Low Stock Products"
        headerActions={
          <Badge variant="danger">
            <AlertCircle className="h-3 w-3 mr-1" />
            {lowStockProducts.length}
          </Badge>
        }
      >
        <div className="space-y-3">
          {lowStockProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600 font-mono">{product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600 font-semibold">
                  {product.currentStock} / {product.minStock} units
                </p>
                <p className="text-xs text-gray-500">{product.warehouse}</p>
              </div>
            </div>
          ))}

          {lowStockProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No low stock items</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StockReport;