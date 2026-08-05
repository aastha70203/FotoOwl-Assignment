import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useToast } from '../../hooks/useToast';
import { PREDEFINED_CITIES } from '../../config/constants';
import { GenderType } from '../../types';
import { RegistrationFormData } from '../../utils/validation';

import { CustomInput } from '../../components/common/CustomInput';
import { RadioGroup } from '../../components/common/RadioGroup';
import { DropdownPicker } from '../../components/common/DropdownPicker';
import { PasswordStrengthMeter } from '../../components/common/PasswordStrengthMeter';
import { CustomButton } from '../../components/common/CustomButton';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { register, isLoading, authError } = useAuthStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    gender: 'Male',
    mobileNumber: '',
    address: '',
    city: 'Baner, Pune',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof RegistrationFormData]?: string }>({});

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleQuickFill = () => {
    setFormData({
      fullName: 'Alex Vance',
      email: 'alex.vance@fotoowl.ai',
      gender: 'Male',
      mobileNumber: '9876543210',
      address: '101 Startup Hub, High Street, Baner',
      city: 'Baner, Pune',
      password: 'PassWord123!',
      confirmPassword: 'PassWord123!',
    });
    setFieldErrors({});
    showToast('info', 'Demo Form Filled', 'Filled sample candidate details for quick testing!');
  };

  const handleRegister = async () => {
    const res = await register(formData);
    if (res.success) {
      showToast('success', 'Registration Successful', 'Welcome to FotoOwl Media Suite!');
    } else if (res.error) {
      showToast('error', 'Registration Failed', res.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Branding */}
        <View style={styles.brandingHeader}>
          <View style={[styles.logoIconBg, { backgroundColor: theme.primary }]}>
            <Sparkles size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.companyTitle, { color: theme.textPrimary }]}>
            FotoOwl<Text style={{ color: theme.primary }}>.ai</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Create your account to access the AI Media Gallery
          </Text>
        </View>

        {/* Quick Fill Button */}
        <TouchableOpacity
          onPress={handleQuickFill}
          style={[styles.quickFillBtn, { backgroundColor: theme.surface, borderColor: theme.primary }]}
        >
          <Zap size={16} color={theme.primary} />
          <Text style={[styles.quickFillText, { color: theme.primary }]}>
            ⚡ Quick Fill Demo Candidate Data
          </Text>
        </TouchableOpacity>

        {/* Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <CustomInput
            label="Full Name *"
            placeholder="John Doe"
            value={formData.fullName}
            onChangeText={(val) => updateField('fullName', val)}
            leftIcon={<User size={18} color={theme.textMuted} />}
            error={fieldErrors.fullName}
          />

          <CustomInput
            label="Email Address *"
            placeholder="john@example.com"
            value={formData.email}
            onChangeText={(val) => updateField('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={theme.textMuted} />}
            error={fieldErrors.email}
          />

          <RadioGroup
            label="Gender *"
            options={['Male', 'Female', 'Other', 'Prefer not to say']}
            selectedOption={formData.gender as GenderType}
            onSelect={(val) => updateField('gender', val)}
            error={fieldErrors.gender}
          />

          <CustomInput
            label="Mobile Number (10 Digits) *"
            placeholder="9876543210"
            value={formData.mobileNumber}
            onChangeText={(val) => updateField('mobileNumber', val)}
            keyboardType="numeric"
            maxLength={10}
            leftIcon={<Phone size={18} color={theme.textMuted} />}
            error={fieldErrors.mobileNumber}
          />

          <CustomInput
            label="Address *"
            placeholder="Street name, building, apartment..."
            value={formData.address}
            onChangeText={(val) => updateField('address', val)}
            multiline
            numberOfLines={2}
            leftIcon={<MapPin size={18} color={theme.textMuted} />}
            error={fieldErrors.address}
          />

          <DropdownPicker
            label="City *"
            options={PREDEFINED_CITIES}
            selectedOption={formData.city}
            onSelect={(val) => updateField('city', val)}
            error={fieldErrors.city}
          />

          <CustomInput
            label="Password *"
            placeholder="At least 6 characters"
            value={formData.password}
            onChangeText={(val) => updateField('password', val)}
            isPassword
            leftIcon={<Lock size={18} color={theme.textMuted} />}
            error={fieldErrors.password}
          />

          <PasswordStrengthMeter password={formData.password} />

          <CustomInput
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(val) => updateField('confirmPassword', val)}
            isPassword
            leftIcon={<Lock size={18} color={theme.textMuted} />}
            error={fieldErrors.confirmPassword}
          />

          {authError ? (
            <View style={[styles.errorBanner, { backgroundColor: theme.error + '20' }]}>
              <Text style={[styles.errorBannerText, { color: theme.error }]}>
                {authError}
              </Text>
            </View>
          ) : null}

          <CustomButton
            title="Create Account & Start"
            onPress={handleRegister}
            isLoading={isLoading}
            variant="primary"
            size="large"
            style={styles.submitBtn}
          />
        </View>

        {/* Footer Navigation Link */}
        <View style={styles.footerLinkRow}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 14 }}>
              Sign In Here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  companyTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 16,
    gap: 8,
  },
  quickFillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: 8,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
