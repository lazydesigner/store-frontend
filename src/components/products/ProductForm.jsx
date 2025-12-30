import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { validators, validateForm } from '../../utils/validators';
import productService from '../../services/productService';
import companyService from '../../services/companyService';
import warehouseService from '../../services/warehouseService';
import { useNotification } from '../../context/NotificationContext';

function convertProductTypes(apiData) {
  return apiData.map(item => ({
    value: String(item.id),
    label: item.name
  }));
}

const ProductForm = ({ product = null, onSubmit, onCancel, mode = 'create' }) => {
  // mode: 'create' = new product, 'edit' = edit product, 'add-to-warehouse' = add existing product to another warehouse

  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    product_type_id: product?.product_type_id || '',
    company_id: product?.company_id || '',
    hsn_code: product?.hsn_code || '',
    tax_rate: product?.tax_rate || 0,
    min_price: product?.min_price || '',
    max_price: product?.max_price || '',
    is_active: product?.isActive ?? true
  });


  // Separate inventory data for warehouse-specific fields
  const [inventoryData, setInventoryData] = useState({
    warehouse_id: product?.inventory?.[0]?.warehouse_id || '',
    quantity: product?.inventory?.[0]?.quantity || 0,
    reorderLevel: product?.inventory?.[0]?.reorder_level || 10
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();
  const [productTypes, setProductTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const rules = {
      name: [(v) => validators.required(v, 'Product name')],
      sku: [validators.sku],
      product_type_id: [(v) => validators.required(v, 'Product type')],
      company_id: [(v) => validators.required(v, 'Company')],
      min_price: [
        (v) => validators.number(v, 'Minimum price'),
        (v) => validators.min(v, 0, 'Minimum price')
      ],
      max_price: [
        (v) => validators.number(v, 'Maximum price'),
        (v) => validators.min(v, 0, 'Maximum price')
      ]
    };

    const { isValid, errors: validationErrors } = validateForm(formData, rules);

    // Additional validation for price range
    if (formData.min_price && formData.max_price) {
      if (Number(formData.min_price) >= Number(formData.max_price)) {
        validationErrors.max_price = 'Maximum price must be greater than minimum price';
      }
    }

    // Validate warehouse selection
    if (!inventoryData.warehouse_id) {
      validationErrors.warehouse = 'Please select a warehouse';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // let dataToSubmit = {}

    //   if(product?.id){ 
    //     dataToSubmit = { 
    //       ...formData, 
    //       id: product?.id || null 
    //     };
    //   }else{
    //     dataToSubmit = { ...formData };
    //   }

    setLoading(true);
    try {
      // Combine product data with inventory data
      let submitData = {};

      if (mode === 'edit') {
        submitData = {
          ...formData,
          id: product?.id || null,
          inventory: {
            warehouse_id: inventoryData.warehouse_id,
            quantity: Number(inventoryData.quantity),
            reorder_level: Number(inventoryData.reorderLevel)
          }
        };
      } else {
        submitData = {
          ...formData,
          inventory: {
            warehouse_id: inventoryData.warehouse_id,
            quantity: Number(inventoryData.quantity),
            reorder_level: Number(inventoryData.reorderLevel)
          }
        };
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPro()
  }, []);

  const fetchPro = async () => {
    try {
      const [companyResponse, fetchedProductsType, warehousesResponse] = await Promise.all([
        companyService.getAllCompanies(),
        productService.getProductTypes(),
        warehouseService.getAllWarehouses()
      ])
      setProductTypes(() => convertProductTypes(fetchedProductsType.data))
      setCompanies(() => convertProductTypes(companyResponse.data))
      setWarehouses(() => convertProductTypes(warehousesResponse.data))

    } catch (err) {
      error('Failed to load products type');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Details Section */}
      {mode !== 'add-to-warehouse' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.name}
              required
              className="md:col-span-2"
            />

            <Input
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., IP14P-256-BL"
              error={errors.sku}
              required
              helperText="SKU is unique per product, not per warehouse"
            />

            <Input
              label="HSN Code"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
              placeholder="e.g., 8517"
              helperText="Same HSN for same product across warehouses"
            />

            <Select
              label="Product Type"
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleChange}
              options={productTypes}
              error={errors.product_type_id}
              required
            />

            <Select
              label="Company"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              options={companies}
              error={errors.company_id}
              required
            />

            <Input
              label="Tax Rate (%)"
              name="tax_rate"
              type="number"
              value={formData.tax_rate}
              onChange={handleChange}
              placeholder="18"
            />

            <Input
              label="Minimum Price (₹)"
              name="min_price"
              type="number"
              value={formData.min_price}
              onChange={handleChange}
              placeholder="10000"
              error={errors.min_price}
              required
            />

            <Input
              label="Maximum Price (₹)"
              name="max_price"
              type="number"
              value={formData.max_price}
              onChange={handleChange}
              placeholder="15000"
              error={errors.max_price}
              required
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Mark as active</span>
            </label>
          </div>
        </div>
      )}

      {/* Inventory/Warehouse Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === 'add-to-warehouse' ? 'Add to Warehouse' : 'Initial Stock'}
        </h3>

        {mode === 'add-to-warehouse' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Adding existing product:</strong> {product?.name} ({product?.sku})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You can add the same product to multiple warehouses with different stock levels
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Warehouse"
            name="warehouse_id"
            value={inventoryData.warehouse_id}
            onChange={handleInventoryChange}
            options={warehouses}
            error={errors.warehouse}
            required
            helperText="Select warehouse for this stock"
          />

          <Input
            label="Initial Quantity"
            name="quantity"
            type="number"
            value={inventoryData.quantity}
            onChange={handleInventoryChange}
            placeholder="0"
            helperText="Starting stock quantity"
          />

          <Input
            label="Reorder Level"
            name="reorderLevel"
            type="number"
            value={inventoryData.reorderLevel}
            onChange={handleInventoryChange}
            placeholder="10"
            helperText="Alert when stock falls below this"
          />
        </div>

        {mode === 'edit' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> To add this product to another warehouse, use the "Add to Warehouse" button from the product list.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === 'edit' ? 'Update Product' : mode === 'add-to-warehouse' ? 'Add to Warehouse' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;