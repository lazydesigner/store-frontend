import React from 'react';
import { CheckCircle, XCircle, Clock, Truck, Package } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const StockTransferList = ({ 
  transfers = [], 
  onApprove, 
  onReject, 
  onDispatch, 
  onReceive,
  onView 
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', icon: Clock, label: 'Pending Approval' },
      approved: { variant: 'info', icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'danger', icon: XCircle, label: 'Rejected' },
      dispatched: { variant: 'warning', icon: Truck, label: 'In Transit' },
      received: { variant: 'success', icon: Package, label: 'Completed' },
      cancelled: { variant: 'secondary', icon: XCircle, label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      normal: 'secondary',
      high: 'warning',
      urgent: 'danger'
    };
    return <Badge variant={variants[priority]} size="sm">{priority.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4">
      {transfers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No stock transfers found</p>
        </div>
      ) : (
        transfers.map((transfer) => (
          <div key={transfer.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-semibold text-gray-900">Transfer #{transfer.tid}</span>
                  {getStatusBadge(transfer.status)}
                  {getPriorityBadge(transfer.priority)}
                </div>
                <p className="text-sm text-gray-600">{transfer.product}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{transfer.date}</p>
                <p className="text-xs text-gray-400">{transfer.time}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <p className="font-medium text-gray-900">{transfer.fromWarehouse}</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="h-px w-8 bg-gray-300"></div>
                  <Truck className="h-4 w-4 text-blue-600" />
                  <div className="h-px w-8 bg-gray-300"></div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <p className="font-medium text-gray-900">{transfer.toWarehouse}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-semibold text-gray-900">{transfer.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-500">Requested By</p>
                <p className="font-medium text-gray-900">{transfer.requestedBy}</p>
              </div>
              {transfer.approvedBy && (
                <div>
                  <p className="text-gray-500">Approved By</p>
                  <p className="font-medium text-gray-900">{transfer.approvedBy}</p>
                </div>
              )}
              {transfer.dispatchedBy && (
                <div>
                  <p className="text-gray-500">Dispatched By</p>
                  <p className="font-medium text-gray-900">{transfer.dispatchedBy}</p>
                </div>
              )}
            </div>

            {transfer.reason && (
              <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                <p className="text-blue-900">
                  <span className="font-medium">Reason:</span> {transfer.reason}
                </p>
              </div>
            )}

            {transfer.remarks && (
              <div className="mb-3 p-2 bg-yellow-50 rounded text-sm">
                <p className="text-yellow-900">
                  <span className="font-medium">Remarks:</span> {transfer.remarks}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => onView(transfer)}>
                View Details
              </Button>

              {transfer.status === 'pending' && (
                <>
                  <Button size="sm" variant="success" onClick={() => onApprove(transfer)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onReject(transfer)}>
                    Reject
                  </Button>
                </>
              )}

              {transfer.status === 'approved' && (
                <Button size="sm" onClick={() => onDispatch(transfer)}>
                  Mark as Dispatched
                </Button>
              )}

              {transfer.status === 'dispatched' && (
                <Button size="sm" variant="success" onClick={() => onReceive(transfer)}>
                  Confirm Receipt
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StockTransferList;