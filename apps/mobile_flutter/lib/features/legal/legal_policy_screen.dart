import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

enum LegalTab { privacy, terms, refund, contact }

class LegalPolicyScreen extends StatefulWidget {
  final LegalTab initialTab;

  const LegalPolicyScreen({
    super.key,
    this.initialTab = LegalTab.privacy,
  });

  @override
  State<LegalPolicyScreen> createState() => _LegalPolicyScreenState();
}

class _LegalPolicyScreenState extends State<LegalPolicyScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    int initialIndex = 0;
    switch (widget.initialTab) {
      case LegalTab.privacy:
        initialIndex = 0;
        break;
      case LegalTab.terms:
        initialIndex = 1;
        break;
      case LegalTab.refund:
        initialIndex = 2;
        break;
      case LegalTab.contact:
        initialIndex = 3;
        break;
    }
    _tabController = TabController(length: 4, vsync: this, initialIndex: initialIndex);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _launchEmail(String email) async {
    final uri = Uri(scheme: 'mailto', path: email);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _launchPhone(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Legal & Compliance',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18),
        ),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          indicatorColor: const Color(0xFF10B981),
          indicatorWeight: 3,
          labelColor: const Color(0xFF10B981),
          unselectedLabelColor: const Color(0xFF94A3B8),
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
          tabs: const [
            Tab(text: 'Privacy Policy'),
            Tab(text: 'Terms of Service'),
            Tab(text: 'Refund Policy'),
            Tab(text: 'Support & Contact'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildPrivacyTab(),
          _buildTermsTab(),
          _buildRefundTab(),
          _buildContactTab(),
        ],
      ),
    );
  }

  // ===========================================================================
  // PRIVACY POLICY TAB
  // ===========================================================================
  Widget _buildPrivacyTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildHeroBanner(
          icon: Icons.shield_outlined,
          color: const Color(0xFF10B981),
          title: 'Privacy Policy',
          subtitle: 'Compliant with Digital Personal Data Protection (DPDP) Act 2023, India',
        ),
        const SizedBox(height: 20),
        _buildSectionCard(
          title: '1. Introduction',
          content:
              'FresherToWork (operated by Velvetbyte PVT Ltd) is committed to protecting the privacy of candidates and corporate recruiters. This policy outlines how your data is collected, stored, and utilized when using the mobile application and web portals.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '2. Information We Collect',
          content:
              '• Personal Identity: Full Name, Email, Phone Number, Profile Photo.\n'
              '• Career Data: Headline, Bio, Educational Background, Technical & Creative Skills.\n'
              '• Proof of Work: Live Portfolio Links (GitHub, Behance, Figma, Drive), Case Studies, and PDF Resumes.\n'
              '• Payment Details: Razorpay Order IDs & Transaction IDs (we never store banking passwords, UPI PINs, or raw card data).',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '3. Data Protection & Privacy Controls',
          content:
              '• Hidden Contact Details: Your phone number, email address, and downloadable CV are shielded behind exclusive recruiter unlocks.\n'
              '• Encryption: Data in transit is secured using 256-bit TLS/SSL encryption and stored on isolated cloud servers (Supabase PostgreSQL).\n'
              '• Zero Ad Selling: We do not sell your personal contact info to third-party telemarketers or advertisers.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '4. Account Deletion & Rights',
          content:
              'You retain complete ownership of your data. You may update your profile or request complete deletion of your account and uploaded proofs-of-work at any time by contacting our support desk.',
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  // ===========================================================================
  // TERMS OF SERVICE TAB
  // ===========================================================================
  Widget _buildTermsTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildHeroBanner(
          icon: Icons.gavel_rounded,
          color: const Color(0xFF3B82F6),
          title: 'Terms of Service',
          subtitle: 'Governing user rules for candidate portfolios and corporate hiring',
        ),
        const SizedBox(height: 20),
        _buildSectionCard(
          title: '1. Platform Acceptance',
          content:
              'By signing up or using FresherToWork, you agree to comply with all platform rules and policies. Failure to follow these rules may result in profile suspension or permanent blacklisting.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '2. Candidate Proof of Work Authenticity',
          content:
              '• Authentic Submissions: All projects, GitHub repositories, designs, and case studies must be your original work.\n'
              '• Zero Tolerance for Plagiarism: Submitting stolen assets or fake credentials will lead to immediate profile ban without refund.\n'
              '• Intellectual Property: Candidates retain 100% intellectual property ownership of their projects and code.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '3. Profile Activation Fee (₹99)',
          content:
              'Candidates may choose to activate their profile for direct recruiter discovery for a nominal one-time verification fee of ₹99. This covers manual human moderation, portfolio proofing, and cloud hosting.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '4. Recruiter Code of Conduct',
          content:
              'Recruiters agree to use candidate contacts strictly for evaluating genuine employment or internship opportunities. Spam, promotion of paid courses, or harassment will result in legal action and account termination.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '5. Disclaimer of Employment Guarantee',
          content:
              'FresherToWork guarantees platform visibility and verified credentials to hiring recruiters. We do not guarantee a job offer, as selection depends entirely on candidate performance during interviews.',
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  // ===========================================================================
  // REFUND POLICY TAB
  // ===========================================================================
  Widget _buildRefundTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildHeroBanner(
          icon: Icons.currency_rupee_rounded,
          color: const Color(0xFFF59E0B),
          title: 'Refund & Cancellation',
          subtitle: 'Clear terms on candidate profile verification fee (₹99)',
        ),
        const SizedBox(height: 20),
        _buildSectionCard(
          title: '1. Profile Activation Fee Overview',
          content:
              'Candidate profile activation requires a one-time digital processing fee of ₹99 (inclusive of taxes) processed securely via Razorpay.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '2. When 100% Refunds Are Granted',
          content:
              '• Duplicate Debits: Multiple deductions due to network or gateway glitch.\n'
              '• Technical Failure: Money debited from your bank/UPI but profile was not activated within 24 hours.\n'
              '• Unfulfilled Moderation: If our team fails to review your portfolio within 7 working days from submission.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '3. When Refunds Are Not Applicable',
          content:
              '• After successful verification and profile publishing to recruiters.\n'
              '• Rejections caused by plagiarism, fake projects, or policy violations.\n'
              '• Change of mind after profile review has commenced.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: '4. How to Claim a Refund',
          content:
              'Email your payment receipt or Razorpay Payment ID to infovelvetbyte@gmail.com. Verified refunds are credited back to your original source (UPI / Bank Account) within 5–7 working days.',
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  // ===========================================================================
  // CONTACT & SUPPORT TAB
  // ===========================================================================
  Widget _buildContactTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildHeroBanner(
          icon: Icons.support_agent_rounded,
          color: const Color(0xFF8B5CF6),
          title: 'Support & Grievance',
          subtitle: 'Direct support for candidate verifications and payment assistance',
        ),
        const SizedBox(height: 20),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF334155)),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Operating Entity',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
              ),
              const SizedBox(height: 6),
              const Text(
                'Velvetbyte PVT Ltd / FresherToWork\nCalicut, Kerala & Bengaluru, Karnataka, India',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.4),
              ),
              const Divider(color: Color(0xFF334155), height: 32),
              _buildContactActionTile(
                icon: Icons.email_rounded,
                title: 'Email Support',
                subtitle: 'infovelvetbyte@gmail.com',
                onTap: () => _launchEmail('infovelvetbyte@gmail.com'),
              ),
              const SizedBox(height: 12),
              _buildContactActionTile(
                icon: Icons.phone_rounded,
                title: 'Helpline & WhatsApp',
                subtitle: '+91 8921658090 (Mon-Sat, 9AM-6PM)',
                onTap: () => _launchPhone('+918921658090'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  // ===========================================================================
  // HELPER WIDGETS
  // ===========================================================================
  Widget _buildHeroBanner({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({required String title, required String content}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15),
          ),
          const SizedBox(height: 10),
          Text(
            content,
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13, height: 1.55),
          ),
        ],
      ),
    );
  }

  Widget _buildContactActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: const Color(0xFF10B981), size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF64748B), size: 14),
          ],
        ),
      ),
    );
  }
}
