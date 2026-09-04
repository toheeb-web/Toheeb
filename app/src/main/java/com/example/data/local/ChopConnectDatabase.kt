package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.local.dao.*
import com.example.data.local.entity.*

@Database(
    entities = [
        UserEntity::class,
        SellerProfileEntity::class,
        FoodItemEntity::class,
        OrderEntity::class,
        OrderItemEntity::class,
        DeliveryBidEntity::class,
        ReviewEntity::class,
        CartItemEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class ChopConnectDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun sellerDao(): SellerDao
    abstract fun foodDao(): FoodDao
    abstract fun orderDao(): OrderDao
    abstract fun deliveryBidDao(): DeliveryBidDao
    abstract fun reviewDao(): ReviewDao
    abstract fun cartDao(): CartDao

    companion object {
        @Volatile
        private var INSTANCE: ChopConnectDatabase? = null

        fun getDatabase(context: Context): ChopConnectDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ChopConnectDatabase::class.java,
                    "chopconnect_db"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
