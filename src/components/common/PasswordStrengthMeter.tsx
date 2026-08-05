import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { evaluatePasswordStrength } from '../../utils/validation';
import { useThemeStore } from '../../store/useThemeStore';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { theme } = useThemeStore();
  const strength = evaluatePasswordStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Password Security:
        </Text>
        <Text style={[styles.statusText, { color: strength.color }]}>
          {strength.label} ({strength.score}%)
        </Text>
      </View>

      {/* Bar */}
      <View style={[styles.barBg, { backgroundColor: theme.surface }]}>
        <View
          style={[
            styles.barFill,
            { width: `${strength.score}%`, backgroundColor: strength.color },
          ]}
        />
      </View>

      {/* Rules list */}
      <View style={styles.rulesGrid}>
        <View style={styles.ruleItem}>
          {strength.hasMinLength ? (
            <Check size={14} color={theme.success} />
          ) : (
            <X size={14} color={theme.textMuted} />
          )}
          <Text
            style={[
              styles.ruleText,
              { color: strength.hasMinLength ? theme.textPrimary : theme.textMuted },
            ]}
          >
            At least 6 characters
          </Text>
        </View>

        <View style={styles.ruleItem}>
          {strength.hasNumber ? (
            <Check size={14} color={theme.success} />
          ) : (
            <X size={14} color={theme.textMuted} />
          )}
          <Text
            style={[
              styles.ruleText,
              { color: strength.hasNumber ? theme.textPrimary : theme.textMuted },
            ]}
          >
            Includes a number
          </Text>
        </View>

        <View style={styles.ruleItem}>
          {strength.hasSpecialChar ? (
            <Check size={14} color={theme.success} />
          ) : (
            <X size={14} color={theme.textMuted} />
          )}
          <Text
            style={[
              styles.ruleText,
              { color: strength.hasSpecialChar ? theme.textPrimary : theme.textMuted },
            ]}
          >
            Special symbol (!@#$)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -8,
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  rulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ruleText: {
    fontSize: 11,
    marginLeft: 4,
  },
});
