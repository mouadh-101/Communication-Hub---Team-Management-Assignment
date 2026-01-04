import React from 'react';
import type { ReactNode } from 'react';

import { useAuth } from '../context/AuthContext';
import Login from './Login';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
