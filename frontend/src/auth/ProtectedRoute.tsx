import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Oturum durumu kontrol ediliyorsa yükleme mesajı göster
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
