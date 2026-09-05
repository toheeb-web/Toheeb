import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  Bike, 
  Building2, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Phone, 
  TrendingUp,
  Package,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WithdrawModal } from '../../components/WithdrawModal';

export const RiderDashboard = () => {
  const { orders, currentUser, updateOrderStatus, transactions } = useApp();
  const navigate = useNavigate();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Orders assigned to this rider
  const assignedOrders = orders.filter(o => o.riderId === currentUser?.id || o.riderName === currentUser?.name);
  const activeDeliveries = assignedOrders.filter(o => ['RIDER_ASSIGNED', 'ON_THE_WAY'].includes(o.status));
  const completedDeliveries = assignedOrders.filter(o => o.status === 'DELIVERED');

  // Monetization formula: Driver receives ₦1,100 per completed delivery
  const earnedFromCompleted = completedDeliveries.length * 1100;
  const baselineEarnings = 11000; // Prior trips baseline: 10 trips = ₦11,000
  const grossTripEarnings = baselineEarnings + earnedFromCompleted;

  // Track past withdrawals
  const riderWithdrawals = transactions
    .filter(t => t.userId === currentUser?.id && t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = Math.max(0, grossTripEarnings - riderWithdrawals);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      
      {/* Rider Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-2">
            <Bike className="w-3.5 h-3.5" />
            <span>ChopConnect Express Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{currentUser?.name || "Tunde Swift"}</h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Courier Vehicle: <span className="font-bold">{currentUser?.vehicleType || 'Boxer 150cc'}</span> • Online for Nigerian Dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>Withdraw Trip Fees</span>
          </button>
          <Link
            to="/rider/deliveries"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Available Deliveries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-white/90 mb-2 font-bold">
            <span>Available Payout</span>
            <Building2 className="w-4 h-4 text-emerald-200" />
          </div>
          <p className="text-2xl font-black">{formatNaira(availableBalance)}</p>
          <span className="text-[10px] text-emerald-100 block mt-1">
            ₦1,100 net earned per delivery trip
          </span>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="mt-2 text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl backdrop-blur-md inline-flex items-center space-x-1"
          >
            <span>Transfer to Bank</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Active in Transit</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{activeDeliveries.length}</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">Orders currently on route</span>
        </div>

        {/* Completed Trips */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Total Deliveries</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">{10 + completedDeliveries.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">100% on-time completion</span>
        </div>

        {/* Courier Rating */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Courier Rating</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">4.9 / 5.0</p>
          <span className="text-[11px] text-amber-600 font-bold mt-1 block">Verified Nigerian Courier</span>
        </div>
      </div>

      {/* Delivery Fee Transparency Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-emerald-900">Standard Delivery Fee Split</h3>
            <p className="text-xs text-emerald-700">
              Customer pays <strong>{formatNaira(1500)}</strong> • You receive <strong>{formatNaira(1100)}</strong> • ChopConnect keeps <strong>{formatNaira(400)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <a
            href="tel:+2348024764090"
            className="font-bold text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            Dispatch Support: +234 802 476 4090
          </a>
        </div>
      </div>

      {/* Active Tasks & Trips */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-extrabold text-[#1C1B1F] flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Active Deliveries In Hand ({activeDeliveries.length})</span>
          </h2>
          <Link to="/rider/deliveries" className="text-xs font-bold text-emerald-600 hover:underline">
            View All Open Trips
          </Link>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100">
            <Bike className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1C1B1F]">No active delivery in transit</p>
            <p className="text-[11px] text-[#79747E] mt-0.5">
              Check the available deliveries board to accept food orders in Lagos and Abuja.
            </p>
            <Link
              to="/rider/deliveries"
              className="inline-block mt-3 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Browse Open Deliveries
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-[#1C1B1F]">Order #{order.id}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] font-bold text-neutral-600">
                      Payment: {order.paymentMethod === 'CARD' ? 'Mastercard' : order.paymentMethod === 'TRANSFER' ? 'Transfer' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1C1B1F]">
                    Pickup from: <span className="font-bold text-brand-600">{order.sellerName}</span>
                  </p>
                  <p className="text-xs text-[#79747E]">
                    Deliver to: <span className="font-bold text-[#1C1B1F]">{order.deliveryAddress}</span>
                  </p>
                  <p className="text-[11px] text-[#49454F]">{order.itemsSummary}</p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-700">
                      {formatNaira(1100)}
                    </span>
                    <span className="text-[10px] text-[#79747E] block">Your Take-Home Fee</span>
                  </div>

                  {order.status === 'RIDER_ASSIGNED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ON_THE_WAY')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Picked Up from Kitchen</span>
                    </button>
                  )}

                  {order.status === 'ON_THE_WAY' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivered</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/2348024764090?text=Hello%20Customer,%20your%20ChopConnect%20delivery%20for%20order%20%23${order.id}%20is%20on%20the%20way!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                    title="WhatsApp Customer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        userRole="RIDER"
      />
    </div>
  );
};
