import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bike, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle2, 
  LogOut, 
  Edit3, 
  ShieldCheck,
  Award 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiderProfile = () => {
  const { currentUser, setCurrentUser, logout, showToast, reviews } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [vehicleType, setVehicleType] = useState(currentUser?.vehicleType || 'Motorcycle');

  const riderReviews = reviews.filter(r => r.targetType === 'RIDER' && (r.targetId === currentUser?.id || r.targetId === 3 || r.targetId === 4));

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      phone,
      vehicleType
    };
    setCurrentUser(updated);
    setIsEditing(false);
    showToast("Courier profile updated!");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <h1 className="text-2xl font-extrabold text-[#1C1B1F] mb-6">Courier Profile & Credentials</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rider Card */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-delivery-500 text-white flex items-center justify-center font-extrabold text-2xl mx-auto mb-3 shadow-md ring-4 ring-delivery-100">
            <Bike className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">{currentUser?.name}</h2>
          <p className="text-xs text-[#79747E] mt-0.5">{currentUser?.email}</p>

          <div className="inline-flex items-center space-x-1 mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-delivery-50 text-delivery-700 border border-delivery-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Courier</span>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1B1F] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Courier Info'}</span>
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

        {/* Info & Reviews */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Details Form */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4">Courier Credentials</h3>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-delivery-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-delivery-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-sm bg-white focus:ring-2 focus:ring-delivery-500"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="E-Bike">E-Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Car">Car</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-delivery-500 hover:bg-delivery-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs text-[#49454F]">
                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Mail className="w-4 h-4 text-delivery-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Email</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Phone className="w-4 h-4 text-delivery-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Phone</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-neutral-50 rounded-xl">
                  <Bike className="w-4 h-4 text-delivery-500" />
                  <div>
                    <span className="text-[#79747E] block text-[10px]">Registered Vehicle</span>
                    <span className="font-semibold text-[#1C1B1F]">{currentUser?.vehicleType || 'Motorcycle'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews for this Courier */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1C1B1F] mb-4 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Customer Ratings & Feedback</span>
            </h3>

            {riderReviews.length === 0 ? (
              <p className="text-xs text-[#79747E] py-4 text-center">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {riderReviews.map((rev) => (
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
