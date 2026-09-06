import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, switchRole } = useApp();
  const location = useLocation();

  if (!currentUser) {
    const defaultRole = allowedRoles?.[0] || 'RIDER';
    return <Navigate to={`/login?role=${defaultRole}&from=${encodeURIComponent(location.pathname)}`} state={{ from: location }} replace />;
  }

  // Master Admin (Toheebay) has access across all portals (Seller, Rider, Buyer, Admin)
  if (currentUser.role === 'ADMIN') {
    return children;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If user specifically navigated to /rider or /rider/deliveries, redirect to login for that role
    const targetRole = allowedRoles[0];
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-xl border border-neutral-200 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl">
            🛵
          </div>
          <h2 className="text-xl font-black text-neutral-900 mb-1">Rider Dispatch Portal</h2>
          <p className="text-xs text-neutral-600 mb-6">
            You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}). Access to the Courier Dispatch portal requires a Rider account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => switchRole('RIDER')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Switch to Verified Rider Profile
            </button>
            <Navigate
              to={`/login?role=${targetRole}&from=${encodeURIComponent(location.pathname)}`}
              replace
            />
          </div>
        </div>
      </div>
    );
  }

  return children;
};
