import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../activation/activation_screen.dart';
import '../auth/login_screen.dart';
import '../projects/widgets/file_upload_zone.dart';
import 'edit_profile_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _currentDomainId = 'digital_marketing';
  String _userRoleTitle = '';
  String _candidateFullName = '';
  String _aboutText = '';
  String _phoneNumber = '';
  String _portfolioUrl = '';
  String? _avatarUrl;
  String? _avatarLocalPath;
  List<String> _skills = [];

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
    final user = await StorageService.getUser() ?? {};

    String name = (user['fullName'] as String?) ?? '';
    String role = (user['roleTitle'] as String?) ??
        (user['headline'] as String?) ??
        (user['niche'] as String?) ??
        '';
    String about = (user['about'] as String?) ?? '';
    String phone = (user['phone'] as String?) ?? '';
    String portfolio = (user['portfolioUrl'] as String?) ?? '';
    String? avUrl = user['avatarUrl'] as String?;
    String? avLocal = user['avatarLocalPath'] as String?;
    List<String> loadedSkills = [];
    if (user['skills'] is List) {
      loadedSkills = (user['skills'] as List).map((e) => e.toString()).toList();
    }

    try {
      final profile = await ApiService.getStudentProfile();
      final activated = profile['activation']?['isActivated'] == true ||
          profile['isActivated'] == true ||
          profile['student']?['isActivated'] == true;
      final st = profile['student'] ?? profile;
      if (st['fullName'] != null && (st['fullName'] as String).isNotEmpty) {
        name = st['fullName'];
      }
      if (st['headline'] != null && (st['headline'] as String).isNotEmpty) {
        role = st['headline'];
      }
      if (st['about'] != null && (st['about'] as String).isNotEmpty) {
        about = st['about'];
      }
      if (st['phone'] != null && (st['phone'] as String).isNotEmpty) {
        phone = st['phone'];
      }
      if (st['portfolioUrl'] != null && (st['portfolioUrl'] as String).isNotEmpty) {
        portfolio = st['portfolioUrl'];
      }
      if (st['avatarUrl'] != null && (st['avatarUrl'] as String).isNotEmpty) {
        avUrl = st['avatarUrl'];
      }

      if (mounted) {
        setState(() {
          _currentDomainId = domain;
          _candidateFullName = name;
          _userRoleTitle = role;
          _aboutText = about;
          _phoneNumber = phone;
          _portfolioUrl = portfolio;
          _avatarUrl = avUrl;
          _avatarLocalPath = avLocal;
          _skills = loadedSkills.isNotEmpty
              ? loadedSkills
              : DomainConstants.getDomainById(domain).skills;
          _isActivated = activated;
          _storedProofs = proofs;
        });
      }
    } catch (_) {
      final activated = await StorageService.isActivated();
      if (mounted) {
        setState(() {
          _currentDomainId = domain;
          _candidateFullName = name;
          _userRoleTitle = role;
          _aboutText = about;
          _phoneNumber = phone;
          _portfolioUrl = portfolio;
          _avatarUrl = avUrl;
          _avatarLocalPath = avLocal;
          _skills = loadedSkills.isNotEmpty
              ? loadedSkills
              : DomainConstants.getDomainById(domain).skills;
          _isActivated = activated;
          _storedProofs = proofs;
        });
      }
    }
  }

  Future<void> _navigateToEditProfile() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const EditProfileScreen()),
    );
    if (result == true || mounted) {
      _loadData();
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
    final slug = _candidateFullName.isNotEmpty
        ? _candidateFullName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]+'), '-')
        : 'profile';
    Clipboard.setData(ClipboardData(
        text: 'https://recruiter-web-ajuworks96s-projects.vercel.app/p/$slug'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.bluePrimary,
        content: Text('Profile & Verified Proofs link copied!'),
      ),
    );
  }

  Widget _buildAvatarWidget() {
    if (_avatarLocalPath != null && File(_avatarLocalPath!).existsSync()) {
      return Image.file(
        File(_avatarLocalPath!),
        fit: BoxFit.cover,
        width: 88,
        height: 88,
      );
    }
    if (_avatarUrl != null && _avatarUrl!.isNotEmpty) {
      return Image.network(
        _avatarUrl!,
        fit: BoxFit.cover,
        width: 88,
        height: 88,
        errorBuilder: (context, error, stackTrace) => const Icon(
          Icons.person_rounded,
          size: 46,
          color: AppColors.bluePrimary,
        ),
      );
    }
    return const Icon(
      Icons.person_rounded,
      size: 46,
      color: AppColors.bluePrimary,
    );
  }

  bool get _isProfileIncomplete {
    return _candidateFullName.isEmpty ||
        _aboutText.isEmpty ||
        _phoneNumber.isEmpty ||
        _portfolioUrl.isEmpty;
  }

  @override
  Widget build(BuildContext context) {
    final currentDomain = DomainConstants.getDomainById(_currentDomainId);
    final proofs = _storedProofs;
    final displayRoleTitle =
        _userRoleTitle.isNotEmpty ? _userRoleTitle : currentDomain.roleTitle;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 1. Premium Hero Header Banner with Gradient
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: double.infinity,
                  height: 200,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(0xFF1E3A8A),
                        Color(0xFF2563EB),
                        Color(0xFF3B82F6),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                ),

                // Floating Action Header Bar
                SafeArea(
                  child: Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Left Circle Profile Edit Icon (Targeted by user!)
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.12),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: IconButton(
                            icon: const Icon(
                              Icons.edit_outlined,
                              size: 20,
                              color: AppColors.bluePrimary,
                            ),
                            tooltip: 'Edit Profile',
                            onPressed: _navigateToEditProfile,
                          ),
                        ),

                        // Right Circle Action Buttons (Share & Logout)
                        Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.12),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.share_outlined,
                                  size: 19,
                                  color: AppColors.textDark,
                                ),
                                onPressed: _copyPitchLink,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.12),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.logout_rounded,
                                  size: 19,
                                  color: AppColors.danger,
                                ),
                                onPressed: _handleLogout,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Overlapping Interactive Avatar Circle
                Positioned(
                  bottom: -44,
                  left: 24,
                  child: GestureDetector(
                    onTap: _navigateToEditProfile,
                    child: Stack(
                      children: [
                        Container(
                          width: 90,
                          height: 90,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(color: Colors.white, width: 4),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.15),
                                blurRadius: 14,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ClipOval(child: _buildAvatarWidget()),
                        ),
                        Positioned(
                          bottom: 2,
                          right: 2,
                          child: Container(
                            width: 26,
                            height: 26,
                            decoration: BoxDecoration(
                              color: AppColors.bluePrimary,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Icon(
                              Icons.camera_alt_rounded,
                              color: Colors.white,
                              size: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 52),

            // 2. Profile Details & Controls
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Candidate Name & Edit Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _candidateFullName.isNotEmpty
                                  ? _candidateFullName
                                  : 'Candidate Profile',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textDark,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              displayRoleTitle,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: AppColors.bluePrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: _navigateToEditProfile,
                        icon: const Icon(Icons.edit_outlined, size: 14),
                        label: const Text('Edit Profile'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.bluePrimary,
                          side: const BorderSide(color: Color(0xFFDBEAFE)),
                          backgroundColor: const Color(0xFFEFF6FF),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          textStyle: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Profile Incomplete Banner (if details missing)
                  if (_isProfileIncomplete)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFBFDBFE)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: AppColors.bluePrimary,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              Icons.star_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Complete Your Candidate Profile',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF1E3A8A),
                                  ),
                                ),
                                Text(
                                  'Add your photo, phone & bio to boost recruiter inquiries.',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    color: const Color(0xFF3B82F6),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: _navigateToEditProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.bluePrimary,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 8),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Text(
                              'Complete',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // Skill Pills with Checkmark Badges
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _skills.take(5).map((skill) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
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
                            const Icon(
                              Icons.check_circle_outline_rounded,
                              size: 14,
                              color: AppColors.bluePrimary,
                            ),
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
                  const SizedBox(height: 18),

                  // 4 Stat Box Cards
                  Container(
                    padding: const EdgeInsets.symmetric(
                        vertical: 14, horizontal: 12),
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
                        _buildStatBox(
                            title: 'Proofs', value: '${proofs.length}+ Live'),
                        _buildDivider(),
                        _buildStatBox(title: 'Status', value: 'Ready'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

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
                  const SizedBox(height: 16),

                  // Tab Content Area
                  if (_activeTabIndex == 0) _buildAboutTab(currentDomain),
                  if (_activeTabIndex == 1)
                    _buildProofsTab(proofs, currentDomain),
                  if (_activeTabIndex == 2)
                    _buildPortfoliosTab(proofs, currentDomain),
                  if (_activeTabIndex == 3) _buildResumeTab(currentDomain),

                  const SizedBox(height: 18),

                  // Embedded ₹99 Discovery Pass Card
                  _buildDiscoveryPassCard(),
                  const SizedBox(height: 24),
                ],
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
    final displayRole =
        _userRoleTitle.isNotEmpty ? _userRoleTitle : domain.roleTitle;
    final bio = _aboutText.isNotEmpty
        ? _aboutText
        : 'Motivated $displayRole graduate specialized in practical hands-on executions, client projects, and verified measurable proofs. Ready for immediate full-time or hybrid roles.';

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
          Text(
            'About Candidate',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            bio,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              color: AppColors.textMuted,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 16),

          if (_phoneNumber.isNotEmpty) ...[
            Text(
              'Direct Recruiter Contact',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.phone_rounded,
                    size: 16, color: AppColors.bluePrimary),
                const SizedBox(width: 8),
                Text(
                  _phoneNumber,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],

          Text(
            'Specialist Focus',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            displayRole,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: AppColors.bluePrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProofsTab(List<ProofItem> proofs, FresherDomain domain) {
    if (proofs.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Column(
          children: [
            const Icon(Icons.folder_open_rounded,
                size: 40, color: AppColors.textLight),
            const SizedBox(height: 10),
            Text(
              'No Live Proofs Uploaded Yet',
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark),
            ),
            const SizedBox(height: 4),
            Text(
              'Upload your course campaigns, client works or reports to the Proof Hub to get verified.',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 12, color: AppColors.textMuted),
            ),
          ],
        ),
      );
    }

    return Column(
      children: proofs.map((proof) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  proof.categoryBadge,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.bluePrimary,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                proof.title,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                proof.subtitle,
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 12, color: AppColors.textMuted),
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
          Text(
            'Personal Portfolio Link',
            style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: AppColors.textDark),
          ),
          const SizedBox(height: 8),
          if (_portfolioUrl.isNotEmpty) ...[
            InkWell(
              onTap: () async {
                final uri = Uri.parse(_portfolioUrl.startsWith('http')
                    ? _portfolioUrl
                    : 'https://$_portfolioUrl');
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFDBEAFE)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.link_rounded,
                        color: AppColors.bluePrimary, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _portfolioUrl,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.bluePrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const Icon(Icons.open_in_new_rounded,
                        size: 16, color: AppColors.bluePrimary),
                  ],
                ),
              ),
            ),
          ] else ...[
            Text(
              'No live portfolio link added yet.',
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 12.5, color: AppColors.textMuted),
            ),
            const SizedBox(height: 8),
            TextButton.icon(
              onPressed: _navigateToEditProfile,
              icon: const Icon(Icons.add_link_rounded, size: 16),
              label: const Text('Add Portfolio URL'),
            ),
          ],
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
          Text(
            'Upload Verified Resume / CV',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Attach your latest PDF resume. In our proof-first ecosystem, projects remain primary.',
            style: GoogleFonts.plusJakartaSans(
                fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 14),
          FileUploadZone(
            title: 'Resume Document (PDF/DOCX)',
            isResumeMode: true,
            initialFiles: _resumeDocs,
            onFilesChanged: (files) => setState(() => _resumeDocs = files),
          ),
        ],
      ),
    );
  }

  Widget _buildDiscoveryPassCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _isActivated ? const Color(0xFFEFF6FF) : const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color:
              _isActivated ? const Color(0xFFBFDBFE) : const Color(0xFFFDE68A),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: _isActivated ? AppColors.bluePrimary : const Color(0xFFD97706),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _isActivated ? Icons.verified_rounded : Icons.lock_outline_rounded,
              color: Colors.white,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isActivated
                      ? '₹99 Discovery Pass Active'
                      : 'Unlock ₹99 Discovery Pass',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  _isActivated
                      ? 'Lifetime direct HR matching active'
                      : 'Get direct outreach from verified hiring managers',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          if (!_isActivated)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context)
                    .push(
                      MaterialPageRoute(
                          builder: (_) => const ActivationScreen()),
                    )
                    .then((_) => _loadData());
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.bluePrimary,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
              child: Text(
                'Activate',
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 11, fontWeight: FontWeight.w800),
              ),
            ),
        ],
      ),
    );
  }
}
