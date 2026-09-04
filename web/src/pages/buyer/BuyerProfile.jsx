import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  LogOut, 
  Edit3, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BuyerProfile = () => {
  const { currentUser, orders, logout, showToast, users, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id || !o.buyerId);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      phone,
      address
    };
    setCurrentUser(updated);
    setIsEditing(false);
    showToast("Profile details updated!");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <h1 className="text-2xl font-extrabold text-[#1C1B1F] mb-6">Buyer Profile & Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center font-extrabold text-2xl mx-auto mb-3 shadow-md ring-4 ring-brand-100">
            {currentUser?.avatarInitials || 'CC'}
          </div>
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">{currentUser?.name}</h2>
          <p className="text-xs text-[#79747E] mt-0.5">{currentUser?.email}</p>
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Foodie / Buyer
          </span>

          <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1B1F] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Details & Past Orders */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4">Personal & Delivery Details</h3>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Default Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs text-[#49454F]">
                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Mail className="w-4 h-4 text-brand-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Email</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Phone</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Saved Delivery Address</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Past Orders History */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4 flex items-center space-x-2">
              <Package className="w-4 h-4 text-brand-500" />
              <span>Recent Order History ({buyerOrders.length})</span>
            </h3>

            <div className="space-y-3">
              {buyerOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/70 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#1C1B1F]">Order #{order.id}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-neutral-200">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#79747E] mt-0.5">{order.sellerName}</p>
                    <p className="text-[11px] text-[#49454F] line-clamp-1">{order.itemsSummary}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-brand-600">
                      ${(order.subtotal + order.deliveryFee).toFixed(2)}
                    </span>
                    <button
                      onClick={() => navigate('/buyer/orders')}
                      className="text-[10px] font-bold text-brand-600 block hover:underline mt-0.5"
                    >
                      Track &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
