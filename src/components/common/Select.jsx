// import React from 'react';
// import { ChevronDown } from 'lucide-react';

// const Select = ({
//   label,
//   name,
//   value,
//   onChange,
//   onBlur,
//   options = [],
//   placeholder = 'Select an option',
//   error,
//   disabled = false,
//   required = false,
//   helperText,
//   className = '',
//   ...props
// }) => {
//   const selectClasses = `w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
//     error 
//       ? 'border-red-500 focus:ring-red-500' 
//       : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
//   } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}`;

//   return (
//     <div className={`mb-4 ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
      
//       <div className="relative">
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           onBlur={onBlur}
//           disabled={disabled}
//           required={required}
//           className={selectClasses}
//           {...props}
//         >
//           <option value="">{placeholder}</option>
//           {options.map((option, index) => (
//             <option 
//               key={option.value || index} 
//               value={option.value}
//               disabled={option.disabled}
//             >
//               {option.label}
//             </option>
//           ))}
//         </select>
        
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
//           <ChevronDown className="h-5 w-5" />
//         </div>
//       </div>
      
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
      
//       {helperText && !error && (
//         <p className="mt-1 text-sm text-gray-500">{helperText}</p>
//       )}
//     </div>
//   );
// };

// export default Select;


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  helperText,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  // Detect searchable mode
  const isSearchable = useMemo(
    () => options.some(o => typeof o.searchText === 'string'),
    [options]
  );

  // Selected label
  const selectedOption = options.find(o => String(o.value) === String(value));

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !query) return options;

    return options.filter(o =>
      o.searchText?.includes(query.toLowerCase())
    );
  }, [query, options, isSearchable]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setOpen(false);
    setQuery('');
  };

  return (
    <div className={`mb-4 ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* INPUT FIELD */}
      <div
        className={`relative border rounded-lg px-4 py-2 flex items-center cursor-pointer bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled && 'bg-gray-100 cursor-not-allowed'}`}
        onClick={() => !disabled && setOpen(true)}
      >
        <input
          type="text"
          disabled={disabled}
          value={
            open
              ? query
              : selectedOption?.label || ''
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-sm"
        />

        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </div>

      {/* DROPDOWN */}
      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-auto bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}

          {filteredOptions.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                String(option.value) === String(value)
                  ? 'bg-blue-100 font-medium'
                  : ''
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* ERROR / HELPER */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
