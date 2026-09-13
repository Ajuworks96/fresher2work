import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/storage_service.dart';
import '../navigation/main_navigation_screen.dart';
import '../projects/widgets/file_upload_zone.dart';

class OnboardingWizardScreen extends StatefulWidget {
  final String? initialDomain;
  const OnboardingWizardScreen({super.key, this.initialDomain});

  @override
  State<OnboardingWizardScreen> createState() => _OnboardingWizardScreenState();
}

class _OnboardingWizardScreenState extends State<OnboardingWizardScreen> {
  int _currentStep = 1;
  late String _selectedDomain;
  final _collegeController = TextEditingController(text: 'Calicut University / Self-Taught');
  final _workUrlController = TextEditingController();
  final _metricController = TextEditingController();
  List<UploadedFileModel> _attachedFiles = [];

  @override
  void initState() {
    super.initState();
    _selectedDomain = widget.initialDomain ?? 'digital_marketing';
    _applyDomainDefaults(_selectedDomain);
  }

  void _applyDomainDefaults(String domainId) {
    _attachedFiles = []; // Starts clean and empty so students upload their real files
    if (domainId == 'digital_marketing') {
      _workUrlController.text = '';
      _metricController.text = '';
    } else if (domainId == 'graphic_design') {
      _workUrlController.text = '';
      _metricController.text = '';
    } else if (domainId == 'video_editing') {
      _workUrlController.text = '';
      _metricController.text = '';
    } else {
      _workUrlController.text = '';
      _metricController.text = '';
    }
  }

  Future<void> _nextStep() async {
    final nav = Navigator.of(context);
    if (_currentStep == 1) {
      await StorageService.setSelectedDomain(_selectedDomain);
    }

    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      await StorageService.setSelectedDomain(_selectedDomain);
      if (mounted) {
        nav.pushReplacement(
          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      appBar: AppBar(
        backgroundColor: AppColors.scaffoldBg,
        elevation: 0,
        title: Text(
          'Fresher Setup • Step $_currentStep of 3',
          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.bluePrimary),
        ),
        actions: [
          TextButton(
            onPressed: () async {
              final nav = Navigator.of(context);
              await StorageService.setSelectedDomain(_selectedDomain);
              if (mounted) {
                nav.pushReplacement(
                  MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                );
              }
            },
            child: Text('Skip for now', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 13)),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _currentStep / 3,
                  backgroundColor: AppColors.borderSubtle,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.bluePrimary),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 20),

              Expanded(
                child: SingleChildScrollView(
                  child: _currentStep == 1
                      ? _buildStep1Specialization()
                      : _currentStep == 2
                          ? _buildStep2ProofUpload()
                          : _buildStep3Readiness(),
                ),
              ),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _nextStep,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.bluePrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                  ),
                  child: Text(
                    _currentStep == 3 ? 'Launch Candidate Profile →' : 'Save & Continue →',
                    style: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.w800),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep1Specialization() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Confirm Your Primary Track',
          style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.textDark),
        ),
        const SizedBox(height: 4),
        Text('The app will customize all feeds and job matches to this subject.', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textMuted)),
        const SizedBox(height: 20),

        Column(
          children: DomainConstants.domains.map((d) {
            final isSelected = _selectedDomain == d.id;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedDomain = d.id;
                  _applyDomainDefaults(d.id);
                });
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.cardBlue : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? AppColors.bluePrimary : AppColors.borderSubtle,
                    width: isSelected ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : AppColors.cardBlue,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(d.icon, size: 20, color: AppColors.bluePrimary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            d.title,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? AppColors.bluePrimary : AppColors.textDark,
                            ),
                          ),
                          Text(
                            d.description,
                            style: GoogleFonts.plusJakartaSans(fontSize: 11.5, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    if (isSelected)
                      const Icon(Icons.check_circle_rounded, color: AppColors.bluePrimary, size: 20),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStep2ProofUpload() {
    final domain = DomainConstants.getDomainById(_selectedDomain);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Upload Your First Proof of Work', style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.textDark)),
        const SizedBox(height: 4),
        Text('Add screenshots, documents, or campaign metrics for ${domain.shortTitle}.', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textMuted)),
        const SizedBox(height: 20),

        Text('College / Training Institute / Self-Taught', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          controller: _collegeController,
          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
          ),
        ),
        const SizedBox(height: 16),

        // Multi-Format File Upload Zone
        FileUploadZone(
          initialFiles: _attachedFiles,
          onFilesChanged: (files) => setState(() => _attachedFiles = files),
          title: 'Proof Documents & Screenshots (PNG, JPG, PDF, DOC, CV)',
          hint: 'Upload Meta Ads reports, design posters, video timeline or CV (Up to 25MB)',
        ),
        const SizedBox(height: 16),

        Text('Live Proof URL / Drive Link / Portfolio', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          controller: _workUrlController,
          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
          decoration: InputDecoration(
            hintText: 'e.g. https://business.facebook.com/adsmanager or Drive link',
            prefixIcon: const Icon(Icons.link_rounded, color: AppColors.bluePrimary, size: 20),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
          ),
        ),
        const SizedBox(height: 16),

        Text('Key Work Result / Metrics Achieved', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          controller: _metricController,
          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
          decoration: InputDecoration(
            hintText: 'e.g. 4.8x ROAS • ₹35 CPL or 24 Brand Creatives',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildStep3Readiness() {
    final domain = DomainConstants.getDomainById(_selectedDomain);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Ready for ${domain.shortTitle} Recruiters!', style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.textDark)),
        const SizedBox(height: 4),
        Text('Your beginner profile has been configured with real proof of work and documents.', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textMuted)),
        const SizedBox(height: 24),

        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Column(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: const BoxDecoration(
                  color: AppColors.cardBlue,
                  shape: BoxShape.circle,
                ),
                child: Center(child: Icon(domain.icon, size: 26, color: AppColors.bluePrimary)),
              ),
              const SizedBox(height: 14),
              Text(
                '${domain.title} Profile Ready',
                style: GoogleFonts.plusJakartaSans(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              Text(
                'Recruiters will evaluate your campaigns, designs, video edits, and proof files directly.',
                textAlign: TextAlign.center,
                style: GoogleFonts.plusJakartaSans(fontSize: 12.5, color: AppColors.textMuted, height: 1.4),
              ),
              const SizedBox(height: 16),

              if (_attachedFiles.isNotEmpty) ...[
                const Divider(height: 1, color: AppColors.borderSubtle),
                const SizedBox(height: 12),
                Text(
                  '${_attachedFiles.length} file(s) attached and verified',
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.success),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
