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
  ShieldCheck,
  CheckCircle2,
  Percent
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
  const [city, setCity] = useState('Lagos');
  const [businessName, setBusinessName] = useState('');
  const [vehicleType, setVehicleType] = useState('Motorcycle (Bajaj/Boxer)');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        phone: phone || "+2348024764090",
        address: `${address || 'Victoria Island'}, ${city}`,
        businessName,
        vehicleType
      });
      setLoading(false);
      showToast(`Welcome ${user.name}! You are now live on ChopConnect Nigeria.`);

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
            className="w-14 h-14 rounded-2xl mx-auto mb-2 shadow-sm object-cover ring-2 ring-brand-200" 
          />
          <h1 className="text-2xl font-black text-[#1C1B1F]">Register on ChopConnect</h1>
          <p className="text-xs text-[#79747E] mt-1">Nigeria's premier live platform for food lovers, vendors & couriers</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-2">
            Select Your Account Type:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'BUYER', title: 'Foodie / Customer', desc: 'Order & track meals live', icon: UtensilsCrossed },
              { id: 'SELLER', title: 'Food Vendor', desc: '5% commission only', icon: Store },
              { id: 'RIDER', title: 'Courier Rider', desc: 'Earn ₦1,100 / trip', icon: Bike },
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

        {/* Role Specific Highlight */}
        {role === 'SELLER' && (
          <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center space-x-2 text-xs text-amber-900">
            <Percent className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Vendors keep <strong>95% of sales</strong>. 5% platform fee deducted before bank withdrawal.</span>
          </div>
        )}

        {role === 'RIDER' && (
          <div className="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Riders receive <strong>₦1,100 net</strong> for each ₦1,500 customer delivery fee.</span>
          </div>
        )}

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
                placeholder="e.g. Babatunde Adeyemi"
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
                placeholder="e.g. b.adeyemi@gmail.com"
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
                placeholder="Secure password (min 6 characters)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#49454F] mb-1">Nigerian Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 802 476 4090"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#49454F] mb-1">Operating City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
              >
                <option value="Lagos">Lagos (Island & Mainland)</option>
                <option value="Abuja">Abuja (FCT)</option>
                <option value="Port Harcourt">Port Harcourt (Rivers)</option>
                <option value="Ibadan">Ibadan (Oyo)</option>
                <option value="Enugu">Enugu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#49454F] mb-1">Street Address / Area</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#79747E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2D7CF] bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          {/* Conditional Seller Business Name */}
          {role === 'SELLER' && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1">Kitchen / Restaurant Business Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Mama Put Gourmet & Grills"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Conditional Rider Vehicle */}
          {role === 'RIDER' && (
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-900 mb-1">Select Courier Vehicle</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Motorcycle (Bajaj/Boxer)', 'E-Bike / Scooter', 'Dispatch Car'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleType(v)}
                    className={`py-2 px-1 text-center text-[11px] font-bold rounded-xl border transition-all ${
                      vehicleType === v 
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
                        : 'bg-white text-[#49454F] border-emerald-200 hover:bg-emerald-100'
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
            <span>{loading ? 'Registering...' : `Join ChopConnect as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#79747E] mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>

        <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-[11px] text-[#79747E]">
          Direct Support: <a href="tel:+2348024764090" className="font-bold text-brand-600">+234 802 476 4090</a>
        </div>
      </div>
    </div>
  );
};
