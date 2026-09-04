import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Bike, 
  Store, 
  ChevronDown, 
  LogOut, 
  User, 
  Clock, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, cart, switchRole, logout } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const roles = [
    { id: 'BUYER', label: 'Buyer', icon: UtensilsCrossed, path: '/buyer', desc: 'Browse dishes & track orders' },
    { id: 'SELLER', label: 'Seller', icon: Store, path: '/seller', desc: 'Kitchen & dish manager' },
    { id: 'RIDER', label: 'Rider', icon: Bike, path: '/rider', desc: 'Bidding & delivery dispatch' },
  ];

  const handleRoleChange = (role, path) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2D7CF] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img 
                src="/chopconnect_icon_1788517538782.jpg" 
                alt="ChopConnect" 
                className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-brand-500/20 group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-brand-500 font-sans">
                  Chop<span className="text-[#1C1B1F]">Connect</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#79747E] -mt-1">
                  Food & Peer Delivery
                </span>
              </div>
            </Link>

            {/* Current Role Badge */}
            <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              {currentUser?.role === 'BUYER' && 'Foodie / Customer'}
              {currentUser?.role === 'SELLER' && 'Kitchen Partner'}
              {currentUser?.role === 'RIDER' && 'Express Courier'}
            </div>
          </div>

          {/* Desktop Navigation Links based on Role */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {currentUser?.role === 'BUYER' && (
              <>
                <Link 
                  to="/buyer" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/buyer' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Marketplace
                </Link>
                <Link 
                  to="/buyer/orders" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/buyer/orders' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  My Orders & Tracking
                </Link>
              </>
            )}

            {currentUser?.role === 'SELLER' && (
              <>
                <Link 
                  to="/seller" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/seller' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/seller/products" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/seller/products' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Dishes & Menu
                </Link>
                <Link 
                  to="/seller/orders" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/seller/orders' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Incoming Orders
                </Link>
              </>
            )}

            {currentUser?.role === 'RIDER' && (
              <>
                <Link 
                  to="/rider" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/rider' ? 'bg-delivery-50 text-delivery-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Rider Hub
                </Link>
                <Link 
                  to="/rider/deliveries" 
                  className={`px-3 py-2 rounded-xl transition-colors ${location.pathname === '/rider/deliveries' ? 'bg-delivery-50 text-delivery-600 font-semibold' : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-100'}`}
                >
                  Available Deliveries
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons: Role Switcher, Cart, Profile */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5EEEA] hover:bg-[#EADFD7] text-[#1C1B1F] transition-all border border-[#E2D7CF]"
                title="Switch User Role"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span className="hidden sm:inline">Role:</span>
                <span className="capitalize font-bold text-brand-600">{currentUser?.role.toLowerCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#79747E]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#E2D7CF] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-[#1C1B1F]">Switch Active Experience</p>
                    <p className="text-[11px] text-[#79747E]">Experience ChopConnect as any role</p>
                  </div>
                  {roles.map(r => {
                    const Icon = r.icon;
                    const isActive = currentUser?.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleChange(r.id, r.path)}
                        className={`w-full text-left px-3 py-2.5 flex items-center space-x-3 hover:bg-neutral-50 transition-colors ${isActive ? 'bg-brand-50/70 text-brand-600' : 'text-[#49454F]'}`}
                      >
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-[#49454F]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.label}</p>
                          <p className="text-[11px] text-[#79747E]">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#49454F] hover:text-[#1C1B1F] hover:bg-neutral-50"
                    >
                      Authentication & Login Screen &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Buyer Cart Button */}
            {currentUser?.role === 'BUYER' && (
              <Link
                to="/buyer/cart"
                className="relative p-2 text-[#49454F] hover:text-brand-500 hover:bg-neutral-100 rounded-xl transition-colors"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile Avatar & Navigation */}
            <Link
              to={
                currentUser?.role === 'BUYER' ? '/buyer/profile' :
                currentUser?.role === 'SELLER' ? '/seller/profile' : '/rider/profile'
              }
              className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full hover:bg-neutral-100 transition-colors"
              title="Profile"
            >
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-100">
                {currentUser?.avatarInitials || 'CC'}
              </div>
            </Link>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#49454F] hover:text-[#1C1B1F] rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2D7CF] px-4 pt-2 pb-4 space-y-1">
          {currentUser?.role === 'BUYER' && (
            <>
              <Link 
                to="/buyer" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Marketplace
              </Link>
              <Link 
                to="/buyer/orders" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Track Orders & Deliveries
              </Link>
              <Link 
                to="/buyer/cart" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Cart ({cartCount})
              </Link>
              <Link 
                to="/buyer/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Buyer Profile
              </Link>
            </>
          )}

          {currentUser?.role === 'SELLER' && (
            <>
              <Link 
                to="/seller" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Seller Dashboard
              </Link>
              <Link 
                to="/seller/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Menu & Food Management
              </Link>
              <Link 
                to="/seller/orders" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Incoming Orders
              </Link>
              <Link 
                to="/seller/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Kitchen Profile
              </Link>
            </>
          )}

          {currentUser?.role === 'RIDER' && (
            <>
              <Link 
                to="/rider" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Rider Dashboard
              </Link>
              <Link 
                to="/rider/deliveries" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Available Deliveries & Bidding
              </Link>
              <Link 
                to="/rider/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-[#1C1B1F] hover:bg-neutral-100"
              >
                Courier Profile
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-[#79747E]">Logged in as {currentUser?.name}</span>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-red-600 font-semibold flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
