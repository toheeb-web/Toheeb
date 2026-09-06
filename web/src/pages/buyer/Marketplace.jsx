import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  Search, 
  Star, 
  Clock, 
  Store, 
  Plus, 
  MapPin, 
  ArrowRight, 
  Flame, 
  Users, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Download, 
  CheckCircle2, 
  Navigation,
  Compass,
  Sparkles,
  Bike,
  UtensilsCrossed
} from 'lucide-react';
import { FoodDetailModal } from './FoodDetailModal';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
  "All Dishes",
  "Rice & Mains",
  "Grills & Suya",
  "Soups & Stews",
  "Fast Food",
  "Drinks"
];

export const Marketplace = () => {
  const { 
    foods, 
    sellers, 
    users, 
    addToCart, 
    cart, 
    verifiedLocation,
    setOnboardingOpen,
    setQuickNavOpen,
    setLocationOpen,
    setDirectoryOpen,
    setInstallOpen,
    switchRole,
    currentUser
  } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [selectedFood, setSelectedFood] = useState(null);

  const onlineCount = users.filter(u => u.isOnline).length;

  // Filter foods
  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'All Dishes' || food.category === selectedCategory;
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.location && food.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      
      {/* Eye-catching Hero Banner with Nigerian food vibes & Live presence */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#B92B0C] via-[#E23E1D] to-[#F59E0B] text-white p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          
          {/* Live Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setDirectoryOpen(true)}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/20 hover:bg-black/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{onlineCount} Members Online Now</span>
            </button>

            <button
              onClick={() => setLocationOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-white/30 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-200" />
              <span>{verifiedLocation.area}, {verifiedLocation.city}</span>
            </button>

            <button
              onClick={() => setInstallOpen(true)}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-900 text-amber-300 text-xs font-bold hover:bg-black transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Naija Chop Delivered Hot to Your Doorstep
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-2.5 font-medium leading-relaxed">
            Order authentic Party Jollof, spicy flame-grilled Suya, and fresh Pounded Yam from verified Nigerian kitchens. Pay securely with Mastercard or Instant Bank Transfer.
          </p>

          {/* Quick Helpline Callout */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2348024764090?text=Hello%20ChopConnect,%20I%20want%20to%20order%20food!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support (+234 802 476 4090)</span>
            </a>

            <button
              onClick={() => setDirectoryOpen(true)}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center space-x-2 backdrop-blur-md border border-white/20 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>View Registered People & Riders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding & Navigation Quick Access Card */}
      <div className="bg-white rounded-3xl p-5 mb-8 border border-[#E2D7CF] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-brand-50 rounded-2xl text-brand-600 ring-4 ring-brand-100/60 flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-[#1C1B1F]">New to ChopConnect Nigeria?</span>
                <span className="text-[10px] font-extrabold bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Quick Access</span>
              </div>
              <p className="text-xs text-[#79747E] mt-0.5">
                Explore our multi-role features: order hot meals, register your kitchen for 5% commission, or deliver as a rider for ₦1,100/trip.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnboardingOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>How It Works (Tour)</span>
            </button>

            <button
              onClick={() => setQuickNavOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F5EEEA] hover:bg-[#EADFD7] text-[#1C1B1F] font-bold text-xs rounded-xl border border-[#E2D7CF] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Navigation Hub</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Role Switchers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            onClick={() => { switchRole('BUYER'); navigate('/buyer'); }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
              currentUser?.role === 'BUYER' ? 'bg-brand-50/70 border-brand-300 ring-2 ring-brand-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2 bg-brand-500 text-white rounded-xl">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1B1F]">Order Food as Buyer</p>
              <p className="text-[10px] text-[#79747E]">Mastercard & NIP bank checkout</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('SELLER'); navigate('/seller'); }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
              currentUser?.role === 'SELLER' ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2 bg-amber-600 text-white rounded-xl">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1B1F]">Sell Food as Kitchen</p>
              <p className="text-[10px] text-[#79747E]">Keep 95% of sales (5% fee)</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('RIDER'); navigate('/rider'); }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
              currentUser?.role === 'RIDER' ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="p-2 bg-emerald-700 text-white rounded-xl">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1B1F]">Courier Delivery Rider</p>
              <p className="text-[10px] text-[#79747E]">Earn ₦1,100 net per trip</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#79747E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jollof, suya, egusi, puff puff, meat pies, or kitchens in Lagos & Abuja..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E2D7CF] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 scale-105'
                  : 'bg-white text-[#49454F] border border-[#E2D7CF] hover:bg-neutral-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Nigerian Kitchens & Restaurants */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#1C1B1F]">Verified Kitchens & Grills</h2>
            <p className="text-xs text-[#79747E]">Cooks, home chefs & restaurants charging 5% platform commission</p>
          </div>
          <button
            onClick={() => setDirectoryOpen(true)}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>All Sellers & Couriers ({users.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sellers.map(seller => (
            <div 
              key={seller.id}
              className="bg-white rounded-3xl p-4 border border-[#E2D7CF] shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
            >
              <img 
                src={seller.image} 
                alt={seller.businessName} 
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 ring-1 ring-neutral-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <h3 className="text-sm font-bold text-[#1C1B1F] truncate">{seller.businessName}</h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-[#79747E] truncate">{seller.cuisineType}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs">
                  <span className="flex items-center font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-0.5" />
                    {seller.rating}
                  </span>
                  <span className="text-[#79747E]">({seller.reviewCount} orders)</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  5% Commission Partner
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Items Grid with Naira Currency */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">
            {selectedCategory === 'All Dishes' ? 'Explore Fresh Menu' : selectedCategory}
          </h2>
          <span className="text-xs text-[#79747E] font-medium">{filteredFoods.length} dishes ready to order</span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E2D7CF]">
            <p className="text-base font-semibold text-[#1C1B1F]">No dishes match your search</p>
            <p className="text-xs text-[#79747E] mt-1">Try another keyword or select All Dishes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <div
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-3xl overflow-hidden border border-[#E2D7CF] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Image with Tag */}
                  <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1C1B1F] flex items-center space-x-1 shadow-sm">
                      <Clock className="w-3 h-3 text-[#79747E]" />
                      <span>{food.prepTimeMinutes}m</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-brand-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
                      {food.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-1 text-xs text-[#79747E] mb-1">
                      <Store className="w-3.5 h-3.5 text-brand-500" />
                      <span className="truncate">{food.sellerName}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#1C1B1F] line-clamp-1 group-hover:text-brand-500 transition-colors">
                      {food.name}
                    </h3>
                    <p className="text-xs text-[#79747E] line-clamp-2 mt-1 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price in Naira & Add Button */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-neutral-100 mt-2">
                  <span className="text-base font-black text-brand-600">
                    {formatNaira(food.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(food, 1);
                    }}
                    className="p-2.5 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center font-bold text-xs"
                    title="Add to Cart"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Pill on Mobile */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
          <Link
            to="/buyer/cart"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs font-black">
                {cartCount} items
              </span>
              <span>View Cart & Pay (Mastercard / Transfer)</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal 
          food={selectedFood} 
          onClose={() => setSelectedFood(null)} 
        />
      )}
    </div>
  );
};
