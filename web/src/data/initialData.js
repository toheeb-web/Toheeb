// Initial seed data for ChopConnect Web replicating the Room Database entities

export const initialUsers = [
  {
    id: 1,
    name: "Amara Okonkwo",
    email: "amara@chopconnect.com",
    role: "BUYER",
    phone: "+1 (555) 234-5678",
    address: "14 Metro Boulevard, Apt 4B, Downtown",
    isApproved: true,
    avatarInitials: "AO"
  },
  {
    id: 2,
    name: "Mama K's Kitchen",
    email: "mamak@chopconnect.com",
    role: "SELLER",
    phone: "+1 (555) 876-5432",
    address: "42 Kingsway Street, Market District",
    isApproved: true,
    avatarInitials: "MK"
  },
  {
    id: 3,
    name: "Tunde Swift",
    email: "tunde@chopconnect.com",
    role: "RIDER",
    phone: "+1 (555) 345-6789",
    address: "Downtown Transit Hub",
    isApproved: true,
    vehicleType: "Motorcycle",
    avatarInitials: "TS"
  },
  {
    id: 4,
    name: "David K",
    email: "david@chopconnect.com",
    role: "RIDER",
    phone: "+1 (555) 456-7890",
    address: "Central Express",
    isApproved: true,
    vehicleType: "E-Bike",
    avatarInitials: "DK"
  },
  {
    id: 5,
    name: "Blessing Rider",
    email: "blessing@chopconnect.com",
    role: "RIDER",
    phone: "+1 (555) 987-6543",
    address: "Eastside Terminal",
    isApproved: true,
    vehicleType: "Scooter",
    avatarInitials: "BR"
  }
];

export const initialSellers = [
  {
    id: 1,
    userId: 2,
    businessName: "Mama K's Authentic Kitchen",
    description: "Homestyle Nigerian delicacies, smoky party jollof, tender goat meat stews, and fresh swallows prepared daily with secret ancestral spices.",
    cuisineType: "Nigerian / West African",
    rating: 4.9,
    reviewCount: 142,
    address: "42 Kingsway Street, Market District",
    phone: "+1 (555) 876-5432",
    isOpen: true,
    isApproved: true,
    image: "/chopconnect_hero_1788517559174.jpg"
  },
  {
    id: 2,
    userId: 2,
    businessName: "The Suya Lounge & Grills",
    description: "Flame-charred suya skewers, spicy grilled whole tilapia, roasted plantain (boli), seasoned with authentic yaji peanut spices.",
    cuisineType: "Barbecue & Grills",
    rating: 4.8,
    reviewCount: 98,
    address: "18 Victoria Island Crescent",
    phone: "+1 (555) 901-2345",
    isOpen: true,
    isApproved: true,
    image: "/food_suya_1788517820467.jpg"
  },
  {
    id: 3,
    userId: 2,
    businessName: "AfroBistro & Bakery",
    description: "Artisanal meat pies, hot golden puff puff, savory rolls, and chilled organic hibiscus zobo coolers.",
    cuisineType: "Bakery & Fast Food",
    rating: 4.7,
    reviewCount: 65,
    address: "77 Boulevard Avenue, Uptown",
    phone: "+1 (555) 345-6712",
    isOpen: true,
    isApproved: true,
    image: "/chopconnect_hero_1788517559174.jpg"
  }
];

export const initialFoods = [
  {
    id: 1,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Smokey Party Jollof Rice with Grilled Chicken",
    description: "Firewood-infused aromatic jollof rice served with spiced flame-grilled chicken drumstick and caramelized plantain dodo.",
    price: 14.50,
    category: "Rice & Mains",
    quantity: 30,
    isAvailable: true,
    location: "Market District",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.9,
    prepTimeMinutes: 20
  },
  {
    id: 2,
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    name: "Prime Beef Suya Skewers (5 pcs)",
    description: "Thinly sliced tender beef marinated in peanut yaji chili spices, flame-grilled over hot coals with sweet red onions and tomatoes.",
    price: 12.00,
    category: "Grills & Suya",
    quantity: 40,
    isAvailable: true,
    location: "Victoria Island",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.9,
    prepTimeMinutes: 15
  },
  {
    id: 3,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Rich Egusi Soup with Pounded Yam & Goat Meat",
    description: "Melon seed soup simmered with dried catfish, spinach, shredded stockfish, served with smooth hand-pounded yam.",
    price: 16.50,
    category: "Soups & Stews",
    quantity: 25,
    isAvailable: true,
    location: "Market District",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.8,
    prepTimeMinutes: 30
  },
  {
    id: 4,
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    name: "Special Fried Rice with Peppered Asun",
    description: "Savory seasoned fried rice with sweet corn, carrots, green peas, and spicy tender chopped goat meat (asun).",
    price: 15.00,
    category: "Rice & Mains",
    quantity: 20,
    isAvailable: true,
    location: "Market District",
    image: "/food_jollof_1788517799135.jpg",
    rating: 4.8,
    prepTimeMinutes: 25
  },
  {
    id: 5,
    sellerId: 3,
    sellerName: "AfroBistro & Bakery",
    name: "Golden Sugar-Glazed Puff Puff Platter (10 pcs)",
    description: "Deep-fried dough puffs with nutmeg aroma, crispy outside and cloud-soft fluffy interior.",
    price: 6.50,
    category: "Fast Food",
    quantity: 50,
    isAvailable: true,
    location: "Uptown",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.9,
    prepTimeMinutes: 10
  },
  {
    id: 6,
    sellerId: 3,
    sellerName: "AfroBistro & Bakery",
    name: "Crispy Beef Meat Pie Duo",
    description: "Golden flaky pastry crust packed with seasoned minced beef, potatoes, and savory herb gravy.",
    price: 7.50,
    category: "Fast Food",
    quantity: 35,
    isAvailable: true,
    location: "Uptown",
    image: "/chopconnect_hero_1788517559174.jpg",
    rating: 4.7,
    prepTimeMinutes: 10
  },
  {
    id: 7,
    sellerId: 3,
    sellerName: "AfroBistro & Bakery",
    name: "Chilled Organic Zobo Hibiscus Cooler",
    description: "Refreshing steeped hibiscus flower drink with natural ginger, cloves, and pineapple sweetness.",
    price: 4.50,
    category: "Drinks",
    quantity: 40,
    isAvailable: true,
    location: "Uptown",
    image: "/chopconnect_icon_1788517538782.jpg",
    rating: 4.9,
    prepTimeMinutes: 5
  },
  {
    id: 8,
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    name: "Char-Grilled Whole Tilapia with Spicy Yam Chips",
    description: "Freshly seasoned whole tilapia fish glazed in hot pepper garlic sauce, served with crispy fried yam strips.",
    price: 19.00,
    category: "Grills & Suya",
    quantity: 15,
    isAvailable: true,
    location: "Victoria Island",
    image: "/food_suya_1788517820467.jpg",
    rating: 4.9,
    prepTimeMinutes: 35
  }
];

export const initialOrders = [
  {
    id: 101,
    buyerId: 1,
    buyerName: "Amara Okonkwo",
    buyerPhone: "+1 (555) 234-5678",
    sellerId: 1,
    sellerName: "Mama K's Authentic Kitchen",
    deliveryAddress: "14 Metro Boulevard, Apt 4B, Downtown",
    status: "READY_FOR_DELIVERY", // Ready for buyer to pick rider bid!
    subtotal: 31.00,
    deliveryFee: 4.50,
    riderId: 3,
    riderName: "Tunde Swift",
    riderEta: "18 mins",
    createdAt: Date.now() - 1000 * 60 * 20,
    notes: "Please include extra spicy pepper sauce on the side.",
    itemsSummary: "1x Smokey Party Jollof Rice, 1x Rich Egusi Soup",
    items: [
      { foodId: 1, name: "Smokey Party Jollof Rice with Grilled Chicken", price: 14.50, quantity: 1 },
      { foodId: 3, name: "Rich Egusi Soup with Pounded Yam & Goat Meat", price: 16.50, quantity: 1 }
    ]
  },
  {
    id: 102,
    buyerId: 1,
    buyerName: "Amara Okonkwo",
    buyerPhone: "+1 (555) 234-5678",
    sellerId: 2,
    sellerName: "The Suya Lounge & Grills",
    deliveryAddress: "14 Metro Boulevard, Apt 4B, Downtown",
    status: "DELIVERED",
    subtotal: 24.00,
    deliveryFee: 4.00,
    riderId: 4,
    riderName: "David K",
    riderEta: "Delivered",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    notes: "Leave at front desk with security.",
    itemsSummary: "2x Prime Beef Suya Skewers",
    items: [
      { foodId: 2, name: "Prime Beef Suya Skewers (5 pcs)", price: 12.00, quantity: 2 }
    ]
  }
];

export const initialBids = [
  {
    id: 1,
    orderId: 101,
    riderId: 3,
    riderName: "Tunde Swift",
    riderRating: 4.9,
    completedDeliveries: 142,
    vehicleType: "Motorcycle",
    fee: 4.50,
    etaMinutes: 18,
    distanceKm: 2.4,
    status: "ACCEPTED",
    submittedAt: Date.now() - 1000 * 60 * 12
  },
  {
    id: 2,
    orderId: 101,
    riderId: 4,
    riderName: "David K",
    riderRating: 4.8,
    completedDeliveries: 98,
    vehicleType: "E-Bike",
    fee: 3.80,
    etaMinutes: 25,
    distanceKm: 2.1,
    status: "PENDING",
    submittedAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 3,
    orderId: 101,
    riderId: 5,
    riderName: "Blessing Rider",
    riderRating: 4.95,
    completedDeliveries: 210,
    vehicleType: "Scooter",
    fee: 4.00,
    etaMinutes: 20,
    distanceKm: 2.3,
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
    authorName: "Amara O.",
    rating: 5,
    comment: "The suya was phenomenal! Tender, spicy, and perfectly charred. Arrived piping hot.",
    timestamp: Date.now() - 1000 * 60 * 60 * 20
  },
  {
    id: 2,
    orderId: 102,
    targetType: "RIDER",
    targetId: 4,
    targetName: "David K",
    authorName: "Amara O.",
    rating: 5,
    comment: "Super polite courier! Delivered straight to my door right on time.",
    timestamp: Date.now() - 1000 * 60 * 60 * 20
  }
];
