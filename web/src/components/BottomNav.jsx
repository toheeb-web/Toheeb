import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  ShoppingBag, 
  Clock, 
  User, 
  Bike, 
  PlusCircle, 
  ClipboardList, 
  BarChart3,
  Compass,
  ShieldCheck
} from 'lucide-react';

export const BottomNav = () => {
  const { currentUser, cart, setQuickNavOpen } = useApp();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Admin Hub', icon: ShieldCheck },
          { to: '/buyer', label: 'Menu', icon: Store },
          { to: '/seller', label: 'Kitchen', icon: BarChart3 },
          { to: '/rider', label: 'Rider', icon: Bike }
        ];
      case 'SELLER':
        return [
          { to: '/seller', label: 'Dashboard', icon: BarChart3 },
          { to: '/seller/products', label: 'Dishes', icon: PlusCircle },
          { to: '/seller/orders', label: 'Orders', icon: ClipboardList },
          { to: '/seller/profile', label: 'Kitchen', icon: Store }
        ];
      case 'RIDER':
        return [
          { to: '/rider', label: 'Hub', icon: Bike },
          { to: '/rider/deliveries', label: 'Deliveries', icon: ClipboardList },
          { to: '/rider/profile', label: 'Profile', icon: User }
        ];
      case 'BUYER':
      default:
        return [
          { to: '/buyer', label: 'Menu', icon: Store },
          { to: '/buyer/orders', label: 'Tracking', icon: Clock },
          { to: '/buyer/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
          { to: '/buyer/profile', label: 'Account', icon: User }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2D7CF] pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/buyer' || item.to === '/seller' || item.to === '/rider'}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold transition-all
                ${isActive ? 'text-brand-500 font-bold scale-105' : 'text-[#79747E] hover:text-[#1C1B1F]'}
              `}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Quick Nav Trigger in Bottom Bar */}
        <button
          onClick={() => setQuickNavOpen(true)}
          type="button"
          className="relative flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold text-brand-600 hover:text-brand-700 transition-all active:scale-95"
        >
          <div className="p-1 bg-brand-50 rounded-lg">
            <Compass className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Quick Hub</span>
        </button>
      </div>
    </nav>
  );
};
