import React from 'react';
import { CheckCircle, Clock, Package, Truck, MapPin } from 'lucide-react';
// import 

const DeliveryTracking = ({ delivery, events = [] }) => {
  const statusIcons = {
    new: Package,
    processing: Clock,
    ready_to_ship: Package,
    out_for_delivery: Truck,
    delivered: CheckCircle,
    cancelled: MapPin,
    failed: MapPin
  };

  const statusColors = {
    new: 'text-gray-400',
    processing: 'text-yellow-500',
    ready_to_ship: 'text-blue-500',
    out_for_delivery: 'text-orange-500',
    delivered: 'text-green-500',
    cancelled: 'text-red-500',
    failed: 'text-red-500'
  }; 

  // const timeLine = 

  //console.log('Events in Tracking:', events);

  const defaultEvents = [
    { status: 'Order Received', time: '10:30 AM', completed: true, date: '2025-11-01' },
    { status: 'Processing', time: '11:00 AM', completed: true, date: '2025-11-01' },
    { status: 'Ready to Ship', time: '01:00 PM', completed: true, date: '2025-11-01' },
    { status: 'Out for Delivery', time: '02:30 PM', completed: true, date: '2025-11-01' },
    { status: 'Delivered', time: 'Pending', completed: false, date: '' }
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="font-semibold text-gray-900">{delivery.orderNo}</p>
        <p className="text-sm text-gray-600">{delivery.customer}</p>
      </div>

      <div className="relative">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex items-start mb-8 last:mb-0">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              true ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {true ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              )}
            </div>

            {index < timelineEvents.length - 1 && (
              <div className={`absolute left-5 w-0.5 h-8 ${
                true ? 'bg-green-500' : 'bg-gray-300'
              }`} style={{ top: `${index * 116 + 40}px` }}></div>
            )}

            <div className="ml-4 flex-1">
              <p className="font-medium text-gray-900">{event.status}</p>
              <p className="text-sm text-gray-500">{new Date(event.event_time).toISOString().split('T')[0]}</p>
              {event.event_time && <p className="text-xs text-gray-400 mt-1">{new Date(event.event_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</p>}
              {event.remarks && (
                <p className="text-xs text-gray-600 mt-1 italic">{event.remarks}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {delivery.assignedTo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            <strong>Delivery Person:</strong> {delivery.assignedTo}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;