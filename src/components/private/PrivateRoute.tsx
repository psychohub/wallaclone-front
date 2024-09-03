import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;