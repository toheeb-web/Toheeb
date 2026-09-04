package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.local.ChopConnectDatabase
import com.example.data.local.DatabaseSeeder
import com.example.data.repository.ChopConnectRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

    @Test
    fun `app name matches ChopConnect`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("ChopConnect", appName)
    }

    @Test
    fun `database seeder populates food and seller profiles`() = runBlocking {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val db = ChopConnectDatabase.getDatabase(context)
        DatabaseSeeder.seedIfEmpty(db)

        val repository = ChopConnectRepository(db)
        val foods = repository.availableFood.first()
        val sellers = repository.approvedSellers.first()

        assertTrue(foods.isNotEmpty())
        assertTrue(sellers.isNotEmpty())
        assertNotNull(foods.firstOrNull { it.name.contains("Jollof", ignoreCase = true) })
    }
}
