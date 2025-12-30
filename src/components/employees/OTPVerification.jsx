import React, { useState, useRef, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

const OTPVerification = ({ delivery, onVerify, onResend, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]); 

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      await onVerify(delivery.id, otpValue);
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend(delivery.id);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-blue-600" />
        </div> 
        <p className="text-sm text-gray-600">Admin Login</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter 6-digit OTP
        </label>
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          OTP sent to customer's phone: <strong>{delivery.phone}</strong>
        </p>
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <strong>{countdown}s</strong>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${resendLoading ? 'animate-spin' : ''}`} />
            Resend OTP
          </button>
        )}
      </div>

      <div className="flex space-x-3">
        <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          disabled={otp.join('').length !== 6}
        >
          Verify & Mark Delivered
        </Button>
      </div>
    </form>
  );
};

export default OTPVerification;