import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    // If user has role 'admin', redirect to admin dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    // If user has role 'doctor', redirect to doctor dashboard
    if (user.role === 'doctor') {
      return <Navigate to="/doctor" replace />;
    }

    // Fallback to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has the correct role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
