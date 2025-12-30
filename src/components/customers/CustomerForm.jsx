import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validators, validateForm } from '../../utils/validators';

import { useNotification } from '../../context/NotificationContext';

const CustomerForm = ({ customer = null, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    gstin: customer?.gstin || '',
    totalOrders: 0,
    totalSpent: 0, 
    billingAddress: customer?.billingAddress || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    shippingAddress: customer?.shippingAddress || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    sameAsShipping: customer?.sameAsShipping ?? true,
    city: customer?.billingAddress?.city ||'',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  
  const { success, error } = useNotification();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    
    if (name.startsWith('billing.') || name.startsWith('shipping.')) {
      const [addressType, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [`${addressType}Address`]: {
          ...prev[`${addressType}Address`],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const rules = {
      name: [(v) => validators.required(v, 'Customer name')],
      phone: [validators.phone],
      // email: [validators.email]
    };

    if (formData.gstin) {
      rules.gstin = [validators.gstin];
    }

    const { isValid, errors: validationErrors } = validateForm(formData, rules);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // If same as shipping, copy billing to shipping
      const dataToSubmit = { ...formData };
      if (formData.sameAsShipping) {
        dataToSubmit.shippingAddress = { ...formData.billingAddress };
      }
      
      await onSubmit(dataToSubmit);
    } catch (error2) {  
        if (String(error2).includes("409")){
          error('A customer with this phone number or email already exists.')
        }else{
          error('Failed to save customer. Please try again.');
        }; 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            error={errors.name}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            error={errors.phone}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="customer@email.com"
            error={errors.email}
          />

          <Input
            label="GSTIN (Optional)"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            placeholder="22AAAAA0000A1Z5"
            error={errors.gstin}
          />
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
        <div className="space-y-4">
          <Input
            label="Address Line 1"
            name="billing.line1"
            value={formData.billingAddress.line1}
            onChange={handleChange}
            placeholder="Street, Building, Area"
          />

          <Input
            label="Address Line 2"
            name="billing.line2"
            value={formData.billingAddress.line2}
            onChange={handleChange}
            placeholder="Landmark (Optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="billing.city"
              value={formData.billingAddress.city}
              onChange={handleChange}
              placeholder="City"
            />

            <Input
              label="State"
              name="billing.state"
              value={formData.billingAddress.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="PIN Code"
              name="billing.pincode"
              value={formData.billingAddress.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN"
            />

            <Input
              label="Country"
              name="billing.country"
              value={formData.billingAddress.country}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Shipping Address Toggle */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="sameAsShipping"
            checked={formData.sameAsShipping}
            onChange={handleChange} 
            className="rounded"
          />
          <span className="text-sm text-gray-700">Shipping address same as billing address</span>
        </label>
      </div>

      {/* Shipping Address (if different) */}
      {!formData.sameAsShipping && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <div className="space-y-4">
            <Input
              label="Address Line 1"
              name="shipping.line1"
              value={formData.shippingAddress.line1}
              onChange={handleChange}
              placeholder="Street, Building, Area"
            />

            <Input
              label="Address Line 2"
              name="shipping.line2"
              value={formData.shippingAddress.line2}
              onChange={handleChange}
              placeholder="Landmark (Optional)"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="shipping.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                placeholder="City"
              />

              <Input
                label="State"
                name="shipping.state"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="PIN Code"
                name="shipping.pincode"
                value={formData.shippingAddress.pincode}
                onChange={handleChange}
                placeholder="6-digit PIN"
              />

              <Input
                label="Country"
                name="shipping.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;