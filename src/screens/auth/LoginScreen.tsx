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
import { Mail, Lock, Sparkles, LogIn, Zap } from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useToast } from '../../hooks/useToast';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { login, isLoading, authError } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickFill = () => {
    setEmail('alex.vance@fotoowl.ai');
    setPassword('PassWord123!');
    showToast('info', 'Demo Login Filled', 'Click Login to test session persistence!');
  };

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res.success) {
      showToast('success', 'Welcome Back!', 'Session restored successfully.');
    } else if (res.error) {
      showToast('error', 'Login Failed', res.error);
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
        <View style={styles.brandingHeader}>
          <View style={[styles.logoIconBg, { backgroundColor: theme.primary }]}>
            <Sparkles size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.companyTitle, { color: theme.textPrimary }]}>
            FotoOwl<Text style={{ color: theme.primary }}>.ai</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign in to manage your AI media gallery & favorites
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleQuickFill}
          style={[styles.quickFillBtn, { backgroundColor: theme.surface, borderColor: theme.primary }]}
        >
          <Zap size={16} color={theme.primary} />
          <Text style={[styles.quickFillText, { color: theme.primary }]}>
            ⚡ Auto-Fill Demo User Credentials
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: theme.textPrimary }]}>
            Member Sign In
          </Text>

          <CustomInput
            label="Email Address"
            placeholder="registered@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={theme.textMuted} />}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon={<Lock size={18} color={theme.textMuted} />}
          />

          {authError ? (
            <View style={[styles.errorBanner, { backgroundColor: theme.error + '20' }]}>
              <Text style={[styles.errorBannerText, { color: theme.error }]}>
                {authError}
              </Text>
            </View>
          ) : null}

          <CustomButton
            title="Sign In to Gallery"
            onPress={handleLogin}
            isLoading={isLoading}
            variant="primary"
            size="large"
            icon={<LogIn size={20} color="#FFFFFF" />}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footerLinkRow}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            Don't have an account yet?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 14 }}>
              Register Now
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
    paddingTop: 70,
    paddingBottom: 40,
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  companyTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 20,
    gap: 8,
  },
  quickFillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
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
    marginTop: 10,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});
