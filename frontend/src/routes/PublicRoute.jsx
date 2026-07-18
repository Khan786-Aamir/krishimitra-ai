import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  const getDashboardRedirect = (role) => {
    switch (role) {
      case 'Farmer':
        return '/farmer';
      case 'Buyer':
        return '/buyer';
      case 'Expert':
        return '/expert';
      default:
        return '/';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background-dark text-white z-50">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 bg-primary/10 rounded-full animate-pulse"></div>
          <span className="absolute font-sans font-bold text-sm text-primary">KM</span>
        </div>
        <p className="mt-4 text-sm font-medium tracking-wide text-gray-400 animate-pulse font-display">
          Verifying your session...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getDashboardRedirect(user?.role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
