import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const DeliveryTimeline = ({ events = [], currentStatus }) => {
  const allStatuses = [
    { key: 'new', label: 'Order Received', icon: Circle },
    { key: 'processing', label: 'Processing', icon: Clock },
    { key: 'ready_to_ship', label: 'Ready to Ship', icon: CheckCircle },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Clock },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStatusIndex = (status) => {
    return allStatuses.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="relative">
      {allStatuses.map((status, index) => {
        const event = events.find(e => e.status === status.key);
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = status.icon;

        return (
          <div key={status.key} className="flex items-start mb-8 last:mb-0 relative">
            {/* Connector Line */}
            {index < allStatuses.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-full ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            )}

            {/* Status Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
              isCompleted 
                ? 'bg-green-500' 
                : isCurrent 
                  ? 'bg-blue-500 animate-pulse' 
                  : 'bg-gray-300'
            }`}>
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Status Details */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className={`font-semibold ${
                  isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-500'
                }`}>
                  {status.label}
                </p>
                {event && (
                  <span className="text-sm text-gray-500">{event.time}</span>
                )}
              </div>
              
              {event && (
                <>
                  {event.date && (
                    <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                  )}
                  {event.remarks && (
                    <p className="text-sm text-gray-600 mt-1 italic bg-gray-50 p-2 rounded">
                      {event.remarks}
                    </p>
                  )}
                  {event.employee && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>By:</strong> {event.employee}
                    </p>
                  )}
                </>
              )}

              {isCurrent && !event && (
                <p className="text-sm text-blue-600 mt-1 font-medium">In Progress...</p>
              )}

              {!isCompleted && !isCurrent && (
                <p className="text-sm text-gray-400 mt-1">Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryTimeline;