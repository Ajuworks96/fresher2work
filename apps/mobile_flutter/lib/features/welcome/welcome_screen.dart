import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _onboardingData = [
    {
      'image': 'assets/images/onboard_1.png',
      'title': 'Learn & Build Proofs',
      'subtitle':
          'Transform your skills into real project proofs, live campaigns & portfolio showcases.',
    },
    {
      'image': 'assets/images/onboard_2.png',
      'title': 'Prove & Get Discovered',
      'subtitle':
          'The bridge from learning to employment. Verified proofs get discovered by top HRs directly.',
    },
    {
      'image': 'assets/images/onboard_3.png',
      'title': 'Connect & Start Working',
      'subtitle':
          'Direct recruiter inquiries, chats and interviews. International proof-of-work hiring standard.',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentPage < _onboardingData.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _showAuthSheet();
    }
  }

  void _onSkip() {
    _showAuthSheet();
  }

  void _showAuthSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(
                color: Color(0x1A0F172A),
                blurRadius: 30,
                offset: Offset(0, -10),
              ),
            ],
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag handle
                Center(
                  child: Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(2.5),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Branded Logo / Icon
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFDBEAFE)),
                  ),
                  child: const Icon(
                    Icons.work_outline_rounded,
                    color: AppColors.bluePrimary,
                    size: 26,
                  ),
                ),
                const SizedBox(height: 16),

                Text(
                  'Join FresherToWork',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF0F172A),
                    letterSpacing: -0.4,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Kickstart your career through verified proof of work. Connect directly with hiring partners.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13.5,
                    color: const Color(0xFF64748B),
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 28),

                // Primary Button: Register
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const RegisterScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.bluePrimary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Create Candidate Account',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward_rounded, size: 18),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Secondary Button: Sign In
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const LoginScreen(),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF0F172A),
                      side: const BorderSide(color: Color(0xFFE2E8F0)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      'Sign In to Existing Account',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Column(
            children: [
              // Top Minimal Brand Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Fresher',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF0F172A),
                              letterSpacing: -0.5,
                            ),
                          ),
                          TextSpan(
                            text: 'ToWork',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: AppColors.bluePrimary,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFDBEAFE)),
                      ),
                      child: Text(
                        'PROOFS FIRST',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.bluePrimary,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Centered Carousel
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  physics: const BouncingScrollPhysics(),
                  onPageChanged: (idx) {
                    setState(() {
                      _currentPage = idx;
                    });
                  },
                  itemCount: _onboardingData.length,
                  itemBuilder: (context, index) {
                    final item = _onboardingData[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Spacer(flex: 1),

                          // Illustration Graphic
                          Container(
                            constraints: const BoxConstraints(
                              maxWidth: 290,
                              maxHeight: 290,
                            ),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(24),
                              child: Image.asset(
                                item['image']!,
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    width: 240,
                                    height: 240,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(24),
                                    ),
                                    child: const Icon(
                                      Icons.image_outlined,
                                      size: 48,
                                      color: Color(0xFF94A3B8),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),

                          const Spacer(flex: 1),

                          // Title (Exact font style & bold hierarchy as reference)
                          Text(
                            item['title']!,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF0F172A),
                              letterSpacing: -0.6,
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Subtitle (Minimal, clean, centered)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              item['subtitle']!,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFF64748B),
                                height: 1.5,
                              ),
                            ),
                          ),

                          const Spacer(flex: 1),
                        ],
                      ),
                    );
                  },
                ),
              ),

              // Bottom Navigation Controls (Matching reference layout)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Left: Skip button
                    SizedBox(
                      width: 80,
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: TextButton(
                          onPressed: _onSkip,
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(50, 36),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            'Skip',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF94A3B8),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Center: Dot Page Indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_onboardingData.length, (idx) {
                        final isActive = idx == _currentPage;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          curve: Curves.easeInOut,
                          margin: const EdgeInsets.symmetric(horizontal: 3.5),
                          width: isActive ? 22 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: isActive
                                ? AppColors.bluePrimary
                                : const Color(0xFFE2E8F0),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        );
                      }),
                    ),

                    // Right: Next / Get Started button
                    SizedBox(
                      width: 96,
                      child: Align(
                        alignment: Alignment.centerRight,
                        child: _currentPage == _onboardingData.length - 1
                            ? ElevatedButton(
                                onPressed: _onNext,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.bluePrimary,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 8,
                                  ),
                                  minimumSize: const Size(80, 36),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(18),
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Start',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 14,
                                    ),
                                  ],
                                ),
                              )
                            : TextButton(
                                onPressed: _onNext,
                                style: TextButton.styleFrom(
                                  padding: EdgeInsets.zero,
                                  minimumSize: const Size(50, 36),
                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                ),
                                child: Text(
                                  'Next',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.bluePrimary,
                                  ),
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
