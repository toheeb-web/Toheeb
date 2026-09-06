import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  CreditCard,
  ShieldCheck,
  Phone,
  Navigation
} from 'lucide-react';
import { PaymentModal } from '../../components/PaymentModal';
import { LocationVerifier } from '../../components/LocationVerifier';

export const Cart = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    placeOrder, 
    sellers,
    currentUser, 
    verifiedLocation,
    showToast 
  } = useApp();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(verifiedLocation?.streetAddress || currentUser?.address || '14 Admiralty Way, Lekki Phase 1, Lagos');
  const [notes, setNotes] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 1500 : 0; // Customer pays ₦1,500 delivery fee
  const total = subtotal + deliveryFee;

  const primarySeller = sellers?.find(s => s.id === cart[0]?.sellerId) || sellers?.[0];

  const handleInitiatePayment = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }
    if (!deliveryAddress.trim()) {
      showToast("Please enter a verified delivery address.");
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = ({ method, reference, flutterwaveId, subaccountId, status }) => {
    setIsPaymentOpen(false);
    const order = placeOrder({ 
      deliveryAddress, 
      notes,
      paymentMethod: method || "Flutterwave Checkout",
      transactionRef: reference,
      flutterwaveId,
      subaccountId: subaccountId || primarySeller?.flutterwaveSubaccountId,
      paymentStatus: status || "PAID"
    });
    if (order) {
      navigate('/buyer/orders');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1C1B1F]">Your cart is empty</h2>
        <p className="text-xs text-[#79747E] mt-1 max-w-sm mx-auto">
          Explore delicious Nigerian delicacies, party jollof, suya, and soups.
        </p>
        <Link
          to="/buyer"
          className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Food Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link to="/buyer" className="p-2 bg-white rounded-xl border border-[#E2D7CF] text-[#49454F] hover:text-[#1C1B1F]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Order Checkout</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.foodId}
              className="bg-white rounded-3xl p-4 border border-[#E2D7CF] shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3.5">
                <img
                  src={item.image || "/food_jollof_1788517799135.jpg"}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#1C1B1F] line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-[#79747E]">{item.sellerName}</p>
                  <p className="text-sm font-extrabold text-brand-600 mt-1">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-neutral-100 rounded-xl px-2 py-1">
                  <button
                    onClick={() => updateCartQuantity(item.foodId, -1)}
                    className="p-1 text-[#49454F] hover:text-brand-500"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.foodId, 1)}
                    className="p-1 text-[#49454F] hover:text-brand-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.foodId)}
                  className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Details Section with GPS Verification */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C1B1F] flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Verified Delivery Destination</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLocationOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Change / GPS Verify</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter street address, apartment, or landmark in Lagos or Abuja"
                className="w-full px-4 py-3 rounded-xl border border-[#E2D7CF] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="mt-2 flex items-center space-x-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Area: {verifiedLocation.area}, {verifiedLocation.city}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-[#1C1B1F] flex items-center space-x-2 pt-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Special Kitchen / Courier Instructions</span>
            </h3>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please include extra spicy yaji pepper sauce; call +234 802 476 4090 at security gate."
              className="w-full px-4 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Order Summary & Payment Button */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm h-fit space-y-4">
          <h2 className="text-base font-extrabold text-[#1C1B1F]">Order Summary</h2>

          <div className="space-y-3 text-sm text-[#49454F] pb-4 border-b border-neutral-100">
            <div className="flex justify-between">
              <span>Food Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatNaira(subtotal)}</span>
            </div>
            
            {/* Delivery fee breakdown */}
            <div className="flex justify-between">
              <span>Express Delivery Fee</span>
              <span className="font-bold text-neutral-900">{formatNaira(deliveryFee)}</span>
            </div>
            <div className="bg-neutral-50 rounded-xl p-2.5 text-[11px] text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>Driver receives:</span>
                <span className="font-bold text-emerald-700">{formatNaira(1100)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>ChopConnect platform fee:</span>
                <span>{formatNaira(400)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-black text-[#1C1B1F]">
            <span>Total Payable</span>
            <span className="text-brand-600 text-xl">{formatNaira(total)}</span>
          </div>

          <button
            onClick={handleInitiatePayment}
            className="w-full py-4 bg-[#E23E1D] hover:bg-[#C93315] active:scale-[0.99] text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay with Flutterwave (95% Split)</span>
          </button>

          <div className="pt-2 text-center text-xs text-neutral-500 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Flutterwave Secure Nigerian Checkout</span>
          </div>

          <div className="pt-2 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
            Order Help: <a href="tel:+2348024764090" className="font-bold text-brand-600">+234 802 476 4090</a>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={total}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        vendorSubaccountId={primarySeller?.flutterwaveSubaccountId || "RS_0B48B9284F3B"}
        vendorName={primarySeller?.businessName || "Vendor Kitchen"}
        sellerId={primarySeller?.id}
        onPaymentSuccess={handlePaymentSuccess}
        customerName={currentUser?.name}
        customerEmail={currentUser?.email || "customer@chopconnect.ng"}
        customerPhone={currentUser?.phone || "+234 802 476 4090"}
      />

      {/* Location Verifier */}
      <LocationVerifier
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
};
