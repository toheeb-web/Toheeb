import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  UtensilsCrossed, 
  Store, 
  Bike, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { firebaseResetPassword, isFirebaseConfigured } from '../../services/firebase';

export const Login = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const fromParam = searchParams.get('from') || location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(roleParam || 'BUYER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (roleParam === 'RIDER') {
      setSelectedRole('RIDER');
      setEmail('tunde@chopconnect.ng');
      setPassword('Nigeria1@');
    }
  }, [roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password, selectedRole);
      setLoading(false);
      // Route based on role or fromParam
      if (fromParam) {
        navigate(fromParam, { replace: true });
      } else if (user.role === 'ADMIN' || user.name === 'Toheebay') {
        navigate('/admin');
      } else if (user.role === 'SELLER') {
        navigate('/seller');
      } else if (user.role === 'RIDER') {
        navigate('/rider');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setLoading(false);
      showToast("Login failed: " + err.message);
    }
  };

  const handleQuickLogin = async (accountEmail, accountPassword, role) => {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setSelectedRole(role);
    setLoading(true);
    const user = await login(accountEmail, accountPassword, role);
    setLoading(false);
    if (fromParam && (role === 'RIDER' || user.role === 'ADMIN')) {
      navigate(fromParam, { replace: true });
    } else if (role === 'ADMIN' || user.role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'SELLER') {
      navigate('/seller');
    } else if (role === 'RIDER') {
      navigate('/rider');
    } else {
      navigate('/buyer');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast("Please enter your email address.");
      return;
    }
    try {
      if (isFirebaseConfigured) {
        await firebaseResetPassword(resetEmail);
      }
      showToast(`Password reset link sent to ${resetEmail}!`);
      setShowResetModal(false);
    } catch (err) {
      showToast("Reset failed: " + err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#FEF7F4]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E2D7CF]/70">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <img 
            src="/chopconnect_icon_1788517538782.jpg" 
            alt="ChopConnect" 
            className="w-14 h-14 rounded-2xl mx-auto mb-3 shadow-md object-cover ring-4 ring-brand-100" 
          />
          <h1 className="text-2xl font-black text-[#1C1B1F]">Welcome to ChopConnect</h1>
          <p className="text-xs text-[#79747E] mt-1">Sign in to your Nigerian food & dispatch account</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'BUYER', label: 'Buyer', icon: UtensilsCrossed },
              { id: 'SELLER', label: 'Seller', icon: Store },
              { id: 'RIDER', label: 'Rider', icon: Bike },
              { id: 'ADMIN', label: 'Admin', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRole(tab.id)}
                  className={`py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center space-y-1 transition-all border ${
                    isSelected
                      ? tab.id === 'ADMIN' 
                        ? 'bg-purple-700 text-white border-purple-700 shadow-md scale-[1.02]'
                        : 'bg-brand-500 text-white border-brand-500 shadow-md scale-[1.02]'
                      : 'bg-white text-[#49454F] border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#49454F] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@chopconnect.ng"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#49454F]">Password</label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[11px] text-brand-600 hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-2"
          >
            <span>{loading ? 'Signing in...' : `Sign in as ${selectedRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Access Account Selector */}
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#49454F] uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Instant Access Real Profiles</span>
            </p>
            <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
              GTBank 0108688385
            </span>
          </div>

          {/* Master Admin Button */}
          <button
            onClick={() => handleQuickLogin('toheebay@chopconnect.ng', 'Nigeria1@', 'ADMIN')}
            className="w-full mb-2 p-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-xl shadow-sm flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Toheebay (Master Admin & Settlement)</span>
            </div>
            <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded-lg text-purple-200">
              Nigeria1@
            </span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('amara@chopconnect.ng', 'Nigeria1@', 'BUYER')}
              className="px-2 py-2 bg-brand-50/80 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl border border-brand-200 text-center transition-colors truncate"
            >
              Amara (Buyer)
            </button>
            <button
              onClick={() => handleQuickLogin('toheebay@chopconnect.ng', 'Nigeria1@', 'SELLER')}
              className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 text-center transition-colors truncate"
            >
              Toheebay (Kitchen)
            </button>
            <button
              onClick={() => handleQuickLogin('tunde@chopconnect.ng', 'Nigeria1@', 'RIDER')}
              className="px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 text-center transition-colors truncate"
            >
              Tunde (Rider)
            </button>
          </div>
        </div>

        {/* Register footer */}
        <p className="text-center text-xs text-[#79747E] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-bold hover:underline">
            Register now
          </Link>
        </p>

        <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-[11px] text-[#79747E]">
          Nigerian Helpline: <a href="tel:+2348024764090" className="font-bold text-brand-600">+234 802 476 4090</a>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#1C1B1F] mb-1">Reset Password</h3>
            <p className="text-xs text-[#79747E] mb-4">
              Enter your email address and we'll send a password recovery link.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@chopconnect.ng"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-[#49454F] bg-neutral-100 hover:bg-neutral-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
