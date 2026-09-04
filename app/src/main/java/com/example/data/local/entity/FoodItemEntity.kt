package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "food_items")
data class FoodItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val sellerId: Int,
    val sellerName: String,
    val name: String,
    val description: String,
    val price: Double,
    val category: String, // "Rice & Mains", "Grills & Suya", "Soups & Stews", "Fast Food", "Drinks"
    val quantity: Int = 20,
    val isAvailable: Boolean = true,
    val location: String = "Downtown Central",
    val imageResName: String = "",
    val rating: Double = 4.9,
    val prepTimeMinutes: Int = 25
)
