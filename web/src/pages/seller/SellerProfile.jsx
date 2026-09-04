import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  Star, 
  Edit3, 
  LogOut, 
  MessageSquare,
  Sparkles,
  Check 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SellerProfile = () => {
  const { sellers, currentUser, updateSellerProfile, reviews, logout, showToast } = useApp();
  const navigate = useNavigate();

  const currentSeller = sellers.find(s => s.userId === currentUser.id) || sellers[0];
  const sellerReviews = reviews.filter(r => r.targetType === 'SELLER' && r.targetId === currentSeller?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState(currentSeller?.businessName || '');
  const [cuisineType, setCuisineType] = useState(currentSeller?.cuisineType || '');
  const [description, setDescription] = useState(currentSeller?.description || '');
  const [phone, setPhone] = useState(currentSeller?.phone || '');
  const [address, setAddress] = useState(currentSeller?.address || '');

  const handleSave = (e) => {
    e.preventDefault();
    updateSellerProfile(currentSeller.id, {
      businessName,
      cuisineType,
      description,
      phone,
      address
    });
    setIsEditing(false);
    showToast("Kitchen profile updated successfully!");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <h1 className="text-2xl font-extrabold text-[#1C1B1F] mb-6">Kitchen Profile & Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Kitchen Card */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm text-center">
          <img
            src={currentSeller?.image || "/chopconnect_hero_1788517559174.jpg"}
            alt={currentSeller?.businessName}
            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-3 shadow-md ring-4 ring-brand-100"
          />
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">{currentSeller?.businessName}</h2>
          <p className="text-xs text-[#79747E] mt-0.5">{currentSeller?.cuisineType}</p>
          
          <div className="flex items-center justify-center space-x-1 text-xs font-bold text-amber-600 mt-2">
            <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            <span>{currentSeller?.rating}</span>
            <span className="text-[#79747E]">({currentSeller?.reviewCount} reviews)</span>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1B1F] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Kitchen Info'}</span>
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

        {/* Right Column: Information & Reviews */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4">Store Information</h3>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Cuisine / Specialties</label>
                  <input
                    type="text"
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Bio / Kitchen Description</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#49454F] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#49454F] mb-1">Kitchen Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
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
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[#79747E] block text-[10px] uppercase font-bold">About</span>
                  <p className="text-[#1C1B1F] mt-1 leading-relaxed">{currentSeller?.description}</p>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Contact Phone</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentSeller?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Kitchen Location</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentSeller?.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews for this Kitchen */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span>Customer Reviews ({sellerReviews.length})</span>
            </h3>

            {sellerReviews.length === 0 ? (
              <p className="text-xs text-[#79747E] py-4 text-center">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {sellerReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-[#1C1B1F]">{rev.authorName}</span>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#49454F]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
