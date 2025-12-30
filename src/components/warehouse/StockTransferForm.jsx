import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import warehouseService from '../../services/warehouseService';
import productService from '../../services/productService';

const StockTransferForm = ({ warehouses = [], productss = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    from_warehouse_id: '',
    to_warehouse_id: '',
    product_id: '',
    quantity: '',
    reason: '',
    priority: 'normal',
    requested_by: JSON.parse(localStorage.getItem("user_data"))['id'] || ""
  });

  const [products, setProducts] = useState(productss)
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [availableStock, setAvailableStock] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { warning } = useNotification();

  //console.log(JSON.stringify(products))

  useEffect(() => {
    if (formData.product_id && formData.from_warehouse_id) {
      // Fetch available stock for selected product in source warehouse
      checkAvailableStock(formData.from_warehouse_id);
    } else {
      setAvailableStock(null);
    }
  }, [formData.product_id, formData.from_warehouse_id]);

  const checkAvailableStock = async (id) => {
    try {
      // Mock data - replace with actual API call

      const data = await warehouseService.getInventory(id) 

      const item = data.data.find(
        item => item.productId == formData.product_id
      );

      const mock = item
        ? {
          available: item.availableQuantity,
          reserved: item.reorderLevel,
          transferrable:
            Number(item.availableQuantity) - Number(item.reorderLevel)
        }
        : null;  

      setAvailableStock(mock);

      // Get product details
      const product = products.find(p => p.value === formData.product_id);
      setSelectedProduct(product);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.from_warehouse_id) {
      errors.from_warehouse_id = 'Source warehouse is required';
    }

    if (!formData.to_warehouse_id) {
      errors.to_warehouse_id = 'Destination warehouse is required';
    }

    if (formData.from_warehouse_id === formData.to_warehouse_id) {
      errors.to_warehouse_id = 'Source and destination warehouses cannot be the same';
    }

    if (!formData.product_id) {
      errors.product_id = 'Product is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    } else if (availableStock && formData.quantity > availableStock.transferrable) {
      errors.quantity = `Only ${availableStock.transferrable} units available for transfer`;
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason for transfer is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Transfer submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handelWarehouseChange = async (id) => {  
      const data = await productService.getProductsByWarehouse(id); 
      //console.log(data)
      setProducts(data.map(pro => ({
          value: String(pro.id),
          label: `${pro.name} - (${pro.stock?.quantity})`
        })));
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if(name === 'from_warehouse_id'){
      handelWarehouseChange(value)
    }


  };

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warehouse Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            label="From Warehouse (Source)"
            name="from_warehouse_id"
            value={formData.from_warehouse_id}
            onChange={handleChange}
            options={warehouses}
            error={formErrors.from_warehouse_id}
            required
            placeholder="Select source warehouse"
          />
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-6 w-6 text-blue-600 mt-6" />
        </div>

        <div>
          <Select
            label="To Warehouse (Destination)"
            name="to_warehouse_id"
            value={formData.to_warehouse_id}
            onChange={handleChange}
            options={warehouses.filter(w => w.value !== formData.from_warehouse_id)}
            error={formErrors.to_warehouse_id}
            required
            placeholder="Select destination warehouse"
          />
        </div>
      </div>

      {/* Product Selection */}
      <Select
        label="Product"
        name="product_id"
        value={formData.product_id}
        onChange={handleChange}
        options={products}
        error={formErrors.product_id}
        required
        placeholder="Search and select product"
      />

      {/* Stock Information */}
      {availableStock && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 mb-2">
                {selectedProduct?.label}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Available</p>
                  <p className="font-bold text-blue-900">{availableStock.available} units</p>
                </div>
                <div>
                  <p className="text-blue-600">Reserved</p>
                  <p className="font-bold text-blue-900">{availableStock.reserved} units</p>
                </div>
                <div>
                  <p className="text-blue-600">Transferrable</p>
                  <p className="font-bold text-green-600">{availableStock.transferrable} units</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantity and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quantity to Transfer"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          error={formErrors.quantity}
          required
          min="1"
          placeholder="Enter quantity"
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Transfer <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.reason
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
            }`}
          placeholder="Explain why this transfer is needed..."
        />
        {formErrors.reason && (
          <p className="mt-1 text-sm text-red-600">{formErrors.reason}</p>
        )}
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Stock transfer requires approval from warehouse manager</li>
              <li>Stock will be reserved in source warehouse once approved</li>
              <li>Transfer will be completed after destination warehouse confirms receipt</li>
              <li>Any discrepancies should be reported immediately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create Transfer Request
        </Button>
      </div>
    </form>
  );
};

export default StockTransferForm;