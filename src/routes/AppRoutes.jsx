import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Customers from '../pages/Customers';
import Employees from '../pages/Employees';
import Sales from '../pages/Sales';
import Delivery from '../pages/Delivery';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Login from '../pages/Login'; 
import Roles from '../pages/Roles';
import ProductTypes from '../pages/ProductTypes';
import Companies from '../pages/Companies';
import Warehouses from '../pages/Warehouses';
import StockTransfers from '../pages/StockTransfers';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import InvoiceView from '../pages/InvoiceView';

// Permissions
import { PERMISSIONS } from '../utils/constants';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
         <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
         <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

         {/* Invoice View - Standalone (no Layout for clean print) */}
        <Route
          path="/invoice/:id"
          element={
            <PrivateRoute requiredPermission={PERMISSIONS.SALES_VIEW}>
              <InvoiceView />
            </PrivateRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Products */}
                  <Route
                    path="/products"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.PRODUCT_VIEW}>
                        <Products />
                      </PrivateRoute>
                    }
                  />

                  {/* Product Types */}
                  <Route
                    path="/product-types"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.PRODUCT_VIEW}>
                        <ProductTypes />
                      </PrivateRoute>
                    }
                  />

                  {/* Companies */}
                  <Route
                    path="/companies"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.PRODUCT_VIEW}>
                        <Companies />
                      </PrivateRoute>
                    }
                  />
                  
                  {/* Stock Transfers */}
                  <Route
                    path="/stock-transfers"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.INVENTORY_VIEW}>
                        <StockTransfers />
                      </PrivateRoute>
                    }
                  />

                  {/* Customers */}
                  <Route
                    path="/customers"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.CUSTOMER_VIEW}>
                        <Customers />
                      </PrivateRoute>
                    }
                  />

                  {/* Employees */}
                  <Route
                    path="/employees"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.EMPLOYEE_VIEW}>
                        <Employees />
                      </PrivateRoute>
                    }
                  />

                  {/* Sales */}
                  <Route
                    path="/sales"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.SALES_VIEW}>
                        <Sales />
                      </PrivateRoute>
                    }
                  />

                  {/* Delivery */}
                  <Route
                    path="/delivery"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.DELIVERY_VIEW}>
                        <Delivery />
                      </PrivateRoute>
                    }
                  />

                  {/* Reports */}
                  <Route
                    path="/reports"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.REPORT_VIEW}>
                        <Reports />
                      </PrivateRoute>
                    }
                  />

                  {/* Settings */}
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.SETTINGS_VIEW}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />

                  {/* Warehouses */}
                  <Route
                    path="/warehouses"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.SETTINGS_VIEW}>
                        <Warehouses />
                      </PrivateRoute>
                    }
                  />

                  {/* Roles */}
                  <Route
                    path="/roles"
                    element={
                      <PrivateRoute requiredPermission={PERMISSIONS.SETTINGS_VIEW}>
                        <Roles />
                      </PrivateRoute>
                    }
                  />

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />


                  {/* 404 */}
                  <Route
                    path="*"
                    element={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <h1 className="text-6xl font-bold text-gray-900">404</h1>
                          <p className="text-xl text-gray-600 mt-4">Page not found</p>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;