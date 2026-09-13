import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Share,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StudentProfile, CompletenessBreakdown, PaymentRecord } from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

type PaymentFlowState = 'IDLE' | 'CREATING_ORDER' | 'VERIFYING' | 'FAILED' | 'SUCCESS';

export default function ActivationScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessBreakdown | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flowState, setFlowState] = useState<PaymentFlowState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [profileRes, historyRes] = await Promise.all([
        apiClient.getStudentProfile(),
        apiClient.getPaymentHistory().catch(() => ({ history: [] })),
      ]);
      setProfile(profileRes.profile);
      setCompleteness(profileRes.completeness);
      setPaymentHistory(historyRes.history || []);
    } catch (err: any) {
      console.warn('Failed to load profile/payment data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handlePayActivation = async () => {
    if (!completeness?.canActivate) {
      Alert.alert(
        'Profile Completeness Required',
        `Your profile completeness is currently ${completeness?.score || 0}%. You must reach at least 70% before activating your profile.`
      );
      return;
    }

    setFlowState('CREATING_ORDER');
    setErrorMessage(null);

    try {
      // 1. Server-Side Order Creation (Price is strictly ₹99 INR / 9900 paise on backend)
      const order = await apiClient.createPaymentOrder();

      setFlowState('VERIFYING');

      // 2. Mock / Production Payment Flow
      // In native production: RazorpayCheckout.open({ key: order.keyId, amount: order.amount, order_id: order.orderId, ... })
      // For automated verification and sandbox demo:
      const paymentId = `pay_FTW_${Date.now()}`;
      const signature = 'sig_mock_verified_signature_123';

      // 3. Server-Side Cryptographic Signature Verification & Profile Activation
      const res = await apiClient.verifyPayment({
        orderId: order.orderId,
        paymentId,
        signature,
      });

      setProfile(res.profile);
      setFlowState('SUCCESS');
      await loadData();
    } catch (err: any) {
      setFlowState('FAILED');
      setErrorMessage(err.message || 'Payment could not be completed or verified.');
    }
  };

  const handleShareProfile = async () => {
    if (!profile?.publicSlug) return;
    const url = `https://freshertowork.com/p/${profile.publicSlug}`;
    try {
      await Share.share({
        message: `Check out my verified talent profile on FresherToWork: ${url}`,
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
        <Text style={styles.loadingText}>Checking activation status...</Text>
      </View>
    );
  }

  const latestPayment = paymentHistory.find((p) => p.status === 'SUCCESS');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ========================================================================= */}
      {/* 1. ACTIVATED PROFILE STATE                                                */}
      {/* ========================================================================= */}
      {profile?.isActivated ? (
        <View>
          {/* Hero Active Banner */}
          <View style={styles.activeCard}>
            <View style={styles.badgePulseRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.pulseText}>LIVE & DISCOVERABLE</Text>
            </View>

            <Text style={styles.activeIcon}>⚡</Text>
            <Text style={styles.activeHeading}>Talent Profile Active</Text>
            <Text style={styles.activeBody}>
              Your profile is verified and indexed in the FresherToWork discovery engine. Recruiters can now search your skills, view your proof-of-work projects, inspect your CV, and contact you directly.
            </Text>

            {/* Public Link Box */}
            <View style={styles.slugBox}>
              <Text style={styles.slugLabel}>Your Public Talent URL:</Text>
              <Text style={styles.slugValue}>freshertowork.com/p/{profile.publicSlug}</Text>

              <View style={styles.slugActionRow}>
                <TouchableOpacity onPress={handleShareProfile} style={styles.slugShareBtn}>
                  <Text style={styles.slugShareBtnText}>🔗 Share Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/profile/${profile.publicSlug}`)}
                  style={styles.slugPreviewBtn}
                >
                  <Text style={styles.slugPreviewBtnText}>👁️ View Public Page</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Official Payment Receipt Card */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Official Activation Receipt</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidBadgeText}>✓ PAID & VERIFIED</Text>
              </View>
            </View>

            <View style={styles.receiptGrid}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Plan</Text>
                <Text style={styles.receiptVal}>Lifetime Profile Activation</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValHighlight}>₹99.00 INR</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Recurring Charges</Text>
                <Text style={styles.receiptVal}>₹0 (Zero subscriptions)</Text>
              </View>
              {latestPayment && (
                <>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Order ID</Text>
                    <Text style={styles.receiptValMonospace}>{latestPayment.gatewayOrderId}</Text>
                  </View>
                  {latestPayment.gatewayPaymentId && (
                    <View style={styles.receiptRow}>
                      <Text style={styles.receiptLabel}>Payment ID</Text>
                      <Text style={styles.receiptValMonospace}>{latestPayment.gatewayPaymentId}</Text>
                    </View>
                  )}
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Verified Date</Text>
                    <Text style={styles.receiptVal}>
                      {new Date(latestPayment.verifiedAt || latestPayment.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Talent Status Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>🎯 What Happens Next?</Text>
            <Text style={styles.infoCardBody}>
              • Keep your projects and skills updated to maintain high relevance.
              {'\n'}• Recruiters contact you directly via your verified phone, email, or LinkedIn.
              {'\n'}• Your ₹99 activation never expires.
            </Text>
          </View>
        </View>
      ) : (
        /* ========================================================================= */
        /* 2. PRE-ACTIVATION / PAYMENT PENDING / RETRY FLOW                           */
        /* ========================================================================= */
        <View>
          {/* Hero Value Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>ONE-TIME TALENT ACTIVATION</Text>
              </View>
              <Text style={styles.priceTag}>
                ₹99 <Text style={styles.priceCurrency}>INR</Text>
              </Text>
            </View>

            <Text style={styles.heroTitle}>Unlock Direct Recruiter Discovery</Text>
            <Text style={styles.heroSubtitle}>
              One-time ₹99 fee to activate and index your talent profile into the verified fresher talent discovery pool.
            </Text>
          </View>

          {/* Completeness Status Card */}
          <View style={styles.meterCard}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterTitle}>Profile Readiness</Text>
              <Text
                style={[
                  styles.meterPercent,
                  { color: (completeness?.score || 0) >= 70 ? COLORS.brand[700] : '#d97706' },
                ]}
              >
                {completeness?.score || 0}%
              </Text>
            </View>

            <View style={styles.meterTrack}>
              <View
                style={[
                  styles.meterFill,
                  {
                    width: `${Math.min(completeness?.score || 0, 100)}%`,
                    backgroundColor: (completeness?.score || 0) >= 70 ? COLORS.brand[600] : '#f59e0b',
                  },
                ]}
              />
            </View>

            {(completeness?.score || 0) < 70 ? (
              <View style={styles.missingBox}>
                <Text style={styles.missingTitle}>
                  ⚠️ Reach at least 70% completeness to activate (Currently {completeness?.score || 0}%):
                </Text>
                {completeness?.missingSteps.map((step, idx) => (
                  <Text key={idx} style={styles.missingItem}>
                    • {step}
                  </Text>
                ))}
                <TouchableOpacity
                  style={styles.completeProfileBtn}
                  onPress={() => router.push('/profile/edit')}
                >
                  <Text style={styles.completeProfileBtnText}>✏️ Complete Missing Steps →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.readyBox}>
                <Text style={styles.readyText}>✓ Profile requirements complete! Ready for ₹99 activation.</Text>
              </View>
            )}
          </View>

          {/* Value Deliverables */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsHeading}>Included with ₹99 Activation:</Text>

            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>🎯</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Direct Recruiter Search Pool</Text>
                <Text style={styles.benefitDesc}>
                  Your profile is indexed for keyword and skill searches across hundreds of verified hiring managers.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>💼</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Interactive Proof of Work</Text>
                <Text style={styles.benefitDesc}>
                  Showcase projects, creative work samples, role responsibilities, and live demos in a clean portfolio.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>📄</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>In-Browser PDF CV Viewer</Text>
                <Text style={styles.benefitDesc}>
                  Recruiters can preview and download your verified original PDF resume with 1 click.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>🔗</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Custom Public Share Link</Text>
                <Text style={styles.benefitDesc}>
                  Get a personalized URL (freshertowork.com/p/your-name) to share on LinkedIn or with employers.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>🛡️</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Zero Recurring Fees</Text>
                <Text style={styles.benefitDesc}>
                  No monthly renewals, no hidden charges, and no job portal commission.
                </Text>
              </View>
            </View>
          </View>

          {/* Payment State Messages (Processing / Failure) */}
          {flowState === 'CREATING_ORDER' && (
            <View style={styles.statusBanner}>
              <ActivityIndicator size="small" color={COLORS.brand[600]} />
              <Text style={styles.statusBannerText}>Initiating secure ₹99 order...</Text>
            </View>
          )}

          {flowState === 'VERIFYING' && (
            <View style={styles.statusBanner}>
              <ActivityIndicator size="small" color={COLORS.brand[600]} />
              <Text style={styles.statusBannerText}>Verifying server-side cryptographic signature...</Text>
            </View>
          )}

          {flowState === 'FAILED' && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerIcon}>✕</Text>
              <View style={styles.errorBannerContent}>
                <Text style={styles.errorBannerTitle}>Payment Incomplete or Cancelled</Text>
                <Text style={styles.errorBannerText}>{errorMessage || 'Please try again.'}</Text>
              </View>
            </View>
          )}

          {/* Security Assurance */}
          <View style={styles.securityRow}>
            <Text style={styles.securityText}>🔒 256-Bit SSL Encrypted • Razorpay Gateway • Instant Activation</Text>
          </View>

          {/* Activation CTA Button */}
          <TouchableOpacity
            style={[
              styles.payButton,
              (!completeness?.canActivate || flowState === 'CREATING_ORDER' || flowState === 'VERIFYING') &&
                styles.payButtonDisabled,
            ]}
            onPress={handlePayActivation}
            disabled={
              !completeness?.canActivate || flowState === 'CREATING_ORDER' || flowState === 'VERIFYING'
            }
          >
            {flowState === 'CREATING_ORDER' || flowState === 'VERIFYING' ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.payButtonText}>
                {flowState === 'FAILED'
                  ? 'Retry ₹99 Payment →'
                  : completeness?.canActivate
                  ? 'Pay ₹99 & Activate Profile →'
                  : `Reach 70% Score to Activate (${completeness?.score || 0}%)`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    marginBottom: 16,
  },
  badgePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  pulseText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
    letterSpacing: 0.5,
  },
  activeIcon: {
    fontSize: 42,
    marginBottom: 8,
  },
  activeHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  activeBody: {
    fontSize: 13,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  slugBox: {
    marginTop: 18,
    backgroundColor: COLORS.neutral[50],
    padding: 14,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  slugLabel: {
    fontSize: 11,
    color: COLORS.neutral[500],
    fontWeight: '600',
  },
  slugValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[700],
    marginTop: 3,
    marginBottom: 12,
  },
  slugActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  slugShareBtn: {
    flex: 1,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  slugShareBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  slugPreviewBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  slugPreviewBtnText: {
    color: COLORS.neutral[800],
    fontSize: 12,
    fontWeight: '600',
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    marginBottom: 12,
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  paidBadge: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
  },
  receiptGrid: {
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: COLORS.neutral[500],
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  receiptValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.brand[700],
  },
  receiptValMonospace: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: COLORS.neutral[600],
  },
  infoCard: {
    backgroundColor: COLORS.brand[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand[900],
    marginBottom: 6,
  },
  infoCardBody: {
    fontSize: 12,
    color: COLORS.brand[800],
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: COLORS.neutral[900],
    borderRadius: BORDER_RADIUS.lg,
    padding: 20,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: COLORS.brand[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  priceTag: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  priceCurrency: {
    fontSize: 14,
    color: COLORS.neutral[400],
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: COLORS.neutral[300],
    lineHeight: 17,
  },
  meterCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  meterPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  meterTrack: {
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  missingBox: {
    backgroundColor: '#fffbeb',
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  missingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  missingItem: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
    lineHeight: 16,
  },
  completeProfileBtn: {
    marginTop: 10,
    backgroundColor: '#d97706',
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  completeProfileBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  readyBox: {
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  readyText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  benefitsHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[900],
    marginBottom: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[800],
  },
  benefitDesc: {
    fontSize: 11,
    color: COLORS.neutral[500],
    marginTop: 1,
    lineHeight: 15,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand[50],
    borderWidth: 1,
    borderColor: COLORS.brand[200],
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 12,
    gap: 8,
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[800],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 12,
    gap: 8,
  },
  errorBannerIcon: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '700',
  },
  errorBannerContent: {
    flex: 1,
  },
  errorBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991b1b',
  },
  errorBannerText: {
    fontSize: 11,
    color: '#b91c1c',
    marginTop: 1,
  },
  securityRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 10,
    color: COLORS.neutral[400],
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: COLORS.brand[600],
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    shadowColor: COLORS.brand[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
