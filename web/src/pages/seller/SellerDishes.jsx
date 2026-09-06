import React, { useState, useRef } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Check, 
  X, 
  PlusCircle, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  Percent,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  "Rice & Mains",
  "Grills & Suya",
  "Soups & Stews",
  "Fast Food",
  "Drinks"
];

const SAMPLE_IMAGES = [
  { label: "Jollof Rice", url: "/food_jollof_1788517799135.jpg" },
  { label: "Beef Suya", url: "/food_suya_1788517820467.jpg" },
  { label: "Feast / Stew", url: "/chopconnect_hero_1788517559174.jpg" },
  { label: "App Logo / Drink", url: "/chopconnect_icon_1788517538782.jpg" },
];

export const SellerDishes = () => {
  const { foods, addFood, updateFood, deleteFood, currentUser, showToast } = useApp();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [image, setImage] = useState(SAMPLE_IMAGES[0].url);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please choose an image file from your device.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality client-side canvas compressor for phone photos
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        setImage(dataUrl);
        setIsUploading(false);
        showToast("Photo added from phone storage!");
      };
      img.onerror = () => {
        setIsUploading(false);
        showToast("Could not load image.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingDish(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory(CATEGORIES[0]);
    setPrepTimeMinutes(20);
    setImage(SAMPLE_IMAGES[0].url);
    setModalOpen(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setDescription(dish.description);
    setPrice(dish.price.toString());
    setCategory(dish.category);
    setPrepTimeMinutes(dish.prepTimeMinutes);
    setImage(dish.image);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) {
      showToast("Please provide a name and price.");
      return;
    }

    if (editingDish) {
      updateFood(editingDish.id, {
        name,
        description,
        price: parseFloat(price),
        category,
        prepTimeMinutes: parseInt(prepTimeMinutes, 10),
        image
      });
      showToast("Dish updated successfully!");
    } else {
      addFood({
        name,
        description,
        price: parseFloat(price),
        category,
        prepTimeMinutes: parseInt(prepTimeMinutes, 10),
        image
      });
      showToast("New dish added to menu!");
    }
    setModalOpen(false);
  };

  const priceNum = parseFloat(price) || 0;
  const vendorTakeHome = Math.round(priceNum * 0.95);
  const platformFee = Math.round(priceNum * 0.05);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1C1B1F]">Manage Kitchen Dishes</h1>
          <p className="text-xs text-[#79747E]">Set prices in Naira (₦) • 5% platform commission automatically deducted upon sale</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E2D7CF] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-neutral-100">
                <img src={food.image || "/food_jollof_1788517799135.jpg"} alt={food.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-brand-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-sm">
                  {food.category}
                </div>
                <button
                  onClick={() => updateFood(food.id, { isAvailable: !food.isAvailable })}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-colors ${
                    food.isAvailable
                      ? 'bg-emerald-500 text-white'
                      : 'bg-black/60 text-white'
                  }`}
                >
                  {food.isAvailable ? 'Active' : 'Hidden'}
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-[#1C1B1F] line-clamp-1">{food.name}</h3>
                  <span className="font-black text-sm text-brand-600 ml-2">
                    {formatNaira(food.price)}
                  </span>
                </div>
                <p className="text-xs text-[#79747E] line-clamp-2 mt-1">{food.description}</p>
                
                <div className="bg-neutral-50 rounded-xl p-2 mt-2 text-[10px] text-neutral-600 flex justify-between">
                  <span>95% Payout: <strong>{formatNaira(food.price * 0.95)}</strong></span>
                  <span className="text-neutral-400">5% Fee: {formatNaira(food.price * 0.05)}</span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#79747E] mt-2 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{food.prepTimeMinutes} mins preparation time</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => updateFood(food.id, { isAvailable: !food.isAvailable })}
                className="text-xs font-semibold text-[#49454F] hover:text-brand-500 flex items-center space-x-1"
              >
                {food.isAvailable ? (
                  <ToggleRight className="w-5 h-5 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-neutral-400" />
                )}
                <span>{food.isAvailable ? 'Active on Menu' : 'Hidden'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(food)}
                  className="p-2 text-neutral-600 hover:text-brand-500 bg-neutral-100 hover:bg-brand-50 rounded-xl transition-colors"
                  title="Edit Dish"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteFood(food.id)}
                  className="p-2 text-neutral-600 hover:text-red-600 bg-neutral-100 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-[#1C1B1F]">
                {editingDish ? 'Edit Dish' : 'Add New Dish to Menu'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-[#1C1B1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Egusi Soup with Pounded Yam & Goat Meat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500 font-bold"
                  />
                  {priceNum > 0 && (
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                      You earn: {formatNaira(vendorTakeHome)} (95%)
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm bg-white focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ingredients, seasonings, meat cuts, and accompaniments..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2D7CF] text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1.5 flex items-center justify-between">
                  <span>Dish Photo (Upload from Phone Storage or Camera)</span>
                  <span className="text-[11px] text-brand-600 font-semibold">From Device</span>
                </label>

                {/* Hidden File Input for Phone Storage / Camera Roll */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Interactive Phone Storage Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-300 hover:border-brand-500 rounded-2xl p-4 bg-brand-50/30 hover:bg-brand-50/60 transition-all cursor-pointer text-center group"
                >
                  {image ? (
                    <div>
                      <div className="relative rounded-xl overflow-hidden shadow-sm h-40 w-full bg-neutral-100">
                        <img
                          src={image}
                          alt="Dish Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                          <Camera className="w-4 h-4" />
                          <span>Tap to Choose Different Photo</span>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between px-1">
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> Ready for Menu
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="text-[11px] font-bold text-brand-600 hover:underline flex items-center"
                        >
                          <Upload className="w-3 h-3 mr-1" /> Upload from Phone
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 text-brand-500 shadow-sm border border-brand-200 group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-extrabold text-[#1C1B1F]">
                        {isUploading ? "Uploading Photo..." : "Tap to Add Photo from Phone Storage"}
                      </div>
                      <div className="text-[11px] text-[#79747E] mt-0.5">
                        Choose from Camera, Photo Gallery, or Files
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="mt-3">
                  <span className="text-[11px] text-neutral-500 font-medium">Or pick a standard dish photo:</span>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {SAMPLE_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setImage(img.url)}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-square ${
                          image === img.url ? 'border-brand-500 ring-2 ring-brand-300' : 'border-neutral-200'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        {image === img.url && (
                          <div className="absolute inset-0 bg-brand-500/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#49454F] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {editingDish ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
