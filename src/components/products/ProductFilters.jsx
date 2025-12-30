import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ProductFilters = ({ filters, onFilterChange, onClear }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClear = () => {
    const clearedFilters = {
      type: '',
      company: '',
      minPrice: '',
      maxPrice: '',
      stockStatus: '',
      status: ''
    };
    setLocalFilters(clearedFilters);
    if (onClear) {
      onClear();
    }
  };

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
    setShowAdvanced(false);
  };

  const productTypes = [
    { value: '', label: 'All Types' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'television', label: 'Television' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const companies = [
    { value: '', label: 'All Companies' },
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'lg', label: 'LG' },
    { value: 'sony', label: 'Sony' },
    { value: 'oneplus', label: 'OnePlus' }
  ];

  const stockStatuses = [
    { value: '', label: 'All Stock' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const activeFilterCount = Object.values(localFilters).filter(v => v !== '' && v !== null && v !== undefined).length;

  return (
    <>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          icon={Filter}
          onClick={() => setShowAdvanced(true)}
        >
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Modal
        isOpen={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        title="Advanced Filters"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Product Type"
            value={localFilters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            options={productTypes}
          />

          <Select
            label="Company"
            value={localFilters.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            options={companies}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Price (₹)"
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="0"
            />

            <Input
              label="Max Price (₹)"
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="1000000"
            />
          </div>

          <Select
            label="Stock Status"
            value={localFilters.stockStatus || ''}
            onChange={(e) => handleChange('stockStatus', e.target.value)}
            options={stockStatuses}
          />

          <Select
            label="Product Status"
            value={localFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statuses}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={handleClear}>
              Clear All
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductFilters;