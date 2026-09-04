import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bike, 
  DollarSign, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Phone, 
  TrendingUp,
  Package 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RiderDashboard = () => {
  const { orders, bids, currentUser, updateOrderStatus } = useApp();
  const navigate = useNavigate();

  // Orders assigned to this rider
  const assignedOrders = orders.filter(o => o.riderId === currentUser.id);
  const activeDeliveries = assignedOrders.filter(o => ['RIDER_ASSIGNED', 'ON_THE_WAY'].includes(o.status));
  const completedDeliveries = assignedOrders.filter(o => o.status === 'DELIVERED');

  const totalEarnings = completedDeliveries.reduce((sum, o) => sum + (o.deliveryFee || 4.50), 0) + 85.50; // includes past baseline

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      
      {/* Rider Top Banner */}
      <div className="bg-gradient-to-r from-delivery-700 via-delivery-600 to-delivery-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-delivery-100 text-xs font-semibold mb-2">
            <Bike className="w-3.5 h-3.5" />
            <span>Courier Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{currentUser?.name}</h1>
          <p className="text-xs text-delivery-100 mt-0.5">
            Vehicle: <span className="font-bold">{currentUser?.vehicleType || 'Motorcycle'}</span> • Active & Online for Delivery
          </p>
        </div>

        <Link
          to="/rider/deliveries"
          className="px-5 py-3 bg-white text-delivery-600 hover:bg-neutral-100 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center space-x-2"
        >
          <span>Find Available Deliveries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Total Earnings</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">${totalEarnings.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +18% tips & delivery fees
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Active Deliveries</span>
            <div className="p-2 bg-delivery-50 text-delivery-600 rounded-xl">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-delivery-600">{activeDeliveries.length}</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">In progress right now</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Completed Trips</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">{142 + completedDeliveries.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">99.4% on-time delivery</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Courier Rating</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">4.9</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">Top Rated Courier</span>
        </div>
      </div>

      {/* Active Tasks & Trips */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-extrabold text-[#1C1B1F] flex items-center space-x-2">
            <Package className="w-5 h-5 text-delivery-500" />
            <span>Active Deliveries In Hand ({activeDeliveries.length})</span>
          </h2>
          <Link to="/rider/deliveries" className="text-xs font-bold text-delivery-600 hover:underline">
            View All Open Trips
          </Link>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100">
            <Bike className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1C1B1F]">No active delivery in transit</p>
            <p className="text-[11px] text-[#79747E] mt-0.5">
              Check the available deliveries board to submit competitive bids.
            </p>
            <Link
              to="/rider/deliveries"
              className="inline-block mt-3 px-4 py-2 bg-delivery-500 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Browse Open Deliveries
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-delivery-200 bg-delivery-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-[#1C1B1F]">Order #{order.id}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-delivery-600 text-white">
                      {order.status.replace(/_/g, ' ')}
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
                    <span className="text-base font-extrabold text-[#1C1B1F]">
                      ${(order.deliveryFee || 4.50).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#79747E] block">Your Courier Fee</span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
