import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UtensilsCrossed, 
  Store, 
  Bike, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Download,
  Building2,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingModal = ({ isOpen, onClose }) => {
  const { switchRole, currentUser } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ChopConnect Nigeria",
      subtitle: "Authentic food delivery, local kitchen marketplace, and express courier dispatch in Lagos, Abuja & beyond.",
      badge: "Quick Start Guide",
      content: (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden h-44 bg-gradient-to-tr from-brand-700 via-brand-500 to-amber-500 flex items-center justify-center p-6 text-center text-white shadow-md">
            <div className="space-y-2 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center ring-2 ring-white/40">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-black">Naija Food at Your Doorstep</h4>
              <p className="text-xs text-white/90 max-w-sm mx-auto">
                Party Jollof, smoky Suya, fresh Soups, and grilled fish delivered straight to your home or office.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-100">
              <span className="text-xl">🍲</span>
              <p className="font-extrabold text-xs text-brand-900 mt-1">Local Dishes</p>
              <p className="text-[10px] text-brand-700">Authentic kitchens</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xl">🏍️</span>
              <p className="font-extrabold text-xs text-emerald-900 mt-1">Express Dispatch</p>
              <p className="text-[10px] text-emerald-700">Real-time riders</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-xl">💳</span>
              <p className="font-extrabold text-xs text-amber-900 mt-1">Pay in Naira (₦)</p>
              <p className="text-[10px] text-amber-700">Card & Transfer</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Experience (3 Roles in 1)",
      subtitle: "ChopConnect seamlessly connects food buyers, vendors, and courier riders.",
      badge: "Multi-Role Platform",
      content: (
        <div className="space-y-3">
          <div 
            onClick={() => switchRole('BUYER')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
              currentUser?.role === 'BUYER' ? 'bg-brand-50 border-brand-400 ring-2 ring-brand-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2.5 bg-brand-500 text-white rounded-xl flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#1C1B1F]">1. Foodie / Customer</span>
                {currentUser?.role === 'BUYER' && (
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-[#79747E] mt-0.5 leading-relaxed">
                Browse nearby restaurants, pay in Naira via Mastercard or NIP Bank Transfer, and track hot meal deliveries.
              </p>
            </div>
          </div>

          <div 
            onClick={() => switchRole('SELLER')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
              currentUser?.role === 'SELLER' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2.5 bg-amber-600 text-white rounded-xl flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#1C1B1F]">2. Food Vendor / Kitchen</span>
                {currentUser?.role === 'SELLER' && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-[#79747E] mt-0.5 leading-relaxed">
                List your dishes, keep <strong>95% of sales</strong> (transparent 5% commission), and withdraw earnings to your Nigerian bank.
              </p>
            </div>
          </div>

          <div 
            onClick={() => switchRole('RIDER')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
              currentUser?.role === 'RIDER' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex-shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#1C1B1F]">3. Courier Dispatch Rider</span>
                {currentUser?.role === 'RIDER' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-[#79747E] mt-0.5 leading-relaxed">
                Accept open orders, earn <strong>₦1,100 per delivery trip</strong> (₦1,500 total delivery fee split), with instant payouts.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Naira Payments & Live Bank Withdrawals",
      subtitle: "Built specifically for Nigeria's financial ecosystem with Mastercard & NIBSS NIP integration.",
      badge: "Real Monetization",
      content: (
        <div className="space-y-3.5">
          <div className="p-4 bg-neutral-900 text-white rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Standard Nigerian Split</span>
              <p className="text-sm font-black mt-0.5">Delivery Fee: ₦1,500</p>
              <div className="flex items-center space-x-2 text-xs text-neutral-300 mt-1">
                <span>🏍️ Rider receives: <strong>₦1,100</strong></span>
                <span>•</span>
                <span>ChopConnect: <strong>₦400</strong></span>
              </div>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Mastercard & Verve</span>
              </div>
              <p className="text-[11px] text-[#79747E]">
                Pay online using your Nigerian debit card with bank 3D-Secure authentication.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs mb-1">
                <Building2 className="w-4 h-4" />
                <span>NIBSS Instant Transfer</span>
              </div>
              <p className="text-[11px] text-[#79747E]">
                Transfer from GTB, Zenith, Access, Kuda, or OPay for 1-minute confirmation.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>5% vendor commission deducted automatically. Instant withdrawals available daily.</span>
          </div>
        </div>
      )
    },
    {
      title: "Easy Navigation & App Installation",
      subtitle: "How to quickly access everything and install ChopConnect on your phone home screen.",
      badge: "Fast Navigation",
      content: (
        <div className="space-y-3">
          <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <h5 className="font-extrabold text-xs text-[#1C1B1F] flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-brand-500" />
              <span>Quick Navigation Menu</span>
            </h5>
            <p className="text-xs text-[#79747E] leading-relaxed">
              Use the top <strong>Role Switcher</strong> to toggle between Customer, Kitchen, and Courier modes anytime. Click <strong>Navigation Hub</strong> for instant shortcuts.
            </p>
          </div>

          <div className="p-3.5 bg-neutral-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                <Download className="w-4 h-4" />
                <span>Install on Mobile (PWA)</span>
              </div>
              <p className="text-[11px] text-neutral-300 mt-1 max-w-xs">
                Add ChopConnect to your phone home screen for 1-tap app launch without app stores.
              </p>
            </div>
            <span className="text-[10px] bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">1-Tap</span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Direct Support Hotline</span>
                <p className="font-black text-sm text-amber-950">+234 802 476 4090</p>
              </div>
            </div>
            <a 
              href="tel:+2348024764090"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Call Now
            </a>
          </div>
        </div>
      )
    }
  ];

  const handleFinish = () => {
    localStorage.setItem('chopconnect_onboarded', 'true');
    onClose();
    if (currentUser?.role === 'SELLER') navigate('/seller');
    else if (currentUser?.role === 'RIDER') navigate('/rider');
    else navigate('/buyer');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Header with Step Indicator and Close */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-black uppercase tracking-wider">
                {current.badge}
              </span>
              <span className="text-xs text-[#79747E] font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
              title="Skip onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-black text-[#1C1B1F] tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs text-[#79747E] mt-1 leading-relaxed">
              {current.subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[260px] flex flex-col justify-center">
            {current.content}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-6 border-t border-neutral-100 mt-6">
          {/* Progress dots */}
          <div className="flex items-center justify-center space-x-1.5 mb-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-brand-500' : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#49454F] font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-2.5 text-[#79747E] hover:text-[#1C1B1F] font-semibold text-xs"
              >
                Skip Tour
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Start Using ChopConnect' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
