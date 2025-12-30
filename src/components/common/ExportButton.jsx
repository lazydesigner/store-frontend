import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import Button from './Button';
import { useNotification } from '../../context/NotificationContext';

const ExportButton = ({ 
  onExport,
  formats = ['excel', 'csv'],
  loading = false,
  size = 'md',
  variant = 'outline',
  showDropdown = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success, error } = useNotification();

  const handleExport = async (format) => {
    setIsOpen(false);
    setExporting(true);

    //console.log(format)
    
    try {
      await onExport(format);
      success(`Export completed successfully`);
    } catch (err) {
      error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const formatOptions = [
    { 
      value: 'excel', 
      label: 'Export as Excel', 
      icon: FileSpreadsheet,
      color: 'text-green-600'
    },
    { 
      value: 'csv', 
      label: 'Export as CSV', 
      icon: FileText,
      color: 'text-blue-600'
    },
    { 
      value: 'pdf', 
      label: 'Export as PDF', 
      icon: FileText,
      color: 'text-red-600'
    }
  ].filter(option => formats.includes(option.value));

  if (!showDropdown || formatOptions.length === 1) {
    // Single format - direct export button
    return (
      <Button
        size={size}
        variant={variant}
        icon={Download}
        onClick={() => handleExport(formatOptions[0].value)}
        loading={exporting || loading}
      >
        Export
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        size={size}
        variant={variant}
        onClick={() => setIsOpen(!isOpen)}
        loading={exporting || loading}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleExport(option.value)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Icon className={`h-5 w-5 ${option.color}`} />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;