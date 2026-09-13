import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Share,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StudentProfile, CompletenessBreakdown } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

export default function StudentHomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await apiClient.getStudentProfile();
      setProfile(res.profile);
      setCompleteness(res.completeness);
    } catch (err: any) {
      console.warn('Failed to load student home dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleShareProfile = async () => {
    if (!profile?.publicSlug) return;
    const url = `https://freshertowork.com/p/${profile.publicSlug}`;
    try {
      await Share.share({
        message: `View my professional talent profile and proof-of-work on FresherToWork: ${url}`,
        url,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading your talent dashboard...</Text>
      </View>
    );
  }

  const firstName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Fresher';
  const score = completeness?.score || 0;
  const projectsCount = profile?.projects?.length || 0;
  const workSamplesCount = profile?.workSamples?.length || 0;
  const totalProofCount = projectsCount + workSamplesCount;
  const skillsCount = profile?.skills?.length || 0;
  const certificatesCount = profile?.certificates?.length || 0;
  const hasCv = Boolean(profile?.cvFileUrl);
  const hasPreferences = Boolean(
    profile?.preferences?.preferredRoles && profile.preferences.preferredRoles.length > 0
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchDashboardData();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header & Greeting */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingSub}>{getGreeting()},</Text>
            <Text style={styles.greetingName}>{firstName} 👋</Text>
            <Text style={styles.headlineText} numberOfLines={1}>
              {profile?.headline || 'Fresher Talent Profile'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.avatarWrapper}
          >
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Activation Status Banner inside Header */}
        <View style={styles.statusRow}>
          {profile?.isActivated ? (
            <View style={styles.activeStatusPill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeStatusText}>Live in Recruiter Discovery Pool</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/activation')}
              style={styles.inactiveStatusPill}
            >
              <Text style={styles.inactiveStatusText}>🔒 Profile Activation Pending (₹99) →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push('/profile/preview')}
            style={styles.recruiterPreviewBtn}
          >
            <Text style={styles.recruiterPreviewBtnText}>👁️ Recruiter View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Profile Readiness & Dynamic Suggestions */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardSectionTitle}>Profile Readiness</Text>
            <Text style={styles.cardSubText}>
              {score >= 70
                ? 'Your profile meets criteria for verified recruiter discovery'
                : 'Complete key proof-of-work sections to reach 70%'}
            </Text>
          </View>
          <View
            style={[
              styles.scoreBadge,
              { backgroundColor: score >= 70 ? COLORS.brand[50] : '#fffbeb', borderColor: score >= 70 ? COLORS.brand[200] : '#fde68a' },
            ]}
          >
            <Text
              style={[
                styles.scoreBadgeText,
                { color: score >= 70 ? COLORS.brand[800] : '#b45309' },
              ]}
            >
              {score}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(score, 100)}%`,
                backgroundColor: score >= 70 ? COLORS.brand[600] : '#f59e0b',
              },
            ]}
          />
        </View>

        {/* Dynamic Actionable Suggestions */}
        {completeness?.missingSteps && completeness.missingSteps.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsHeader}>Recommended Next Steps:</Text>
            {completeness.missingSteps.slice(0, 3).map((step, idx) => (
              <View key={idx} style={styles.suggestionItemRow}>
                <Text style={styles.suggestionBullet}>•</Text>
                <Text style={styles.suggestionText}>{step}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.suggestionActionBtn}
              onPress={() => router.push('/profile/edit')}
            >
              <Text style={styles.suggestionActionBtnText}>✏️ Complete Profile Details →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 3. Professional Identity & Proof of Work Grid */}
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeading}>Professional Proof of Work</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
          <Text style={styles.sectionLink}>Manage →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {/* CV Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/(tabs)/projects')}
        >
          <View style={styles.statIconCircle}>
            <Text style={styles.statIcon}>📄</Text>
          </View>
          <Text style={styles.statTitle}>Original CV</Text>
          <Text style={[styles.statStatus, hasCv ? styles.statusGreen : styles.statusAmber]}>
            {hasCv ? '✓ PDF Uploaded' : '⚠️ Not Uploaded'}
          </Text>
          <Text style={styles.statFooterText}>
            {hasCv ? profile?.cvFileName || 'Verified Resume' : 'Add your PDF CV'}
          </Text>
        </TouchableOpacity>

        {/* Projects Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/(tabs)/projects')}
        >
          <View style={styles.statIconCircle}>
            <Text style={styles.statIcon}>💼</Text>
          </View>
          <Text style={styles.statTitle}>Projects</Text>
          <Text style={styles.statCount}>{totalProofCount}</Text>
          <Text style={styles.statFooterText}>
            {totalProofCount > 0 ? `${projectsCount} projects, ${workSamplesCount} samples` : 'Showcase your work'}
          </Text>
        </TouchableOpacity>

        {/* Skills Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/profile/edit')}
        >
          <View style={styles.statIconCircle}>
            <Text style={styles.statIcon}>⚡</Text>
          </View>
          <Text style={styles.statTitle}>Skills</Text>
          <Text style={styles.statCount}>{skillsCount}</Text>
          <Text style={styles.statFooterText}>
            {skillsCount >= 3 ? 'Targeted skill tags' : 'Add at least 3 skills'}
          </Text>
        </TouchableOpacity>

        {/* Certificates Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/(tabs)/projects')}
        >
          <View style={styles.statIconCircle}>
            <Text style={styles.statIcon}>🎓</Text>
          </View>
          <Text style={styles.statTitle}>Certificates</Text>
          <Text style={styles.statCount}>{certificatesCount}</Text>
          <Text style={styles.statFooterText}>
            {certificatesCount > 0 ? 'Verified credentials' : 'Add credentials'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Quick Actions Hub */}
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeading}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.actionBtnIcon}>✏️</Text>
          <View style={styles.actionBtnTextCol}>
            <Text style={styles.actionBtnTitle}>Edit Profile & Bio</Text>
            <Text style={styles.actionBtnSubtitle}>Update headline, about, education, links</Text>
          </View>
          <Text style={styles.actionBtnChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/profile/preferences')}
        >
          <Text style={styles.actionBtnIcon}>🎯</Text>
          <View style={styles.actionBtnTextCol}>
            <Text style={styles.actionBtnTitle}>Career Preferences</Text>
            <Text style={styles.actionBtnSubtitle}>
              {hasPreferences
                ? `${profile?.preferences?.preferredRoles?.slice(0, 2).join(', ')} • ${profile?.preferences?.preferredLocations?.[0] || 'Any'}`
                : 'Set target roles, locations & work mode'}
            </Text>
          </View>
          <Text style={styles.actionBtnChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/projects')}
        >
          <Text style={styles.actionBtnIcon}>💼</Text>
          <View style={styles.actionBtnTextCol}>
            <Text style={styles.actionBtnTitle}>Add Project / Work Sample</Text>
            <Text style={styles.actionBtnSubtitle}>Demonstrate real skills and live repo links</Text>
          </View>
          <Text style={styles.actionBtnChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/projects')}
        >
          <Text style={styles.actionBtnIcon}>📄</Text>
          <View style={styles.actionBtnTextCol}>
            <Text style={styles.actionBtnTitle}>{hasCv ? 'Manage / Replace CV' : 'Upload CV Document'}</Text>
            <Text style={styles.actionBtnSubtitle}>PDF format up to 10MB</Text>
          </View>
          <Text style={styles.actionBtnChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Shareable Talent Profile Link */}
      {profile?.publicSlug && (
        <View style={styles.shareCard}>
          <View style={styles.shareCardHeader}>
            <Text style={styles.shareCardTitle}>🔗 Your Shareable Talent Link</Text>
            <TouchableOpacity onPress={handleShareProfile} style={styles.shareIconBtn}>
              <Text style={styles.shareIconBtnText}>Share Link</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.shareCardUrl}>freshertowork.com/p/{profile.publicSlug}</Text>
          <Text style={styles.shareCardHint}>
            Share this link directly on your LinkedIn profile, resume, or with hiring managers.
          </Text>
        </View>
      )}

      {/* 6. Talent Advice / Proof of Work Guidance */}
      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>💡 Tip for Freshers</Text>
        <Text style={styles.guidanceBody}>
          Recruiters prioritize candidates with tangible evidence of ability. Profiles with at least 2 detailed projects and a confirmed CV receive 3x more discovery clicks than text-only resumes.
        </Text>
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
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    marginRight: 12,
  },
  greetingSub: {
    fontSize: 12,
    color: COLORS.neutral[500],
    fontWeight: '600',
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral[900],
    letterSpacing: -0.3,
  },
  headlineText: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 2,
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.brand[400],
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brand[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.brand[800],
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
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  activeStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  inactiveStatusPill: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  inactiveStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
  },
  recruiterPreviewBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recruiterPreviewBtnText: {
    fontSize: 11,
    color: COLORS.brand[700],
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  cardSubText: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
    maxWidth: 240,
    lineHeight: 16,
  },
  scoreBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  scoreBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  suggestionsBox: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  suggestionsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[800],
    marginBottom: 6,
  },
  suggestionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  suggestionBullet: {
    fontSize: 14,
    color: COLORS.brand[600],
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: COLORS.neutral[700],
  },
  suggestionActionBtn: {
    marginTop: 8,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  suggestionActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[600],
    textTransform: 'uppercase',
  },
  statCount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginTop: 2,
  },
  statStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  statusGreen: {
    color: '#059669',
  },
  statusAmber: {
    color: '#d97706',
  },
  statFooterText: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 4,
  },
  quickActionsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  actionBtnIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionBtnTextCol: {
    flex: 1,
  },
  actionBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  actionBtnSubtitle: {
    fontSize: 11,
    color: COLORS.neutral[500],
    marginTop: 1,
  },
  actionBtnChevron: {
    fontSize: 20,
    color: COLORS.neutral[400],
    fontWeight: '600',
    marginLeft: 8,
  },
  shareCard: {
    backgroundColor: COLORS.brand[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    marginBottom: 14,
  },
  shareCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[900],
  },
  shareIconBtn: {
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  shareIconBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  shareCardUrl: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[800],
    marginBottom: 4,
  },
  shareCardHint: {
    fontSize: 11,
    color: COLORS.brand[700],
    lineHeight: 15,
  },
  guidanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: 10,
  },
  guidanceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
    marginBottom: 4,
  },
  guidanceBody: {
    fontSize: 12,
    color: COLORS.neutral[600],
    lineHeight: 18,
  },
});
