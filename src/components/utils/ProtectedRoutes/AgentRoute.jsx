import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AgentPerformanceLayout from '../../layout/AgentPerformanceLayout'

const AgentRoute = () => {
  const { isAuthenticated, isAgent } = useAuth();  // Assuming this provides authentication status
//   const token = sessionStorage.getItem("adminToken");
  //console.log("isAuthenticated", isAuthenticated);

  return isAuthenticated && isAgent ? (
    <>
      {/* Inject global styles for the Outlet wrapper */}
      <style>
        {`
          .outlet-wrapper * {
            font-family: Inter, sans- ;
          }
        `}
      </style>
      <AgentPerformanceLayout>
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </AgentPerformanceLayout>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default AgentRoute;