import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../navigation/main_navigation_screen.dart';

class ActivationScreen extends StatefulWidget {
  const ActivationScreen({super.key});

  @override
  State<ActivationScreen> createState() => _ActivationScreenState();
}

class _ActivationScreenState extends State<ActivationScreen> {
  bool _isActivated = false;
  bool _processing = false;
  late Razorpay _razorpay;
  String? _currentOrderId;

  @override
  void initState() {
    super.initState();
    _checkStatus();
    _initRazorpay();
  }

  void _initRazorpay() {
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  Future<void> _checkStatus() async {
    try {
      final profile = await ApiService.getStudentProfile();
      final st = profile['student'] ?? profile;
      final isAct = profile['activation']?['isActivated'] == true ||
          profile['isActivated'] == true ||
          st['isActivated'] == true ||
          profile['verificationStatus'] == 'VERIFIED' ||
          st['verificationStatus'] == 'VERIFIED' ||
          st['moderationStatus'] == 'APPROVED';
      if (isAct) {
        await StorageService.setActivated(true);
      }
      if (mounted) {
        setState(() => _isActivated = isAct);
        if (isAct) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
            (route) => false,
          );
        }
      }
    } catch (_) {
      final act = await StorageService.isActivated();
      if (mounted) {
        setState(() => _isActivated = act);
        if (act) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
            (route) => false,
          );
        }
      }
    }
  }

  Future<void> _handlePaymentSuccess(PaymentSuccessResponse response) async {
    final orderId = response.orderId ?? _currentOrderId ?? '';
    final paymentId = response.paymentId ?? '';
    final signature = response.signature ?? '';

    try {
      final result = await ApiService.verifyPayment(
        orderId: orderId,
        paymentId: paymentId,
        signature: signature,
      );

      if (result['success'] == true) {
        await StorageService.setActivated(true);
        final user = await StorageService.getUser() ?? {};
        user['isActivated'] = true;
        user['verificationStatus'] = 'VERIFIED';
        await StorageService.saveUser(user);

        if (mounted) {
          setState(() {
            _isActivated = true;
            _processing = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: Color(0xFF10B981),
              content: Text('✓ ₹99 Discovery Pass Activated! Verified by Razorpay & Admin.'),
            ),
          );

          await Future.delayed(const Duration(milliseconds: 600));
          if (mounted) {
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
              (route) => false,
            );
          }
        }
      } else {
        throw Exception(result['error'] ?? 'Payment verification failed');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _processing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.red,
            content: Text('Payment verification error: $e'),
          ),
        );
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    if (mounted) {
      setState(() => _processing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.red,
          content: Text('Payment cancelled / failed: ${response.message ?? 'Unknown error'}'),
        ),
      );
    }
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    // External wallet callback
  }

  Future<void> _handlePayment() async {
    setState(() => _processing = true);
    try {
      final order = await ApiService.createPaymentOrder();
      final orderId = order['orderId'] as String;
      _currentOrderId = orderId;
      final keyId = (order['keyId'] as String?) ?? 'rzp_test_TchOu7JRRpZS37';
      final amount = order['amount'] ?? 9900;
      final profile = order['profile'] as Map<String, dynamic>?;

      var options = {
        'key': keyId,
        'amount': amount,
        'name': 'FresherToWork',
        'description': 'Direct HR Matching - ₹99 Discovery Pass',
        'order_id': orderId,
        'timeout': 300,
        'prefill': {
          'contact': profile?['phone'] ?? '',
          'email': profile?['email'] ?? '',
          'name': profile?['name'] ?? '',
        },
        'theme': {
          'color': '#2563EB',
        },
      };

      _razorpay.open(options);
    } on ApiException catch (e) {
      if (mounted) {
        setState(() => _processing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.red,
            content: Text(e.message),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _processing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.red,
            content: Text('Payment Error: ${e.toString().replaceAll('Exception: ', '')}'),
          ),
        );
      }
    }
  }

  void _proceedToDashboard() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: _isActivated,
      child: Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      appBar: AppBar(
        backgroundColor: AppColors.scaffoldBg,
        elevation: 0,
        automaticallyImplyLeading: _isActivated,
        title: Text(
          _isActivated ? 'Verified Discovery Pass' : 'Activation & Discovery Pass',
          style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textDark),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _isActivated
                        ? [const Color(0xFF10B981), const Color(0xFF059669)]
                        : [AppColors.blueGradientStart, AppColors.blueGradientEnd],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: (_isActivated ? const Color(0xFF10B981) : AppColors.bluePrimary).withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Icon(_isActivated ? Icons.verified_rounded : Icons.bolt_rounded, color: Colors.white, size: 38),
              ),
              const SizedBox(height: 14),
              Text(
                _isActivated ? 'Candidate Account Verified' : 'Candidate Discovery Pass',
                style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.textDark),
              ),
              const SizedBox(height: 4),
              Text(
                _isActivated
                    ? 'Admin Verified • Direct HR Discovery Active'
                    : '1-Time ₹99 Activation • Lifetime Direct HR Discovery',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  color: _isActivated ? const Color(0xFF047857) : AppColors.textMuted,
                  fontWeight: _isActivated ? FontWeight.w700 : FontWeight.normal,
                ),
              ),
              const SizedBox(height: 22),

              // If already activated: Show Verified Card (Never show payment!)
              if (_isActivated)
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF10B981).withValues(alpha: 0.08),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(
                              color: Color(0xFFECFDF5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Lifetime Pass Active',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF065F46),
                                  ),
                                ),
                                Text(
                                  'Payment completed & Admin verified',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    color: const Color(0xFF047857),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      const Divider(height: 1, color: Color(0xFFD1FAE5)),
                      const SizedBox(height: 16),

                      _buildBenefitRow('Verified Proof-of-Work Badge Activated'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Direct HR Inquiries via WhatsApp & Email Active'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Unlimited Live Project & Campaign Proofs'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Instant Notifications for HR Shortlists'),
                      const SizedBox(height: 24),

                      // Single Dashboard Action Button (No payment!)
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _proceedToDashboard,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                          ),
                          child: Text(
                            'Open Candidate Dashboard →',
                            style: GoogleFonts.plusJakartaSans(fontSize: 14.5, fontWeight: FontWeight.w800),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              else
                // Pricing & Benefits Card (Only shown when unpaid)
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppColors.borderSubtle),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text('One-time fee', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                          Row(
                            children: [
                              Text(
                                '₹99',
                                style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.bluePrimary),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '₹499',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 14,
                                  color: AppColors.textLight,
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      const Divider(height: 1, color: AppColors.borderSubtle),
                      const SizedBox(height: 18),

                      _buildBenefitRow('Direct recruiter WhatsApp & Email inquiries'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Verified Proof-of-Work badge on candidate search'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Unlimited project & campaign proof uploads'),
                      const SizedBox(height: 12),
                      _buildBenefitRow('Instant notifications when shortlisted by HRs'),
                      const SizedBox(height: 26),

                      // Pay button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _processing ? null : _handlePayment,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.bluePrimary,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                          ),
                          child: _processing
                              ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : Text(
                                  'Pay ₹99 via UPI / Razorpay →',
                                  style: GoogleFonts.plusJakartaSans(fontSize: 14.5, fontWeight: FontWeight.w800),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    ),
  );
}

  Widget _buildBenefitRow(String text) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppColors.cardBlue,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_rounded, color: AppColors.bluePrimary, size: 16),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textDark)),
        ),
      ],
    );
  }
}
