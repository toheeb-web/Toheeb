import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Store, 
  Bike, 
  UtensilsCrossed, 
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const RegisteredUsersDirectory = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { users, currentUser } = useApp();
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const onlineCount = users.filter(u => u.isOnline).length;

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.city && user.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.address && user.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E2D7CF] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1C1B1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base">Live ChopConnect Members</h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{onlineCount} Online Now</span>
                </span>
              </div>
              <p className="text-xs text-white/70">Verified Nigerian Vendors, Couriers, and Food Customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search registered members by name, city, or area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D7CF] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                filterRole === 'ALL' 
                  ? 'bg-[#1C1B1F] text-white shadow-sm' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200'
              }`}
            >
              All Members ({users.length})
            </button>
            <button
              onClick={() => setFilterRole('SELLER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                filterRole === 'SELLER' 
                  ? 'bg-brand-500 text-white shadow-sm' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Food Vendors ({users.filter(u => u.role === 'SELLER').length})</span>
            </button>
            <button
              onClick={() => setFilterRole('RIDER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                filterRole === 'RIDER' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Express Riders ({users.filter(u => u.role === 'RIDER').length})</span>
            </button>
            <button
              onClick={() => setFilterRole('BUYER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                filterRole === 'BUYER' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Customers ({users.filter(u => u.role === 'BUYER').length})</span>
            </button>
          </div>
        </div>

        {/* Directory List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Users className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-semibold">No registered members found matching your search.</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const isCurrentUser = currentUser?.id === user.id;
              return (
                <div 
                  key={user.id}
                  className="p-4 rounded-2xl bg-white border border-[#E2D7CF] shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Avatar with Online Beacon */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-brand-100">
                        {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      {/* Live Online Dot */}
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        {user.isOnline ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white" title="Online Now"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-neutral-400 ring-2 ring-white" title="Offline"></span>
                        )}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-sm text-[#1C1B1F]">{user.name}</h4>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                            (You)
                          </span>
                        )}
                        <span className="flex items-center text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      </div>

                      {/* Location and Role Details */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center text-neutral-700 font-medium">
                          <MapPin className="w-3 h-3 text-brand-500 mr-0.5" />
                          {user.city || "Lagos"}, Nigeria
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-neutral-800">
                          {user.role === 'SELLER' && 'Food Vendor (5% Commission Model)'}
                          {user.role === 'RIDER' && `Courier (${user.vehicleType || 'Motorcycle'})`}
                          {user.role === 'BUYER' && 'Registered Foodie'}
                        </span>
                      </div>

                      {/* Online Status Text */}
                      <p className="text-[11px] font-medium text-emerald-700 mt-0.5 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{user.isOnline ? "Online and ready for orders" : `Last active ${user.lastSeen || 'recently'}`}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: WhatsApp Chat / Call Official Support Number */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <a
                      href={`https://wa.me/2348024764090?text=Hello%20${encodeURIComponent(user.name)},%20connecting%20from%20ChopConnect!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200 transition-colors"
                      title="Direct WhatsApp Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href="tel:+2348024764090"
                      className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      title="Call +234 802 476 4090"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
          <span className="font-medium">Direct Platform Inquiries: <strong>+234 802 476 4090</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1C1B1F] text-white font-bold rounded-xl text-xs hover:bg-black"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
