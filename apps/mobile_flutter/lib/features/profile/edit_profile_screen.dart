import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _headlineController = TextEditingController();
  final _aboutController = TextEditingController();
  final _phoneController = TextEditingController();
  final _portfolioController = TextEditingController();
  final _skillInputController = TextEditingController();

  String _selectedDomain = 'digital_marketing';
  List<String> _skills = [];
  String? _avatarUrl;
  String? _avatarLocalPath;
  bool _isLoading = true;
  bool _isSaving = false;

  final List<String> _presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Aneka&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Zack&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Sara&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Leo&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Aria&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/bottts/png?seed=Sparky&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/bottts/png?seed=Cyber&backgroundColor=ffdfbf',
  ];

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _headlineController.dispose();
    _aboutController.dispose();
    _phoneController.dispose();
    _portfolioController.dispose();
    _skillInputController.dispose();
    super.dispose();
  }

  Future<void> _loadProfileData() async {
    final domain = await StorageService.getSelectedDomain();
    final user = await StorageService.getUser() ?? {};

    _selectedDomain = domain;
    _nameController.text = (user['fullName'] as String?) ?? '';
    _headlineController.text = (user['roleTitle'] as String?) ??
        (user['headline'] as String?) ??
        (user['niche'] as String?) ??
        '';
    _aboutController.text = (user['about'] as String?) ?? '';
    _phoneController.text = (user['phone'] as String?) ?? '';
    _portfolioController.text = (user['portfolioUrl'] as String?) ?? '';
    _avatarUrl = user['avatarUrl'] as String?;
    _avatarLocalPath = user['avatarLocalPath'] as String?;

    final savedSkills = user['skills'];
    if (savedSkills is List) {
      _skills = savedSkills.map((s) => s.toString()).toList();
    } else {
      final domainObj = DomainConstants.getDomainById(domain);
      _skills = List.from(domainObj.skills);
    }

    // Try fetching freshest remote profile
    try {
      final remote = await ApiService.getStudentProfile();
      if (remote['student'] != null) {
        final st = remote['student'];
        if (_nameController.text.isEmpty && st['fullName'] != null) {
          _nameController.text = st['fullName'];
        }
        if (_headlineController.text.isEmpty && st['headline'] != null) {
          _headlineController.text = st['headline'];
        }
        if (_aboutController.text.isEmpty && st['about'] != null) {
          _aboutController.text = st['about'];
        }
        if (_phoneController.text.isEmpty && st['phone'] != null) {
          _phoneController.text = st['phone'];
        }
        if (_portfolioController.text.isEmpty && st['portfolioUrl'] != null) {
          _portfolioController.text = st['portfolioUrl'];
        }
        if (_avatarUrl == null && st['avatarUrl'] != null) {
          _avatarUrl = st['avatarUrl'];
        }
      }
    } catch (_) {}

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _pickImageFromGallery() async {
    Navigator.pop(context); // Close bottom sheet
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.image,
        allowMultiple: false,
      );

      if (result != null && result.files.single.path != null) {
        setState(() {
          _avatarLocalPath = result.files.single.path;
          _avatarUrl = null;
        });
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to pick image: $e')),
      );
    }
  }

  void _choosePresetAvatar(String url) {
    Navigator.pop(context);
    setState(() {
      _avatarUrl = url;
      _avatarLocalPath = null;
    });
  }

  void _showAvatarPickerSheet() {
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
                'Profile Picture',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Upload a photo from your gallery or choose a verified candidate avatar.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 20),

              // Action 1: Upload from Gallery
              InkWell(
                onTap: _pickImageFromGallery,
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
                        child: const Icon(Icons.photo_library_rounded, color: Colors.white, size: 20),
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
                              'Select a clear portrait photo from device',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.bluePrimary),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Text(
                'Or Select an Avatar',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 12),

              // Avatar Grid
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: _presetAvatars.map((url) {
                  return GestureDetector(
                    onTap: () => _choosePresetAvatar(url),
                    child: Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: _avatarUrl == url ? AppColors.bluePrimary : const Color(0xFFE2E8F0),
                          width: _avatarUrl == url ? 3 : 1.5,
                        ),
                      ),
                      child: ClipOval(
                        child: Image.network(
                          url,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Icon(Icons.person, color: AppColors.textMuted),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  void _addSkill() {
    final skill = _skillInputController.text.trim();
    if (skill.isNotEmpty && !_skills.contains(skill)) {
      setState(() {
        _skills.add(skill);
        _skillInputController.clear();
      });
    }
  }

  void _removeSkill(String skill) {
    setState(() {
      _skills.remove(skill);
    });
  }

  Future<void> _handleSaveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    final fullName = _nameController.text.trim();
    final headline = _headlineController.text.trim();
    final about = _aboutController.text.trim();
    final phone = _phoneController.text.trim();
    final portfolioUrl = _portfolioController.text.trim();

    try {
      // 1. Update local storage
      await StorageService.setSelectedDomain(_selectedDomain);
      final user = await StorageService.getUser() ?? {};
      user['fullName'] = fullName;
      user['roleTitle'] = headline;
      user['headline'] = headline;
      user['niche'] = headline;
      user['about'] = about;
      user['phone'] = phone;
      user['portfolioUrl'] = portfolioUrl;
      user['skills'] = _skills;
      if (_avatarLocalPath != null) {
        user['avatarLocalPath'] = _avatarLocalPath;
      }
      if (_avatarUrl != null) {
        user['avatarUrl'] = _avatarUrl;
      }
      await StorageService.saveUser(user);

      // 2. Update remote API
      try {
        await ApiService.updateStudentProfile({
          'fullName': fullName,
          'headline': headline,
          'about': about,
          'phone': phone,
          'portfolioUrl': portfolioUrl,
          if (_avatarUrl != null) 'avatarUrl': _avatarUrl,
        });

        if (_skills.isNotEmpty) {
          await ApiService.updateSkills(
            _skills.map((s) => {'skillName': s, 'proficiencyLevel': 'INTERMEDIATE'}).toList(),
          );
        }
      } catch (_) {}

      setState(() => _isSaving = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Profile updated successfully!',
                  style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      setState(() => _isSaving = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save profile: $e')),
        );
      }
    }
  }

  Widget _buildAvatarWidget() {
    if (_avatarLocalPath != null && File(_avatarLocalPath!).existsSync()) {
      return Image.file(
        File(_avatarLocalPath!),
        fit: BoxFit.cover,
        width: 96,
        height: 96,
      );
    }
    if (_avatarUrl != null && _avatarUrl!.isNotEmpty) {
      return Image.network(
        _avatarUrl!,
        fit: BoxFit.cover,
        width: 96,
        height: 96,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.person, size: 48, color: AppColors.bluePrimary),
      );
    }
    return const Icon(Icons.person_rounded, size: 48, color: AppColors.bluePrimary);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.bluePrimary),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Edit Profile',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: AppColors.textDark,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Avatar Card with Edit Badge
              Center(
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: _showAvatarPickerSheet,
                      child: Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFEFF6FF),
                              border: Border.all(color: const Color(0xFFDBEAFE), width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.06),
                                  blurRadius: 14,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ClipOval(child: _buildAvatarWidget()),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: AppColors.bluePrimary,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: const Icon(
                                Icons.camera_alt_rounded,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextButton(
                      onPressed: _showAvatarPickerSheet,
                      child: Text(
                        'Change Profile Photo',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.bluePrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Section: Personal Information
              _buildSectionHeader('Candidate Information'),
              const SizedBox(height: 12),

              _buildCardContainer(
                children: [
                  _buildInputField(
                    label: 'Full Name',
                    controller: _nameController,
                    hint: 'e.g. Arjun P',
                    icon: Icons.person_outline_rounded,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your full name' : null,
                  ),
                  const SizedBox(height: 16),
                  _buildInputField(
                    label: 'Specialist Role / Headline',
                    controller: _headlineController,
                    hint: 'e.g. Performance Marketing Specialist',
                    icon: Icons.work_outline_rounded,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your specialist title' : null,
                  ),
                  const SizedBox(height: 16),
                  _buildDropdownField(),
                  const SizedBox(height: 16),
                  _buildInputField(
                    label: 'WhatsApp / Phone Number',
                    controller: _phoneController,
                    hint: 'e.g. +91 9876543210',
                    icon: Icons.phone_outlined,
                    keyboardType: TextInputType.phone,
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Section: About & Portfolio
              _buildSectionHeader('About & Portfolio Proofs'),
              const SizedBox(height: 12),

              _buildCardContainer(
                children: [
                  _buildInputField(
                    label: 'About Candidate (Bio)',
                    controller: _aboutController,
                    hint: 'Brief summary of your hands-on project experience, tools known, and availability...',
                    icon: Icons.description_outlined,
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),
                  _buildInputField(
                    label: 'Portfolio / Proof Link (URL)',
                    controller: _portfolioController,
                    hint: 'e.g. https://behance.net/myworks or GitHub/Drive',
                    icon: Icons.link_rounded,
                    keyboardType: TextInputType.url,
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Section: Skills
              _buildSectionHeader('Verified Skills & Tools'),
              const SizedBox(height: 12),

              _buildCardContainer(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _skillInputController,
                          onSubmitted: (_) => _addSkill(),
                          decoration: InputDecoration(
                            hintText: 'Add a skill (e.g. Meta Ads, Python)',
                            hintStyle: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              color: const Color(0xFF94A3B8),
                            ),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: _addSkill,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.bluePrimary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Add'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  if (_skills.isEmpty)
                    Text(
                      'No skills added yet. Type and click Add.',
                      style: GoogleFonts.plusJakartaSans(fontSize: 12.5, color: AppColors.textMuted),
                    )
                  else
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _skills.map((skill) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFDBEAFE)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                skill,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.bluePrimary,
                                ),
                              ),
                              const SizedBox(width: 4),
                              GestureDetector(
                                onTap: () => _removeSkill(skill),
                                child: const Icon(
                                  Icons.close_rounded,
                                  size: 14,
                                  color: AppColors.bluePrimary,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                ],
              ),
              const SizedBox(height: 32),

              // Save Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _handleSaveProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.bluePrimary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : Text(
                          'Save Profile Changes',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: GoogleFonts.plusJakartaSans(
        fontSize: 15,
        fontWeight: FontWeight.w800,
        color: AppColors.textDark,
      ),
    );
  }

  Widget _buildCardContainer({required List<Widget> children}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
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
        children: children,
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF334155),
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          validator: validator,
          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.plusJakartaSans(fontSize: 13, color: const Color(0xFF94A3B8)),
            prefixIcon: Icon(icon, size: 19, color: const Color(0xFF64748B)),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Target Industry / Domain',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF334155),
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _selectedDomain,
              isExpanded: true,
              icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF64748B)),
              items: DomainConstants.domains.map((d) {
                return DropdownMenuItem(
                  value: d.id,
                  child: Text(
                    d.title,
                    style: GoogleFonts.plusJakartaSans(fontSize: 13.5, color: AppColors.textDark),
                  ),
                );
              }).toList(),
              onChanged: (newVal) {
                if (newVal != null) {
                  setState(() => _selectedDomain = newVal);
                }
              },
            ),
          ),
        ),
      ],
    );
  }
}
