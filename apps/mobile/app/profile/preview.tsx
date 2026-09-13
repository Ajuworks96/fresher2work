import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StudentProfile } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

export default function ProfilePreviewScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.getStudentProfile();
        setProfile(res.profile);
      } catch (err) {
        console.warn('Failed to load profile preview', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading Recruiter Preview...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No profile found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Recruiter View Banner */}
      <View style={styles.recruiterBanner}>
        <View style={styles.recruiterBadge}>
          <Text style={styles.recruiterBadgeText}>👁️ RECRUITER PREVIEW MODE</Text>
        </View>
        <Text style={styles.bannerHeading}>How Recruiters Discover You</Text>
        <Text style={styles.bannerSub}>
          This is exactly how hiring teams at top tech companies, startups, and agencies view your talent card on the FresherToWork discovery platform.
        </Text>
      </View>

      {/* 2. Main Talent Profile Card */}
      <View style={styles.talentCard}>
        <View style={styles.headerRow}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarChar}>{profile.fullName?.charAt(0) || 'S'}</Text>
            </View>
          )}

          <View style={styles.headerDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.candidateName}>{profile.fullName}</Text>
              {profile.isActivated && (
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓ Verified Fresher</Text>
                </View>
              )}
            </View>

            <Text style={styles.headlineText}>{profile.headline || 'Beginner Software Engineer'}</Text>
            
            {profile.preferences?.preferredLocations && (
              <Text style={styles.locationText}>
                📍 {profile.preferences.preferredLocations.join(', ')}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Highlights Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Availability</Text>
            <Text style={styles.metaVal}>{profile.preferences?.availability || 'Immediate'}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Work Mode</Text>
            <Text style={styles.metaVal}>{profile.preferences?.workMode || 'Any'}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Proof of Work</Text>
            <Text style={styles.metaVal}>{profile.projects?.length || 0} Built</Text>
          </View>
        </View>

        {/* About Summary */}
        <View style={styles.sectionDivider} />
        <Text style={styles.sectionHeading}>About Candidate</Text>
        <Text style={styles.aboutText}>
          {profile.about || 'No summary available.'}
        </Text>

        {/* External Code Links */}
        <View style={styles.linksContainer}>
          {profile.githubUrl && (
            <Text style={styles.linkPill}>💻 GitHub: {profile.githubUrl}</Text>
          )}
          {profile.linkedinUrl && (
            <Text style={styles.linkPill}>🔗 LinkedIn: {profile.linkedinUrl}</Text>
          )}
          {profile.portfolioUrl && (
            <Text style={styles.linkPill}>🌐 Portfolio: {profile.portfolioUrl}</Text>
          )}
        </View>
      </View>

      {/* 3. Proof of Work & Projects */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Proof of Work & Projects ({profile.projects?.length || 0})
        </Text>
        <Text style={styles.cardSubtitle}>
          Real applications and code built by the candidate
        </Text>

        {profile.projects && profile.projects.length > 0 ? (
          profile.projects.map((proj) => (
            <View key={proj.id} style={styles.projectItem}>
              <Text style={styles.projectTitle}>{proj.title}</Text>
              <Text style={styles.projectDesc}>{proj.description}</Text>
              
              <View style={styles.techStackRow}>
                {proj.techStack?.map((t, idx) => (
                  <View key={idx} style={styles.techPill}>
                    <Text style={styles.techPillText}>{t}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.projectActions}>
                {proj.liveDemoUrl && (
                  <Text style={styles.projectActionLink}>🌐 Live Demo →</Text>
                )}
                {proj.githubRepoUrl && (
                  <Text style={styles.projectActionLink}>💻 Source Code →</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyNote}>No projects listed yet.</Text>
        )}
      </View>

      {/* 4. Certificates & Licenses */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Certificates & Credentials ({profile.certificates?.length || 0})
        </Text>

        {profile.certificates && profile.certificates.length > 0 ? (
          profile.certificates.map((cert) => (
            <View key={cert.id} style={styles.certBox}>
              <Text style={styles.certTitle}>🏅 {cert.name}</Text>
              <Text style={styles.certSubtitle}>{cert.issuingOrganization} • {cert.issueDate}</Text>
              {cert.credentialUrl && (
                <Text style={styles.certLink}>🔗 Credential Link Verified</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyNote}>No certificates uploaded yet.</Text>
        )}
      </View>

      {/* 5. Verified CV Document */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verified CV Document</Text>
        {profile.cvFileUrl ? (
          <View style={styles.cvRow}>
            <Text style={styles.cvIcon}>📄</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cvTitle}>PDF Resume Attached</Text>
              <Text style={styles.cvSub}>Available for 1-click preview & download by verified recruiters</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyNote}>No CV document uploaded yet.</Text>
        )}
      </View>

      {/* 6. Skills & Proficiencies */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Technical & Soft Skills ({profile.skills?.length || 0})</Text>
        <View style={styles.skillsGrid}>
          {profile.skills?.map((s) => (
            <View key={s.id} style={styles.skillBadge}>
              <Text style={styles.skillBadgeName}>{s.skillName}</Text>
              <Text style={styles.skillBadgeLevel}>{s.proficiencyLevel}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 7. Education */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Education History</Text>
        {profile.education?.map((edu) => (
          <View key={edu.id} style={styles.eduBox}>
            <Text style={styles.eduCollege}>{edu.institutionName}</Text>
            <Text style={styles.eduDegree}>{edu.degree} in {edu.fieldOfStudy}</Text>
            <Text style={styles.eduYears}>{edu.startYear} - {edu.endYear} {edu.gradeOrCgpa ? `• ${edu.gradeOrCgpa}` : ''}</Text>
          </View>
        ))}
      </View>

      {/* 8. Career Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Career Preferences</Text>
        <View style={styles.prefRow}>
          <Text style={styles.prefField}>Target Roles:</Text>
          <Text style={styles.prefValue}>{profile.preferences?.preferredRoles?.join(', ') || 'Any'}</Text>
        </View>
        <View style={styles.prefRow}>
          <Text style={styles.prefField}>Target Locations:</Text>
          <Text style={styles.prefValue}>{profile.preferences?.preferredLocations?.join(', ') || 'Any'}</Text>
        </View>
        <View style={styles.prefRow}>
          <Text style={styles.prefField}>Work Mode:</Text>
          <Text style={styles.prefValue}>{profile.preferences?.workMode || 'Any'}</Text>
        </View>
        <View style={styles.prefRow}>
          <Text style={styles.prefField}>Availability:</Text>
          <Text style={styles.prefValue}>{profile.preferences?.availability || 'Immediate'}</Text>
        </View>
      </View>

      {/* Bottom Action Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editBtnText}>✏️ Edit My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)/profile')}
        >
          <Text style={styles.backBtnText}>← Back to My Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
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
    fontWeight: '500',
  },
  errorText: {
    fontSize: 15,
    color: COLORS.neutral[600],
  },
  recruiterBanner: {
    backgroundColor: COLORS.neutral[900],
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 14,
  },
  recruiterBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand[500],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: 8,
  },
  recruiterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  bannerHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerSub: {
    fontSize: 12,
    color: COLORS.neutral[300],
    marginTop: 4,
    lineHeight: 17,
  },
  talentCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.brand[500],
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.brand[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarChar: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  headerDetails: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  verifiedTag: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  headlineText: {
    fontSize: 13,
    color: COLORS.neutral[600],
    marginTop: 2,
    lineHeight: 17,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.neutral[400],
    fontWeight: '600',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  metaPill: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.neutral[400],
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[800],
    marginTop: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginVertical: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.neutral[700],
    lineHeight: 19,
  },
  linksContainer: {
    marginTop: 10,
    gap: 4,
  },
  linkPill: {
    fontSize: 12,
    color: COLORS.neutral[600],
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.neutral[400],
    marginTop: 2,
    marginBottom: 12,
  },
  projectItem: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  projectDesc: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 4,
    lineHeight: 17,
  },
  techStackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  techPill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  techPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  projectActionLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent[600],
  },
  emptyNote: {
    fontSize: 12,
    color: COLORS.neutral[400],
    fontStyle: 'italic',
    marginTop: 4,
  },
  certBox: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  certTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  certSubtitle: {
    fontSize: 11,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  certLink: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 4,
  },
  cvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 8,
  },
  cvIcon: {
    fontSize: 24,
  },
  cvTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[900],
  },
  cvSub: {
    fontSize: 11,
    color: COLORS.brand[700],
    marginTop: 1,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillBadgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  skillBadgeLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  eduBox: {
    marginBottom: 8,
    marginTop: 4,
  },
  eduCollege: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  eduDegree: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 1,
  },
  eduYears: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  prefField: {
    fontSize: 12,
    color: COLORS.neutral[500],
    fontWeight: '600',
  },
  prefValue: {
    fontSize: 12,
    color: COLORS.neutral[800],
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  editBtn: {
    flex: 1,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  backBtn: {
    flex: 1,
    backgroundColor: COLORS.neutral[200],
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.neutral[800],
    fontSize: 13,
    fontWeight: '700',
  },
});
