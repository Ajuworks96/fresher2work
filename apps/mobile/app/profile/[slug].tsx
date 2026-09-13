import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StudentProfile } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

export default function PublicProfileScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const res = await apiClient.getPublicProfile(slug);
        setProfile(res.profile);
      } catch (err) {
        console.warn('Failed to load public profile', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleShare = async () => {
    if (!profile) return;
    try {
      await Share.share({
        message: `Check out ${profile.fullName}'s verified talent profile on FresherToWork: https://freshertowork.com/p/${slug}`,
        url: `https://freshertowork.com/p/${slug}`,
        title: `${profile.fullName} | FresherToWork Profile`,
      });
    } catch (err: any) {
      Alert.alert('Share', 'Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading Public Talent Card...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Profile Not Found</Text>
        <Text style={styles.errorSub}>The requested candidate profile could not be located.</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.backHomeText}>Return to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Public Header Card */}
      <View style={styles.card}>
        <View style={styles.topBadgeRow}>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>⚡ FresherToWork Verified Talent</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>🔗 Share Card</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfo}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarChar}>{profile.fullName?.charAt(0) || 'S'}</Text>
            </View>
          )}

          <Text style={styles.fullName}>{profile.fullName}</Text>
          <Text style={styles.headline}>{profile.headline || 'Entry-Level Software Engineer'}</Text>

          {profile.preferences?.preferredLocations && (
            <Text style={styles.location}>
              📍 {profile.preferences.preferredLocations.join(', ')}
            </Text>
          )}
        </View>

        {/* Quick Preferences Chips */}
        <View style={styles.chipsRow}>
          {profile.preferences?.workMode && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>🏢 {profile.preferences.workMode}</Text>
            </View>
          )}
          {profile.preferences?.availability && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>⏱️ {profile.preferences.availability}</Text>
            </View>
          )}
          {profile.cvFileUrl && (
            <View style={styles.chipGreen}>
              <Text style={styles.chipGreenText}>📄 CV Verified</Text>
            </View>
          )}
        </View>

        {/* About */}
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>About</Text>
        <Text style={styles.aboutText}>{profile.about || 'No summary available.'}</Text>

        {/* External Links */}
        <View style={styles.linksRow}>
          {profile.githubUrl && <Text style={styles.linkText}>💻 GitHub</Text>}
          {profile.linkedinUrl && <Text style={styles.linkText}>🔗 LinkedIn</Text>}
          {profile.portfolioUrl && <Text style={styles.linkText}>🌐 Portfolio</Text>}
        </View>
      </View>

      {/* 2. Proof of Work & Projects */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Proof of Work ({profile.projects?.length || 0})</Text>
        {profile.projects && profile.projects.length > 0 ? (
          profile.projects.map((p) => (
            <View key={p.id} style={styles.projectBox}>
              <Text style={styles.projectTitle}>{p.title}</Text>
              <Text style={styles.projectDesc}>{p.description}</Text>
              
              <View style={styles.techTagRow}>
                {p.techStack?.map((t, idx) => (
                  <View key={idx} style={styles.techTag}>
                    <Text style={styles.techTagText}>{t}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.projectLinkRow}>
                {p.liveDemoUrl && <Text style={styles.actionLink}>🌐 Live Demo</Text>}
                {p.githubRepoUrl && <Text style={styles.actionLink}>💻 Code Repository</Text>}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No projects listed yet.</Text>
        )}
      </View>

      {/* 3. Certificates */}
      {profile.certificates && profile.certificates.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Certificates & Accreditations</Text>
          {profile.certificates.map((cert) => (
            <View key={cert.id} style={styles.certRow}>
              <Text style={styles.certName}>🏅 {cert.name}</Text>
              <Text style={styles.certOrg}>{cert.issuingOrganization} • {cert.issueDate}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 4. Skills */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Skills & Competencies ({profile.skills?.length || 0})</Text>
        <View style={styles.skillsWrap}>
          {profile.skills?.map((s) => (
            <View key={s.id} style={styles.skillItem}>
              <Text style={styles.skillName}>{s.skillName}</Text>
              <Text style={styles.skillLevel}>{s.proficiencyLevel}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Education */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Education</Text>
        {profile.education?.map((edu) => (
          <View key={edu.id} style={styles.eduItem}>
            <Text style={styles.eduCollege}>{edu.institutionName}</Text>
            <Text style={styles.eduDegree}>{edu.degree} in {edu.fieldOfStudy}</Text>
            <Text style={styles.eduMeta}>{edu.startYear} - {edu.endYear} {edu.gradeOrCgpa ? `• ${edu.gradeOrCgpa}` : ''}</Text>
          </View>
        ))}
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  errorSub: {
    fontSize: 13,
    color: COLORS.neutral[500],
    marginTop: 4,
    textAlign: 'center',
  },
  backHomeBtn: {
    marginTop: 16,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  backHomeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  verifiedPill: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  shareBtn: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  shareBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[700],
  },
  headerInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: COLORS.brand[500],
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brand[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarChar: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.brand[800],
  },
  fullName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.neutral[900],
    textAlign: 'center',
  },
  headline: {
    fontSize: 13,
    color: COLORS.neutral[600],
    marginTop: 3,
    textAlign: 'center',
    lineHeight: 18,
  },
  location: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 4,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  chip: {
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  chipGreen: {
    backgroundColor: COLORS.brand[50],
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  chipGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.neutral[900],
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.neutral[700],
    lineHeight: 19,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[700],
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginBottom: 12,
  },
  projectBox: {
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 10,
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
  techTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  techTag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  techTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  projectLinkRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent[600],
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.neutral[400],
  },
  certRow: {
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    marginBottom: 8,
  },
  certName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  certOrg: {
    fontSize: 11,
    color: COLORS.neutral[600],
    marginTop: 2,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  skillLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  eduItem: {
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
  eduMeta: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
});
