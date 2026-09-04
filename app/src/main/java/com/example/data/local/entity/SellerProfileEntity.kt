package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sellers")
data class SellerProfileEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val businessName: String,
    val description: String,
    val cuisineType: String,
    val rating: Double = 4.8,
    val reviewCount: Int = 34,
    val address: String,
    val phone: String,
    val isOpen: Boolean = true,
    val isApproved: Boolean = true,
    val imageResName: String = "chopconnect_hero_1788517559174"
)
