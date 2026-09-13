import React, { useEffect, useState } from 'react';
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
import { StudentProfile, SkillLevel, WorkMode, AvailabilityOption } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [cvFileUrl, setCvFileUrl] = useState('');

  // Education (Primary entry)
  const [institutionName, setInstitutionName] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('2021');
  const [endYear, setEndYear] = useState('2025');
  const [gradeOrCgpa, setGradeOrCgpa] = useState('');

  // Skills
  const [skills, setSkills] = useState<{ skillName: string; proficiencyLevel: SkillLevel }[]>([]);
  const [newSkillName, setNewSkillName] = useState('');

  // Certificates
  const [certificates, setCertificates] = useState<{ id?: string; name: string; issuingOrganization: string; issueDate: string; credentialUrl?: string }[]>([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');

  // Projects
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDemoUrl, setNewProjDemoUrl] = useState('');
  const [newProjGithubUrl, setNewProjGithubUrl] = useState('');
  const [newProjTechInput, setNewProjTechInput] = useState('');

  // Preferences
  const [preferredRolesInput, setPreferredRolesInput] = useState('');
  const [preferredLocationsInput, setPreferredLocationsInput] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>(WorkMode.HYBRID);
  const [availability, setAvailability] = useState<AvailabilityOption>(AvailabilityOption.IMMEDIATE);
  const [expectedSalaryMin, setExpectedSalaryMin] = useState('500000');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.getStudentProfile();
        if (res.profile) {
          const p = res.profile;
          setFullName(p.fullName || '');
          setHeadline(p.headline || '');
          setAbout(p.about || '');
          setAvatarUrl(p.avatarUrl || AVATAR_OPTIONS[0]);
          setGithubUrl(p.githubUrl || '');
          setLinkedinUrl(p.linkedinUrl || '');
          setPortfolioUrl(p.portfolioUrl || '');
          setCvFileUrl(p.cvFileUrl || '');

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
            setSkills(
              p.skills.map((s) => ({
                skillName: s.skillName,
                proficiencyLevel: s.proficiencyLevel,
              }))
            );
          }

          if (p.certificates && p.certificates.length > 0) {
            setCertificates(p.certificates);
          }

          if (p.projects && p.projects.length > 0) {
            setProjects(p.projects);
          }

          if (p.preferences) {
            setPreferredRolesInput(p.preferences.preferredRoles?.join(', ') || '');
            setPreferredLocationsInput(p.preferences.preferredLocations?.join(', ') || '');
            if (p.preferences.workMode) setWorkMode(p.preferences.workMode);
            if (p.preferences.availability) setAvailability(p.preferences.availability);
            if (p.preferences.expectedSalaryMin) setExpectedSalaryMin(String(p.preferences.expectedSalaryMin));
          }
        }
      } catch (err) {
        console.warn('Load profile error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { skillName: newSkillName.trim(), proficiencyLevel: SkillLevel.INTERMEDIATE }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (name: string) => {
    setSkills(skills.filter((s) => s.skillName !== name));
  };

  const handleAddCertificate = async () => {
    if (!newCertName.trim() || !newCertOrg.trim()) {
      Alert.alert('Missing Fields', 'Certificate name and issuing organization are required.');
      return;
    }
    try {
      const res = await apiClient.addCertificate({
        name: newCertName.trim(),
        issuingOrganization: newCertOrg.trim(),
        issueDate: newCertDate.trim() || '2025',
        credentialUrl: newCertUrl.trim() || undefined,
      });
      setCertificates(res.profile.certificates || []);
      setNewCertName('');
      setNewCertOrg('');
      setNewCertDate('');
      setNewCertUrl('');
      Alert.alert('Success', 'Certificate added to profile!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add certificate');
    }
  };

  const handleRemoveCertificate = async (id: string) => {
    try {
      const res = await apiClient.deleteCertificate(id);
      setCertificates(res.profile.certificates || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to remove certificate');
    }
  };

  const handleAddProject = async () => {
    if (!newProjTitle.trim() || !newProjDesc.trim()) {
      Alert.alert('Missing Fields', 'Project title and description are required.');
      return;
    }
    const techStack = newProjTechInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await apiClient.addProject({
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        liveDemoUrl: newProjDemoUrl.trim() || undefined,
        githubRepoUrl: newProjGithubUrl.trim() || undefined,
        techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
        mediaUrls: [],
      });
      setProjects(res.profile.projects || []);
      setNewProjTitle('');
      setNewProjDesc('');
      setNewProjDemoUrl('');
      setNewProjGithubUrl('');
      setNewProjTechInput('');
      Alert.alert('Success', 'Project added to portfolio!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add project');
    }
  };

  const handleRemoveProject = async (id: string) => {
    try {
      const res = await apiClient.deleteProject(id);
      setProjects(res.profile.projects || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to remove project');
    }
  };

  const handleSaveAll = async () => {
    if (!fullName.trim() || !headline.trim()) {
      Alert.alert('Missing Required Fields', 'Please ensure full name and headline are provided.');
      return;
    }

    setSaving(true);
    try {
      // 1. Save Basic Profile
      await apiClient.updateStudentProfile({
        fullName,
        headline,
        about,
        avatarUrl: avatarUrl || undefined,
        githubUrl: githubUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
      });

      // 2. Save Education if provided
      if (institutionName.trim() && degree.trim()) {
        await apiClient.addEducation({
          institutionName,
          degree,
          fieldOfStudy: fieldOfStudy || 'Computer Science',
          startYear: parseInt(startYear, 10) || 2021,
          endYear: parseInt(endYear, 10) || 2025,
          gradeOrCgpa: gradeOrCgpa || undefined,
        });
      }

      // 3. Save Skills
      if (skills.length > 0) {
        await apiClient.updateSkills(
          skills.map((s) => ({
            skillName: s.skillName,
            proficiencyLevel: s.proficiencyLevel,
            isVerified: false,
          }))
        );
      }

      // 4. Save CV if updated
      if (cvFileUrl.trim()) {
        await apiClient.confirmCv(cvFileUrl.trim());
      }

      // 5. Save Preferences
      const preferredRoles = preferredRolesInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
      const preferredLocations = preferredLocationsInput
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      if (preferredRoles.length > 0 || preferredLocations.length > 0) {
        await apiClient.updatePreferences({
          preferredRoles: preferredRoles.length > 0 ? preferredRoles : ['Software Engineer'],
          preferredLocations: preferredLocations.length > 0 ? preferredLocations : ['Remote'],
          workMode,
          availability,
          expectedSalaryMin: parseInt(expectedSalaryMin, 10) || undefined,
        });
      }

      Alert.alert('Success', 'Your talent profile has been updated!');
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      Alert.alert('Save Failed', err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Title */}
        <View style={styles.topHeader}>
          <Text style={styles.pageHeading}>Edit Talent Profile</Text>
          <Text style={styles.pageSubheading}>
            Update your proof of work, skills, and preferences to attract top recruiters.
          </Text>
        </View>

        {/* 1. Profile Photo */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>1. Profile Photo</Text>
          <View style={styles.avatarRow}>
            <Image source={{ uri: avatarUrl || AVATAR_OPTIONS[0] }} style={styles.avatarImage} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.avatarHint}>Choose from curated avatars:</Text>
              <View style={styles.avatarPickerRow}>
                {AVATAR_OPTIONS.map((url, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setAvatarUrl(url)}
                    style={[
                      styles.avatarThumb,
                      avatarUrl === url && styles.avatarThumbActive,
                    ]}
                  >
                    <Image source={{ uri: url }} style={styles.thumbImg} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 2. Basic Info */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>2. Basic Information</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Professional Headline *</Text>
          <TextInput
            style={styles.input}
            value={headline}
            onChangeText={setHeadline}
            placeholder="e.g. React & Node.js Developer | 2025 Grad"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>About / Summary *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={about}
            onChangeText={setAbout}
            placeholder="Describe your coding journey, what you build, and your interests..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 3. Links */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>3. Professional & Code Links</Text>

          <Text style={styles.label}>GitHub Profile URL</Text>
          <TextInput
            style={styles.input}
            value={githubUrl}
            onChangeText={setGithubUrl}
            placeholder="https://github.com/username"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>LinkedIn Profile URL</Text>
          <TextInput
            style={styles.input}
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            placeholder="https://linkedin.com/in/username"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Portfolio / Website URL</Text>
          <TextInput
            style={styles.input}
            value={portfolioUrl}
            onChangeText={setPortfolioUrl}
            placeholder="https://yourportfolio.me"
            autoCapitalize="none"
          />
        </View>

        {/* 4. Education */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>4. Education Details</Text>

          <Text style={styles.label}>College / Institute Name</Text>
          <TextInput
            style={styles.input}
            value={institutionName}
            onChangeText={setInstitutionName}
            placeholder="e.g. NIT Calicut"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Degree</Text>
          <TextInput
            style={styles.input}
            value={degree}
            onChangeText={setDegree}
            placeholder="e.g. B.Tech / BCA"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Field of Study</Text>
          <TextInput
            style={styles.input}
            value={fieldOfStudy}
            onChangeText={setFieldOfStudy}
            placeholder="e.g. Computer Science"
          />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { marginTop: 12 }]}>Start Year</Text>
              <TextInput
                style={styles.input}
                value={startYear}
                onChangeText={setStartYear}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { marginTop: 12 }]}>Graduation Year</Text>
              <TextInput
                style={styles.input}
                value={endYear}
                onChangeText={setEndYear}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>CGPA / Grade</Text>
          <TextInput
            style={styles.input}
            value={gradeOrCgpa}
            onChangeText={setGradeOrCgpa}
            placeholder="e.g. 8.8 CGPA"
          />
        </View>

        {/* 5. Skills */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>5. Skills & Ratings</Text>

          <View style={styles.addSkillRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newSkillName}
              onChangeText={setNewSkillName}
              placeholder="Add skill (e.g. TypeScript)..."
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddSkill}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.skillListWrap}>
            {skills.map((s, idx) => (
              <View key={idx} style={styles.skillTagItem}>
                <Text style={styles.skillTagName}>{s.skillName}</Text>
                <TouchableOpacity onPress={() => handleRemoveSkill(s.skillName)}>
                  <Text style={styles.removeSkillText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Proof of Work & Projects */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>6. Proof of Work & Projects ({projects.length})</Text>

          {projects.map((p, idx) => (
            <View key={p.id || idx} style={styles.existingItemBox}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{p.title}</Text>
                <TouchableOpacity onPress={() => handleRemoveProject(p.id)}>
                  <Text style={styles.deleteLink}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDesc}>{p.description}</Text>
              <Text style={styles.itemMeta}>Tech: {p.techStack?.join(', ')}</Text>
            </View>
          ))}

          <View style={styles.addSectionBox}>
            <Text style={styles.subHeading}>+ Add New Project</Text>
            <Text style={styles.label}>Project Title</Text>
            <TextInput
              style={styles.input}
              value={newProjTitle}
              onChangeText={setNewProjTitle}
              placeholder="e.g. AI-Powered Expense Tracker"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textAreaSmall]}
              value={newProjDesc}
              onChangeText={setNewProjDesc}
              placeholder="What problem does it solve and what did you build?"
              multiline
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Tech Stack (Comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={newProjTechInput}
              onChangeText={setNewProjTechInput}
              placeholder="React, TypeScript, Tailwind, Node.js"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Live Demo URL (Optional)</Text>
            <TextInput
              style={styles.input}
              value={newProjDemoUrl}
              onChangeText={setNewProjDemoUrl}
              placeholder="https://myproject.vercel.app"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>GitHub Repo URL (Optional)</Text>
            <TextInput
              style={styles.input}
              value={newProjGithubUrl}
              onChangeText={setNewProjGithubUrl}
              placeholder="https://github.com/username/project"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.addItemBtn} onPress={handleAddProject}>
              <Text style={styles.addItemBtnText}>+ Save Project</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. Certificates & Credentials */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>7. Certificates & Credentials ({certificates.length})</Text>

          {certificates.map((c, idx) => (
            <View key={c.id || idx} style={styles.existingItemBox}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{c.name}</Text>
                <TouchableOpacity onPress={() => c.id && handleRemoveCertificate(c.id)}>
                  <Text style={styles.deleteLink}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDesc}>{c.issuingOrganization} • {c.issueDate}</Text>
            </View>
          ))}

          <View style={styles.addSectionBox}>
            <Text style={styles.subHeading}>+ Add Certificate</Text>
            <Text style={styles.label}>Certificate Name</Text>
            <TextInput
              style={styles.input}
              value={newCertName}
              onChangeText={setNewCertName}
              placeholder="e.g. AWS Certified Cloud Practitioner"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Issuing Organization</Text>
            <TextInput
              style={styles.input}
              value={newCertOrg}
              onChangeText={setNewCertOrg}
              placeholder="e.g. Amazon Web Services / Coursera"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Issue Year / Date</Text>
            <TextInput
              style={styles.input}
              value={newCertDate}
              onChangeText={setNewCertDate}
              placeholder="e.g. 2025"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Credential URL (Optional)</Text>
            <TextInput
              style={styles.input}
              value={newCertUrl}
              onChangeText={setNewCertUrl}
              placeholder="https://credential.net/..."
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.addItemBtn} onPress={handleAddCertificate}>
              <Text style={styles.addItemBtnText}>+ Save Certificate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 8. CV Document */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>8. Existing CV (PDF URL)</Text>
          <Text style={styles.label}>CV File Web URL</Text>
          <TextInput
            style={styles.input}
            value={cvFileUrl}
            onChangeText={setCvFileUrl}
            placeholder="https://assets.fresher2work.com/cvs/resume.pdf"
            autoCapitalize="none"
          />
        </View>

        {/* 8. Career Preferences */}
        <View style={styles.formCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>8. Career Preferences</Text>
            <TouchableOpacity
              onPress={() => router.push('/profile/preferences')}
              style={{ backgroundColor: COLORS.brand[50], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: COLORS.brand[200] }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.brand[700] }}>🎯 Multi-Select View →</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Preferred Job Roles (Comma Separated)</Text>
          <TextInput
            style={styles.input}
            value={preferredRolesInput}
            onChangeText={setPreferredRolesInput}
            placeholder="Frontend Developer, Full Stack Developer"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Preferred Locations (Comma Separated)</Text>
          <TextInput
            style={styles.input}
            value={preferredLocationsInput}
            onChangeText={setPreferredLocationsInput}
            placeholder="Bengaluru, Hyderabad, Remote"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Work Mode</Text>
          <View style={styles.modeRow}>
            {[WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ON_SITE, WorkMode.ANY].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setWorkMode(m)}
                style={[styles.modeBtn, workMode === m && styles.modeBtnActive]}
              >
                <Text style={[styles.modeBtnText, workMode === m && styles.modeBtnTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Availability</Text>
          <View style={styles.modeRow}>
            {[
              { label: 'Immediate', val: AvailabilityOption.IMMEDIATE },
              { label: '15 Days', val: AvailabilityOption.WITHIN_15_DAYS },
              { label: '30 Days', val: AvailabilityOption.WITHIN_30_DAYS },
            ].map((a) => (
              <TouchableOpacity
                key={a.val}
                onPress={() => setAvailability(a.val)}
                style={[styles.modeBtn, availability === a.val && styles.modeBtnActive]}
              >
                <Text style={[styles.modeBtnText, availability === a.val && styles.modeBtnTextActive]}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Expected Minimum Salary (₹/Year)</Text>
          <TextInput
            style={styles.input}
            value={expectedSalaryMin}
            onChangeText={setExpectedSalaryMin}
            keyboardType="number-pad"
            placeholder="500000"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveAllBtn, saving && styles.btnDisabled]}
          onPress={handleSaveAll}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveAllBtnText}>💾 Save All Profile Changes</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  topHeader: {
    marginBottom: 16,
  },
  pageHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  pageSubheading: {
    fontSize: 13,
    color: COLORS.neutral[500],
    marginTop: 2,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginBottom: 12,
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
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  textArea: {
    height: 80,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.brand[500],
  },
  avatarHint: {
    fontSize: 11,
    color: COLORS.neutral[500],
    marginBottom: 6,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  avatarThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  avatarThumbActive: {
    borderColor: COLORS.brand[600],
    borderWidth: 2,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  twoCol: {
    flexDirection: 'row',
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: COLORS.neutral[900],
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  skillListWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillTagName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  removeSkillText: {
    fontSize: 12,
    color: COLORS.error.text,
    fontWeight: '700',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
  },
  modeBtnActive: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[500],
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[600],
  },
  modeBtnTextActive: {
    color: COLORS.brand[800],
    fontWeight: '700',
  },
  saveAllBtn: {
    height: 50,
    backgroundColor: COLORS.brand[600],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  saveAllBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  existingItemBox: {
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    marginBottom: 8,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
    flex: 1,
  },
  deleteLink: {
    fontSize: 11,
    color: COLORS.error.text,
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 3,
  },
  addSectionBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[800],
    marginBottom: 8,
  },
  textAreaSmall: {
    height: 56,
    paddingTop: 6,
    textAlignVertical: 'top',
  },
  addItemBtn: {
    marginTop: 10,
    backgroundColor: COLORS.neutral[800],
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  addItemBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
