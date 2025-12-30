import React from 'react';
import { Download, FileText } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const GSTReport = ({ data = {}, month, year }) => {
  const {
    totalTaxableValue = 0,
    totalGSTCollected = 0,
    gstBreakdown = []
  } = data;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Total Taxable Value</p>
            <h3 className="text-3xl font-bold text-blue-600">
              ₹{totalTaxableValue.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              For {month}/{year}
            </p>
          </div>
        </Card>

        <Card>
          <div className="bg-green-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">Total GST Collected</p>
            <h3 className="text-3xl font-bold text-green-600">
              ₹{totalGSTCollected.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              CGST + SGST/IGST
            </p>
          </div>
        </Card>
      </div>

      {/* GST Breakdown by Rate */}
      <Card 
        title="GST Breakdown by Rate"
        headerActions={
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" icon={Download}>
              GSTR-1
            </Button>
            <Button size="sm" variant="outline" icon={Download}>
              GSTR-3B
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">GST Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Taxable Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">CGST (9%)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SGST (9%)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gstBreakdown.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.rate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{row.taxableAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{row.cgst.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{row.sgst.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{(row.cgst + row.sgst).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{totalTaxableValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{gstBreakdown.reduce((sum, row) => sum + row.cgst, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{gstBreakdown.reduce((sum, row) => sum + row.sgst, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-green-600">
                  ₹{totalGSTCollected.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Download Options */}
      <Card title="Download GST Returns">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">GSTR-1</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Details of outward supplies of goods or services
            </p>
            <Button size="sm" fullWidth icon={Download}>
              Download GSTR-1
            </Button>
          </div>

          <div className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">GSTR-3B</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Monthly summary return
            </p>
            <Button size="sm" fullWidth icon={Download}>
              Download GSTR-3B
            </Button>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>GST rates shown are as per HSN codes configured for products</li>
            <li>CGST and SGST rates are each half of total GST rate (for intra-state supplies)</li>
            <li>For inter-state supplies, IGST (full rate) would apply instead</li>
            <li>Ensure all invoices are filed before downloading returns</li>
            <li>Reconcile with books before filing returns with GSTN</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default GSTReport;

