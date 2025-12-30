import React from 'react';
import Button from '../common/Button';
import { Download, Printer, Mail } from 'lucide-react';

const InvoicePDF = ({ invoice, onDownload, onPrint, onEmail }) => {
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <div>
      {/* Action Buttons - Hidden in print */}
      <div className="no-print flex justify-end space-x-3 mb-6">
        <Button variant="outline" icon={Mail} onClick={onEmail}>
          Email
        </Button>
        <Button variant="outline" icon={Printer} onClick={handlePrint}>
          Print
        </Button>
        <Button icon={Download} onClick={onDownload}>
          Download PDF
        </Button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none print:p-0">
        <div className="border-4 border-blue-600 p-8 print:border-2">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex gap-2 items-center"><img src="/logo.jpg" style={{ width: "100px" }} alt="" />
                <div>
                  <h1 className="text-4xl font-bold text-blue-600">PROFORMA INVOICE</h1>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {/* Juhi depot, , Canal Colony, Vinoba Nagar, Juhi Kalan, Juhi,  */}
                <p className="font-semibold  my-0 text-gray-900">Friends Digital</p>
                <p>127/T/10, opposite Siddhi Remedies</p>
                <p>Kanpur, Uttar Pradesh 208014</p>
                <p>GSTIN: 09AHCPP5662L1ZT</p>
                <p>Phone: +91 99368 28533</p>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
                <p className="text-xs">Invoice No</p>
                <p className="text-xs font-bold">{invoice.invoiceNo}</p>
              </div>
              <p className="text-sm text-gray-600">Date: {invoice.date}</p>
              {/* <p className="text-sm text-gray-600">Due Date: {invoice.dueDate}</p> */}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h2>
            <p className="font-semibold text-gray-900">{invoice.otherDetails?.customer.name} - {invoice.otherDetails?.customer.phone}</p>
            <p className="text-sm text-gray-600">{invoice.otherDetails?.customer.email}</p>
            <p className="text-sm text-gray-600">{invoice.otherDetails?.customer.billing_address.line1}, {invoice.otherDetails?.customer.billing_address.city} - {invoice.otherDetails?.customer.billing_address.pincode}</p>
            <p className="text-sm text-gray-600">{invoice.otherDetails?.customer.billing_address.state}</p>
            {invoice.customer.gstin && (
              <p className="text-sm text-gray-600">GSTIN: {invoice.otherDetails?.customer.gstin}</p>
            )}
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left py-2 px-3 text-sm">#</th>
                <th className="text-left py-2 px-3 text-sm">Description</th>
                <th className="text-center py-2 px-3 text-sm">Qty</th>
                <th className="text-right py-2 px-3 text-sm">Rate</th>
                <th className="text-right py-2 px-3 text-sm">Disc%</th>
                <th className="text-right py-2 px-3 text-sm">Tax%</th>
                <th className="text-right py-2 px-3 text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3 text-sm">{index + 1}</td>
                  <td className="py-2 px-3">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.product.sku}</p>
                  </td>
                  <td className="py-2 px-3 text-center text-sm">{item.qty}</td>
                  <td className="py-2 px-3 text-right text-sm">₹{item.unit_price}</td>
                  <td className="py-2 px-3 text-right text-sm">{item.discount_percent}%</td>
                  <td className="py-2 px-3 text-right text-sm">{0}%</td>
                  <td className="py-2 px-3 text-right text-sm font-semibold">
                    ₹{item.line_total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-80">
              <div className="flex justify-between py-2 text-sm border-b">
                <span>Subtotal:</span>
                <span className="font-medium">₹{(parseFloat(invoice.otherDetails?.subtotal) - parseFloat(invoice.otherDetails?.discount_total))?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b">
                <span>Discount:</span>
                <span className="font-medium text-red-600">-₹{invoice.otherDetails?.discount_total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b">
                <span>Tax (GST):</span>
                <span className="font-medium">₹0</span>
                {/* <span className="font-medium">₹{invoice.tax?.toLocaleString()}</span> */}
              </div>
              <div className="flex justify-between py-3 text-lg font-bold bg-blue-600 text-white px-4 rounded-lg mt-2">
                <span>TOTAL:</span>
                <span>₹{(parseFloat(invoice.otherDetails?.subtotal) - parseFloat(invoice.otherDetails?.discount_total))?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {invoice.otherDetails.payments && invoice.otherDetails.payments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">PAYMENT DETAILS:</h3>
              <div className="">
                {invoice.otherDetails.payments?.map((payment, index) => (
                  <div key={index} className="flex bg-blue-50 p-3 rounded justify-between text-sm mb-2">
                    <span>{new Date(payment.paid_at).toLocaleTimeString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })} - {(payment.method).toUpperCase()}</span>
                    <span className="font-semibold text-blue-600">
                      ₹{payment.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">TERMS & CONDITIONS:</p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li>• Payment due within 30 days</li>
                  <li>• All disputes subject to Mumbai jurisdiction</li>
                  <li>• Goods once sold will not be taken back</li>
                  <li>• Warranty terms as per manufacturer</li>
                </ul>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-4">For Electronics Store Pvt Ltd</p>
                <div className="border-t border-gray-400 pt-2 mt-8">
                  <p className="text-xs font-semibold">Authorized Signatory</p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Thank you for your business!</p>
              <p className="mt-1">This is a computer-generated invoice and does not require signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;