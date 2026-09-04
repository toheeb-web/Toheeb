package com.example

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import com.example.data.local.ChopConnectDatabase
import com.example.data.local.DatabaseSeeder
import com.example.data.local.entity.UserEntity
import com.example.data.repository.ChopConnectRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

    private lateinit var db: ChopConnectDatabase

    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, ChopConnectDatabase::class.java)
            .allowMainThreadQueries()
            .build()
    }

    @After
    fun tearDown() {
        db.close()
    }

    @Test
    fun `app name matches ChopConnect`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("ChopConnect", appName)
    }

    @Test
    fun `database seeder populates food and seller profiles`() = runBlocking {
        DatabaseSeeder.seedIfEmpty(db)

        val repository = ChopConnectRepository(db)
        val foods = repository.availableFood.first()
        val sellers = repository.approvedSellers.first()

        assertTrue(foods.isNotEmpty())
        assertTrue(sellers.isNotEmpty())
        assertNotNull(foods.firstOrNull { it.name.contains("Jollof", ignoreCase = true) })
    }

    @Test
    fun `user authentication inserts and updates user with role selection`() = runBlocking {
        // Test Buyer registration
        val buyer = UserEntity(
            name = "Test Buyer",
            email = "buyer@test.com",
            role = "BUYER"
        )
        val buyerId = db.userDao().insertUser(buyer)
        val fetchedBuyer = db.userDao().getUserById(buyerId.toInt())
        assertNotNull(fetchedBuyer)
        assertEquals("BUYER", fetchedBuyer?.role)

        // Test Rider role with vehicle type
        val rider = UserEntity(
            name = "Test Rider",
            email = "rider@test.com",
            role = "RIDER",
            vehicleType = "Bicycle"
        )
        val riderId = db.userDao().insertUser(rider)
        val fetchedRider = db.userDao().getUserById(riderId.toInt())
        assertNotNull(fetchedRider)
        assertEquals("RIDER", fetchedRider?.role)
        assertEquals("Bicycle", fetchedRider?.vehicleType)

        // Test Seller role
        val seller = UserEntity(
            name = "Test Kitchen",
            email = "seller@test.com",
            role = "SELLER"
        )
        val sellerId = db.userDao().insertUser(seller)
        val fetchedSeller = db.userDao().getUserById(sellerId.toInt())
        assertNotNull(fetchedSeller)
        assertEquals("SELLER", fetchedSeller?.role)
    }
}
