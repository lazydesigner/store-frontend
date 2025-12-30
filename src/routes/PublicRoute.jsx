import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const PublicRoute = ({ children, redirectIfAuthenticated = true }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <Loader fullScreen message="Loading..." />;
  }

  if (isAuthenticated && redirectIfAuthenticated) { 

    const user = JSON.parse(localStorage.getItem('user_data'));

    const isDelivery =
      user?.roles?.includes('Delivery') 

      if(isDelivery){
        return <Navigate to="/delivery" replace />;
      }else{
        return <Navigate to="/dashboard" replace />;
      }
    
  }

  return children;
};

export default PublicRoute;