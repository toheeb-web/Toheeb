import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  Bike, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Send, 
  Sparkles, 
  Store, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2,
  Phone
} from 'lucide-react';

export const AvailableDeliveries = () => {
  const { orders, bids, submitRiderBid, currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('OPEN'); // 'OPEN' or 'MY_BIDS'
  const [biddingOrder, setBiddingOrder] = useState(null);
  const [fee, setFee] = useState('1500');
  const [etaMinutes, setEtaMinutes] = useState('20');

  // Open orders looking for couriers (either READY_FOR_DELIVERY, PLACED, or PREPARING)
  const openOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'REJECTED');
  
  // Bids submitted by current rider
  const myBids = bids.filter(b => b.riderId === currentUser?.id);

  const handleOpenBidModal = (order) => {
    setBiddingOrder(order);
    setFee('1500');
    setEtaMinutes('20');
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (!biddingOrder || !fee || !etaMinutes) {
      showToast("Please enter your delivery fee and estimated time.");
      return;
    }

    submitRiderBid({
      orderId: biddingOrder.id,
      fee: parseFloat(fee),
      etaMinutes: parseInt(etaMinutes, 10)
    });

    setBiddingOrder(null);
    showToast("Delivery bid submitted to customer!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Courier Delivery Opportunities</h1>
          <p className="text-xs text-[#79747E]">
            Lagos & Abuja Dispatch • Standard fee ₦1,500 (You receive ₦1,100 net per trip)
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'OPEN' ? 'bg-white text-emerald-700 shadow-sm' : 'text-[#79747E]'
            }`}
          >
            Available Orders ({openOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('MY_BIDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'MY_BIDS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-[#79747E]'
            }`}
          >
            My Submitted Bids ({myBids.length})
          </button>
        </div>
      </div>

      {/* Available Deliveries Feed */}
      {activeTab === 'OPEN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openOrders.map((order) => {
            const existingBid = myBids.find(b => b.orderId === order.id);
            const totalBidsOnOrder = bids.filter(b => b.orderId === order.id).length;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-black text-emerald-700">
                      Order #{order.id}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 uppercase">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-xs">
                      <Store className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#79747E]">Pickup Kitchen</span>
                        <p className="font-bold text-[#1C1B1F]">{order.sellerName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#79747E]">Delivery Destination</span>
                        <p className="font-semibold text-[#1C1B1F] line-clamp-1">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs mb-4">
                    <span className="text-[10px] uppercase font-bold text-[#79747E] block mb-0.5">Package Items:</span>
                    <p className="text-[#49454F] line-clamp-2">{order.itemsSummary}</p>
                  </div>

                  {/* Split Preview */}
                  <div className="bg-emerald-50 rounded-xl p-2.5 text-[11px] text-emerald-900 mb-4 flex justify-between">
                    <span>Your Payout: <strong>{formatNaira(1100)}</strong></span>
                    <span className="text-emerald-700">Customer Total: {formatNaira(1500)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-[#79747E] font-medium">
                    {totalBidsOnOrder} {totalBidsOnOrder === 1 ? 'courier bid' : 'courier bids'}
                  </span>

                  {existingBid ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Bid Submitted ({formatNaira(existingBid.fee)})</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenBidModal(order)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Accept / Bid Trip</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Submitted Bids Tab */}
      {activeTab === 'MY_BIDS' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
          {myBids.length === 0 ? (
            <p className="text-xs text-[#79747E] py-8 text-center">You haven't submitted any delivery bids yet.</p>
          ) : (
            <div className="space-y-3">
              {myBids.map((bid) => (
                <div
                  key={bid.id}
                  className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#1C1B1F]">Bid on Order #{bid.orderId}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        bid.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                        bid.status === 'DECLINED' ? 'bg-neutral-200 text-neutral-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#79747E] mt-1">
                      Your ETA: {bid.etaMinutes} mins • Vehicle: {bid.vehicleType || 'Boxer 150cc'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-emerald-700">{formatNaira(bid.fee || 1500)}</span>
                    <span className="text-[10px] text-[#79747E] block">Trip delivery fee</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bidding Modal */}
      {biddingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-[#1C1B1F]">
                Bid on Order #{biddingOrder.id}
              </h3>
              <button
                onClick={() => setBiddingOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-[#1C1B1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3 text-xs text-emerald-900 mb-4 space-y-1">
              <div className="flex justify-between">
                <span>Standard Delivery Fee:</span>
                <span className="font-bold">{formatNaira(1500)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Driver Payout (You):</span>
                <span>{formatNaira(1100)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-[10px]">
                <span>ChopConnect Platform:</span>
                <span>{formatNaira(400)}</span>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Customer Delivery Charge (₦) *</label>
                <input
                  type="number"
                  step="100"
                  required
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Estimated ETA (minutes) *</label>
                <input
                  type="number"
                  required
                  value={etaMinutes}
                  onChange={(e) => setEtaMinutes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setBiddingOrder(null)}
                  className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#49454F] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
