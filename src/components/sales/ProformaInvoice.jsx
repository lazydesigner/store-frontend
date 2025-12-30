import React from 'react';
import { FileText, Download, ArrowRight, Mail } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ProformaInvoice = ({ proformas = [], onDownload, onConvert, onEmail }) => {
  return (
    <div className="space-y-4">
      {proformas.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No proforma invoices found</p>
          </div>
        </Card>
      ) : (
        proformas.map((proforma) => (
          <Card key={proforma.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-blue-600">{proforma.proformaNo}</h3>
                  <Badge variant="warning">Proforma</Badge>
                  {proforma.emailSent && (
                    <Badge variant="info" size="sm">Email Sent</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{proforma.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{proforma.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valid Until</p>
                    <p className="font-medium text-gray-900">Not Mentioned</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-blue-600">₹{proforma.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    <strong>Items:</strong> {proforma.items.map(item => item.name).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => onDownload(proforma)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEmail(proforma)}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                {/* <Button size="sm" onClick={() => onConvert(proforma)}>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Convert to Invoice
                </Button> */}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProformaInvoice;