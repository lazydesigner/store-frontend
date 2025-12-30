import React from 'react';
import { AlertCircle, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const LowStockAlert = ({ items = [] }) => {
  return (
    <Card 
      title="Low Stock Alert" 
      headerActions={
        <Badge variant="danger">
          <AlertCircle className="h-3 w-3 mr-1" />
          {items.length}
        </Badge>
      }
    >
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>All products are well stocked</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  {item.stock === 0 && (
                    <Badge variant="danger" size="sm">Out of Stock</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.sku}</p>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.stock === 0 ? 'bg-red-500' : 
                          item.stock < 5 ? 'bg-red-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 whitespace-nowrap">
                    {item.stock}/{item.minStock}
                  </div>
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className={`flex items-center justify-end space-x-1 ${
                  item.stock === 0 ? 'text-red-600' : 'text-orange-600'
                }`}>
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    {item.stock === 0 ? 'Out' : `${item.stock} left`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.warehouse}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default LowStockAlert;