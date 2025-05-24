import React from 'react';
import { Navigate } from 'react-router-dom';
import authService, { PERMISSIONS } from '../services/authService';

/**
 * Component to protect routes based on authentication and permissions
 * @param {Object} props
 * @param {React.Component} props.children - Child components to render if authorized
 * @param {number} props.requiredPermission - Required permission value
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/login')
 */
const ProtectedRoute = ({ children, requiredPermission, redirectTo = '/login' }) => {
  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // If no permission required, just check authentication
  if (!requiredPermission) {
    return children;
  }

  // Check if user has required permission using authService
  // Use hasAnyPermission to support OR logic for multiple permissions
  const hasPermission = authService.hasAnyPermission(requiredPermission);

  if (!hasPermission) {
    // Redirect to dashboard with error message
    return <Navigate to="/dashboard" replace state={{ 
      error: 'Bạn không có quyền truy cập trang này' 
    }} />;
  }

  return children;
};

// Export permissions for use in other components
export { PERMISSIONS };
export default ProtectedRoute; 