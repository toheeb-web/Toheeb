import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialUsers, 
  initialSellers, 
  initialFoods, 
  initialOrders, 
  initialBids, 
  initialReviews 
} from '../data/initialData';
import { 
  firebaseSignIn, 
  firebaseRegister, 
  firebaseSignOut, 
  isFirebaseConfigured, 
  auth 
} from '../services/firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load state from localStorage or initial seed
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cc_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_current_user');
    return saved ? JSON.parse(saved) : initialUsers[0]; // Default to Amara (Buyer)
  });

  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem('cc_foods');
    return saved ? JSON.parse(saved) : initialFoods;
  });

  const [sellers, setSellers] = useState(() => {
    const saved = localStorage.getItem('cc_sellers');
    return saved ? JSON.parse(saved) : initialSellers;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cc_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [bids, setBids] = useState(() => {
    const saved = localStorage.getItem('cc_bids');
    return saved ? JSON.parse(saved) : initialBids;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('cc_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cc_foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('cc_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('cc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cc_bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('cc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auth Operations
  const login = async (email, password, rolePreference) => {
    let firebaseUser = null;
    if (isFirebaseConfigured) {
      try {
        const cred = await firebaseSignIn(email, password);
        firebaseUser = cred.user;
      } catch (err) {
        console.warn("Firebase Auth sign-in warning:", err.message);
      }
    }

    // Match existing local/demo user or create session user
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updated = {
        ...existing,
        role: rolePreference || existing.role
      };
      setCurrentUser(updated);
      showToast(`Welcome back, ${updated.name}!`);
      return updated;
    } else {
      const nameFromEmail = email.split('@')[0];
      const newUser = {
        id: Date.now(),
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        email,
        role: rolePreference || 'BUYER',
        phone: "+1 (555) 019-8234",
        address: "18 Waterfront Boulevard",
        isApproved: true,
        avatarInitials: nameFromEmail.slice(0, 2).toUpperCase()
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      showToast(`Logged in as ${newUser.name} (${newUser.role})`);
      return newUser;
    }
  };

  const register = async ({ name, email, password, role, vehicleType, businessName, phone, address }) => {
    if (isFirebaseConfigured) {
      try {
        await firebaseRegister(email, password);
      } catch (err) {
        console.warn("Firebase register warning:", err.message);
      }
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'BUYER',
      phone: phone || "+1 (555) 234-8901",
      address: address || "24 Innovation Crescent",
      vehicleType: vehicleType || (role === 'RIDER' ? 'Motorcycle' : undefined),
      isApproved: true,
      avatarInitials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "CC"
    };

    setUsers(prev => [...prev, newUser]);

    // If registered as Seller, create their initial Kitchen profile
    if (role === 'SELLER') {
      const newSeller = {
        id: Date.now(),
        userId: newUser.id,
        businessName: businessName || `${newUser.name}'s Kitchen`,
        description: "Fresh culinary delights prepared with love and high quality ingredients.",
        cuisineType: "African & Fusion",
        rating: 5.0,
        reviewCount: 0,
        address: address || "Market District",
        phone: phone || "+1 (555) 876-5432",
        isOpen: true,
        isApproved: true,
        image: "/chopconnect_hero_1788517559174.jpg"
      };
      setSellers(prev => [...prev, newSeller]);
    }

    setCurrentUser(newUser);
    showToast(`Account created! Welcome to ChopConnect, ${newUser.name}.`);
    return newUser;
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut();
      } catch (err) {
        console.warn("Sign out warning:", err);
      }
    }
    // Switch to default guest/buyer user for seamless demo browsing
    setCurrentUser(initialUsers[0]);
    showToast("Logged out successfully.");
  };

  const switchRole = (role) => {
    // Find first seeded user with this role or update current user's role
    const matching = users.find(u => u.role === role);
    if (matching) {
      setCurrentUser(matching);
      showToast(`Switched view to ${matching.name} (${role})`);
    } else {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      showToast(`Switched role to ${role}`);
    }
  };

  // Cart Operations
  const addToCart = (food, qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.foodId === food.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, {
          foodId: food.id,
          sellerId: food.sellerId,
          sellerName: food.sellerName,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: qty
        }];
      }
    });
    showToast(`Added ${food.name} to cart!`);
  };

  const updateCartQuantity = (foodId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.foodId === foodId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (foodId) => {
    setCart(prev => prev.filter(item => item.foodId !== foodId));
    showToast("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Operations
  const placeOrder = ({ deliveryAddress, notes = "" }) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const primarySeller = sellers.find(s => s.id === cart[0].sellerId) || sellers[0];

    const newOrderId = 100 + orders.length + 1;
    const itemsSummary = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    const newOrder = {
      id: newOrderId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      sellerId: primarySeller.id,
      sellerName: primarySeller.businessName,
      deliveryAddress: deliveryAddress || currentUser.address,
      status: "PLACED",
      subtotal,
      deliveryFee: 4.50,
      riderId: null,
      riderName: null,
      riderEta: null,
      createdAt: Date.now(),
      notes,
      itemsSummary,
      items: cart.map(i => ({
        foodId: i.foodId,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrderId} placed successfully!`);

    // Auto-generate sample rider bids after 3 seconds for active demonstration of peer-to-peer delivery bidding
    setTimeout(() => {
      const generatedBids = [
        {
          id: Date.now(),
          orderId: newOrderId,
          riderId: 3,
          riderName: "Tunde Swift",
          riderRating: 4.9,
          completedDeliveries: 142,
          vehicleType: "Motorcycle",
          fee: 4.50,
          etaMinutes: 18,
          distanceKm: 2.4,
          status: "PENDING",
          submittedAt: Date.now()
        },
        {
          id: Date.now() + 1,
          orderId: newOrderId,
          riderId: 4,
          riderName: "David K",
          riderRating: 4.8,
          completedDeliveries: 98,
          vehicleType: "E-Bike",
          fee: 3.90,
          etaMinutes: 24,
          distanceKm: 2.1,
          status: "PENDING",
          submittedAt: Date.now()
        }
      ];
      setBids(prev => [...generatedBids, ...prev]);
    }, 2500);

    return newOrder;
  };

  const updateOrderStatus = (orderId, status, riderDetails = null) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          ...(riderDetails || {})
        };
      }
      return order;
    }));
    showToast(`Order #${orderId} marked as ${status.replace(/_/g, ' ')}`);
  };

  const acceptRiderBid = (orderId, bidId) => {
    const selectedBid = bids.find(b => b.id === bidId);
    if (!selectedBid) return;

    // Update bid statuses
    setBids(prev => prev.map(b => {
      if (b.orderId === orderId) {
        return { ...b, status: b.id === bidId ? "ACCEPTED" : "DECLINED" };
      }
      return b;
    }));

    // Assign rider to order and advance status
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          riderId: selectedBid.riderId,
          riderName: selectedBid.riderName,
          riderEta: `${selectedBid.etaMinutes} mins`,
          deliveryFee: selectedBid.fee,
          status: "RIDER_ASSIGNED"
        };
      }
      return order;
    }));

    showToast(`Selected ${selectedBid.riderName} for delivery!`);
  };

  const submitRiderBid = ({ orderId, fee, etaMinutes }) => {
    const newBid = {
      id: Date.now(),
      orderId: Number(orderId),
      riderId: currentUser.id,
      riderName: currentUser.name,
      riderRating: 4.9,
      completedDeliveries: 120,
      vehicleType: currentUser.vehicleType || "Motorcycle",
      fee: Number(fee),
      etaMinutes: Number(etaMinutes),
      distanceKm: 2.5,
      status: "PENDING",
      submittedAt: Date.now()
    };

    setBids(prev => [newBid, ...prev]);
    showToast(`Bid of $${Number(fee).toFixed(2)} submitted for Order #${orderId}`);
    return newBid;
  };

  // Seller Dish Operations
  const addFood = (foodData) => {
    const newFood = {
      id: Date.now(),
      sellerId: 1, // linked to current active seller
      sellerName: currentUser.name,
      rating: 5.0,
      image: foodData.image || "/food_jollof_1788517799135.jpg",
      isAvailable: true,
      location: "Market District",
      ...foodData
    };
    setFoods(prev => [newFood, ...prev]);
    showToast(`Added ${newFood.name} to menu!`);
  };

  const updateFood = (id, updatedFields) => {
    setFoods(prev => prev.map(f => f.id === id ? { ...f, ...updatedFields } : f));
    showToast("Dish details updated!");
  };

  const deleteFood = (id) => {
    setFoods(prev => prev.filter(f => f.id !== id));
    showToast("Dish removed from menu");
  };

  const updateSellerProfile = (sellerId, updatedFields) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, ...updatedFields } : s));
    showToast("Kitchen profile updated!");
  };

  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      timestamp: Date.now(),
      authorName: currentUser.name,
      ...reviewData
    };
    setReviews(prev => [newReview, ...prev]);
    showToast("Thank you for your rating & review!");
  };

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      foods,
      sellers,
      orders,
      bids,
      cart,
      reviews,
      toastMessage,
      showToast,
      login,
      register,
      logout,
      switchRole,
      setCurrentUser,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      acceptRiderBid,
      submitRiderBid,
      addFood,
      updateFood,
      deleteFood,
      updateSellerProfile,
      addReview
    }}>
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex items-center bg-[#1C1B1F] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 animate-bounce">
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
