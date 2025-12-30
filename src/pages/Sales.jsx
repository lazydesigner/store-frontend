import React, { useEffect, useState } from 'react';
import { Plus, FileText, Filter, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import SalesList from '../components/sales/SalesList';
import SaleForm from '../components/sales/SaleForm';
import DraftSale from '../components/sales/DraftSale';
import ProformaInvoice from '../components/sales/ProformaInvoice';
import InvoicePDF from '../components/sales/InvoicePDF';
import PaymentForm from '../components/sales/PaymentForm'; 
import SaleEditForm from '../components/sales/SaleEditForm';
import SalesLog from '../components/sales/SalesLog';
import { useNotification } from '../context/NotificationContext';

import salesService from '../services/salesService';

const Sales = () => {
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState('all');
  const [sales, setSales] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [proformas, setProformas] = useState([])
  const [logs, setLogs] = useState([])
  const [stats2, setStats2] = useState([])
  const [stats, setStats] = useState([]) 
  const [showEditModal, setShowEditModal] = useState(false); 

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const SalesData = await salesService.getAllSales();
      const getSalesLog = await salesService.getSalesLog();

      const stast = await salesService.getSaleStats();
      setStats2(stast.data);

      //console.log(SalesData)

      setLogs(getSalesLog.data.map(log => ({
        id: log.id,
        invoiceNo: log.sale.number,
        action: log.action,
        productName: log?.product?.name,
        productSKU: log?.product?.sku,
        customerName: log.customer.name,
        employeeName: log.employee.name,
        warehouse: log.warehouse.name,
        quantity: log.qty,
        price: log.price,
        timestamp: log.created_at.split("T")[0] + " " + log.created_at.split("T")[1].split(".")[0],
      })))

      setSales(SalesData.data.map(sale => ({
        id: sale.id,
        invoiceNo: sale.number,
        type: sale.type,
        date: sale.created_at.split("T")[0],
        customer: sale.customer.name,
        amount: sale.grand_total,
        paid: sale?.paid_amount,
        remainingAmount: sale?.due_amount,
        EmployeeName: sale?.employee?.name,
        status: sale.status,
        paymentStatus: sale?.payment_status,
        items: sale.items,
        otherDetails: SalesData.data.filter(s => s.id === sale.id)[0]
      })))

      setProformas(SalesData.data
        .filter(sale => sale.type === "proforma")
        .map(sale => ({
          id: sale.id,
          invoiceNo: sale.number,
          type: sale.type,
          date: sale.created_at.split("T")[0],
          customer: sale.customer.name,
          amount: sale.grand_total,
          paid: sale?.paid_amount,
          status: sale.status,
          validUntil: sale.updated_at.split("T")[0],
          paymentStatus: sale?.payment_status,
          items: sale.items
        })))

       //console.log(SalesData) 
      setDrafts(SalesData.data
        .filter(sale => sale.type === "draft")
        .map(sale => ({
          id: sale.id,
          draftNo: sale.number,
          date: sale.created_at.split("T")[0],
          customer: sale.customer.name,
          amount: sale.grand_total,
          itemCount: sale?.items?.length,
          notes: sale.notes,
          items: sale.items,
          customerId: sale.customer_id,
          warehouseId: sale.warehouse_id,
        })))

    } catch (err) {
      //console.log(err);
      error('Failed to load sales data');
    }
  }; 

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleCreateSale = () => {
    setSelectedSale(null);
    setShowCreateModal(true);
  };

  const handleViewSale = (sale) => {
    //console.log(sale)
    setSelectedSale(sale);
    setShowInvoiceModal(true);
  }; 

  const handleDownloadSale = async (sale) => {

    try {

      const url2 = await salesService.getSalePDF(sale.id)
      const url = window.URL.createObjectURL(url2);
      const a = document.createElement('a');

      a.href = url;
      a.download = `sale-${sale.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);


      success(`Downloading ${sale.invoiceNo}`);
      //console.log(url)
    } catch (e) {
      //console.log(e)
    } 
    // Download PDF logic
  };

  const handleDeleteSale = async (sale) => {
    if (window.confirm(`Are you sure you want to delete ${sale.invoiceNo}?`)) {
      try {
        await salesService.deleteSale(sale.id)
        setSales(sales.filter(s => s.id !== sale.id));
        success('Sale deleted successfully');
      } catch (err) {
        error('Failed to delete sale');
      }
    }
  };

  const handleSubmitSale = async (formData) => {
    try { 
      await salesService.createSale(formData)
      loadSales()
      success('Sale created successfully');
      setShowCreateModal(false);
    } catch (err) {
      error('Failed to create sale');
    }
  };

  const handleEditSubmitSale = async (formData) => {
    const {id, employee_id, type, ...data} = formData;
    //console.log(formData)
    try { 
      await salesService.updateSale(id, data)
      loadSales()
          success('Sale updated successfully');
              setShowEditModal(false);
    } catch (err) {
      //console.log(err)
      error('Failed to Update sale');
    }
  };

  const handleEditDraft = (sale) => {
    //console.log(sale)
    if (sale.type === 'invoice') {
      error('Cannot edit confirmed invoices. Please cancel and create a new one.');
      return;
    }
    setSelectedSale(sale);
    setShowEditModal(true);
    success(`Editing draft ${sale.draftNo}`);
  };

  const handleConvertDraft = async (draft) => {
    try {
      await salesService.convertToInvoice(draft.id, draft)
      success(`Converting draft ${draft.draftNo} to invoice`);
      loadSales()
    } catch (e) {
      //console.log(e)
      error('Failed to convert draft')
    }

  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      //console.log('Adding payment:', paymentData);
      success('Payment recorded successfully');
      setShowPaymentModal(false);
    } catch (err) {
      error('Failed to record payment');
    }
  };

  const handleDeleteDraft = async (draft) => {
    try {
      setDrafts(drafts.filter(d => d.id !== draft.id));
      success('Draft deleted successfully');
    } catch (err) {
      error('Failed to delete draft');
    }
  };

  const handleDownloadProforma = async (proforma) => {
    try {

      const url2 = await salesService.getSalePDF(proforma.id)
      const url = window.URL.createObjectURL(url2);
      const a = document.createElement('a');

      a.href = url;
      a.download = `sale-${proforma.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);


      success(`Downloading ${proforma.invoiceNo}`);
      //console.log(url)
    } catch (e) {
      //console.log(e)
    } 
  };

  const handleEmailProforma = async (proforma) => {
    console.log(proforma)
    await salesService.sendinvoice(proforma.id)
    success(`Sending ${proforma.proformaNo} via email`);
  };

  const handleConvertProforma = (proforma) => {
    success(`Converting ${proforma.proformaNo} to invoice`);
  };

  const handleAddPayment = (sale) => {
    setSelectedSale(sale);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (paymentData) => {
    try {
      //console.log('Adding payment Id:', selectedSale);
      await salesService.addPayment(selectedSale.id, paymentData);
      loadSales()
      success('Payment recorded successfully');
      setShowPaymentModal(false);
    } catch (err) {
      error('Failed to record payment');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Sales' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'proforma', label: 'Proforma' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'log', label: 'Sales Log' }
  ];

  if (stats.length === 0) {
    if (stats2.length != 0) {
      setStats(
        [{ label: 'Today\'s Sales', value: '₹' + stats2.today.total, change: stats2.today.comparison.vsYesterday.count.percentage + '%' },
        { label: 'Pending Payments', value: '₹' + stats2.pendingPayments.amount, count: stats2.pendingPayments.count + ' invoices' },
        { label: 'Draft Orders', value: stats2.drafts.count, count: '₹' + stats2.drafts.total },
        { label: 'This Month', value: '₹' + stats2.thisMonth.total, change: stats2.thisMonth.comparison.vsLastMonth.count.percentage + '%' }]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Invoices</h1>
          <p className="text-gray-500 mt-1">Create and manage sales orders</p>
        </div>
        <Button icon={Plus} onClick={handleCreateSale}>
          Create New Sale
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <Card key={index}>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.change || stat.count}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => ( 
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'all' && (
        <Card>
          <SalesList
            sales={sales}
            onView={handleViewSale}
            onDownload={handleDownloadSale}
            onPayment={handleAddPayment}
            onDelete={handleDeleteSale}
          />
        </Card>
      )}

      {activeTab === 'drafts' && (
        <DraftSale
          drafts={drafts}
          onEdit={handleEditDraft}
          onDelete={handleDeleteDraft}
          onConvert={handleConvertDraft}
        />
      )}

      {activeTab === 'proforma' && (
        <ProformaInvoice
          proformas={proformas}
          onDownload={handleDownloadProforma}
          onConvert={handleConvertProforma}
          onEmail={handleEmailProforma}
        />
      )}

      {activeTab === 'invoices' && (
        <Card>
          <SalesList
            sales={sales.filter(s => s.type === 'invoice')}
            onView={handleViewSale}
            onDownload={handleDownloadSale}
            onPayment={handleAddPayment}
            onDelete={handleDeleteSale}
          />
        </Card>
      )}

      {activeTab === 'log' && (
        <SalesLog logs={logs} />
      )}

      {/* Create Sale Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Sale"
        size="xl"
      >
        <SaleForm
          sale={selectedSale}
          onSubmit={handleSubmitSale}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Invoice"
        size="xl"
      >
        {selectedSale && (
          <InvoicePDF
            invoice={selectedSale}
            onDownload={() => handleDownloadSale(selectedSale)}
            onPrint={() => window.print()}
            onEmail={() => {handleEmailProforma(selectedSale)}}
          />
        )}
      </Modal> 

      {/* Edit Sale Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${selectedSale?.type === 'draft' ? 'Draft' : 'Proforma Invoice'}`}
        size="xl"
      >
        {selectedSale && (
          <SaleEditForm
            sale={selectedSale}
            onSubmit={handleEditSubmitSale}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
      >
        {selectedSale && (
          <PaymentForm
            sale={selectedSale}
            onSubmit={handleSubmitPayment}
            onCancel={() => setShowPaymentModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Sales;