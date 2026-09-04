package com.example.data.repository

import com.example.data.local.ChopConnectDatabase
import com.example.data.local.entity.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull

class ChopConnectRepository(private val db: ChopConnectDatabase) {

    // Food
    val availableFood: Flow<List<FoodItemEntity>> = db.foodDao().getAllAvailableFood()
    fun getFoodBySeller(sellerId: Int): Flow<List<FoodItemEntity>> = db.foodDao().getFoodBySeller(sellerId)
    fun searchFood(query: String): Flow<List<FoodItemEntity>> = db.foodDao().searchFood(query)
    fun getFoodByCategory(category: String): Flow<List<FoodItemEntity>> = db.foodDao().getFoodByCategory(category)
    suspend fun insertFood(item: FoodItemEntity) = db.foodDao().insertFood(item)
    suspend fun updateFoodAvailability(foodId: Int, isAvailable: Boolean) = db.foodDao().updateAvailability(foodId, isAvailable)

    // Sellers
    val approvedSellers: Flow<List<SellerProfileEntity>> = db.sellerDao().getApprovedSellers()
    val allSellers: Flow<List<SellerProfileEntity>> = db.sellerDao().getAllSellers()
    suspend fun getSellerById(id: Int): SellerProfileEntity? = db.sellerDao().getSellerById(id)
    suspend fun updateSellerApproval(sellerId: Int, isApproved: Boolean) = db.sellerDao().updateApproval(sellerId, isApproved)
    suspend fun insertSeller(seller: SellerProfileEntity) = db.sellerDao().insertSeller(seller)

    // Users
    val allUsers: Flow<List<UserEntity>> = db.userDao().getAllUsers()
    suspend fun getUserByEmail(email: String) = db.userDao().getUserByEmail(email)
    suspend fun getUserById(id: Int) = db.userDao().getUserById(id)
    suspend fun insertUser(user: UserEntity) = db.userDao().insertUser(user)
    suspend fun updateUserApproval(userId: Int, isApproved: Boolean) = db.userDao().updateApproval(userId, isApproved)

    // Cart
    val cartItems: Flow<List<CartItemEntity>> = db.cartDao().getCartItems()

    suspend fun addToCart(food: FoodItemEntity) {
        val currentItems = db.cartDao().getCartItems().firstOrNull() ?: emptyList()
        val existing = currentItems.find { it.foodId == food.id }
        if (existing != null) {
            db.cartDao().updateQuantity(food.id, existing.quantity + 1)
        } else {
            db.cartDao().insertCartItem(
                CartItemEntity(
                    foodId = food.id,
                    sellerId = food.sellerId,
                    sellerName = food.sellerName,
                    foodName = food.name,
                    price = food.price,
                    imageResName = food.imageResName,
                    quantity = 1
                )
            )
        }
    }

    suspend fun updateCartQuantity(foodId: Int, quantity: Int) {
        if (quantity <= 0) {
            db.cartDao().deleteItem(foodId)
        } else {
            db.cartDao().updateQuantity(foodId, quantity)
        }
    }

    suspend fun clearCart() = db.cartDao().clearCart()

    // Orders
    val allOrders: Flow<List<OrderEntity>> = db.orderDao().getAllOrders()
    fun getOrdersByBuyer(buyerId: Int): Flow<List<OrderEntity>> = db.orderDao().getOrdersByBuyer(buyerId)
    fun getOrdersBySeller(sellerId: Int): Flow<List<OrderEntity>> = db.orderDao().getOrdersBySeller(sellerId)
    fun getOrdersByRider(riderId: Int): Flow<List<OrderEntity>> = db.orderDao().getOrdersByRider(riderId)
    val openDeliveryRequests: Flow<List<OrderEntity>> = db.orderDao().getOpenDeliveryRequests()
    fun getOrderFlow(orderId: Int): Flow<OrderEntity?> = db.orderDao().getOrderFlow(orderId)
    fun getOrderItems(orderId: Int): Flow<List<OrderItemEntity>> = db.orderDao().getItemsForOrder(orderId)

    suspend fun placeOrder(
        buyer: UserEntity,
        cartItems: List<CartItemEntity>,
        deliveryAddress: String,
        notes: String
    ): Long {
        if (cartItems.isEmpty()) return -1L
        val sellerId = cartItems.first().sellerId
        val sellerName = cartItems.first().sellerName
        val subtotal = cartItems.sumOf { it.price * it.quantity }
        val summary = cartItems.joinToString(", ") { "${it.quantity}x ${it.foodName}" }

        val order = OrderEntity(
            buyerId = buyer.id,
            buyerName = buyer.name,
            buyerPhone = buyer.phone,
            sellerId = sellerId,
            sellerName = sellerName,
            deliveryAddress = deliveryAddress,
            status = "PLACED",
            subtotal = subtotal,
            deliveryFee = 0.0,
            notes = notes,
            itemsSummary = summary
        )
        val orderId = db.orderDao().insertOrder(order)
        val items = cartItems.map {
            OrderItemEntity(
                orderId = orderId.toInt(),
                foodId = it.foodId,
                foodName = it.foodName,
                price = it.price,
                quantity = it.quantity
            )
        }
        db.orderDao().insertOrderItems(items)
        db.cartDao().clearCart()

        // Generate initial prospective rider bids automatically so buyer/seller can see competing bids right away!
        val prospectiveRiders = listOf(
            Triple(3, "Tunde Swift", 4.9),
            Triple(4, "David K", 4.8),
            Triple(5, "Blessing Rider", 5.0)
        )
        val initialBids = prospectiveRiders.mapIndexed { index, (riderId, name, rating) ->
            val fee = when (index) {
                0 -> 4.50
                1 -> 3.75
                else -> 5.25
            }
            val eta = 15 + index * 5
            val dist = 1.5 + index * 0.7
            val vehicle = when (index) {
                0 -> "Motorcycle"
                1 -> "E-Bike"
                else -> "Scooter"
            }
            DeliveryBidEntity(
                orderId = orderId.toInt(),
                riderId = riderId,
                riderName = name,
                riderRating = rating,
                completedDeliveries = 100 + index * 45,
                vehicleType = vehicle,
                fee = fee,
                etaMinutes = eta,
                distanceKm = dist,
                status = "PENDING"
            )
        }
        db.deliveryBidDao().insertBids(initialBids)

        return orderId
    }

    suspend fun updateOrderStatus(orderId: Int, status: String) {
        db.orderDao().updateOrderStatus(orderId, status)
    }

    // Bids
    fun getBidsForOrder(orderId: Int): Flow<List<DeliveryBidEntity>> = db.deliveryBidDao().getBidsForOrder(orderId)
    fun getBidsByRider(riderId: Int): Flow<List<DeliveryBidEntity>> = db.deliveryBidDao().getBidsByRider(riderId)

    suspend fun submitRiderBid(bid: DeliveryBidEntity) {
        db.deliveryBidDao().insertBid(bid)
    }

    suspend fun selectRiderForOrder(orderId: Int, bid: DeliveryBidEntity) {
        db.deliveryBidDao().acceptBid(bid.id)
        db.deliveryBidDao().declineOtherBids(orderId, bid.id)
        db.orderDao().assignRider(
            orderId = orderId,
            riderId = bid.riderId,
            riderName = bid.riderName,
            deliveryFee = bid.fee,
            riderEta = "${bid.etaMinutes} mins"
        )
    }

    // Reviews
    fun getReviews(targetType: String, targetId: Int): Flow<List<ReviewEntity>> =
        db.reviewDao().getReviewsForTarget(targetType, targetId)

    suspend fun submitReview(
        orderId: Int,
        targetType: String,
        targetId: Int,
        targetName: String,
        authorName: String,
        rating: Int,
        comment: String
    ) {
        db.reviewDao().insertReview(
            ReviewEntity(
                orderId = orderId,
                targetType = targetType,
                targetId = targetId,
                targetName = targetName,
                authorName = authorName,
                rating = rating,
                comment = comment
            )
        )
        if (targetType == "SELLER") {
            db.orderDao().markSellerRated(orderId)
        } else if (targetType == "RIDER") {
            db.orderDao().markRiderRated(orderId)
        }
    }
}
