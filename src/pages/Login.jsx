import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Package, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuthContext } from '../context/AuthContext';
import { validators } from '../utils/validators';

import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import authService from '../services/authService';
import OTPVerification from '../components/employees/OTPVerification';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const { success, error } = useNotification();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error message
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem('user_data'));

    const isAdmin =
      user?.roles?.includes('Admin')

    if (isAdmin && user.otp_code !== null) {
      setSelectedDelivery(() => ({
        id: user.id,
        phone: user.phone
      }))
      setShowOTPModal(true)
    }
  }, [])

  const validate = () => {
    const newErrors = {};

    const usernameError = validators.username(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }

    const passwordError = validators.password(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      //console.log(result)
      if (result.success) {

        const isAdmin = result.user.roles.includes('Admin') || result.user.roles.includes('Super Admin'); 

        if (isAdmin) {
          setSelectedDelivery(() => ({
            id: result.user.id,
            phone: result.user.phone
          }))

          setShowOTPModal(true)

        } else {
          if(result.user.roles.includes('Delivery')){
            navigate('/delivery');
          }else{
            navigate('/dashboard');
          }
          
        }
      } else {
        setErrorMessage(result.error || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (deliveryId, otp) => {
    // Verify OTP (mock validation)
    try {
      await authService.verifyOTP(deliveryId, otp);

      const userRaw = localStorage.getItem('user_data');

      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.otp_code = null;
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      success('Admin Login completed successfully!');
      setShowOTPModal(false);
      window.location.reload()

    } catch (err) {
      error('Invalid OTP. Please try again.');
      throw new Error('Invalid OTP');
    };

  };

  const handleResendOTP = async (deliveryId) => {

    try {
      const a = await authService.resendOTP(deliveryId);
      //console.log(a);

      success('OTP resent to customer');
    } catch (err) {
      error('Failed to resend OTP');
      return;
    }
    //console.log('Resend OTP for delivery ID:', deliveryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              {/* <Package className="h-10 w-10 text-blue-600" /> */}
              <img src="/logo.jpg" className=' rounded-full' style={{ width: "100px" }} alt="" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Friends Digital</h1>
            <p className="text-blue-100">Management System</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Please login to your account</p>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start animate-shake">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              error={errors.username}
              disabled={loading}
              required
              autoFocus
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon={LogIn}
              className="mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form> 
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Electronics Store Management. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

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

export default Login;