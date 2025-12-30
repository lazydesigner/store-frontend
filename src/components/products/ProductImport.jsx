import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';
import { downloadProductTemplate, parseCSV, validateProductData } from '../../utils/excelTemplates';
import productService from '../../services/productService';

const ProductImport = ({ onImport, onClose }) => {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1); // 1: upload, 2: preview, 3: result
  const [previewData, setPreviewData] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleDownloadTemplate = () => {
    // Download CSV template directly in browser
    downloadProductTemplate();
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // Parse CSV file
      const { headers, data } = await parseCSV(file);
      
      // Validate data
      const errors = validateProductData(data);
      
      setPreviewData({
        totalRows: data.length,
        validRows: data.length - errors.length,
        invalidRows: errors.length,
        errors: errors,
        sample: data.slice(0, 5), // Show first 5 rows
        allData: data,
        headers: headers
      });
      
      setStep(2);
    } catch (error) {
      alert('Error parsing file: ' + error.message);
      console.error('Preview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setLoading(true);
    try {
      // Filter out invalid rows
      const validData = previewData.allData.filter((row, index) => {
        const rowNumber = index + 2;
        return !previewData.errors.some(err => err.row === rowNumber);
      });

      const a = await productService.importProducts(file)
      //console.log(a)
      // Simulate import
      await new Promise(resolve => setTimeout(resolve, 2000));

      setImportResult({
        success: true,
        imported: validData.length,
        failed: previewData.invalidRows,
        message: `${validData.length} products imported successfully${previewData.invalidRows > 0 ? `, ${previewData.invalidRows} failed` : ''}`
      });
      setStep(3);

      // Call parent callback
      if (onImport) {
        onImport({ success: true, count: validData.length, data: validData });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed: ' + error.message
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="space-y-6">
      {/* Step 1: Upload */}
      {step === 1 && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Import Instructions
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Download the CSV template file first</li>
              <li>Fill in all required fields (Name, SKU, Type, Company, Prices)</li>
              <li>Ensure SKUs are unique</li>
              <li>Price values should be numbers without currency symbols</li>
              <li>Upload the completed CSV file</li>
            </ul>
          </div>

          <Button
            variant="outline"
            fullWidth
            icon={Download}
            onClick={handleDownloadTemplate}
          >
            Download Template (CSV)
          </Button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p className="text-yellow-800">
              <strong>Template Format:</strong> The template will download as a CSV file with sample data. 
              You can open it in Excel or Google Sheets.
            </p>
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".csv,.xlsx,.xls"
            label="Upload Product File"
            helperText="CSV, Excel files accepted (Max 5MB)"
          />

          {file && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                File selected: <strong>{file.name}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePreview}
              disabled={!file}
              loading={loading}
            >
              Preview Import
            </Button>
          </div>
        </>
      )}

      {/* Step 2: Preview */}
      {step === 2 && previewData && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-blue-600">{previewData.totalRows}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Valid Rows</p>
              <p className="text-2xl font-bold text-green-600">{previewData.validRows}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Invalid Rows</p>
              <p className="text-2xl font-bold text-red-600">{previewData.invalidRows}</p>
            </div>
          </div>

          {previewData.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              <h4 className="font-medium text-red-900 mb-2">Errors Found:</h4>
              <div className="space-y-1">
                {previewData.errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-sm text-red-800">
                    Row {error.row}, Column "{error.column}": {error.message}
                  </p>
                ))}
                {previewData.errors.length > 10 && (
                  <p className="text-sm text-red-700 font-medium">
                    ... and {previewData.errors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sample Data Preview (First 5 rows):</h4>
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">SKU</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Min Price</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Max Price</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.sample.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 font-mono">{row.sku}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{row.product_type}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">₹{Number(row.min_price || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">₹{Number(row.max_price || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{row.quantity || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {previewData.validRows > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <CheckCircle className="h-4 w-4 inline mr-2" />
              <strong>{previewData.validRows} products</strong> are ready to import.
              {previewData.invalidRows > 0 && (
                <span> Invalid rows will be skipped.</span>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={handleConfirmImport}
              loading={loading}
              disabled={previewData.validRows === 0}
            >
              Confirm & Import {previewData.validRows} Products
            </Button>
          </div>
        </>
      )}

      {/* Step 3: Result */}
      {step === 3 && importResult && (
        <>
          <div className="text-center py-8">
            {importResult.success ? (
              <>
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h3>
                <p className="text-gray-600">{importResult.message}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Imported</p>
                    <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <X className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Import Failed</h3>
                <p className="text-gray-600">{importResult.message}</p>
              </>
            )}
          </div>

          <div className="flex justify-center pt-4 border-t">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImport;