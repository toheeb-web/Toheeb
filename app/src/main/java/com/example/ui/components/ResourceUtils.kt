package com.example.ui.components

import com.example.R

object ResourceUtils {
    fun getDrawableForName(name: String): Int {
        return when {
            name.contains("jollof", ignoreCase = true) -> R.drawable.food_jollof_1788517799135
            name.contains("suya", ignoreCase = true) -> R.drawable.food_suya_1788517820467
            name.contains("hero", ignoreCase = true) -> R.drawable.chopconnect_hero_1788517559174
            name.contains("icon", ignoreCase = true) -> R.drawable.chopconnect_icon_1788517538782
            else -> R.drawable.chopconnect_hero_1788517559174
        }
    }
}
