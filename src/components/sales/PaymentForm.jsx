import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../../utils/constants';

const PaymentForm = ({ sale, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ 
    method: '',
    amount: '',
    reference_no: ''
  }); 

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const remainingAmount = sale.amount - (sale.paid || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.method) {
      newErrors.method = 'Payment method is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > remainingAmount) {
      newErrors.amount = `Amount cannot exceed remaining balance (₹${remainingAmount?.toLocaleString()})`;
    }

    if (['cheque', 'bank', 'online'].includes(formData.method) && !formData.reference_no) {
      newErrors.reference_no = 'Reference number is required for this payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData, 
        amount: parseFloat(formData.amount)
      });
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-semibold text-gray-900">₹{sale.amount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paid Amount:</span>
          <span className="font-semibold text-green-600">₹{(sale.paid || 0)?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t pt-2">
          <span className="text-gray-900">Remaining:</span>
          <span className="text-red-600">₹{remainingAmount?.toLocaleString()}</span>
        </div>
      </div>

      <Select
        label="Payment Method"
        name="method"
        value={formData.method}
        onChange={handleChange}
        options={paymentMethodOptions}
        error={errors.method}
        required
        placeholder="Select payment method"
      />

      <Input
        label="Amount (₹)"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Enter amount"
        error={errors.amount}
        required
        min="0"
        step="0.01"
        helperText={`Maximum: ₹${remainingAmount?.toLocaleString()}`}
      />

      {['cheque', 'bank', 'online', 'upi'].includes(formData.method) && (
        <Input
          label={
            formData.method === 'cheque' ? 'Cheque Number' :
            formData.method === 'bank' ? 'Transaction ID' :
            formData.method === 'upi' ? 'UPI Transaction ID' :
            'Reference Number'
          }
          name="reference_no"
          value={formData.reference_no}
          onChange={handleChange}
          placeholder={`Enter ${formData.method} reference`}
          error={errors.reference_no}
          required
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any payment notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Record Payment
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;