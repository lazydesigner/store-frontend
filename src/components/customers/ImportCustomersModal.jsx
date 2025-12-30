import { useState } from 'react';
import customerService from '../../services/customerService';
import { downloadCustomerTemplate, parseCSV, validateProductData } from '../../utils/excelTemplates';
import Button from '../common/Button';
import { X, Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const ImportCustomersModal = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [importId, setImportId] = useState(null);

    
  const { success, error } = useNotification();
    const [loading, setLoading] = useState(false);
 

    const handlePreview = async () => {
        if (!file) return;

        setLoading(true);
        try {
            // Parse CSV file
            const data = await customerService.previewImport(file);

            if(data){
                setPreviewData(data);
                setImportId(data.import_id);

                if (data.summary.error_rows > 0) {
                error(`Found ${data.summary.error_rows} errors in import file`);
                } else {
                success('File validated successfully!');
                }
            } 

        } catch (error) {
            alert('Error parsing file: ' + error.message);
            console.error('Preview error:', error);
        } finally {
            setLoading(false);
        }
    }; 

    const handleClose = () => {
        setFile(null);
        setPreviewData(null);
        setImportId(null);
        onClose();
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
            'application/csv',
            'text/plain'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            alert('Please upload an Excel file (.xlsx or .xls)');
            return;
        }

        setFile(selectedFile);
        setPreviewData(null);
        setImportId(null);
    };
 

    const handleCommit = async () => {
        if (!importId) {
            alert('No import to commit');
            return;
        }
        const data = await customerService.commitImport(importId)
        if(data.success_count > 0){
            setFile(null);
            setPreviewData(null);
            setImportId(null);
            onClose();
        }
        //console.log(data)
    };

    const handleDownloadTemplate = async () => { 
        downloadCustomerTemplate()
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Import Customers</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Download Template */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Step 1: Download Template</h3>
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            <Download size={20} />
                            Download Excel Template
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                            Download the template, fill it with your customer data, and upload it below.
                        </p>
                    </div>

                    {/* Step 2: Upload File */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Step 2: Upload File</h3>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-600 mb-2">
                                Drag and drop your Excel file here, or
                            </p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                                    className="hidden"
                                />
                                <span className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                                    Browse Files
                                </span>
                            </label>
                            {file && (
                                <p className="mt-4 text-sm text-gray-600">
                                    Selected: <strong>{file.name}</strong>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Preview */}
                    {file && !previewData && (
                        <div className="mb-6">
                            <Button
              onClick={handlePreview}
              disabled={!file}
              loading={loading}
            >
              Preview Import
            </Button>
                        </div>
                    )}

                    {/* Preview Results */}
                    {previewData && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-4">Step 3: Review & Import</h3>

                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-blue-50 p-4 rounded">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {previewData.summary.total_rows}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Rows</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded">
                                    <div className="text-2xl font-bold text-green-600">
                                        {previewData.summary.valid_rows}
                                    </div>
                                    <div className="text-sm text-gray-600">Valid</div>
                                </div>
                                <div className="bg-red-50 p-4 rounded">
                                    <div className="text-2xl font-bold text-red-600">
                                        {previewData.summary.error_rows}
                                    </div>
                                    <div className="text-sm text-gray-600">Errors</div>
                                </div>
                            </div>

                            {/* Validation Results */}
                            <div className="border rounded max-h-96 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Row</th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Phone</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Errors</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.validation_results.map((result, index) => (
                                            <tr
                                                key={index}
                                                className={result.status === 'error' ? 'bg-red-50' : 'hover:bg-gray-50'}
                                            >
                                                <td className="px-4 py-2 border-t">{result.row}</td>
                                                <td className="px-4 py-2 border-t">{result.data.name}</td>
                                                <td className="px-4 py-2 border-t">{result.data.phone}</td>
                                                <td className="px-4 py-2 border-t">
                                                    {result.status === 'valid' ? (
                                                        <span className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle size={16} />
                                                            Valid
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-red-600">
                                                            <AlertCircle size={16} />
                                                            Error
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border-t">
                                                    {result.errors && (
                                                        <ul className="text-red-600 text-xs">
                                                            {result.errors.map((err, i) => (
                                                                <li key={i}>• {err}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Import Button */}
                            <div className="mt-4">
                                {previewData.can_proceed ? (
                                    <button
                                        onClick={handleCommit}
                                        // disabled={commitMutation.isLoading}
                                        className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                    >Importing
                                        {/* {commitMutation.isLoading
                                            ? 'Importing...'
                                            : `Import  Customers`} */}
                                    </button>
                                ) : (
                                    <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
                                        <p className="font-semibold">Cannot proceed with import</p>
                                        <p className="text-sm mt-1">
                                            Please fix the errors in your Excel file and try again.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportCustomersModal;