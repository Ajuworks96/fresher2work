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
      final isAct = profile['activation']?['isActivated'] == true || profile['isActivated'] == true;
      await StorageService.setActivated(isAct);
      if (mounted) {
        setState(() => _isActivated = isAct);
      }
    } catch (_) {
      final act = await StorageService.isActivated();
      if (mounted) {
        setState(() => _isActivated = act);
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
        if (mounted) {
          setState(() {
            _isActivated = true;
            _processing = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.success,
              content: Text('✓ ₹99 Discovery Pass Activated! Verified by Razorpay.'),
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
        'name': 'Fresher2Work',
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
          'Activation & Discovery Pass',
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
                  gradient: const LinearGradient(
                    colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.bluePrimary.withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 38),
              ),
              const SizedBox(height: 14),
              Text(
                'Candidate Discovery Pass',
                style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.textDark),
              ),
              const SizedBox(height: 4),
              Text(
                '1-Time ₹99 Activation • Lifetime Direct HR Discovery',
                style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textMuted),
              ),
              const SizedBox(height: 22),

              // Pricing & Benefits Card
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
                        onPressed: _processing
                            ? null
                            : (_isActivated ? _proceedToDashboard : _handlePayment),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isActivated ? AppColors.success : AppColors.bluePrimary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                        ),
                        child: _processing
                            ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : Text(
                                _isActivated ? '✓ Pass Active • Launch Dashboard →' : 'Pay ₹99 via UPI / Razorpay →',
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
