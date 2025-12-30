import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { validators, validateForm } from '../../utils/validators';
import { useNotification } from '../../context/NotificationContext';
import roleService from '../../services/roleService';

function convertToRoleOptions(roles) {
  return roles.map(role => ({
    value: String(role.id),
    label: role.name
  }));
}

const EmployeeForm = ({ roles = [], employee = null, onSubmit, onCancel }) => {
  const { success, error } = useNotification();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    username: employee?.username || '',
    phone: employee?.phone || '',
    email: employee?.email || '',
    password: '',
    confirmPassword: '',
    role_ids: employee?.roleId || '',
    photo: employee?.photo || '',
    accountNo: employee?.accountNo || '',
    starRating: employee?.starRating || '',
    employeeAddress: employee?.employeeAddress || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    is_active: employee?.isActive ?? true
  }); 

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showStarRating, setShowStarRating] = useState(false);

  // Check if selected role is Sales or Manager
  useEffect(() => {
    if (formData.role_ids && roles.length > 0) {
      const selectedRole = roles.find(role => String(role.id) === String(formData.role_ids));
      if (selectedRole) {
        const roleName = selectedRole.name.toLowerCase();
        setShowStarRating(roleName === 'sales' || roleName === 'manager');
      }
    } else {
      setShowStarRating(false);
    }
  }, [formData.role_ids, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 
    if (name.startsWith('employee.')) { 
      const [addressType, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [`${addressType}Address`]: {
          ...prev[`${addressType}Address`],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Please upload a valid image file (JPEG, PNG, or GIF)' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size should be less than 5MB' }));
        return;
      }

      // Convert to base64 or handle file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
        setErrors(prev => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const rules = {
      name: [(v) => validators.required(v, 'Employee name')],
      username: [validators.username],
      phone: [validators.phone],
      email: [validators.email],
      role_ids: [(v) => validators.required(v, 'Role')],
      accountNo: [(v) => validators.required(v, 'Account Number')]
    };

    // Validate star rating only if role is Sales or Manager
    if (showStarRating) {
      rules.starRating = [(v) => validators.required(v, 'Star Rating')];
    }

    // Only validate password for new employees
    if (!employee) {
      rules.password = [validators.password];
      rules.confirmPassword = [(v) => validators.required(v, 'Confirm password')];
    } else if (formData.password) {
      rules.password = [validators.password];
      rules.confirmPassword = [(v) => validators.required(v, 'Confirm password')];
    }

    const { isValid, errors: validationErrors } = validateForm(formData, rules);

    // Check password match
    if (formData.password && formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      let dataToSubmit = {}

      if (employee?.id) {
        dataToSubmit = {
          ...formData,
          id: employee?.id || null
        };
      } else {
        dataToSubmit = { ...formData };
      }

      delete dataToSubmit.confirmPassword;

      // Don't send password if not changed (for updates)
      if (employee && !formData.password) {
        delete dataToSubmit.password;
      }

      // Remove star rating if not applicable
      if (!showStarRating) {
        delete dataToSubmit.starRating;
      }

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = convertToRoleOptions(roles);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          error={errors.name}
          required
        />

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="username"
          error={errors.username}
          required
          disabled={!!employee}
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile"
          error={errors.phone}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="employee@email.com"
          error={errors.email}
        />

        <Input
          label="Account Number"
          name="accountNo"
          value={formData.accountNo}
          onChange={handleChange}
          placeholder="Enter account number"
          error={errors.accountNo}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          {errors.photo && (
            <p className="text-sm text-red-600">{errors.photo}</p>
          )}
          {formData.photo && (
            <div className="mt-2">
              <img
                src={formData.photo}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <Input
          label={employee ? "New Password (leave blank to keep current)" : "Password"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters"
          error={errors.password}
          required={!employee}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          required={!employee || !!formData.password}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
        <div className="space-y-4">
          <Input
            label="Address Line 1"
            name="employee.line1"
            value={formData.employeeAddress.line1}
            onChange={handleChange}
            placeholder="Street, Building, Area"
          />

          <Input
            label="Address Line 2"
            name="employee.line2"
            value={formData.employeeAddress.line2}
            onChange={handleChange}
            placeholder="Landmark (Optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="employee.city"
              value={formData.employeeAddress.city}
              onChange={handleChange}
              placeholder="City"
            />

            <Input
              label="State"
              name="employee.state"
              value={formData.employeeAddress.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="PIN Code"
              name="employee.pincode"
              value={formData.employeeAddress.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN"
            />

            <Input
              label="Country"
              name="employee.country"
              value={formData.employeeAddress.country}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Role"
          name="role_ids"
          value={formData.role_ids}
          onChange={handleChange}
          options={roleOptions}
          error={errors.role_ids}
          required
          className="md:col-span-2"
        />

        {showStarRating && (
          <Select
            label="Star Rating"
            name="starRating"
            value={formData.starRating}
            onChange={handleChange}
            options={[
              { value: '1', label: '⭐ 1 Star' },
              { value: '2', label: '⭐⭐ 2 Stars' },
              { value: '3', label: '⭐⭐⭐ 3 Stars' },
              { value: '4', label: '⭐⭐⭐⭐ 4 Stars' },
              { value: '5', label: '⭐⭐⭐⭐⭐ 5 Stars' }
            ]}
            error={errors.starRating}
            required
            className="md:col-span-2"
          />
        )}
      </div>

      <div className="pt-4 border-t">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Mark as active</span>
        </label>
      </div>

      <div className="pt-4 text-xs text-red-500">
        <ul className='list-disc ml-4'>
          <li>Phone Number Must be unique</li>
          <li>Username Must be unique</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {employee ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;