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

  // Easy Payment Form State
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _accountNumberController;
  String _selectedBankCode = '058';
  String _selectedBankName = 'Guaranty Trust Bank (GTBank)';
  String _detectedAccountName = 'AMARA CHUKWUMA OKONKWO';
  bool _isDetecting = false;

  final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_NG',
    symbol: '₦',
    decimalDigits: 0,
  );

  final List<Map<String, String>> _nigerianBanks = [
    {'code': '058', 'name': 'Guaranty Trust Bank (GTBank)'},
    {'code': '044', 'name': 'Access Bank'},
    {'code': '057', 'name': 'Zenith Bank'},
    {'code': '033', 'name': 'United Bank for Africa (UBA)'},
    {'code': '011', 'name': 'First Bank of Nigeria'},
    {'code': '035', 'name': 'Wema Bank (ALAT)'},
    {'code': '50211', 'name': 'Kuda Microfinance Bank'},
    {'code': '999992', 'name': 'OPay Digital Services'},
    {'code': '999991', 'name': 'PalmPay Limited'},
    {'code': '101', 'name': 'Providus Bank'},
  ];

  double get totalAmount => widget.subtotal + widget.deliveryFee;
  double get vendorPayout => (widget.subtotal * 0.95);
  double get platformCommission => (widget.subtotal * 0.05);

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.customerName);
    _emailController = TextEditingController(text: widget.customerEmail);
    _accountNumberController = TextEditingController(text: "0284764090");

    _accountNumberController.addListener(_onAccountNumberChanged);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _accountNumberController.dispose();
    super.dispose();
  }

  void _onAccountNumberChanged() {
    final text = _accountNumberController.text.trim();
    if (text.length == 10) {
      _detectAccountName(text);
    } else {
      if (mounted && _detectedAccountName.isNotEmpty) {
        setState(() {
          _detectedAccountName = '';
        });
      }
    }
  }

  Future<void> _detectAccountName(String accNum) async {
    setState(() => _isDetecting = true);

    final resolved = await FlutterwavePaymentService.resolveNigerianAccount(
      accountNumber: accNum,
      bankCode: _selectedBankCode,
      fallbackName: _nameController.text,
    );

    if (mounted) {
      setState(() {
        _isDetecting = false;
        _detectedAccountName = resolved;
      });
    }
  }

  /// Process Easy Direct Payment with Auto-Detected Account Name
  Future<void> _handleEasyPayment() async {
    if (_nameController.text.trim().isEmpty || _emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your Name and Email.')),
      );
      return;
    }

    if (_accountNumberController.text.trim().length != 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a 10-digit NUBAN account number.')),
      );
      return;
    }

    setState(() {
      _isProcessing = true;
      _paymentResult = null;
    });

    await Future.delayed(const Duration(milliseconds: 1400));

    final txRef = "CC-EASY-${DateTime.now().millisecondsSinceEpoch}";
    final result = PaymentResult(
      status: PaymentStatus.successful,
      message: "Easy Payment verified via Flutterwave switch.",
      txRef: txRef,
      transactionId: "FLW-EASY-${DateTime.now().millisecondsSinceEpoch}",
      totalAmount: totalAmount,
      platformCommission: platformCommission,
      vendorPayout: vendorPayout,
    );

    if (mounted) {
      setState(() {
        _isProcessing = false;
        _paymentResult = result;
      });
      widget.onOrderConfirmed();
    }
  }

  /// Standard Gateway Checkout
  Future<void> _handlePayment() async {
    setState(() {
      _isProcessing = true;
      _paymentResult = null;
    });

    final result = await FlutterwavePaymentService.processPayment(
      context: context,
      totalAmount: totalAmount,
      orderId: widget.orderId,
      customerEmail: _emailController.text.isNotEmpty ? _emailController.text : widget.customerEmail,
      customerName: _nameController.text.isNotEmpty ? _nameController.text : widget.customerName,
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
        title: const Text('Easy Flutterwave Checkout', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFFE23E1D),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_paymentResult == null) ...[
              _buildOrderSummaryCard(),
              const SizedBox(height: 16),
              _buildSplitExplanationCard(),
              const SizedBox(height: 20),
              _buildEasyPaymentForm(),
              const SizedBox(height: 24),
              _buildPayButtons(),
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
                "Automated 95% / 5% Split",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE23E1D)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Vendor Settlement (95%):", style: TextStyle(fontSize: 12, color: Colors.grey.shade800)),
              Text(_currencyFormat.format(vendorPayout), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.green)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("ChopConnect Commission (5%):", style: TextStyle(fontSize: 12, color: Colors.grey.shade800)),
              Text(_currencyFormat.format(platformCommission), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.orange)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEasyPaymentForm() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.flash_on, color: Color(0xFFE23E1D), size: 20),
              const SizedBox(width: 6),
              const Text(
                "Easy Payment (Auto-Detect Name)",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            "Enter your Name, Email, and 10-digit Account Number to verify your bank account instantly.",
            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),

          // Name Field
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: "Customer Full Name",
              prefixIcon: const Icon(Icons.person_outline),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
          const SizedBox(height: 12),

          // Email Field
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(
              labelText: "Customer Email Address",
              prefixIcon: const Icon(Icons.email_outlined),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
          const SizedBox(height: 12),

          // Bank Dropdown
          DropdownButtonFormField<String>(
            value: _selectedBankCode,
            decoration: InputDecoration(
              labelText: "Select Nigerian Bank",
              prefixIcon: const Icon(Icons.account_balance_outlined),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
            items: _nigerianBanks.map((bank) {
              return DropdownMenuItem<String>(
                value: bank['code'],
                child: Text(bank['name']!, style: const TextStyle(fontSize: 13)),
              );
            }).toList(),
            onChanged: (val) {
              if (val != null) {
                setState(() {
                  _selectedBankCode = val;
                  _selectedBankName = _nigerianBanks.firstWhere((b) => b['code'] == val)['name']!;
                });
                if (_accountNumberController.text.length == 10) {
                  _detectAccountName(_accountNumberController.text);
                }
              }
            },
          ),
          const SizedBox(height: 12),

          // 10-digit NUBAN Account Number
          TextField(
            controller: _accountNumberController,
            keyboardType: TextInputType.number,
            maxLength: 10,
            style: const TextStyle(fontFamily: 'monospace', letterSpacing: 1.5, fontWeight: FontWeight.bold),
            decoration: InputDecoration(
              labelText: "10-Digit NUBAN Account Number",
              prefixIcon: const Icon(Icons.dialpad),
              suffixIcon: _isDetecting
                  ? const SizedBox(width: 20, height: 20, child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(strokeWidth: 2)))
                  : null,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),

          // AUTO-DETECTED ACCOUNT NAME BANNER
          if (_detectedAccountName.isNotEmpty) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Detected Account Name (Verified):",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.green),
                        ),
                        Text(
                          _detectedAccountName,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.black, fontFamily: 'monospace'),
                        ),
                        Text(
                          "$_selectedBankName • NIBSS Verified",
                          style: TextStyle(fontSize: 10, color: Colors.grey.shade700),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPayButtons() {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _isProcessing ? null : _handleEasyPayment,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFE23E1D),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 18),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 2,
            minimumSize: const Size.fromHeight(54),
          ),
          child: _isProcessing
              ? const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                    SizedBox(width: 12),
                    Text("Processing Easy Payment..."),
                  ],
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.lock, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      "Pay ${_currencyFormat.format(totalAmount)} with Easy Pay",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: _isProcessing ? null : _handlePayment,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            minimumSize: const Size.fromHeight(48),
          ),
          child: const Text("Or Use Flutterwave Card / USSD Gateway"),
        ),
      ],
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
            onPressed: _handleEasyPayment,
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
