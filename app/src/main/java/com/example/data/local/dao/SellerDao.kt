package com.example.data.local.dao

import androidx.room.*
import com.example.data.local.entity.SellerProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SellerDao {
    @Query("SELECT * FROM sellers ORDER BY rating DESC")
    fun getAllSellers(): Flow<List<SellerProfileEntity>>

    @Query("SELECT * FROM sellers WHERE isApproved = 1 ORDER BY rating DESC")
    fun getApprovedSellers(): Flow<List<SellerProfileEntity>>

    @Query("SELECT * FROM sellers WHERE id = :id LIMIT 1")
    suspend fun getSellerById(id: Int): SellerProfileEntity?

    @Query("SELECT * FROM sellers WHERE userId = :userId LIMIT 1")
    fun getSellerByUserId(userId: Int): Flow<SellerProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSeller(seller: SellerProfileEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSellers(sellers: List<SellerProfileEntity>)

    @Update
    suspend fun updateSeller(seller: SellerProfileEntity)

    @Query("UPDATE sellers SET isApproved = :approved WHERE id = :id")
    suspend fun updateApproval(id: Int, approved: Boolean)

    @Query("UPDATE sellers SET isOpen = :isOpen WHERE id = :id")
    suspend fun updateOpenStatus(id: Int, isOpen: Boolean)
}
