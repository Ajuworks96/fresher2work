import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../profile/edit_profile_screen.dart';

class HomeFeedScreen extends StatefulWidget {
  final Function(int) onNavigateTab;
  const HomeFeedScreen({super.key, required this.onNavigateTab});

  @override
  State<HomeFeedScreen> createState() => _HomeFeedScreenState();
}

class _HomeFeedScreenState extends State<HomeFeedScreen> {
  String _currentDomainId = 'digital_marketing';
  String _selectedPill = 'All';
  String _searchQuery = '';
  String _candidateName = '';
  String? _avatarUrl;
  String? _avatarLocalPath;
  bool _isActivated = false;
  final TextEditingController _searchController = TextEditingController();
  List<ProofItem> _storedProofs = [];

  @override
  void initState() {
    super.initState();
    _loadState();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadState() async {
    final domain = await StorageService.getSelectedDomain();
    final proofs = await StorageService.getStoredProofs(domain);
    final user = await StorageService.getUser() ?? {};
    
    String name = (user['fullName'] as String?) ?? '';
    String? avUrl = user['avatarUrl'] as String?;
    String? avLocal = user['avatarLocalPath'] as String?;

    bool isAct = await StorageService.isActivated();

    try {
      final profile = await ApiService.getStudentProfile();
      final st = profile['student'] ?? profile;
      if (st['fullName'] != null && (st['fullName'] as String).isNotEmpty) {
        name = st['fullName'];
      }
      if (st['avatarUrl'] != null && (st['avatarUrl'] as String).isNotEmpty) {
        avUrl = st['avatarUrl'];
      }
      if (st['isActivated'] == true || profile['activation']?['isActivated'] == true) {
        isAct = true;
        await StorageService.setActivated(true);
      }
    } catch (_) {}

    if (mounted) {
      setState(() {
        _currentDomainId = domain;
        _candidateName = name;
        _avatarUrl = avUrl;
        _avatarLocalPath = avLocal;
        _storedProofs = proofs;
        _isActivated = isAct;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentDomain = DomainConstants.getDomainById(_currentDomainId);
    final displayProofs = _getFilteredProofs(currentDomain);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Logo & Notifications (Clean, collision-free alignment)
              Row(
                children: [
                  GestureDetector(
                    onTap: () => widget.onNavigateTab(2),
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFFEFF6FF),
                        border: Border.all(color: AppColors.bluePrimary, width: 2),
                      ),
                      child: _buildHomeAvatar(),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hi, Welcome Back! 👋',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            color: AppColors.textMuted,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                _candidateName.isNotEmpty ? _candidateName : 'Fresher Candidate',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.textDark,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (_isActivated) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.verified_rounded, size: 15, color: Color(0xFF10B981)),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.cardBlue,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.bluePrimary.withValues(alpha: 0.2)),
                    ),
                    child: Text(
                      currentDomain.shortTitle,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppColors.bluePrimary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: const Center(
                      child: Icon(Icons.notifications_none_rounded, size: 19, color: AppColors.textDark),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Search Bar & Filter (Matching Reference Image 1)
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: TextField(
                        controller: _searchController,
                        style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textDark),
                        decoration: InputDecoration(
                          hintText: 'Search proofs for ${currentDomain.shortTitle}...',
                          hintStyle: GoogleFonts.plusJakartaSans(fontSize: 12.5, color: AppColors.textLight),
                          prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textLight, size: 20),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        onChanged: (val) => setState(() => _searchQuery = val.trim()),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.cardBlue,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.bluePrimary.withValues(alpha: 0.3)),
                    ),
                    child: const Center(
                      child: Icon(Icons.tune_rounded, size: 20, color: AppColors.bluePrimary),
                    ),
                  ),
                ],
              ),
              if (_candidateName.isEmpty || (_avatarUrl == null && _avatarLocalPath == null))
                _buildCompleteProfileCard(),
              const SizedBox(height: 18),

              // Hero Upgrade / Connect Banner (Matching Reference Image 1 & 2)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.blueGradientStart, AppColors.blueGradientEnd],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.bluePrimary.withValues(alpha: 0.25),
                      blurRadius: 14,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'DIRECT HR MATCHING',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Showcase Verified Proofs',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'HRs evaluate live campaigns, websites & case studies first.',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11.5,
                              color: Colors.white.withValues(alpha: 0.9),
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: () => widget.onNavigateTab(1),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppColors.bluePrimary,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                            child: Text(
                              '+ Add New Proof Work',
                              style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      width: 76,
                      height: 84,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.28)),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          const Icon(
                            Icons.folder_special_rounded,
                            color: Colors.white,
                            size: 40,
                          ),
                          Positioned(
                            right: 14,
                            top: 18,
                            child: Container(
                              padding: const EdgeInsets.all(2.5),
                              decoration: const BoxDecoration(
                                color: Color(0xFF10B981),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.check_rounded,
                                color: Colors.white,
                                size: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Domain-Specific Subject Pills (Matching Reference Image 1)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Categories',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFDBEAFE)),
                    ),
                    child: Text(
                      '${displayProofs.length} Proofs Available',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppColors.bluePrimary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: currentDomain.subjectPills.map((pill) {
                    final isSelected = _selectedPill == pill;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedPill = pill),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.bluePrimary : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected ? AppColors.bluePrimary : AppColors.borderSubtle,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: AppColors.bluePrimary.withValues(alpha: 0.25),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : [],
                          ),
                          child: Text(
                            pill,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? Colors.white : AppColors.textDark,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 20),

              // Candidate Showcase Section (Matching Reference UI Cards)
              Text(
                'Verified Freshers & Proof Showcase',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 12),

              if (displayProofs.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.folder_open_rounded, size: 36, color: AppColors.textLight),
                      const SizedBox(height: 8),
                      Text(
                        'No proofs in "$_selectedPill" yet',
                        style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Add your first project proof or switch categories.',
                        style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => widget.onNavigateTab(1),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.bluePrimary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                        child: Text('+ Add ${currentDomain.shortTitle} Proof', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800)),
                      ),
                    ],
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: displayProofs.length,
                  itemBuilder: (context, index) {
                    final item = displayProofs[index];
                    return _buildReferenceShowcaseCard(item, currentDomain);
                  },
                ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  List<ProofItem> _getFilteredProofs(FresherDomain domain) {
    var list = _storedProofs.toList();

    if (_selectedPill != 'All') {
      list = list.where((p) => p.categoryBadge.toLowerCase().contains(_selectedPill.toLowerCase())).toList();
    }

    if (_searchQuery.isNotEmpty) {
      list = list.where((p) {
        final query = _searchQuery.toLowerCase();
        return p.title.toLowerCase().contains(query) ||
            p.subtitle.toLowerCase().contains(query) ||
            p.tags.any((t) => t.toLowerCase().contains(query));
      }).toList();
    }

    return list;
  }

  Widget _buildReferenceShowcaseCard(ProofItem proof, FresherDomain domain) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Header with Candidate Info, Rating & Rate
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Portrait Avatar
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: proof.avatarUrl.isNotEmpty
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            proof.avatarUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.person, color: AppColors.bluePrimary),
                          ),
                        )
                      : const Center(
                          child: Icon(
                            Icons.work_outline_rounded,
                            color: AppColors.bluePrimary,
                            size: 24,
                          ),
                        ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              proof.candidateName,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textDark,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        domain.roleTitle,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 4),

                      // Rating & Category Badge Row
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, size: 15, color: Colors.amber),
                          const SizedBox(width: 3),
                          Text(
                            '${proof.rating} (${proof.reviewCount})',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.successBg,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              proof.categoryBadge,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: AppColors.success,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: AppColors.borderSubtle),

          // Project Title & Subtitle Details
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  proof.title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  proof.subtitle,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: AppColors.textMuted,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 12),

                // Floating Metric Capsules (Inspired by Reference Image 1 & 2)
                if (proof.metrics.isNotEmpty)
                  Row(
                    children: proof.metrics.take(3).map((m) {
                      return Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(right: 6),
                          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                          decoration: BoxDecoration(
                            color: AppColors.cardBlue.withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.bluePrimary.withValues(alpha: 0.15)),
                          ),
                          child: Column(
                            children: [
                              Text(
                                m['val'] ?? '',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.bluePrimary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                m['label'] ?? '',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textMuted,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                const SizedBox(height: 14),

                // URLs and Links Preview
                if (proof.personalPortfolioUrl.isNotEmpty || proof.clientProjectUrl.isNotEmpty) ...[
                  Row(
                    children: [
                      if (proof.personalPortfolioUrl.isNotEmpty)
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.language_rounded, size: 14, color: AppColors.bluePrimary),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    proof.personalPortfolioUrl,
                                    style: GoogleFonts.plusJakartaSans(fontSize: 10.5, color: AppColors.bluePrimary, fontWeight: FontWeight.w700),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      if (proof.personalPortfolioUrl.isNotEmpty && proof.clientProjectUrl.isNotEmpty)
                        const SizedBox(width: 8),
                      if (proof.clientProjectUrl.isNotEmpty)
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.link_rounded, size: 14, color: AppColors.success),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    'Client Project Proof',
                                    style: GoogleFonts.plusJakartaSans(fontSize: 10.5, color: AppColors.success, fontWeight: FontWeight.w700),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHomeAvatar() {
    if (_avatarLocalPath != null && File(_avatarLocalPath!).existsSync()) {
      return ClipOval(
        child: Image.file(
          File(_avatarLocalPath!),
          fit: BoxFit.cover,
          width: 44,
          height: 44,
        ),
      );
    }
    if (_avatarUrl != null && _avatarUrl!.isNotEmpty) {
      return ClipOval(
        child: Image.network(
          _avatarUrl!,
          fit: BoxFit.cover,
          width: 44,
          height: 44,
          errorBuilder: (context, error, stackTrace) =>
              const Icon(Icons.person, color: AppColors.bluePrimary, size: 22),
        ),
      );
    }
    return const Icon(Icons.person, color: AppColors.bluePrimary, size: 22);
  }

  Widget _buildCompleteProfileCard() {
    return Container(
      margin: const EdgeInsets.only(top: 14),
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
            child: const Icon(Icons.edit_note_rounded,
                color: Colors.white, size: 20),
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
                      color: const Color(0xFF1E3A8A)),
                ),
                Text(
                  'Add photo, phone & proofs to get discovered by HRs.',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5, color: const Color(0xFF3B82F6)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () async {
              await Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const EditProfileScreen()),
              );
              _loadState();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.bluePrimary,
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Complete',
                style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
