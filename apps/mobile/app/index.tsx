import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { secureStorage } from '../src/lib/secureStorage';
import { apiClient } from '../src/services/api';
import { COLORS } from '@fresher2work/ui-tokens';

export default function AppEntry() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await secureStorage.getAuthToken();
      if (token) {
        try {
          const meRes = await apiClient.getStudentProfile();
          if (meRes.completeness && meRes.completeness.score < 50) {
            router.replace('/(onboarding)/wizard');
          } else {
            router.replace('/(tabs)');
          }
        } catch {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(auth)/login');
      }
      setChecking(false);
    }
    checkAuth();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.brandTitle}>FresherToWork</Text>
      <Text style={styles.tagline}>Launch Your Career With Proof of Work</Text>
      {checking && <ActivityIndicator size="large" color={COLORS.brand[600]} style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.neutral[900],
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
});
