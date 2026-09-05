import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Clock, 
  X,
  AlertCircle
} from 'lucide-react';
import { formatNaira } from '../context/AppContext';

export const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess, customerName, customerPhone }) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'transfer', 'cash'
  
  // Card Details State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(customerName || 'Chief Amara Okonkwo');
  const [cardPin, setCardPin] = useState('');
  const [cardStage, setCardStage] = useState('input'); // 'input', 'otp', 'processing', 'success'
  const [otpCode, setOtpCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Bank Transfer Details
  const virtualAccount = {
    bankName: "Wema Bank / Providus Bank",
    accountNumber: "0284764090",
    accountName: "ChopConnect Escrow / Order Payment",
    reference: `CC-NGN-${Math.floor(100000 + Math.random() * 900000)}`
  };

  // 10-minute timer for transfer
  const [secondsLeft, setSecondsLeft] = useState(600);
  useEffect(() => {
    if (paymentMethod === 'transfer') {
      const timer = setInterval(() => {
        setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert("Please enter a valid 16-digit MasterCard or Visa card number.");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      alert("Please enter a valid card expiry date (MM/YY).");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      alert("Please enter a valid 3-digit CVV.");
      return;
    }

    setProcessing(true);
    // Simulate secure 3D Secure / OTP Challenge
    setTimeout(() => {
      setProcessing(false);
      setCardStage('otp');
    }, 1200);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      alert("Please enter the 4-6 digit SMS OTP sent to your phone.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCardStage('success');
      setTimeout(() => {
        onPaymentSuccess({
          method: 'Mastercard Debit',
          reference: `CC-MC-${Date.now().toString().slice(-8)}`
        });
      }, 1000);
    }, 1500);
  };

  const handleTransferConfirmed = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess({
        method: 'Instant Bank Transfer',
        reference: virtualAccount.reference
      });
    }, 1800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2D7CF] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1C1B1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold">
              ₦
            </div>
            <div>
              <h3 className="font-bold text-base">Complete Payment</h3>
              <p className="text-xs text-white/70">Secured with 256-bit Bank Encryption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to Pay Banner */}
        <div className="bg-brand-50 border-b border-brand-100 px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-900">Total Payable:</span>
          <span className="text-2xl font-black text-brand-600">{formatNaira(totalAmount)}</span>
        </div>

        {/* Payment Method Selector */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setPaymentMethod('card'); setCardStage('input'); }}
              className={`p-3 rounded-2xl border text-center transition-all ${
                paymentMethod === 'card' 
                  ? 'border-brand-500 bg-brand-50/70 text-brand-600 font-bold ring-2 ring-brand-500/20 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1 text-brand-500" />
              <span className="text-xs block font-bold">Mastercard</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                paymentMethod === 'transfer' 
                  ? 'border-brand-500 bg-brand-50/70 text-brand-600 font-bold ring-2 ring-brand-500/20 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <span className="text-xs block font-bold">Bank Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                paymentMethod === 'cash' 
                  ? 'border-brand-500 bg-brand-50/70 text-brand-600 font-bold ring-2 ring-brand-500/20 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs block font-bold">Cash Delivery</span>
            </button>
          </div>

          {/* MASTERCARD FLOW */}
          {paymentMethod === 'card' && (
            <div>
              {cardStage === 'input' && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div className="bg-gradient-to-r from-[#1C1B1F] via-[#2A292E] to-[#1C1B1F] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/80 -mr-4"></div>
                        <div className="w-8 h-8 rounded-full bg-amber-500/80"></div>
                        <span className="text-xs font-bold tracking-wider uppercase ml-3">mastercard</span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">Debit Card</span>
                    </div>

                    <div className="font-mono text-lg tracking-widest mb-4">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase">Card Holder</span>
                        <span className="font-semibold">{cardName || "NAME ON CARD"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase">Expires</span>
                        <span className="font-mono font-semibold">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="5399 0000 0000 0000"
                          maxLength={19}
                          className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          required
                        />
                        <div className="absolute right-3 top-3 flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                          <div className="w-4 h-4 rounded-full bg-amber-500 -ml-2"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">CVV (3 Digits)</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Cardholder Full Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Chief Amara Okonkwo"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{processing ? "Verifying Card..." : `Pay ${formatNaira(totalAmount)} with Mastercard`}</span>
                  </button>
                </form>
              )}

              {cardStage === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-lg text-neutral-900">Mastercard SecureCode / 3D-Secure</h4>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                    An OTP has been sent to your registered phone number (+234 802 476 4090). Enter the verification code below to authorize this payment.
                  </p>

                  <div className="py-3">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-48 text-center tracking-[0.5em] text-2xl font-bold font-mono py-3 border-2 border-brand-500 rounded-2xl focus:outline-none"
                      autoFocus
                    />
                    <p className="text-[11px] text-neutral-400 mt-2">Test OTP: Any 4-6 digits (e.g. 123456)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{processing ? "Authorizing Payment..." : "Authorize & Complete Order"}</span>
                  </button>
                </form>
              )}

              {cardStage === 'success' && (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-xl font-extrabold text-neutral-900">Payment Successful!</h4>
                  <p className="text-xs text-neutral-600">Your Mastercard was debited {formatNaira(totalAmount)}.</p>
                </div>
              )}
            </div>
          )}

          {/* DIRECT NIGERIAN BANK TRANSFER */}
          {paymentMethod === 'transfer' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold">Instant Bank Transfer Instructions:</p>
                  <p>Transfer the exact amount to the dedicated ChopConnect account below from any Nigerian banking app (OPay, Kuda, GTBank, Zenith, etc.).</p>
                </div>
              </div>

              {/* Dynamic Bank Account Card */}
              <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-3.5 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Bank Name</span>
                  <span className="font-bold text-sm text-amber-400">{virtualAccount.bankName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Account Number</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-xl text-white tracking-wider">{virtualAccount.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(virtualAccount.accountNumber)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs flex items-center space-x-1"
                      title="Copy Account Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedAccount ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Account Name</span>
                  <span className="font-semibold text-xs text-white">{virtualAccount.accountName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Amount Due</span>
                  <span className="font-black text-lg text-emerald-400">{formatNaira(totalAmount)}</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-neutral-600 bg-neutral-100 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-brand-500 animate-spin" />
                <span>Account expires in: <strong className="text-brand-600">{formatTimer(secondsLeft)}</strong></span>
              </div>

              <button
                type="button"
                onClick={handleTransferConfirmed}
                disabled={processing}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{processing ? "Verifying Bank Deposit..." : "I Have Sent The Money"}</span>
              </button>
            </div>
          )}

          {/* CASH ON DELIVERY */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Banknote className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-lg text-neutral-900">Cash on Delivery</h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                You will hand over exact cash of <strong className="text-neutral-900">{formatNaira(totalAmount)}</strong> to your assigned courier upon physical delivery inspection at your doorstep.
              </p>

              <button
                type="button"
                onClick={() => onPaymentSuccess({ method: 'Cash On Delivery', reference: `COD-${Date.now().toString().slice(-6)}` })}
                className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Cash on Delivery</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ChopConnect 100% Buyer Protection</span>
          </span>
          <span>Support: +234 802 476 4090</span>
        </div>
      </div>
    </div>
  );
};
