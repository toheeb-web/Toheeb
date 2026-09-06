import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialUsers, 
  initialSellers, 
  initialFoods, 
  initialOrders, 
  initialBids, 
  initialReviews,
  NIGERIAN_BANKS,
  NIGERIAN_LOCATIONS
} from '../data/initialData';
import { 
  firebaseSignIn, 
  firebaseRegister, 
  firebaseSignOut, 
  isFirebaseConfigured, 
  auth 
} from '../services/firebase';

const AppContext = createContext();

// Format currency in Nigerian Naira (₦)
export const formatNaira = (amount) => {
  const num = Number(amount) || 0;
  return `₦${num.toLocaleString('en-NG')}`;
};

export const AppProvider = ({ children }) => {
  // Clear any legacy dollar cache from previous versions
  useEffect(() => {
    const version = localStorage.getItem('cc_version');
    if (version !== 'ngn_v3_live') {
      localStorage.removeItem('cc_foods');
      localStorage.removeItem('cc_orders');
      localStorage.removeItem('cc_bids');
      localStorage.removeItem('cc_sellers');
      localStorage.setItem('cc_version', 'ngn_v3_live');
    }
  }, []);

  // Navigation and Modal Visibility State
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return !localStorage.getItem('chopconnect_onboarded');
  });
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  // Load state from localStorage or initial seed
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cc_users_ngn');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_current_user_ngn');
    if (saved) return JSON.parse(saved);
    return initialUsers[0]; // Chief Amara (Buyer)
  });

  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem('cc_foods_ngn');
    return saved ? JSON.parse(saved) : initialFoods;
  });

  const [sellers, setSellers] = useState(() => {
    const saved = localStorage.getItem('cc_sellers_ngn');
    return saved ? JSON.parse(saved) : initialSellers;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cc_orders_ngn');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [bids, setBids] = useState(() => {
    const saved = localStorage.getItem('cc_bids_ngn');
    return saved ? JSON.parse(saved) : initialBids;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cc_cart_ngn');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('cc_reviews_ngn');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // Financial Wallet Withdrawals and Transactions Ledger
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('cc_transactions_ngn');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "TXN-9021",
        userId: 2, // Mama K (Seller)
        type: "CREDIT",
        description: "Order #101 Sales Payout (Net after 5% platform commission)",
        grossAmount: 9700,
        commissionFee: 485,
        netAmount: 9215,
        status: "COMPLETED",
        timestamp: Date.now() - 1000 * 60 * 15
      },
      {
        id: "TXN-9022",
        userId: 3, // Tunde (Rider)
        type: "CREDIT",
        description: "Delivery fee payout for Order #101",
        grossAmount: 1500,
        commissionFee: 400, // ChopConnect retention
        netAmount: 1100,    // Courier receives ₦1,100
        status: "COMPLETED",
        timestamp: Date.now() - 1000 * 60 * 10
      }
    ];
  });

  // Current Verified Customer Location
  const [verifiedLocation, setVerifiedLocation] = useState({
    city: "Lagos",
    area: "Lekki Phase 1",
    streetAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    isGpsVerified: true,
    latitude: 6.4474,
    longitude: 3.4833
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cc_users_ngn', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cc_current_user_ngn', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cc_foods_ngn', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('cc_sellers_ngn', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('cc_orders_ngn', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cc_bids_ngn', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('cc_cart_ngn', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cc_reviews_ngn', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cc_transactions_ngn', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Operations
  const login = async (email, password, rolePreference) => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignIn(email, password);
      } catch (err) {
        console.warn("Firebase Auth sign-in warning:", err.message);
      }
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updated = {
        ...existing,
        role: rolePreference || existing.role,
        isOnline: true,
        lastSeen: "Online Now"
      };
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setCurrentUser(updated);
      showToast(`Welcome back, ${updated.name}!`);
      return updated;
    } else {
      const nameFromEmail = email.split('@')[0];
      const newUser = {
        id: Date.now(),
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        email: email.trim().toLowerCase(),
        role: rolePreference || 'BUYER',
        phone: "+234 802 476 4090",
        address: "Admiralty Way, Lekki Phase 1, Lagos",
        city: "Lagos",
        isApproved: true,
        isOnline: true,
        lastSeen: "Online Now",
        avatarInitials: nameFromEmail.slice(0, 2).toUpperCase(),
        registeredAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      showToast(`Logged in as ${newUser.name} (${newUser.role})`);
      return newUser;
    }
  };

  const register = async ({ name, email, password, role, vehicleType, businessName, phone, address, city }) => {
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
      phone: phone || "+234 802 476 4090",
      address: address || "Lekki Phase 1, Lagos, Nigeria",
      city: city || "Lagos",
      vehicleType: vehicleType || (role === 'RIDER' ? 'Motorcycle' : undefined),
      isApproved: true,
      isOnline: true,
      lastSeen: "Online Now",
      avatarInitials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "CC",
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);

    // If registered as Seller, create their kitchen profile
    if (role === 'SELLER') {
      const newSeller = {
        id: Date.now(),
        userId: newUser.id,
        businessName: businessName || `${newUser.name}'s Kitchen`,
        description: "Fresh authentic Nigerian culinary delights prepared with high quality ingredients and native spices.",
        cuisineType: "Nigerian / African Specials",
        rating: 5.0,
        reviewCount: 0,
        address: address || "Victoria Island, Lagos",
        city: city || "Lagos",
        phone: phone || "+234 802 476 4090",
        isOpen: true,
        isApproved: true,
        commissionRate: 0.05, // 5% platform commission
        image: "/chopconnect_hero_1788517559174.jpg"
      };
      setSellers(prev => [newSeller, ...prev]);
    }

    setCurrentUser(newUser);
    showToast(`Account registered successfully! Welcome, ${newUser.name}.`);
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
    // Update online status
    if (currentUser) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isOnline: false, lastSeen: "Just now" } : u));
    }
    setCurrentUser(null);
    showToast("Signed out successfully.");
  };

  const switchRole = (role) => {
    const matching = users.find(u => u.role === role);
    if (matching) {
      const activeUser = { ...matching, isOnline: true, lastSeen: "Online Now" };
      setUsers(prev => prev.map(u => u.id === activeUser.id ? activeUser : u));
      setCurrentUser(activeUser);
      showToast(`Switched active view to ${activeUser.name} (${role})`);
    } else {
      const updated = { ...currentUser, role, isOnline: true, lastSeen: "Online Now" };
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

  // Order Operations with Monetization Model (5% Food Commission + Delivery Split)
  const placeOrder = ({ deliveryAddress, notes = "", paymentMethod = "Mastercard Debit", transactionRef = null }) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const primarySeller = sellers.find(s => s.id === cart[0].sellerId) || sellers[0];

    // Monetization Rule 1: 5% Commission on food vendors before withdrawal
    const vendorCommission = Math.round(subtotal * 0.05);
    const vendorNet = subtotal - vendorCommission;

    // Monetization Rule 2: Delivery charge (Customer pays ₦1,500, Driver receives ₦1,100, ChopConnect keeps ₦400)
    const deliveryFee = 1500;
    const riderFee = 1100;
    const platformDeliveryFee = 400;

    const newOrderId = 100 + orders.length + 1;
    const itemsSummary = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const txnRef = transactionRef || `CC-NGN-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: newOrderId,
      buyerId: currentUser?.id || 1,
      buyerName: currentUser?.name || "Customer",
      buyerPhone: currentUser?.phone || "+234 802 476 4090",
      sellerId: primarySeller.id,
      sellerName: primarySeller.businessName,
      deliveryAddress: deliveryAddress || verifiedLocation.streetAddress,
      status: "PLACED",
      subtotal,
      deliveryFee,
      riderFee,
      platformDeliveryFee,
      vendorCommission,
      vendorNet,
      riderId: null,
      riderName: null,
      riderEta: null,
      paymentMethod,
      paymentStatus: "PAID",
      transactionRef: txnRef,
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

    // Record initial platform transaction log
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: newOrderId,
      userId: primarySeller.userId,
      type: "CREDIT",
      description: `Sales for Order #${newOrderId} (Net after 5% platform commission)`,
      grossAmount: subtotal,
      commissionFee: vendorCommission,
      netAmount: vendorNet,
      status: "PENDING_DELIVERY",
      timestamp: Date.now()
    };
    setTransactions(prev => [newTxn, ...prev]);

    showToast(`Order #${newOrderId} confirmed! Paid ${formatNaira(subtotal + deliveryFee)}.`);

    // Automatically dispatch live available couriers to submit bids
    setTimeout(() => {
      const generatedBids = [
        {
          id: Date.now(),
          orderId: newOrderId,
          riderId: 3,
          riderName: "Tunde Balogun (Express)",
          riderRating: 4.95,
          completedDeliveries: 164,
          vehicleType: "Motorcycle (Boxer 150)",
          fee: 1500,
          riderTakeHome: 1100,
          platformMargin: 400,
          etaMinutes: 18,
          distanceKm: 2.8,
          status: "PENDING",
          submittedAt: Date.now()
        },
        {
          id: Date.now() + 1,
          orderId: newOrderId,
          riderId: 4,
          riderName: "David Okoro",
          riderRating: 4.88,
          completedDeliveries: 112,
          vehicleType: "E-Bike Courier",
          fee: 1400,
          riderTakeHome: 1000,
          platformMargin: 400,
          etaMinutes: 24,
          distanceKm: 3.1,
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

    // If order is completed/delivered, finalize credit to vendor and rider wallets
    if (status === 'DELIVERED') {
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder) {
        const riderTxn = {
          id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          orderId: orderId,
          userId: currentOrder.riderId || 3,
          type: "CREDIT",
          description: `Courier Delivery Earnings for Order #${orderId}`,
          grossAmount: currentOrder.deliveryFee || 1500,
          commissionFee: currentOrder.platformDeliveryFee || 400,
          netAmount: currentOrder.riderFee || 1100,
          status: "COMPLETED",
          timestamp: Date.now()
        };
        setTransactions(prev => [riderTxn, ...prev]);
      }
    }

    showToast(`Order #${orderId} marked as ${status.replace(/_/g, ' ')}`);
  };

  const acceptRiderBid = (orderId, bidId) => {
    const selectedBid = bids.find(b => b.id === bidId);
    if (!selectedBid) return;

    setBids(prev => prev.map(b => {
      if (b.orderId === orderId) {
        return { ...b, status: b.id === bidId ? "ACCEPTED" : "DECLINED" };
      }
      return b;
    }));

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          riderId: selectedBid.riderId,
          riderName: selectedBid.riderName,
          riderEta: `${selectedBid.etaMinutes} mins`,
          deliveryFee: selectedBid.fee,
          riderFee: selectedBid.riderTakeHome || 1100,
          platformDeliveryFee: selectedBid.platformMargin || 400,
          status: "RIDER_ASSIGNED"
        };
      }
      return order;
    }));

    showToast(`Selected courier: ${selectedBid.riderName}`);
  };

  const submitRiderBid = ({ orderId, fee, etaMinutes }) => {
    const totalFee = Number(fee) || 1500;
    // Driver receives fee minus ₦400 platform share
    const platformMargin = 400;
    const riderTakeHome = Math.max(0, totalFee - platformMargin);

    const newBid = {
      id: Date.now(),
      orderId: Number(orderId),
      riderId: currentUser.id,
      riderName: currentUser.name,
      riderRating: 4.95,
      completedDeliveries: 130,
      vehicleType: currentUser.vehicleType || "Motorcycle",
      fee: totalFee,
      riderTakeHome,
      platformMargin,
      etaMinutes: Number(etaMinutes),
      distanceKm: 2.7,
      status: "PENDING",
      submittedAt: Date.now()
    };

    setBids(prev => [newBid, ...prev]);
    showToast(`Bid of ${formatNaira(totalFee)} submitted (Your earning: ${formatNaira(riderTakeHome)})`);
    return newBid;
  };

  // Dish Operations
  const addFood = (foodData) => {
    const newFood = {
      id: Date.now(),
      sellerId: sellers[0]?.id || 1,
      sellerName: currentUser.name,
      rating: 5.0,
      image: foodData.image || "/food_jollof_1788517799135.jpg",
      isAvailable: true,
      location: currentUser.address || "Lagos, Nigeria",
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

  // Instant Bank Withdrawal for Sellers and Couriers
  const withdrawFunds = ({ amount, bankName, accountNumber, accountName }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1000) {
      showToast("Minimum withdrawal amount is ₦1,000");
      return false;
    }

    const withdrawalTxn = {
      id: `WDR-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      type: "DEBIT",
      description: `Bank Withdrawal to ${bankName} (${accountNumber}) - ${accountName}`,
      grossAmount: numAmount,
      commissionFee: 0,
      netAmount: numAmount,
      status: "COMPLETED",
      reference: `NIP-TRANSFER-${Date.now()}`,
      timestamp: Date.now()
    };

    setTransactions(prev => [withdrawalTxn, ...prev]);
    showToast(`Transfer of ${formatNaira(numAmount)} to ${accountName} (${bankName}) initiated successfully!`);
    return true;
  };

  // Location Verification Helper
  const verifyLocation = (locData) => {
    setVerifiedLocation(prev => ({
      ...prev,
      ...locData,
      isGpsVerified: true
    }));
    showToast(`Location verified: ${locData.area}, ${locData.city}`);
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
      transactions,
      verifiedLocation,
      toastMessage,
      showToast,
      formatNaira,
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
      addReview,
      withdrawFunds,
      verifyLocation,
      onboardingOpen,
      setOnboardingOpen,
      quickNavOpen,
      setQuickNavOpen,
      directoryOpen,
      setDirectoryOpen,
      locationOpen,
      setLocationOpen,
      installOpen,
      setInstallOpen
    }}>
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex items-center bg-[#1C1B1F] text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-white/10 animate-bounce">
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
