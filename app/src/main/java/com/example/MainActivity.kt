package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.data.local.entity.FoodItemEntity
import com.example.data.local.entity.SellerProfileEntity
import com.example.ui.components.ChopTopBar
import com.example.ui.screens.*
import com.example.ui.theme.ChopConnectTheme
import com.example.ui.viewmodel.ChopConnectViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ChopConnectTheme {
                ChopConnectApp()
            }
        }
    }
}

@Composable
fun ChopConnectApp(viewModel: ChopConnectViewModel = viewModel()) {
    val currentUser by viewModel.currentUser.collectAsState()
    val filteredFoods by viewModel.filteredFoods.collectAsState()
    val allFoods by viewModel.allFoods.collectAsState()
    val approvedSellers by viewModel.approvedSellers.collectAsState()
    val allSellers by viewModel.allSellers.collectAsState()
    val cartItems by viewModel.cartItems.collectAsState()
    val cartTotal by viewModel.cartTotal.collectAsState()
    val cartCount by viewModel.cartCount.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val buyerOrders by viewModel.buyerOrders.collectAsState()
    val sellerOrders by viewModel.sellerOrders.collectAsState()
    val riderOrders by viewModel.riderOrders.collectAsState()
    val openDeliveryRequests by viewModel.openDeliveryRequests.collectAsState()
    val selectedOrder by viewModel.selectedOrder.collectAsState()
    val selectedOrderBids by viewModel.selectedOrderBids.collectAsState()
    val selectedOrderItems by viewModel.selectedOrderItems.collectAsState()
    val allUsers by viewModel.allUsers.collectAsState()
    val allOrders by viewModel.allOrders.collectAsState()
    val statusMessage by viewModel.statusMessage.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(statusMessage) {
        statusMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearStatusMessage()
        }
    }

    // Buyer Navigation: 0 = Marketplace, 1 = Tracking, 2 = Cart
    var buyerTab by remember { mutableIntStateOf(0) }

    // Dialog States
    var showAuthDialog by remember { mutableStateOf(false) }
    var selectedFoodForDetail by remember { mutableStateOf<FoodItemEntity?>(null) }
    var selectedSellerForDetail by remember { mutableStateOf<SellerProfileEntity?>(null) }

    if (showAuthDialog) {
        AuthDialog(
            currentUser = currentUser,
            onDismiss = { showAuthDialog = false },
            onAuthenticate = { name, email, role, isGoogle ->
                viewModel.authenticateUser(name, email, role, isGoogle)
            },
            onQuickSwitch = { role ->
                viewModel.switchRole(role)
            }
        )
    }

    if (selectedFoodForDetail != null) {
        FoodDetailDialog(
            food = selectedFoodForDetail!!,
            onDismiss = { selectedFoodForDetail = null },
            onAddToCart = { food, qty ->
                for (i in 1..qty) {
                    viewModel.addToCart(food)
                }
            }
        )
    }

    if (selectedSellerForDetail != null) {
        val sellerDishes = allFoods.filter { it.sellerId == selectedSellerForDetail!!.id }
        SellerDetailDialog(
            seller = selectedSellerForDetail!!,
            sellerFoods = sellerDishes,
            onAddToCart = { viewModel.addToCart(it) },
            onFoodClick = { selectedFoodForDetail = it },
            onDismiss = { selectedSellerForDetail = null }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            ChopTopBar(
                currentUser = currentUser,
                cartCount = cartCount,
                onRoleSelect = { role -> viewModel.switchRole(role) },
                onOpenCart = { buyerTab = 2 },
                onOpenAuth = { showAuthDialog = true }
            )
        },
        bottomBar = {
            if (currentUser.role == "BUYER") {
                Column {
                    HorizontalDivider(
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
                        thickness = 0.5.dp
                    )
                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surface,
                        tonalElevation = 0.dp
                    ) {
                        val navItemColors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.primary,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        NavigationBarItem(
                            selected = buyerTab == 0,
                            onClick = { buyerTab = 0 },
                            icon = { Icon(Icons.Default.RestaurantMenu, contentDescription = "Marketplace") },
                            label = { Text("Marketplace", fontWeight = if (buyerTab == 0) FontWeight.Bold else FontWeight.Normal) },
                            colors = navItemColors,
                            modifier = Modifier.testTag("nav_marketplace")
                        )
                        NavigationBarItem(
                            selected = buyerTab == 1,
                            onClick = { buyerTab = 1 },
                            icon = {
                                val activeOrdersCount = buyerOrders.count { it.status != "DELIVERED" && it.status != "REJECTED" }
                                BadgedBox(
                                    badge = {
                                        if (activeOrdersCount > 0) {
                                            Badge(containerColor = MaterialTheme.colorScheme.primary) {
                                                Text("$activeOrdersCount")
                                            }
                                        }
                                    }
                                ) {
                                    Icon(Icons.Default.LocalShipping, contentDescription = "Tracking")
                                }
                            },
                            label = { Text("Orders & Bids", fontWeight = if (buyerTab == 1) FontWeight.Bold else FontWeight.Normal) },
                            colors = navItemColors,
                            modifier = Modifier.testTag("nav_tracking")
                        )
                        NavigationBarItem(
                            selected = buyerTab == 2,
                            onClick = { buyerTab = 2 },
                            icon = {
                                BadgedBox(
                                    badge = {
                                        if (cartCount > 0) {
                                            Badge(containerColor = MaterialTheme.colorScheme.primary) {
                                                Text("$cartCount")
                                            }
                                        }
                                    }
                                ) {
                                    Icon(Icons.Default.ShoppingCart, contentDescription = "Cart")
                                }
                            },
                            label = { Text("My Cart", fontWeight = if (buyerTab == 2) FontWeight.Bold else FontWeight.Normal) },
                            colors = navItemColors,
                            modifier = Modifier.testTag("nav_cart")
                        )
                    }
                }
            }
        },
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentUser.role) {
                "BUYER" -> {
                    when (buyerTab) {
                        0 -> MarketplaceScreen(
                            foods = filteredFoods,
                            sellers = approvedSellers,
                            activeOrders = buyerOrders,
                            searchQuery = searchQuery,
                            selectedCategory = selectedCategory,
                            onSearchChange = { viewModel.searchQuery.value = it },
                            onCategoryChange = { viewModel.selectedCategory.value = it },
                            onAddToCart = { viewModel.addToCart(it) },
                            onFoodClick = { selectedFoodForDetail = it },
                            onSellerClick = { selectedSellerForDetail = it },
                            onViewTracking = { buyerTab = 1 }
                        )
                        1 -> OrderTrackingScreen(
                            orders = buyerOrders,
                            selectedOrder = selectedOrder,
                            bids = selectedOrderBids,
                            orderItems = selectedOrderItems,
                            currentUser = currentUser,
                            onSelectOrder = { viewModel.selectedOrderId.value = it },
                            onSelectRiderBid = { orderId, bid -> viewModel.selectRiderBid(orderId, bid) },
                            onUpdateOrderStatus = { orderId, status -> viewModel.updateOrderStatus(orderId, status) },
                            onSubmitReview = { orderId, targetType, targetId, targetName, rating, comment ->
                                viewModel.submitReview(orderId, targetType, targetId, targetName, rating, comment)
                            },
                            onBack = { buyerTab = 0 }
                        )
                        2 -> CartScreen(
                            cartItems = cartItems,
                            currentUser = currentUser,
                            cartTotal = cartTotal,
                            onUpdateQuantity = { foodId, qty -> viewModel.updateCartQuantity(foodId, qty) },
                            onClearCart = { viewModel.clearCart() },
                            onPlaceOrder = { address, notes ->
                                viewModel.placeOrder(address, notes)
                                buyerTab = 1
                            },
                            onClose = { buyerTab = 0 }
                        )
                    }
                }
                "SELLER" -> {
                    val currentSeller = allSellers.firstOrNull { it.userId == currentUser.id }
                    val mySellerFoods = allFoods.filter { it.sellerId == (currentSeller?.id ?: 1) }
                    SellerDashboardScreen(
                        sellerProfile = currentSeller,
                        sellerOrders = sellerOrders,
                        sellerFoods = mySellerFoods,
                        onUpdateOrderStatus = { orderId, status -> viewModel.updateOrderStatus(orderId, status) },
                        onAddNewFood = { name, desc, price, cat, qty, loc ->
                            viewModel.addNewFood(name, desc, price, cat, qty, loc)
                        },
                        onToggleFoodAvailability = { foodId, avail ->
                            viewModel.toggleFoodAvailability(foodId, avail)
                        },
                        onViewOrderBids = { orderId ->
                            viewModel.selectedOrderId.value = orderId
                            viewModel.switchRole("BUYER")
                            buyerTab = 1
                        }
                    )
                }
                "RIDER" -> {
                    RiderDashboardScreen(
                        riderUser = currentUser,
                        openRequests = openDeliveryRequests,
                        myAssignedOrders = riderOrders,
                        onSubmitBid = { orderId, fee, eta ->
                            viewModel.submitRiderBid(orderId, fee, eta)
                        },
                        onUpdateDeliveryStatus = { orderId, status ->
                            viewModel.updateDeliveryProgress(orderId, status)
                        }
                    )
                }
                "ADMIN" -> {
                    AdminDashboardScreen(
                        sellers = allSellers,
                        users = allUsers,
                        orders = allOrders,
                        onToggleSellerApproval = { sellerId, isApproved ->
                            viewModel.toggleSellerApproval(sellerId, isApproved)
                        }
                    )
                }
            }
        }
    }
}
