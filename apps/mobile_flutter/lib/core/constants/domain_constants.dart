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
    this.candidateName = 'Arjun Krishnan',
    this.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    this.rating = 4.9,
    this.reviewCount = 128,
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
      candidateName: json['candidateName'] ?? 'Arjun Krishnan',
      avatarUrl: json['avatarUrl'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.9,
      reviewCount: json['reviewCount'] ?? 128,
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
    required this.candidateName,
    required this.candidateDegree,
    required this.salaryRange,
    this.hourlyRate = '₹650/hr',
    this.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    required this.description,
    required this.skills,
    required this.subjectPills,
    required this.exploreCategories,
    required this.proofTypes,
    required this.sampleProjects,
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
      candidateName: 'Arjun Krishnan',
      candidateDegree: 'BBA Marketing • Meta Ads Certified',
      salaryRange: '₹4.5 - ₹7.5 LPA',
      hourlyRate: '₹650/hr',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
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
      sampleProjects: [
        ProofItem(
          categoryBadge: 'Meta Ads',
          title: 'E-commerce Brand Meta Ads Campaign',
          subtitle: 'Generated 4.8x ROAS with ₹35 CPL on Instagram & Facebook. Managed ₹50k ad spend with live pixel tracking.',
          metrics: [
            {'label': 'ROAS', 'val': '4.8x'},
            {'label': 'Leads Generated', 'val': '340+'},
            {'label': 'Avg CPL', 'val': '₹35'},
          ],
          personalPortfolioUrl: 'https://arjunkrishnan.marketing',
          clientProjectUrl: 'https://business.facebook.com/adsmanager/campaigns',
          linkText: 'View Meta Ads Manager Live Proof',
          tags: ['Meta Ads', 'Media Buying', 'Retargeting Pixel', 'Ad Copy'],
          attachedFiles: ['meta_ads_roas_campaign.png', 'meta_ads_manager_export.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.9,
          reviewCount: 142,
        ),
        ProofItem(
          categoryBadge: 'Websites',
          title: 'Direct-to-Consumer Brand Store & Portfolio',
          subtitle: 'Built high-converting landing page and connected tracking pixels. Generated ₹1.2L revenue in 30 days.',
          metrics: [
            {'label': 'Conversion', 'val': '3.8%'},
            {'label': 'Avg Speed', 'val': '1.2s'},
            {'label': 'Monthly Visitors', 'val': '12k+'},
          ],
          personalPortfolioUrl: 'https://arjunkrishnan.marketing/works',
          clientProjectUrl: 'https://keralanaturalbrands.shop',
          linkText: 'Visit Live Client Website',
          tags: ['Web Design', 'Shopify', 'Conversion Rate', 'Tracking'],
          attachedFiles: ['landing_page_analytics.png', 'client_feedback_sheet.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.8,
          reviewCount: 96,
        ),
        ProofItem(
          categoryBadge: 'SEO',
          title: 'Tourism Portal 90-Day Organic Growth',
          subtitle: 'Ranked target keywords in Google Top 3 within 90 days. Boosted organic visitors by 380%.',
          metrics: [
            {'label': 'Organic Traffic', 'val': '+380%'},
            {'label': 'Top Keywords', 'val': '14'},
            {'label': 'Domain Score', 'val': '28 DA'},
          ],
          personalPortfolioUrl: 'https://arjunkrishnan.marketing/seo',
          clientProjectUrl: 'https://search.google.com/search-console',
          linkText: 'View GSC Ranking Live Report',
          tags: ['SEO', 'Analytics', 'Keyword Strategy', 'Technical Audit'],
          attachedFiles: ['gsc_ranking_proof_90days.png', 'seo_keyword_audit_report.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 5.0,
          reviewCount: 118,
        ),
        ProofItem(
          categoryBadge: 'Content Marketing',
          title: 'Viral Instagram Growth & Lead Funnel',
          subtitle: 'Created 20+ viral content scripts, infographics, and lead magnets generating 45k organic accounts reached.',
          metrics: [
            {'label': 'Accounts Reached', 'val': '45k+'},
            {'label': 'Engagement', 'val': '8.4%'},
            {'label': 'Inbound DMs', 'val': '160+'},
          ],
          personalPortfolioUrl: 'https://arjunkrishnan.marketing/content',
          clientProjectUrl: 'https://instagram.com/growth_funnels',
          linkText: 'View Content Case Study',
          tags: ['Content Marketing', 'Copywriting', 'Lead Magnet', 'Social Reach'],
          attachedFiles: ['content_calendar_export.pdf', 'viral_post_reach_analytics.jpg'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.9,
          reviewCount: 88,
        ),
      ],
    ),
    FresherDomain(
      id: 'graphic_design',
      title: 'Graphic Design',
      shortTitle: 'Graphic Design',
      icon: Icons.palette_outlined,
      roleTitle: 'Brand Identity & Visual Designer',
      candidateName: 'Arjun Krishnan',
      candidateDegree: 'B.Des Visual Communication',
      salaryRange: '₹4.0 - ₹7.0 LPA',
      hourlyRate: '₹550/hr',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
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
      sampleProjects: [
        ProofItem(
          categoryBadge: 'Brand Identity',
          title: 'Tech Summit Visual Identity & Guidelines',
          subtitle: 'Designed comprehensive brand guidelines, 24+ event posters, banners, and merch kit.',
          metrics: [
            {'label': 'Creatives Made', 'val': '24 Assets'},
            {'label': 'Tools Used', 'val': 'Photoshop & Figma'},
            {'label': 'Style Guide', 'val': '32 Pages'},
          ],
          personalPortfolioUrl: 'https://behance.net/arjun_design',
          clientProjectUrl: 'https://techsummit2026.design',
          linkText: 'View Behance High-Res Gallery',
          tags: ['Photoshop', 'Illustrator', 'Event Branding', 'Typography'],
          attachedFiles: ['event_main_poster.png', 'brand_identity_guide.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          rating: 4.9,
          reviewCount: 110,
        ),
      ],
    ),
    FresherDomain(
      id: 'ui_ux_design',
      title: 'UI/UX Design',
      shortTitle: 'UI/UX Design',
      icon: Icons.smartphone_rounded,
      roleTitle: 'Product & Mobile UI/UX Designer',
      candidateName: 'Arjun Krishnan',
      candidateDegree: 'B.Des Interaction Design • Google UX Certified',
      salaryRange: '₹5.5 - ₹8.5 LPA',
      hourlyRate: '₹750/hr',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
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
      sampleProjects: [
        ProofItem(
          categoryBadge: 'Mobile Apps',
          title: 'Fintech Mobile App UI & Design System',
          subtitle: 'End-to-end UX wireframes and 48 high-fidelity screens in Figma with interactive micro-animations.',
          metrics: [
            {'label': 'Figma Screens', 'val': '48 Screens'},
            {'label': 'Usability Score', 'val': '94/100'},
            {'label': 'Components', 'val': '120+ Tokens'},
          ],
          personalPortfolioUrl: 'https://figma.com/@arjun_ux',
          clientProjectUrl: 'https://www.figma.com/proto/fintech_demo',
          linkText: 'Open Interactive Figma Prototype',
          tags: ['Figma', 'Mobile UI', 'Auto Layout', 'Design System'],
          attachedFiles: ['fintech_app_screens.png', 'ux_case_study.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          rating: 4.9,
          reviewCount: 95,
        ),
      ],
    ),
    FresherDomain(
      id: 'video_editing',
      title: 'Video Editing',
      shortTitle: 'Video Editing',
      icon: Icons.videocam_outlined,
      roleTitle: 'Video Editor & Motion Artist',
      candidateName: 'Arjun Krishnan',
      candidateDegree: 'BA Multimedia & Film Production',
      salaryRange: '₹4.5 - ₹8.0 LPA',
      hourlyRate: '₹600/hr',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
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
      sampleProjects: [
        ProofItem(
          categoryBadge: 'Reels & Shorts',
          title: 'Brand Growth Video Package',
          subtitle: 'Edited fast-paced Instagram Reels with sound effects, kinetic typography captions, and motion graphics.',
          metrics: [
            {'label': 'Total Views', 'val': '450k+'},
            {'label': 'Avg Retention', 'val': '84%'},
            {'label': 'Sound Design', 'val': 'Custom SFX'},
          ],
          personalPortfolioUrl: 'https://instagram.com/arjun_edits',
          clientProjectUrl: 'https://youtube.com/showreel/arjun',
          linkText: 'Watch Video Portfolio',
          tags: ['Premiere Pro', 'After Effects', 'Subtitles', 'Sound Design'],
          attachedFiles: ['davinci_timeline.png', 'reels_analytics_proof.jpg'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
          rating: 4.8,
          reviewCount: 82,
        ),
      ],
    ),
    FresherDomain(
      id: 'software_dev',
      title: 'Software Development',
      shortTitle: 'Software Dev',
      icon: Icons.code_rounded,
      roleTitle: 'Full Stack & Mobile Developer',
      candidateName: 'Arjun Krishnan',
      candidateDegree: 'B.Tech Computer Science',
      salaryRange: '₹6.0 - ₹10.0 LPA',
      hourlyRate: '₹850/hr',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
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
      sampleProjects: [
        ProofItem(
          categoryBadge: 'Web Apps',
          title: 'Proof-of-Work Platform & Dashboard',
          subtitle: 'Full-stack application built with Next.js, Node.js, Prisma, and PostgreSQL with verified candidate showcase.',
          metrics: [
            {'label': 'GitHub Stars', 'val': '52'},
            {'label': 'Performance', 'val': '98/100'},
            {'label': 'API Uptime', 'val': '99.9%'},
          ],
          personalPortfolioUrl: 'https://github.com/arjunkrishnan',
          clientProjectUrl: 'https://fresher2work-platform.vercel.app',
          linkText: 'View Live Demo & GitHub Repo',
          tags: ['Flutter', 'Next.js', 'PostgreSQL', 'Prisma'],
          attachedFiles: ['github_repo_insights.png', 'database_schema.pdf'],
          candidateName: 'Arjun Krishnan',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
          rating: 5.0,
          reviewCount: 154,
        ),
      ],
    ),
  ];

  static FresherDomain getDomainById(String id) {
    return domains.firstWhere(
      (d) => d.id == id,
      orElse: () => domains.first,
    );
  }
}
