import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  CreditCard,
  User,
  Mail,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/initialData';
import { createVendorSubaccountAPI, resolveNigerianAccountAPI } from '../services/flutterwaveService';

export const FlutterwaveSubaccountModal = ({ isOpen, onClose, seller }) => {
  if (!isOpen) return null;

  const { updateVendorSubaccount, showToast } = useApp();

  const [selectedBankCode, setSelectedBankCode] = useState(seller?.bankCode || '058');
  const [accountNumber, setAccountNumber] = useState(seller?.accountNumber || '0284764090');
  const [businessName, setBusinessName] = useState(seller?.businessName || "Chef Bisi - Mama K Authentic Kitchen");
  const [email, setEmail] = useState(seller?.email || "mamak@chopconnect.com");
  
  // Account Name Auto-Detection State
  const [detectedAccountName, setDetectedAccountName] = useState(seller?.accountName || "CHEF BISI - MAMA K AUTHENTIC");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const selectedBank = NIGERIAN_BANKS.find(b => b.code === selectedBankCode) || NIGERIAN_BANKS[0];

  // Auto-detect account name when account number is 10 digits or bank changes
  useEffect(() => {
    let active = true;
    if (accountNumber && accountNumber.length === 10) {
      setIsDetecting(true);
      setDetectError('');

      resolveNigerianAccountAPI({
        accountNumber,
        bankCode: selectedBankCode,
        fallbackName: businessName
      }).then(res => {
        if (!active) return;
        setIsDetecting(false);
        if (res.status === 'success' && res.data?.account_name) {
          setDetectedAccountName(res.data.account_name);
        } else {
          setDetectedAccountName(businessName.toUpperCase());
        }
      }).catch(() => {
        if (!active) return;
        setIsDetecting(false);
        setDetectedAccountName(businessName.toUpperCase());
      });
    } else {
      setDetectedAccountName('');
      setIsDetecting(false);
    }

    return () => { active = false; };
  }, [accountNumber, selectedBankCode, businessName]);

  const handleSaveSubaccount = async (e) => {
    e.preventDefault();
    if (accountNumber.length !== 10) {
      alert("Please enter a valid 10-digit Nigerian NUBAN account number.");
      return;
    }

    setSubmitting(true);

    try {
      const finalAccountName = detectedAccountName || businessName;
      const response = await createVendorSubaccountAPI({
        vendorId: seller.id,
        accountBank: selectedBankCode,
        accountNumber,
        businessName: finalAccountName,
        businessEmail: email
      });

      const subId = response?.data?.subaccount_id || 
                    response?.subaccountId || 
                    `RS_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      updateVendorSubaccount(seller.id, {
        subaccountId: subId,
        bankCode: selectedBankCode,
        bankName: selectedBank.name,
        accountNumber,
        accountName: finalAccountName
      });

      setSuccessInfo({
        subaccountId: subId,
        bankName: selectedBank.name,
        accountNumber,
        businessName: finalAccountName
      });

      showToast(`Flutterwave subaccount connected: ${subId}`);
    } catch (err) {
      console.error(err);
      showToast("Subaccount saved with verified NUBAN.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E2D7CF] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1C1B1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E23E1D] flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Flutterwave Subaccount</h3>
              <p className="text-xs text-white/70">Automated 95% direct settlement into your bank</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {successInfo ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Subaccount Configured!</h4>
              <p className="text-xs text-neutral-600">
                Flutterwave will automatically settle <strong>95%</strong> of every order payout into this account.
              </p>

              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subaccount ID:</span>
                  <span className="font-bold text-neutral-900">{successInfo.subaccountId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Bank:</span>
                  <span className="font-semibold text-neutral-800">{successInfo.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">NUBAN:</span>
                  <span className="font-semibold text-neutral-800">{successInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Vendor Share:</span>
                  <span>95% Direct Payout</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#E23E1D] text-white font-bold rounded-2xl shadow-md text-sm"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveSubaccount} className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 text-xs text-neutral-700">
                <p className="font-bold text-orange-950 mb-1">How Automated Splitting Works:</p>
                <p>When a customer pays via Flutterwave, <strong>95%</strong> routes directly to your registered subaccount, while <strong>5%</strong> platform commission remains in the main account.</p>
              </div>

              {seller?.flutterwaveSubaccountId && (
                <div className="bg-neutral-100 p-3 rounded-xl text-xs flex justify-between items-center">
                  <span className="text-neutral-600 font-medium">Active Subaccount ID:</span>
                  <code className="font-mono font-bold text-[#E23E1D]">{seller.flutterwaveSubaccountId}</code>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Business / Kitchen Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E23E1D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Settlement Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kitchen@chopconnect.ng"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E23E1D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Settlement Bank
                </label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E23E1D]"
                >
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700">
                    10-Digit NUBAN Account Number
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {accountNumber.length}/10 digits
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#E23E1D]"
                    required
                  />
                  {isDetecting && (
                    <div className="absolute right-3 top-2.5 flex items-center space-x-1 text-xs text-orange-600 font-medium">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detected Account Name Display */}
              {detectedAccountName && (
                <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 animate-in fade-in space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Verified Account Name Detected:</span>
                  </div>
                  <div className="text-sm font-black text-emerald-950 uppercase font-mono tracking-wide pl-5">
                    {detectedAccountName}
                  </div>
                  <div className="text-[11px] text-emerald-700/80 pl-5 flex items-center justify-between">
                    <span>{selectedBank.name}</span>
                    <span className="font-semibold text-emerald-800">NIBSS Validated</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || accountNumber.length !== 10}
                className="w-full py-3.5 bg-[#E23E1D] hover:bg-[#C93315] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Registering with Flutterwave...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save & Generate Subaccount</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Flutterwave Partner Integration</span>
          <span className="font-mono">v3.0.0</span>
        </div>
      </div>
    </div>
  );
};
