import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatusStepper } from '../../components/OrderStatusStepper';
import { 
  Package, 
  Bike, 
  Star, 
  Clock, 
  Check, 
  MapPin, 
  Store, 
  Phone, 
  ChevronRight,
  MessageSquarePlus,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderTracking = () => {
  const { orders, bids, acceptRiderBid, currentUser, addReview } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState(101);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTarget, setReviewTarget] = useState('SELLER'); // 'SELLER' or 'RIDER'

  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id || !o.buyerId);
  const activeOrder = buyerOrders.find(o => o.id === selectedOrderId) || buyerOrders[0];
  const orderBids = bids.filter(b => b.orderId === activeOrder?.id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!activeOrder) return;
    addReview({
      orderId: activeOrder.id,
      targetType: reviewTarget,
      targetId: reviewTarget === 'SELLER' ? activeOrder.sellerId : (activeOrder.riderId || 3),
      targetName: reviewTarget === 'SELLER' ? activeOrder.sellerName : (activeOrder.riderName || "Tunde Swift"),
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewModalOpen(false);
    setReviewComment('');
  };

  if (buyerOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[#1C1B1F]">No orders placed yet</h2>
        <p className="text-xs text-[#79747E] mt-1">Browse menus and place an order to track delivery here.</p>
        <Link
          to="/buyer"
          className="inline-block mt-4 px-6 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Go to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Order Tracking & Live Dispatch</h1>
          <p className="text-xs text-[#79747E]">Monitor food prep and pick from competing courier delivery bids</p>
        </div>

        {/* Order Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {buyerOrders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeOrder?.id === order.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white border border-[#E2D7CF] text-[#49454F] hover:bg-neutral-50'
              }`}
            >
              Order #{order.id}
            </button>
          ))}
        </div>
      </div>

      {activeOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Tracking Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Stepper Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Order #{activeOrder.id}
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1C1B1F] mt-0.5">
                    {activeOrder.sellerName}
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Visual Stepper */}
              <OrderStatusStepper status={activeOrder.status} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100 text-xs">
                <div className="flex items-start space-x-2 text-[#49454F]">
                  <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C1B1F]">Delivery Address</span>
                    <p className="text-[#79747E] mt-0.5">{activeOrder.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-[#49454F]">
                  <Clock className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C1B1F]">Order Time</span>
                    <p className="text-[#79747E] mt-0.5">
                      {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Delivery Bids Section (Interactive P2P Feature) */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1C1B1F] flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-delivery-500" />
                    <span>Courier Bids for this Delivery</span>
                  </h3>
                  <p className="text-xs text-[#79747E] mt-0.5">
                    Couriers compete to offer the best price and fastest ETA. Select your preferred rider.
                  </p>
                </div>
              </div>

              {orderBids.length === 0 ? (
                <div className="p-6 text-center bg-delivery-50/50 rounded-2xl border border-delivery-100">
                  <Clock className="w-6 h-6 text-delivery-500 mx-auto mb-1 animate-pulse" />
                  <p className="text-xs font-bold text-delivery-700">Awaiting nearby couriers to place bids...</p>
                  <p className="text-[11px] text-[#79747E] mt-0.5">Bids usually arrive in 1-2 minutes.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderBids.map((bid) => {
                    const isAssigned = activeOrder.riderId === bid.riderId || bid.status === 'ACCEPTED';
                    return (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isAssigned
                            ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                            : 'bg-white border-[#E2D7CF] hover:border-delivery-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-delivery-100 text-delivery-600 flex items-center justify-center font-bold text-sm">
                            {bid.riderName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-sm text-[#1C1B1F]">{bid.riderName}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                {bid.vehicleType}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-[#79747E] mt-0.5">
                              <span className="flex items-center font-bold text-amber-600">
                                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-0.5" />
                                {bid.riderRating}
                              </span>
                              <span>•</span>
                              <span>{bid.completedDeliveries} completed</span>
                              <span>•</span>
                              <span className="font-semibold text-emerald-600">{bid.etaMinutes} mins ETA</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-base font-extrabold text-[#1C1B1F]">
                              ${bid.fee.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[#79747E] block">delivery fee</span>
                          </div>

                          {isAssigned ? (
                            <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Assigned Courier</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => acceptRiderBid(activeOrder.id, bid.id)}
                              className="px-4 py-2 bg-delivery-500 hover:bg-delivery-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                              Accept Bid
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Assigned Courier Details Card */}
            {activeOrder.riderName && (
              <div className="bg-white rounded-3xl p-5 border border-emerald-200 bg-emerald-50/30 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active Courier</span>
                    <h4 className="font-bold text-sm text-[#1C1B1F]">{activeOrder.riderName}</h4>
                    <p className="text-xs text-[#79747E]">Estimated Delivery: {activeOrder.riderEta || '18 mins'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="tel:+15553456789"
                    className="p-2.5 bg-white rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm transition-colors"
                    title="Call Courier"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-[#1C1B1F]">Order Details</h3>

              <div className="space-y-3 pb-4 border-b border-neutral-100 text-xs text-[#49454F]">
                {activeOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-[#1C1B1F]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-[#49454F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${activeOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">${activeOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100 font-extrabold text-sm text-[#1C1B1F]">
                  <span>Total</span>
                  <span className="text-brand-600">
                    ${(activeOrder.subtotal + activeOrder.deliveryFee).toFixed(2)}
                  </span>
                </div>
              </div>

              {activeOrder.notes && (
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
                  <span className="font-bold text-[#1C1B1F] block mb-0.5">Order Notes:</span>
                  <p className="text-[#79747E]">{activeOrder.notes}</p>
                </div>
              )}

              {/* Rate & Review Button */}
              <button
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1B1F] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-500" />
                <span>Rate Kitchen or Courier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-100">
            <h3 className="text-base font-extrabold text-[#1C1B1F] mb-1">Leave a Review</h3>
            <p className="text-xs text-[#79747E] mb-4">Share your feedback to support local kitchens and couriers.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex rounded-xl bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => setReviewTarget('SELLER')}
                  className={`w-1/2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reviewTarget === 'SELLER' ? 'bg-white text-brand-600 shadow-sm' : 'text-[#79747E]'
                  }`}
                >
                  Kitchen
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTarget('RIDER')}
                  className={`w-1/2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reviewTarget === 'RIDER' ? 'bg-white text-delivery-600 shadow-sm' : 'text-[#79747E]'
                  }`}
                >
                  Courier
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-amber-400 stroke-amber-500'
                            : 'stroke-neutral-300 fill-none'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Your Feedback</label>
                <textarea
                  required
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="The food was hot and delicious..."
                  className="w-full p-2.5 rounded-xl border border-[#E2D7CF] text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-[#49454F] bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-brand-500 rounded-xl shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
