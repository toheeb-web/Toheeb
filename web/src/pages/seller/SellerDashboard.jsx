import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  Building2, 
  ShoppingBag, 
  Star, 
  Store, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Percent,
  ArrowUpRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WithdrawModal } from '../../components/WithdrawModal';

export const SellerDashboard = () => {
  const { sellers, foods, orders, currentUser, updateSellerProfile, transactions } = useApp();
  const navigate = useNavigate();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const currentSeller = sellers.find(s => s.userId === currentUser?.id) || sellers[0];
  const sellerDishes = foods.filter(f => f.sellerId === currentSeller?.id);
  const sellerOrders = orders.filter(o => o.sellerId === currentSeller?.id);

  // Financial calculations with 5% commission
  const grossSales = sellerOrders
    .filter(o => o.status !== 'REJECTED')
    .reduce((sum, o) => sum + (o.subtotal || 0), 0);

  const totalCommission = Math.round(grossSales * 0.05);
  const netEarnings = grossSales - totalCommission;

  // Track past withdrawals
  const sellerWithdrawals = transactions
    .filter(t => t.userId === currentUser?.id && t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = Math.max(0, netEarnings - sellerWithdrawals);
  const pendingOrders = sellerOrders.filter(o => ['PLACED', 'ACCEPTED', 'PREPARING'].includes(o.status));

  const toggleStoreOpen = () => {
    updateSellerProfile(currentSeller.id, { isOpen: !currentSeller.isOpen });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      
      {/* Seller Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-[#E2D7CF] shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src={currentSeller?.image || "/chopconnect_hero_1788517559174.jpg"}
            alt={currentSeller?.businessName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-100"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-[#1C1B1F]">{currentSeller?.businessName}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                currentSeller?.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentSeller?.isOpen ? 'Kitchen Open For Orders' : 'Kitchen Paused'}
              </span>
            </div>
            <p className="text-xs text-[#79747E] mt-0.5">{currentSeller?.cuisineType} • {currentSeller?.address}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>Withdraw Earnings</span>
          </button>
          <button
            onClick={toggleStoreOpen}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
              currentSeller?.isOpen
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {currentSeller?.isOpen ? 'Pause Kitchen' : 'Open Kitchen'}
          </button>
          <Link
            to="/seller/products"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* Monetization & Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Available Balance for Withdrawal */}
        <div className="bg-gradient-to-br from-brand-500 to-amber-600 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-white/90 mb-2 font-bold">
            <span>Available for Withdrawal</span>
            <Building2 className="w-4 h-4 text-white/80" />
          </div>
          <p className="text-2xl font-black">{formatNaira(availableBalance)}</p>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="mt-2 text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl backdrop-blur-md inline-flex items-center space-x-1"
          >
            <span>Transfer to Bank</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Gross Food Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">{formatNaira(grossSales)}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center">
            Across {sellerOrders.length} customer orders
          </span>
        </div>

        {/* 5% Platform Commission Model */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>ChopConnect 5% Fee</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-brand-600">{formatNaira(totalCommission)}</p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
            Automatic 5% vendor fee deducted
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Pending Kitchen Orders</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900">{pendingOrders.length}</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">
            {pendingOrders.length > 0 ? "Requires food prep" : "Kitchen clear"}
          </span>
        </div>
      </div>

      {/* Orders & Menu Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#1C1B1F]">Recent Kitchen Orders</h2>
              <p className="text-xs text-[#79747E]">Customer orders with Mastercard & Bank Transfer settlements</p>
            </div>
            <Link to="/seller/orders" className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sellerOrders.length === 0 ? (
            <p className="text-xs text-[#79747E] py-6 text-center">No orders received yet.</p>
          ) : (
            <div className="space-y-3">
              {sellerOrders.slice(0, 4).map((order) => {
                const commission = Math.round((order.subtotal || 0) * 0.05);
                const net = (order.subtotal || 0) - commission;
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#1C1B1F]">Order #{order.id}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {order.paymentMethod === 'CARD' ? 'Mastercard' : order.paymentMethod === 'TRANSFER' ? 'Transfer' : 'Cash'}
                        </span>
                      </div>
                      <p className="text-xs text-[#49454F] mt-1">{order.itemsSummary}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-[#79747E] mt-0.5">
                        <span>Customer: {order.buyerName}</span>
                        <span>•</span>
                        <span>Gross: {formatNaira(order.subtotal)}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-700">Net: {formatNaira(net)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => navigate('/seller/orders')}
                        className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Manage Prep
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Menu Overview & Platform Guidelines */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-[#1C1B1F]">Active Menu Items</h2>
              <Link to="/seller/products" className="text-xs font-bold text-brand-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {sellerDishes.slice(0, 4).map((dish) => (
                <div key={dish.id} className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-neutral-50">
                  <img
                    src={dish.image || "/food_jollof_1788517799135.jpg"}
                    alt={dish.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1C1B1F] truncate">{dish.name}</p>
                    <p className="text-[11px] text-brand-600 font-bold">{formatNaira(dish.price)} • {dish.category}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${dish.isAvailable ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Monetization Explanation Box */}
          <div className="bg-brand-50 rounded-3xl p-6 border border-brand-200">
            <div className="flex items-center space-x-2 text-brand-900 font-extrabold text-sm mb-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>ChopConnect Vendor Rules</span>
            </div>
            <ul className="text-xs text-brand-900/80 space-y-2 leading-relaxed">
              <li>• You receive <strong>95%</strong> of every meal sold.</li>
              <li>• ChopConnect retains a transparent <strong>5%</strong> service commission.</li>
              <li>• Instant withdrawal to any Nigerian bank (GTB, Zenith, Access, Kuda, OPay).</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-brand-200 text-[11px] text-brand-800">
              Vendor Support: <a href="tel:+2348024764090" className="font-bold underline">+234 802 476 4090</a>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        userRole="SELLER"
      />
    </div>
  );
};
