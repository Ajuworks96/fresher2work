import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../navigation/main_navigation_screen.dart';
import '../welcome/welcome_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _fadeAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeIn,
    );

    _scaleAnim = Tween<double>(begin: 0.92, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: Curves.easeOutBack,
      ),
    );

    _animController.forward();
    _checkAuthAndProceed();
  }

  Future<void> _checkAuthAndProceed() async {
    // Give user 3.0 seconds to comfortably read the brand positioning and core journey
    final timerFuture = Future.delayed(const Duration(milliseconds: 3000));

    final isSessionValid = await StorageService.isSessionValid();
    if (isSessionValid) {
      // Refresh activation status from API in background
      try {
        final profile = await ApiService.getStudentProfile();
        final isAct = profile['activation']?['isActivated'] == true ||
            profile['isActivated'] == true ||
            profile['student']?['isActivated'] == true;
        if (isAct) {
          await StorageService.setActivated(true);
        }
      } catch (_) {}
    }

    await timerFuture;

    if (!mounted) return;

    final Widget targetScreen =
        isSessionValid ? const MainNavigationScreen() : const WelcomeScreen();

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 400),
        pageBuilder: (context, anim1, anim2) => targetScreen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Widget _buildJourneyStep(String label, {bool isHighlighted = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: isHighlighted ? const Color(0xFFEFF6FF) : Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: isHighlighted ? AppColors.bluePrimary : const Color(0xFFE2E8F0),
          width: isHighlighted ? 1.3 : 1,
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          color: isHighlighted ? AppColors.bluePrimary : const Color(0xFF334155),
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildArrow() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 3),
      child: Icon(
        Icons.arrow_forward_rounded,
        size: 11,
        color: Color(0xFF94A3B8),
      ),
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
          child: Center(
            child: AnimatedBuilder(
              animation: _animController,
              builder: (context, child) {
                return Opacity(
                  opacity: _fadeAnim.value,
                  child: Transform.scale(
                    scale: _scaleAnim.value,
                    child: child,
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(height: 20),

                  // Center Content
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // App Logo Icon inside soft blue circle
                      Container(
                        width: 82,
                        height: 82,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xFFDBEAFE),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.bluePrimary.withValues(alpha: 0.12),
                              blurRadius: 28,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.work_rounded,
                            size: 40,
                            color: AppColors.bluePrimary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),

                      // Brand Name
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: 'Fresher',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 30,
                                fontWeight: FontWeight.w900,
                                color: const Color(0xFF0F172A),
                                letterSpacing: -0.6,
                              ),
                            ),
                            TextSpan(
                              text: 'ToWork',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 30,
                                fontWeight: FontWeight.w900,
                                color: AppColors.bluePrimary,
                                letterSpacing: -0.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Brand Positioning Tagline
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(
                          'The bridge from learning to employment.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF475569),
                            letterSpacing: -0.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Core Journey Pipeline Card
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 24),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.bluePrimary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'CORE JOURNEY',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 1.2,
                                    color: const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Wrap(
                              alignment: WrapAlignment.center,
                              crossAxisAlignment: WrapCrossAlignment.center,
                              spacing: 2,
                              runSpacing: 6,
                              children: [
                                _buildJourneyStep('LEARN'),
                                _buildArrow(),
                                _buildJourneyStep('BUILD'),
                                _buildArrow(),
                                _buildJourneyStep('PROVE'),
                                _buildArrow(),
                                _buildJourneyStep('DISCOVER'),
                                _buildArrow(),
                                _buildJourneyStep('CONNECT'),
                                _buildArrow(),
                                _buildJourneyStep('WORK', isHighlighted: true),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  // Bottom Footer & Progress
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(AppColors.bluePrimary),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          'GLOBAL PROOF-OF-WORK PLATFORM',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                            color: const Color(0xFF94A3B8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
