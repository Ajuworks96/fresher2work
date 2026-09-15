import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/storage_service.dart';

class RecruiterMatchesScreen extends StatefulWidget {
  const RecruiterMatchesScreen({super.key});

  @override
  State<RecruiterMatchesScreen> createState() => _RecruiterMatchesScreenState();
}

class _RecruiterMatchesScreenState extends State<RecruiterMatchesScreen> {
  String _currentDomainId = 'digital_marketing';

  @override
  void initState() {
    super.initState();
    _loadDomain();
  }

  Future<void> _loadDomain() async {
    final domain = await StorageService.getSelectedDomain();
    if (mounted) setState(() => _currentDomainId = domain);
  }

  @override
  Widget build(BuildContext context) {
    final domain = DomainConstants.getDomainById(_currentDomainId);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      appBar: AppBar(
        backgroundColor: AppColors.scaffoldBg,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recruiter Matches',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.textDark,
              ),
            ),
            Text(
              'Companies hiring ${domain.shortTitle} Freshers',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.cardBlue,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(Icons.bolt_rounded, size: 14, color: AppColors.bluePrimary),
                const SizedBox(width: 4),
                Text(
                  '12 Active HRs',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.bluePrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          children: [
            // Recruiter Discovery Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.bluePrimary.withValues(alpha: 0.2),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.rocket_launch_rounded, size: 24, color: AppColors.bluePrimary),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Proof Direct-Hire Fast Track',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Recruiters look at your uploaded proofs first, not your years of experience.',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            color: Colors.white.withValues(alpha: 0.9),
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text(
              'Recommended Openings for You',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 12),

            // Job Matches State
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.business_center_outlined,
                      color: AppColors.primaryGreen,
                      size: 26,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'No Direct Openings Posted Yet',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'As corporate hiring partners post verified job opportunities, they will automatically appear here matched to your ${domain.shortTitle} profile.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      color: AppColors.textLight,
                      height: 1.45,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildJobCard({
    required String companyName,
    required IconData logoIcon,
    required String roleTitle,
    required String location,
    required String salary,
    required String proofReq,
    required List<String> tags,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.cardBlue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Icon(logoIcon, size: 20, color: AppColors.bluePrimary),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        companyName,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        roleTitle,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textDark,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.cardBlue,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  salary,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.bluePrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textLight),
              const SizedBox(width: 4),
              Text(
                location,
                style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppColors.textLight),
              ),
            ],
          ),
          const SizedBox(height: 10),

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.successBg,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.successBorder),
            ),
            child: Row(
              children: [
                const Icon(Icons.verified_rounded, size: 13, color: AppColors.success),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Requirement: $proofReq',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.success,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: tags.map((t) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.cardBlue.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  t,
                  style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w700, color: AppColors.bluePrimary),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 14),

          SizedBox(
            width: double.infinity,
            height: 40,
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: AppColors.success,
                    content: Text('Verified Pitch & Proofs sent to $companyName!'),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.bluePrimary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: Text('1-Tap Pitch with Proof →', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800)),
            ),
          ),
        ],
      ),
    );
  }
}
