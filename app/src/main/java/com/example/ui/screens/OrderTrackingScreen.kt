package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.DeliveryBidEntity
import com.example.data.local.entity.OrderEntity
import com.example.data.local.entity.OrderItemEntity
import com.example.data.local.entity.UserEntity
import com.example.ui.components.BidCard
import com.example.ui.components.OrderStatusStepper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderTrackingScreen(
    orders: List<OrderEntity>,
    selectedOrder: OrderEntity?,
    bids: List<DeliveryBidEntity>,
    orderItems: List<OrderItemEntity>,
    currentUser: UserEntity,
    onSelectOrder: (Int) -> Unit,
    onSelectRiderBid: (orderId: Int, bid: DeliveryBidEntity) -> Unit,
    onUpdateOrderStatus: (orderId: Int, status: String) -> Unit,
    onSubmitReview: (orderId: Int, targetType: String, targetId: Int, targetName: String, rating: Int, comment: String) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showReviewSellerDialog by remember { mutableStateOf(false) }
    var showReviewRiderDialog by remember { mutableStateOf(false) }

    val activeOrder = selectedOrder ?: orders.firstOrNull()

    if (showReviewSellerDialog && activeOrder != null) {
        ReviewDialog(
            orderId = activeOrder.id,
            targetType = "SELLER",
            targetName = activeOrder.sellerName,
            onDismiss = { showReviewSellerDialog = false },
            onSubmit = { rating, comment ->
                onSubmitReview(activeOrder.id, "SELLER", activeOrder.sellerId, activeOrder.sellerName, rating, comment)
            }
        )
    }

    if (showReviewRiderDialog && activeOrder != null && activeOrder.riderId != null) {
        ReviewDialog(
            orderId = activeOrder.id,
            targetType = "RIDER",
            targetName = activeOrder.riderName ?: "Rider",
            onDismiss = { showReviewRiderDialog = false },
            onSubmit = { rating, comment ->
                onSubmitReview(activeOrder.id, "RIDER", activeOrder.riderId ?: 0, activeOrder.riderName ?: "Rider", rating, comment)
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Order Tracking & Bids", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        modifier = modifier
    ) { innerPadding ->
        if (orders.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.ReceiptLong,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No Orders Yet",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Browse the marketplace and place an order to see live tracking!",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(onClick = onBack) {
                        Text("Browse Foods")
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Order Selector Tabs if multiple orders exist
                if (orders.size > 1) {
                    item {
                        Text(
                            text = "Select Order",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            orders.take(4).forEach { order ->
                                val isSelected = activeOrder?.id == order.id
                                FilterChip(
                                    selected = isSelected,
                                    onClick = { onSelectOrder(order.id) },
                                    label = { Text("Order #${order.id} (${order.status.take(8)})", fontSize = 12.sp) }
                                )
                            }
                        }
                    }
                }

                if (activeOrder != null) {
                    // Active Order Card
                    item {
                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(
                                            text = "Order #${activeOrder.id}",
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.Black
                                        )
                                        Text(
                                            text = "Seller: ${activeOrder.sellerName}",
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = when (activeOrder.status) {
                                            "DELIVERED" -> MaterialTheme.colorScheme.tertiaryContainer
                                            "REJECTED" -> MaterialTheme.colorScheme.errorContainer
                                            else -> MaterialTheme.colorScheme.primaryContainer
                                        }
                                    ) {
                                        Text(
                                            text = activeOrder.status.replace("_", " "),
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = when (activeOrder.status) {
                                                "DELIVERED" -> MaterialTheme.colorScheme.onTertiaryContainer
                                                "REJECTED" -> MaterialTheme.colorScheme.onErrorContainer
                                                else -> MaterialTheme.colorScheme.onPrimaryContainer
                                            }
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(14.dp))
                                OrderStatusStepper(currentStatus = activeOrder.status)
                                Spacer(modifier = Modifier.height(14.dp))

                                HorizontalDivider()
                                Spacer(modifier = Modifier.height(10.dp))

                                // Items summary
                                Text(
                                    text = "Items Ordered",
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = activeOrder.itemsSummary,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Food Subtotal: $${String.format("%.2f", activeOrder.subtotal)}", style = MaterialTheme.typography.bodySmall)
                                    if (activeOrder.deliveryFee > 0) {
                                        Text("Delivery Fee: $${String.format("%.2f", activeOrder.deliveryFee)}", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = MaterialTheme.colorScheme.outline, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = activeOrder.deliveryAddress,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    // Assigned Rider Card
                    if (activeOrder.riderId != null) {
                        item {
                            Card(
                                shape = RoundedCornerShape(18.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f)),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(46.dp)
                                            .clip(CircleShape)
                                            .background(MaterialTheme.colorScheme.primary),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(Icons.Default.DirectionsBike, contentDescription = null, tint = Color.White)
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "Assigned Delivery Rider",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            text = activeOrder.riderName ?: "Assigned Rider",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "ETA: ${activeOrder.riderEta ?: "On route"} • Fee: $${String.format("%.2f", activeOrder.deliveryFee)}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.primary,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }

                                    FilledTonalIconButton(onClick = { /* Call rider */ }) {
                                        Icon(Icons.Default.Phone, contentDescription = "Call Rider")
                                    }
                                }
                            }
                        }
                    }

                    // Competing Rider Bids Section (CRITICAL USER FEATURE!)
                    item {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Rider Bids (${bids.size})",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Compare rider fee, ETA & rating. You choose your rider.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }

                    if (bids.isEmpty()) {
                        item {
                            Surface(
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "Broadcasting delivery job to nearby riders...",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    } else {
                        items(bids) { bid ->
                            val isChosen = activeOrder.riderId == bid.riderId
                            val canSelect = activeOrder.status in listOf("PLACED", "ACCEPTED", "PREPARING", "READY_FOR_DELIVERY") && activeOrder.riderId == null
                            BidCard(
                                bid = bid,
                                isSelected = isChosen,
                                canSelect = canSelect,
                                onSelect = {
                                    onSelectRiderBid(activeOrder.id, bid)
                                }
                            )
                        }
                    }

                    // Rating Section if Delivered
                    if (activeOrder.status == "DELIVERED") {
                        item {
                            Card(
                                shape = RoundedCornerShape(18.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.4f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "Order Delivered! How was everything?",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Button(
                                            onClick = { showReviewSellerDialog = true },
                                            modifier = Modifier.weight(1f),
                                            enabled = !activeOrder.isSellerRated
                                        ) {
                                            Text(if (activeOrder.isSellerRated) "Seller Rated" else "Rate Seller")
                                        }
                                        Button(
                                            onClick = { showReviewRiderDialog = true },
                                            modifier = Modifier.weight(1f),
                                            enabled = !activeOrder.isRiderRated && activeOrder.riderId != null
                                        ) {
                                            Text(if (activeOrder.isRiderRated) "Rider Rated" else "Rate Rider")
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Interactive Order Flow Simulator / Test Controls
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "Order Flow Controller (Test & Advance)",
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Advance order through the delivery cycle:",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = { onUpdateOrderStatus(activeOrder.id, "PREPARING") },
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                                    ) {
                                        Text("Preparing", fontSize = 11.sp)
                                    }
                                    OutlinedButton(
                                        onClick = { onUpdateOrderStatus(activeOrder.id, "READY_FOR_DELIVERY") },
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                                    ) {
                                        Text("Ready", fontSize = 11.sp)
                                    }
                                    OutlinedButton(
                                        onClick = { onUpdateOrderStatus(activeOrder.id, "PICKED_UP") },
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                                    ) {
                                        Text("Picked Up", fontSize = 11.sp)
                                    }
                                    Button(
                                        onClick = { onUpdateOrderStatus(activeOrder.id, "DELIVERED") },
                                        modifier = Modifier.weight(1f),
                                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                                    ) {
                                        Text("Delivered", fontSize = 11.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
