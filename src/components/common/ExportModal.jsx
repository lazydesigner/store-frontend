import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';
import DatePicker from './DatePicker';
import { useNotification } from '../../context/NotificationContext';
import exportService from '../../services/exportService';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  title = 'Export Data',
  exportFunction,
  showDateRange = false,
  showFilters = true,
  filters = [],
  moduleName = 'data'
}) => {
  const [format, setFormat] = useState('excel');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const { success, error: showError } = useNotification();

  const handleExport = async () => {
    // Validate date range if required
    if (showDateRange && (!dateRange.from || !dateRange.to)) {
      showError('Please select date range');
      return;
    }

    setExporting(true);
    try {
      const params = {
        ...selectedFilters,
        ...(showDateRange && {
          from_date: dateRange.from,
          to_date: dateRange.to
        })
      };

      await exportService.exportProducts(params, format);
      
      setExportSuccess(true);
      success(`${moduleName} exported successfully`);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      //console.log(error)
      showError(`Failed to export ${moduleName}`);
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV (.csv)', icon: FileText }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      {exportSuccess ? (
        <div className="text-center py-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Export Successful!</h3>
          <p className="text-gray-600">Your file is being downloaded...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    onClick={() => setFormat(option.value)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      format === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${
                      format === option.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          {showDateRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="From Date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="mb-0"
                />
                <DatePicker
                  label="To Date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  min={dateRange.from}
                  className="mb-0"
                />
              </div>
            </div>
          )}

          {/* Additional Filters */}
          {showFilters && filters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filters (Optional)
              </label>
              <div className="space-y-3">
                {filters.map((filter) => (
                  <Select
                    key={filter.name}
                    label={filter.label}
                    value={selectedFilters[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    options={[
                      { value: '', label: `All ${filter.label}` },
                      ...filter.options
                    ]}
                    className="mb-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Export Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The exported file will include all records matching your filters.
              {showDateRange && ' Please ensure you have selected the correct date range.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              icon={Download} 
              onClick={handleExport}
              loading={exporting}
            >
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ExportModal;