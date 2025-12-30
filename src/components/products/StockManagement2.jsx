import React, { useState } from 'react';
import { Package, AlertCircle, Plus, Minus } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button'; 
import Badge from '../common/Badge';

const StockManagement = ({ product, onUpdate }) => {
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const warehouses = [
    { value: '1', label: 'Main Warehouse', stock: 45 },
    { value: '2', label: 'Branch 1 - Mumbai2', stock: 20 },
    { value: '3', label: 'Branch 2 - Delhi', stock: 15 }
  ];
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adjustedQty = adjustmentType === 'add' ? parseInt(quantity) : -parseInt(quantity);
      await onUpdate({
        productId: product.id,
        warehouseId,
        quantity: adjustedQty,
        reason
      });

      // Reset form
      setQuantity('');
      setReason('');
    } catch (error) {
      console.error('Stock update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStock = warehouses.reduce((sum, w) => sum + w.stock, 0);
  const stockStatus = totalStock < 10 ? 'danger' : totalStock < 30 ? 'warning' : 'success';

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <Card title="Stock Overview">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                stockStatus === 'danger' ? 'bg-red-100' :
                stockStatus === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Package className={`h-6 w-6 ${
                  stockStatus === 'danger' ? 'text-red-600' :
                  stockStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalStock} units</p>
              </div>
            </div>
            <Badge variant={stockStatus} size="lg">
              {stockStatus === 'danger' ? 'Low Stock' :
               stockStatus === 'warning' ? 'Medium Stock' : 'In Stock'}
            </Badge>
          </div>

          {totalStock < 20 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Low Stock Alert</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Stock is running low. Consider reordering soon.
                </p>
              </div>
            </div>
          )}

          {/* Warehouse-wise Stock */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Warehouse-wise Stock:</p>
            {warehouses.map((warehouse) => (
              <div key={warehouse.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">{warehouse.label}</span>
                <Badge variant={warehouse.stock < 10 ? 'danger' : warehouse.stock < 20 ? 'warning' : 'success'}>
                  {warehouse.stock} units
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stock Adjustment */}
      <Card title="Adjust Stock">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                  adjustmentType === 'add'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Stock</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('remove')}
                className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all ${
                  adjustmentType === 'remove'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Minus className="h-5 w-5" />
                <span className="font-medium">Remove Stock</span>
              </button>
            </div>
          </div>

          <Select
            label="Warehouse"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            options={warehouses}
            required
            placeholder="Select warehouse"
          />

          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Adjustment
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., New stock arrival, Damaged goods, etc."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => {
              setQuantity('');
              setReason('');
            }}>
              Reset
            </Button>
            <Button type="submit" loading={loading}>
              {adjustmentType === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Recent Stock Movements */}
      <Card title="Recent Stock Movements">
        <div className="space-y-3">
          {[
            { type: 'add', qty: 50, warehouse: 'Main Warehouse', date: '2025-11-01', reason: 'New stock arrival' },
            { type: 'remove', qty: 5, warehouse: 'Branch 1', date: '2025-10-31', reason: 'Sales' },
            { type: 'add', qty: 20, warehouse: 'Branch 2', date: '2025-10-30', reason: 'Stock transfer' }
          ].map((movement, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${
                  movement.type === 'add' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {movement.type === 'add' ? (
                    <Plus className="h-4 w-4 text-green-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {movement.type === 'add' ? '+' : '-'}{movement.qty} units
                  </p>
                  <p className="text-xs text-gray-500">{movement.warehouse}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{movement.date}</p>
                <p className="text-xs text-gray-600">{movement.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StockManagement;