import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  UtensilsCrossed, 
  Store, 
  Bike, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Register = () => {
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('BUYER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        phone,
        address,
        businessName,
        vehicleType
      });
      setLoading(false);

      if (user.role === 'SELLER') navigate('/seller');
      else if (user.role === 'RIDER') navigate('/rider');
      else navigate('/buyer');
    } catch (err) {
      setLoading(false);
      showToast("Registration error: " + err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#FEF7F4]">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E2D7CF]/70">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img 
            src="/chopconnect_icon_1788517538782.jpg" 
            alt="ChopConnect" 
            className="w-12 h-12 rounded-2xl mx-auto mb-2 shadow-sm object-cover ring-2 ring-brand-200" 
          />
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Create your ChopConnect account</h1>
          <p className="text-xs text-[#79747E] mt-1">Join the community of food lovers, kitchens, and couriers</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'BUYER', title: 'Foodie / Buyer', desc: 'Browse dishes & order', icon: UtensilsCrossed },
              { id: 'SELLER', title: 'Food Seller', desc: 'Kitchen & menu manager', icon: Store },
              { id: 'RIDER', title: 'Rider / Courier', desc: 'Deliver & earn fees', icon: Bike },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`relative text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/30' 
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-brand-500 absolute top-3 right-3" />
                  )}
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-brand-600' : 'text-[#79747E]'}`} />
                  <p className="text-xs font-bold text-[#1C1B1F]">{item.title}</p>
                  <p className="text-[10px] text-[#79747E] mt-0.5">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#49454F] mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amara Okonkwo"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#49454F] mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#49454F] mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#49454F] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#49454F] mb-1">Address / Hub</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street or District"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Conditional Seller Business Name */}
          {role === 'SELLER' && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1">Kitchen / Restaurant Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Mama K's Authentic Kitchen"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Conditional Rider Vehicle */}
          {role === 'RIDER' && (
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
              <label className="block text-xs font-bold text-blue-900 mb-1">Select Delivery Vehicle</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Motorcycle', 'Bicycle', 'E-Bike', 'Car'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleType(v)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      vehicleType === v 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-[#49454F] border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>{loading ? 'Creating account...' : `Register as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#79747E] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
