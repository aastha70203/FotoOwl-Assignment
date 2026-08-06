import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  style,
  ...props
}) => {
  const { theme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          onPress={handleContainerPress}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={handleContainerPress}
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBg,
            borderColor: error
              ? theme.error
              : isFocused
              ? theme.primary
              : theme.inputBorder,
          },
          isFocused && { shadowColor: theme.primary, elevation: 3 },
        ]}
      >
        {leftIcon && (
          <View style={styles.iconLeft} pointerEvents="none">
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={inputRef}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: theme.textPrimary },
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
            leftIcon ? { paddingLeft: 6 } : null,
            style,
          ]}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.textSecondary} />
            ) : (
              <Eye size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </Pressable>

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
    marginBottom: 6,
    letterSpacing: 0.2,
    cursor: 'pointer',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 50,
    cursor: 'text',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    height: '100%',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
