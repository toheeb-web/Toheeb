import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/flutterwave_payment_service.dart';

class FlutterwaveCheckoutScreen extends StatefulWidget {
  final String orderId;
  final double subtotal;
  final double deliveryFee;
  final String vendorSubaccountId;
  final String vendorName;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final VoidCallback onOrderConfirmed;

  const FlutterwaveCheckoutScreen({
    Key? key,
    required this.orderId,
    required this.subtotal,
    this.deliveryFee = 1500.0,
    required this.vendorSubaccountId,
    required this.vendorName,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.onOrderConfirmed,
  }) : super(key: key);

  @override
  State<FlutterwaveCheckoutScreen> createState() => _FlutterwaveCheckoutScreenState();
}

class _FlutterwaveCheckoutScreenState extends State<FlutterwaveCheckoutScreen> {
  bool _isProcessing = false;
  PaymentResult? _paymentResult;

  final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_NG',
    symbol: '₦',
    decimalDigits: 0,
  );

  double get totalAmount => widget.subtotal + widget.deliveryFee;
  double get vendorPayout => (widget.subtotal * 0.95);
  double get platformCommission => (widget.subtotal * 0.05);

  Future<void> _handlePayment() async {
    setState(() {
      _isProcessing = true;
      _paymentResult = null;
    });

    final result = await FlutterwavePaymentService.processPayment(
      context: context,
      totalAmount: totalAmount,
      orderId: widget.orderId,
      customerEmail: widget.customerEmail,
      customerName: widget.customerName,
      customerPhone: widget.customerPhone,
      vendorSubaccountId: widget.vendorSubaccountId,
      vendorName: widget.vendorName,
    );

    setState(() {
      _isProcessing = false;
      _paymentResult = result;
    });

    if (result.status == PaymentStatus.successful) {
      widget.onOrderConfirmed();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutterwave Checkout', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFFE23E1D),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Current State View
            if (_paymentResult == null) ...[
              _buildOrderSummaryCard(),
              const SizedBox(height: 20),
              _buildSplitExplanationCard(),
              const SizedBox(height: 20),
              _buildPaymentOptionsCard(),
              const SizedBox(height: 30),
              _buildPayButton(),
            ] else if (_paymentResult!.status == PaymentStatus.successful) ...[
              _buildSuccessView(_paymentResult!),
            ] else if (_paymentResult!.status == PaymentStatus.failed ||
                       _paymentResult!.status == PaymentStatus.error) ...[
              _buildFailedView(_paymentResult!),
            ] else ...[
              _buildCancelledView(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2D7CF)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Order #${widget.orderId}",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.shade300),
                ),
                child: const Text(
                  "NGN (Naira)",
                  style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
            ],
          ),
          const Divider(height: 24),
          _summaryRow("Vendor / Kitchen", widget.vendorName),
          const SizedBox(height: 8),
          _summaryRow("Food Subtotal", _currencyFormat.format(widget.subtotal)),
          const SizedBox(height: 8),
          _summaryRow("Delivery Fee", _currencyFormat.format(widget.deliveryFee)),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total Amount to Pay:",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Text(
                _currencyFormat.format(totalAmount),
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 22,
                  color: Color(0xFFE23E1D),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSplitExplanationCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF9F5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFD8C2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.pie_chart_outline, color: Color(0xFFE23E1D), size: 18),
              SizedBox(width: 8),
              Text(
                "Automated Flutterwave Split",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE23E1D)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Vendor Settlement (95%):",
                style: TextStyle(fontSize: 12, color: Colors.grey.shade800),
              ),
              Text(
                _currencyFormat.format(vendorPayout),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.green),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "ChopConnect Commission (5%):",
                style: TextStyle(fontSize: 12, color: Colors.grey.shade800),
              ),
              Text(
                _currencyFormat.format(platformCommission),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.orange),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            "Subaccount ID: ${widget.vendorSubaccountId}",
            style: TextStyle(fontSize: 10, color: Colors.grey.shade600, fontFamily: 'monospace'),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOptionsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Supported Payment Methods", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _paymentBadge("Mastercard / Visa"),
              _paymentBadge("NIP Bank Transfer"),
              _paymentBadge("OPay / PalmPay"),
              _paymentBadge("USSD (*737#, *966#)"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _paymentBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
    );
  }

  Widget _buildPayButton() {
    return ElevatedButton(
      onPressed: _isProcessing ? null : _handlePayment,
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFFE23E1D),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 18),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 2,
      ),
      child: _isProcessing
          ? const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                ),
                SizedBox(width: 12),
                Text("Connecting to Flutterwave..."),
              ],
            )
          : Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock, size: 18),
                const SizedBox(width: 8),
                Text(
                  "Pay ${_currencyFormat.format(totalAmount)} via Flutterwave",
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ],
            ),
    );
  }

  Widget _buildSuccessView(PaymentResult result) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Column(
        children: [
          const Icon(Icons.check_circle, color: Colors.green, size: 70),
          const SizedBox(height: 16),
          const Text(
            "Payment Successful!",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Colors.black),
          ),
          const SizedBox(height: 8),
          Text(
            "Verified server-side via Flutterwave API",
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
          ),
          const Divider(height: 32),
          _summaryRow("Amount Paid", _currencyFormat.format(result.totalAmount ?? totalAmount)),
          const SizedBox(height: 8),
          _summaryRow("Transaction Ref", result.txRef),
          const SizedBox(height: 8),
          _summaryRow("5% Platform Split", _currencyFormat.format(result.platformCommission ?? platformCommission)),
          const SizedBox(height: 8),
          _summaryRow("95% Vendor Net", _currencyFormat.format(result.vendorPayout ?? vendorPayout)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Continue to Live Tracking", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildFailedView(PaymentResult result) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 60),
          const SizedBox(height: 16),
          const Text("Payment Failed", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          const SizedBox(height: 8),
          Text(result.message, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade700)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _handlePayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE23E1D),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Retry Payment", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildCancelledView() {
    return Center(
      child: Column(
        children: [
          const Icon(Icons.cancel_outlined, color: Colors.grey, size: 60),
          const SizedBox(height: 12),
          const Text("Payment Cancelled", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 8),
          const Text("You cancelled the transaction before completion."),
          const SizedBox(height: 20),
          OutlinedButton(
            onPressed: () => setState(() => _paymentResult = null),
            child: const Text("Try Again"),
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
      ],
    );
  }
}
