import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userType = localStorage.getItem('userType');

  if (!userType) {    
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
