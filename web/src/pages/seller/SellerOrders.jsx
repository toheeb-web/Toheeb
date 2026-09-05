import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  ClipboardList, 
  ChefHat, 
  PackageCheck, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Bike,
  ShieldCheck
} from 'lucide-react';

export const SellerOrders = () => {
  const { orders, updateOrderStatus, sellers, currentUser } = useApp();
  const [filter, setFilter] = useState('ALL');

  const currentSeller = sellers.find(s => s.userId === currentUser?.id) || sellers[0];
  const sellerOrders = orders.filter(o => o.sellerId === currentSeller?.id);

  const filteredOrders = sellerOrders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'NEW') return order.status === 'PLACED';
    if (filter === 'KITCHEN') return ['ACCEPTED', 'PREPARING'].includes(order.status);
    if (filter === 'READY') return ['READY_FOR_DELIVERY', 'RIDER_ASSIGNED', 'PICKED_UP'].includes(order.status);
    if (filter === 'COMPLETED') return order.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Incoming Kitchen Orders</h1>
          <p className="text-xs text-[#79747E]">Accept orders, update food prep, and dispatch to verified Nigerian couriers</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'NEW', label: 'New Requests' },
            { id: 'KITCHEN', label: 'Cooking' },
            { id: 'READY', label: 'Courier Dispatch' },
            { id: 'COMPLETED', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white border border-[#E2D7CF] text-[#49454F] hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2D7CF]">
          <ClipboardList className="w-12 h-12 text-[#79747E] mx-auto mb-2 opacity-50" />
          <h3 className="font-extrabold text-base text-[#1C1B1F]">No orders in this category</h3>
          <p className="text-xs text-[#79747E] mt-1">Orders will appear here in real-time as customers place orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const subtotal = order.subtotal || 0;
            const commission = Math.round(subtotal * 0.05);
            const netEarnings = subtotal - commission;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2D7CF] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-[#1C1B1F]">Order #{order.id}</span>
                    <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.paymentMethod === 'CARD' ? '💳 Mastercard' : order.paymentMethod === 'TRANSFER' ? '🏦 NIP Transfer' : '💵 Cash'}
                    </span>
                    <span className="text-xs text-[#79747E]">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[#1C1B1F]">
                    {order.itemsSummary}
                  </div>

                  {order.notes && (
                    <p className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                      Special Note: {order.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#79747E] pt-1">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
                      {order.deliveryAddress}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-brand-500" />
                      {order.buyerName} ({order.buyerPhone || "+234 802 476 4090"})
                    </span>
                    {order.riderName && (
                      <span className="flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <Bike className="w-3.5 h-3.5 mr-1" />
                        Courier: {order.riderName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions & Amount */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-[#79747E] block">Your 95% Net Payout</span>
                    <span className="text-xl font-black text-brand-600">
                      {formatNaira(netEarnings)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Gross: {formatNaira(subtotal)} • 5% Fee: {formatNaira(commission)}
                    </span>
                  </div>

                  {/* Contextual Status Progression Buttons */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    {order.status === 'PLACED' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>Accept & Cook</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                          className="px-3 py-2.5 bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-[#49454F] rounded-xl text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {['ACCEPTED', 'PREPARING'].includes(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY_FOR_DELIVERY')}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Ready For Courier</span>
                      </button>
                    )}

                    {order.status === 'READY_FOR_DELIVERY' && (
                      <span className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Couriers Bidding (₦1,500 Fee)...</span>
                      </span>
                    )}

                    {order.status === 'RIDER_ASSIGNED' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ON_THE_WAY')}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Handed to Courier</span>
                      </button>
                    )}

                    {order.status === 'ON_THE_WAY' && (
                      <span className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
                        En Route to Customer
                      </span>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
