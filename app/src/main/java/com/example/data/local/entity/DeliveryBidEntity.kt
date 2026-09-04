package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "delivery_bids")
data class DeliveryBidEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val orderId: Int,
    val riderId: Int,
    val riderName: String,
    val riderRating: Double,
    val completedDeliveries: Int,
    val vehicleType: String,
    val fee: Double,
    val etaMinutes: Int,
    val distanceKm: Double,
    val status: String = "PENDING", // "PENDING", "ACCEPTED", "DECLINED"
    val submittedAt: Long = System.currentTimeMillis()
)
