import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { useToastStore } from '../../hooks/useToast';
import { useThemeStore } from '../../store/useThemeStore';
import { ToastType } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToastStore();
  const { theme } = useThemeStore();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={22} color={theme.success} />;
      case 'error':
        return <AlertCircle size={22} color={theme.error} />;
      case 'warning':
        return <AlertTriangle size={22} color={theme.warning} />;
      default:
        return <Info size={22} color={theme.primary} />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.error;
      case 'warning':
        return theme.warning;
      default:
        return theme.primary;
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <View
          key={t.id}
          style={[
            styles.toastCard,
            {
              backgroundColor: theme.cardBg,
              borderColor: getBorderColor(t.type),
            },
          ]}
        >
          <View style={styles.iconContainer}>{getToastIcon(t.type)}</View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {t.title}
            </Text>
            {t.message ? (
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                {t.message}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => hideToast(t.id)} style={styles.closeBtn}>
            <X size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
