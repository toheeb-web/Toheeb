package com.example.data.local.dao

import androidx.room.*
import com.example.data.local.entity.DeliveryBidEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DeliveryBidDao {
    @Query("SELECT * FROM delivery_bids WHERE orderId = :orderId ORDER BY fee ASC")
    fun getBidsForOrder(orderId: Int): Flow<List<DeliveryBidEntity>>

    @Query("SELECT * FROM delivery_bids WHERE riderId = :riderId ORDER BY submittedAt DESC")
    fun getBidsByRider(riderId: Int): Flow<List<DeliveryBidEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBid(bid: DeliveryBidEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBids(bids: List<DeliveryBidEntity>)

    @Query("UPDATE delivery_bids SET status = 'ACCEPTED' WHERE id = :bidId")
    suspend fun acceptBid(bidId: Int)

    @Query("UPDATE delivery_bids SET status = 'DECLINED' WHERE orderId = :orderId AND id != :acceptedBidId")
    suspend fun declineOtherBids(orderId: Int, acceptedBidId: Int)
}
