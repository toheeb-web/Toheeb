import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/vendor_subaccount.dart';
import '../services/vendor_subaccount_service.dart';

class VendorWalletScreen extends StatefulWidget {
  final String vendorId;
  final String vendorName;

  const VendorWalletScreen({
    Key? key,
    required this.vendorId,
    required this.vendorName,
  }) : super(key: key);

  @override
  State<VendorWalletScreen> createState() => _VendorWalletScreenState();
}

class _VendorWalletScreenState extends State<VendorWalletScreen> {
  VendorSubaccount? _subaccount;
  bool _loading = true;
  double _walletBalance = 142500.0; // 95% net earnings
  double _totalDeductedCommission = 7500.0; // 5% platform fee retained
  List<FlutterwaveTransaction> _transactions = [];

  final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_NG',
    symbol: '₦',
    decimalDigits: 0,
  );

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final stored = await VendorSubaccountService.getStoredSubaccount();
    setState(() {
      _subaccount = stored;
      _loading = false;
      _transactions = [
        FlutterwaveTransaction(
          id: "FLW-1049281",
          txRef: "CC-FLW-104-1718002",
          totalAmount: 12500,
          platformCommission: 625,  // 5%
          vendorPayout: 11875,      // 95%
          status: "SUCCESSFUL",
          paymentType: "Card (Mastercard)",
          createdAt: DateTime.now().subtract(const Duration(minutes: 42)),
        ),
        FlutterwaveTransaction(
          id: "FLW-1049190",
          txRef: "CC-FLW-103-1717882",
          totalAmount: 8500,
          platformCommission: 425,  // 5%
          vendorPayout: 8075,       // 95%
          status: "SUCCESSFUL",
          paymentType: "NIP Bank Transfer",
          createdAt: DateTime.now().subtract(const Duration(hours: 3)),
        ),
        FlutterwaveTransaction(
          id: "FLW-1048821",
          txRef: "CC-FLW-102-1716500",
          totalAmount: 22000,
          platformCommission: 1100, // 5%
          vendorPayout: 20900,      // 95%
          status: "SUCCESSFUL",
          paymentType: "OPay Wallet",
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
      ];
    });
  }

  void _showAddSubaccountModal() {
    final accountController = TextEditingController(text: _subaccount?.accountNumber ?? '');
    String selectedBank = '058'; // GTBank default

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Link Nigerian Bank for 95% Payouts",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 8),
              const Text(
                "ChopConnect automatically registers your bank with Flutterwave. 95% of all meal sales will be automatically settled into this account.",
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedBank,
                decoration: const InputDecoration(
                  labelText: "Select Nigerian Bank",
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: '058', child: Text("Guaranty Trust Bank (GTBank)")),
                  DropdownMenuItem(value: '044', child: Text("Access Bank")),
                  DropdownMenuItem(value: '057', child: Text("Zenith Bank")),
                  DropdownMenuItem(value: '033', child: Text("United Bank for Africa (UBA)")),
                  DropdownMenuItem(value: '50211', child: Text("Kuda Microfinance Bank")),
                  DropdownMenuItem(value: '999992', child: Text("OPay")),
                ],
                onChanged: (val) {
                  if (val != null) selectedBank = val;
                },
              ),
              const SizedBox(height: 12),
              TextField(
                controller: accountController,
                keyboardType: TextInputType.number,
                maxLength: 10,
                decoration: const InputDecoration(
                  labelText: "10-Digit NUBAN Account Number",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.account_balance),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  if (accountController.text.length < 10) return;
                  Navigator.pop(ctx);
                  setState(() => _loading = true);

                  final newSub = await VendorSubaccountService.createVendorSubaccount(
                    vendorId: widget.vendorId,
                    accountBank: selectedBank,
                    accountNumber: accountController.text,
                    businessName: widget.vendorName,
                    businessEmail: "vendor@chopconnect.ng",
                  );

                  setState(() {
                    _subaccount = newSub;
                    _loading = false;
                  });

                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("Flutterwave Subaccount connected: ${newSub?.subaccountId}"),
                        backgroundColor: Colors.green,
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE23E1D),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text("Generate Flutterwave Subaccount", style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vendor Earnings & Subaccount', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1C1B1F),
        foregroundColor: Colors.white,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFE23E1D)))
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildBalanceCard(),
                    const SizedBox(height: 16),
                    _buildSubaccountCard(),
                    const SizedBox(height: 24),
                    const Text(
                      "Recent Flutterwave Split Transactions",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    ..._transactions.map(_buildTransactionTile).toList(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildBalanceCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1C1B1F), Color(0xFF322F35)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Vendor Net Available Balance (95%)",
                style: TextStyle(color: Colors.grey.shade400, fontSize: 13),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  "AUTO-SETTLE",
                  style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _currencyFormat.format(_walletBalance),
            style: const TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const Divider(color: Colors.white24, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Platform Commission Kept (5%):",
                style: TextStyle(color: Colors.grey.shade400, fontSize: 12),
              ),
              Text(
                _currencyFormat.format(_totalDeductedCommission),
                style: const TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubaccountCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2D7CF)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.verified, color: Colors.blue, size: 18),
                  SizedBox(width: 8),
                  Text("Flutterwave Subaccount", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                ],
              ),
              TextButton(
                onPressed: _showAddSubaccountModal,
                child: const Text("Edit Bank"),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            "Subaccount ID: ${_subaccount?.subaccountId ?? 'Not configured'}",
            style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, fontSize: 13),
          ),
          const SizedBox(height: 4),
          Text(
            "Bank: ${_subaccount?.accountNumber ?? ''} (${_subaccount?.accountName ?? widget.vendorName})",
            style: TextStyle(color: Colors.grey.shade700, fontSize: 12),
          ),
          const SizedBox(height: 4),
          const Text(
            "Split Scheme: 95% directly routed to your bank, 5% ChopConnect fee",
            style: TextStyle(color: Colors.green, fontSize: 11, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionTile(FlutterwaveTransaction txn) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_downward, color: Colors.green, size: 18),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(txn.txRef, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  Text(txn.paymentType, style: TextStyle(color: Colors.grey.shade600, fontSize: 11)),
                  Text(
                    "5% Fee: ${_currencyFormat.format(txn.platformCommission)}",
                    style: TextStyle(color: Colors.orange.shade800, fontSize: 10),
                  ),
                ],
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                "+${_currencyFormat.format(txn.vendorPayout)}",
                style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green, fontSize: 14),
              ),
              Container(
                margin: const EdgeInsets.top(4),
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  txn.status,
                  style: TextStyle(color: Colors.green.shade700, fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
