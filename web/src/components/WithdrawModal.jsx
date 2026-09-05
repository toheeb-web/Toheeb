import React, { useState } from 'react';
import { 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  X, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useApp, formatNaira } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/initialData';

export const WithdrawModal = ({ isOpen, onClose, availableBalance, userRole }) => {
  if (!isOpen) return null;

  const { withdrawFunds, currentUser } = useApp();

  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(currentUser?.name || 'Chief Amara Okonkwo');
  const [amount, setAmount] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleAccountNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);

    if (val.length === 10) {
      setIsResolving(true);
      // Simulate NIBSS NUBAN name inquiry
      setTimeout(() => {
        setIsResolving(false);
        setAccountName(currentUser?.name || "Verified Account Holder");
      }, 600);
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }
    if (numAmount > availableBalance) {
      alert(`Amount exceeds your available balance of ${formatNaira(availableBalance)}.`);
      return;
    }
    if (accountNumber.length !== 10) {
      alert("Please enter a valid 10-digit Nigerian NUBAN account number.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const success = withdrawFunds({
        amount: numAmount,
        bankName: selectedBank,
        accountNumber,
        accountName
      });
      if (success) {
        setSuccessData({
          amount: numAmount,
          bankName: selectedBank,
          accountNumber,
          accountName,
          reference: `NIP-${Math.floor(10000000 + Math.random() * 90000000)}`
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E2D7CF] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1C1B1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Withdraw to Nigerian Bank</h3>
              <p className="text-xs text-white/70">Instant NIP Payout System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="bg-brand-50 border-b border-brand-100 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-900 block font-semibold">Available for Payout:</span>
            {userRole === 'SELLER' && (
              <span className="text-[11px] text-brand-700 font-medium">*5% ChopConnect commission already settled</span>
            )}
            {userRole === 'RIDER' && (
              <span className="text-[11px] text-brand-700 font-medium">*Net ₦1,100/trip delivery fee earnings</span>
            )}
          </div>
          <span className="text-2xl font-black text-brand-600">{formatNaira(availableBalance)}</span>
        </div>

        {/* Form Body or Success Receipt */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-neutral-900">Transfer Initiated!</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Your funds are being routed via Nigeria Inter-Bank Settlement System (NIBSS).
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 text-left space-y-2 text-xs border border-neutral-100">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount Sent:</span>
                  <span className="font-extrabold text-brand-600">{formatNaira(successData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination:</span>
                  <span className="font-bold">{successData.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Account:</span>
                  <span className="font-mono font-bold">{successData.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Beneficiary:</span>
                  <span className="font-semibold">{successData.accountName}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-200">
                  <span className="text-neutral-500">Reference:</span>
                  <span className="font-mono text-neutral-700">{successData.reference}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-2xl shadow-md transition-all text-sm"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Select Destination Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">10-Digit NUBAN Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="0123456789"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-mono tracking-wider focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Verified Account Name</label>
                <div className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-800 flex items-center justify-between">
                  <span>{isResolving ? "Checking NUBAN..." : (accountName || "Enter account number above")}</span>
                  {accountNumber.length === 10 && !isResolving && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-neutral-700">Amount to Withdraw (₦)</label>
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
                  >
                    Withdraw All
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. ₦1,000"
                  min="1000"
                  max={availableBalance}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || availableBalance < 1000}
                className="w-full py-4 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] disabled:bg-neutral-300 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <Building2 className="w-4 h-4" />
                <span>{submitting ? "Processing Transfer..." : `Withdraw Funds to Bank`}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant CBN/NIBSS Transfer</span>
          </span>
          <span>Inquiries: +234 802 476 4090</span>
        </div>
      </div>
    </div>
  );
};
