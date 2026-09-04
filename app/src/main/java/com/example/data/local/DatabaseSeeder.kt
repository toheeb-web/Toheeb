package com.example.data.local

import com.example.data.local.entity.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseSeeder {
    suspend fun seedIfEmpty(database: ChopConnectDatabase) = withContext(Dispatchers.IO) {
        val userDao = database.userDao()
        val existingUsers = userDao.getUserById(1)
        if (existingUsers != null) return@withContext

        // 1. Seed Users representing the 4 roles
        val users = listOf(
            UserEntity(
                id = 1,
                name = "Amara Okonkwo",
                email = "amara@chopconnect.com",
                role = "BUYER",
                phone = "+1 (555) 234-5678",
                address = "14 Metro Boulevard, Apt 4B, Downtown",
                isApproved = true,
                avatarInitials = "AO"
            ),
            UserEntity(
                id = 2,
                name = "Mama K's Kitchen",
                email = "mamak@chopconnect.com",
                role = "SELLER",
                phone = "+1 (555) 876-5432",
                address = "42 Kingsway Street, Market District",
                isApproved = true,
                avatarInitials = "MK"
            ),
            UserEntity(
                id = 3,
                name = "Tunde Swift",
                email = "tunde@chopconnect.com",
                role = "RIDER",
                phone = "+1 (555) 345-6789",
                address = "Downtown Transit Hub",
                isApproved = true,
                vehicleType = "Motorcycle",
                avatarInitials = "TS"
            ),
            UserEntity(
                id = 4,
                name = "David K",
                email = "david@chopconnect.com",
                role = "RIDER",
                phone = "+1 (555) 456-7890",
                address = "Central Express",
                isApproved = true,
                vehicleType = "E-Bike",
                avatarInitials = "DK"
            ),
            UserEntity(
                id = 5,
                name = "Blessing Rider",
                email = "blessing@chopconnect.com",
                role = "RIDER",
                phone = "+1 (555) 987-6543",
                address = "Eastside Terminal",
                isApproved = true,
                vehicleType = "Scooter",
                avatarInitials = "BR"
            ),
            UserEntity(
                id = 6,
                name = "Marketplace Admin",
                email = "admin@chopconnect.com",
                role = "ADMIN",
                phone = "+1 (555) 000-1111",
                address = "ChopConnect HQ, Floor 10",
                isApproved = true,
                avatarInitials = "AD"
            )
        )
        userDao.insertUsers(users)

        // 2. Seed Sellers
        val sellerDao = database.sellerDao()
        val sellers = listOf(
            SellerProfileEntity(
                id = 1,
                userId = 2,
                businessName = "Mama K's Authentic Kitchen",
                description = "Homestyle Nigerian delicacies, smoky jollof, tender goat meat stews, and fresh swallows made fresh daily.",
                cuisineType = "Nigerian / West African",
                rating = 4.9,
                reviewCount = 142,
                address = "42 Kingsway Street, Market District",
                phone = "+1 (555) 876-5432",
                isOpen = true,
                isApproved = true,
                imageResName = "chopconnect_hero_1788517559174"
            ),
            SellerProfileEntity(
                id = 2,
                userId = 2,
                businessName = "The Suya Lounge & Grills",
                description = "Flame-charred suya skewers, spicy grilled tilapia, roasted plantain (boli), seasoned with authentic yaji spice.",
                cuisineType = "Barbecue & Grills",
                rating = 4.8,
                reviewCount = 98,
                address = "18 Victoria Island Crescent",
                phone = "+1 (555) 901-2345",
                isOpen = true,
                isApproved = true,
                imageResName = "food_suya_1788517820467"
            ),
            SellerProfileEntity(
                id = 3,
                userId = 2,
                businessName = "AfroBistro & Bakery",
                description = "Artisanal meat pies, hot golden puff puff, savory rolls, and chilled hibiscus zobo drinks.",
                cuisineType = "Bakery & Fast Food",
                rating = 4.7,
                reviewCount = 65,
                address = "77 Boulevard Avenue, Uptown",
                phone = "+1 (555) 345-6712",
                isOpen = true,
                isApproved = true,
                imageResName = "chopconnect_hero_1788517559174"
            )
        )
        sellerDao.insertSellers(sellers)

        // 3. Seed Food items
        val foodDao = database.foodDao()
        val foods = listOf(
            FoodItemEntity(
                id = 1,
                sellerId = 1,
                sellerName = "Mama K's Authentic Kitchen",
                name = "Smokey Party Jollof Rice with Grilled Chicken",
                description = "Firewood-infused aromatic jollof rice served with spiced grilled chicken drumstick and caramelized plantain dodo.",
                price = 14.50,
                category = "Rice & Mains",
                quantity = 30,
                isAvailable = true,
                location = "Market District",
                imageResName = "food_jollof_1788517799135",
                rating = 4.9,
                prepTimeMinutes = 20
            ),
            FoodItemEntity(
                id = 2,
                sellerId = 2,
                sellerName = "The Suya Lounge & Grills",
                name = "Prime Beef Suya Skewers (5 pcs)",
                description = "Thinly sliced tender beef marinated in peanut yaji chili spices, flame-grilled over hot coals with sweet red onions.",
                price = 12.00,
                category = "Grills & Suya",
                quantity = 40,
                isAvailable = true,
                location = "Victoria Island",
                imageResName = "food_suya_1788517820467",
                rating = 4.9,
                prepTimeMinutes = 15
            ),
            FoodItemEntity(
                id = 3,
                sellerId = 1,
                sellerName = "Mama K's Authentic Kitchen",
                name = "Rich Egusi Soup with Pounded Yam & Goat Meat",
                description = "Melon seed soup simmered with dried catfish, spinach, shredded stockfish, served with smooth pounded yam.",
                price = 16.50,
                category = "Soups & Stews",
                quantity = 25,
                isAvailable = true,
                location = "Market District",
                imageResName = "chopconnect_hero_1788517559174",
                rating = 4.8,
                prepTimeMinutes = 30
            ),
            FoodItemEntity(
                id = 4,
                sellerId = 1,
                sellerName = "Mama K's Authentic Kitchen",
                name = "Special Fried Rice with Peppered Asun",
                description = "Savory seasoned fried rice with sweet corn, carrots, peas, and spicy tender chopped goat meat (asun).",
                price = 15.00,
                category = "Rice & Mains",
                quantity = 20,
                isAvailable = true,
                location = "Market District",
                imageResName = "food_jollof_1788517799135",
                rating = 4.8,
                prepTimeMinutes = 25
            ),
            FoodItemEntity(
                id = 5,
                sellerId = 3,
                sellerName = "AfroBistro & Bakery",
                name = "Golden Sugar-Glazed Puff Puff Platter (10 pcs)",
                description = "Deep-fried dough puffs with nutmeg aroma, crispy outside and cloud-soft fluffy interior.",
                price = 6.50,
                category = "Fast Food",
                quantity = 50,
                isAvailable = true,
                location = "Uptown",
                imageResName = "chopconnect_hero_1788517559174",
                rating = 4.9,
                prepTimeMinutes = 10
            ),
            FoodItemEntity(
                id = 6,
                sellerId = 3,
                sellerName = "AfroBistro & Bakery",
                name = "Crispy Beef Meat Pie Duo",
                description = "Golden flaky pastry crust packed with seasoned minced beef, potatoes, and savory herb gravy.",
                price = 7.50,
                category = "Fast Food",
                quantity = 35,
                isAvailable = true,
                location = "Uptown",
                imageResName = "chopconnect_hero_1788517559174",
                rating = 4.7,
                prepTimeMinutes = 10
            ),
            FoodItemEntity(
                id = 7,
                sellerId = 3,
                sellerName = "AfroBistro & Bakery",
                name = "Chilled Organic Zobo Hibiscus Cooler",
                description = "Refreshing steeped hibiscus flower drink with natural ginger, cloves, and pineapple sweetness.",
                price = 4.50,
                category = "Drinks",
                quantity = 40,
                isAvailable = true,
                location = "Uptown",
                imageResName = "chopconnect_icon_1788517538782",
                rating = 4.9,
                prepTimeMinutes = 5
            ),
            FoodItemEntity(
                id = 8,
                sellerId = 2,
                sellerName = "The Suya Lounge & Grills",
                name = "Char-Grilled Whole Tilapia with Spicy Yam Chips",
                description = "Freshly seasoned whole tilapia fish glazed in hot pepper garlic sauce, served with crispy fried yam strips.",
                price = 19.00,
                category = "Grills & Suya",
                quantity = 15,
                isAvailable = true,
                location = "Victoria Island",
                imageResName = "food_suya_1788517820467",
                rating = 4.9,
                prepTimeMinutes = 35
            )
        )
        foodDao.insertAll(foods)

        // 4. Seed an active order with multiple rider bids to demonstrate the bidding mechanism immediately
        val orderDao = database.orderDao()
        val sampleOrderId = orderDao.insertOrder(
            OrderEntity(
                id = 101,
                buyerId = 1,
                buyerName = "Amara Okonkwo",
                buyerPhone = "+1 (555) 234-5678",
                sellerId = 1,
                sellerName = "Mama K's Authentic Kitchen",
                deliveryAddress = "14 Metro Boulevard, Apt 4B, Downtown",
                status = "READY_FOR_DELIVERY", // Ready for rider selection!
                subtotal = 29.00,
                deliveryFee = 0.0,
                riderId = null,
                riderName = null,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 15,
                notes = "Please include extra pepper sauce on the side.",
                itemsSummary = "1x Smokey Party Jollof Rice, 1x Rich Egusi Soup"
            )
        ).toInt()

        val orderItemDao = database.orderDao()
        orderItemDao.insertOrderItems(
            listOf(
                OrderItemEntity(orderId = sampleOrderId, foodId = 1, foodName = "Smokey Party Jollof Rice with Grilled Chicken", price = 14.50, quantity = 1),
                OrderItemEntity(orderId = sampleOrderId, foodId = 3, foodName = "Rich Egusi Soup with Pounded Yam & Goat Meat", price = 14.50, quantity = 1)
            )
        )

        // 5. Seed competing delivery bids from 3 riders for this order!
        val bidDao = database.deliveryBidDao()
        val bids = listOf(
            DeliveryBidEntity(
                orderId = sampleOrderId,
                riderId = 3,
                riderName = "Tunde Swift",
                riderRating = 4.9,
                completedDeliveries = 142,
                vehicleType = "Motorcycle",
                fee = 4.50,
                etaMinutes = 18,
                distanceKm = 2.4,
                status = "PENDING"
            ),
            DeliveryBidEntity(
                orderId = sampleOrderId,
                riderId = 4,
                riderName = "David K",
                riderRating = 4.8,
                completedDeliveries = 89,
                vehicleType = "E-Bike",
                fee = 3.75,
                etaMinutes = 24,
                distanceKm = 1.8,
                status = "PENDING"
            ),
            DeliveryBidEntity(
                orderId = sampleOrderId,
                riderId = 5,
                riderName = "Blessing Rider",
                riderRating = 5.0,
                completedDeliveries = 215,
                vehicleType = "Scooter (Thermal Bag)",
                fee = 5.00,
                etaMinutes = 14,
                distanceKm = 1.2,
                status = "PENDING"
            )
        )
        bidDao.insertBids(bids)

        // 6. Seed sample reviews
        val reviewDao = database.reviewDao()
        val reviews = listOf(
            ReviewEntity(
                orderId = 99,
                targetType = "SELLER",
                targetId = 1,
                targetName = "Mama K's Authentic Kitchen",
                authorName = "Chidi E.",
                rating = 5,
                comment = "The party jollof tastes just like home! Huge portions and arrived steaming hot."
            ),
            ReviewEntity(
                orderId = 99,
                targetType = "RIDER",
                targetId = 3,
                targetName = "Tunde Swift",
                authorName = "Chidi E.",
                rating = 5,
                comment = "Very fast rider, polite and handled the food pack with great care."
            ),
            ReviewEntity(
                orderId = 98,
                targetType = "SELLER",
                targetId = 2,
                targetName = "The Suya Lounge & Grills",
                authorName = "Sarah M.",
                rating = 5,
                comment = "Spicy, authentic yaji flavor! Unbelievably good grilled beef."
            )
        )
        reviewDao.insertReviews(reviews)
    }
}
