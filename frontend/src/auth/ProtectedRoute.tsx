import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  element: React.ReactElement;
  path: string;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path, redirectPath = '/signin' }) => {
  const { user } = useAuth();

  return (
    <Route
      path={path}
      element={user ? element : <Navigate to={redirectPath} replace />}
    />
  );
};

export default ProtectedRoute;