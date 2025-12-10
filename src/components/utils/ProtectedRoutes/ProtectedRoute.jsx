import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();  // Assuming this provides authentication status

  if (isAuthenticated === null) {
    return <LoadingPage />;  // Prevents redirect before auth state is determined
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
