package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.ChopConnectDatabase
import com.example.data.local.DatabaseSeeder
import com.example.data.local.entity.*
import com.example.data.repository.ChopConnectRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class ChopConnectViewModel(application: Application) : AndroidViewModel(application) {

    private val db = ChopConnectDatabase.getDatabase(application)
    private val repository = ChopConnectRepository(db)

    // Current logged-in user
    private val _currentUser = MutableStateFlow(
        UserEntity(
            id = 1,
            name = "Amara Okonkwo",
            email = "amara@chopconnect.com",
            role = "BUYER",
            phone = "+1 (555) 234-5678",
            address = "14 Metro Boulevard, Apt 4B, Downtown",
            isApproved = true,
            avatarInitials = "AO"
        )
    )
    val currentUser: StateFlow<UserEntity> = _currentUser.asStateFlow()

    // Search and Category filtering
    val searchQuery = MutableStateFlow("")
    val selectedCategory = MutableStateFlow("All")

    // Food catalog
    val allFoods: StateFlow<List<FoodItemEntity>> = repository.availableFood
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredFoods: StateFlow<List<FoodItemEntity>> = combine(
        allFoods,
        searchQuery,
        selectedCategory
    ) { foods, query, category ->
        foods.filter { item ->
            val matchesCategory = (category == "All") || item.category.equals(category, ignoreCase = true)
            val matchesQuery = query.isBlank() ||
                    item.name.contains(query, ignoreCase = true) ||
                    item.description.contains(query, ignoreCase = true) ||
                    item.sellerName.contains(query, ignoreCase = true)
            matchesCategory && matchesQuery
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Sellers
    val approvedSellers: StateFlow<List<SellerProfileEntity>> = repository.approvedSellers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allSellers: StateFlow<List<SellerProfileEntity>> = repository.allSellers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Cart
    val cartItems: StateFlow<List<CartItemEntity>> = repository.cartItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cartTotal: StateFlow<Double> = cartItems.map { items ->
        items.sumOf { it.price * it.quantity }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val cartCount: StateFlow<Int> = cartItems.map { items ->
        items.sumOf { it.quantity }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Orders
    val allOrders: StateFlow<List<OrderEntity>> = repository.allOrders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val buyerOrders: StateFlow<List<OrderEntity>> = repository.getOrdersByBuyer(1)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val sellerOrders: StateFlow<List<OrderEntity>> = repository.getOrdersBySeller(1)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val riderOrders: StateFlow<List<OrderEntity>> = repository.getOrdersByRider(3)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val openDeliveryRequests: StateFlow<List<OrderEntity>> = repository.openDeliveryRequests
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Selected order for tracking / bidding details
    val selectedOrderId = MutableStateFlow<Int?>(101)

    val selectedOrder: StateFlow<OrderEntity?> = selectedOrderId.flatMapLatest { id ->
        if (id == null) flowOf(null) else repository.getOrderFlow(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val selectedOrderBids: StateFlow<List<DeliveryBidEntity>> = selectedOrderId.flatMapLatest { id ->
        if (id == null) flowOf(emptyList()) else repository.getBidsForOrder(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val selectedOrderItems: StateFlow<List<OrderItemEntity>> = selectedOrderId.flatMapLatest { id ->
        if (id == null) flowOf(emptyList()) else repository.getOrderItems(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Users list for admin
    val allUsers: StateFlow<List<UserEntity>> = repository.allUsers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Selected Seller profile for detail modal
    val selectedSeller = MutableStateFlow<SellerProfileEntity?>(null)

    // UI feedback toast/banner
    val statusMessage = MutableStateFlow<String?>(null)

    init {
        viewModelScope.launch {
            DatabaseSeeder.seedIfEmpty(db)
        }
    }

    fun clearStatusMessage() {
        statusMessage.value = null
    }

    fun switchRole(role: String) {
        viewModelScope.launch {
            val user = when (role) {
                "BUYER" -> db.userDao().getUserById(1) ?: UserEntity(
                    id = 1, name = "Amara Okonkwo", email = "amara@chopconnect.com",
                    role = "BUYER", phone = "+1 (555) 234-5678", address = "14 Metro Boulevard, Downtown"
                )
                "SELLER" -> db.userDao().getUserById(2) ?: UserEntity(
                    id = 2, name = "Mama K's Kitchen", email = "mamak@chopconnect.com",
                    role = "SELLER", phone = "+1 (555) 876-5432", address = "42 Kingsway Street, Market District"
                )
                "RIDER" -> db.userDao().getUserById(3) ?: UserEntity(
                    id = 3, name = "Tunde Swift", email = "tunde@chopconnect.com",
                    role = "RIDER", phone = "+1 (555) 345-6789", address = "Downtown Transit Hub",
                    vehicleType = "Motorcycle"
                )
                "ADMIN" -> db.userDao().getUserById(6) ?: UserEntity(
                    id = 6, name = "Marketplace Admin", email = "admin@chopconnect.com",
                    role = "ADMIN", phone = "+1 (555) 000-1111", address = "ChopConnect HQ, Floor 10"
                )
                else -> _currentUser.value
            }
            _currentUser.value = user
            statusMessage.value = "Switched to ${user.name} (${user.role})"
        }
    }

    fun authenticateUser(name: String, email: String, role: String, isGoogle: Boolean = false) {
        viewModelScope.launch {
            val existing = db.userDao().getUserByEmail(email)
            val user = if (existing != null) {
                existing
            } else {
                val newUser = UserEntity(
                    name = name.ifBlank { if (isGoogle) "Google User" else "Chop Lover" },
                    email = email,
                    role = role,
                    phone = "+1 (555) 012-3456",
                    address = "18 Marketplace Way",
                    isApproved = true,
                    avatarInitials = name.take(2).uppercase().ifBlank { "CC" }
                )
                val id = db.userDao().insertUser(newUser)
                newUser.copy(id = id.toInt())
            }
            _currentUser.value = user
            statusMessage.value = if (isGoogle) "Signed in with Google as ${user.name}" else "Logged in as ${user.name}"
        }
    }

    // Cart Actions
    fun addToCart(food: FoodItemEntity) {
        viewModelScope.launch {
            repository.addToCart(food)
            statusMessage.value = "Added ${food.name} to cart"
        }
    }

    fun updateCartQuantity(foodId: Int, qty: Int) {
        viewModelScope.launch {
            repository.updateCartQuantity(foodId, qty)
        }
    }

    fun clearCart() {
        viewModelScope.launch {
            repository.clearCart()
        }
    }

    // Buyer Actions
    fun placeOrder(address: String, notes: String) {
        viewModelScope.launch {
            val currentItems = cartItems.value
            if (currentItems.isEmpty()) {
                statusMessage.value = "Cart is empty"
                return@launch
            }
            val orderId = repository.placeOrder(_currentUser.value, currentItems, address, notes)
            selectedOrderId.value = orderId.toInt()
            statusMessage.value = "Order #$orderId placed successfully! Riders can now place bids."
        }
    }

    // Seller Actions
    fun updateOrderStatus(orderId: Int, newStatus: String) {
        viewModelScope.launch {
            repository.updateOrderStatus(orderId, newStatus)
            statusMessage.value = "Order #$orderId status updated to $newStatus"
        }
    }

    fun addNewFood(
        name: String,
        description: String,
        price: Double,
        category: String,
        quantity: Int,
        location: String
    ) {
        viewModelScope.launch {
            val item = FoodItemEntity(
                sellerId = 1,
                sellerName = "Mama K's Authentic Kitchen",
                name = name,
                description = description,
                price = price,
                category = category,
                quantity = quantity,
                isAvailable = true,
                location = location.ifBlank { "Downtown Central" },
                imageResName = "food_jollof_1788517799135",
                rating = 5.0,
                prepTimeMinutes = 20
            )
            repository.insertFood(item)
            statusMessage.value = "Uploaded new food item: $name"
        }
    }

    fun toggleFoodAvailability(foodId: Int, isAvailable: Boolean) {
        viewModelScope.launch {
            repository.updateFoodAvailability(foodId, isAvailable)
            statusMessage.value = if (isAvailable) "Item marked Available" else "Item marked Sold Out"
        }
    }

    // Rider Actions
    fun submitRiderBid(orderId: Int, fee: Double, etaMinutes: Int) {
        viewModelScope.launch {
            val user = _currentUser.value
            val bid = DeliveryBidEntity(
                orderId = orderId,
                riderId = user.id,
                riderName = user.name,
                riderRating = 4.9,
                completedDeliveries = 145,
                vehicleType = user.vehicleType,
                fee = fee,
                etaMinutes = etaMinutes,
                distanceKm = 2.1,
                status = "PENDING"
            )
            repository.submitRiderBid(bid)
            statusMessage.value = "Submitted bid of $${String.format("%.2f", fee)} ($etaMinutes mins) for Order #$orderId"
        }
    }

    fun selectRiderBid(orderId: Int, bid: DeliveryBidEntity) {
        viewModelScope.launch {
            repository.selectRiderForOrder(orderId, bid)
            statusMessage.value = "Selected ${bid.riderName} for delivery! ($${String.format("%.2f", bid.fee)})"
        }
    }

    fun updateDeliveryProgress(orderId: Int, stepStatus: String) {
        viewModelScope.launch {
            repository.updateOrderStatus(orderId, stepStatus)
            val msg = when (stepStatus) {
                "PICKED_UP" -> "Food picked up from seller!"
                "ON_THE_WAY" -> "Rider is on the way to the delivery address!"
                "DELIVERED" -> "Order delivered successfully!"
                else -> "Status: $stepStatus"
            }
            statusMessage.value = msg
        }
    }

    // Review Actions
    fun submitReview(
        orderId: Int,
        targetType: String,
        targetId: Int,
        targetName: String,
        rating: Int,
        comment: String
    ) {
        viewModelScope.launch {
            repository.submitReview(
                orderId = orderId,
                targetType = targetType,
                targetId = targetId,
                targetName = targetName,
                authorName = _currentUser.value.name,
                rating = rating,
                comment = comment
            )
            statusMessage.value = "Thank you! Review submitted for $targetName"
        }
    }

    // Admin Actions
    fun toggleSellerApproval(sellerId: Int, isApproved: Boolean) {
        viewModelScope.launch {
            repository.updateSellerApproval(sellerId, isApproved)
            statusMessage.value = if (isApproved) "Seller approved!" else "Seller approval revoked"
        }
    }

    fun toggleUserApproval(userId: Int, isApproved: Boolean) {
        viewModelScope.launch {
            repository.updateUserApproval(userId, isApproved)
            statusMessage.value = if (isApproved) "User account verified" else "User unverified"
        }
    }
}
