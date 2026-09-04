import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Star, 
  Clock, 
  Store, 
  Plus, 
  MapPin, 
  SlidersHorizontal,
  ArrowRight,
  Flame
} from 'lucide-react';
import { FoodDetailModal } from './FoodDetailModal';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  "All Dishes",
  "Rice & Mains",
  "Grills & Suya",
  "Soups & Stews",
  "Fast Food",
  "Drinks"
];

export const Marketplace = () => {
  const { foods, sellers, addToCart, cart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [selectedFood, setSelectedFood] = useState(null);

  // Filter foods
  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'All Dishes' || food.category === selectedCategory;
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      
      {/* Hero Banner with ChopConnect visual branding */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 text-white p-6 sm:p-10 mb-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-100 text-xs font-semibold mb-3 border border-white/15">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Peer-to-Peer Food Delivery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Authentic African Flavors Delivered Fresh & Hot
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-2 font-normal">
            Browse kitchens, choose your meals, and pick your preferred rider with transparent, competing bids.
          </p>
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
              placeholder="Search jollof, suya, egusi, puff puff, or kitchens..."
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

      {/* Popular Kitchens Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">Popular Kitchens & Grills</h2>
          <span className="text-xs font-semibold text-brand-600">Verified Sellers</span>
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
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#1C1B1F] truncate">{seller.businessName}</h3>
                <p className="text-xs text-[#79747E] truncate">{seller.cuisineType}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs">
                  <span className="flex items-center font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-0.5" />
                    {seller.rating}
                  </span>
                  <span className="text-[#79747E]">({seller.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold text-[#1C1B1F]">
            {selectedCategory === 'All Dishes' ? 'Explore Menu' : selectedCategory}
          </h2>
          <span className="text-xs text-[#79747E] font-medium">{filteredFoods.length} items available</span>
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
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1C1B1F] flex items-center space-x-1 shadow-sm">
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

                {/* Footer Price & Add Button */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-neutral-100 mt-2">
                  <span className="text-base font-extrabold text-[#1C1B1F]">
                    ${food.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(food, 1);
                    }}
                    className="p-2.5 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center"
                    title="Add to Cart"
                  >
                    <Plus className="w-4 h-4" />
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
            className="w-full bg-brand-500 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-extrabold">
                {cartCount} items
              </span>
              <span>View Cart & Checkout</span>
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
