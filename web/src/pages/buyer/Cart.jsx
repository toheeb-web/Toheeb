import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, currentUser, showToast } = useApp();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '14 Metro Boulevard, Apt 4B, Downtown');
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedDelivery = cart.length > 0 ? 4.50 : 0.00;
  const total = subtotal + estimatedDelivery;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }
    if (!deliveryAddress.trim()) {
      showToast("Please provide a delivery address.");
      return;
    }

    setIsPlacing(true);
    const order = placeOrder({ deliveryAddress, notes });
    setIsPlacing(false);
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
          Explore delicious African delicacies and add items to your cart.
        </p>
        <Link
          to="/buyer"
          className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Marketplace</span>
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
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Shopping Cart</h1>
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
                    ${(item.price * item.quantity).toFixed(2)}
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

          {/* Delivery Details Section */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1C1B1F] flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>Delivery Destination</span>
            </h3>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your street address, apartment, or landmark"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <h3 className="text-sm font-bold text-[#1C1B1F] flex items-center space-x-2 pt-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Kitchen & Delivery Instructions (Optional)</span>
            </h3>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please add extra pepper sauce; ring the doorbell on arrival."
              className="w-full px-4 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm h-fit space-y-4">
          <h2 className="text-base font-extrabold text-[#1C1B1F]">Order Summary</h2>

          <div className="space-y-2.5 text-sm text-[#49454F] pb-4 border-b border-neutral-100">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery Fee</span>
              <span className="font-semibold">${estimatedDelivery.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-[#79747E]">
              * Couriers will submit competitive bids once the kitchen accepts your order.
            </p>
          </div>

          <div className="flex justify-between items-center text-lg font-extrabold text-[#1C1B1F]">
            <span>Total</span>
            <span className="text-brand-600">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isPlacing}
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>{isPlacing ? 'Placing Order...' : 'Place Order & Request Bids'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
