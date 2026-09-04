package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val email: String,
    val role: String, // "BUYER", "SELLER", "RIDER", "ADMIN"
    val phone: String = "+1 (555) 234-5678",
    val address: String = "14 Metro Boulevard, Downtown",
    val isApproved: Boolean = true,
    val vehicleType: String = "Motorcycle",
    val avatarInitials: String = "CC"
)
