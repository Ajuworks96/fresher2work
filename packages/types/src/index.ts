/**
 * User Roles and System Enums
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum WorkMode {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ON_SITE = 'ON_SITE',
  ANY = 'ANY',
}

export enum AvailabilityOption {
  IMMEDIATE = 'IMMEDIATE',
  WITHIN_15_DAYS = 'WITHIN_15_DAYS',
  WITHIN_30_DAYS = 'WITHIN_30_DAYS',
  WITHIN_60_DAYS = 'WITHIN_60_DAYS',
  CUSTOM_DATE = 'CUSTOM_DATE',
}

export enum ModerationStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED',
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CompanyVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ContactChannel {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  LINKEDIN = 'LINKEDIN',
}

/**
 * Student Domain Models
 */
export interface StudentEducation {
  id: string;
  studentId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  gradeOrCgpa?: string;
}

export interface StudentProject {
  id: string;
  studentId: string;
  title: string;
  description: string;
  role?: string;
  toolsUsed: string[];
  skillsDemonstrated: string[];
  projectLink?: string;
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  mediaUrls: string[];
  techStack: string[];
  orderIndex: number;
}

export enum WorkSampleCategory {
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  CAMPAIGN = 'CAMPAIGN',
  WEBSITE = 'WEBSITE',
  BRANDING = 'BRANDING',
  MARKETING = 'MARKETING',
  CONTENT = 'CONTENT',
  OTHER = 'OTHER',
}

export interface StudentWorkSample {
  id: string;
  studentId: string;
  title: string;
  category: WorkSampleCategory;
  description: string;
  mediaUrls: string[];
  workLink?: string;
  clientOrContext?: string;
  toolsUsed: string[];
  orderIndex: number;
  createdAt: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillName: string;
  proficiencyLevel: SkillLevel;
  isVerified: boolean;
}

export interface StudentCertificate {
  id: string;
  studentId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
  certificateFileUrl?: string;
}

export enum RelocationPreference {
  WILLING = 'WILLING',
  DOMESTIC_ONLY = 'DOMESTIC_ONLY',
  INTERNATIONAL_ONLY = 'INTERNATIONAL_ONLY',
  NOT_WILLING = 'NOT_WILLING',
}

export enum WorkType {
  FULL_TIME = 'FULL_TIME',
  INTERNSHIP = 'INTERNSHIP',
  CONTRACT = 'CONTRACT',
  PART_TIME = 'PART_TIME',
  FREELANCE = 'FREELANCE',
}

export interface StudentPreferences {
  id: string;
  studentId: string;
  preferredRoles: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  preferredCountries: string[];
  workModes: WorkMode[];
  workMode: WorkMode;
  relocationWillingness: RelocationPreference;
  availability: AvailabilityOption;
  availableFromDate?: string;
  preferredWorkTypes: WorkType[];
  expectedSalaryMin?: number;
  salaryCurrency?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  about: string;
  avatarUrl?: string;
  cvFileUrl?: string;
  cvFileName?: string;
  cvFileSize?: number;
  cvUploadedAt?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  city?: string;
  country?: string;
  completenessScore: number;
  isActivated: boolean;
  activatedAt?: string;
  moderationStatus: ModerationStatus;
  moderationNotes?: string;
  publicSlug: string;
  education: StudentEducation[];
  projects: StudentProject[];
  workSamples: StudentWorkSample[];
  skills: StudentSkill[];
  certificates: StudentCertificate[];
  preferences?: StudentPreferences;
  isHired?: boolean;
  placement?: PlacementRecord;
  createdAt: string;
  updatedAt: string;
}

/**
 * Verified In-App Placement Record
 */
export interface PlacementRecord {
  id: string;
  studentId: string;
  recruiterId: string;
  companyId: string;
  roleTitle: string;
  packageLpa?: string;
  notes?: string;
  hiredAt: string;
  createdAt?: string;
  companyName?: string;
  company?: CompanyProfile;
  recruiter?: RecruiterProfile;
  student?: StudentProfile;
}

/**
 * Recruiter & Company Domain Models
 */
export interface CompanyProfile {
  id: string;
  name: string;
  website?: string;
  logoUrl?: string;
  location: string;
  industry: string;
  verificationStatus: CompanyVerificationStatus;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  fullName: string;
  designation: string;
  businessEmail: string;
  phone?: string;
  linkedinUrl?: string;
  companyId: string;
  company?: CompanyProfile;
}

export interface ShortlistRecord {
  id: string;
  recruiterId: string;
  studentId: string;
  student?: StudentProfile;
  note?: string;
  createdAt: string;
}

export interface ContactEvent {
  id: string;
  recruiterId: string;
  studentId: string;
  channel: ContactChannel;
  createdAt: string;
}

/**
 * Payment & Activation Models
 */
export interface PaymentRecord {
  id: string;
  studentId: string;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amountPaise: number; // 9900 = ₹99.00
  currency: string;    // "INR"
  status: PaymentStatus;
  signature?: string;
  createdAt: string;
  verifiedAt?: string;
}

/**
 * Search & Discovery Types
 */
export type TalentSortOption = 'RELEVANCE' | 'COMPLETENESS' | 'MOST_RECENT' | 'PROJECTS_COUNT';

export interface TalentSearchFilter {
  q?: string;
  skills?: string[];
  roles?: string[];
  locations?: string[];
  countries?: string[];
  workMode?: WorkMode[];
  availability?: AvailabilityOption[];
  education?: string[];
  minCompleteness?: number;
  categories?: string[];
  hasCvOnly?: boolean;
  hasProjectsOnly?: boolean;
  hasWorkSamplesOnly?: boolean;
  hasCertificatesOnly?: boolean;
  sort?: TalentSortOption;
  page?: number;
  limit?: number;
}

export interface TalentFacetCount {
  name: string;
  count: number;
}

export interface TalentSearchResult {
  talents: StudentProfile[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  facetCounts: {
    skills: TalentFacetCount[];
    locations: TalentFacetCount[];
    workModes: { mode: WorkMode; count: number }[];
    roles: TalentFacetCount[];
    education: TalentFacetCount[];
  };
}

/**
 * Granular Profile Completeness Calculation
 */
export interface CompletenessBreakdown {
  score: number;
  hasBasicInfo: boolean;     // 15%
  hasAvatar: boolean;        // 10%
  hasEducation: boolean;     // 15%
  hasSkills: boolean;        // 15%
  hasProjects: boolean;      // 15%
  hasCertificates: boolean;  // 10%
  hasCv: boolean;            // 10%
  hasPreferences: boolean;   // 10%
  canActivate: boolean;      // requires score >= 70%
  missingSteps: string[];
  sectionScores: {
    basicInfo: { earned: number; max: number; isComplete: boolean };
    avatar: { earned: number; max: number; isComplete: boolean };
    education: { earned: number; max: number; isComplete: boolean };
    skills: { earned: number; max: number; isComplete: boolean };
    projects: { earned: number; max: number; isComplete: boolean };
    certificates: { earned: number; max: number; isComplete: boolean };
    cv: { earned: number; max: number; isComplete: boolean };
    preferences: { earned: number; max: number; isComplete: boolean };
  };
}

export function calculateCompleteness(profile: Partial<StudentProfile>): CompletenessBreakdown {
  const missingSteps: string[] = [];
  let score = 0;

  // 1. Basic Info (15%) - Name, Headline, About
  const hasBasicInfo = Boolean(
    profile.fullName?.trim() &&
    profile.headline?.trim() &&
    profile.about?.trim() &&
    profile.about.trim().length >= 10
  );
  if (hasBasicInfo) {
    score += 15;
  } else {
    missingSteps.push('Add full name, headline & about');
  }

  // 2. Profile Photo (10%)
  const hasAvatar = Boolean(profile.avatarUrl?.trim());
  if (hasAvatar) {
    score += 10;
  } else {
    missingSteps.push('Upload a profile photo');
  }

  // 3. Education (15%)
  const hasEducation = Boolean(profile.education && profile.education.length > 0);
  if (hasEducation) {
    score += 15;
  } else {
    missingSteps.push('Add college or degree details');
  }

  // 4. Skills (15%) - At least 3 skills
  const skillCount = profile.skills?.length || 0;
  const hasSkills = skillCount >= 3;
  let skillEarned = 0;
  if (hasSkills) {
    skillEarned = 15;
    score += 15;
  } else if (skillCount > 0) {
    skillEarned = 10;
    score += 10;
    missingSteps.push(`Add ${3 - skillCount} more skill${3 - skillCount > 1 ? 's' : ''}`);
  } else {
    missingSteps.push('Add at least 3 skills');
  }

  // 5. Proof of Work & Work Samples (15%) - 2 items recommended
  const projectCount = (profile.projects?.length || 0) + (profile.workSamples?.length || 0);
  const hasProjects = projectCount >= 2;
  let projectEarned = 0;
  if (projectCount >= 2) {
    projectEarned = 15;
    score += 15;
  } else if (projectCount === 1) {
    projectEarned = 10;
    score += 10;
    missingSteps.push('Add 1 more project');
  } else {
    missingSteps.push('Add 2 projects');
  }

  // 6. Certificates & Credentials (10%)
  const certCount = profile.certificates?.length || 0;
  const hasCertificates = certCount >= 1;
  const certEarned = hasCertificates ? 10 : 0;
  if (hasCertificates) {
    score += 10;
  } else {
    missingSteps.push('Add certificate');
  }

  // 7. Existing CV PDF (10%)
  const hasCv = Boolean(profile.cvFileUrl?.trim());
  const cvEarned = hasCv ? 10 : 0;
  if (hasCv) {
    score += 10;
  } else {
    missingSteps.push('Upload CV');
  }

  // 8. Career Preferences (10%) - Roles, Locations, Work Mode, Availability
  const hasPreferences = Boolean(
    profile.preferences &&
    profile.preferences.preferredRoles?.length > 0 &&
    profile.preferences.preferredLocations?.length > 0
  );
  const prefEarned = hasPreferences ? 10 : 0;
  if (hasPreferences) {
    score += 10;
  } else {
    missingSteps.push('Set career & location preferences');
  }

  return {
    score: Math.min(100, score),
    hasBasicInfo,
    hasAvatar,
    hasEducation,
    hasSkills,
    hasProjects,
    hasCertificates,
    hasCv,
    hasPreferences,
    canActivate: score >= 70,
    missingSteps,
    sectionScores: {
      basicInfo: { earned: hasBasicInfo ? 15 : 0, max: 15, isComplete: hasBasicInfo },
      avatar: { earned: hasAvatar ? 10 : 0, max: 10, isComplete: hasAvatar },
      education: { earned: hasEducation ? 15 : 0, max: 15, isComplete: hasEducation },
      skills: { earned: skillEarned, max: 15, isComplete: hasSkills },
      projects: { earned: projectEarned, max: 15, isComplete: hasProjects },
      certificates: { earned: certEarned, max: 10, isComplete: hasCertificates },
      cv: { earned: cvEarned, max: 10, isComplete: hasCv },
      preferences: { earned: prefEarned, max: 10, isComplete: hasPreferences },
    },
  };
}
