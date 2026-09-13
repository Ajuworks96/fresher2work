import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { UserRole } from '@fresher2work/types';
import { apiClient } from '../../src/services/api';
import { secureStorage } from '../../src/lib/secureStorage';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.register({
        fullName,
        email,
        phone,
        password,
        role: UserRole.STUDENT,
      });
      await secureStorage.saveAuthToken(res.token);
      await secureStorage.saveUserData(res.user);
      router.replace('/(onboarding)/wizard');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.badge}>Student Account</Text>
          <Text style={styles.title}>Create Profile</Text>
          <Text style={styles.subtitle}>
            Build your talent showcase, upload your CV, and get discovered by top companies.
          </Text>
        </View>

        <View style={styles.formContainer}>
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

          <Text style={[styles.label, { marginTop: 14 }]}>Phone Number (Optional)</Text>
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

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand[50],
    color: COLORS.brand[700],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.neutral[900],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 6,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[700],
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  primaryButton: {
    height: 48,
    backgroundColor: COLORS.brand[600],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.neutral[600],
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
});
