import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { secureStorage } from '../../src/lib/secureStorage';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await secureStorage.deleteAuthToken();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account & Privacy</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>App Version</Text>
          <Text style={styles.rowValue}>1.0.0 (V1 Beta)</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Privacy Policy</Text>
          <Text style={styles.rowValue}>PII Protected</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  rowLabel: {
    fontSize: 14,
    color: COLORS.neutral[800],
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  logoutButton: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error.border,
  },
  logoutText: {
    color: COLORS.error.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
