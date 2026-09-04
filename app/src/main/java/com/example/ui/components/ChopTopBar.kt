package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.local.entity.UserEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChopTopBar(
    currentUser: UserEntity,
    cartCount: Int,
    onRoleSelect: (String) -> Unit,
    onOpenCart: () -> Unit,
    onOpenAuth: () -> Unit,
    modifier: Modifier = Modifier
) {
    var roleMenuExpanded by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 0.dp,
        shadowElevation = 1.dp
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Left: App brand
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onOpenAuth() }
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.chopconnect_icon_1788517538782),
                            contentDescription = "ChopConnect Logo",
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "ChopConnect",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "Food & Rider Marketplace",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Right: Role Switcher Pill + Cart + Auth
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Role Switcher Dropdown
                    Box {
                        Surface(
                            onClick = { roleMenuExpanded = true },
                            shape = RoundedCornerShape(50),
                            color = when (currentUser.role) {
                                "BUYER" -> MaterialTheme.colorScheme.primaryContainer
                                "SELLER" -> MaterialTheme.colorScheme.tertiaryContainer
                                "RIDER" -> MaterialTheme.colorScheme.secondaryContainer
                                else -> MaterialTheme.colorScheme.surfaceVariant
                            },
                            modifier = Modifier.testTag("role_switcher_pill")
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = currentUser.role,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = when (currentUser.role) {
                                        "BUYER" -> MaterialTheme.colorScheme.primary
                                        "SELLER" -> MaterialTheme.colorScheme.tertiary
                                        "RIDER" -> MaterialTheme.colorScheme.secondary
                                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                                Icon(
                                    imageVector = Icons.Default.ArrowDropDown,
                                    contentDescription = "Switch Role",
                                    tint = when (currentUser.role) {
                                        "BUYER" -> MaterialTheme.colorScheme.primary
                                        "SELLER" -> MaterialTheme.colorScheme.tertiary
                                        "RIDER" -> MaterialTheme.colorScheme.secondary
                                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                                    },
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                    DropdownMenu(
                        expanded = roleMenuExpanded,
                        onDismissRequest = { roleMenuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Buyer Mode (Browse & Order)") },
                            onClick = {
                                onRoleSelect("BUYER")
                                roleMenuExpanded = false
                            },
                            modifier = Modifier.testTag("switch_to_buyer")
                        )
                        DropdownMenuItem(
                            text = { Text("Seller Mode (Orders & Menu)") },
                            onClick = {
                                onRoleSelect("SELLER")
                                roleMenuExpanded = false
                            },
                            modifier = Modifier.testTag("switch_to_seller")
                        )
                        DropdownMenuItem(
                            text = { Text("Rider Mode (Bids & Deliveries)") },
                            onClick = {
                                onRoleSelect("RIDER")
                                roleMenuExpanded = false
                            },
                            modifier = Modifier.testTag("switch_to_rider")
                        )
                        DropdownMenuItem(
                            text = { Text("Admin Mode (Platform & Approvals)") },
                            onClick = {
                                onRoleSelect("ADMIN")
                                roleMenuExpanded = false
                            },
                            modifier = Modifier.testTag("switch_to_admin")
                        )
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Cart Button (for Buyer mode)
                if (currentUser.role == "BUYER") {
                    IconButton(
                        onClick = onOpenCart,
                        modifier = Modifier.testTag("open_cart_btn")
                    ) {
                        BadgedBox(
                            badge = {
                                if (cartCount > 0) {
                                    Badge(
                                        containerColor = MaterialTheme.colorScheme.primary,
                                        contentColor = Color.White
                                    ) {
                                        Text("$cartCount", fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.ShoppingBag,
                                contentDescription = "Cart",
                                tint = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }

                // Auth / User avatar
                IconButton(
                    onClick = onOpenAuth,
                    modifier = Modifier.testTag("auth_profile_btn")
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = currentUser.avatarInitials,
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
        HorizontalDivider(
            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
            thickness = 0.5.dp
        )
    }
}
}
