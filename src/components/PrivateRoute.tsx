import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { Role } from '../types';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles: Role[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const user = authService.getAuthenticatedUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/mesas" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;