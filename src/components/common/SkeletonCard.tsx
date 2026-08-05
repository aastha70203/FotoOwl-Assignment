import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const SkeletonCard: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
      ]}
    >
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.surface }]} />
      <View style={styles.content}>
        <View style={[styles.titleLine, { backgroundColor: theme.surface }]} />
        <View style={[styles.subLine, { backgroundColor: theme.surface }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagePlaceholder: {
    height: 140,
    width: '100%',
  },
  content: {
    padding: 12,
  },
  titleLine: {
    height: 14,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  subLine: {
    height: 10,
    width: '40%',
    borderRadius: 4,
  },
});
