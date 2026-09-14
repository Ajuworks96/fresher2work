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
