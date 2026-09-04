package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cart_items")
data class CartItemEntity(
    @PrimaryKey val foodId: Int,
    val sellerId: Int,
    val sellerName: String,
    val foodName: String,
    val price: Double,
    val imageResName: String,
    val quantity: Int
)
