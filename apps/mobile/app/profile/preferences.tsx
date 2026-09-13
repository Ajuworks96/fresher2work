import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  WorkMode,
  RelocationPreference,
  AvailabilityOption,
  WorkType,
  StudentPreferences,
} from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

const POPULAR_ROLES = [
  'Digital Marketing Executive',
  'Social Media Executive',
  'SEO Executive',
  'Graphic Designer',
  'Content Creator',
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Mobile App Developer',
  'Data Analyst',
  'Video Editor',
  'Motion Designer',
  'Product Specialist',
];

const POPULAR_INDUSTRIES = [
  'Marketing & Advertising',
  'IT & Software',
  'Design & Creative Media',
  'E-Commerce',
  'FinTech',
  'EdTech',
  'Media & Entertainment',
  'Healthcare',
  'Logistics & Supply Chain',
  'SaaS & Startups',
];

const POPULAR_LOCATIONS = [
  'Kozhikode',
  'Kochi',
  'Bengaluru',
  'Dubai',
  'UAE',
  'Remote',
  'Anywhere',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Delhi NCR',
  'Trivandrum',
];

const POPULAR_COUNTRIES = [
  'India',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Oman',
  'Singapore',
  'Germany',
  'United Kingdom',
  'United States',
];

const WORK_MODE_OPTIONS: { id: WorkMode; label: string; icon: string; desc: string }[] = [
  { id: WorkMode.REMOTE, label: 'Remote', icon: '🏠', desc: 'Work from home or anywhere' },
  { id: WorkMode.HYBRID, label: 'Hybrid', icon: '🏢', desc: 'Mix of office and remote' },
  { id: WorkMode.ON_SITE, label: 'On-site', icon: '📍', desc: 'Full-time at company premises' },
];

const RELOCATION_OPTIONS: { id: RelocationPreference; label: string; icon: string }[] = [
  { id: RelocationPreference.WILLING, label: 'Willing to relocate anywhere', icon: '✈️' },
  { id: RelocationPreference.DOMESTIC_ONLY, label: 'Within home country only', icon: '🇮🇳' },
  { id: RelocationPreference.INTERNATIONAL_ONLY, label: 'International opportunities only', icon: '🌐' },
  { id: RelocationPreference.NOT_WILLING, label: 'Not willing to relocate', icon: '🏠' },
];

const AVAILABILITY_OPTIONS: { id: AvailabilityOption; label: string; icon: string }[] = [
  { id: AvailabilityOption.IMMEDIATE, label: 'Immediate (Ready to join now)', icon: '⚡' },
  { id: AvailabilityOption.WITHIN_15_DAYS, label: 'Within 15 days', icon: '⏱️' },
  { id: AvailabilityOption.WITHIN_30_DAYS, label: 'Within 30 days (1 month)', icon: '📅' },
  { id: AvailabilityOption.WITHIN_60_DAYS, label: 'Within 60 days (2 months)', icon: '🗓️' },
];

const WORK_TYPE_OPTIONS: { id: WorkType; label: string; icon: string }[] = [
  { id: WorkType.FULL_TIME, label: 'Full-time Role', icon: '💼' },
  { id: WorkType.INTERNSHIP, label: 'Internship / Trainee', icon: '🎓' },
  { id: WorkType.CONTRACT, label: 'Contract', icon: '📄' },
  { id: WorkType.PART_TIME, label: 'Part-time', icon: '⏳' },
  { id: WorkType.FREELANCE, label: 'Freelance / Project', icon: '🎨' },
];

export default function CareerPreferencesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Preference State
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [customIndustryInput, setCustomIndustryInput] = useState('');

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [customLocationInput, setCustomLocationInput] = useState('');

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [customCountryInput, setCustomCountryInput] = useState('');

  const [selectedWorkModes, setSelectedWorkModes] = useState<WorkMode[]>([WorkMode.REMOTE, WorkMode.HYBRID]);
  const [relocationWillingness, setRelocationWillingness] = useState<RelocationPreference>(RelocationPreference.WILLING);
  const [availability, setAvailability] = useState<AvailabilityOption>(AvailabilityOption.IMMEDIATE);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<WorkType[]>([WorkType.FULL_TIME, WorkType.INTERNSHIP]);
  const [expectedSalaryMin, setExpectedSalaryMin] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('INR');

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await apiClient.getPreferences();
        if (res?.preferences) {
          const p = res.preferences;
          if (p.preferredRoles && p.preferredRoles.length > 0) setSelectedRoles(p.preferredRoles);
          if (p.preferredIndustries && p.preferredIndustries.length > 0) setSelectedIndustries(p.preferredIndustries);
          if (p.preferredLocations && p.preferredLocations.length > 0) setSelectedLocations(p.preferredLocations);
          if (p.preferredCountries && p.preferredCountries.length > 0) setSelectedCountries(p.preferredCountries);
          if (p.workModes && p.workModes.length > 0) {
            setSelectedWorkModes(p.workModes);
          } else if (p.workMode) {
            setSelectedWorkModes([p.workMode]);
          }
          if (p.relocationWillingness) setRelocationWillingness(p.relocationWillingness);
          if (p.availability) setAvailability(p.availability);
          if (p.preferredWorkTypes && p.preferredWorkTypes.length > 0) setSelectedWorkTypes(p.preferredWorkTypes);
          if (p.expectedSalaryMin) setExpectedSalaryMin(String(p.expectedSalaryMin));
          if (p.salaryCurrency) setSalaryCurrency(p.salaryCurrency);
        }
      } catch (err) {
        console.warn('Failed to load preferences', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  // Multi-select toggle helpers
  const toggleItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomItem = (list: string[], setList: (items: string[]) => void, input: string, setInput: (v: string) => void) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  };

  const toggleWorkMode = (mode: WorkMode) => {
    if (selectedWorkModes.includes(mode)) {
      if (selectedWorkModes.length === 1) {
        Alert.alert('Selection Required', 'Please keep at least one work mode selected.');
        return;
      }
      setSelectedWorkModes(selectedWorkModes.filter((m) => m !== mode));
    } else {
      setSelectedWorkModes([...selectedWorkModes, mode]);
    }
  };

  const toggleWorkType = (type: WorkType) => {
    if (selectedWorkTypes.includes(type)) {
      if (selectedWorkTypes.length === 1) {
        Alert.alert('Selection Required', 'Please select at least one preferred work type.');
        return;
      }
      setSelectedWorkTypes(selectedWorkTypes.filter((t) => t !== type));
    } else {
      setSelectedWorkTypes([...selectedWorkTypes, type]);
    }
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) {
      Alert.alert('Role Required', 'Please specify at least one preferred job role.');
      return;
    }
    if (selectedLocations.length === 0) {
      Alert.alert('Location Required', 'Please specify at least one preferred location or remote preference.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<StudentPreferences> = {
        preferredRoles: selectedRoles,
        preferredIndustries: selectedIndustries,
        preferredLocations: selectedLocations,
        preferredCountries: selectedCountries,
        workModes: selectedWorkModes,
        workMode: selectedWorkModes[0] || WorkMode.HYBRID,
        relocationWillingness,
        availability,
        preferredWorkTypes: selectedWorkTypes,
        expectedSalaryMin: expectedSalaryMin ? Number(expectedSalaryMin) : undefined,
        salaryCurrency,
      };

      await apiClient.updatePreferences(payload);
      Alert.alert('Preferences Saved', 'Your career preferences have been updated for recruiter discovery.', [
        { text: 'Back to Profile', onPress: () => router.replace('/(tabs)/profile') },
        { text: 'OK' },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save career preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Career Preferences</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveNavButton}>
          <Text style={styles.saveNavButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introBanner}>
          <Text style={styles.introTitle}>🎯 Match with the Right Opportunities</Text>
          <Text style={styles.introSubtitle}>
            Recruiters filter and discover candidates using these structured preferences. Multi-select all roles, locations, and modes you are open to.
          </Text>
        </View>

        {/* 1. Preferred Job Roles */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>1. Target Job Roles</Text>
            <Text style={styles.countBadge}>{selectedRoles.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select the exact fresher roles you want recruiters to consider you for.
          </Text>

          <View style={styles.chipGrid}>
            {POPULAR_ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role);
              return (
                <TouchableOpacity
                  key={role}
                  onPress={() => toggleItem(selectedRoles, setSelectedRoles, role)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}
                    {role}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Role Input */}
          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder="Add other target role (e.g. Flutter Dev)..."
              placeholderTextColor={COLORS.neutral[400]}
              value={customRoleInput}
              onChangeText={setCustomRoleInput}
              onSubmitEditing={() =>
                addCustomItem(selectedRoles, setSelectedRoles, customRoleInput, setCustomRoleInput)
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() =>
                addCustomItem(selectedRoles, setSelectedRoles, customRoleInput, setCustomRoleInput)
              }
            >
              <Text style={styles.addTagButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Preferred Industries / Categories */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. Target Industries & Sectors</Text>
            <Text style={styles.countBadge}>{selectedIndustries.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Choose domains you are enthusiastic to build your career in.
          </Text>

          <View style={styles.chipGrid}>
            {POPULAR_INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <TouchableOpacity
                  key={ind}
                  onPress={() => toggleItem(selectedIndustries, setSelectedIndustries, ind)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}
                    {ind}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder="Add other industry (e.g. Gaming)..."
              placeholderTextColor={COLORS.neutral[400]}
              value={customIndustryInput}
              onChangeText={setCustomIndustryInput}
              onSubmitEditing={() =>
                addCustomItem(selectedIndustries, setSelectedIndustries, customIndustryInput, setCustomIndustryInput)
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() =>
                addCustomItem(selectedIndustries, setSelectedIndustries, customIndustryInput, setCustomIndustryInput)
              }
            >
              <Text style={styles.addTagButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Preferred Locations */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>3. Preferred Locations & Cities</Text>
            <Text style={styles.countBadge}>{selectedLocations.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Specify cities or regions you want to work in. Include &quot;Remote&quot; or &quot;Anywhere&quot; if open.
          </Text>

          <View style={styles.chipGrid}>
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = selectedLocations.includes(loc);
              return (
                <TouchableOpacity
                  key={loc}
                  onPress={() => toggleItem(selectedLocations, setSelectedLocations, loc)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}
                    {loc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder="Add other city (e.g. Pune, Kannur)..."
              placeholderTextColor={COLORS.neutral[400]}
              value={customLocationInput}
              onChangeText={setCustomLocationInput}
              onSubmitEditing={() =>
                addCustomItem(selectedLocations, setSelectedLocations, customLocationInput, setCustomLocationInput)
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() =>
                addCustomItem(selectedLocations, setSelectedLocations, customLocationInput, setCustomLocationInput)
              }
            >
              <Text style={styles.addTagButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Preferred Countries */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>4. Preferred Countries</Text>
            <Text style={styles.countBadge}>{selectedCountries.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Countries where you are interested in working or receiving offers from.
          </Text>

          <View style={styles.chipGrid}>
            {POPULAR_COUNTRIES.map((country) => {
              const isSelected = selectedCountries.includes(country);
              return (
                <TouchableOpacity
                  key={country}
                  onPress={() => toggleItem(selectedCountries, setSelectedCountries, country)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}
                    {country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder="Add other country..."
              placeholderTextColor={COLORS.neutral[400]}
              value={customCountryInput}
              onChangeText={setCustomCountryInput}
              onSubmitEditing={() =>
                addCustomItem(selectedCountries, setSelectedCountries, customCountryInput, setCustomCountryInput)
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() =>
                addCustomItem(selectedCountries, setSelectedCountries, customCountryInput, setCustomCountryInput)
              }
            >
              <Text style={styles.addTagButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Work Mode (Remote / Hybrid / On-Site) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Work Mode Preference</Text>
          <Text style={styles.sectionSubtitle}>
            Select all modes you are open to (multi-select allowed).
          </Text>

          <View style={styles.optionsVertical}>
            {WORK_MODE_OPTIONS.map((opt) => {
              const isSelected = selectedWorkModes.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => toggleWorkMode(opt.id)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                  <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleSelected]}>
                    {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 6. Relocation Willingness */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Relocation Willingness</Text>
          <Text style={styles.sectionSubtitle}>
            Are you open to relocating if a company sponsors or offers an opportunity?
          </Text>

          <View style={styles.optionsVertical}>
            {RELOCATION_OPTIONS.map((opt) => {
              const isSelected = relocationWillingness === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setRelocationWillingness(opt.id)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {opt.label}
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 7. Availability / Notice Period */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>7. Joining Availability</Text>
          <Text style={styles.sectionSubtitle}>
            When are you available to start work once selected?
          </Text>

          <View style={styles.optionsVertical}>
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isSelected = availability === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setAvailability(opt.id)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {opt.label}
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 8. Preferred Work Type */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>8. Preferred Work Types</Text>
            <Text style={styles.countBadge}>{selectedWorkTypes.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select all employment engagement models you want to be considered for.
          </Text>

          <View style={styles.optionsVertical}>
            {WORK_TYPE_OPTIONS.map((opt) => {
              const isSelected = selectedWorkTypes.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => toggleWorkType(opt.id)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {opt.label}
                    </Text>
                  </View>
                  <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleSelected]}>
                    {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 9. Minimum Expected Compensation */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>9. Expected Annual Compensation (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Minimum benchmark expectation in your preferred currency.
          </Text>

          <View style={styles.salaryRow}>
            <View style={styles.currencyToggle}>
              {['INR', 'AED', 'USD'].map((curr) => (
                <TouchableOpacity
                  key={curr}
                  onPress={() => setSalaryCurrency(curr)}
                  style={[styles.currencyBtn, salaryCurrency === curr && styles.currencyBtnActive]}
                >
                  <Text style={[styles.currencyText, salaryCurrency === curr && styles.currencyTextActive]}>
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.salaryInput}
              placeholder="e.g. 350000"
              placeholderTextColor={COLORS.neutral[400]}
              keyboardType="numeric"
              value={expectedSalaryMin}
              onChangeText={setExpectedSalaryMin}
            />
          </View>
        </View>

        {/* Save Button bottom */}
        <TouchableOpacity
          style={[styles.saveMainBtn, saving && styles.saveMainBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveMainBtnText}>Save Career Preferences</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    padding: 6,
  },
  backButtonText: {
    fontSize: 15,
    color: COLORS.brand[600],
    fontWeight: '600',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  saveNavButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.brand[600],
    borderRadius: BORDER_RADIUS.md,
  },
  saveNavButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introBanner: {
    backgroundColor: COLORS.brand[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.brand[200],
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brand[900],
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 13,
    color: COLORS.brand[800],
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand[700],
    backgroundColor: COLORS.brand[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.neutral[500],
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 17,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  chipSelected: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  chipText: {
    fontSize: 13,
    color: COLORS.neutral[700],
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  addTagButton: {
    backgroundColor: COLORS.neutral[800],
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  addTagButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  optionsVertical: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    backgroundColor: COLORS.neutral[50],
  },
  optionCardSelected: {
    borderColor: COLORS.brand[500],
    backgroundColor: COLORS.brand[50],
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[800],
  },
  optionTitleSelected: {
    color: COLORS.brand[900],
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCircleSelected: {
    borderColor: COLORS.brand[600],
    backgroundColor: COLORS.brand[600],
  },
  checkboxTick: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.brand[600],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand[600],
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  currencyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  currencyBtnActive: {
    backgroundColor: '#ffffff',
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral[600],
  },
  currencyTextActive: {
    color: COLORS.brand[700],
  },
  salaryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  saveMainBtn: {
    backgroundColor: COLORS.brand[600],
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: COLORS.brand[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveMainBtnDisabled: {
    opacity: 0.7,
  },
  saveMainBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
