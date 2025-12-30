import { apiService } from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  // Login
  login: async (username, password) => { 

    const response = await apiService.post('/auth/login', {
      username,
      password
    }); 

    const { accessToken, refreshToken, user } = response;

    // Store tokens and user data
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return response;

  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null; 
  },

  // Check if user is authenticated
  // isAuthenticated: () => {
  //   return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  // },

  isAuthenticated: () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userRaw = localStorage.getItem('user_data');

  if (!token || !userRaw) return false;

  const user = JSON.parse(userRaw);

  const isAdmin =
    user.roles?.includes('Admin') ||
    user.roles?.includes('Super Admin');

  // 🔐 Admin requires OTP verification
  if (isAdmin && user.otp_code !== null) {
    // logout(); // force logout
    return false;
  }

  return true;
},


  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const response = await apiService.post('/auth/refresh', {
      refreshToken
    });

    const { accessToken } = response;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);

    return response;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    return apiService.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
  }, 

  // NEW: Forgot password
  forgotPassword: async (emailOrUsername) => {
    const payload = emailOrUsername.includes('@')
      ? { email: emailOrUsername }
      : { username: emailOrUsername };
    
    const response = await apiService.post('/auth/forgot-password', payload);
    return response;
  },

  // NEW: Verify reset token
  verifyResetToken: async (token) => {
    const response = await apiService.post('/auth/verify-reset-token', { token });
    return response;
  },

  // NEW: Reset password
  resetPassword: async (token, newPassword) => {
    const response = await apiService.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response;
  }, 

   verifyOTP: async (deliveryId, otp) => {
    return apiService.post(`/auth/${deliveryId}/verify-otp`, {
      otp: otp
    });
  },
  // Resend OTP
  resendOTP: async (deliveryId) => {
    return apiService.post(`/auth/${deliveryId}/resend-otp`);
  },

  // Check user permissions
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },

  // Check if user has any of the permissions
  hasAnyPermission: (permissions) => {
    const user = authService.getCurrentUser();
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  },

  // Check if user has all permissions
  hasAllPermissions: (permissions) => {
    const user = authService.getCurrentUser();
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }
};

export default authService;