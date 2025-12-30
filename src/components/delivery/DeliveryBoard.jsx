import React from 'react';
import DeliveryCard from './DeliveryCard';
import Card from '../common/Card';

const DeliveryBoard = ({ 
  deliveries = {}, 
  onAssign,
  onMarkReadyToShip,
  onMarkOutForDelivery,
  onTrack, 
  onVerifyOTP,
  onResendOTP
}) => {
  const { readyToShip = [], outForDelivery = [], delivered = [] } = deliveries;
  const userData = JSON.parse(localStorage.getItem('user_data'));
    const hasPermission = userData?.permissions?.includes('DELIVERY_ASSIGN');

    //console.log(userData.id)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ready to Ship (includes new, processing, ready_to_ship) */}

      
      {hasPermission ? (<><Card 
        title="Ready to Ship" 
        subtitle={`${readyToShip.length} orders`}
        headerClassName="bg-yellow-50" 
      >
        <div className="space-y-3">
          {readyToShip.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending deliveries</p>
          ) : (
            readyToShip.map((delivery) => (
              
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={onAssign}
                onMarkReadyToShip={onMarkReadyToShip}
                onMarkOutForDelivery={onMarkOutForDelivery}
                onTrack={onTrack}
                onVerifyOTP={onVerifyOTP}
                onResendOTP={onResendOTP}
              /> 
            ))
          )}
        </div>
      </Card></>) : (<></>)}
      
      

      {/* Out for Delivery */}
      <Card 
        title="Out for Delivery" 
        subtitle={`${userData?.roles?.includes('Admin') ? outForDelivery.length : ''} active`}
        headerClassName="bg-orange-50"
      >
        <div className="space-y-3">
          {outForDelivery.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active deliveries</p>
          ) : (
            outForDelivery.map((delivery) => ( 
              (delivery.assigned_employee_id == userData.id || userData?.roles?.includes('Admin')) ?
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={onAssign}
                onMarkReadyToShip={onMarkReadyToShip}
                onMarkOutForDelivery={onMarkOutForDelivery}
                onTrack={onTrack}
                onVerifyOTP={onVerifyOTP}
                onResendOTP={onResendOTP}
              />
              : ''
            ))
          )}
        </div>
      </Card>

      {/* Delivered */}
      <Card 
        title="Delivered Today" 
        subtitle={`${userData?.roles?.includes('Admin') ? delivered.length : ''} completed`}
        headerClassName="bg-green-50"
      >
        <div className="space-y-3">
          {delivered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No deliveries today</p>
          ) : (
            delivered.map((delivery) => (
              (delivery.assigned_employee_id == userData.id || userData?.roles?.includes('Admin')) ?
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={onAssign}
                onMarkReadyToShip={onMarkReadyToShip}
                onMarkOutForDelivery={onMarkOutForDelivery}
                onTrack={onTrack}
                onVerifyOTP={onVerifyOTP}
                onResendOTP={onResendOTP}
              />
              : ''
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default DeliveryBoard;