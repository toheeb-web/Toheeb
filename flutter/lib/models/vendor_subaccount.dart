class VendorSubaccount {
  final String vendorId;
  final String subaccountId; // e.g. RS_0B48B9284F3B
  final String bankCode;
  final String accountNumber;
  final String accountName;
  final String businessName;
  final double splitRatio; // 0.95 (95% to vendor)

  VendorSubaccount({
    required this.vendorId,
    required this.subaccountId,
    required this.bankCode,
    required this.accountNumber,
    required this.accountName,
    required this.businessName,
    this.splitRatio = 0.95,
  });

  factory VendorSubaccount.fromJson(Map<String, dynamic> json) {
    return VendorSubaccount(
      vendorId: json['vendorId']?.toString() ?? '',
      subaccountId: json['subaccountId']?.toString() ?? json['id']?.toString() ?? '',
      bankCode: json['bankCode']?.toString() ?? json['account_bank']?.toString() ?? '',
      accountNumber: json['accountNumber']?.toString() ?? json['account_number']?.toString() ?? '',
      accountName: json['accountName']?.toString() ?? '',
      businessName: json['businessName']?.toString() ?? json['business_name']?.toString() ?? '',
      splitRatio: (json['splitRatio'] as num?)?.toDouble() ?? 0.95,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'vendorId': vendorId,
      'subaccountId': subaccountId,
      'bankCode': bankCode,
      'accountNumber': accountNumber,
      'accountName': accountName,
      'businessName': businessName,
      'splitRatio': splitRatio,
    };
  }
}

class FlutterwaveTransaction {
  final String id;
  final String txRef;
  final double totalAmount;
  final double platformCommission; // 5%
  final double vendorPayout;       // 95%
  final String status;             // SUCCESSFUL, PENDING, FAILED
  final String paymentType;
  final DateTime createdAt;

  FlutterwaveTransaction({
    required this.id,
    required this.txRef,
    required this.totalAmount,
    required this.platformCommission,
    required this.vendorPayout,
    required this.status,
    required this.paymentType,
    required this.createdAt,
  });

  factory FlutterwaveTransaction.fromJson(Map<String, dynamic> json) {
    return FlutterwaveTransaction(
      id: json['id']?.toString() ?? '',
      txRef: json['txRef']?.toString() ?? '',
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      platformCommission: (json['platformCommission_5pct'] as num?)?.toDouble() ?? 0.0,
      vendorPayout: (json['vendorPayout_95pct'] as num?)?.toDouble() ?? 0.0,
      status: json['status']?.toString() ?? 'SUCCESSFUL',
      paymentType: json['paymentType']?.toString() ?? 'card',
      createdAt: json['verifiedAt'] != null 
          ? DateTime.tryParse(json['verifiedAt']) ?? DateTime.now() 
          : DateTime.now(),
    );
  }
}
