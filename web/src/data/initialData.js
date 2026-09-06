// Real Registered Users, Kitchens, Dishes, Orders, and Deliveries for ChopConnect Nigeria
// Primary Settlement Account: GTBank 0108688385 (Toheebay)
// Master Admin: Toheebay (Nigeria1@)
// Currency: Nigerian Naira (₦)

export const initialUsers = [
  {
    id: 1,
    name: "Toheebay",
    username: "Toheebay",
    email: "toheebay@chopconnect.ng",
    role: "ADMIN",
    phone: "+234 802 476 4090",
    address: "Central Business District, Lagos",
    city: "Lagos",
    bankName: "Guaranty Trust Bank (GTBank)",
    bankCode: "058",
    accountNumber: "0108688385",
    accountName: "TOHEEBAY",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "TB",
    registeredAt: "2026-09-01"
  },
  {
    id: 2,
    name: "Toheebay's Kitchen",
    username: "toheebay_kitchen",
    email: "toheebay.seller@chopconnect.ng",
    role: "SELLER",
    phone: "+234 802 476 4090",
    address: "42 Kingsway Road, Ikoyi, Lagos",
    city: "Lagos",
    bankName: "Guaranty Trust Bank (GTBank)",
    bankCode: "058",
    accountNumber: "0108688385",
    accountName: "TOHEEBAY",
    flutterwaveSubaccountId: "RS_0108688385GTB",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "TK",
    registeredAt: "2026-09-01"
  },
  {
    id: 3,
    name: "Tunde Balogun (Express)",
    username: "tunde_rider",
    email: "tunde@chopconnect.ng",
    role: "RIDER",
    phone: "+234 802 476 4090",
    address: "Commercial Avenue, Yaba, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    vehicleType: "Motorcycle (Boxer 150)",
    avatarInitials: "TB",
    registeredAt: "2026-09-02"
  },
  {
    id: 4,
    name: "Chief Amara Okonkwo",
    username: "amara_buyer",
    email: "amara@chopconnect.ng",
    role: "BUYER",
    phone: "+234 802 476 4090",
    address: "14 Admiralty Way, Lekki Phase 1, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "AO",
    registeredAt: "2026-09-03"
  }
];

export const initialSellers = [
  {
    id: 1,
    userId: 2,
    businessName: "Toheebay's Kitchen & Grills",
    description: "Live authentic Nigerian food prepared fresh daily. Automatic 95% direct Flutterwave settlement into GTBank 0108688385.",
    cuisineType: "Nigerian / West African & Grills",
    rating: 4.95,
    reviewCount: 142,
    address: "42 Kingsway Road, Ikoyi, Lagos",
    city: "Lagos",
    phone: "+234 802 476 4090",
    isOpen: true,
    isApproved: true,
    commissionRate: 0.05, // 5% platform commission
    image: "/chopconnect_hero_1788517559174.jpg",
    flutterwaveSubaccountId: "RS_0108688385GTB",
    bankCode: "058",
    bankName: "Guaranty Trust Bank (GTBank)",
    accountNumber: "0108688385",
    accountName: "TOHEEBAY"
  }
];

export const initialFoods = [
  {
    id: 1,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Smokey Party Jollof Rice with Grilled Chicken & Dodo",
    description: "Firewood-infused aromatic party jollof rice served with spiced flame-grilled chicken quarter and sweet fried plantain (dodo).",
    price: 4500,
    category: "Rice & Mains",
    quantity: 40,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.95,
    prepTimeMinutes: 20
  },
  {
    id: 2,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Prime Beef Suya Skewers (5 Sticks)",
    description: "Thinly sliced tender beef marinated in authentic Northern yaji chili peanut spices, flame-grilled over coals with red onions and tomatoes.",
    price: 3500,
    category: "Grills & Suya",
    quantity: 50,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.9,
    prepTimeMinutes: 15
  },
  {
    id: 3,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Rich Egusi Soup with Pounded Yam & Tender Goat Meat",
    description: "Hand-ground melon seed soup simmered with dried catfish, uziza leaves, shredded stockfish, served with fluffy pounded yam.",
    price: 5200,
    category: "Soups & Stews",
    quantity: 30,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.95,
    prepTimeMinutes: 25
  },
  {
    id: 4,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Special Native Fried Rice with Peppered Asun",
    description: "Savory seasoned fried rice tossed with fresh liver, green peas, sweet corn, and spicy tender chopped goat meat (asun).",
    price: 4800,
    category: "Rice & Mains",
    quantity: 25,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.85,
    prepTimeMinutes: 20
  },
  {
    id: 5,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Crispy Nigerian Beef Meat Pie (Duo Pack)",
    description: "Flaky golden buttery pastry crust packed with spiced minced beef, diced potatoes, carrots, and savory herb gravy.",
    price: 2200,
    category: "Fast Food",
    quantity: 40,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.8,
    prepTimeMinutes: 10
  },
  {
    id: 6,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Chilled Organic Zobo Hibiscus Cooler (500ml)",
    description: "Refreshing steeped organic hibiscus flower drink sweetened with natural pineapple juice, ginger root, and cloves.",
    price: 1200,
    category: "Drinks",
    quantity: 60,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/chopconnect_icon_1788517538782.jpg",
    rating: 4.9,
    prepTimeMinutes: 5
  },
  {
    id: 7,
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    name: "Char-Grilled Whole Tilapia Fish with Spicy Yam Chips",
    description: "Fresh whole tilapia fish glazed in hot scotch bonnet pepper garlic sauce, served with crispy fried white yam chips.",
    price: 7500,
    category: "Grills & Suya",
    quantity: 20,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.95,
    prepTimeMinutes: 30
  }
];

export const initialOrders = [
  {
    id: 101,
    buyerId: 4,
    buyerName: "Chief Amara Okonkwo",
    buyerPhone: "+234 802 476 4090",
    sellerId: 1,
    sellerName: "Toheebay's Kitchen & Grills",
    deliveryAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    status: "READY_FOR_DELIVERY", // Open for live Nigerian courier pickup!
    subtotal: 9700,
    deliveryFee: 1500, // Customer pays ₦1,500
    riderFee: 1100,    // Courier receives ₦1,100
    platformDeliveryFee: 400, // ChopConnect keeps ₦400
    vendorCommission: 485, // 5% of ₦9,700
    vendorNet: 9215, // ₦9,700 - ₦485 -> Settled to GTBank 0108688385
    riderId: null,
    riderName: null,
    riderPhone: null,
    riderVehicle: null,
    riderEta: null,
    riderLocation: null,
    paymentMethod: "Easy Bank Pay (GTBank)",
    paymentStatus: "PAID",
    transactionRef: "CC-FLW-GTB-0108688385",
    vendorSubaccountId: "RS_0108688385GTB",
    createdAt: Date.now() - 1000 * 60 * 15,
    notes: "Please add extra spicy pepper sauce on the side.",
    itemsSummary: "1x Smokey Party Jollof Rice, 1x Rich Egusi Soup",
    items: [
      { foodId: 1, name: "Smokey Party Jollof Rice with Grilled Chicken & Dodo", price: 4500, quantity: 1 },
      { foodId: 3, name: "Rich Egusi Soup with Pounded Yam & Tender Goat Meat", price: 5200, quantity: 1 }
    ]
  }
];

export const initialBids = [
  {
    id: 1,
    orderId: 101,
    riderId: 3,
    riderName: "Tunde Balogun (Express)",
    riderRating: 4.95,
    completedDeliveries: 184,
    vehicleType: "Motorcycle (Boxer 150)",
    fee: 1500,
    riderTakeHome: 1100,
    platformMargin: 400,
    etaMinutes: 15,
    distanceKm: 2.8,
    status: "ACCEPTED",
    submittedAt: Date.now() - 1000 * 60 * 12
  }
];

export const initialReviews = [
  {
    id: 1,
    orderId: 101,
    targetType: "SELLER",
    targetId: 1,
    targetName: "Toheebay's Kitchen & Grills",
    authorName: "Chief Amara O.",
    rating: 5,
    comment: "Excellent taste! Food was piping hot and authentic. Jollof and goat meat were very tender.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2
  }
];

// Nigerian Banks list for instant withdrawals & settlement
export const NIGERIAN_BANKS = [
  { code: "058", name: "Guaranty Trust Bank (GTBank)" },
  { code: "044", name: "Access Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "035", name: "Wema Bank (ALAT)" },
  { code: "101", name: "Providus Bank" },
  { code: "50211", name: "Kuda Microfinance Bank" },
  { code: "999991", name: "PalmPay Limited" },
  { code: "999992", name: "OPay Digital Services" },
  { code: "232", name: "Sterling Bank" },
  { code: "221", name: "Stanbic IBTC Bank" }
];

// Nigerian Delivery Cities & Areas for location verification
export const NIGERIAN_LOCATIONS = [
  { city: "Lagos", area: "Lekki Phase 1 & 2", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Lagos", area: "Victoria Island", verified: true, verifiedTimeAvg: "15-25 mins" },
  { city: "Lagos", area: "Ikoyi", verified: true, deliveryTimeAvg: "15-25 mins" },
  { city: "Lagos", area: "Ikeja GRA & Allen", verified: true, deliveryTimeAvg: "25-35 mins" },
  { city: "Lagos", area: "Yaba & Surulere", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Abuja", area: "Wuse 2 & Maitama", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Port Harcourt", area: "GRA Phase 1 & 2", verified: true, deliveryTimeAvg: "25-35 mins" }
];
