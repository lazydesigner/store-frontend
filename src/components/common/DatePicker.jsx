import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  min,
  max,
  error,
  disabled = false,
  required = false,
  helperText,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <Calendar className="h-5 w-5" />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default DatePicker;