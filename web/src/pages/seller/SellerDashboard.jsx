import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Star, 
  Clock, 
  Store, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const SellerDashboard = () => {
  const { sellers, foods, orders, currentUser, updateSellerProfile } = useApp();
  const navigate = useNavigate();

  const currentSeller = sellers.find(s => s.userId === currentUser.id) || sellers[0];
  const sellerDishes = foods.filter(f => f.sellerId === currentSeller?.id);
  const sellerOrders = orders.filter(o => o.sellerId === currentSeller?.id);

  const totalRevenue = sellerOrders
    .filter(o => o.status !== 'REJECTED')
    .reduce((sum, o) => sum + o.subtotal, 0);

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
                {currentSeller?.isOpen ? 'Open For Orders' : 'Closed'}
              </span>
            </div>
            <p className="text-xs text-[#79747E] mt-0.5">{currentSeller?.cuisineType} • {currentSeller?.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={toggleStoreOpen}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
              currentSeller?.isOpen
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {currentSeller?.isOpen ? 'Pause Kitchen Orders' : 'Open Kitchen'}
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Total Sales Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">${totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +14% vs last week
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Pending Kitchen Orders</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-brand-600">{pendingOrders.length}</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">Requires kitchen preparation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Menu Dishes</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">{sellerDishes.length}</p>
          <span className="text-[11px] text-brand-600 font-semibold mt-1 block">
            {sellerDishes.filter(d => d.isAvailable).length} active on marketplace
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#79747E] mb-2 font-semibold">
            <span>Customer Rating</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C1B1F]">{currentSeller?.rating}</p>
          <span className="text-[11px] text-[#79747E] mt-1 block">
            Based on {currentSeller?.reviewCount} reviews
          </span>
        </div>
      </div>

      {/* Orders requiring attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-extrabold text-[#1C1B1F]">Recent Kitchen Orders</h2>
            <Link to="/seller/orders" className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sellerOrders.length === 0 ? (
            <p className="text-xs text-[#79747E] py-6 text-center">No orders received yet.</p>
          ) : (
            <div className="space-y-3">
              {sellerOrders.slice(0, 4).map((order) => (
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
                    </div>
                    <p className="text-xs text-[#49454F] mt-1">{order.itemsSummary}</p>
                    <p className="text-[11px] text-[#79747E] mt-0.5">Buyer: {order.buyerName} ({order.buyerPhone})</p>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-base font-black text-brand-600">${order.subtotal.toFixed(2)}</span>
                    <button
                      onClick={() => navigate('/seller/orders')}
                      className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Menu Overview */}
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
                  src={dish.image}
                  alt={dish.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1C1B1F] truncate">{dish.name}</p>
                  <p className="text-[11px] text-[#79747E]">${dish.price.toFixed(2)} • {dish.category}</p>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${dish.isAvailable ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
