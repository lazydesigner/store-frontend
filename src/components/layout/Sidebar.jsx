import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  Shield,
  Building2, 
  Tag,
  ArrowRightLeft
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'DASHBOARD_VIEW' },
    { name: 'Products', icon: Package, path: '/products', permission: 'PRODUCT_VIEW' },
    { name: 'Product Types', icon: Tag, path: '/product-types', permission: 'PRODUCT_VIEW' },
    { name: 'Companies', icon: Building2, path: '/companies', permission: 'PRODUCT_VIEW' },
    { name: 'Warehouses', icon: Warehouse, path: '/warehouses', permission: 'WAREHOUSE_VIEW' },
    { name: 'Stock Transfers', icon: ArrowRightLeft, path: '/stock-transfers', permission: 'WAREHOUSE_VIEW' },
    { name: 'Customers', icon: Users, path: '/customers', permission: 'CUSTOMER_VIEW' },
    { name: 'Employees', icon: UserCircle, path: '/employees', permission: 'EMPLOYEE_VIEW' },
    { name: 'Roles', icon: Shield, path: '/roles', permission: 'ROLE_VIEW' },
    { name: 'Sales', icon: ShoppingCart, path: '/sales', permission: 'SALES_VIEW' }, 
    { name: 'Delivery', icon: Truck, path: '/delivery', permission: 'DELIVERY_VIEW' },
    { name: 'Reports', icon: BarChart3, path: '/reports', permission: 'REPORT_VIEW' },
    { name: 'Settings', icon: Settings, path: '/settings', permission: 'SETTINGS_VIEW' }
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col relative`}>
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {isOpen && (
          <div>
            <h1 className="text-xl font-bold">Friends Digital</h1>
            <p className="text-xs text-slate-400">Store Management</p>
          </div>
        )}
        {!isOpen && <Package className="h-8 w-8 text-blue-400" />}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-slate-900 border border-slate-700 rounded-full p-1 hover:bg-slate-800 transition-colors z-10"
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const hasPermission = userData?.permissions?.includes(item.permission);
  
  if (!hasPermission) return null;
  
  return (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`
        }
        title={!isOpen ? item.name : ''}
      >
        <item.icon className={`h-5 w-5 ${isOpen ? '' : 'mx-auto'}`} />
        {isOpen && <span className="font-medium">{item.name}</span>}
      </NavLink>
    </li>
  );
})}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-700">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{JSON.parse(localStorage.getItem('user_data')).name}</p>
              <p className="text-xs text-slate-400">{JSON.parse(localStorage.getItem('user_data')).email || 'not provided'}</p>
            </div>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-sm font-bold">AD</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;