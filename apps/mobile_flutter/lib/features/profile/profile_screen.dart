import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../activation/activation_screen.dart';
import '../auth/login_screen.dart';
import '../projects/widgets/file_upload_zone.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _currentDomainId = 'digital_marketing';
  String _userRoleTitle = '';
  String _candidateFullName = '';
  int _activeTabIndex = 0; // 0: About, 1: Proof Works, 2: Portfolio Links, 3: Resume
  bool _isActivated = false;
  List<ProofItem> _storedProofs = [];

  List<UploadedFileModel> _resumeDocs = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final domain = await StorageService.getSelectedDomain();
    final proofs = await StorageService.getStoredProofs(domain);

    try {
      final profile = await ApiService.getStudentProfile();
      final activated = profile['activation']?['isActivated'] == true || profile['isActivated'] == true;
      final name = profile['fullName'] as String?;
      final niche = profile['niche'] as String?;

      if (mounted) {
        setState(() {
          _currentDomainId = domain;
          _candidateFullName = name ?? '';
          _userRoleTitle = niche ?? '';
          _isActivated = activated;
          _storedProofs = proofs;
        });
      }
    } catch (_) {
      final activated = await StorageService.isActivated();
      final user = await StorageService.getUser() ?? {};
      final customRole = (user['roleTitle'] as String?) ?? (user['niche'] as String?);

      if (mounted) {
        setState(() {
          _currentDomainId = domain;
          _userRoleTitle = customRole ?? '';
          _isActivated = activated;
          _storedProofs = proofs;
        });
      }
    }
  }

  Future<void> _handleLogout() async {
    await StorageService.removeToken();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  void _copyPitchLink() {
    Clipboard.setData(const ClipboardData(text: 'https://fresherto.work/candidate/arjun-krishnan'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.bluePrimary,
        content: Text('Profile & Verified Proofs link copied!'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentDomain = DomainConstants.getDomainById(_currentDomainId);
    final proofs = _storedProofs.isNotEmpty ? _storedProofs : currentDomain.sampleProjects;
    final displayRoleTitle = _userRoleTitle.isNotEmpty ? _userRoleTitle : currentDomain.roleTitle;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 1. Properly Framed Hero Candidate Portrait Photo
            Stack(
              children: [
                // Candidate Portrait Photo with Proper Face Framing
                Container(
                  width: double.infinity,
                  height: 290,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(currentDomain.avatarUrl),
                      fit: BoxFit.cover,
                      alignment: const Alignment(0, -0.3), // Properly frames face
                    ),
                  ),
                ),

                // Subtle Overlay Gradient for Top Header Controls
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 90,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.black.withValues(alpha: 0.45),
                          Colors.transparent,
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ),

                // Floating Action Header Bar
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Left Circle Profile Badge Icon
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.92),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.1),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Center(
                            child: Icon(Icons.person_rounded, size: 20, color: AppColors.textDark),
                          ),
                        ),

                        // Right Circle Action Buttons (Share & Logout)
                        Row(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.92),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                              child: IconButton(
                                icon: const Icon(Icons.share_outlined, size: 19, color: AppColors.textDark),
                                onPressed: _copyPitchLink,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.92),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                              child: IconButton(
                                icon: const Icon(Icons.logout_rounded, size: 19, color: AppColors.textDark),
                                onPressed: _handleLogout,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // 2. Overlapping Curved Sheet Card
            Transform.translate(
              offset: const Offset(0, -24),
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: AppColors.scaffoldBg,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 16,
                      offset: Offset(0, -4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Candidate Name & User Defined Role Title / Niche
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _candidateFullName.isNotEmpty ? _candidateFullName : currentDomain.candidateName,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: AppColors.textDark,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          displayRoleTitle,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.bluePrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Skill Pills with Checkmark Badges
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: currentDomain.skills.take(4).map((skill) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.borderSubtle),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.check_circle_outline_rounded, size: 14, color: AppColors.bluePrimary),
                              const SizedBox(width: 6),
                              Text(
                                skill,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),

                    // 4 Stat Box Cards
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.borderSubtle),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          _buildStatBox(title: 'Experience', value: 'Fresher'),
                          _buildDivider(),
                          _buildStatBox(title: 'Rating', value: '4.9 ★'),
                          _buildDivider(),
                          _buildStatBox(title: 'Proofs', value: '${proofs.length}+ Live'),
                          _buildDivider(),
                          _buildStatBox(title: 'Status', value: 'Ready'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    // 4 Segmented Capsule Tabs
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        children: [
                          _buildTabItem('About', 0),
                          _buildTabItem('Proof Works', 1),
                          _buildTabItem('Portfolios', 2),
                          _buildTabItem('Resume', 3),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Tab Content Area
                    if (_activeTabIndex == 0) _buildAboutTab(currentDomain),
                    if (_activeTabIndex == 1) _buildProofsTab(proofs, currentDomain),
                    if (_activeTabIndex == 2) _buildPortfoliosTab(proofs, currentDomain),
                    if (_activeTabIndex == 3) _buildResumeTab(currentDomain),

                    const SizedBox(height: 18),

                    // Embedded ₹99 Discovery Pass Card
                    _buildDiscoveryPassCard(),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatBox({required String title, required String value}) {
    return Expanded(
      child: Column(
        children: [
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w900,
              color: AppColors.textDark,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 24,
      color: AppColors.borderSubtle,
    );
  }

  Widget _buildTabItem(String title, int index) {
    final isSelected = _activeTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeTabIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.bluePrimary : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(
            child: Text(
              title,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11.5,
                fontWeight: FontWeight.w800,
                color: isSelected ? Colors.white : AppColors.textMuted,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAboutTab(FresherDomain domain) {
    final displayRole = _userRoleTitle.isNotEmpty ? _userRoleTitle : domain.roleTitle;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('About Candidate', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textDark)),
          const SizedBox(height: 6),
          Text(
            'Motivated $displayRole graduate specialized in hands-on campaign executions, real client projects, and verified measurable ROI. Ready for immediate full-time or hybrid roles.',
            style: GoogleFonts.plusJakartaSans(fontSize: 12.5, color: AppColors.textMuted, height: 1.5),
          ),
          const SizedBox(height: 16),

          Text('Education & Certifications', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          const SizedBox(height: 4),
          Text(domain.candidateDegree, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.bluePrimary, fontWeight: FontWeight.w700)),
          const SizedBox(height: 14),

          Text('Core Competencies', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: domain.skills.map((s) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.cardBlue,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(s, style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.bluePrimary)),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildProofsTab(List<ProofItem> proofs, FresherDomain domain) {
    return Column(
      children: proofs.map((p) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.cardBlue,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(p.categoryBadge, style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w800, color: AppColors.bluePrimary)),
                  ),
                  const Icon(Icons.verified_rounded, size: 16, color: AppColors.success),
                ],
              ),
              const SizedBox(height: 8),
              Text(p.title, style: GoogleFonts.plusJakartaSans(fontSize: 13.5, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              const SizedBox(height: 4),
              Text(p.subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.textMuted)),
              const SizedBox(height: 10),

              if (p.metrics.isNotEmpty)
                Row(
                  children: p.metrics.map((m) {
                    return Container(
                      margin: const EdgeInsets.only(right: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.scaffoldBg,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Text(
                        '${m['label']}: ${m['val']}',
                        style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w800, color: AppColors.bluePrimary),
                      ),
                    );
                  }).toList(),
                ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPortfoliosTab(List<ProofItem> proofs, FresherDomain domain) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Personal Portfolio & Live Work Links', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textDark)),
          const SizedBox(height: 12),

          _buildLinkTile(
            title: 'Personal Portfolio Website (Must)',
            url: 'https://arjunkrishnan.marketing',
            icon: Icons.language_rounded,
          ),
          const SizedBox(height: 10),
          _buildLinkTile(
            title: 'Meta Ads Manager Live Campaign',
            url: 'https://business.facebook.com/adsmanager/campaigns',
            icon: Icons.trending_up_rounded,
          ),
          const SizedBox(height: 10),
          _buildLinkTile(
            title: 'Google Search Console Ranking Case Study',
            url: 'https://search.google.com/search-console/performance',
            icon: Icons.search_rounded,
          ),
        ],
      ),
    );
  }

  Widget _buildLinkTile({required String title, required String url, required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.scaffoldBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.bluePrimary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                Text(url, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppColors.bluePrimary, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.copy_rounded, size: 16, color: AppColors.textLight),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: url));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Copied $title URL')),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildResumeTab(FresherDomain domain) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Verified Resume / CV', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textDark)),
          const SizedBox(height: 6),
          Text('Recruiters can download and evaluate your resume directly.', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.textMuted)),
          const SizedBox(height: 14),

          FileUploadZone(
            initialFiles: _resumeDocs,
            onFilesChanged: (files) => setState(() => _resumeDocs = files),
            title: 'Uploaded Resume Document',
            isResumeMode: true,
          ),
        ],
      ),
    );
  }

  Widget _buildDiscoveryPassCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: _isActivated ? AppColors.successBg : AppColors.cardBlue,
              shape: BoxShape.circle,
            ),
            child: Icon(
              _isActivated ? Icons.verified_rounded : Icons.lock_outline_rounded,
              color: _isActivated ? AppColors.success : AppColors.bluePrimary,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isActivated ? '₹99 Discovery Pass Active' : 'Unlock ₹99 Discovery Pass',
                  style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.textDark),
                ),
                Text(
                  _isActivated ? 'Lifetime direct HR matching active' : 'Get direct outreach from verified hiring managers',
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
          if (!_isActivated)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const ActivationScreen()),
                ).then((_) => _loadData());
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.bluePrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: Text('Activate', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800)),
            ),
        ],
      ),
    );
  }
}
