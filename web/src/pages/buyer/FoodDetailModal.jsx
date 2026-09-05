import React, { useState } from 'react';
import { X, Star, Clock, MapPin, Store, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp, formatNaira } from '../../context/AppContext';

export const FoodDetailModal = ({ food, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const handleAdd = () => {
    addToCart(food, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Image & Close Button */}
        <div className="relative h-60 sm:h-72 w-full bg-neutral-100 flex-shrink-0">
          <img 
            src={food.image || "/food_jollof_1788517799135.jpg"} 
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-3 left-3 bg-brand-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
            {food.category}
          </div>
        </div>

        {/* Food Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1C1B1F] leading-tight">{food.name}</h2>
              <div className="flex items-center space-x-2 mt-1 text-xs text-[#79747E]">
                <span className="flex items-center font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                  {food.rating}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#79747E]" />
                  {food.prepTimeMinutes} mins prep
                </span>
              </div>
            </div>
            <span className="text-2xl font-black text-brand-600">
              {formatNaira(food.price)}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#49454F] bg-[#F5EEEA] p-2.5 rounded-xl border border-[#E2D7CF]">
            <Store className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span className="font-semibold">{food.sellerName}</span>
            <span>•</span>
            <span className="flex items-center text-[#79747E]">
              <MapPin className="w-3.5 h-3.5 mr-0.5" />
              {food.location || "Lagos, Nigeria"}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#79747E] uppercase tracking-wider mb-1">Description</h4>
            <p className="text-sm text-[#49454F] leading-relaxed">
              {food.description}
            </p>
          </div>
        </div>

        {/* Bottom Actions: Quantity & Add Button */}
        <div className="p-4 border-t border-[#E2D7CF] bg-neutral-50 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center space-x-3 bg-white border border-[#E2D7CF] rounded-2xl px-3 py-1.5 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-[#49454F] hover:text-brand-500"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-[#49454F] hover:text-brand-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart • {formatNaira(food.price * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
