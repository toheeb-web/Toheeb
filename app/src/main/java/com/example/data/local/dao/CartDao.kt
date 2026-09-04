package com.example.data.local.dao

import androidx.room.*
import com.example.data.local.entity.CartItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CartDao {
    @Query("SELECT * FROM cart_items")
    fun getCartItems(): Flow<List<CartItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCartItem(item: CartItemEntity)

    @Query("UPDATE cart_items SET quantity = :quantity WHERE foodId = :foodId")
    suspend fun updateQuantity(foodId: Int, quantity: Int)

    @Query("DELETE FROM cart_items WHERE foodId = :foodId")
    suspend fun deleteItem(foodId: Int)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()
}
