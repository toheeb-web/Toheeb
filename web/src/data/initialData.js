// Live Registered Users, Kitchens, Dishes, Orders, and Deliveries for ChopConnect Nigeria
// Currency: Nigerian Naira (₦)
// Official Platform Contact: +234 802 476 4090

export const initialUsers = [
  {
    id: 1,
    name: "Chief Amara Okonkwo",
    email: "amara@chopconnect.com",
    role: "BUYER",
    phone: "+234 802 476 4090",
    address: "14 Admiralty Way, Lekki Phase 1, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "AO",
    registeredAt: "2026-08-15"
  },
  {
    id: 2,
    name: "Chef Bisi - Mama K",
    email: "mamak@chopconnect.com",
    role: "SELLER",
    phone: "+234 802 476 4090",
    address: "42 Kingsway Road, Ikoyi, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "MK",
    registeredAt: "2026-08-10"
  },
  {
    id: 3,
    name: "Tunde Balogun (Express)",
    email: "tunde@chopconnect.com",
    role: "RIDER",
    phone: "+234 802 476 4090",
    address: "Commercial Avenue, Yaba, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    vehicleType: "Motorcycle (Boxer 150)",
    avatarInitials: "TB",
    registeredAt: "2026-08-12"
  },
  {
    id: 4,
    name: "David Okoro",
    email: "david@chopconnect.com",
    role: "RIDER",
    phone: "+234 802 476 4090",
    address: "Aminu Kano Crescent, Wuse 2, Abuja",
    city: "Abuja",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    vehicleType: "E-Bike Courier",
    avatarInitials: "DO",
    registeredAt: "2026-08-18"
  },
  {
    id: 5,
    name: "Blessing Adeleke",
    email: "blessing@chopconnect.com",
    role: "RIDER",
    phone: "+234 802 476 4090",
    address: "Isaac John Street, GRA Ikeja, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: false,
    lastSeen: "5m ago",
    vehicleType: "Delivery Scooter",
    avatarInitials: "BA",
    registeredAt: "2026-08-20"
  },
  {
    id: 6,
    name: "Alhaji Bello Grills",
    email: "bello@chopconnect.com",
    role: "SELLER",
    phone: "+234 802 476 4090",
    address: "18 Victoria Island Crescent, Lagos",
    city: "Lagos",
    isApproved: true,
    isOnline: true,
    lastSeen: "Online Now",
    avatarInitials: "AB",
    registeredAt: "2026-08-14"
  }
];

export const initialSellers = [
  {
    id: 1,
    userId: 2,
    businessName: "Mama K's Authentic Kitchen",
    description: "Authentic Nigerian delicacies, smoky party jollof, tender goat meat stews, rich egusi soup and fresh pounded yam prepared daily with organic local spices.",
    cuisineType: "Nigerian / West African",
    rating: 4.9,
    reviewCount: 184,
    address: "42 Kingsway Road, Ikoyi, Lagos",
    city: "Lagos",
    phone: "+234 802 476 4090",
    isOpen: true,
    isApproved: true,
    commissionRate: 0.05, // 5% platform commission
    image: "/chopconnect_hero_1788517559174.jpg"
  },
  {
    id: 2,
    userId: 6,
    businessName: "The Suya Lounge & Grills",
    description: "Flame-charred suya skewers, spicy grilled whole tilapia, roasted plantain (boli), seasoned with authentic Kano yaji peanut spices.",
    cuisineType: "Barbecue & Grills",
    rating: 4.8,
    reviewCount: 126,
    address: "18 Victoria Island Crescent, Lagos",
    city: "Lagos",
    phone: "+234 802 476 4090",
    isOpen: true,
    isApproved: true,
    commissionRate: 0.05, // 5% platform commission
    image: "/food_suya_1788517820467.jpg"
  },
  {
    id: 3,
    userId: 2,
    businessName: "Naija AfroBistro & Bakery",
    description: "Artisanal flaky meat pies, hot golden puff puff platters, chicken shawarma, and chilled organic hibiscus zobo coolers.",
    cuisineType: "Bakery & Fast Food",
    rating: 4.7,
    reviewCount: 92,
    address: "77 Isaac John Street, GRA Ikeja, Lagos",
    city: "Lagos",
    phone: "+234 802 476 4090",
    isOpen: true,
    isApproved: true,
    commissionRate: 0.05, // 5% platform commission
    image: "/chopconnect_hero_1788517559174.jpg"
  }
];

export const initialFoods = [
  {
    id: 1,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Smokey Party Jollof Rice with Grilled Chicken & Dodo",
    description: "Firewood-infused aromatic party jollof rice served with spiced flame-grilled chicken quarter and sweet fried plantain (dodo).",
    price: 4500,
    category: "Rice & Mains",
    quantity: 35,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.9,
    prepTimeMinutes: 20
  },
  {
    id: 2,
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    name: "Prime Beef Suya Skewers (5 Sticks)",
    description: "Thinly sliced tender beef marinated in Northern yaji chili peanut spices, flame-grilled over hot coals with sweet red onions and tomatoes.",
    price: 3500,
    category: "Grills & Suya",
    quantity: 50,
    isAvailable: true,
    location: "Victoria Island, Lagos",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.9,
    prepTimeMinutes: 15
  },
  {
    id: 3,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Rich Egusi Soup with Pounded Yam & Tender Goat Meat",
    description: "Hand-ground melon seed soup simmered with dried catfish, uziza leaves, shredded stockfish, served with fluffy hand-pounded yam.",
    price: 5200,
    category: "Soups & Stews",
    quantity: 30,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.9,
    prepTimeMinutes: 25
  },
  {
    id: 4,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Special Native Fried Rice with Peppered Asun",
    description: "Savory seasoned fried rice tossed with liver, green peas, sweet corn, and spicy tender chopped goat meat (asun).",
    price: 4800,
    category: "Rice & Mains",
    quantity: 25,
    isAvailable: true,
    location: "Ikoyi, Lagos",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.8,
    prepTimeMinutes: 20
  },
  {
    id: 5,
    sellerId: 3,
    sellerName: "Naija AfroBistro & Bakery",
    name: "Golden Sugar-Glazed Puff Puff Platter (10 pcs)",
    description: "Deep-fried golden dough puffs with aromatic nutmeg, crispy on the outside and cloud-soft fluffy on the inside.",
    price: 1800,
    category: "Fast Food",
    quantity: 60,
    isAvailable: true,
    location: "Ikeja, Lagos",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.9,
    prepTimeMinutes: 10
  },
  {
    id: 6,
    sellerId: 3,
    sellerName: "Naija AfroBistro & Bakery",
    name: "Crispy Nigerian Beef Meat Pie (Duo Pack)",
    description: "Flaky golden buttery pastry crust packed with spiced minced beef, potatoes, carrots, and savory herb gravy.",
    price: 2200,
    category: "Fast Food",
    quantity: 40,
    isAvailable: true,
    location: "Ikeja, Lagos",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.7,
    prepTimeMinutes: 10
  },
  {
    id: 7,
    sellerId: 3,
    sellerName: "Naija AfroBistro & Bakery",
    name: "Chilled Organic Zobo Hibiscus Cooler (500ml)",
    description: "Refreshing steeped organic hibiscus flower drink sweetened with natural pineapple juice, ginger root, and cloves.",
    price: 1200,
    category: "Drinks",
    quantity: 50,
    isAvailable: true,
    location: "Ikeja, Lagos",
    image: "/chopconnect_icon_1788517538782.jpg",
    rating: 4.9,
    prepTimeMinutes: 5
  },
  {
    id: 8,
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    name: "Char-Grilled Whole Tilapia Fish with Spicy Yam Chips",
    description: "Fresh whole tilapia fish glazed in hot scotch bonnet pepper garlic sauce, served with crispy fried white yam chips.",
    price: 7500,
    category: "Grills & Suya",
    quantity: 20,
    isAvailable: true,
    location: "Victoria Island, Lagos",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.9,
    prepTimeMinutes: 30
  }
];

export const initialOrders = [
  {
    id: 101,
    buyerId: 1,
    buyerName: "Chief Amara Okonkwo",
    buyerPhone: "+234 802 476 4090",
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    deliveryAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    status: "READY_FOR_DELIVERY", // Ready for customer to pick rider bid!
    subtotal: 9700,
    deliveryFee: 1500, // Customer pays ₦1,500
    riderFee: 1100,    // Courier receives ₦1,100
    platformDeliveryFee: 400, // ChopConnect keeps ₦400
    vendorCommission: 485, // 5% of ₦9,700
    vendorNet: 9215, // ₦9,700 - ₦485
    riderId: 3,
    riderName: "Tunde Balogun (Express)",
    riderEta: "18 mins",
    paymentMethod: "Mastercard Debit",
    paymentStatus: "PAID",
    transactionRef: "CC-NGN-TXN-884920",
    createdAt: Date.now() - 1000 * 60 * 18,
    notes: "Please add extra spicy pepper sauce on the side.",
    itemsSummary: "1x Smokey Party Jollof Rice, 1x Rich Egusi Soup",
    items: [
      { foodId: 1, name: "Smokey Party Jollof Rice with Grilled Chicken & Dodo", price: 4500, quantity: 1 },
      { foodId: 3, name: "Rich Egusi Soup with Pounded Yam & Tender Goat Meat", price: 5200, quantity: 1 }
    ]
  },
  {
    id: 102,
    buyerId: 1,
    buyerName: "Chief Amara Okonkwo",
    buyerPhone: "+234 802 476 4090",
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    deliveryAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    status: "DELIVERED",
    subtotal: 7000,
    deliveryFee: 1500,
    riderFee: 1100,
    platformDeliveryFee: 400,
    vendorCommission: 350, // 5% of ₦7,000
    vendorNet: 6650,
    riderId: 4,
    riderName: "David Okoro",
    riderEta: "Delivered",
    paymentMethod: "Direct Bank Transfer",
    paymentStatus: "PAID",
    transactionRef: "CC-NGN-TXN-773194",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    notes: "Leave at security gate Lekki.",
    itemsSummary: "2x Prime Beef Suya Skewers",
    items: [
      { foodId: 2, name: "Prime Beef Suya Skewers (5 Sticks)", price: 3500, quantity: 2 }
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
    completedDeliveries: 164,
    vehicleType: "Motorcycle (Boxer 150)",
    fee: 1500,
    riderTakeHome: 1100,
    platformMargin: 400,
    etaMinutes: 18,
    distanceKm: 2.8,
    status: "ACCEPTED",
    submittedAt: Date.now() - 1000 * 60 * 12
  },
  {
    id: 2,
    orderId: 101,
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
    submittedAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 3,
    orderId: 101,
    riderId: 5,
    riderName: "Blessing Adeleke",
    riderRating: 4.92,
    completedDeliveries: 220,
    vehicleType: "Delivery Scooter",
    fee: 1500,
    riderTakeHome: 1100,
    platformMargin: 400,
    etaMinutes: 20,
    distanceKm: 2.5,
    status: "PENDING",
    submittedAt: Date.now() - 1000 * 60 * 8
  }
];

export const initialReviews = [
  {
    id: 1,
    orderId: 102,
    targetType: "SELLER",
    targetId: 2,
    targetName: "The Suya Lounge & Grills",
    authorName: "Chief Amara O.",
    rating: 5,
    comment: "The suya was hot, properly seasoned with Kano yaji, and packaged neatly! Will order every Friday.",
    timestamp: Date.now() - 1000 * 60 * 60 * 20
  },
  {
    id: 2,
    orderId: 102,
    targetType: "RIDER",
    targetId: 4,
    targetName: "David Okoro",
    authorName: "Chief Amara O.",
    rating: 5,
    comment: "Express delivery to Lekki Phase 1! The courier was very courteous and maintained thermal bag heat.",
    timestamp: Date.now() - 1000 * 60 * 60 * 20
  }
];

// Nigerian Banks list for instant withdrawals
export const NIGERIAN_BANKS = [
  { code: "058", name: "Guaranty Trust Bank (GTBank)" },
  { code: "044", name: "Access Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "035", name: "Wema Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "50211", name: "Kuda Microfinance Bank" },
  { code: "999991", name: "OPay Digital Services" },
  { code: "999992", name: "Palmpay Limited" },
  { code: "232", name: "Sterling Bank" },
  { code: "221", name: "Stanbic IBTC Bank" }
];

// Nigerian Delivery Cities & Areas for location verification
export const NIGERIAN_LOCATIONS = [
  { city: "Lagos", area: "Lekki Phase 1 & 2", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Lagos", area: "Victoria Island", verified: true, deliveryTimeAvg: "15-25 mins" },
  { city: "Lagos", area: "Ikoyi", verified: true, deliveryTimeAvg: "15-25 mins" },
  { city: "Lagos", area: "Ikeja GRA & Allen", verified: true, deliveryTimeAvg: "25-35 mins" },
  { city: "Lagos", area: "Yaba & Surulere", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Abuja", area: "Wuse 2 & Maitama", verified: true, deliveryTimeAvg: "20-30 mins" },
  { city: "Abuja", area: "Garki & Central Area", verified: true, deliveryTimeAvg: "25-35 mins" },
  { city: "Port Harcourt", area: "GRA Phase 1, 2, 3", verified: true, deliveryTimeAvg: "25-35 mins" },
  { city: "Ibadan", area: "Bodija & Ring Road", verified: true, deliveryTimeAvg: "30-40 mins" }
];
