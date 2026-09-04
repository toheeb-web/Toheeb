package com.example.data.local.dao

import androidx.room.*
import com.example.data.local.entity.FoodItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FoodDao {
    @Query("SELECT * FROM food_items WHERE isAvailable = 1 ORDER BY id DESC")
    fun getAllAvailableFood(): Flow<List<FoodItemEntity>>

    @Query("SELECT * FROM food_items WHERE sellerId = :sellerId ORDER BY id DESC")
    fun getFoodBySeller(sellerId: Int): Flow<List<FoodItemEntity>>

    @Query("SELECT * FROM food_items WHERE category = :category AND isAvailable = 1")
    fun getFoodByCategory(category: String): Flow<List<FoodItemEntity>>

    @Query("SELECT * FROM food_items WHERE (name LIKE '%' || :query || '%' OR description LIKE '%' || :query || '%' OR category LIKE '%' || :query || '%') AND isAvailable = 1")
    fun searchFood(query: String): Flow<List<FoodItemEntity>>

    @Query("SELECT * FROM food_items WHERE id = :id LIMIT 1")
    suspend fun getFoodById(id: Int): FoodItemEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFood(item: FoodItemEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<FoodItemEntity>)

    @Update
    suspend fun updateFood(item: FoodItemEntity)

    @Delete
    suspend fun deleteFood(item: FoodItemEntity)

    @Query("UPDATE food_items SET isAvailable = :isAvailable WHERE id = :id")
    suspend fun updateAvailability(id: Int, isAvailable: Boolean)
}
