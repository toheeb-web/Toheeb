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
import androidx.compose.ui.window.Dialog
import com.example.data.local.entity.OrderEntity
import com.example.data.local.entity.UserEntity
import com.example.ui.components.OrderStatusStepper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RiderDashboardScreen(
    riderUser: UserEntity,
    openRequests: List<OrderEntity>,
    myAssignedOrders: List<OrderEntity>,
    onSubmitBid: (orderId: Int, fee: Double, etaMinutes: Int) -> Unit,
    onUpdateDeliveryStatus: (orderId: Int, status: String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedOrderForBid by remember { mutableStateOf<OrderEntity?>(null) }
    var selectedTab by remember { mutableIntStateOf(0) }

    if (selectedOrderForBid != null) {
        SubmitBidDialog(
            order = selectedOrderForBid!!,
            onDismiss = { selectedOrderForBid = null },
            onSubmit = { fee, eta ->
                onSubmitBid(selectedOrderForBid!!.id, fee, eta)
                selectedOrderForBid = null
            }
        )
    }

    Scaffold(modifier = modifier) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Rider Profile & Earnings Header
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primaryContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DirectionsBike,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(26.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = riderUser.name,
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Black
                                )
                                Text(
                                    text = "${riderUser.vehicleType} • 4.9 ⭐️ (142 deliveries)",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.tertiaryContainer
                        ) {
                            Text(
                                text = "Online & Ready",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Available Gigs", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text(
                                "${openRequests.size}",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Column {
                            Text("Active Delivery", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            val activeCount = myAssignedOrders.count { it.status in listOf("RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY") }
                            Text(
                                "$activeCount",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                        Column {
                            Text("Today's Earnings", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            val earnings = myAssignedOrders.filter { it.status == "DELIVERED" }.sumOf { it.deliveryFee }
                            Text(
                                "$${String.format("%.2f", if (earnings > 0) earnings else 42.50)}",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.tertiary
                            )
                        }
                    }
                }
            }

            TabRow(selectedTabIndex = selectedTab) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Available Jobs (${openRequests.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("My Active Delivery (${myAssignedOrders.count { it.status != "DELIVERED" }})", fontWeight = FontWeight.Bold) }
                )
            }

            if (selectedTab == 0) {
                // Available Delivery Requests for Bidding
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (openRequests.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.HourglassEmpty, contentDescription = null, tint = MaterialTheme.colorScheme.outline)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text("No delivery requests right now.")
                                    Text("New jobs appear once sellers prepare orders.", fontSize = 12.sp, color = MaterialTheme.colorScheme.outline)
                                }
                            }
                        }
                    } else {
                        items(openRequests) { order ->
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column {
                                            Text(
                                                text = "Pickup: ${order.sellerName}",
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = "Dropoff: ${order.deliveryAddress}",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = MaterialTheme.colorScheme.primaryContainer
                                        ) {
                                            Text(
                                                text = "Order #${order.id}",
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                                style = MaterialTheme.typography.labelSmall,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "Items: ${order.itemsSummary}",
                                        style = MaterialTheme.typography.bodyMedium
                                    )

                                    Spacer(modifier = Modifier.height(12.dp))
                                    Button(
                                        onClick = { selectedOrderForBid = order },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .testTag("submit_bid_btn_${order.id}")
                                    ) {
                                        Icon(Icons.Default.MonetizationOn, contentDescription = null)
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Submit Delivery Bid (Fee & ETA)")
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                // My Assigned Delivery
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    val activeJobs = myAssignedOrders.filter { it.status != "DELIVERED" }
                    if (activeJobs.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("No active delivery jobs right now.")
                            }
                        }
                    } else {
                        items(activeJobs) { order ->
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Column {
                                            Text(
                                                text = "Order #${order.id}",
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Black
                                            )
                                            Text(
                                                text = "Delivery Fee: $${String.format("%.2f", order.deliveryFee)}",
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = MaterialTheme.colorScheme.primary,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = MaterialTheme.colorScheme.tertiaryContainer
                                        ) {
                                            Text(
                                                text = order.status.replace("_", " "),
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                                style = MaterialTheme.typography.labelSmall,
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.onTertiaryContainer
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(10.dp))
                                    OrderStatusStepper(currentStatus = order.status)
                                    Spacer(modifier = Modifier.height(14.dp))

                                    Text(text = "Seller: ${order.sellerName}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                                    Text(text = "Customer: ${order.buyerName} (${order.buyerPhone})", style = MaterialTheme.typography.bodySmall)
                                    Text(text = "Delivery to: ${order.deliveryAddress}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)

                                    Spacer(modifier = Modifier.height(14.dp))

                                    // Status update buttons for the Rider
                                    when (order.status) {
                                        "RIDER_ASSIGNED" -> {
                                            Button(
                                                onClick = { onUpdateDeliveryStatus(order.id, "PICKED_UP") },
                                                modifier = Modifier.fillMaxWidth()
                                            ) {
                                                Icon(Icons.Default.Fastfood, contentDescription = null)
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text("Confirm Food Picked Up from Seller")
                                            }
                                        }
                                        "PICKED_UP" -> {
                                            Button(
                                                onClick = { onUpdateDeliveryStatus(order.id, "ON_THE_WAY") },
                                                modifier = Modifier.fillMaxWidth()
                                            ) {
                                                Icon(Icons.Default.DirectionsBike, contentDescription = null)
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text("Start Trip (On The Way to Buyer)")
                                            }
                                        }
                                        "ON_THE_WAY" -> {
                                            Button(
                                                onClick = { onUpdateDeliveryStatus(order.id, "DELIVERED") },
                                                modifier = Modifier.fillMaxWidth(),
                                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary)
                                            ) {
                                                Icon(Icons.Default.CheckCircle, contentDescription = null)
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text("Complete Delivery & Collect Earnings")
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
    }
}

@Composable
fun SubmitBidDialog(
    order: OrderEntity,
    onDismiss: () -> Unit,
    onSubmit: (fee: Double, etaMinutes: Int) -> Unit
) {
    var feeStr by remember { mutableStateOf("4.50") }
    var etaStr by remember { mutableStateOf("18") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .testTag("submit_bid_dialog")
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Submit Delivery Bid",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Order #${order.id} from ${order.sellerName}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = feeStr,
                    onValueChange = { feeStr = it },
                    label = { Text("Your Delivery Fee ($)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = etaStr,
                    onValueChange = { etaStr = it },
                    label = { Text("Estimated Delivery Time (minutes)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(18.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            val fee = feeStr.toDoubleOrNull() ?: 4.50
                            val eta = etaStr.toIntOrNull() ?: 18
                            onSubmit(fee, eta)
                        },
                        modifier = Modifier
                            .weight(1f)
                            .testTag("confirm_bid_submission_btn")
                    ) {
                        Text("Send Bid")
                    }
                }
            }
        }
    }
}
