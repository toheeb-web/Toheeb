package com.example.data.local.dao

import androidx.room.*
import com.example.data.local.entity.OrderEntity
import com.example.data.local.entity.OrderItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OrderDao {
    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    fun getAllOrders(): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE buyerId = :buyerId ORDER BY createdAt DESC")
    fun getOrdersByBuyer(buyerId: Int): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE sellerId = :sellerId ORDER BY createdAt DESC")
    fun getOrdersBySeller(sellerId: Int): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE riderId = :riderId ORDER BY createdAt DESC")
    fun getOrdersByRider(riderId: Int): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE status IN ('ACCEPTED', 'PREPARING', 'READY_FOR_DELIVERY') AND riderId IS NULL ORDER BY createdAt DESC")
    fun getOpenDeliveryRequests(): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE id = :orderId LIMIT 1")
    fun getOrderFlow(orderId: Int): Flow<OrderEntity?>

    @Query("SELECT * FROM orders WHERE id = :orderId LIMIT 1")
    suspend fun getOrderById(orderId: Int): OrderEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: OrderEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrderItems(items: List<OrderItemEntity>)

    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    fun getItemsForOrder(orderId: Int): Flow<List<OrderItemEntity>>

    @Update
    suspend fun updateOrder(order: OrderEntity)

    @Query("UPDATE orders SET status = :status WHERE id = :orderId")
    suspend fun updateOrderStatus(orderId: Int, status: String)

    @Query("UPDATE orders SET riderId = :riderId, riderName = :riderName, deliveryFee = :deliveryFee, riderEta = :riderEta, status = 'RIDER_ASSIGNED' WHERE id = :orderId")
    suspend fun assignRider(orderId: Int, riderId: Int, riderName: String, deliveryFee: Double, riderEta: String)

    @Query("UPDATE orders SET isSellerRated = 1 WHERE id = :orderId")
    suspend fun markSellerRated(orderId: Int)

    @Query("UPDATE orders SET isRiderRated = 1 WHERE id = :orderId")
    suspend fun markRiderRated(orderId: Int)
}
