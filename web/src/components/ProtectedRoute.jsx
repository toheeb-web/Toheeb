import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the user's primary portal if they attempt to access another role's route
    const redirectPath = 
      currentUser.role === 'SELLER' ? '/seller' :
      currentUser.role === 'RIDER' ? '/rider' : '/buyer';

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
