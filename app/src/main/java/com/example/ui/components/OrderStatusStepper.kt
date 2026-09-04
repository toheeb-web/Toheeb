package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun OrderStatusStepper(
    currentStatus: String,
    modifier: Modifier = Modifier
) {
    if (currentStatus == "REJECTED") {
        Row(
            modifier = modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.4f), shape = MaterialTheme.shapes.medium)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.error),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Rejected",
                    tint = Color.White,
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "Order Declined by Seller",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.error
                )
                Text(
                    text = "The seller was unable to fulfill this order. Any payment hold is released.",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
        return
    }

    val steps = listOf(
        "Placed" to listOf("PLACED", "ACCEPTED", "PREPARING", "READY_FOR_DELIVERY", "RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"),
        "Preparing" to listOf("ACCEPTED", "PREPARING", "READY_FOR_DELIVERY", "RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"),
        "Rider Bid" to listOf("READY_FOR_DELIVERY", "RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"),
        "On Route" to listOf("PICKED_UP", "ON_THE_WAY", "DELIVERED"),
        "Delivered" to listOf("DELIVERED")
    )

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            steps.forEachIndexed { index, (label, validStatuses) ->
                val isCompleted = validStatuses.contains(currentStatus)
                val isCurrent = when (label) {
                    "Placed" -> currentStatus == "PLACED"
                    "Preparing" -> currentStatus in listOf("ACCEPTED", "PREPARING")
                    "Rider Bid" -> currentStatus in listOf("READY_FOR_DELIVERY", "RIDER_ASSIGNED")
                    "On Route" -> currentStatus in listOf("PICKED_UP", "ON_THE_WAY")
                    "Delivered" -> currentStatus == "DELIVERED"
                    else -> false
                }

                val circleColor = when {
                    isCurrent -> MaterialTheme.colorScheme.primary
                    isCompleted -> MaterialTheme.colorScheme.tertiary
                    else -> MaterialTheme.colorScheme.surfaceVariant
                }

                val textColor = when {
                    isCurrent -> MaterialTheme.colorScheme.primary
                    isCompleted -> MaterialTheme.colorScheme.onSurface
                    else -> MaterialTheme.colorScheme.outline
                }

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(circleColor),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isCompleted && !isCurrent) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = "Completed",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        } else {
                            Text(
                                text = "${index + 1}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isCurrent) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.outline
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                        color = textColor,
                        maxLines = 1
                    )
                }
            }
        }
    }
}
