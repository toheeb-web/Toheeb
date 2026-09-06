# ChopConnect × Flutterwave Payment & Subaccount Split Integration

This document provides complete instructions for the **production-ready Flutterwave payment system** with automatic **95% vendor / 5% platform split**, server-side verification, duplicate transaction protection, and subaccount management.

---

## 1. Credentials & Configuration

- **Public Key (Client-Safe):** `FLWPUBK-a45deac92b9dcbf732f3d387453d72aa-X`
- **Secret Key (Backend ONLY):** Store in `/server/.env` as `FLW_SECRET_KEY`
- **Webhook Secret Hash:** Store in `/server/.env` as `FLW_WEBHOOK_SECRET_HASH`

---

## 2. Split Payment Flow Architecture

```
[Customer / Buyer App]
        │
        ▼ 1. Checkout (Food Total: ₦10,000)
[Flutterwave Standard Checkout Modal / SDK]
        │
        ├── 95% (₦9,500) ──► Routed to Vendor Subaccount (e.g. RS_0B48B9284F3B)
        └──  5% (₦500)   ──► Retained in Main ChopConnect Account
        │
        ▼ 2. Transaction Complete
[Backend Server: POST /api/flutterwave/verify]
        │ (Queries Flutterwave API using Secret Key)
        ▼ 3. Server Verification OK & Idempotency Check
[Order Marked as PAID & Balance Updated]
```

---

## 3. Backend Server Implementation (`/server`)

The backend is built in Node.js/Express and strictly protects your Secret Key:

### Key Endpoints:
1. **`POST /api/flutterwave/subaccounts`**
   - Creates a vendor subaccount with `split_value: 0.95` (95% to vendor).
2. **`POST /api/flutterwave/initialize-split-payment`**
   - Generates unique `tx_ref` and checkout payload.
3. **`POST /api/flutterwave/verify`**
   - Server-side verification using `https://api.flutterwave.com/v3/transactions/:id/verify`.
   - Checks matching amount, currency (`NGN`), and prevents duplicate transactions.
4. **`POST /api/flutterwave/webhook`**
   - Listens to Flutterwave webhook events.
   - Verifies the cryptographic signature `verif-hash`.
   - Employs idempotency table to ensure an order is never credited twice.

### How to Run the Backend:
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your FLW_SECRET_KEY and FLW_WEBHOOK_SECRET_HASH
npm start
# Server starts on port 5000 (http://localhost:5000)
```

---

## 4. Flutter Mobile Implementation (`/flutter`)

The Flutter codebase is structured as follows:

| File Path | Description |
|---|---|
| `pubspec.yaml` | Flutterwave Standard SDK (`flutterwave_standard: ^1.0.8`), HTTP & utilities |
| `lib/models/vendor_subaccount.dart` | Data models for Vendor Subaccounts & Split Transactions |
| `lib/services/flutterwave_payment_service.dart` | Initiates Flutterwave checkout with 95% split and calls server verification |
| `lib/services/vendor_subaccount_service.dart` | Subaccount creation via backend and local persistent caching |
| `lib/screens/flutterwave_checkout_screen.dart` | Checkout screen with payment methods, live 95%/5% split summary, and states |
| `lib/screens/vendor_wallet_screen.dart` | Vendor dashboard showing 95% net balance, 5% fee deductions, and transactions |

### Flutter Usage Example:
```dart
// 1. Process payment with automatic 95% / 5% split
final result = await FlutterwavePaymentService.processPayment(
  context: context,
  totalAmount: 12500, // Naira
  orderId: "105",
  customerEmail: "amara@chopconnect.ng",
  customerName: "Chief Amara",
  customerPhone: "+2348024764090",
  vendorSubaccountId: "RS_0B48B9284F3B",
  vendorName: "Mama K's Authentic Kitchen",
);

if (result.status == PaymentStatus.successful) {
  print("Paid! 95% Net: ₦${result.vendorPayout}, 5% Platform: ₦${result.platformCommission}");
}
```

---

## 5. Web Applet Integration (Live Interactive Preview)

The web application in `/web` has also been upgraded:
- **`src/services/flutterwaveService.js`**: Frontend service integrating the official Flutterwave v3 checkout script with your public key and subaccount splits.
- **`src/components/PaymentModal.jsx`**: Features Flutterwave as the primary payment method with instant split preview, live server verification, and idempotency protection.
- **`src/components/FlutterwaveSubaccountModal.jsx`**: Allows vendors to configure their Nigerian bank account (GTB, Zenith, Access, Kuda, OPay, etc.) and generate a subaccount ID.
- **`src/pages/seller/SellerDashboard.jsx`**: Displays active Flutterwave Subaccount details and auto-settlement indicator.
- **`src/pages/buyer/OrderTracking.jsx`**: Shows the verified Flutterwave transaction ref, 95% vendor payout, 5% platform fee, and payment status (`PAID`).

---

## 6. Testing the Full Flow in the App

1. **Buyer Flow**:
   - Go to **Food Menu** (`/buyer`) and add items to your cart.
   - Proceed to **Cart** (`/buyer/cart`).
   - Click **"Pay with Flutterwave (95% Split)"**.
   - Review the split breakdown (95% to Vendor Subaccount, 5% to ChopConnect).
   - Click **"Pay ₦... with Flutterwave"** to launch checkout.
   - The app verifies the transaction and redirects to **Live Tracking** (`/buyer/orders`).
2. **Vendor Flow**:
   - Switch role to **Seller** (`/seller`).
   - Notice the **Flutterwave Subaccount Active** card with subaccount ID (`RS_0B48B9284F3B`).
   - Click **"Configure Settlement Account"** to test updating bank details.
   - Review gross sales, 5% platform commission deducted, and net 95% earnings.
