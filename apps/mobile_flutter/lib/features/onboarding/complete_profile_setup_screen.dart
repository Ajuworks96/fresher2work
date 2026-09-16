import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../activation/activation_screen.dart';
import '../navigation/main_navigation_screen.dart';
import '../projects/widgets/file_upload_zone.dart';

class CompleteProfileSetupScreen extends StatefulWidget {
  final String initialDomain;
  const CompleteProfileSetupScreen({super.key, required this.initialDomain});

  @override
  State<CompleteProfileSetupScreen> createState() => _CompleteProfileSetupScreenState();
}

class _CompleteProfileSetupScreenState extends State<CompleteProfileSetupScreen> {
  late String _selectedDomain;
  late String _selectedNiche;
  final _roleTitleController = TextEditingController();
  final _portfolioUrlController = TextEditingController();
  final _collegeController = TextEditingController();
  final _customSkillController = TextEditingController();

  List<String> _selectedSkills = [];
  List<UploadedFileModel> _attachedCv = [];
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _selectedDomain = widget.initialDomain;
    _roleTitleController.text = '';
    _selectedNiche = '';
    _selectedSkills = [];
  }

  @override
  void dispose() {
    _roleTitleController.dispose();
    _portfolioUrlController.dispose();
    _collegeController.dispose();
    _customSkillController.dispose();
    super.dispose();
  }

  void _addCustomSkill() {
    final skill = _customSkillController.text.trim();
    if (skill.isNotEmpty && !_selectedSkills.contains(skill)) {
      setState(() {
        _selectedSkills.add(skill);
        _customSkillController.clear();
      });
    }
  }

  void _toggleSkill(String skill) {
    setState(() {
      if (_selectedSkills.contains(skill)) {
        _selectedSkills.remove(skill);
      } else {
        _selectedSkills.add(skill);
      }
    });
  }

  Future<void> _handleSaveAndProceed() async {
    final roleTitle = _roleTitleController.text.trim();
    if (roleTitle.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your Specialist Role Title / Niche')),
      );
      return;
    }

    if (_selectedNiche.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your primary subject category')),
      );
      return;
    }

    final portfolio = _portfolioUrlController.text.trim();
    if (portfolio.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your personal portfolio or work link')),
      );
      return;
    }

    if (_selectedSkills.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select or add at least 1 core skill')),
      );
      return;
    }

    setState(() => _saving = true);

    try {
      // 1. Persist Profile details to Express API -> Prisma -> Supabase PostgreSQL
      await ApiService.updateStudentProfile({
        'headline': roleTitle,
        'portfolioUrl': portfolio,
        'about': 'Specialized in $_selectedNiche',
      });

      // 2. Persist Skills
      await ApiService.updateSkills(
        _selectedSkills.map((s) => {'skillName': s, 'proficiencyLevel': 'BEGINNER'}).toList(),
      );

      // 3. Update local session cache
      await StorageService.setSelectedDomain(_selectedDomain);
      final user = await StorageService.getUser() ?? {};
      user['portfolioUrl'] = portfolio;
      user['niche'] = _selectedNiche;
      user['roleTitle'] = roleTitle;
      user['college'] = _collegeController.text.trim();
      user['skills'] = _selectedSkills;
      await StorageService.saveUser(user);

      setState(() => _saving = false);

      final isAct = await StorageService.isActivated();
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => isAct ? const MainNavigationScreen() : const ActivationScreen(),
          ),
        );
      }
    } catch (err) {
      setState(() => _saving = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.redAccent,
            content: Text(err.toString()),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final domain = DomainConstants.getDomainById(_selectedDomain);

    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.scaffoldBg,
        appBar: AppBar(
          backgroundColor: AppColors.scaffoldBg,
          elevation: 0,
          automaticallyImplyLeading: false,
          title: Text(
            'Profile & Career Setup',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: AppColors.textDark,
            ),
          ),
        ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header title
              Text(
                'Personal Interests & Work Setup',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Customize your ${domain.shortTitle} niche, portfolio links, and CV for direct recruiter discovery.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  color: AppColors.textMuted,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 22),

              // 1. Candidate Specialization Role Title / Strong Niche
              Text('Specialist Role Title / Strong Niche *', style: _labelStyle),
              const SizedBox(height: 6),
              TextField(
                controller: _roleTitleController,
                style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark, fontWeight: FontWeight.w700),
                decoration: InputDecoration(
                  hintText: 'e.g. Performance Marketing Specialist, Meta Ads Manager, SEO Analyst',
                  prefixIcon: const Icon(Icons.workspace_premium_outlined, color: AppColors.bluePrimary, size: 20),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                ),
              ),
              const SizedBox(height: 20),

              // 2. Main Niche / Specialization
              Text('Primary Subject Category *', style: _labelStyle),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: domain.subjectPills.where((p) => p != 'All').map((pill) {
                  final isSelected = _selectedNiche == pill;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedNiche = pill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.bluePrimary : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? AppColors.bluePrimary : AppColors.borderSubtle,
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color: AppColors.bluePrimary.withValues(alpha: 0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : [],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (isSelected) ...[
                            const Icon(Icons.check_circle_rounded, size: 14, color: Colors.white),
                            const SizedBox(width: 6),
                          ],
                          Text(
                            pill,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? Colors.white : AppColors.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // 3. Personal Portfolio Website (Must)
              Text('Personal Portfolio / Profile Link (Must) *', style: _labelStyle),
              const SizedBox(height: 6),
              TextField(
                controller: _portfolioUrlController,
                style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
                decoration: InputDecoration(
                  hintText: 'https://yourname.marketing or Behance / GitHub',
                  prefixIcon: const Icon(Icons.language_rounded, color: AppColors.bluePrimary, size: 20),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                ),
              ),
              const SizedBox(height: 20),

              // 4. CV / Resume Upload
              FileUploadZone(
                initialFiles: _attachedCv,
                onFilesChanged: (files) => setState(() => _attachedCv = files),
                title: 'Upload Your Resume / CV (PDF) *',
                hint: 'HRs download and review your verified CV directly',
                isResumeMode: true,
              ),
              const SizedBox(height: 20),

              // 5. Skills Known (Select and Add Custom)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Core Skills & Tools Known *', style: _labelStyle),
                  Text('${_selectedSkills.length} selected', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.bluePrimary)),
                ],
              ),
              const SizedBox(height: 8),

              // A. Selected Skills Badges (Shows everything user selected OR custom typed)
              if (_selectedSkills.isNotEmpty) ...[
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: _selectedSkills.map((s) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.bluePrimary,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            s,
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                          const SizedBox(width: 6),
                          GestureDetector(
                            onTap: () => _toggleSkill(s),
                            child: const Icon(Icons.cancel_rounded, size: 15, color: Colors.white),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
              ],

              // B. Add Custom Skill Input
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _customSkillController,
                      style: GoogleFonts.plusJakartaSans(fontSize: 13.5, color: AppColors.textDark, fontWeight: FontWeight.w700),
                      decoration: InputDecoration(
                        hintText: 'Type your custom skill (e.g. Meta Ads, GTM)...',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                      onSubmitted: (_) => _addCustomSkill(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _addCustomSkill,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.bluePrimary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.add_rounded, size: 18),
                        const SizedBox(width: 4),
                        Text('Add', style: GoogleFonts.plusJakartaSans(fontSize: 12.5, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // C. Quick Suggested Domain Skills (Unselected)
              Text('Or tap to add suggested ${domain.shortTitle} skills:', style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              const SizedBox(height: 6),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: domain.skills.where((s) => !_selectedSkills.contains(s)).map((s) {
                  return GestureDetector(
                    onTap: () => _toggleSkill(s),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.add_circle_outline_rounded, size: 14, color: AppColors.bluePrimary),
                          const SizedBox(width: 5),
                          Text(
                            s,
                            style: GoogleFonts.plusJakartaSans(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textDark),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // 6. College / Institute
              Text('College / Training Institute / Self-Taught', style: _labelStyle),
              const SizedBox(height: 6),
              TextField(
                controller: _collegeController,
                style: GoogleFonts.plusJakartaSans(fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. Calicut University, Self-Taught, or Training Institute',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                ),
              ),
              const SizedBox(height: 32),

              // Save & Proceed to Activation
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _saving ? null : _handleSaveAndProceed,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.bluePrimary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                  ),
                  child: _saving
                      ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Save & Proceed to Discovery Pass',
                              style: GoogleFonts.plusJakartaSans(fontSize: 14.5, fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
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

  TextStyle get _labelStyle => GoogleFonts.plusJakartaSans(
        fontSize: 12.5,
        fontWeight: FontWeight.w800,
        color: AppColors.textDark,
      );
}
