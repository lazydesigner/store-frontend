import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import salesService from '../services/salesService';
import settingsService from '../services/settingsService';
import {
    Printer,
    Download,
    Mail,
    ArrowLeft,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Package
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoiceView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            // Mock data - replace with actual API call
            const mockInvoice = {
                id: id,
                invoiceNo: 'INV/2025-26/00123',
                type: 'invoice',
                date: '2025-11-28',
                dueDate: '2025-12-28',
                status: 'paid',
                customer: {
                    name: 'Rajesh Kumar',
                    phone: '9876543210',
                    email: 'rajesh.kumar@email.com',
                    gstin: '22AAAAA0000A1Z5',
                    billingAddress: {
                        line1: '123, MG Road',
                        line2: 'Koramangala',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        pincode: '560034',
                        country: 'India'
                    },
                    shippingAddress: {
                        line1: '456, Brigade Road',
                        line2: 'Indiranagar',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        pincode: '560038',
                        country: 'India'
                    }
                },
                company: {
                    name: 'Electronics Store Management',
                    gstin: '22BBBBB0000B1Z5',
                    pan: 'ABCDE1234F',
                    address: {
                        line1: 'Shop No. 45, Electronic City',
                        line2: 'Phase 1',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        pincode: '560100',
                        country: 'India'
                    },
                    phone: '080-12345678',
                    email: 'sales@electronicsstore.com',
                    website: 'www.electronicsstore.com'
                },
                warehouse: {
                    name: 'Main Warehouse',
                    code: 'WH-001'
                },
                items: [
                    {
                        id: 1,
                        productName: 'iPhone 14 Pro 256GB',
                        sku: 'IP14P-256-BL',
                        hsnCode: '8517',
                        quantity: 2,
                        unitPrice: 125900,
                        discountPercent: 5,
                        taxRate: 18,
                        lineTotal: 239204
                    },
                    {
                        id: 2,
                        productName: 'AirPods Pro 2nd Gen',
                        sku: 'APP-2ND-GEN',
                        hsnCode: '8518',
                        quantity: 1,
                        unitPrice: 24900,
                        discountPercent: 10,
                        taxRate: 18,
                        lineTotal: 26442
                    },
                    {
                        id: 3,
                        productName: 'Apple Watch Series 9',
                        sku: 'AWS9-45MM',
                        hsnCode: '9102',
                        quantity: 1,
                        unitPrice: 45900,
                        discountPercent: 0,
                        taxRate: 18,
                        lineTotal: 54162
                    }
                ],
                subtotal: 273150,
                discountTotal: 14955,
                taxableAmount: 258195,
                cgst: 23237.55,
                sgst: 23237.55,
                igst: 0,
                totalTax: 46475.10,
                grandTotal: 304670.10,
                amountInWords: 'Three Lakh Four Thousand Six Hundred Seventy Rupees and Ten Paise Only',
                payments: [
                    {
                        id: 1,
                        method: 'upi',
                        amount: 200000,
                        reference: 'UPI/123456789',
                        date: '2025-11-28'
                    },
                    {
                        id: 2,
                        method: 'cash',
                        amount: 104670.10,
                        reference: '-',
                        date: '2025-11-28'
                    }
                ],
                notes: 'Thank you for your business. Warranty terms apply as per manufacturer guidelines.',
                salesPerson: 'Priya Sharma',
                termsAndConditions: [
                    'All disputes subject to Bangalore jurisdiction',
                    'Goods once sold cannot be returned',
                    'Warranty as per manufacturer terms',
                    'E. & O.E.'
                ]
            };

            const company2 = await settingsService.getSettings('company');

            console.log(company2.settings)

            const company = {};
            // company2.settings.forEach(s => {
            //     const key = s.key.replace('company_', '');
            //     company[key] = s.value;
            // });

            Object.entries(company2.settings).forEach(([key, value]) => {
                if (key.startsWith('company_')) {
                    const cleanKey = key.replace('company_', '');
                    company[cleanKey] = value;
                }
            });

            const termsAndConditions = [
                'All disputes subject to Bangalore jurisdiction',
                'Goods once sold cannot be returned',
                'Warranty as per manufacturer terms',
                'E. & O.E.'
            ]

            const data = await salesService.getSaleById(id)

            const newData = { ...data.data, company: company, termsAndConditions: termsAndConditions };
            console.log(newData)

            setInvoice(newData);
        } catch (error) {
            console.error('Failed to fetch invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        // In real implementation, call API to generate PDF
        console.log('Download PDF for invoice:', id);
    };

    const handleEmailInvoice = async () => {
        // In real implementation, call API to email invoice
        console.log('Email invoice:', id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Invoice Not Found</h2>
                    <Button className="mt-4" onClick={() => navigate('/sales')}>
                        Back to Sales
                    </Button>
                </div>
            </div>
        );
    }

    const getPaymentStatus = () => {
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= invoice.grandTotal) return { label: 'Paid', variant: 'success' };
        if (totalPaid > 0) return { label: 'Partial', variant: 'warning' };
        return { label: 'Unpaid', variant: 'danger' };
    };

    const paymentStatus = getPaymentStatus();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Action Bar - Hidden when printing */}
                <div className="no-print mb-6 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        icon={ArrowLeft}
                        onClick={() => navigate('/sales')}
                    >
                        Back to Sales
                    </Button>

                    {/* <div className="flex items-center space-x-3">
                        <Button variant="outline" icon={Mail} onClick={handleEmailInvoice}>
                            Email
                        </Button>
                        <Button variant="outline" icon={Download} onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                        <Button icon={Printer} onClick={handlePrint}>
                            Print
                        </Button>
                    </div> */}
                </div>

                {/* Invoice Container */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden" id="invoice-content">
                    {/* Invoice Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex gap-2 items-center"><img src="/logo.jpg" style={{ width: "70px" }} alt="" />
                                    <div>
                                        <h1 className="text-4xl font-bold text-white">PROFORMA INVOICE</h1>
                                    </div>
                                </div>
                                <p className="text-lg font-bold mt-2">{invoice.company.name}</p>
                                <p className="text-blue-100 text-sm">{invoice.company.address1}</p>
                                <p className="text-blue-100 text-sm">{invoice.company.address2}</p>
                                <p className="text-blue-100 text-sm">
                                    {invoice.company.city}, {invoice.company.state} - {invoice.company.pincode}
                                </p>
                                <div className="mt-3 space-y-1">
                                    <p className="text-blue-100 text-sm flex items-center">
                                        <Phone className="h-3 w-3 mr-2" />
                                        {invoice.company.phone}
                                    </p>
                                    <p className="text-blue-100 text-sm">{invoice.company.email}</p>
                                    <p className="text-blue-100 text-sm">GSTIN: {invoice.company.gstin}</p>
                                    <p className="text-blue-100 text-sm">PAN: {invoice.company.pan}</p>
                                </div>
                            </div>

                            <div className="text-right"> 
                                <p className="text-2xl font-bold">{invoice.invoiceNo}</p>
                                <Badge variant={paymentStatus.variant} className="mt-2">
                                    {paymentStatus.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="px-8 py-6 grid grid-cols-2 gap-8 border-b">
                        {/* Bill To */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                BILL TO
                            </h3>
                            <p className="font-semibold text-gray-900 text-lg">{invoice.customer.name}</p>
                            {invoice.customer.gstin && (
                                <p className="text-sm text-gray-600 mt-1">GSTIN: {invoice.customer.gstin}</p>
                            )}
                            <div className="mt-3 space-y-1 text-sm text-gray-600">
                                <p>{invoice.customer.billingAddress.line1}</p>
                                <p>{invoice.customer.billingAddress.line2}</p>
                                <p>
                                    {invoice.customer.billingAddress.city}, {invoice.customer.billingAddress.state} - {invoice.customer.billingAddress.pincode}
                                </p>
                                <p className="flex items-center mt-2">
                                    <Phone className="h-3 w-3 mr-2" />
                                    {invoice.customer.phone}
                                </p>
                                {invoice.customer.email && (
                                    <p className="text-blue-600">{invoice.customer.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Ship To & Invoice Details */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                SHIP TO
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 mb-4">
                                <p>{invoice.customer.shippingAddress.line1}</p>
                                <p>{invoice.customer.shippingAddress.line2}</p>
                                <p>
                                    {invoice.customer.shippingAddress.city}, {invoice.customer.shippingAddress.state} - {invoice.customer.shippingAddress.pincode}
                                </p>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Invoice Date:</span>
                                    <span className="font-semibold">{formatDate(invoice.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Due Date:</span>
                                    <span className="font-semibold">{formatDate(invoice.dueDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Warehouse:</span>
                                    <span className="font-semibold">{invoice.warehouse.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sales Person:</span>
                                    <span className="font-semibold">{invoice.employee.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="px-8 py-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300 bg-blue-600 text-white p-2">
                                    <th className="text-left py-3 text-sm font-bold text-gray-50 p-2">#</th>
                                    <th className="text-left py-3 text-sm font-bold text-gray-50 p-2">ITEM DESCRIPTION</th>
                                    <th className="text-center py-3 text-sm font-bold text-gray-50 p-2">HSN</th>
                                    <th className="text-center py-3 text-sm font-bold text-gray-50 p-2">QTY</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-50 p-2">RATE</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-50 p-2">DISC%</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-50 p-2">TAX%</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-50 p-2">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="py-4 text-sm text-gray-600 p-2">{index + 1}</td>
                                        <td className="py-4 p-2">
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{item.product.sku}</p>
                                        </td>
                                        <td className="text-center py-4 text-sm text-gray-600 p-2">{item.product.hsn_code}</td>
                                        <td className="text-center py-4 text-sm text-gray-900 font-semibold p-2">{item.qty}</td>
                                        <td className="text-right py-4 text-sm text-gray-900 p-2">
                                            {formatCurrency(item.unit_price)}
                                        </td>
                                        <td className="text-right py-4 text-sm text-gray-600 p-2">
                                            {item.discount_percent}%
                                        </td>
                                        <td className="text-right py-4 text-sm text-gray-600 p-2">
                                            {item.taxRate || 0}%
                                        </td>
                                        <td className="text-right py-4 text-sm font-semibold text-gray-900 p-2">
                                            {formatCurrency(item.line_total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="px-8 py-6 bg-gray-50">
                        <div className="flex justify-end">
                            <div className="w-80">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                                    </div>

                                    {invoice.discount_total > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Discount:</span>
                                            <span className="font-semibold text-red-600">
                                                - {formatCurrency(invoice.discount_total)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Taxable Amount:</span>
                                        <span className="font-semibold">{formatCurrency(invoice.tax_total)}</span>
                                    </div>

                                    {/* <div className="border-t pt-2 space-y-1">
                                        {invoice.cgst > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">CGST (9%):</span>
                                                <span className="font-semibold">{formatCurrency(invoice.cgst)}</span>
                                            </div>
                                        )}

                                        {invoice.sgst > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">SGST (9%):</span>
                                                <span className="font-semibold">{formatCurrency(invoice.sgst)}</span>
                                            </div>
                                        )}

                                        {invoice.igst > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">IGST (18%):</span>
                                                <span className="font-semibold">{formatCurrency(invoice.igst)}</span>
                                            </div>
                                        )}
                                    </div> */}

                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-gray-600">Total Tax:</span>
                                        <span className="font-semibold">{formatCurrency(invoice.tax_total)}</span>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-3 mt-2">
                                        <span>GRAND TOTAL:</span>
                                        <span className="text-blue-600">{formatCurrency(invoice.grand_total)}</span>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-3 mt-2">
                                        <span>Due Amount:</span>
                                        <span className="text-red-600">{formatCurrency(invoice.due_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    {invoice.payments.length > 0 && (
                        <div className="px-8 py-6 border-t">
                            <h3 className="font-bold text-gray-900 mb-4">PAYMENT DETAILS</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-300 bg-blue-600 p-2">
                                        <th className="text-left py-2 text-sm font-semibold text-gray-50 p-2">Date</th>
                                        <th className="text-left py-2 text-sm font-semibold text-gray-50 p-2">Method</th>
                                        <th className="text-left py-2 text-sm font-semibold text-gray-50 p-2">Reference</th>
                                        <th className="text-right py-2 text-sm font-semibold text-gray-50 p-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.payments.map((payment) => (
                                        <tr key={payment.id} className="border-b border-gray-100">
                                            <td className="py-3 text-sm text-gray-900 p-2">{formatDate(payment.paid_at)}</td>
                                            <td className="py-3 p-2">
                                                <Badge variant="info" size="sm">
                                                    {payment.method.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600 font-mono p-2">{payment.reference_no}</td>
                                            <td className="py-3 text-sm font-semibold text-right text-green-600 p-2">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold">
                                        <td colSpan="3" className="py-3 text-sm text-right p-2">Total Paid:</td>
                                        <td className="py-3 text-sm text-right text-green-600 p-2">
                                            {formatCurrency(invoice.payments.reduce((sum, p) => parseFloat(sum) + parseFloat(p.amount), 0))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Notes & Terms */}
                    <div className="px-8 py-6 bg-gray-50 border-t">
                        <div className="grid grid-cols-2 gap-8">
                            {invoice.notes && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">NOTES</h3>
                                    <p className="text-sm text-gray-600">{invoice.notes}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">TERMS & CONDITIONS</h3>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {invoice.termsAndConditions.map((term, index) => (
                                        <li key={index}>• {term}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
                        <p className="text-sm">Thank you for your business!</p>
                        <p className="text-xs mt-1 text-blue-100">
                            This is a computer-generated invoice and does not require a signature
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;