import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import 'widgets/file_upload_zone.dart';

class ProofOfWorkScreen extends StatefulWidget {
  const ProofOfWorkScreen({super.key});

  @override
  State<ProofOfWorkScreen> createState() => _ProofOfWorkScreenState();
}

class _ProofOfWorkScreenState extends State<ProofOfWorkScreen> {
  String _selectedCategory = 'digital_marketing';
  String _selectedSubFilter = 'All';
  List<ProofItem> _activeProofs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProofs();
  }

  Future<void> _loadProofs() async {
    final domain = await StorageService.getSelectedDomain();
    final currentDomain = DomainConstants.getDomainById(domain);

    try {
      final profile = await ApiService.getStudentProfile();
      final projectsList = (profile['projects'] as List?) ?? [];

      if (projectsList.isNotEmpty) {
        _activeProofs = projectsList.map((proj) {
          final title = proj['title'] as String? ?? 'Verified Project';
          final desc = proj['description'] as String? ?? '';
          final tech = (proj['techStack'] as List?)?.cast<String>() ?? [currentDomain.shortTitle];
          final link = proj['projectLink'] as String? ?? '';

          return ProofItem(
            categoryBadge: tech.isNotEmpty ? tech.first : currentDomain.shortTitle,
            title: title,
            subtitle: desc.isNotEmpty ? desc : 'Verified practical project executed with performance metrics.',
            metrics: [
              {'label': 'Verified', 'val': '100%'},
            ],
            personalPortfolioUrl: link,
            clientProjectUrl: '',
            linkText: 'View Verified Live Proof',
            tags: tech,
            attachedFiles: [],
            candidateName: profile['fullName'] as String? ?? currentDomain.candidateName,
            avatarUrl: currentDomain.avatarUrl,
            rating: 4.9,
            reviewCount: 120,
          );
        }).toList();
      } else {
        final stored = await StorageService.getStoredProofs(domain);
        _activeProofs = stored.isNotEmpty ? stored : List.from(currentDomain.sampleProjects);
      }
    } catch (_) {
      final stored = await StorageService.getStoredProofs(domain);
      _activeProofs = stored.isNotEmpty ? stored : List.from(currentDomain.sampleProjects);
    }

    if (mounted) {
      setState(() {
        _selectedCategory = domain;
        _isLoading = false;
      });
    }
  }

  Future<void> _saveProofs() async {
    final jsonList = _activeProofs.map((p) => p.toJson()).toList();
    await StorageService.saveStoredProofs(_selectedCategory, jsonList);
  }

  Future<void> _deleteProof(int index) async {
    final removed = _activeProofs[index];
    setState(() {
      _activeProofs.removeAt(index);
    });
    _saveProofs();

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.textDark,
        duration: const Duration(seconds: 4),
        content: Text(
          'Removed "${removed.title}".',
          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700),
        ),
        action: SnackBarAction(
          label: 'UNDO',
          textColor: AppColors.bluePrimary,
          onPressed: () {
            setState(() {
              _activeProofs.insert(index, removed);
            });
            _saveProofs();
          },
        ),
      ),
    );
  }

  void _showAddProofModal(FresherDomain currentDomain) {
    String selectedSubcategory = currentDomain.subjectPills.length > 1 ? currentDomain.subjectPills[1] : 'Meta Ads';
    final titleCtrl = TextEditingController();
    final subtitleCtrl = TextEditingController();
    final personalPortfolioCtrl = TextEditingController();
    final clientProjectCtrl = TextEditingController();
    final metric1LabelCtrl = TextEditingController();
    final metric1ValCtrl = TextEditingController();
    final metric2LabelCtrl = TextEditingController();
    final metric2ValCtrl = TextEditingController();
    List<UploadedFileModel> attachedFiles = [];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          height: MediaQuery.of(context).size.height * 0.88,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.borderLight,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Add ${currentDomain.shortTitle} Proof',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.textDark,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Select Subject Sub-Category
                Text('Proof Category *', style: _labelStyle),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.scaffoldBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: selectedSubcategory,
                      isExpanded: true,
                      items: currentDomain.subjectPills.where((p) => p != 'All').map((p) {
                        return DropdownMenuItem(value: p, child: Text(p));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedSubcategory = val);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Project Title
                Text('Project Title *', style: _labelStyle),
                const SizedBox(height: 6),
                TextField(
                  controller: titleCtrl,
                  style: GoogleFonts.plusJakartaSans(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Meta Ads E-commerce Scale or SEO 90-Day Traffic Growth',
                    filled: true,
                    fillColor: AppColors.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  ),
                ),
                const SizedBox(height: 14),

                // Subtitle / Result Summary
                Text('Work Summary & Objective *', style: _labelStyle),
                const SizedBox(height: 6),
                TextField(
                  controller: subtitleCtrl,
                  maxLines: 2,
                  style: GoogleFonts.plusJakartaSans(fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'Describe how you executed this project, tools used, and results generated.',
                    filled: true,
                    fillColor: AppColors.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  ),
                ),
                const SizedBox(height: 14),

                // Personal Portfolio URL & Client URLs
                Text('Personal Portfolio Link (Must) *', style: _labelStyle),
                const SizedBox(height: 6),
                TextField(
                  controller: personalPortfolioCtrl,
                  style: GoogleFonts.plusJakartaSans(fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'https://yourname.portfolio or Behance / GitHub',
                    prefixIcon: const Icon(Icons.language_rounded, color: AppColors.bluePrimary, size: 18),
                    filled: true,
                    fillColor: AppColors.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  ),
                ),
                const SizedBox(height: 14),

                Text('Client Project Link / Live URL (Optional)', style: _labelStyle),
                const SizedBox(height: 6),
                TextField(
                  controller: clientProjectCtrl,
                  style: GoogleFonts.plusJakartaSans(fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'https://business.facebook.com or client store URL',
                    prefixIcon: const Icon(Icons.link_rounded, color: AppColors.success, size: 18),
                    filled: true,
                    fillColor: AppColors.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                  ),
                ),
                const SizedBox(height: 14),

                // Metrics Achieved Row
                Text('Key Metrics Achieved', style: _labelStyle),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: metric1ValCtrl,
                        decoration: InputDecoration(
                          hintText: 'Value (e.g. 4.8x)',
                          filled: true,
                          fillColor: AppColors.scaffoldBg,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: metric1LabelCtrl,
                        decoration: InputDecoration(
                          hintText: 'Metric (e.g. ROAS)',
                          filled: true,
                          fillColor: AppColors.scaffoldBg,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: metric2ValCtrl,
                        decoration: InputDecoration(
                          hintText: 'Value (e.g. ₹35)',
                          filled: true,
                          fillColor: AppColors.scaffoldBg,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: metric2LabelCtrl,
                        decoration: InputDecoration(
                          hintText: 'Metric (e.g. Avg CPL)',
                          filled: true,
                          fillColor: AppColors.scaffoldBg,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderSubtle)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // File Upload Zone for Unlimited files
                FileUploadZone(
                  initialFiles: attachedFiles,
                  onFilesChanged: (files) => setModalState(() => attachedFiles = files),
                  title: 'Attach Work Screenshots, Reports, & PDFs',
                  hint: 'Attach Meta Ads exports, SEO ranking charts, or case study documents',
                ),
                const SizedBox(height: 24),

                // Save & Publish Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () async {
                      final title = titleCtrl.text.trim();
                      if (title.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Please enter a project title')),
                        );
                        return;
                      }

                      final subtitle = subtitleCtrl.text.trim().isNotEmpty
                          ? subtitleCtrl.text.trim()
                          : 'Verified practical project executed with measurable performance results.';

                      final messenger = ScaffoldMessenger.of(context);
                      final nav = Navigator.of(ctx);

                      try {
                        await ApiService.addProject({
                          'title': title,
                          'description': subtitle,
                          'techStack': [selectedSubcategory, currentDomain.shortTitle],
                          'projectLink': personalPortfolioCtrl.text.trim(),
                        });
                      } catch (_) {}

                      final newProof = ProofItem(
                        categoryBadge: selectedSubcategory,
                        title: title,
                        subtitle: subtitle,
                        metrics: [
                          {'label': metric1LabelCtrl.text.trim(), 'val': metric1ValCtrl.text.trim()},
                          if (metric2ValCtrl.text.trim().isNotEmpty)
                            {'label': metric2LabelCtrl.text.trim(), 'val': metric2ValCtrl.text.trim()},
                        ],
                        personalPortfolioUrl: personalPortfolioCtrl.text.trim(),
                        clientProjectUrl: clientProjectCtrl.text.trim(),
                        linkText: 'View Verified Live Proof',
                        tags: [selectedSubcategory, currentDomain.shortTitle, 'Verified Work'],
                        attachedFiles: attachedFiles.map((f) => f.name).toList(),
                        candidateName: currentDomain.candidateName,
                        avatarUrl: currentDomain.avatarUrl,
                        rating: 4.9,
                        reviewCount: 130,
                      );

                      if (mounted) {
                        setState(() {
                          _activeProofs.insert(0, newProof);
                        });
                        _saveProofs();
                        nav.pop();

                        messenger.showSnackBar(
                          SnackBar(
                            backgroundColor: AppColors.success,
                            content: Text('✓ Added new "$title" proof successfully!'),
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.bluePrimary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                    ),
                    child: Text('Publish Proof to HR Dashboard →', style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  TextStyle get _labelStyle => GoogleFonts.plusJakartaSans(
        fontSize: 12.5,
        fontWeight: FontWeight.w700,
        color: AppColors.textDark,
      );

  @override
  Widget build(BuildContext context) {
    final currentDomain = DomainConstants.getDomainById(_selectedCategory);
    final filteredList = _selectedSubFilter == 'All'
        ? _activeProofs
        : _activeProofs.where((p) => p.categoryBadge.toLowerCase().contains(_selectedSubFilter.toLowerCase())).toList();

    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      appBar: AppBar(
        backgroundColor: AppColors.scaffoldBg,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Proof of Work Hub',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.textDark,
              ),
            ),
            Text(
              '${_activeProofs.length} Verified Projects for ${currentDomain.shortTitle}',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11.5,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(vertical: 8),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            decoration: BoxDecoration(
              color: AppColors.cardBlue,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.bluePrimary.withValues(alpha: 0.2)),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
              child: Text(
                currentDomain.shortTitle,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w800,
                  color: AppColors.bluePrimary,
                ),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_rounded, color: AppColors.bluePrimary, size: 26),
            onPressed: () => _showAddProofModal(currentDomain),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: AppColors.bluePrimary))
            : ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                children: [
                  // Sub-category filter pills
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: currentDomain.subjectPills.map((pill) {
                        final isSelected = _selectedSubFilter == pill;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedSubFilter = pill),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.bluePrimary : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isSelected ? AppColors.bluePrimary : AppColors.borderSubtle,
                                ),
                              ),
                              child: Text(
                                pill,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 11.5,
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
                  const SizedBox(height: 16),

                  // Add Proof Trigger Card
                  GestureDetector(
                    onTap: () => _showAddProofModal(currentDomain),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.cardBlue.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.bluePrimary.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(
                              color: AppColors.bluePrimary,
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Icon(Icons.add_rounded, color: Colors.white, size: 24),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Add Unlimited ${currentDomain.shortTitle} Proofs',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.bluePrimary,
                                  ),
                                ),
                                Text(
                                  'Upload Meta Ads ROAS, Website links, SEO rankings, and reports.',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Proof Cards List
                  if (filteredList.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.folder_open_rounded, size: 40, color: AppColors.textLight),
                          const SizedBox(height: 8),
                          Text(
                            'No Proofs in "$_selectedSubFilter"',
                            style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Tap the button above to add an unlimited proof project.',
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.textMuted),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  else
                    ...List.generate(filteredList.length, (index) {
                      final proof = filteredList[index];
                      return _buildProofCard(proof, index);
                    }),

                  const SizedBox(height: 24),
                ],
              ),
      ),
    );
  }

  Widget _buildProofCard(ProofItem proof, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
          // Header Row with Category Badge & Delete 'X' Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.cardBlue,
                  borderRadius: BorderRadius.circular(8),
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
              IconButton(
                icon: const Icon(Icons.close_rounded, size: 18, color: AppColors.textLight),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () => _deleteProof(index),
              ),
            ],
          ),
          const SizedBox(height: 10),

          Text(
            proof.title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 15,
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

          // Metrics row
          if (proof.metrics.isNotEmpty)
            Row(
              children: proof.metrics.map((m) {
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.scaffoldBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        m['val'] ?? '',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w900,
                          color: AppColors.bluePrimary,
                        ),
                      ),
                      Text(
                        m['label'] ?? '',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9.5,
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          const SizedBox(height: 12),

          // Portfolio / Client URL badges
          if (proof.personalPortfolioUrl.isNotEmpty || proof.clientProjectUrl.isNotEmpty) ...[
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                if (proof.personalPortfolioUrl.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.cardBlue.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.language_rounded, size: 12, color: AppColors.bluePrimary),
                        const SizedBox(width: 4),
                        Text(
                          'Portfolio: ${proof.personalPortfolioUrl}',
                          style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w700, color: AppColors.bluePrimary),
                        ),
                      ],
                    ),
                  ),
                if (proof.clientProjectUrl.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.successBg,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.link_rounded, size: 12, color: AppColors.success),
                        const SizedBox(width: 4),
                        Text(
                          'Client Live URL',
                          style: GoogleFonts.plusJakartaSans(fontSize: 10.5, fontWeight: FontWeight.w700, color: AppColors.success),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),
          ],

          // Attached files list
          if (proof.attachedFiles.isNotEmpty) ...[
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: proof.attachedFiles.map((file) {
                final isPdf = file.toLowerCase().endsWith('.pdf');
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isPdf ? Colors.red.shade50 : Colors.green.shade50,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: isPdf ? Colors.red.shade200 : Colors.green.shade200),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(isPdf ? Icons.picture_as_pdf_rounded : Icons.image_rounded, size: 12, color: isPdf ? Colors.red.shade700 : Colors.green.shade700),
                      const SizedBox(width: 4),
                      Text(
                        file,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: isPdf ? Colors.red.shade800 : Colors.green.shade800,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }
}
