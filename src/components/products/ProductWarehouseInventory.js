import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, Edit, Trash2, Package } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import { useNotification } from '../../context/NotificationContext';
import warehouseService from '../../services/warehouseService';
import inventoryService from '../../services/inventoryService';

const ProductWarehouseInventory = ({ product, inventoryData = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    warehouseId: '',
    quantity: 0,
    reorderLevel: 10
  });

  const { success, error: showError } = useNotification();

  useEffect(() => {
    LoadData(); 
  }, []);

  const LoadData = async () => {
    const [inventoryDataa, warehouseData] = await Promise.all([
      inventoryService.getProductInventory(product.id),
      warehouseService.getAllWarehouses()
    ]); 
    setWarehouses(warehouseData.data.map((wh) => ({
      value: wh.id.toString(),
      label: `${wh.name} (${wh.code})`
    })));


    setInventory(inventoryDataa.data?.inventory?.map((item) => ({
      id: item.id,
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      warehouseCode: item.warehouseCode,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel
    })))

  } 

  // Filter out warehouses that already have this product
  const availableWarehouses = warehouses.filter(
    wh => !inventory.some(inv => inv.warehouseId === parseInt(wh.value))
  );

  const handleAddToWarehouse = () => {
    setFormData({ warehouseId: '', quantity: 0, reorderLevel: 10 });
    setShowAddModal(true);
  };

  const handleEdit = (inv) => {
    setEditingInventory(inv);
    setFormData({
      warehouseId: inv.warehouseId.toString(),
      quantity: inv.quantity,
      reorderLevel: inv.reorderLevel
    });
    setShowEditModal(true);
  };

  const handleDelete = async (inv) => {
    if (window.confirm(`Remove ${product.name} from ${inv.warehouseName}?`)) {
      try {
        await inventoryService.deleteInventory(inv.id);
        success(`Product removed from ${inv.warehouseName}`);
        // Refresh inventory
      } catch (err) {
        showError('Failed to remove product from warehouse');
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const data = {
        product_id: product.id,
        warehouse_id: parseInt(formData.warehouseId),
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorderLevel)
      };
      await inventoryService.addProductToWarehouse(data);
      success('Product added to warehouse successfully');
      setShowAddModal(false);
      // Refresh inventory
    } catch (err) {
      showError('Failed to add product to warehouse');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.updateInventoryQuantity(editingInventory.id, {
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorderLevel)
      });
      success('Inventory updated successfully');
      setShowEditModal(false);
      // Refresh inventory
    } catch (err) {
      showError('Failed to update inventory');
    }
  };

  const getTotalStock = () => {
    return inventory.reduce((sum, inv) => sum + inv.quantity, 0);
  };

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return { variant: 'danger', label: 'Out of Stock' };
    if (quantity <= reorderLevel) return { variant: 'warning', label: 'Low Stock' };
    return { variant: 'success', label: 'In Stock' };
  };

  return (
    <div className="space-y-4">
      <Card
        title="Warehouse Inventory"
        subtitle={`${inventory.length} warehouse(s) - Total Stock: ${getTotalStock()} units`}
        headerActions={
          availableWarehouses.length > 0 && (
            <Button size="sm" icon={Plus} onClick={handleAddToWarehouse}>
              Add to Warehouse
            </Button>
          )
        }
      >
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No inventory records. Add this product to a warehouse.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inventory.map((inv) => {
              const status = getStockStatus(inv.quantity, inv.reorderLevel);
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Warehouse className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{inv.warehouseName}</p>
                      <p className="text-xs text-gray-500 font-mono">{inv.warehouseCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{inv.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Reorder Level</p>
                      <p className="text-lg font-semibold text-gray-700">{inv.reorderLevel}</p>
                    </div>

                    <div className="w-32">
                      <Badge variant={status.variant} className="w-full justify-center">
                        {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="p-2 hover:bg-blue-50 rounded text-blue-600"
                        title="Edit Stock"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                        title="Remove from Warehouse"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add to Warehouse Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add ${product?.name} to Warehouse`}
        size="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Product:</strong> {product?.name}
            </p>
            <p className="text-sm text-blue-800">
              <strong>SKU:</strong> {product?.sku}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Same product can exist in multiple warehouses with different stock levels
            </p>
          </div>

          <Select
            label="Select Warehouse"
            name="warehouseId"
            value={formData.warehouseId}
            onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
            options={availableWarehouses}
            required
          />

          <Input
            label="Initial Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            min="0"
            required
          />

          <Input
            label="Reorder Level"
            name="reorderLevel"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            min="0"
            helperText="Alert when stock falls below this level"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Warehouse</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Stock Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Stock - ${editingInventory?.warehouseName}`}
        size="md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            min="0"
            required
          />

          <Input
            label="Reorder Level"
            name="reorderLevel"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            min="0"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Stock</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductWarehouseInventory;