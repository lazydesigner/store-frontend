import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { calculateLineTotal } from '../../utils/helpers';
import { useDiscountValidation } from '../../hooks/useDiscountValidation';
import { useAuthContext } from '../../context/AuthContext';

import customerService from '../../services/customerService';
import warehouseService from '../../services/warehouseService';
import productService from '../../services/productService';

const SaleForm = ({ sale = null, onSubmit, onCancel }) => {
  const { user } = useAuthContext();
  const { validateDiscount, getMaxDiscount } = useDiscountValidation();
  const [customers, setCustomer] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [saleType, setSaleType] = useState(sale?.type || 'draft');
  const [formData, setFormData] = useState({
    id: sale.id,
    customer_id: parseInt(sale?.customerId) || '',
    warehouse_id: parseInt(sale?.warehouseId) || '',
    items: sale?.items.map((item=>({
        product_id: item.product_id,
      productName: item.product.name,
      productTypeId: item.product.product_type_id,
      qty: item.qty,
      unit_price: item.unit_price,
      minPrice: 0,
      maxPrice: 0,
      discount_percent: item.discount_percent,
      maxDiscountAllowed: 100,
      taxRate: 0,
      lineTotal: item.line_total
    }))) || [{
      product_id: '',
      productName: '',
      productTypeId: '',
      qty: 1,
      unit_price: 0,
      minPrice: 0,
      maxPrice: 0,
      discount_percent: 0,
      maxDiscountAllowed: 100,
      taxRate: 0,
      lineTotal
: 0
    }],
    notes: sale?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [discountErrors, setDiscountErrors] = useState({});

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product_id: '',
        productName: '',
        productTypeId: '',
        qty: 1,
        unit_price: 0,
        minPrice: 0,
        maxPrice: 0,
        discount_percent: 0,
        maxDiscountAllowed: 100,
        taxRate: 0,
        lineTotal
: 0
      }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));

    // Clear discount error for removed item
    setDiscountErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };
 

  const handleItemChange = async (index, field, value) => { 
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };

      // If product changed, load max discount
      if (field === 'product_id') {
        loadMaxDiscount(index, newItems[index].productTypeId);
      }

      // Recalculate line total
      const item = newItems[index];
      newItems[index].lineTotal
 = calculateLineTotal(
        item.unit_price,
        item.qty,
        item.discount_percent,
        item.taxRate
      );

      return { ...prev, items: newItems };
    });

    // Validate discount when changed
    if (field === 'discount_percent') {
      await validateItemDiscount(index, value);
    }
  };

  const loadMaxDiscount = async (index, productTypeId) => {
    if (!user?.id) return;

    try {
      const maxDiscount = await getMaxDiscount(user.id, productTypeId); 

      setFormData(prev => {
        const newItems = [...prev.items];
        newItems[index].maxDiscountAllowed = maxDiscount;
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Failed to load max discount:', error);
    }
  };

  const validateItemDiscount = async (index, discount_percent) => {
    if (!user?.id) return;

    const item = formData.items[index];
    const discount = parseFloat(discount_percent) || 0;

    if (discount === 0) {
      setDiscountErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      return;
    }

    const validation = await validateDiscount(
      user.id,
      item.productTypeId,
      discount
    ); 

    if (!validation.valid) {
      setDiscountErrors(prev => ({
        ...prev,
        [index]: validation.error
      }));
    } else {
      setDiscountErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) =>
      sum + (item.unit_price * item.qty), 0
    );

    const discount_total = formData.items.reduce((sum, item) =>
      sum + ((item.unit_price * item.qty * item.discount_percent) / 100), 0
    );

    const tax_total = formData.items.reduce((sum, item) => {
      const taxableAmount = (item.unit_price * item.qty) - ((item.unit_price * item.qty * item.discount_percent) / 100);
      return sum + ((taxableAmount * item.taxRate) / 100);
    }, 0);

    const grand_total = subtotal - discount_total + tax_total;

    return { subtotal, discount_total, tax_total, grand_total };
  };

  const { subtotal, discount_total, tax_total, grand_total } = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for discount errors
    if (Object.keys(discountErrors).length > 0) {
      alert('Please fix discount errors before submitting');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        type: saleType,
        subtotal,
        discount_total,
        tax_total,
        grand_total,
        employee_id: parseInt(user?.id)
      });
    } catch (error) {
      console.error('Sale submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data

  useEffect(() => {
    loadCustomers();
  }, []);

  function GetStock(inv){
    let count = 0;
    inv.map(i=>{
      count += i.quantity
    })
    return count
  }

  const loadCustomers = async () => {
    try {

      const [wareData, csutData, proData] = await Promise.all([
        warehouseService.getAllWarehouses(),
        customerService.getAllCustomers(),
        productService.getProductsByWarehouse(sale.warehouseId)
      ]);
      setCustomer(csutData.data.map(cust => ({
        value: cust.id,
        label: `${cust.name} - ${cust.phone}`
      })));
      setWarehouses(wareData.data.map(cust => ({
        value: cust.id,
        label: `${cust.name} - ${cust.phone}`
      })));  
      //console.log(proData)
      setProducts(proData.map(pro => ({
        value: String(pro.id),
        label: `${pro.name} - (${pro.stock?.quantity})`,
        price: pro.max_price,
        minPrice: pro.max_price,
        maxPrice: pro.min_price,
        productTypeId: pro.productType.id,
        productTypeName: pro.productType.name,
        taxRate: parseInt(pro.tax_rate),
        unit: pro.stock.quantity
      })));
    } catch (error) {
      console.error('Failed to load customers:', error);
      return [];
    }
  }; 

  const handelWarehouseChange = async (e) => {
    setFormData(prev => ({ ...prev, warehouse_id: e.target.value }));

    const data = await productService.getProductsByWarehouse(e.target.value); 
    //console.log(data)
    setProducts(data.map(pro => ({
        value: String(pro.id),
        label: `${pro.name} - (${pro.stock?.quantity})`,
        price: pro.max_price,
        minPrice: pro.max_price,
        maxPrice: pro.min_price,
        productTypeId: pro.productType.id,
        productTypeName: pro.productType.name,
        taxRate: parseInt(pro.tax_rate),
        unit: pro.stock.quantity
      })));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sale Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sale Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'draft', label: 'Draft', desc: 'Save for later' },
            { value: 'proforma', label: 'Proforma Invoice', desc: 'Quotation' },
            // { value: 'invoice', label: 'Final Invoice', desc: 'Confirmed sale' }
          ].map((type) => (
            <div
              key={type.value}
              onClick={() => setSaleType(type.value)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${saleType === type.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <p className="font-medium text-gray-900">{type.label}</p>
              <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer & Warehouse */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <Select
          label="Customer"
          value={formData.customer_id}
          onChange={(e) => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
          options={customers}
          required
          placeholder="Select or search customer"
        />
        <Select
          label="Warehouse"
          value={formData.warehouse_id}
          onChange={(e) => handelWarehouseChange(e)}
          options={warehouses}
          required
        />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Order Items</h3>
          <Button type="button" size="sm" variant="outline" icon={Plus} onClick={handleAddItem}>
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid md:grid-cols-12 grid-cols-1 gap-3">
                <div className="col-span-4">
                  <Select
                    label="Product"
                    value={item.product_id}
                    onChange={(e) => {
                      const product = products.find(p => p.value === e.target.value);
                      if (product) {
                        handleItemChange(index, 'product_id', e.target.value);
                        handleItemChange(index, 'productName', product.label);
                        handleItemChange(index, 'unit_price', product.price);
                        handleItemChange(index, 'minPrice', product.minPrice);
                        handleItemChange(index, 'maxPrice', product.maxPrice);
                        handleItemChange(index, 'productTypeId', product.productTypeId);
                        handleItemChange(index, 'taxRate', product.taxRate);
                      }
                    }}
                    options={products}
                    placeholder="Search product"
                    className="mb-0"
                  />
                </div>
                <div className="md:col-span-2 col-span-4">
                  <Input
                    label="Quantity"
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                    min="1"
                    className="mb-0"
                  />
                </div>
                <div className="md:col-span-2 col-span-4">
                  <Input
                    label="Price (₹)"
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="mb-0"
                    helperText={`₹${item.minPrice}-${item.maxPrice}`}
                  />
                </div>
                <div className="md:col-span-2 col-span-4">
                  <Input
                    label={`Discount (Max: ${item.maxDiscountAllowed}%)`}
                    type="number"
                    value={item.discount_percent}
                    onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
                    min="0"
                    max={item.maxDiscountAllowed}
                    className="mb-0"
                    error={discountErrors[index]}
                  />
                </div>
                <div className="col-span-1 flex">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                    <p className="text-lg font-bold text-gray-900">₹{item.lineTotal?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={formData.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {discountErrors[index] && (
                <div className="mt-2 flex items-start space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{discountErrors[index]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any special instructions..."
        />
      </div>

      {/* Totals */}
      <div className="border-t pt-4">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-red-600">-₹{discount_total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">₹{tax_total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Grand Total:</span>
            <span className="text-blue-600">₹{grand_total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        {saleType === 'draft' && (
          <Button type="submit" variant="secondary" loading={loading}>
            Save Draft
          </Button>
        )}
        {saleType === 'invoice' && (
          <Button type="submit" loading={loading} disabled={Object.keys(discountErrors).length > 0}>
            Confirm & Generate Invoice
          </Button>
        )}
        {saleType === 'proforma' && (
          <Button type="submit" loading={loading} disabled={Object.keys(discountErrors).length > 0}>
            Generate Proforma
          </Button>
        )}
      </div>
    </form>
  );
};

export default SaleForm; 