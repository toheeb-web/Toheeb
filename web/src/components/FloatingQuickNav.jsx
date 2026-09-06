import React, { useState } from 'react';
import { Compass, HelpCircle, Phone, Menu, Sparkles } from 'lucide-react';

export const FloatingQuickNav = ({ onOpenNav, onOpenOnboarding }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end space-y-2">
      {/* Expanded Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col items-end space-y-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => { setIsOpen(false); onOpenOnboarding(); }}
            className="flex items-center space-x-2 bg-white text-[#1C1B1F] px-3.5 py-2 rounded-2xl shadow-xl border border-neutral-200 text-xs font-bold hover:bg-brand-50 hover:text-brand-600 transition-all hover:scale-105"
          >
            <span>App Tour / Guide</span>
            <div className="p-1.5 bg-brand-100 text-brand-700 rounded-xl">
              <Compass className="w-4 h-4" />
            </div>
          </button>

          <a
            href="tel:+2348024764090"
            className="flex items-center space-x-2 bg-white text-[#1C1B1F] px-3.5 py-2 rounded-2xl shadow-xl border border-neutral-200 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all hover:scale-105"
          >
            <span>Call Helpline</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          <button
            onClick={() => { setIsOpen(false); onOpenNav(); }}
            className="flex items-center space-x-2 bg-white text-[#1C1B1F] px-3.5 py-2 rounded-2xl shadow-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-100 transition-all hover:scale-105"
          >
            <span>Full Navigation Hub</span>
            <div className="p-1.5 bg-neutral-900 text-white rounded-xl">
              <Menu className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-black transition-all hover:scale-105 ${
          isOpen
            ? 'bg-neutral-900 text-white ring-4 ring-neutral-900/20'
            : 'bg-gradient-to-r from-brand-600 to-amber-600 text-white ring-4 ring-brand-500/25'
        }`}
        title="Quick Navigation & Onboarding Guide"
      >
        <Compass className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
        <span className="tracking-wide">Quick Navigation</span>
      </button>
    </div>
  );
};
