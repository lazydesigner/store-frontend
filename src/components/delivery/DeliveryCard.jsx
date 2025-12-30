import React from 'react';
import { Package, MapPin, User, Phone, Clock, CheckCircle, Truck } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const DeliveryCard = ({
  delivery,
  onAssign,
  onMarkReadyToShip,
  onMarkOutForDelivery,
  onTrack,
  onVerifyOTP,
  onResendOTP
}) => {
  const getStatusColor = (status) => {
    const colors = {
      new: 'secondary',
      processing: 'warning',
      ready_to_ship: 'info',
      out_for_delivery: 'warning',
      delivered: 'success',
      cancelled: 'danger',
      failed: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'New',
      processing: 'Processing',
      ready_to_ship: 'Ready to Ship',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      failed: 'Failed'
    };
    return labels[status] || status;
  };

  function isOtpExpired(expiry) {
    return new Date(expiry) <= new Date();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-blue-600">{delivery.orderNo}</p>
          <p className="text-sm text-gray-600 mt-1">{delivery.customer}</p>
        </div>
        <Badge variant={getStatusColor(delivery.status)} size="sm">
          {getStatusLabel(delivery.status)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{delivery.address}</span>
        </p>
        <p className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {delivery.phone}
        </p>
        {delivery.assignedTo && (
          <p className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {delivery.assignedTo}
          </p>
        )}
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {delivery.date}
        </p>
      </div>

      {/* Action Buttons based on Status */}
      <div className="space-y-2">
        {/* New Status - Assign Delivery Person */}
        {delivery.status === 'new' && (
          <Button
            size="sm"
            fullWidth
            onClick={() => onAssign(delivery)}
            icon={User}
          >
            Assign Delivery Person
          </Button>
        )}

        {/* Processing Status - Mark Ready to Ship */}
        {delivery.status === 'processing' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
              <p className="text-xs text-blue-800 flex items-center">
                <Package className="h-3 w-3 mr-1" />
                Assigned to {delivery.assignedTo}
              </p>
            </div>
            <Button
              size="sm"
              fullWidth
              onClick={() => onMarkReadyToShip(delivery)}
              variant="success"
              icon={Package}
            >
              Mark Ready to Ship
            </Button>
          </>
        )}

        {/* Ready to Ship Status - Send Out for Delivery */}
        {delivery.status === 'ready_to_ship' && (
          <>
            <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
              <p className="text-xs text-green-800 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready for pickup by {delivery.assignedTo}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTrack(delivery)}
              >
                Track
              </Button>
            <Button
              size="sm"
              fullWidth
              onClick={() => onMarkOutForDelivery(delivery)}
              icon={Truck}
            >
              Send Out for Delivery
            </Button>
            </div>
          </>
        )}

        {/* Out for Delivery Status - Track & Verify OTP */}
        {delivery.status === 'out_for_delivery' && (
          <>
            <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
              <p className="text-xs text-orange-800 flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                En route with {delivery.assignedTo}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTrack(delivery)}
              >
                Track
              </Button>

              {/* {
                isOtpExpired(delivery.otp_expires_at) ? (
                  <Button
                    size="sm"
                    onClick={() => onResendOTP(delivery.id)}
                    variant="warning"
                  >
                    Resend OTP
                  </Button>
                ) : ( */}
                  <Button
                    size="sm"
                    onClick={() => onVerifyOTP(delivery)}
                    variant="success"
                  >
                    Verify OTP
                  </Button>
                {/* )
              } */}


            </div>
          </>
        )}

        {/* Delivered Status */}
        {delivery.status === 'delivered' && (
          <div className="flex items-center justify-center text-green-600 text-sm font-medium py-2">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCard;