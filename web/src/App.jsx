import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FloatingQuickNav } from './components/FloatingQuickNav';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Buyer Pages
import { Marketplace } from './pages/buyer/Marketplace';
import { Cart } from './pages/buyer/Cart';
import { OrderTracking } from './pages/buyer/OrderTracking';
import { BuyerProfile } from './pages/buyer/BuyerProfile';

// Seller Pages
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { SellerDishes } from './pages/seller/SellerDishes';
import { SellerOrders } from './pages/seller/SellerOrders';
import { SellerProfile } from './pages/seller/SellerProfile';

// Rider Pages
import { RiderDashboard } from './pages/rider/RiderDashboard';
import { AvailableDeliveries } from './pages/rider/AvailableDeliveries';
import { RiderProfile } from './pages/rider/RiderProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const { currentUser, setQuickNavOpen, setOnboardingOpen } = useApp();

  const getDefaultRoute = () => {
    if (currentUser?.role === 'ADMIN') return '/admin';
    if (currentUser?.role === 'SELLER') return '/seller';
    if (currentUser?.role === 'RIDER') return '/rider';
    return '/buyer';
  };

  return (
    <div className="min-h-screen bg-[#FEF7F4] flex flex-col font-sans text-[#1C1B1F] selection:bg-brand-500 selection:text-white">
      {/* Universal Desktop & Mobile Header */}
      <Navbar />

      {/* Main App Content Viewport */}
      <main className="flex-1">
        <Routes>
          {/* Default Root Redirect */}
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Buyer Routes */}
          <Route path="/buyer" element={<Marketplace />} />
          <Route path="/buyer/cart" element={<Cart />} />
          <Route path="/buyer/orders" element={<OrderTracking />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />

          {/* Seller Routes */}
          <Route 
            path="/seller" 
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller/products" 
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerDishes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller/orders" 
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller/profile" 
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerProfile />
              </ProtectedRoute>
            } 
          />

          {/* Rider Routes */}
          <Route 
            path="/rider" 
            element={
              <ProtectedRoute allowedRoles={['RIDER']}>
                <RiderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rider/deliveries" 
            element={
              <ProtectedRoute allowedRoles={['RIDER']}>
                <AvailableDeliveries />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rider/profile" 
            element={
              <ProtectedRoute allowedRoles={['RIDER']}>
                <RiderProfile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Thumb-friendly mobile navigation bar for smartphones */}
      <BottomNav />

      {/* Floating Quick Navigation & Onboarding Button */}
      <FloatingQuickNav 
        onOpenNav={() => setQuickNavOpen(true)} 
        onOpenOnboarding={() => setOnboardingOpen(true)} 
      />
    </div>
  );
}
