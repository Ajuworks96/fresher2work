import 'dart:io';
import 'package:file_picker/file_picker.dart';
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
import '../legal/legal_policy_screen.dart';
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
  String? _coverUrl;
  String? _coverLocalPath;
  List<String> _skills = [];

  List<String> _lookingFor = ['Full-time', 'Internship'];
  List<String> _workModes = ['Remote', 'Hybrid'];
  List<String> _preferredLocations = ['Kochi', 'Kozhikode', 'Bangalore'];

  String _getUsername() {
    final name = _candidateFullName.trim().isNotEmpty ? _candidateFullName : 'talent';
    return name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '_');
  }

  String get _talentPassportUrl => 'https://freshertowork.com/u/${_getUsername()}';

  int _calculateProfileStrength() {
    int score = 0;
    if (_candidateFullName.trim().isNotEmpty && _userRoleTitle.trim().isNotEmpty) score += 20;
    if (_aboutText.trim().isNotEmpty) score += 10;
    if (_phoneNumber.trim().isNotEmpty) score += 10;
    if (_avatarUrl != null || _avatarLocalPath != null) score += 10;
    if (_skills.length >= 3) score += 15;
    if (_storedProofs.isNotEmpty) score += 15;
    if (_resumeDocs.isNotEmpty) score += 10;
    if (_lookingFor.isNotEmpty && _workModes.isNotEmpty) score += 10;
    return score.clamp(15, 100);
  }

  Future<void> _shareTalentPassport() async {
    final url = _talentPassportUrl;
    final text = 'Check out my verified Talent Passport on FresherToWork: $url';
    await Clipboard.setData(ClipboardData(text: url));
    final waUri = Uri.parse('https://wa.me/?text=${Uri.encodeComponent(text)}');
    try {
      if (await canLaunchUrl(waUri)) {
        await launchUrl(waUri, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text(
            '✓ Talent Passport URL copied to clipboard! Ready to share.',
            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700),
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  Future<void> _copyPassportLink() async {
    final url = _talentPassportUrl;
    await Clipboard.setData(ClipboardData(text: url));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text(
            '✓ Link copied: $url\nShare on WhatsApp, LinkedIn or Instagram bio!',
            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 12),
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  Future<void> _openPassportUrl() async {
    final uri = Uri.parse(_talentPassportUrl);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}
  }

  int _activeTabIndex = 0; // 0: About, 1: Proof Works, 2: Portfolio Links, 3: Resume
  bool _isActivated = false;
  List<ProofItem> _storedProofs = [];
  List<UploadedFileModel> _resumeDocs = [];

  @override
  void initState() {
    super.initState();
    _loadData();
    _loadResumeDocs();
  }

  Future<void> _loadResumeDocs() async {
    var saved = await StorageService.getResumeDocs();
    if (saved.isEmpty) {
      final user = await StorageService.getUser();
      if (user != null && user['resumeDocs'] is List && (user['resumeDocs'] as List).isNotEmpty) {
        saved = (user['resumeDocs'] as List).map((e) => Map<String, dynamic>.from(e as Map)).toList();
        await StorageService.saveResumeDocs(saved);
      }
    }
    if (mounted && saved.isNotEmpty) {
      final docs = saved.map((m) => UploadedFileModel(
        name: m['name'] as String? ?? '',
        size: m['size'] as String? ?? '',
        extension: m['extension'] as String? ?? 'pdf',
        isUploaded: true,
      )).toList();
      setState(() => _resumeDocs = docs);
    }
  }

  Future<void> _saveResumeDocs() async {
    final data = _resumeDocs.map((f) => {
      'name': f.name,
      'size': f.size,
      'extension': f.extension,
    }).toList();
    await StorageService.saveResumeDocs(data);

    // Merge into local cached user
    final user = await StorageService.getUser() ?? {};
    user['resumeDocs'] = data;
    if (data.isNotEmpty) {
      user['cvFileName'] = data.first['name'];
      user['cvFileUrl'] = 'https://assets.fresher2work.com/resumes/${Uri.encodeComponent(data.first['name'] as String)}';
    }
    await StorageService.saveUser(user);

    // Sync to backend
    if (data.isNotEmpty) {
      ApiService.updateStudentProfile({
        'resumeDocs': data,
        'cvFileName': data.first['name'],
        'cvFileUrl': user['cvFileUrl'],
      }).catchError((_) => <String, dynamic>{});
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text('✓ Resume saved successfully!',
              style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
          behavior: SnackBarBehavior.floating,
          margin: const EdgeInsets.all(16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
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
    String? cvUrl = user['coverUrl'] as String?;
    String? cvLocal = user['coverLocalPath'] as String?;
    List<String> loadedSkills = [];
    if (user['skills'] is List) {
      loadedSkills = (user['skills'] as List).map((e) => e.toString()).toList();
    }
    List<String> loadedLookingFor = _lookingFor;
    if (user['lookingFor'] is List && (user['lookingFor'] as List).isNotEmpty) {
      loadedLookingFor = (user['lookingFor'] as List).map((e) => e.toString()).toList();
    }
    List<String> loadedWorkModes = _workModes;
    if (user['workModes'] is List && (user['workModes'] as List).isNotEmpty) {
      loadedWorkModes = (user['workModes'] as List).map((e) => e.toString()).toList();
    }
    List<String> loadedLocations = _preferredLocations;
    if (user['preferredLocations'] is List && (user['preferredLocations'] as List).isNotEmpty) {
      loadedLocations = (user['preferredLocations'] as List).map((e) => e.toString()).toList();
    }

    final cachedActivated = await StorageService.isActivated();
    bool activated = cachedActivated;

    // Immediately display saved local profile data without blocking on network
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
        _coverUrl = cvUrl;
        _coverLocalPath = cvLocal;
        _skills = loadedSkills.isNotEmpty
            ? loadedSkills
            : DomainConstants.getDomainById(domain).skills;
        _lookingFor = loadedLookingFor;
        _workModes = loadedWorkModes;
        _preferredLocations = loadedLocations;
        _isActivated = activated;
        _storedProofs = proofs;
      });
    }

    try {
      final profile = await ApiService.getStudentProfile();
      final st = profile['student'] ?? profile['profile'] ?? profile;
      // Payment check: ONLY isActivated (payment flag). Admin verification/moderation does NOT bypass payment.
      final serverActivated = profile['activation']?['isActivated'] == true ||
          profile['isActivated'] == true ||
          st['isActivated'] == true;

      activated = serverActivated || cachedActivated;
      if (serverActivated) {
        await StorageService.setActivated(true);
      }

      // ONLY fill in from server if local field is empty (preserves user customizations)
      if (name.isEmpty && st['fullName'] != null && (st['fullName'] as String).isNotEmpty) {
        name = st['fullName'];
      }
      if (role.isEmpty && st['headline'] != null && (st['headline'] as String).isNotEmpty) {
        role = st['headline'];
      }
      if (about.isEmpty && st['about'] != null && (st['about'] as String).isNotEmpty) {
        about = st['about'];
      }
      if (phone.isEmpty && st['phone'] != null && (st['phone'] as String).isNotEmpty) {
        phone = st['phone'];
      }
      if (portfolio.isEmpty && st['portfolioUrl'] != null && (st['portfolioUrl'] as String).isNotEmpty) {
        portfolio = st['portfolioUrl'];
      }
      if (avUrl == null && avLocal == null && st['avatarUrl'] != null && (st['avatarUrl'] as String).isNotEmpty) {
        avUrl = st['avatarUrl'];
      }
      if (cvUrl == null && cvLocal == null && st['coverUrl'] != null && (st['coverUrl'] as String).isNotEmpty) {
        cvUrl = st['coverUrl'];
      }

      // Sync user profile to backend in background if backend has default or stale data
      if (name.isNotEmpty && name != st['fullName']) {
        ApiService.updateStudentProfile({
          'fullName': name,
          'headline': role,
          'about': about,
          'phone': phone,
          'portfolioUrl': portfolio,
          'avatarUrl': ?avUrl,
          'coverUrl': ?cvUrl,
        }).catchError((_) => <String, dynamic>{});
      }

      // Check if backend has resume documents and populate local cache if currently empty
      if (_resumeDocs.isEmpty) {
        if (st['resumeDocs'] is List && (st['resumeDocs'] as List).isNotEmpty) {
          final serverDocs = (st['resumeDocs'] as List).map((e) => Map<String, dynamic>.from(e as Map)).toList();
          await StorageService.saveResumeDocs(serverDocs);
          if (mounted) {
            setState(() {
              _resumeDocs = serverDocs.map((m) => UploadedFileModel(
                name: m['name'] as String? ?? '',
                size: m['size'] as String? ?? '',
                extension: m['extension'] as String? ?? 'pdf',
                isUploaded: true,
              )).toList();
            });
          }
        } else if (st['cvFileUrl'] != null && (st['cvFileUrl'] as String).isNotEmpty) {
          final doc = {
            'name': st['cvFileName'] ?? 'Resume_${name.isNotEmpty ? name.replaceAll(' ', '_') : 'Document'}.pdf',
            'size': 'PDF Document',
            'extension': 'PDF',
            'url': st['cvFileUrl'],
          };
          await StorageService.saveResumeDocs([doc]);
          if (mounted) {
            setState(() {
              _resumeDocs = [
                UploadedFileModel(
                  name: doc['name']!,
                  size: doc['size']!,
                  extension: doc['extension']!,
                  isUploaded: true,
                )
              ];
            });
          }
        }
      }

      if (st['lookingFor'] is List && (st['lookingFor'] as List).isNotEmpty) {
        loadedLookingFor = (st['lookingFor'] as List).map((e) => e.toString()).toList();
      }
      if (st['workModes'] is List && (st['workModes'] as List).isNotEmpty) {
        loadedWorkModes = (st['workModes'] as List).map((e) => e.toString()).toList();
      }
      if (st['preferredLocations'] is List && (st['preferredLocations'] as List).isNotEmpty) {
        loadedLocations = (st['preferredLocations'] as List).map((e) => e.toString()).toList();
      }

      // Merge into existing user cache so resumeDocs, skills, etc. are preserved
      final existingUser = await StorageService.getUser() ?? {};
      existingUser['fullName'] = name;
      existingUser['headline'] = role;
      existingUser['roleTitle'] = role;
      existingUser['about'] = about;
      existingUser['phone'] = phone;
      existingUser['portfolioUrl'] = portfolio;
      if (avUrl != null) existingUser['avatarUrl'] = avUrl;
      if (cvUrl != null) existingUser['coverUrl'] = cvUrl;
      existingUser['lookingFor'] = loadedLookingFor;
      existingUser['workModes'] = loadedWorkModes;
      existingUser['preferredLocations'] = loadedLocations;
      await StorageService.saveUser(existingUser);

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
          _coverUrl = cvUrl;
          _coverLocalPath = cvLocal;
          _skills = loadedSkills.isNotEmpty
              ? loadedSkills
              : DomainConstants.getDomainById(domain).skills;
          _lookingFor = loadedLookingFor;
          _workModes = loadedWorkModes;
          _preferredLocations = loadedLocations;
          _isActivated = activated;
          _storedProofs = proofs;
        });
      }
    } catch (_) {
      final localAct = await StorageService.isActivated();
      activated = localAct || cachedActivated;
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
          _coverUrl = cvUrl;
          _coverLocalPath = cvLocal;
          _skills = loadedSkills.isNotEmpty
              ? loadedSkills
              : DomainConstants.getDomainById(domain).skills;
          _lookingFor = loadedLookingFor;
          _workModes = loadedWorkModes;
          _preferredLocations = loadedLocations;
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
    await StorageService.clearAll();
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

  Widget _buildCoverWidget() {
    if (_coverLocalPath != null && File(_coverLocalPath!).existsSync()) {
      return Image.file(
        File(_coverLocalPath!),
        fit: BoxFit.cover,
        width: double.infinity,
        height: 210,
      );
    }
    if (_coverUrl != null && _coverUrl!.isNotEmpty) {
      if (_coverUrl!.startsWith('assets/')) {
        return Image.asset(
          _coverUrl!,
          fit: BoxFit.cover,
          width: double.infinity,
          height: 210,
        );
      }
      return Image.network(
        _coverUrl!,
        fit: BoxFit.cover,
        width: double.infinity,
        height: 210,
        errorBuilder: (context, error, stackTrace) => Image.asset(
          'assets/images/cover_default.png',
          fit: BoxFit.cover,
          width: double.infinity,
          height: 210,
        ),
      );
    }
    return Image.asset(
      'assets/images/cover_default.png',
      fit: BoxFit.cover,
      width: double.infinity,
      height: 210,
      errorBuilder: (context, error, stackTrace) => Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1E3A8A), Color(0xFF2563EB), Color(0xFF3B82F6)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
      ),
    );
  }

  Widget _buildCoverPresetItem(BuildContext ctx, String assetPath, String label) {
    return Expanded(
      child: GestureDetector(
        onTap: () async {
          Navigator.pop(ctx);
          setState(() {
            _coverUrl = assetPath;
            _coverLocalPath = null;
          });
          final user = await StorageService.getUser() ?? {};
          user['coverUrl'] = assetPath;
          user.remove('coverLocalPath');
          await StorageService.saveUser(user);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('$label cover applied!'),
                backgroundColor: const Color(0xFF10B981),
              ),
            );
          }
        },
        child: Column(
          children: [
            Container(
              height: 52,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _coverUrl == assetPath
                      ? AppColors.bluePrimary
                      : const Color(0xFFE2E8F0),
                  width: _coverUrl == assetPath ? 2.5 : 1,
                ),
                image: DecorationImage(
                  image: AssetImage(assetPath),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showCoverPickerSheet() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
              const SizedBox(height: 20),
              Text(
                'Background Cover Photo',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Upload a photo from your gallery or choose a preset background cover.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 20),

              // Option 1: Upload from Gallery
              InkWell(
                onTap: () async {
                  Navigator.pop(ctx);
                  try {
                    final res = await FilePicker.platform.pickFiles(type: FileType.image);
                    if (res != null && res.files.single.path != null) {
                      final path = res.files.single.path!;
                      setState(() {
                        _coverLocalPath = path;
                        _coverUrl = null;
                      });
                      final user = await StorageService.getUser() ?? {};
                      user['coverLocalPath'] = path;
                      user.remove('coverUrl');
                      await StorageService.saveUser(user);
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Background cover updated!'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      }
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to pick cover: $e')),
                      );
                    }
                  }
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFDBEAFE)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.bluePrimary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.add_photo_alternate_rounded,
                            color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Choose from Gallery / Photos',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 14.5,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textDark,
                              ),
                            ),
                            Text(
                              'Select any wallpaper or banner from device',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded,
                          size: 14, color: AppColors.bluePrimary),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Text(
                'Or Select a Curated Banner',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  _buildCoverPresetItem(ctx, 'assets/images/cover_default.png', 'Royal Blue'),
                  const SizedBox(width: 10),
                  _buildCoverPresetItem(ctx, 'assets/images/cover_tech.png', 'Tech Mesh'),
                  const SizedBox(width: 10),
                  _buildCoverPresetItem(ctx, 'assets/images/welcome_bg.jpg', 'Career Path'),
                ],
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentDomain = DomainConstants.getDomainById(_currentDomainId);
    final proofs = _storedProofs;
    final displayRoleTitle =
        _userRoleTitle.isNotEmpty ? _userRoleTitle : currentDomain.roleTitle;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: _loadData,
        color: AppColors.bluePrimary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
          children: [
            // 1. Premium Hero Header Banner with Background Cover Photo
            Stack(
              clipBehavior: Clip.none,
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 210,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      _buildCoverWidget(),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.black.withValues(alpha: 0.45),
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.5),
                            ],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ],
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
                                  Icons.sync_rounded,
                                  size: 20,
                                  color: AppColors.bluePrimary,
                                ),
                                tooltip: 'Sync Status',
                                onPressed: () async {
                                  await _loadData();
                                  if (!context.mounted) return;
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(_isActivated
                                          ? '✓ Candidate Verified & Active'
                                          : 'Profile synced with server'),
                                      duration: const Duration(seconds: 2),
                                      behavior: SnackBarBehavior.floating,
                                      shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(12)),
                                    ),
                                  );
                                },
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
                                  Icons.shield_outlined,
                                  size: 19,
                                  color: AppColors.bluePrimary,
                                ),
                                tooltip: 'Legal & Policies',
                                onPressed: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => const LegalPolicyScreen(),
                                    ),
                                  );
                                },
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

                // Change Cover Photo Pill Button
                Positioned(
                  bottom: 12,
                  right: 20,
                  child: GestureDetector(
                    onTap: _showCoverPickerSheet,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.2),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.camera_alt_outlined, color: Colors.white, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            'Edit Cover',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
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
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    _candidateFullName.isNotEmpty
                                        ? _candidateFullName
                                        : 'Candidate Profile',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                      color: AppColors.textDark,
                                      letterSpacing: -0.5,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                if (_isActivated) ...[
                                  const SizedBox(width: 6),
                                  const Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 20),
                                ],
                              ],
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

                  // 1. Profile Strength Engine (Completion % + Actionable Gamification Nudges)
                  _buildProfileStrengthCard(),
                  const SizedBox(height: 14),

                  // 2. Signature Talent Passport Showcase Card
                  _buildTalentPassportCard(displayRoleTitle),
                  const SizedBox(height: 16),

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
                        _buildStatBox(
                            title: 'Status',
                            value: _isActivated ? 'Verified' : 'Ready',
                            isVerified: _isActivated),
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
                  const SizedBox(height: 18),

                  // Legal, Trust & Policies Card
                  _buildLegalPoliciesCard(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }

  Widget _buildStatBox({required String title, required String value, bool isVerified = false}) {
    return Expanded(
      child: Column(
        children: [
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (isVerified) ...[
                const Icon(Icons.verified_rounded, size: 13, color: Color(0xFF10B981)),
                const SizedBox(width: 3),
              ],
              Text(
                value,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: isVerified ? const Color(0xFF10B981) : AppColors.textDark,
                ),
              ),
            ],
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
      children: proofs.asMap().entries.map((entry) {
        final index = entry.key;
        final proof = entry.value;
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
              // Header row: Badge + Edit button
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
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
                  const Spacer(),
                  // Edit button
                  GestureDetector(
                    onTap: () => _showEditProofModal(proof, index),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.cardBlue,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.edit_rounded, size: 14, color: AppColors.bluePrimary),
                    ),
                  ),
                ],
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
                    fontSize: 12, color: AppColors.textMuted, height: 1.4),
              ),
              if (proof.personalPortfolioUrl.isNotEmpty) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.link_rounded, size: 13, color: AppColors.bluePrimary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        proof.personalPortfolioUrl,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          color: AppColors.bluePrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        );
      }).toList(),
    );
  }

  void _showEditProofModal(ProofItem proof, int index) {
    final titleCtrl = TextEditingController(text: proof.title);
    final subtitleCtrl = TextEditingController(text: proof.subtitle);
    final urlCtrl = TextEditingController(text: proof.personalPortfolioUrl);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Edit Proof of Work',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 16),
              Text('Project Title *',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.textDark)),
              const SizedBox(height: 6),
              TextField(
                controller: titleCtrl,
                style: GoogleFonts.plusJakartaSans(fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'e.g. Meta Ads Campaign for Restaurant',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 12),
              Text('Description',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.textDark)),
              const SizedBox(height: 6),
              TextField(
                controller: subtitleCtrl,
                maxLines: 2,
                style: GoogleFonts.plusJakartaSans(fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'Brief description with measurable results',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 12),
              Text('Portfolio / Live URL',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.textDark)),
              const SizedBox(height: 6),
              TextField(
                controller: urlCtrl,
                style: GoogleFonts.plusJakartaSans(fontSize: 13),
                keyboardType: TextInputType.url,
                decoration: InputDecoration(
                  hintText: 'https://...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    final title = titleCtrl.text.trim();
                    if (title.isEmpty) return;

                    final updatedProof = ProofItem(
                      categoryBadge: proof.categoryBadge,
                      title: title,
                      subtitle: subtitleCtrl.text.trim().isNotEmpty
                          ? subtitleCtrl.text.trim()
                          : proof.subtitle,
                      metrics: proof.metrics,
                      personalPortfolioUrl: urlCtrl.text.trim(),
                      clientProjectUrl: proof.clientProjectUrl,
                      linkText: proof.linkText,
                      tags: proof.tags,
                      attachedFiles: proof.attachedFiles,
                      candidateName: proof.candidateName,
                      avatarUrl: proof.avatarUrl,
                      rating: proof.rating,
                      reviewCount: proof.reviewCount,
                    );

                    final updatedList = List<ProofItem>.from(_storedProofs);
                    updatedList[index] = updatedProof;

                    final jsonList = updatedList.map((p) => p.toJson()).toList();
                    await StorageService.saveStoredProofs(_currentDomainId, jsonList);

                    if (mounted) {
                      setState(() => _storedProofs = updatedList);
                      if (ctx.mounted) Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: const Color(0xFF10B981),
                          content: Text('✓ Proof updated successfully!',
                              style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.bluePrimary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: Text('Save Changes',
                      style: GoogleFonts.plusJakartaSans(
                          fontSize: 14, fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        ),
      ),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Upload Verified Resume / CV',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textDark,
                ),
              ),
              if (_resumeDocs.isNotEmpty)
                GestureDetector(
                  onTap: _saveResumeDocs,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: AppColors.bluePrimary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      'Save',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
            ],
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
            onFilesChanged: (files) {
              setState(() => _resumeDocs = files);
              // Auto-save after upload
              _saveResumeDocs();
            },
          ),
          if (_resumeDocs.isNotEmpty) ...[
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _saveResumeDocs,
                icon: const Icon(Icons.save_alt_rounded, size: 17),
                label: Text('Save Resume',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 13.5, fontWeight: FontWeight.w800)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.bluePrimary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDiscoveryPassCard() {
    if (_isActivated) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFECFDF5),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFA7F3D0)),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: const BoxDecoration(
                color: Color(0xFF10B981),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.verified_rounded,
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
                    'Verified Candidate Profile',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF065F46),
                    ),
                  ),
                  Text(
                    'Admin Verified • Direct HR Discovery Active',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      color: const Color(0xFF047857),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFD1FAE5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'ACTIVE',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF065F46),
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: Color(0xFFD97706),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.lock_outline_rounded,
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
                  'Unlock ₹299 Discovery Pass',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  'Get direct outreach from verified hiring managers',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
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

  Widget _buildLegalPoliciesCard() {
    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.shield_outlined,
                  size: 18,
                  color: AppColors.bluePrimary,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'Trust, Safety & Policies',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: AppColors.borderSubtle, height: 1),
          const SizedBox(height: 8),
          _buildPolicyRowItem(
            icon: Icons.lock_outline_rounded,
            title: 'Privacy Policy',
            subtitle: 'DPDP Act 2023 compliant data security',
            tab: LegalTab.privacy,
          ),
          _buildPolicyRowItem(
            icon: Icons.gavel_rounded,
            title: 'Terms of Service',
            subtitle: 'Rules for freshers and corporate recruiters',
            tab: LegalTab.terms,
          ),
          _buildPolicyRowItem(
            icon: Icons.currency_rupee_rounded,
            title: 'Refund & Cancellation',
            subtitle: '₹99 verification fee & refund criteria',
            tab: LegalTab.refund,
          ),
          _buildPolicyRowItem(
            icon: Icons.support_agent_rounded,
            title: 'Contact & Grievance',
            subtitle: 'Email & WhatsApp helpline assistance',
            tab: LegalTab.contact,
          ),
        ],
      ),
    );
  }

  Widget _buildPolicyRowItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required LegalTab tab,
  }) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => LegalPolicyScreen(initialTab: tab),
          ),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: Row(
          children: [
            Icon(icon, size: 18, color: AppColors.textMuted),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textDark,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              size: 18,
              color: AppColors.textMuted,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileStrengthCard() {
    final score = _calculateProfileStrength();
    final Color scoreColor = score >= 80
        ? const Color(0xFF10B981)
        : score >= 50
            ? const Color(0xFF2563EB)
            : const Color(0xFFF59E0B);

    // Dynamic actionable nudge
    String nudgeText = '';
    String nudgePoints = '';
    VoidCallback? onNudgeTap;

    if (_storedProofs.isEmpty) {
      nudgeText = 'Add your first project to Proof of Work';
      nudgePoints = '+15%';
      onNudgeTap = () => setState(() => _activeTabIndex = 1);
    } else if (_resumeDocs.isEmpty) {
      nudgeText = 'Upload your CV / Resume document';
      nudgePoints = '+10%';
      onNudgeTap = () => setState(() => _activeTabIndex = 3);
    } else if (_lookingFor.isEmpty || _workModes.isEmpty) {
      nudgeText = 'Set your job opportunities preferences';
      nudgePoints = '+10%';
      onNudgeTap = _showOpenToOpportunitiesSheet;
    } else if (_avatarUrl == null && _avatarLocalPath == null) {
      nudgeText = 'Add a clear profile photo';
      nudgePoints = '+10%';
      onNudgeTap = _navigateToEditProfile;
    } else if (_skills.length < 5) {
      nudgeText = 'Add 5+ verified industry skills';
      nudgePoints = '+10%';
      onNudgeTap = _navigateToEditProfile;
    } else {
      nudgeText = 'Profile 100% complete! Recruiter ready.';
      nudgePoints = '★';
      onNudgeTap = _openPassportUrl;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
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
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: scoreColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.bolt_rounded, color: scoreColor, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Profile Strength',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textDark,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: scoreColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$score%',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: scoreColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Container(
              height: 7,
              width: double.infinity,
              color: const Color(0xFFF1F5F9),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: (score / 100.0).clamp(0.05, 1.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: scoreColor,
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Dynamic Smart Nudge Pill
          InkWell(
            onTap: onNudgeTap,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Icon(Icons.add_circle_outline_rounded, size: 16, color: scoreColor),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      nudgeText,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF334155),
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: scoreColor.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      nudgePoints,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: scoreColor,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF94A3B8)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTalentPassportCard(String displayRoleTitle) {
    final candidateName = _candidateFullName.trim().isNotEmpty ? _candidateFullName : 'Candidate Name';
    final proofsCount = _storedProofs.length.toString().padLeft(2, '0');
    final skillsCount = _skills.length.toString().padLeft(2, '0');
    final resumeCount = _resumeDocs.length.toString().padLeft(2, '0');

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF334155)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.25),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Passport Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFBBF24).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.stars_rounded, color: Color(0xFFFBBF24), size: 16),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'FRESHERTOWORK TALENT PASSPORT',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.1,
                        color: const Color(0xFF94A3B8),
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 11),
                      const SizedBox(width: 4),
                      Text(
                        'OFFICIAL',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF34D399),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: Color(0xFF334155)),

          // Identity Section
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  candidateName,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  displayRoleTitle,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF38BDF8),
                  ),
                ),
                const SizedBox(height: 10),

                // Skill Badges
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: _skills.take(4).map((sk) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF475569)),
                      ),
                      child: Text(
                        sk,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFE2E8F0),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),

                // 3 Metrics Counter Boxes
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildPassportMetric('PROJECTS', proofsCount),
                      Container(width: 1, height: 26, color: const Color(0xFF334155)),
                      _buildPassportMetric('SKILLS', skillsCount),
                      Container(width: 1, height: 26, color: const Color(0xFF334155)),
                      _buildPassportMetric('DOCS/CV', resumeCount),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Open to info row
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.explore_outlined, color: Color(0xFF38BDF8), size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Open to: ${_lookingFor.join(" • ")}',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Modes: ${_workModes.join(", ")} | ${_preferredLocations.join(", ")}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                color: const Color(0xFF94A3B8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: _showOpenToOpportunitiesSheet,
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Text(
                          'Edit',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF38BDF8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Public URL Copy / Preview Bar
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF020617),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.link_rounded, color: Color(0xFF64748B), size: 14),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          _talentPassportUrl,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            color: const Color(0xFF38BDF8),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: _copyPassportLink,
                        icon: const Icon(Icons.copy_rounded, color: Color(0xFF94A3B8), size: 15),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        tooltip: 'Copy Passport Link',
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        onPressed: _openPassportUrl,
                        icon: const Icon(Icons.open_in_new_rounded, color: Color(0xFF94A3B8), size: 15),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        tooltip: 'Open in Browser',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // 1-Click WhatsApp Share Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _shareTalentPassport,
                    icon: const Icon(Icons.share_rounded, size: 16),
                    label: Text(
                      'Share Talent Passport on WhatsApp',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPassportMetric(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 1),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 9.5,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF94A3B8),
            letterSpacing: 0.8,
          ),
        ),
      ],
    );
  }

  void _showOpenToOpportunitiesSheet() {
    List<String> tempLookingFor = List.from(_lookingFor);
    List<String> tempWorkModes = List.from(_workModes);
    List<String> tempLocations = List.from(_preferredLocations);

    const allLookingFor = ['Full-time', 'Internship', 'Freelance', 'Part-time'];
    const allWorkModes = ['Remote', 'Hybrid', 'On-site'];
    const allLocations = [
      'Kochi',
      'Kozhikode',
      'Bangalore',
      'Trivandrum',
      'Chennai',
      'Hyderabad',
      'Remote / Anywhere'
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              padding: EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 44,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEFF6FF),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.work_outline_rounded,
                                  color: AppColors.bluePrimary, size: 20),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'Open to Opportunities',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textDark,
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close_rounded,
                              size: 20, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                    Text(
                      'Tell recruiters your job preferences. These are highlighted on your Talent Passport.',
                      style: GoogleFonts.plusJakartaSans(
                          fontSize: 12, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 18),

                    // Section 1: Looking For
                    Text(
                      'LOOKING FOR',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: allLookingFor.map((item) {
                        final isSelected = tempLookingFor.contains(item);
                        return FilterChip(
                          label: Text(item),
                          selected: isSelected,
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                tempLookingFor.add(item);
                              } else {
                                tempLookingFor.remove(item);
                              }
                            });
                          },
                          selectedColor: const Color(0xFFDBEAFE),
                          checkmarkColor: AppColors.bluePrimary,
                          labelStyle: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? AppColors.bluePrimary : AppColors.textDark,
                          ),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected ? AppColors.bluePrimary : Colors.transparent,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 18),

                    // Section 2: Work Mode
                    Text(
                      'WORK MODE',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: allWorkModes.map((item) {
                        final isSelected = tempWorkModes.contains(item);
                        return FilterChip(
                          label: Text(item),
                          selected: isSelected,
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                tempWorkModes.add(item);
                              } else {
                                tempWorkModes.remove(item);
                              }
                            });
                          },
                          selectedColor: const Color(0xFFDCFCE7),
                          checkmarkColor: const Color(0xFF10B981),
                          labelStyle: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? const Color(0xFF065F46) : AppColors.textDark,
                          ),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected ? const Color(0xFF10B981) : Colors.transparent,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 18),

                    // Section 3: Preferred Locations
                    Text(
                      'PREFERRED LOCATIONS',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: allLocations.map((item) {
                        final isSelected = tempLocations.contains(item);
                        return FilterChip(
                          label: Text(item),
                          selected: isSelected,
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                tempLocations.add(item);
                              } else {
                                tempLocations.remove(item);
                              }
                            });
                          },
                          selectedColor: const Color(0xFFFEF3C7),
                          checkmarkColor: const Color(0xFFD97706),
                          labelStyle: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? const Color(0xFF92400E) : AppColors.textDark,
                          ),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected ? const Color(0xFFD97706) : Colors.transparent,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),

                    // Save Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          if (tempLookingFor.isEmpty) tempLookingFor = ['Full-time'];
                          if (tempWorkModes.isEmpty) tempWorkModes = ['Remote'];

                          setState(() {
                            _lookingFor = tempLookingFor;
                            _workModes = tempWorkModes;
                            _preferredLocations = tempLocations;
                          });
                          final messenger = ScaffoldMessenger.of(context);
                          Navigator.pop(context);

                          // Save to local cache
                          final user = await StorageService.getUser() ?? {};
                          user['lookingFor'] = tempLookingFor;
                          user['workModes'] = tempWorkModes;
                          user['preferredLocations'] = tempLocations;
                          await StorageService.saveUser(user);

                          // Sync to backend
                          ApiService.updateStudentProfile({
                            'lookingFor': tempLookingFor,
                            'workModes': tempWorkModes,
                            'preferredLocations': tempLocations,
                          }).catchError((_) => <String, dynamic>{});

                          if (mounted) {
                            messenger.showSnackBar(
                              SnackBar(
                                backgroundColor: const Color(0xFF10B981),
                                content: Text('✓ Opportunities updated successfully!',
                                    style: GoogleFonts.plusJakartaSans(
                                        fontWeight: FontWeight.w700)),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.bluePrimary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: Text(
                          'Save Preferences',
                          style: GoogleFonts.plusJakartaSans(
                              fontSize: 14, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

