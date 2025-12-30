import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import DeliveryBoard from '../components/delivery/DeliveryBoard';
import DeliveryAssignment from '../components/delivery/DeliveryAssignment';
import DeliveryTracking from '../components/delivery/DeliveryTracking';
import OTPVerification from '../components/delivery/OTPVerification';
import { useNotification } from '../context/NotificationContext';
import deliveryService from '../services/deliveryService';
import employeeService from '../services/employeeService';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const { success, error } = useNotification();

  const handleAssign = (delivery) => {
    setSelectedDelivery(delivery);
    setShowAssignModal(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load deliveries from API (mocked here)
    const data = await deliveryService.getAllDeliveries();
    const employe = await employeeService.getDeliveryEmployees();
    setDeliveryPersons(employe.map(emp =>
      ({ id: emp.id, name: emp.name, activeDeliveries: emp.statistics.active })
    ))

  //console.log(data)

    setDeliveries(data.data.map(delivery => ({
      id: delivery.id,
      orderNo: delivery?.sale?.number,
      customer: delivery?.sale?.customer?.name,
      phone: delivery?.sale?.customer?.phone,
      address: delivery?.sale?.customer?.shipping_address
        ? `${delivery.sale.customer.shipping_address.line1}, ${delivery.sale.customer.shipping_address.line2}, ${delivery.sale.customer.shipping_address.city}, ${delivery.sale.customer.shipping_address.pincode}`
        : 'N/A',
      assignedTo: delivery?.assignedEmployee?.name || null,
      assigned_employee_id: delivery?.assigned_employee_id || null,
      status: delivery.status,
      date: new Date(delivery.created_at).toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      otp_expires_at: delivery.otp_expires_at ? delivery.otp_expires_at : null,
    })))
  };
  //console.log(deliveryPersons)

  const handleAssignSubmit = async (deliveryId, employeeId) => {
    // Update delivery status to 'processing' when assigned

    //console.log(employeeId)

    try {
      await deliveryService.assignDeliveryPerson(deliveryId, employeeId);
      setDeliveries(prev =>
        prev.map(d =>
          d.id === deliveryId
            ? { ...d, assignedTo: deliveryPersons.find(p => p.id == employeeId)?.name, status: 'processing' }
            : d
        )
      );
      success('Delivery person assigned successfully');
      setShowAssignModal(false);
    } catch (err) {
      error('Failed to assign delivery person');
    }

  };

  const handleMarkReadyToShip = async (delivery) => {

    try {
      await deliveryService.updateDeliveryStatus(delivery.id, 'ready_to_ship');

      setDeliveries(prev =>
        prev.map(d =>
          d.id === delivery.id
            ? { ...d, status: 'ready_to_ship' }
            : d
        )
      );
      success('Order marked as ready to ship');
    } catch (err) {
      error('Failed to update delivery status');
    }

  };

  const handleMarkOutForDelivery = async (delivery) => {

    try {
      await deliveryService.updateDeliveryStatus(delivery.id, 'out_for_delivery');

      setDeliveries(prev =>
        prev.map(d =>
          d.id === delivery.id
            ? { ...d, status: 'out_for_delivery' }
            : d
        )
      );
      success('Order is now out for delivery. OTP sent to customer.');
    } catch (err) {
      error('Failed to update delivery status');
    }

  };

  const handleTrack = async (delivery) => {
    setSelectedDelivery(delivery);
    
    const timeLine = await deliveryService.getDeliveryEvents(delivery.id);
    setTimelineEvents(timeLine.data);
    //console.log('Timeline Data:', timeLine);
    setShowTrackModal(true);
  };

  const handleVerifyOTP = (delivery) => {
    setSelectedDelivery(delivery);
    setShowOTPModal(true);
  };

  const handleOTPSubmit = async (deliveryId, otp) => {
    // Verify OTP (mock validation)
    try {
      await deliveryService.verifyOTP(deliveryId, otp);
      setDeliveries(prev =>
        prev.map(d =>
          d.id === deliveryId
            ? { ...d, status: 'delivered' }
            : d
        )
      );
      success('Delivery completed successfully!');
      setShowOTPModal(false);

    } catch (err) {
      error('Invalid OTP. Please try again.');
      throw new Error('Invalid OTP');
    };

  };

  const handleResendOTP = async (deliveryId) => {

    try {
      const a = await deliveryService.resendOTP(deliveryId);
      //console.log(a);

      success('OTP resent to customer');
    } catch (err) {
      error('Failed to resend OTP');
      return;
    } 
    //console.log('Resend OTP for delivery ID:', deliveryId);
  };

  // Filter deliveries by status
  const readyToShipDeliveries = deliveries.filter(d =>
    d.status === 'new' || d.status === 'processing' || d.status === 'ready_to_ship'
  );
  const outForDeliveryDeliveries = deliveries.filter(d => d.status === 'out_for_delivery');
  const deliveredToday = deliveries.filter(d => d.status === 'delivered');
 
  // Stats
  const stats = [
    {
      title: 'New Orders',
      value: deliveries.filter(d => d.status === 'new').length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Ready to Ship',
      value: deliveries.filter(d => d.status === 'ready_to_ship').length,
      icon: Package,
      color: 'bg-yellow-500'
    },
    {
      title: 'Out for Delivery',
      value: outForDeliveryDeliveries.length,
      icon: Truck,
      color: 'bg-orange-500'
    },
    {
      title: 'Delivered Today',
      value: deliveredToday.length,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  const userData = JSON.parse(localStorage.getItem('user_data'));
    const hasPermission = userData?.permissions?.includes('DELIVERY_ASSIGN');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
        <p className="text-gray-500 mt-1">Track and manage all deliveries</p>
      </div>

      {hasPermission ? (<>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div></>) : (<></>)}

      {/* Delivery Board */}
      <DeliveryBoard
        deliveries={{
          readyToShip: readyToShipDeliveries,
          outForDelivery: outForDeliveryDeliveries,
          delivered: deliveredToday
        }}
        onAssign={handleAssign}
        onMarkReadyToShip={handleMarkReadyToShip}
        onMarkOutForDelivery={handleMarkOutForDelivery}
        onTrack={handleTrack}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
      />

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Delivery Person"
        size="md"
      >
        {selectedDelivery && (
          <DeliveryAssignment
            delivery={selectedDelivery}
            employees={deliveryPersons}
            onAssign={handleAssignSubmit}
            onCancel={() => setShowAssignModal(false)}
          />
        )}
      </Modal>

      {/* Track Modal */}
      <Modal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        title="Delivery Tracking"
        size="md"
      >
        {selectedDelivery && (
          <DeliveryTracking delivery={selectedDelivery} events={timelineEvents} />
        )}
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        title="Verify OTP"
        size="sm"
      >
        {selectedDelivery && (
          <OTPVerification
            delivery={selectedDelivery} 
            onVerify={handleOTPSubmit}
            onResend={handleResendOTP}
            onCancel={() => setShowOTPModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Delivery;