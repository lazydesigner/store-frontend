import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import StockTransferForm from '../components/warehouse/StockTransferForm';
import StockTransferList from '../components/warehouse/StockTransferList';
import { useNotification } from '../context/NotificationContext';
import { stockTransferService } from '../services/stockTransferService';

import warehouseService from '../services/warehouseService';
import productService from '../services/productService';


function transformTransferData(arr) {
  return arr.map((data) => ({
    id: data.id,
    tid: data.transfer_number || "",
    product: data.product?.name || "",
    productId: String(data.product_id || ""),
    fromWarehouse: data.fromWarehouse?.name || "",
    fromWarehouseId: String(data.from_warehouse_id || ""), 
    toWarehouse: data.toWarehouse?.name || "",
    toWarehouseId: String(data.to_warehouse_id || ""),
    quantity: data.quantity || 0,
    status: data.status || "",
    priority: data.priority || "",
    reason: data.reason || "",
    requestedBy: data.requester?.name || "",
    date: data.created_at ? data.created_at.split("T")[0] : "",
    time: data.created_at
      ? new Date(data.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : ""
  }));
} 


const StockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    getAllData();
    fetchTransfers();
  }, [filterStatus, filterWarehouse]);

  const fetchTransfers = async () => {
    try {
      setLoading(true); 

      const response = await stockTransferService.getAllTransfers();
      // setTransfers(response.data);
      const data = transformTransferData(response.data)
   
      //console.log(data);
      setTransfers(data);
    } catch (err) {
      showError('Failed to load stock transfers');
    } finally {
      setLoading(false);
    }
  };


  const getAllData = async () => {
    setLoading(true); 
    try {
     const result = await Promise.allSettled([ 
                    warehouseService.getAllWarehouses(),
                    productService.getAllProducts(),
          ]);  
          const [ warehouseResponse, productResponse ] = result;
      if(warehouseResponse.status === 'fulfilled'){setWarehouses(warehouseResponse.value.data.map(wh => ({ value: wh.id, label: wh.name })));} 
      if(productResponse.status === 'fulfilled'){
      setProducts(productResponse.value.data.map(p => ({ value: p.id, label: p.name })) );}
    } catch (error) {
      showError('Failed to load stock transfers');
    } finally {
      setLoading(false);
    } 
  };
 

  const handleCreateTransfer = async (formData) => {
    try {
      await stockTransferService.createTransfer(formData);
      success('Stock transfer request created successfully');
      setShowCreateModal(false);
      fetchTransfers();
    } catch (error) { 
      showError('Failed to create transfer request');
    }
  };

  const handleApprove = async (transfer) => {
    //console.log(transfer)
    if (window.confirm(`Approve transfer of ${transfer.quantity} units of ${transfer.product}?`)) {
      try {
        await stockTransferService.approveTransfer(transfer.id, 0);
        success('Transfer approved successfully');
        fetchTransfers();
      } catch (error) {
        showError('Failed to approve transfer');
      }
    }
  };

  const handleReject = (transfer) => {
    setSelectedTransfer(transfer);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }

    try {
      await stockTransferService.rejectTransfer(selectedTransfer.id, rejectReason, 'CurrentUserId');
      success('Transfer rejected');
      setShowRejectModal(false);
      fetchTransfers();
    } catch (error) {
      showError('Failed to reject transfer');
    }
  };

  const handleDispatch = async (transfer) => {
    const remarks = prompt('Add remarks for dispatch (optional):');
    
    try {
      await stockTransferService.dispatchTransfer(transfer.id, 0, remarks);
      success('Transfer marked as dispatched');
      fetchTransfers();
    } catch (error) {
      showError('Failed to dispatch transfer');
    }
  };

  const handleReceive = async (transfer) => {
    const actualQuantity = prompt(`Enter actual quantity received (Expected: ${transfer.quantity}):`, transfer.quantity);
    
    if (actualQuantity === null) return;

    const qty = parseInt(actualQuantity);
    if (isNaN(qty) || qty <= 0) {
      showError('Invalid quantity');
      return;
    }

    const remarks = qty !== transfer.quantity 
      ? prompt('Quantity mismatch. Please provide remarks:')
      : '';

    try {
      await stockTransferService.receiveTransfer(transfer.id, 0, qty, remarks);
      success('Transfer completed successfully');
      fetchTransfers();
    } catch (error) {
      showError('Failed to confirm receipt');
    }
  };

  const handleView = (transfer) => {
    setSelectedTransfer(transfer);
    setShowViewModal(true);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'dispatched', label: 'In Transit' },
    { value: 'received', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredTransfers = transfers.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterWarehouse && t.fromWarehouseId !== filterWarehouse && t.toWarehouseId !== filterWarehouse) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Transfers</h1>
          <p className="text-gray-500 mt-1">Manage inter-warehouse stock movements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Download}>
            Export
          </Button>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            New Transfer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            className="mb-0"
          />
          <Select
            label="Filter by Warehouse"
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            options={[{ value: '', label: 'All Warehouses' }, ...warehouses]}
            className="mb-0"
          />
          <div className="flex items-end">
            <Button variant="outline" icon={Filter} fullWidth>
              Advanced Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: transfers.filter(t => t.status === 'pending').length, color: 'yellow' },
          { label: 'In Transit', count: transfers.filter(t => t.status === 'dispatched').length, color: 'blue' },
          { label: 'Completed', count: transfers.filter(t => t.status === 'received').length, color: 'green' },
          { label: 'Total', count: transfers.length, color: 'purple' }
        ].map((stat, index) => (
          <Card key={index}>
            <div className="text-center">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 text-${stat.color}-600`}>{stat.count}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Transfers List */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
          </div>
        ) : (
          <StockTransferList
            transfers={filteredTransfers}
            onApprove={handleApprove}
            onReject={handleReject}
            onDispatch={handleDispatch}
            onReceive={handleReceive}
            onView={handleView}
          />
        )}
      </Card>

      {/* Create Transfer Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Stock Transfer"
        size="lg"
      >
        <StockTransferForm
          warehouses={warehouses}
          products={products}
          onSubmit={handleCreateTransfer}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`Transfer Details - ${selectedTransfer?.id}`}
        size="md"
      >
        {selectedTransfer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Product</p>
                <p className="font-medium text-gray-900">{selectedTransfer.product}</p>
              </div>
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-medium text-gray-900">{selectedTransfer.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-500">From</p>
                <p className="font-medium text-gray-900">{selectedTransfer.fromWarehouse}</p>
              </div>
              <div>
                <p className="text-gray-500">To</p>
                <p className="font-medium text-gray-900">{selectedTransfer.toWarehouse}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{selectedTransfer.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Priority</p>
                <p className="font-medium text-gray-900">{selectedTransfer.priority}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Reason</p>
              <p className="font-medium text-gray-900">{selectedTransfer.reason}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Transfer"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to reject transfer request <strong>{selectedTransfer?.id}</strong>
          </p>
          <Input
            label="Reason for Rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            required
          />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockTransfers;