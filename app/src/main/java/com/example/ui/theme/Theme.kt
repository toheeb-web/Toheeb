package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ChopOrangePrimaryDark,
    onPrimary = Color(0xFF3E1500),
    primaryContainer = ChopOrangeDark,
    onPrimaryContainer = Color(0xFFFFDBCF),
    secondary = ChopAmberSecondaryDark,
    onSecondary = Color(0xFF332000),
    secondaryContainer = Color(0xFF4D3000),
    onSecondaryContainer = Color(0xFFFFE0B2),
    tertiary = ChopGreenTertiaryDark,
    onTertiary = Color(0xFF003912),
    background = ChopBackgroundDark,
    onBackground = ChopTextPrimaryDark,
    surface = ChopSurfaceDark,
    onSurface = ChopTextPrimaryDark,
    surfaceVariant = ChopSurfaceVariantDark,
    onSurfaceVariant = ChopTextSecondaryDark,
    outline = Color(0xFF53433F)
)

private val LightColorScheme = lightColorScheme(
    primary = ChopOrangePrimary,
    onPrimary = Color.White,
    primaryContainer = ChopPrimaryContainer,
    onPrimaryContainer = ChopOnPrimaryContainer,
    secondary = ChopAmberSecondary,
    onSecondary = Color.White,
    secondaryContainer = ChopAmberContainer,
    onSecondaryContainer = ChopOnSecondaryContainer,
    tertiary = ChopGreenTertiary,
    onTertiary = Color.White,
    tertiaryContainer = ChopGreenContainer,
    onTertiaryContainer = Color(0xFF002206),
    background = ChopBackgroundLight,
    onBackground = ChopTextPrimaryLight,
    surface = ChopSurfaceLight,
    onSurface = ChopTextPrimaryLight,
    surfaceVariant = ChopSurfaceVariantLight,
    onSurfaceVariant = ChopTextSecondaryLight,
    outline = ChopOutlineLight
)

@Composable
fun ChopConnectTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
