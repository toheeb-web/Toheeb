import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Share2, 
  PlusSquare,
  ShieldCheck
} from 'lucide-react';

export const InstallAppModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Direct instructions for Android / iOS
      alert("To install ChopConnect on your phone:\n\n• On Chrome/Android: Tap menu (⋮) -> 'Install App' or 'Add to Home screen'.\n• On Safari/iPhone: Tap Share icon (⎋) -> 'Add to Home Screen'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E2D7CF] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-amber-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src="/chopconnect_icon_1788517538782.jpg"
            alt="ChopConnect"
            className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg ring-4 ring-white/30 object-cover"
          />
          <h3 className="font-black text-xl">Install ChopConnect App</h3>
          <p className="text-xs text-white/90 mt-1">
            Fast, native-like experience on your Android, iPhone, or Desktop
          </p>
        </div>

        {/* Perks */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5 text-xs text-neutral-700">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Instant ordering with 0% browser lag</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Real-time GPS delivery notifications & courier tracking</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Offline caching & quick home screen access</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleInstallClick}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Install / Add to Home Screen</span>
          </button>

          {/* Platform Specific Quick Guides */}
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="font-bold text-neutral-800 flex items-center space-x-1 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-brand-500" />
                <span>Android / Chrome</span>
              </span>
              <p>Tap three dots (⋮) in browser & select <strong>"Install App"</strong>.</p>
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="font-bold text-neutral-800 flex items-center space-x-1 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span>iPhone / Safari</span>
              </span>
              <p>Tap Share (⎋) & select <strong>"Add to Home Screen"</strong>.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
          Official Helpline: <strong>+234 802 476 4090</strong>
        </div>
      </div>
    </div>
  );
};
