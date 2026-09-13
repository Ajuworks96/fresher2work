import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@fresher2work/ui-tokens';
import {
  SkillLevel,
  WorkMode,
  AvailabilityOption,
  UserRole,
} from '@fresher2work/types';
import { apiClient } from '../../src/services/api';
import { secureStorage } from '../../src/lib/secureStorage';

const TOTAL_STEPS = 10;
const STORAGE_DRAFT_KEY = 'fresher2work_onboarding_draft';

// Curated avatar choices for freshers
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
];

const SUGGESTED_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Python',
  'Node.js',
  'Java',
  'C++',
  'SQL',
  'HTML & CSS',
  'Tailwind CSS',
  'Flutter',
  'Next.js',
  'Git & GitHub',
  'UI/UX Design',
  'FastAPI',
  'Data Structures & Algorithms',
];

const SUGGESTED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'Software Engineer',
  'QA / Automation Engineer',
  'Data Analyst',
  'AI / ML Engineer',
  'UI / UX Designer',
  'DevOps / Cloud Engineer',
];

const SUGGESTED_LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Mumbai',
  'Delhi NCR',
  'Kochi',
  'Trivandrum',
  'Remote (All India)',
];

export default function OnboardingWizard() {
  const router = useRouter();

  // Wizard Navigation State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form Fields
  // Step 2: Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step 3: Basic Info
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Step 4: Profile Photo
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);

  // Step 5: Education
  const [institutionName, setInstitutionName] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science & Engineering');
  const [startYear, setStartYear] = useState('2021');
  const [endYear, setEndYear] = useState('2025');
  const [gradeOrCgpa, setGradeOrCgpa] = useState('');

  // Step 6: Skills
  const [selectedSkills, setSelectedSkills] = useState<{ skillName: string; proficiencyLevel: SkillLevel }[]>([
    { skillName: 'React', proficiencyLevel: SkillLevel.INTERMEDIATE },
    { skillName: 'JavaScript', proficiencyLevel: SkillLevel.ADVANCED },
    { skillName: 'Git & GitHub', proficiencyLevel: SkillLevel.INTERMEDIATE },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 7: Preferred Roles
  const [preferredRoles, setPreferredRoles] = useState<string[]>(['Frontend Developer', 'Software Engineer']);

  // Step 8: Preferred Locations
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Bengaluru', 'Remote (All India)']);

  // Step 9: Work Mode & Availability
  const [workMode, setWorkMode] = useState<WorkMode>(WorkMode.HYBRID);
  const [availability, setAvailability] = useState<AvailabilityOption>(AvailabilityOption.IMMEDIATE);
  const [expectedSalaryMin, setExpectedSalaryMin] = useState('450000');

  // Load Saved Draft or Existing Session
  useEffect(() => {
    async function initWizard() {
      try {
        const token = await secureStorage.getAuthToken();
        if (token) {
          try {
            const meRes = await apiClient.getStudentProfile();
            if (meRes.profile) {
              const p = meRes.profile;
              setFullName(p.fullName || '');
              setEmail(p.email || '');
              setPhone(p.phone || '');
              setHeadline(p.headline || '');
              setAbout(p.about || '');
              if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
              setGithubUrl(p.githubUrl || '');
              setLinkedinUrl(p.linkedinUrl || '');
              setPortfolioUrl(p.portfolioUrl || '');

              if (p.education && p.education.length > 0) {
                const e = p.education[0];
                setInstitutionName(e.institutionName || '');
                setDegree(e.degree || 'B.Tech');
                setFieldOfStudy(e.fieldOfStudy || '');
                setStartYear(String(e.startYear || 2021));
                setEndYear(String(e.endYear || 2025));
                setGradeOrCgpa(e.gradeOrCgpa || '');
              }

              if (p.skills && p.skills.length > 0) {
                setSelectedSkills(
                  p.skills.map((s) => ({
                    skillName: s.skillName,
                    proficiencyLevel: s.proficiencyLevel,
                  }))
                );
              }

              if (p.preferences) {
                if (p.preferences.preferredRoles?.length) setPreferredRoles(p.preferences.preferredRoles);
                if (p.preferences.preferredLocations?.length) setPreferredLocations(p.preferences.preferredLocations);
                if (p.preferences.workMode) setWorkMode(p.preferences.workMode);
                if (p.preferences.availability) setAvailability(p.preferences.availability);
                if (p.preferences.expectedSalaryMin) setExpectedSalaryMin(String(p.preferences.expectedSalaryMin));
              }

              // Advance to basic info if already registered
              setCurrentStep(3);
            }
          } catch {
            // Token may be invalid or expired
          }
        }
      } catch (err) {
        console.warn('Draft load error', err);
      } finally {
        setInitialLoading(false);
      }
    }
    initWizard();
  }, []);

  // Save Progress Handler
  const handleNextStep = async () => {
    // Step-by-Step Validation & API Sync
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!fullName.trim()) {
        Alert.alert('Validation Error', 'Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        Alert.alert('Validation Error', 'Please enter a valid email address');
        return;
      }
      if (!password || password.length < 6) {
        Alert.alert('Validation Error', 'Password must be at least 6 characters');
        return;
      }

      setLoading(true);
      try {
        const token = await secureStorage.getAuthToken();
        if (!token) {
          const regRes = await apiClient.register({
            fullName,
            email,
            phone: phone || undefined,
            password,
            role: UserRole.STUDENT,
          });
          await secureStorage.saveAuthToken(regRes.token);
          await secureStorage.saveUserData(regRes.user);
        }
        setCurrentStep(3);
      } catch (err: any) {
        Alert.alert('Registration Failed', err.message || 'Could not create account');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      if (!headline.trim()) {
        Alert.alert('Validation Error', 'Please enter a professional headline (e.g., React & Node.js Developer)');
        return;
      }
      if (!about.trim() || about.trim().length < 15) {
        Alert.alert('Validation Error', 'Please write at least a few sentences about your background and interests');
        return;
      }

      setLoading(true);
      try {
        await apiClient.updateStudentProfile({
          fullName,
          headline,
          about,
          githubUrl: githubUrl || undefined,
          linkedinUrl: linkedinUrl || undefined,
          portfolioUrl: portfolioUrl || undefined,
        });
        setCurrentStep(4);
      } catch (err: any) {
        Alert.alert('Save Failed', err.message || 'Could not save basic info');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 4) {
      setLoading(true);
      try {
        await apiClient.updateStudentProfile({
          avatarUrl: avatarUrl || undefined,
        });
        setCurrentStep(5);
      } catch (err: any) {
        Alert.alert('Save Failed', err.message || 'Could not save profile photo');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 5) {
      if (!institutionName.trim()) {
        Alert.alert('Validation Error', 'Please enter your college or institute name');
        return;
      }
      if (!degree.trim() || !fieldOfStudy.trim()) {
        Alert.alert('Validation Error', 'Please provide your degree and field of study');
        return;
      }

      setLoading(true);
      try {
        await apiClient.addEducation({
          institutionName,
          degree,
          fieldOfStudy,
          startYear: parseInt(startYear, 10) || 2021,
          endYear: parseInt(endYear, 10) || 2025,
          gradeOrCgpa: gradeOrCgpa || undefined,
        });
        setCurrentStep(6);
      } catch (err: any) {
        Alert.alert('Save Failed', err.message || 'Could not save education');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 6) {
      if (selectedSkills.length < 3) {
        Alert.alert('Skills Required', 'Please select at least 3 skills to build a strong profile');
        return;
      }

      setLoading(true);
      try {
        await apiClient.updateSkills(
          selectedSkills.map((s) => ({
            skillName: s.skillName,
            proficiencyLevel: s.proficiencyLevel,
            isVerified: false,
          }))
        );
        setCurrentStep(7);
      } catch (err: any) {
        Alert.alert('Save Failed', err.message || 'Could not save skills');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 7) {
      if (preferredRoles.length === 0) {
        Alert.alert('Selection Required', 'Please choose at least 1 target job role');
        return;
      }
      setCurrentStep(8);
      return;
    }

    if (currentStep === 8) {
      if (preferredLocations.length === 0) {
        Alert.alert('Selection Required', 'Please choose at least 1 preferred city or Remote');
        return;
      }
      setCurrentStep(9);
      return;
    }

    if (currentStep === 9) {
      setLoading(true);
      try {
        await apiClient.updatePreferences({
          preferredRoles,
          preferredLocations,
          workMode,
          availability,
          expectedSalaryMin: parseInt(expectedSalaryMin, 10) || undefined,
        });
        setCurrentStep(10);
      } catch (err: any) {
        Alert.alert('Save Failed', err.message || 'Could not save preferences');
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 10) {
      // Finished onboarding! Navigate to main profile tab
      router.replace('/(tabs)/profile');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Skill Helpers
  const toggleSkill = (skill: string) => {
    const exists = selectedSkills.find((s) => s.skillName.toLowerCase() === skill.toLowerCase());
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.skillName.toLowerCase() !== skill.toLowerCase()));
    } else {
      setSelectedSkills([...selectedSkills, { skillName: skill, proficiencyLevel: SkillLevel.INTERMEDIATE }]);
    }
  };

  const setSkillLevel = (skillName: string, level: SkillLevel) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.skillName === skillName ? { ...s, proficiencyLevel: level } : s))
    );
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim()) {
      toggleSkill(customSkillInput.trim());
      setCustomSkillInput('');
    }
  };

  const toggleRole = (role: string) => {
    if (preferredRoles.includes(role)) {
      setPreferredRoles(preferredRoles.filter((r) => r !== role));
    } else {
      setPreferredRoles([...preferredRoles, role]);
    }
  };

  const toggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      setPreferredLocations(preferredLocations.filter((l) => l !== loc));
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Initializing talent profile builder...</Text>
      </View>
    );
  }

  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Top Header & Progress Indicator */}
      <View style={styles.headerBar}>
        <View style={styles.headerTopRow}>
          {currentStep > 1 ? (
            <TouchableOpacity onPress={handlePrevStep} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <Text style={styles.stepBadge}>
            Step {currentStep} of {TOTAL_STEPS}
          </Text>

          <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
            <Text style={styles.skipText}>Exit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ========================================================================= */}
        {/* STEP 1: WELCOME */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <View style={styles.stepCard}>
            <View style={styles.iconCircle}>
              <Text style={{ fontSize: 36 }}>🚀</Text>
            </View>
            <Text style={styles.title}>Build Your Talent Profile</Text>
            <Text style={styles.subtitle}>
              FresherToWork is designed specifically for freshers. Create your profile, showcase proof of work, and get discovered by top tech hiring managers.
            </Text>

            <View style={styles.featureListBox}>
              <Text style={styles.featureItem}>✨ Build in 3 simple minutes</Text>
              <Text style={styles.featureItem}>🎯 Tailored for college grads & beginners</Text>
              <Text style={styles.featureItem}>💼 Add verifiable projects & skills</Text>
              <Text style={styles.featureItem}>🔒 Your PII is protected & recruiter-audited</Text>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CREATE ACCOUNT */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Create Student Account</Text>
            <Text style={styles.subtitle}>
              Your account allows you to securely manage your talent profile anytime.
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="rahul@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Mobile Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.neutral[400]}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: BASIC INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Basic Information</Text>
            <Text style={styles.subtitle}>
              Introduce yourself with a clear headline and summary for recruiters.
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Professional Headline *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. React & TypeScript Developer | 2025 Grad"
                value={headline}
                onChangeText={setHeadline}
                placeholderTextColor={COLORS.neutral[400]}
              />
              <Text style={styles.hintText}>Tip: Mention your core skills or primary focus area.</Text>

              <Text style={[styles.label, { marginTop: 14 }]}>About / Professional Summary *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Briefly describe what you build, your technical interests, and what you are looking for..."
                value={about}
                onChangeText={setAbout}
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>GitHub Profile URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://github.com/your-username"
                value={githubUrl}
                onChangeText={setGithubUrl}
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>LinkedIn Profile URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChangeText={setLinkedinUrl}
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={COLORS.neutral[400]}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PROFILE PHOTO */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Profile Photo</Text>
            <Text style={styles.subtitle}>
              Profiles with photos receive 4x more attention from hiring managers.
            </Text>

            <View style={styles.avatarPreviewContainer}>
              <Image source={{ uri: avatarUrl }} style={styles.mainAvatarImage} />
              <Text style={styles.avatarLabel}>Selected Avatar Preview</Text>
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Choose a curated avatar or paste image URL:</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_PRESETS.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setAvatarUrl(preset)}
                  style={[
                    styles.avatarThumbnail,
                    avatarUrl === preset && styles.avatarThumbnailSelected,
                  ]}
                >
                  <Image source={{ uri: preset }} style={styles.thumbnailImg} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Or custom image URL:</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/my-photo.jpg"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              autoCapitalize="none"
              placeholderTextColor={COLORS.neutral[400]}
            />
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: EDUCATION */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Education Background</Text>
            <Text style={styles.subtitle}>
              Add your college or university degree details.
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>College / Institute Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. National Institute of Technology, Calicut"
                value={institutionName}
                onChangeText={setInstitutionName}
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Degree *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. B.Tech / BCA / B.Sc / MCA"
                value={degree}
                onChangeText={setDegree}
                placeholderTextColor={COLORS.neutral[400]}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Field of Study *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Computer Science & Engineering"
                value={fieldOfStudy}
                onChangeText={setFieldOfStudy}
                placeholderTextColor={COLORS.neutral[400]}
              />

              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { marginTop: 14 }]}>Start Year *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2021"
                    value={startYear}
                    onChangeText={setStartYear}
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { marginTop: 14 }]}>Graduation Year *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2025"
                    value={endYear}
                    onChangeText={setEndYear}
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>CGPA / Percentage (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 8.5 CGPA or 85%"
                value={gradeOrCgpa}
                onChangeText={setGradeOrCgpa}
                placeholderTextColor={COLORS.neutral[400]}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: SKILLS */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Skills & Proficiency</Text>
            <Text style={styles.subtitle}>
              Select at least 3 skills you know and rate your level.
            </Text>

            <View style={styles.chipContainer}>
              {SUGGESTED_SKILLS.map((skill, idx) => {
                const isSelected = selectedSkills.some(
                  (s) => s.skillName.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleSkill(skill)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Skill Input */}
            <View style={styles.customInputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Add other skill (e.g. Prisma)..."
                value={customSkillInput}
                onChangeText={setCustomSkillInput}
                placeholderTextColor={COLORS.neutral[400]}
              />
              <TouchableOpacity style={styles.addSkillBtn} onPress={addCustomSkill}>
                <Text style={styles.addSkillBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Skill Rating List */}
            {selectedSkills.length > 0 && (
              <View style={styles.ratingSection}>
                <Text style={styles.sectionHeading}>
                  Your Selected Skills ({selectedSkills.length}):
                </Text>
                {selectedSkills.map((item, idx) => (
                  <View key={idx} style={styles.skillRatingRow}>
                    <Text style={styles.skillRatingName}>{item.skillName}</Text>
                    <View style={styles.levelButtonsGroup}>
                      {[SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED].map((lvl) => (
                        <TouchableOpacity
                          key={lvl}
                          onPress={() => setSkillLevel(item.skillName, lvl)}
                          style={[
                            styles.levelBtn,
                            item.proficiencyLevel === lvl && styles.levelBtnActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.levelBtnText,
                              item.proficiencyLevel === lvl && styles.levelBtnTextActive,
                            ]}
                          >
                            {lvl === SkillLevel.BEGINNER
                              ? 'Beg'
                              : lvl === SkillLevel.INTERMEDIATE
                              ? 'Int'
                              : 'Adv'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: CAREER INTERESTS & PREFERRED ROLES */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Preferred Job Roles</Text>
            <Text style={styles.subtitle}>
              What kinds of entry-level positions are you seeking?
            </Text>

            <View style={styles.chipContainer}>
              {SUGGESTED_ROLES.map((role, idx) => {
                const isSelected = preferredRoles.includes(role);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleRole(role)}
                    style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                  >
                    <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>
                      {isSelected ? '✓ ' : ''}
                      {role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: PREFERRED LOCATIONS */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Preferred Locations</Text>
            <Text style={styles.subtitle}>
              Select cities you are open to working in or choose Remote.
            </Text>

            <View style={styles.chipContainer}>
              {SUGGESTED_LOCATIONS.map((loc, idx) => {
                const isSelected = preferredLocations.includes(loc);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleLocation(loc)}
                    style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                  >
                    <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>
                      {isSelected ? '✓ ' : ''}
                      📍 {loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: WORK MODE & AVAILABILITY */}
        {/* ========================================================================= */}
        {currentStep === 9 && (
          <View style={styles.stepCard}>
            <Text style={styles.title}>Work Mode & Availability</Text>
            <Text style={styles.subtitle}>
              Specify your schedule preferences and when you can join.
            </Text>

            <Text style={styles.label}>Work Mode Preference *</Text>
            <View style={styles.optionButtonGroup}>
              {[
                { label: 'Remote', value: WorkMode.REMOTE },
                { label: 'Hybrid', value: WorkMode.HYBRID },
                { label: 'On-Site', value: WorkMode.ON_SITE },
                { label: 'Any', value: WorkMode.ANY },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setWorkMode(opt.value)}
                  style={[styles.optionBtn, workMode === opt.value && styles.optionBtnSelected]}
                >
                  <Text
                    style={[
                      styles.optionBtnText,
                      workMode === opt.value && styles.optionBtnTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 18 }]}>Availability to Join *</Text>
            <View style={styles.optionButtonGroup}>
              {[
                { label: 'Immediate', value: AvailabilityOption.IMMEDIATE },
                { label: 'Within 15 Days', value: AvailabilityOption.WITHIN_15_DAYS },
                { label: 'Within 30 Days', value: AvailabilityOption.WITHIN_30_DAYS },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setAvailability(opt.value)}
                  style={[
                    styles.optionBtn,
                    availability === opt.value && styles.optionBtnSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionBtnText,
                      availability === opt.value && styles.optionBtnTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 18 }]}>Expected Minimum Salary (₹/Year)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500000"
              value={expectedSalaryMin}
              onChangeText={setExpectedSalaryMin}
              keyboardType="number-pad"
              placeholderTextColor={COLORS.neutral[400]}
            />
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 10: PROFILE REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 10 && (
          <View style={styles.stepCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: avatarUrl }} style={styles.reviewAvatar} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.reviewName}>{fullName || 'Fresher Candidate'}</Text>
                <Text style={styles.reviewHeadline}>{headline}</Text>
                <Text style={styles.reviewDegree}>
                  🎓 {degree} in {fieldOfStudy} ({endYear})
                </Text>
              </View>
            </View>

            <View style={styles.reviewBox}>
              <Text style={styles.reviewSectionTitle}>About</Text>
              <Text style={styles.reviewText}>{about}</Text>
            </View>

            <View style={styles.reviewBox}>
              <Text style={styles.reviewSectionTitle}>
                Skills ({selectedSkills.length})
              </Text>
              <View style={styles.reviewTagRow}>
                {selectedSkills.map((s, idx) => (
                  <View key={idx} style={styles.reviewSkillTag}>
                    <Text style={styles.reviewSkillTagText}>
                      {s.skillName} ({s.proficiencyLevel.toLowerCase()})
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.reviewBox}>
              <Text style={styles.reviewSectionTitle}>Preferred Roles</Text>
              <Text style={styles.reviewText}>{preferredRoles.join(', ')}</Text>
            </View>

            <View style={styles.reviewBox}>
              <Text style={styles.reviewSectionTitle}>Locations & Work Mode</Text>
              <Text style={styles.reviewText}>
                📍 {preferredLocations.join(', ')} • {workMode}
              </Text>
            </View>

            <View style={styles.celebrationBox}>
              <Text style={styles.celebrationText}>
                🎉 Your initial profile is configured and ready for projects!
              </Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleNextStep}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === 1
                ? 'Get Started'
                : currentStep === TOTAL_STEPS
                ? 'Complete & Open Dashboard'
                : 'Save & Continue →'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.neutral[600],
    fontWeight: '500',
  },
  headerBar: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[700],
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[400],
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.brand[500],
    borderRadius: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.brand[50],
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral[900],
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  featureListBox: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    gap: 10,
  },
  featureItem: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[700],
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  textArea: {
    height: 90,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 4,
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  mainAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.brand[500],
  },
  avatarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[500],
    marginTop: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  avatarThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    overflow: 'hidden',
  },
  avatarThumbnailSelected: {
    borderColor: COLORS.brand[600],
    borderWidth: 3,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  chipSelected: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  roleChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    width: '100%',
    marginBottom: 4,
  },
  roleChipSelected: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[500],
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  roleChipTextSelected: {
    color: COLORS.brand[800],
    fontWeight: '700',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  addSkillBtn: {
    backgroundColor: COLORS.neutral[900],
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  addSkillBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  ratingSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    paddingTop: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[700],
    marginBottom: 10,
  },
  skillRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  skillRatingName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[800],
    flex: 1,
  },
  levelButtonsGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  levelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.neutral[100],
  },
  levelBtnActive: {
    backgroundColor: COLORS.brand[600],
  },
  levelBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[600],
  },
  levelBtnTextActive: {
    color: '#ffffff',
  },
  optionButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  optionBtn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  optionBtnSelected: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[500],
  },
  optionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  optionBtnTextSelected: {
    color: COLORS.brand[800],
    fontWeight: '700',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  reviewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.brand[500],
  },
  reviewName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  reviewHeadline: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  reviewDegree: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 2,
  },
  reviewBox: {
    backgroundColor: COLORS.neutral[50],
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 10,
  },
  reviewSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[400],
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.neutral[800],
    lineHeight: 18,
  },
  reviewTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  reviewSkillTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  reviewSkillTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  celebrationBox: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 10,
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[800],
    textAlign: 'center',
  },
  primaryButton: {
    height: 50,
    backgroundColor: COLORS.brand[600],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.brand[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
