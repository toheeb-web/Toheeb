package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val buyerId: Int,
    val buyerName: String,
    val buyerPhone: String = "+1 555-0192",
    val sellerId: Int,
    val sellerName: String,
    val deliveryAddress: String,
    val status: String,
    // "PLACED", "ACCEPTED", "PREPARING", "READY_FOR_DELIVERY", "RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED", "REJECTED"
    val subtotal: Double,
    val deliveryFee: Double = 0.0,
    val riderId: Int? = null,
    val riderName: String? = null,
    val riderEta: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val notes: String = "",
    val itemsSummary: String = "",
    val isSellerRated: Boolean = false,
    val isRiderRated: Boolean = false
)
