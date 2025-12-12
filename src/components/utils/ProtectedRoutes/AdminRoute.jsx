import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminPanel from '../../layout/Admin';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();  // Assuming this provides authentication status
  const token = sessionStorage.getItem("adminToken");
  //console.log("isAuthenticated", isAuthenticated);

  return token && isAuthenticated && isAdmin ? (
    <>
      {/* Inject global styles for the Outlet wrapper */}
      <style>
        {`
          .outlet-wrapper * {
            font-family: Inter, sans- ;
          }
        `}
      </style>
      <AdminPanel>
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </AdminPanel>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;