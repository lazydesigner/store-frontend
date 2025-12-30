import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Search, Filter, Edit, Trash2, Eye, Warehouse } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import ProductImport from '../components/products/ProductImport';
import ProductWarehouseInventory from '../components/products/ProductWarehouseInventory';
import { useNotification } from '../context/NotificationContext';
import companyService from '../services/companyService';
import productService from '../services/productService';
import ExportModal from '../components/common/ExportModal';
import ExportButton from '../components/common/ExportButton';
import { exportService } from '../services/exportService';

function convertProductTypes(apiData) {
  return apiData?.map(item => ({ 
    value: item.name,
    label: item.name
  }));
}

const Products = () => {
  const { success, error } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [companyOptions, setcompanyOptions] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [typeOptions, settypeOptions] = useState([]);

  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetchPro()
  }, []);

  const fetchPro = async () => {
    try {
      const [companyResponse, fetchedProductsType, fetchedProducts] = await Promise.all([
        companyService.getAllCompanies(),
        productService.getProductTypes(),
        productService.getAllProducts()
      ])
      settypeOptions(() => convertProductTypes(fetchedProductsType.data))
      setcompanyOptions(() => convertProductTypes(companyResponse.data))

      setProducts(fetchedProducts.data?.map((item) => ({
        id: item.id,
        sku: item.sku,
        company_id: item.company_id,
        name: item.name,
        type: item.productType.name,
        product_type_id: item.product_type_id,
        company: item.company.name,
        hsn_code: item.hsn_code,
        min_price: item.min_price,
        max_price: item.max_price,
        totalStock: item.totalStock, // Sum across all warehouses
        warehouses: item.warehouseCount, // Number of warehouses
        isActive: item.is_active,
        inventory: item.inventory,
        updated_at: item.updated_at
      })))

      setInventoryData(fetchedProducts.data.inventory?.map((item) => ({
        id: item.id,
        warehouseId: item.warehouse.id,
        warehouseName: item.warehouse.name,
        warehouseCode: item.warehouse.code,
        quantity: item.quantity,
        reorderLevel: item.reorder_level,        
        lastRestockedAt: item.last_restocked_at
      })));

      //console.log(fetchedProducts.data)

    } catch (err) {
      //console.log(err)
      error('Failed to load products type');
    }
  }

  const filteredCustomers = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.includes(searchQuery) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product) => { 
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = async (productData) => {

    if (productData?.id) {

      const id = productData?.id

      delete productData.id;
      delete productData.sku;
      const newProduct = await productService.updateProduct(id, productData);
      // //console.log('Created product:', newProduct);  
      success('Product Updated successfully');
      fetchPro()

    } else {
      const newProduct = await productService.createProduct(productData);
      // //console.log('Created product:', newProduct);  
      success('Product added successfully');
      fetchPro()
    }

    setShowAddModal(false);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {

      try {
        await productService.deleteProduct(product.id)
        success('Product Deleted Successfully')
      } catch (err) {
        error('Failed to Delete Product')
      }
      fetchPro()

      //console.log('Delete product:', product);
    }
  };

  const handleExport = async (params, format) => {
    // Add current filters to export params
    const exportParams = {
      ...params,
      search: searchQuery,
      type: selectedType,
      company: selectedCompany
    };

    await exportService.exportProducts(exportParams, format);
  };

  

  const handleImport = (result) => {

    if (result.success) {
      success(`Successfully imported ${result.count} products`);
      setShowImportModal(false);
      // Refresh products list here
      // fetchProducts();
    } else {
      error('Import failed');
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Id',
      sortable: true,
      render: (value) => <span className="font-mono text-sm text-gray-600">{value}</span>
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <span className="font-medium text-gray-900">{value}</span>
          <p className="text-xs text-gray-500">HSN: {row.hsn_code} ||  SKU: {row.sku}</p>
        </div>
      )
    },
    {
      key: 'inventory',
      label: 'Updated at', 
      render: (value) => <div className="space-y-1">
      {value.map((item, index) => (
        <span
          key={index}
          className="block font-mono text-sm text-gray-600"
        > <small className='font-semibold'>{item.warehouse.code}: </small>
          {new Date(item.last_restocked_at || item.created_at).toLocaleDateString()}
        </span>
      ))}
    </div>
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      render: (_, row) => (
        <span className="text-sm text-gray-900">
          ₹{row.min_price?.toLocaleString()} - ₹{row.max_price?.toLocaleString()}
        </span>
      )
    },
    {
      key: 'totalStock',
      label: 'Total Stock',
      sortable: true,
      render: (value, row) => (
        <div>
          <Badge variant={value < 30 ? 'danger' : value < 50 ? 'warning' : 'success'}>
            {value} units
          </Badge>
          <p className="text-xs text-gray-500 mt-1">{row.warehouses} warehouses</p>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row)}
            className="p-1 hover:bg-blue-50 rounded text-blue-600"
            title="View Inventory"
          >
            <Warehouse className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 hover:bg-yellow-50 rounded text-yellow-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 hover:bg-red-50 rounded text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory across warehouses</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Upload} onClick={() => setShowImportModal(true)}>
            Import
          </Button>
          <Button variant="outline" icon={Download} onClick={() => setShowExportModal(true)}>
            Export
          </Button>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Multi-Warehouse Support:</strong> Each product can be stored in multiple warehouses.
          SKU and HSN codes are unique per product, not per warehouse. Click the warehouse icon to manage inventory locations.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or SKU..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
          <Select
            placeholder="Filter by Type"
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
          <Select
            placeholder="Filter by Company"
            options={companyOptions}
            value={selectedCompany}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          /> 
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredCustomers}
          hover={true}
        />
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm
          mode="create"
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="lg"
      >
        <ProductForm
          product={selectedProduct}
          mode="edit"
          onSubmit={handleAddProduct}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* View Warehouse Inventory Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); fetchPro() }}
        title={`Warehouse Inventory - ${selectedProduct?.name}`}
        size="xl"
      >
        <ProductWarehouseInventory product={selectedProduct} inventoryData={inventoryData} />
      </Modal>

      {/* Export Model */}
      <ExportModal
        isOpen={showExportModal}
        onImport={(result) => {
          //console.log('Import result:', result);
          setShowExportModal(false);
        }}
        onClose={() => setShowExportModal(false)}
      />

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Products"
        size="lg"
      >
        <ProductImport
          onImport={(result) => {
            //console.log('Import result:', result);
            setShowImportModal(false);
          }}
          onClose={() => setShowImportModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Products;