import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { GenderType } from '../../types';

interface RadioGroupProps {
  label?: string;
  options: GenderType[];
  selectedOption: string;
  onSelect: (option: GenderType) => void;
  error?: string | null;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  error,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}

      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              onPress={() => onSelect(option)}
              style={[
                styles.radioItem,
                {
                  backgroundColor: isSelected ? theme.primaryLight + '20' : theme.inputBg,
                  borderColor: isSelected ? theme.primary : theme.inputBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.outerCircle,
                  { borderColor: isSelected ? theme.primary : theme.textMuted },
                ]}
              >
                {isSelected && (
                  <View
                    style={[styles.innerCircle, { backgroundColor: theme.primary }]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? theme.primary : theme.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: '45%',
    flexGrow: 1,
  },
  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
