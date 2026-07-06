import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('Citizen' | 'Driver' | 'Municipal Admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // If auth is loading, render a subtle loader skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-neutral-muted animate-pulse">Loading secure environment...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If current role is not allowed on this route, redirect to their proper dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'Citizen') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'Driver') {
      return <Navigate to="/driver" replace />;
    } else if (user.role === 'Municipal Admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
