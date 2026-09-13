import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StudentProfile, CompletenessBreakdown } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

export default function MyProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.getStudentProfile();
      setProfile(res.profile);
      setCompleteness(res.completeness);
    } catch (err: any) {
      console.warn('Failed to fetch profile', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading talent profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchProfile();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Profile Header Card */}
      <View style={styles.card}>
        <View style={styles.headerTopRow}>
          <View style={styles.avatarContainer}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.name}>{profile?.fullName || 'Fresher Student'}</Text>
            </View>
            <Text style={styles.headline}>
              {profile?.headline || 'No professional headline added yet'}
            </Text>
            {profile?.preferences?.preferredLocations && profile.preferences.preferredLocations.length > 0 && (
              <Text style={styles.locationText}>
                📍 {profile.preferences.preferredLocations.join(', ')}
              </Text>
            )}
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusRow}>
          {profile?.isActivated ? (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>⚡ Active in Talent Pool</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/activation')}
              style={styles.inactiveBadge}
            >
              <Text style={styles.inactiveBadgeText}>🔒 Activation Pending (₹99) →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push('/profile/edit')}
            style={styles.editProfileButton}
          >
            <Text style={styles.editProfileButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Action Shortcuts */}
        <View style={styles.actionShortcutsRow}>
          <TouchableOpacity
            onPress={() => router.push('/profile/preferences')}
            style={[styles.shortcutBtn, { backgroundColor: COLORS.brand[50], borderColor: COLORS.brand[200] }]}
          >
            <Text style={[styles.shortcutBtnText, { color: COLORS.brand[800] }]}>🎯 Career Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/profile/preview')}
            style={styles.shortcutBtn}
          >
            <Text style={styles.shortcutBtnText}>👁️ Recruiter View</Text>
          </TouchableOpacity>
          {profile?.publicSlug && (
            <TouchableOpacity
              onPress={() => router.push(`/profile/${profile.publicSlug}`)}
              style={styles.shortcutBtn}
            >
              <Text style={styles.shortcutBtnText}>🔗 Public Link</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Completeness Meter */}
      <View style={styles.card}>
        <View style={styles.meterHeader}>
          <View>
            <Text style={styles.cardSectionTitle}>Profile Completeness</Text>
            <Text style={styles.meterSubtext}>
              {completeness && completeness.score >= 70
                ? 'Ready for ₹99 activation and recruiter discovery'
                : 'Reach 70% to activate your talent profile'}
            </Text>
          </View>
          <Text style={styles.scoreText}>{completeness?.score || 0}%</Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${completeness?.score || 0}%` },
              completeness && completeness.score >= 70 ? styles.progressFillGreen : styles.progressFillAmber,
            ]}
          />
        </View>

        {completeness && completeness.missingSteps.length > 0 ? (
          <View style={styles.missingStepsBox}>
            <Text style={styles.missingTitle}>Recommended Actions to Boost Profile:</Text>
            {completeness.missingSteps.map((step, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => router.push('/profile/edit')}
                style={styles.missingStepRow}
              >
                <Text style={styles.missingItem}>• {step}</Text>
                <Text style={styles.addText}>Add +</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.allDoneText}>🌟 Your profile is 100% complete!</Text>
        )}
      </View>

      {/* 3. About / Summary Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>About</Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Text style={styles.sectionEditLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bodyText}>
          {profile?.about || 'No summary added yet. Click edit to introduce yourself to hiring managers.'}
        </Text>

        {/* Links */}
        <View style={styles.linksRow}>
          {profile?.githubUrl ? (
            <Text style={styles.linkItem}>💻 GitHub: {profile.githubUrl}</Text>
          ) : null}
          {profile?.linkedinUrl ? (
            <Text style={styles.linkItem}>🔗 LinkedIn: {profile.linkedinUrl}</Text>
          ) : null}
          {profile?.portfolioUrl ? (
            <Text style={styles.linkItem}>🌐 Portfolio: {profile.portfolioUrl}</Text>
          ) : null}
        </View>
      </View>

      {/* 4. Proof of Work & Projects */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>
            Proof of Work ({profile?.projects?.length || 0})
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
            <Text style={styles.sectionEditLink}>+ Add / Edit</Text>
          </TouchableOpacity>
        </View>

        {profile?.projects && profile.projects.length > 0 ? (
          profile.projects.map((p) => (
            <View key={p.id} style={styles.projectItemBox}>
              <View style={styles.projectItemHeader}>
                <Text style={styles.projectItemTitle}>{p.title}</Text>
              </View>
              <Text style={styles.projectItemDesc}>{p.description}</Text>
              <View style={styles.techTagRow}>
                {p.techStack.map((tech, i) => (
                  <View key={i} style={styles.techTag}>
                    <Text style={styles.techTagText}>{tech}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.projectLinks}>
                {p.liveDemoUrl && <Text style={styles.projectLink}>🌐 Live Demo</Text>}
                {p.githubRepoUrl && <Text style={styles.projectLink}>💻 GitHub Code</Text>}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyPromptBox}>
            <Text style={styles.emptyPromptText}>No projects added yet.</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
              <Text style={styles.emptyPromptAction}>+ Add your first project</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 5. Certificates & Licenses */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>
            Certificates & Credentials ({profile?.certificates?.length || 0})
          </Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Text style={styles.sectionEditLink}>+ Add / Edit</Text>
          </TouchableOpacity>
        </View>

        {profile?.certificates && profile.certificates.length > 0 ? (
          profile.certificates.map((cert) => (
            <View key={cert.id} style={styles.certItemBox}>
              <View style={styles.certHeaderRow}>
                <Text style={styles.certName}>🏅 {cert.name}</Text>
                <Text style={styles.certDate}>{cert.issueDate}</Text>
              </View>
              <Text style={styles.certOrg}>{cert.issuingOrganization}</Text>
              {cert.credentialUrl ? (
                <Text style={styles.certLink}>🔗 Verify: {cert.credentialUrl}</Text>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.emptyPromptBox}>
            <Text style={styles.emptyPromptText}>No certificates added yet.</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.emptyPromptAction}>+ Add your first certificate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 6. Existing CV / Resume */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>Existing CV (PDF)</Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Text style={styles.sectionEditLink}>Upload / Replace</Text>
          </TouchableOpacity>
        </View>

        {profile?.cvFileUrl ? (
          <View style={styles.cvSuccessBox}>
            <Text style={styles.cvSuccessIcon}>📄</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cvSuccessTitle}>Verified CV Document Active</Text>
              <Text style={styles.cvSuccessSub}>
                Recruiters can inspect your PDF directly in discovery.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPromptBox}>
            <Text style={styles.emptyPromptText}>No CV uploaded yet.</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.emptyPromptAction}>+ Upload your CV (PDF)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 7. Skills */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>
            Skills ({profile?.skills?.length || 0})
          </Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Text style={styles.sectionEditLink}>Manage</Text>
          </TouchableOpacity>
        </View>

        {profile?.skills && profile.skills.length > 0 ? (
          <View style={styles.skillChipsWrap}>
            {profile.skills.map((s) => (
              <View key={s.id} style={styles.skillChip}>
                <Text style={styles.skillChipName}>{s.skillName}</Text>
                <Text style={styles.skillChipLevel}>
                  {s.proficiencyLevel === 'ADVANCED'
                    ? 'Adv'
                    : s.proficiencyLevel === 'INTERMEDIATE'
                    ? 'Int'
                    : 'Beg'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyPromptText}>No skills added yet.</Text>
        )}
      </View>

      {/* 8. Education */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>Education</Text>
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Text style={styles.sectionEditLink}>+ Add / Edit</Text>
          </TouchableOpacity>
        </View>

        {profile?.education && profile.education.length > 0 ? (
          profile.education.map((edu) => (
            <View key={edu.id} style={styles.eduItemBox}>
              <Text style={styles.eduCollege}>{edu.institutionName}</Text>
              <Text style={styles.eduDegree}>
                {edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear})
              </Text>
              {edu.gradeOrCgpa && (
                <Text style={styles.eduGrade}>Score: {edu.gradeOrCgpa}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyPromptText}>No education added yet.</Text>
        )}
      </View>

      {/* 8. Career Preferences */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardSectionTitle}>🎯 Career Preferences</Text>
          <TouchableOpacity onPress={() => router.push('/profile/preferences')}>
            <Text style={styles.sectionEditLink}>Edit Preferences →</Text>
          </TouchableOpacity>
        </View>

        {profile?.preferences ? (
          <View style={styles.prefGrid}>
            {/* Preferred Roles */}
            <View style={styles.prefBlock}>
              <Text style={styles.prefLabel}>Target Job Roles</Text>
              {profile.preferences.preferredRoles && profile.preferences.preferredRoles.length > 0 ? (
                <View style={styles.prefChipsRow}>
                  {profile.preferences.preferredRoles.map((role) => (
                    <View key={role} style={styles.prefChipBadge}>
                      <Text style={styles.prefChipBadgeText}>{role}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.prefValMuted}>Not specified</Text>
              )}
            </View>

            {/* Preferred Industries */}
            {profile.preferences.preferredIndustries && profile.preferences.preferredIndustries.length > 0 && (
              <View style={styles.prefBlock}>
                <Text style={styles.prefLabel}>Target Industries</Text>
                <View style={styles.prefChipsRow}>
                  {profile.preferences.preferredIndustries.map((ind) => (
                    <View key={ind} style={styles.prefChipBadgeSecondary}>
                      <Text style={styles.prefChipBadgeSecondaryText}>{ind}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Locations & Countries */}
            <View style={styles.prefBlock}>
              <Text style={styles.prefLabel}>Locations & Countries</Text>
              <View style={styles.prefChipsRow}>
                {profile.preferences.preferredLocations?.map((loc) => (
                  <View key={loc} style={styles.prefChipBadgeLoc}>
                    <Text style={styles.prefChipBadgeLocText}>📍 {loc}</Text>
                  </View>
                ))}
                {profile.preferences.preferredCountries?.map((c) => (
                  <View key={c} style={styles.prefChipBadgeLoc}>
                    <Text style={styles.prefChipBadgeLocText}>🌐 {c}</Text>
                  </View>
                ))}
                {(!profile.preferences.preferredLocations || profile.preferences.preferredLocations.length === 0) &&
                  (!profile.preferences.preferredCountries || profile.preferences.preferredCountries.length === 0) && (
                    <Text style={styles.prefValMuted}>Anywhere / Remote</Text>
                  )}
              </View>
            </View>

            {/* Grid 2x2 for Work Mode, Work Types, Relocation, Availability */}
            <View style={styles.prefMetaGrid}>
              <View style={styles.prefMetaItem}>
                <Text style={styles.prefLabel}>Work Modes</Text>
                <Text style={styles.prefMetaVal}>
                  {profile.preferences.workModes && profile.preferences.workModes.length > 0
                    ? profile.preferences.workModes.join(', ')
                    : profile.preferences.workMode || 'Any'}
                </Text>
              </View>
              <View style={styles.prefMetaItem}>
                <Text style={styles.prefLabel}>Joining</Text>
                <Text style={styles.prefMetaVal}>
                  {profile.preferences.availability || 'Immediate'}
                </Text>
              </View>
              <View style={styles.prefMetaItem}>
                <Text style={styles.prefLabel}>Relocation</Text>
                <Text style={styles.prefMetaVal}>
                  {profile.preferences.relocationWillingness?.replace(/_/g, ' ') || 'Willing'}
                </Text>
              </View>
              <View style={styles.prefMetaItem}>
                <Text style={styles.prefLabel}>Work Types</Text>
                <Text style={styles.prefMetaVal}>
                  {profile.preferences.preferredWorkTypes && profile.preferences.preferredWorkTypes.length > 0
                    ? profile.preferences.preferredWorkTypes.map((t) => t.replace(/_/g, ' ')).join(', ')
                    : 'Full Time, Internship'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyPromptText}>No career preferences specified yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarImage: {
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
  avatarLetter: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  headerInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  headline: {
    fontSize: 13,
    color: COLORS.neutral[600],
    marginTop: 2,
    lineHeight: 17,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 3,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  activeBadge: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  inactiveBadge: {
    backgroundColor: COLORS.warning.bg,
    borderColor: COLORS.warning.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  inactiveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning.text,
  },
  editProfileButton: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  editProfileButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[800],
  },
  actionShortcutsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  shortcutBtn: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  shortcutBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[700],
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  meterSubtext: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.brand[600],
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFillGreen: {
    backgroundColor: COLORS.brand[500],
  },
  progressFillAmber: {
    backgroundColor: COLORS.warning[500],
  },
  missingStepsBox: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  missingTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[700],
    marginBottom: 6,
  },
  missingStepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  missingItem: {
    fontSize: 12,
    color: COLORS.neutral[600],
    flex: 1,
  },
  addText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
    marginLeft: 8,
  },
  allDoneText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionEditLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.neutral[700],
    lineHeight: 19,
  },
  linksRow: {
    marginTop: 10,
    gap: 4,
  },
  linkItem: {
    fontSize: 12,
    color: COLORS.neutral[500],
    fontWeight: '500',
  },
  projectItemBox: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  projectItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  projectItemDesc: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 4,
    lineHeight: 17,
  },
  techTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  techTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  techTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  projectLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  projectLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent[600],
  },
  emptyPromptBox: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyPromptText: {
    fontSize: 12,
    color: COLORS.neutral[400],
  },
  emptyPromptAction: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
    marginTop: 4,
  },
  cvSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  cvSuccessIcon: {
    fontSize: 24,
  },
  cvSuccessTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[900],
  },
  cvSuccessSub: {
    fontSize: 11,
    color: COLORS.brand[700],
    marginTop: 1,
  },
  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillChipName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  skillChipLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  eduItemBox: {
    marginBottom: 8,
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
  eduGrade: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 2,
  },
  prefGrid: {
    gap: 12,
  },
  prefBlock: {
    marginBottom: 4,
  },
  prefChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  prefChipBadge: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  prefChipBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[800],
  },
  prefChipBadgeSecondary: {
    backgroundColor: COLORS.neutral[100],
    borderColor: COLORS.neutral[200],
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  prefChipBadgeSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.neutral[700],
  },
  prefChipBadgeLoc: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  prefChipBadgeLocText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e40af',
  },
  prefMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    marginTop: 4,
    gap: 10,
  },
  prefMetaItem: {
    width: '46%',
  },
  prefMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[800],
    marginTop: 2,
  },
  prefValMuted: {
    fontSize: 12,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
  prefLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[400],
    textTransform: 'uppercase',
  },
  prefVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
    marginTop: 2,
  },
  certItemBox: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  certHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
    flex: 1,
  },
  certDate: {
    fontSize: 11,
    color: COLORS.neutral[500],
    fontWeight: '600',
  },
  certOrg: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 2,
  },
  certLink: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 4,
  },
});
