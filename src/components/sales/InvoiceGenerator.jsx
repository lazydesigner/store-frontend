import React from 'react';
import { Building, User, Phone, Mail, MapPin } from 'lucide-react';

const InvoiceGenerator = ({ invoice }) => {
  const {
    invoiceNo,
    date,
    customer,
    items = [],
    subtotal,
    discount,
    tax,
    grandTotal,
    payments = []
  } = invoice;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="invoice-content">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <div className="flex items-center text-gray-600 mb-1">
            <Building className="h-4 w-4 mr-2" />
            <span className="font-semibold">Friends Digital</span>
          </div>
          <p className="text-sm text-gray-600">127/T/10, opposite Siddhi Remedies Kanpur, Uttar Pradesh 208014</p>
          <p className="text-sm text-gray-600">GSTIN: 09AHCPP5662L1ZT</p>
          <p className="text-sm text-gray-600">Phone: +91 99368 28533</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Invoice No:</p>
          <p className="text-xl font-bold text-blue-600">{invoiceNo}</p>
          <p className="text-sm text-gray-600 mt-2">Date: {date}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-gray-900 font-semibold mb-2">
            <User className="h-4 w-4 mr-2" />
            {customer.name}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Phone className="h-4 w-4 mr-2" />
            {customer.phone}
          </div>
          {customer.email && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Mail className="h-4 w-4 mr-2" />
              {customer.email}
            </div>
          )}
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-0.5" />
            <span>{customer.address}</span>
          </div>
          {customer.gstin && (
            <p className="text-sm text-gray-600 mt-1">GSTIN: {customer.gstin}</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">#</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item Description</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Qty</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Rate</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Discount</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Tax</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4 text-sm text-gray-900">{index + 1}</td>
              <td className="py-3 px-4">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </td>
              <td className="py-3 px-4 text-sm text-right text-gray-900">{item.quantity}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-900">₹{item.rate.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">{item.discount}%</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">{item.taxRate}%</td>
              <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                ₹{item.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-red-600">-₹{discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Tax (GST):</span>
            <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
            <span className="text-gray-900">Grand Total:</span>
            <span className="text-blue-600">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {payments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details:</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Method</th>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Reference</th>
                <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 text-sm text-gray-900">{payment.date}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{payment.method}</td>
                  <td className="py-2 px-4 text-sm text-gray-600">{payment.reference || '-'}</td>
                  <td className="py-2 px-4 text-sm text-right text-green-600 font-semibold">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Terms & Conditions:</strong>
        </p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Payment due within 30 days</li>
          <li>All disputes subject to Mumbai jurisdiction</li>
          <li>Goods once sold will not be taken back</li>
          <li>Warranty terms as per manufacturer</li>
        </ul>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Thank you for your business!</p>
          <p className="text-xs text-gray-500 mt-2">This is a computer-generated invoice</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;