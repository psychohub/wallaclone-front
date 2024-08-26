import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  console.log('PrivateRoute: Token:', token ? 'exists' : 'not exists', 'User:', user);

  if (!token || !user) {
    console.log('PrivateRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: Rendering children');
  return <>{children}</>;
};

export default PrivateRoute;