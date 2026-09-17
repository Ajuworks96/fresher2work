import 'package:flutter/material.dart';

class DomainJobCategory {
  final String title;
  final String salary;
  final IconData icon;

  const DomainJobCategory({required this.title, required this.salary, required this.icon});
}

class ProofItem {
  final String categoryBadge;
  final String title;
  final String subtitle;
  final List<Map<String, String>> metrics;
  final String personalPortfolioUrl;
  final String clientProjectUrl;
  final String linkText;
  final List<String> tags;
  final List<String> attachedFiles;
  final String candidateName;
  final String avatarUrl;
  final double rating;
  final int reviewCount;

  const ProofItem({
    required this.categoryBadge,
    required this.title,
    required this.subtitle,
    required this.metrics,
    this.personalPortfolioUrl = '',
    this.clientProjectUrl = '',
    required this.linkText,
    required this.tags,
    required this.attachedFiles,
    this.candidateName = 'Candidate',
    this.avatarUrl = '',
    this.rating = 5.0,
    this.reviewCount = 0,
  });

  Map<String, dynamic> toJson() {
    return {
      'categoryBadge': categoryBadge,
      'title': title,
      'subtitle': subtitle,
      'metrics': metrics,
      'personalPortfolioUrl': personalPortfolioUrl,
      'clientProjectUrl': clientProjectUrl,
      'linkText': linkText,
      'tags': tags,
      'attachedFiles': attachedFiles,
      'candidateName': candidateName,
      'avatarUrl': avatarUrl,
      'rating': rating,
      'reviewCount': reviewCount,
    };
  }

  factory ProofItem.fromJson(Map<String, dynamic> json) {
    return ProofItem(
      categoryBadge: json['categoryBadge'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      metrics: (json['metrics'] as List? ?? [])
          .map((m) => Map<String, String>.from(m as Map))
          .toList(),
      personalPortfolioUrl: json['personalPortfolioUrl'] ?? '',
      clientProjectUrl: json['clientProjectUrl'] ?? '',
      linkText: json['linkText'] ?? 'View Proof',
      tags: List<String>.from(json['tags'] ?? []),
      attachedFiles: List<String>.from(json['attachedFiles'] ?? []),
      candidateName: json['candidateName'] ?? 'Candidate',
      avatarUrl: json['avatarUrl'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      reviewCount: json['reviewCount'] ?? 0,
    );
  }
}

class FresherDomain {
  final String id;
  final String title;
  final IconData icon;
  final String shortTitle;
  final String roleTitle;
  final String candidateName;
  final String candidateDegree;
  final String salaryRange;
  final String hourlyRate;
  final String avatarUrl;
  final String description;
  final List<String> skills;
  final List<String> subjectPills;
  final List<DomainJobCategory> exploreCategories;
  final List<String> proofTypes;
  final List<ProofItem> sampleProjects;

  const FresherDomain({
    required this.id,
    required this.title,
    required this.icon,
    required this.shortTitle,
    required this.roleTitle,
    this.candidateName = 'Candidate',
    this.candidateDegree = 'Verified Fresher',
    required this.salaryRange,
    this.hourlyRate = 'Market Competitive',
    this.avatarUrl = '',
    required this.description,
    required this.skills,
    required this.subjectPills,
    required this.exploreCategories,
    required this.proofTypes,
    this.sampleProjects = const [],
  });
}

class DomainConstants {
  static const List<FresherDomain> domains = [
    FresherDomain(
      id: 'digital_marketing',
      title: 'Digital Marketing',
      shortTitle: 'Digital Marketing',
      icon: Icons.trending_up_rounded,
      roleTitle: 'Performance Marketing Specialist',
      salaryRange: '₹4.5 - ₹7.5 LPA',
      description: 'Meta Ads Manager, Google Ads, Campaign Analytics, ROAS & CPL Optimization',
      skills: ['Meta Ads', 'Google Ads', 'Analytics', 'ROAS Scaling', 'Media Buying', 'Keyword Research'],
      subjectPills: ['All', 'Meta Ads', 'Websites', 'SEO', 'Content Marketing'],
      exploreCategories: [
        DomainJobCategory(title: 'Meta Ads &\nPerformance', salary: '~₹5-8 LPA', icon: Icons.trending_up_rounded),
        DomainJobCategory(title: 'SEO &\nOrganic Traffic', salary: '~₹4.5-7 LPA', icon: Icons.search_rounded),
        DomainJobCategory(title: 'Websites &\nClient Portfolios', salary: '~₹4-6.5 LPA', icon: Icons.language_rounded),
        DomainJobCategory(title: 'Content Marketing\n& Copywriting', salary: '~₹4-6 LPA', icon: Icons.campaign_outlined),
      ],
      proofTypes: [
        'Meta Ads ROAS Report (PNG/PDF)',
        'Campaign Analytics Report (PDF/JPG)',
        'Personal Portfolio Website (URL)',
        'SEO Ranking Case Study (PDF/DOC)',
        'Resume / CV (PDF)',
      ],
      sampleProjects: [],
    ),
    FresherDomain(
      id: 'graphic_design',
      title: 'Graphic Design',
      shortTitle: 'Graphic Design',
      icon: Icons.palette_outlined,
      roleTitle: 'Brand Identity & Visual Designer',
      salaryRange: '₹4.0 - ₹7.0 LPA',
      description: 'Posters, Brand Identity Kits, Event Flyers, Social Media Creatives, Figma UI',
      skills: ['Photoshop', 'Illustrator', 'Figma', 'Typography', 'Brand Identity', 'Print Design'],
      subjectPills: ['All', 'Brand Identity', 'Posters & Flyers', 'Social Media', 'Packaging'],
      exploreCategories: [
        DomainJobCategory(title: 'Brand Identity &\nLogo Design', salary: '~₹4.5-7 LPA', icon: Icons.palette_outlined),
        DomainJobCategory(title: 'Social Media &\nAd Creatives', salary: '~₹4-6 LPA', icon: Icons.image_outlined),
        DomainJobCategory(title: 'Posters & Event\nCollaterals', salary: '~₹4-6.5 LPA', icon: Icons.newspaper_outlined),
        DomainJobCategory(title: 'Print & Packaging\nDesign', salary: '~₹4-6.5 LPA', icon: Icons.inventory_2_outlined),
      ],
      proofTypes: [
        'Poster / Flyer Artwork (PNG/JPG)',
        'Brand Guidelines Kit (PDF)',
        'Behance Portfolio Link (URL)',
        'Resume / CV (PDF)',
      ],
      sampleProjects: [],
    ),
    FresherDomain(
      id: 'ui_ux_design',
      title: 'UI/UX Design',
      shortTitle: 'UI/UX Design',
      icon: Icons.smartphone_rounded,
      roleTitle: 'Product & Mobile UI/UX Designer',
      salaryRange: '₹5.5 - ₹8.5 LPA',
      description: 'Mobile App Wireframes, Figma Prototypes, Design Systems, Usability Case Studies',
      skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research', 'Wireframing', 'Micro-Interactions'],
      subjectPills: ['All', 'Mobile Apps', 'Figma Prototypes', 'Design Systems', 'Case Studies'],
      exploreCategories: [
        DomainJobCategory(title: 'Mobile App\nUI/UX Design', salary: '~₹5.5-9 LPA', icon: Icons.smartphone_rounded),
        DomainJobCategory(title: 'Design Systems &\nComponents', salary: '~₹6-9.5 LPA', icon: Icons.dashboard_customize_outlined),
        DomainJobCategory(title: 'Web Apps & SaaS\nDashboards', salary: '~₹5.5-8.5 LPA', icon: Icons.web_rounded),
        DomainJobCategory(title: 'User Research &\nUsability Audit', salary: '~₹5-8 LPA', icon: Icons.manage_search_rounded),
      ],
      proofTypes: [
        'Figma Prototype Link (URL)',
        'UX Case Study (PDF/DOC)',
        'App UI Screens (PNG/JPG)',
        'Design System Guide (PDF)',
        'Resume / CV (PDF)',
      ],
      sampleProjects: [],
    ),
    FresherDomain(
      id: 'video_editing',
      title: 'Video Editing',
      shortTitle: 'Video Editing',
      icon: Icons.videocam_outlined,
      roleTitle: 'Video Editor & Motion Artist',
      salaryRange: '₹4.5 - ₹8.0 LPA',
      description: 'Reels, Commercial Promo Ads, DaVinci Resolve, Premiere Pro, Motion Graphics',
      skills: ['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Sound Design', 'Color Grading', 'Subtitles'],
      subjectPills: ['All', 'Reels & Shorts', 'Commercial Ads', 'Timelines', 'Color Grading'],
      exploreCategories: [
        DomainJobCategory(title: 'Shorts & Reels\nEditing', salary: '~₹4.5-7 LPA', icon: Icons.videocam_outlined),
        DomainJobCategory(title: 'YouTube Long-form\nEditing', salary: '~₹5-8 LPA', icon: Icons.play_circle_outline_rounded),
        DomainJobCategory(title: 'Motion Graphics &\nAnimation', salary: '~₹5.5-9 LPA', icon: Icons.auto_awesome_outlined),
        DomainJobCategory(title: 'Commercial Ads &\nColor Grading', salary: '~₹6-9 LPA', icon: Icons.movie_filter_outlined),
      ],
      proofTypes: [
        'Timeline Screenshot (PNG/JPG)',
        'Video Showreel Link (URL)',
        'Color Grade Breakdown (PDF/PNG)',
        'Resume / CV (PDF)',
      ],
      sampleProjects: [],
    ),
    FresherDomain(
      id: 'software_dev',
      title: 'Software Development',
      shortTitle: 'Software Dev',
      icon: Icons.code_rounded,
      roleTitle: 'Full Stack & Mobile Developer',
      salaryRange: '₹6.0 - ₹10.0 LPA',
      description: 'Web Applications, Flutter Apps, React, Node.js, PostgreSQL, GitHub Repos',
      skills: ['Flutter & Dart', 'React & Next.js', 'Node.js', 'PostgreSQL', 'Git & GitHub', 'REST APIs'],
      subjectPills: ['All', 'Web Apps', 'Flutter & Mobile', 'Backend APIs', 'GitHub Repos'],
      exploreCategories: [
        DomainJobCategory(title: 'Full Stack\nDevelopment', salary: '~₹6-10 LPA', icon: Icons.code_rounded),
        DomainJobCategory(title: 'Mobile App Dev\n(Flutter/iOS)', salary: '~₹6-9.5 LPA', icon: Icons.phone_android_rounded),
        DomainJobCategory(title: 'Backend & APIs\n(Node/Python)', salary: '~₹6.5-10.5 LPA', icon: Icons.dns_outlined),
        DomainJobCategory(title: 'Frontend &\nWeb Apps', salary: '~₹5.5-9 LPA', icon: Icons.web_rounded),
      ],
      proofTypes: [
        'GitHub Repository Link',
        'Live Web Deployment URL',
        'Architecture Diagram (PDF/PNG)',
        'Resume / CV (PDF)',
      ],
      sampleProjects: [],
    ),
  ];

  static FresherDomain getDomainById(String id) {
    return domains.firstWhere(
      (d) => d.id == id,
      orElse: () => domains.first,
    );
  }
}

class NicheMetricPreset {
  final String label;
  final String placeholderVal;
  final String description;

  const NicheMetricPreset({
    required this.label,
    required this.placeholderVal,
    required this.description,
  });
}

class NicheProofConfig {
  final String nicheBadge;
  final String guideText;
  final String titleHint;
  final String summaryHint;
  final String portfolioHint;
  final String clientLinkHint;
  final String fileUploadTitle;
  final String fileUploadHint;
  final String defaultMetric1Label;
  final String defaultMetric1Val;
  final String defaultMetric2Label;
  final String defaultMetric2Val;
  final List<NicheMetricPreset> suggestedMetrics;

  const NicheProofConfig({
    required this.nicheBadge,
    required this.guideText,
    required this.titleHint,
    required this.summaryHint,
    required this.portfolioHint,
    required this.clientLinkHint,
    required this.fileUploadTitle,
    required this.fileUploadHint,
    required this.defaultMetric1Label,
    required this.defaultMetric1Val,
    required this.defaultMetric2Label,
    required this.defaultMetric2Val,
    required this.suggestedMetrics,
  });
}

class NicheProofHelper {
  static NicheProofConfig getConfig(String domainId, String subcategory) {
    final sub = subcategory.toLowerCase();

    // 1. Digital Marketing: Meta Ads & Performance Marketing
    if (sub.contains('meta') || sub.contains('ad') || (domainId == 'digital_marketing' && !sub.contains('seo') && !sub.contains('website') && !sub.contains('content'))) {
      return const NicheProofConfig(
        nicheBadge: 'Meta Ads & Performance Marketing',
        guideText: '🎯 Recruiters evaluating Meta Ads look for real spend scale, return on ad spend (ROAS), and low cost per acquisition (CPL).',
        titleHint: 'e.g. Meta Ads E-Commerce Scaling Campaign or B2B Lead Gen',
        summaryHint: 'Explain ad objective, audience targeting, creatives tested, and ROAS achieved.',
        portfolioHint: 'Meta Ads Manager screenshots link or Notion Case Study',
        clientLinkHint: 'Client e-commerce store or landing page URL',
        fileUploadTitle: 'Attach Ad Manager Exports & Creatives',
        fileUploadHint: 'Attach Meta Ads Manager dashboard screenshots, CTR/CPL reports, or top creatives',
        defaultMetric1Label: 'ROAS',
        defaultMetric1Val: '4.8x',
        defaultMetric2Label: 'Avg CPL',
        defaultMetric2Val: '₹32',
        suggestedMetrics: [
          NicheMetricPreset(label: 'ROAS', placeholderVal: '4.8x', description: 'Return on Ad Spend'),
          NicheMetricPreset(label: 'Avg CPL', placeholderVal: '₹32', description: 'Cost Per Lead'),
          NicheMetricPreset(label: 'CTR %', placeholderVal: '3.6%', description: 'Click-Through Rate'),
          NicheMetricPreset(label: 'Ad Spend Managed', placeholderVal: '₹1.5L', description: 'Total Budget Managed'),
          NicheMetricPreset(label: 'Leads Generated', placeholderVal: '850+ Leads', description: 'Total Form Fills / Leads'),
          NicheMetricPreset(label: 'Conversion Rate', placeholderVal: '5.2%', description: 'Purchases / Leads %'),
        ],
      );
    }

    // 2. Websites & Web/Software Development
    if (sub.contains('website') || domainId == 'software_dev' || sub.contains('web app') || sub.contains('backend') || sub.contains('flutter')) {
      return const NicheProofConfig(
        nicheBadge: 'Web & Software Development',
        guideText: '⚡ Recruiters want to see live working deployments, clean GitHub commits, responsive speed, and API integrations.',
        titleHint: 'e.g. Full-Stack E-Commerce Platform or SaaS Web Application',
        summaryHint: 'Explain tech stack (Next.js, Flutter, Node.js, PostgreSQL), system design, and responsiveness.',
        portfolioHint: 'GitHub repository URL or developer portfolio URL',
        clientLinkHint: 'Live deployed application URL (Vercel, Render, or Play Store)',
        fileUploadTitle: 'Attach Code Architecture & App Screenshots',
        fileUploadHint: 'Attach screenshots of deployed app, database schema, Lighthouse audit, or API architecture',
        defaultMetric1Label: 'Lighthouse Score',
        defaultMetric1Val: '98/100',
        defaultMetric2Label: 'APIs Built',
        defaultMetric2Val: '14 Endpoints',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Lighthouse Score', placeholderVal: '98/100', description: 'Performance & SEO Audit'),
          NicheMetricPreset(label: 'Page Load Speed', placeholderVal: '0.8s', description: 'Time to Interactive'),
          NicheMetricPreset(label: 'APIs Built', placeholderVal: '14 Endpoints', description: 'REST / GraphQL Services'),
          NicheMetricPreset(label: 'Responsive Devices', placeholderVal: '100% Mobile/Desktop', description: 'Cross-Device Responsiveness'),
          NicheMetricPreset(label: 'GitHub Commits', placeholderVal: '85+ Commits', description: 'Version Control Rigor'),
          NicheMetricPreset(label: 'Active Users', placeholderVal: '2.5K Users', description: 'Traffic / Registered Accounts'),
        ],
      );
    }

    // 3. UI/UX Design
    if (domainId == 'ui_ux_design' || sub.contains('ui') || sub.contains('ux') || sub.contains('figma') || sub.contains('prototype')) {
      return const NicheProofConfig(
        nicheBadge: 'UI/UX & Product Design',
        guideText: '🎨 Recruiters look for user research rigor, design system consistency, clickable Figma prototypes, and usability testing.',
        titleHint: 'e.g. FinTech Mobile App UI/UX Redesign or Healthcare Patient Portal',
        summaryHint: 'Detail user personas, problem statement, wireframing iterations, and usability testing.',
        portfolioHint: 'Figma interactive prototype URL, Behance, or Dribbble',
        clientLinkHint: 'Live app link or staging prototype',
        fileUploadTitle: 'Attach Wireframes, Mockups & Case Studies',
        fileUploadHint: 'Attach exported UI screens, design system components, user personas, or UX case study PDF',
        defaultMetric1Label: 'Task Success Rate',
        defaultMetric1Val: '92%',
        defaultMetric2Label: 'Screens Designed',
        defaultMetric2Val: '36 Screens',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Task Success Rate', placeholderVal: '92%', description: 'Usability Task Completion'),
          NicheMetricPreset(label: 'Screens Designed', placeholderVal: '36 Screens', description: 'Total Handled UI Views'),
          NicheMetricPreset(label: 'Design System', placeholderVal: '50+ Components', description: 'Atomic Components & Tokens'),
          NicheMetricPreset(label: 'User Test Sessions', placeholderVal: '12 Users Tested', description: 'User Research Interviews'),
          NicheMetricPreset(label: 'Conversion Uplift', placeholderVal: '+28%', description: 'Business Conversion Impact'),
          NicheMetricPreset(label: 'Clickable Prototype', placeholderVal: '100% Flow Tested', description: 'Figma Interactive States'),
        ],
      );
    }

    // 4. Video Editing & Motion Graphics
    if (domainId == 'video_editing' || sub.contains('reel') || sub.contains('video') || sub.contains('short') || sub.contains('commercial')) {
      return const NicheProofConfig(
        nicheBadge: 'Video Editing & Motion Graphics',
        guideText: '🎬 Recruiters evaluate hook pacing, retention rates, sound design, DaVinci color grading, and viral short-form editing.',
        titleHint: 'e.g. Viral Instagram Reels Campaign or Brand Commercial Video Ad',
        summaryHint: 'Explain editing narrative, retention hook strategy, DaVinci/Premiere effects, and audio mixing.',
        portfolioHint: 'YouTube showreel URL, Vimeo, or Google Drive folder',
        clientLinkHint: 'Live published Reel / YouTube video link',
        fileUploadTitle: 'Attach Timeline Screenshots & Stills',
        fileUploadHint: 'Attach DaVinci/Premiere timeline screenshots, before/after color grading, or high-res stills',
        defaultMetric1Label: 'Views Generated',
        defaultMetric1Val: '1.2M Views',
        defaultMetric2Label: 'Watch Retention',
        defaultMetric2Val: '68% Retention',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Views Generated', placeholderVal: '1.2M Views', description: 'Total Organic / Paid Views'),
          NicheMetricPreset(label: 'Watch Retention', placeholderVal: '68% Retention', description: 'Audience Completion Rate'),
          NicheMetricPreset(label: 'Videos Produced', placeholderVal: '25+ Reels', description: 'Total Edited Outputs'),
          NicheMetricPreset(label: 'Avg Watch Time', placeholderVal: '45 Seconds', description: 'Average Viewer Engagement'),
          NicheMetricPreset(label: 'Audio Layers Mixed', placeholderVal: '12 Tracks', description: 'SFX & Foley Sound Design'),
          NicheMetricPreset(label: 'Color Grading LUTs', placeholderVal: 'DaVinci Rec.709', description: 'Cinematic Color Pipeline'),
        ],
      );
    }

    // 5. Graphic Design & Branding
    if (domainId == 'graphic_design' || sub.contains('graphic') || sub.contains('brand') || sub.contains('poster') || sub.contains('flyer') || sub.contains('packaging')) {
      return const NicheProofConfig(
        nicheBadge: 'Graphic Design & Brand Identity',
        guideText: '✨ Recruiters want to see creative versatility, brand guidelines, typography harmony, and print-ready high-resolution deliverables.',
        titleHint: 'e.g. Complete Visual Brand Identity Kit or Festival Marketing Collaterals',
        summaryHint: 'Explain visual theme, color palette, logo construction, and software tools used (Photoshop, Illustrator, InDesign).',
        portfolioHint: 'Behance portfolio link, Adobe Portfolio, or Google Drive folder',
        clientLinkHint: 'Brand live Instagram profile or website',
        fileUploadTitle: 'Attach Brand Assets, Posters & Artwork',
        fileUploadHint: 'Attach high-res logos, brand book PDF, social media banners, or packaging mockups',
        defaultMetric1Label: 'Brand Assets Delivered',
        defaultMetric1Val: '25+ Assets',
        defaultMetric2Label: 'Print / Vector Ready',
        defaultMetric2Val: '300 DPI CMYK',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Assets Delivered', placeholderVal: '25+ Assets', description: 'Logos, Variations, Collaterals'),
          NicheMetricPreset(label: 'Print / Vector Ready', placeholderVal: '300 DPI CMYK', description: 'Production Print Accuracy'),
          NicheMetricPreset(label: 'Social Creatives', placeholderVal: '40+ Creatives', description: 'Instagram & Facebook Posts'),
          NicheMetricPreset(label: 'Brand Guide Pages', placeholderVal: '16 Pages', description: 'Typography & Styleguide Book'),
          NicheMetricPreset(label: 'Turnaround Time', placeholderVal: '24-48 Hours', description: 'Speed of Creative Delivery'),
          NicheMetricPreset(label: 'Client Satisfaction', placeholderVal: '100% Approved', description: 'Client Approval Feedback'),
        ],
      );
    }

    // 6. Search Engine Optimization (SEO)
    if (sub.contains('seo') || (sub.contains('search') && !sub.contains('content'))) {
      return const NicheProofConfig(
        nicheBadge: 'Search Engine Optimization (SEO)',
        guideText: '📈 Recruiters look for organic keyword ranking gains, search intent depth, domain authority growth, and technical SEO health.',
        titleHint: 'e.g. 90-Day SEO Organic Traffic Growth & Keyword Ranking Campaign',
        summaryHint: 'Explain keyword research methodology, on-page optimization, site architecture, and backlink outreach.',
        portfolioHint: 'SEO Case Study Link, Notion audit page, or live ranked site',
        clientLinkHint: 'Ranked client website URL',
        fileUploadTitle: 'Attach Traffic Graphs & Ranking Reports',
        fileUploadHint: 'Attach Google Search Console graphs, Ahrefs/Semrush keyword ranking screenshots, or audit PDFs',
        defaultMetric1Label: 'Organic Traffic',
        defaultMetric1Val: '+240%',
        defaultMetric2Label: 'Top 10 Keywords',
        defaultMetric2Val: '18 Keywords',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Organic Traffic', placeholderVal: '+240%', description: 'Organic Search Traffic Growth'),
          NicheMetricPreset(label: 'Top 10 Keywords', placeholderVal: '18 Keywords', description: 'Page 1 Ranked Keywords'),
          NicheMetricPreset(label: 'Domain Authority', placeholderVal: '+14 DA', description: 'Authority Score Uplift'),
          NicheMetricPreset(label: 'Organic Leads', placeholderVal: '85 Leads/mo', description: 'Inbound Inquiries Generated'),
          NicheMetricPreset(label: 'Backlinks Acquired', placeholderVal: '45 Quality Links', description: 'Referring Domains Built'),
          NicheMetricPreset(label: 'Technical Health', placeholderVal: '98/100', description: 'Site Health Audit Score'),
        ],
      );
    }

    // 7. Content Marketing & Copywriting
    if (sub.contains('content') || sub.contains('copywriting') || sub.contains('blog') || sub.contains('writing') || sub.contains('newsletter')) {
      return const NicheProofConfig(
        nicheBadge: 'Content Marketing & Copywriting',
        guideText: '✍️ Recruiters evaluate headline hooks, reader engagement, conversion copywriting, email open rates, and long-form depth.',
        titleHint: 'e.g. High-Converting B2B SaaS Content Funnel or Email Newsletter Series',
        summaryHint: 'Explain content theme, audience persona, research depth, tone of voice, and conversions generated.',
        portfolioHint: 'Medium blog URL, Substack, Notion Content Portfolio, or Google Drive folder',
        clientLinkHint: 'Live published blog post, landing page, or newsletter link',
        fileUploadTitle: 'Attach Published Articles & Copy Drafts',
        fileUploadHint: 'Attach published article PDFs, newsletter analytics screenshots, or editorial calendars',
        defaultMetric1Label: 'Articles Published',
        defaultMetric1Val: '15 Articles',
        defaultMetric2Label: 'Avg Read Time',
        defaultMetric2Val: '4.8 Mins',
        suggestedMetrics: [
          NicheMetricPreset(label: 'Articles Published', placeholderVal: '15 Articles', description: 'Long-Form Articles Delivered'),
          NicheMetricPreset(label: 'Avg Read Time', placeholderVal: '4.8 Mins', description: 'Reader Dwell Time / Engagement'),
          NicheMetricPreset(label: 'Email Open Rate', placeholderVal: '42% Open', description: 'Newsletter Open & Click Rate'),
          NicheMetricPreset(label: 'Content Conversion', placeholderVal: '6.4% Signups', description: 'Leads / Trial Signups'),
          NicheMetricPreset(label: 'Total Word Count', placeholderVal: '25K Words', description: 'Volume of Written Content'),
          NicheMetricPreset(label: 'Organic Shares', placeholderVal: '1.4K Shares', description: 'Social & Community Virality'),
        ],
      );
    }

    // Default Fallback
    return const NicheProofConfig(
      nicheBadge: 'Practical Proof of Work',
      guideText: '💼 Show verifiable proof of your work with concrete metrics, live links, and attached deliverables that prove your skill.',
      titleHint: 'e.g. Practical Client Project or Real-World Problem Solution',
      summaryHint: 'Explain execution process, tools used, challenges overcome, and results generated.',
      portfolioHint: 'Personal portfolio, GitHub, Behance, or Drive link',
      clientLinkHint: 'Live project URL, deployed app, or published link',
      fileUploadTitle: 'Attach Work Deliverables & Proofs',
      fileUploadHint: 'Attach PDFs, screenshots, analytics exports, or case study documents',
      defaultMetric1Label: 'Key Result',
      defaultMetric1Val: '95%',
      defaultMetric2Label: 'Output Scale',
      defaultMetric2Val: '10+ Units',
      suggestedMetrics: [
        NicheMetricPreset(label: 'Key Result', placeholderVal: '95%', description: 'Core Success Metric'),
        NicheMetricPreset(label: 'Output Scale', placeholderVal: '10+ Units', description: 'Volume of Work Delivered'),
        NicheMetricPreset(label: 'Execution Speed', placeholderVal: '3 Days', description: 'Turnaround Time'),
        NicheMetricPreset(label: 'Accuracy Rate', placeholderVal: '99%', description: 'Quality Compliance'),
      ],
    );
  }
}
