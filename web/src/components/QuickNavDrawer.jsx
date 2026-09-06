import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  UtensilsCrossed, 
  Store, 
  Bike, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Building2, 
  MapPin, 
  Users, 
  Download, 
  Phone, 
  MessageCircle, 
  Compass, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  PlusCircle,
  TrendingUp,
  User
} from 'lucide-react';

export const QuickNavDrawer = ({ 
  isOpen, 
  onClose, 
  onOpenOnboarding, 
  onOpenLocation, 
  onOpenDirectory, 
  onOpenInstall 
}) => {
  const { currentUser, switchRole, cart, users, verifiedLocation } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const onlineCount = users.filter(u => u.isOnline).length;

  const handleRoleSelect = (role, path) => {
    switchRole(role);
    onClose();
    navigate(path);
  };

  const navigateTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div>
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#1C1B1F] text-white">
            <div className="flex items-center space-x-3">
              <img 
                src="/chopconnect_icon_1788517538782.jpg" 
                alt="ChopConnect" 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-400"
              />
              <div>
                <h3 className="font-extrabold text-base leading-tight">ChopConnect Hub</h3>
                <p className="text-[11px] text-white/70">Quick Access Navigation Center</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Role Switcher Cards */}
          <div className="p-4 bg-neutral-50 border-b border-neutral-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#49454F] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Switch Your Experience</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                Active: {currentUser?.role}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleSelect('BUYER', '/buyer')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  currentUser?.role === 'BUYER'
                    ? 'bg-brand-500 text-white border-brand-500 shadow-md scale-[1.02]'
                    : 'bg-white text-[#49454F] border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold">Buyer</p>
                <p className={`text-[9px] ${currentUser?.role === 'BUYER' ? 'text-white/80' : 'text-[#79747E]'}`}>Order Food</p>
              </button>

              <button
                onClick={() => handleRoleSelect('SELLER', '/seller')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  currentUser?.role === 'SELLER'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-white text-[#49454F] border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold">Seller</p>
                <p className={`text-[9px] ${currentUser?.role === 'SELLER' ? 'text-white/80' : 'text-[#79747E]'}`}>5% Comm.</p>
              </button>

              <button
                onClick={() => handleRoleSelect('RIDER', '/rider')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  currentUser?.role === 'RIDER'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-[1.02]'
                    : 'bg-white text-[#49454F] border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Bike className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold">Courier</p>
                <p className={`text-[9px] ${currentUser?.role === 'RIDER' ? 'text-white/80' : 'text-[#79747E]'}`}>₦1,100 Fee</p>
              </button>
            </div>
          </div>

          {/* Navigation Links Sections */}
          <div className="p-4 space-y-4">
            
            {/* Primary Actions based on current role */}
            <div>
              <p className="text-[11px] font-bold text-[#79747E] uppercase tracking-wider mb-2">
                Main Views
              </p>
              <div className="space-y-1.5">
                {currentUser?.role === 'BUYER' && (
                  <>
                    <button
                      onClick={() => navigateTo('/buyer')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-brand-50 flex items-center justify-between transition-colors border border-transparent hover:border-brand-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-100 text-brand-700 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Food Marketplace</p>
                          <p className="text-[11px] text-[#79747E]">Browse Nigerian dishes, suya & soups</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-500" />
                    </button>

                    <button
                      onClick={() => navigateTo('/buyer/cart')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-brand-50 flex items-center justify-between transition-colors border border-transparent hover:border-brand-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-100 text-brand-700 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Shopping Cart ({cartCount})</p>
                          <p className="text-[11px] text-[#79747E]">Mastercard & NIP Bank Checkout</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-500" />
                    </button>

                    <button
                      onClick={() => navigateTo('/buyer/orders')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-brand-50 flex items-center justify-between transition-colors border border-transparent hover:border-brand-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-100 text-brand-700 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Live Order Tracking</p>
                          <p className="text-[11px] text-[#79747E]">Real-time courier map & delivery progress</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-500" />
                    </button>
                  </>
                )}

                {currentUser?.role === 'SELLER' && (
                  <>
                    <button
                      onClick={() => navigateTo('/seller')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 flex items-center justify-between transition-colors border border-transparent hover:border-amber-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Kitchen Dashboard</p>
                          <p className="text-[11px] text-[#79747E]">Gross sales, 5% fee & Bank payouts</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600" />
                    </button>

                    <button
                      onClick={() => navigateTo('/seller/products')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 flex items-center justify-between transition-colors border border-transparent hover:border-amber-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <PlusCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Manage Dishes & Prices</p>
                          <p className="text-[11px] text-[#79747E]">Add meals with Naira pricing</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600" />
                    </button>

                    <button
                      onClick={() => navigateTo('/seller/orders')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 flex items-center justify-between transition-colors border border-transparent hover:border-amber-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Incoming Food Orders</p>
                          <p className="text-[11px] text-[#79747E]">Cooking prep & dispatch status</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600" />
                    </button>
                  </>
                )}

                {currentUser?.role === 'RIDER' && (
                  <>
                    <button
                      onClick={() => navigateTo('/rider')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-emerald-50 flex items-center justify-between transition-colors border border-transparent hover:border-emerald-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Courier Dispatch Hub</p>
                          <p className="text-[11px] text-[#79747E]">Earn ₦1,100 per delivery trip</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-700" />
                    </button>

                    <button
                      onClick={() => navigateTo('/rider/deliveries')}
                      className="w-full text-left p-3 rounded-2xl hover:bg-emerald-50 flex items-center justify-between transition-colors border border-transparent hover:border-emerald-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1B1F]">Available Deliveries</p>
                          <p className="text-[11px] text-[#79747E]">Accept customer orders in Lagos & Abuja</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Access Tools */}
            <div>
              <p className="text-[11px] font-bold text-[#79747E] uppercase tracking-wider mb-2">
                Quick Tools & Services
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onClose(); onOpenLocation(); }}
                  className="p-3 bg-white border border-neutral-200 hover:border-brand-300 rounded-2xl text-left hover:bg-neutral-50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-brand-500 mb-1" />
                  <p className="text-xs font-bold text-[#1C1B1F]">Verify Location</p>
                  <p className="text-[10px] text-[#79747E] truncate">{verifiedLocation.area}, {verifiedLocation.city}</p>
                </button>

                <button
                  onClick={() => { onClose(); onOpenDirectory(); }}
                  className="p-3 bg-white border border-neutral-200 hover:border-emerald-300 rounded-2xl text-left hover:bg-neutral-50 transition-colors"
                >
                  <Users className="w-4 h-4 text-emerald-600 mb-1" />
                  <p className="text-xs font-bold text-[#1C1B1F]">Live Members</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{onlineCount} Online Now</p>
                </button>

                <button
                  onClick={() => { onClose(); onOpenInstall(); }}
                  className="p-3 bg-neutral-900 text-white rounded-2xl text-left hover:bg-black transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400 mb-1" />
                  <p className="text-xs font-bold">Install App (PWA)</p>
                  <p className="text-[10px] text-neutral-300">Fast home screen launch</p>
                </button>

                <button
                  onClick={() => { onClose(); onOpenOnboarding(); }}
                  className="p-3 bg-brand-50 border border-brand-200 text-brand-900 rounded-2xl text-left hover:bg-brand-100 transition-colors"
                >
                  <Compass className="w-4 h-4 text-brand-600 mb-1" />
                  <p className="text-xs font-bold">App Onboarding</p>
                  <p className="text-[10px] text-brand-700">Replay step-by-step tour</p>
                </button>
              </div>
            </div>

            {/* Helpline & Support */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>Direct Customer Helpline</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800">24/7 Support</span>
              </div>
              <p className="text-sm font-black text-[#1C1B1F] mb-2">+234 802 476 4090</p>
              <div className="flex space-x-2">
                <a
                  href="tel:+2348024764090"
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl text-center shadow-sm"
                >
                  Direct Call
                </a>
                <a
                  href="https://wa.me/2348024764090?text=Hello%20ChopConnect%20Support,%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl text-center shadow-sm flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-center">
          <p className="text-xs text-[#79747E]">
            ChopConnect Nigeria • Live Food & Delivery Network
          </p>
        </div>
      </div>
    </div>
  );
};
