import React, { useState, useEffect } from 'react';
import { BarChart3, IndianRupee, Package } from 'lucide-react';
import Card from '../components/common/Card'; 
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import SalesReport from '../components/reports/SalesReport';
import StockReport from '../components/reports/StockReport';
import KittyReport from '../components/reports/KittyReport';
import GSTReport from '../components/reports/GSTReport';
import PaymentReport from '../components/reports/PaymentReport';

import reportService from '../services/reportService';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [period, setDateRange] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [salesReport, setSalesReport] = useState([]);
  const [salesByEmployee, setSalesByEmployee] = useState([]);
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [stockReportData, setStockReportData] = useState([]);

  const [kittyReport, setKittyReport] = useState([]);
  const [kittyByEmployee, setKittyByEmployee] = useState([]);
  const [paymentData, setPaymentData] = useState([]);


  const [productTypeData, setProductTypeData] = useState([]);
  const [companyReportData, setCompanyReportData] = useState([]);
  const [warehouseReportData, setWarehouseReportData] = useState([]);
  const [customerReportData, setCustomerReportData] = useState([]);
  const [salesTrendData, setSalesTrendData] = useState([]);




  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: BarChart3, color: 'blue' },
    { id: 'stock', name: 'Stock Report', icon: Package, color: 'green' },
    { id: 'kitty', name: 'Kitty (Commission)', icon: IndianRupee , color: 'purple' },
    // { id: 'gst', name: 'GST Report', icon: TrendingUp, color: 'orange' },
    { id: 'payment', name: 'Payment Report', icon: IndianRupee , color: 'indigo' }
  ];

  useEffect(() => {
    // Load initial report data
    loadReportData();
  }, [period]);


  const loadReportData = async () => {
    try {

      const result = await Promise.allSettled([
        reportService.getSalesReport({ period }),
        reportService.getSalesByEmployee({ period }),
        reportService.getSalesByProduct({ period }), 
        reportService.getStockReport({ period }),
        reportService.getPaymentReport({ period }),
        reportService.getSalesByProductType({ period }),
        reportService.getSalesByCompany({ period }),
        reportService.getSalesByWarehouse({ period }),
        reportService.getSalesByCustomer2({ period }),
        reportService.getSalesTrend({ period })
      ]);

      const [salesReport, salesByEmployee, salesByProduct, stockReportData, paymentReportData, productTypeData, companyReportData, warehouseReportData, customerReportData, salesTrendData] = result;

      if(paymentReportData.status === 'fulfilled'){
      setPaymentData(paymentReportData.value)}

      console.log(salesByProduct.value)

      if(salesTrendData.status === 'fulfilled'){
      setSalesTrendData(salesTrendData.value.data.trends.map(s => ({ date: s.period, orders: s.salesCount, revenue: s.revenue })))
      }

      if(customerReportData.status === 'fulfilled'){
      setCustomerReportData(customerReportData.value.data.topCustomers.map(cust => ({ customer: cust.name, phone: cust.phone, orders: cust.orderCount, revenue: cust.totalSpent, avgOrder: cust.avgOrderValue, type: cust.lastPurchase })))}


        if(warehouseReportData.status === 'fulfilled'){
      setWarehouseReportData(warehouseReportData.value.data.map(war => ({ warehouse: war.name, location: war.address, orders: war.salesCount, revenue: war.revenue, percentage: war.productCount })))}


      if(companyReportData.status === 'fulfilled'){
      setCompanyReportData(companyReportData.value.data.map(comp => ({
        company: comp.name, orders: comp.unitsSold
        , revenue: comp.revenue, marketShare: comp.totalProducts, growth: 18.5
      })))}


      if(productTypeData.status === 'fulfilled'){
      setProductTypeData(productTypeData.value.data.map(type => ({ type: type.name, orders: type.totalSales, revenue: type.revenue, quantity: type.unitsSold, avgPrice: type.avgRevenuePerSale, growth: '' })))}

      if(salesReport.status === 'fulfilled'){
      setSalesReport(salesReport.value);}

        if(stockReportData.status === 'fulfilled'){
      setStockReportData(stockReportData.value.data)}

      if(salesByEmployee.status === 'fulfilled'){  

      setSalesByEmployee(salesByEmployee.value.data.map(emp => ({
        name: emp.employee_name,
        orders: emp.sale_count,
        revenue: emp.total_revenue,
        commission: emp.total_margin
      })));

      
      setKittyReport(salesByEmployee.value?.summary);

      setKittyByEmployee(salesByEmployee.value?.data?.map(emp => ({
        name: emp.employee_name,
        items: emp.total_items_sold,
        orders:emp.sale_count,
        revenue: emp.total_revenue,
        commission: emp.total_margin
      })));}

      if(salesByProduct.status === 'fulfilled'){
      setSalesByProduct(salesByProduct.value.data.map(prod => ({
        name: prod.product_name,
        sold: prod.order_count,
        revenue: prod.total_revenue,
        percentage: ((prod.total_revenue / salesReport.value.summary.total_revenue) * 100).toFixed(1)
      })));}

    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };


  // Mock data for reports
  const salesReportData = {
    totalRevenue: salesReport?.summary?.total_revenue.toFixed(2) || 0,
    totalOrders: salesReport?.summary?.total_sales || 0,
    averageOrderValue: salesReport?.summary?.average_sale.toFixed(2),
    growth: '+12.5%',
    salesByEmployee: salesByEmployee,
    salesByProduct: salesByProduct,
    salesByProductType: productTypeData,
    salesByCompany: companyReportData,
    salesByWarehouse: warehouseReportData,
    salesByCustomer: customerReportData,
    salesTrend: salesTrendData
  };



  // const [productTypeData, setProductTypeData] = useState([]);
  // const [companyReportData, setCompanyReportData] = useState([]);
  // const [warehouseReportData, setWarehouseReportData] = useState([]);
  // const [customerReportData, setCustomerReportData] = useState([]);
  // const [salesTrendData, setSalesTrendData] = useState([]);

  const kittyReportData = {
    totalCommission: kittyReport.total_margin,
    paidOut: kittyReport.total_revenue,
    pending: kittyReport.total_sales,
    employeeCommissions: kittyByEmployee
  };

  const gstReportData = {
    totalTaxableValue: 3155932,
    totalGSTCollected: 568068,
    gstBreakdown: [
      { rate: 5, taxableAmount: 850000, cgst: 21250, sgst: 21250 },
      { rate: 12, taxableAmount: 1200000, cgst: 72000, sgst: 72000 },
      { rate: 18, taxableAmount: 2855932, cgst: 257034, sgst: 257034 }
    ]
  };

  const paymentReportData = {
    totalCollected: paymentData.summary?.total_amount.toFixed(2) || 0,
    totalPending: paymentData.summary?.total_outstanding_amount.toFixed(2) || 0,
    paymentsByMethod: paymentData.summary?.by_method.map(pay => ({
      name: pay.method,
      amount: pay.total,
      count: pay.count
    })),
    recentPayments: paymentData?.data?.map(pay => ({
      date: new Date(pay.paid_at).toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      invoice: pay.sale.number,
      customer: pay.sale.customer.name,
      method: pay.method,
      reference: pay.reference_no || 'N/A',
      amount: pay.amount
    }))
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // const handleExportAll = () => {
  //   //console.log('Exporting all reports...');
  // };

  const renderReport = () => {
    switch (reportType) {
      case 'sales':
        return <SalesReport data={salesReportData} dateRange={period} />;
      case 'stock':
        return <StockReport data={stockReportData} dateRange={period} />;
      case 'kitty':
        return <KittyReport data={kittyReportData} dateRange={period} />;
      case 'gst':
        return <GSTReport data={gstReportData} month="11" year="2025" />;
      case 'payment':
        return <PaymentReport data={paymentReportData} />;
      default:
        return <SalesReport data={salesReportData} dateRange={period} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate detailed business reports</p>
        </div>
        {/* <Button icon={Download} onClick={handleExportAll}>
          Export All Reports
        </Button> */}
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {reportTypes.map((type) => (
          <Card
            key={type.id}
            hover
            className={`cursor-pointer transition-all ${reportType === type.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
          >
            <div className="text-center" onClick={() => { setReportType(type.id); console.log('Selected report type:', type.id); }}>
              <div className={`bg-${type.color}-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}>
                <type.icon className={`h-8 w-8 text-${type.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{type.name}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Date Range"
            value={period}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRangeOptions}
            className="mb-0"
          />

          {period === 'custom' ? (
            <>
              <Input
                label="From Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mb-0"
              />
              <Input
                label="To Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mb-0"
              />
            </>
          ) : (
            <div className="md:col-span-2"></div>
          )}

          {/* <div className="flex items-end">
            <Button fullWidth icon={Calendar}>
              Generate Report
            </Button>
          </div> */}
        </div>
      </Card>

      {/* Report Content */}
      <div className="animate-fadeIn">
        {renderReport()}
      </div>
    </div>
  );
};

export default Reports;