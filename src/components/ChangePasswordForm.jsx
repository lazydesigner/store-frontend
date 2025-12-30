import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const changePasswordMutation = useMutation(
    (data) => authService.changePassword(data.oldPassword, data.newPassword),
    {
      onSuccess: () => {
        toast.success('Password changed successfully!');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to change password');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          value={formData.oldPassword}
          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-gray-500">
          At least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="show-passwords"
          type="checkbox"
          checked={showPasswords}
          onChange={(e) => setShowPasswords(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="show-passwords" className="ml-2 block text-sm text-gray-700">
          Show passwords
        </label>
      </div>

      <button
        type="submit"
        disabled={changePasswordMutation.isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;