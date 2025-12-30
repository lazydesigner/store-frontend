import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/dashboard/DashboardStats';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import KittyLeaderboard from '../components/dashboard/KittyLeaderboard';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';
import InvoicePDF from '../components/sales/InvoicePDF';

import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import salesService from '../services/salesService';


const Dashboard = () => {
  const { success } = useNotification();
  const [loading, setLoading] = useState(true);
  const [dStats, setDStats] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {

    delivery()
    // Simulate data loading
    LoadData()
    setTimeout(() => {
      setLoading(false);
      success('Dashboard loaded successfully');
    }, 500);
  }, []);

  const delivery = () => {
    const user = JSON.parse(localStorage.getItem('user_data'));
    const isDelivery =
      user?.roles?.includes('Delivery')
    if (isDelivery) {
      window.location.href = '/delivery';
    }
  }

  const LoadData = async () => {
    const result = await Promise.allSettled([
      dashboardService.getDashboardStats(),
      dashboardService.getRecentSale(),
      dashboardService.getSaleChart(),
      dashboardService.getLowStock(),
      reportService.getKitty(),
    ])

    const [DashboardStats, getRecentSale, getSaleChart, stockReportData, kittyData] = result


    console.log(DashboardStats.value.data.stats)

    if(DashboardStats.status === 'fulfilled'){
    setDStats(DashboardStats.value.data.stats)}



    if(stockReportData.status === 'fulfilled'){
    setLowStockItems(stockReportData.value.data.map((low) => (
      {
        name: low.product.name,
        sku: low.product.sku,
        stock: low.quantity,
        minStock: low.reorder_level,
        warehouse: low.warehouse.name
      }
    )))}

    if(getRecentSale.status === 'fulfilled'){
    setRecentOrders(getRecentSale.value.data.slice(0, 10).map((sale) => (
      {
        id: sale.number,
        customer: sale.customer.name,
        amount: '₹' + sale.subtotal,
        status: sale.status,
        data: sale,
        date: new Date(sale.created_at).toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      })))}

      if(kittyData.status === 'fulfilled'){

    setTopSellers(kittyData.value.data.leaderboard.map((kitty) => ({
      name: kitty.name,
      sales: '₹' + kitty.revenue,
      orders: kitty.salesCount,
      commission: '₹' + kitty.margin,
      rank: kitty.rank
    })))}


    if(getSaleChart.status === 'fulfilled'){
    setSalesChartData(getSaleChart.value.data.chart.map((item) => ({
      label: item.label,
      value: item.value,
      orders: item.orders
    })))}
  }

  const handleViewOrder = (order) => {
    console.log('View order:', order);

    navigate(`/invoice/${order.data.id}`);
    // setSelectedSale(order.data);
    // setShowInvoiceModal(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Sales',
      value: dStats[0]?.value,
      change: dStats[0]?.change,
      changeType: dStats[0]?.changeType,
      icon: TrendingUp,
      color: dStats[0]?.color
    },
    {
      title: 'Orders',
      value: dStats[1]?.value,
      change: dStats[1]?.change,
      changeType: dStats[1]?.changeType,
      icon: ShoppingCart,
      color: dStats[1]?.color
    },
    {
      title: 'Customers',
      value: dStats[2]?.value,
      change: dStats[2]?.change,
      changeType: dStats[2]?.changeType,
      icon: Users,
      color: dStats[2]?.color
    },
    {
      title: 'Products',
      value: dStats[3]?.value,
      change: dStats[3]?.change,
      changeType: dStats[3]?.changeType,
      icon: Package,
      color: dStats[3]?.color
    }
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Charts and Recent Activity */}
      <div className={`grid grid-cols-1 ${(JSON.parse(localStorage.getItem('user_data')).roles.includes('Admin') || JSON.parse(localStorage.getItem('user_data')).roles.includes('Manager')) ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        <div className="lg:col-span-2">
          <SalesChart data={salesChartData} />
        </div>
        <div>
          {(JSON.parse(localStorage.getItem('user_data')).roles.includes('Admin') || JSON.parse(localStorage.getItem('user_data')).roles.includes('Manager')) ?
            <LowStockAlert items={lowStockItems} /> : (<></>)}
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} onView={handleViewOrder} />

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
            onEmail={() => success('Invoice sent via email')}
          />
        )}
      </Modal>

      {/* Top Sellers Leaderboard */}

      {(JSON.parse(localStorage.getItem('user_data')).roles.includes('Admin') || JSON.parse(localStorage.getItem('user_data')).roles.includes('Manager')) ? (<KittyLeaderboard sellers={topSellers} />) : (<></>)}

    </div>
  );
};

export default Dashboard;