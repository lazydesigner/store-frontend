import React from 'react';
import { Package, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const stockStatus = product.stock < 10 ? 'danger' : product.stock < 20 ? 'warning' : 'success';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Product Image */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-48 flex items-center justify-center">
        <Package className="h-20 w-20 text-blue-600" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* SKU & Status */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-500">{product.sku}</span>
          <Badge variant={product.is_active ? 'success' : 'secondary'} size="sm">
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
          {product.name}
        </h3>

        {/* Type & Company */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{product.productType.name}</span>
          <span className="font-medium">{product.company.name}</span>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Price Range</p>
          <p className="text-sm font-semibold text-gray-900">
            ₹{product.min_price.toLocaleString()} - ₹{product.max_price.toLocaleString()}
          </p>
        </div>

        {/* Stock */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Stock</span>
            <Badge variant={stockStatus} size="sm">
              {product.inventory[0]?.quantity || 0} units
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                stockStatus === 'success' ? 'bg-green-500' :
                stockStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(product)} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 hover:bg-blue-50 rounded text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 hover:bg-red-50 rounded text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;