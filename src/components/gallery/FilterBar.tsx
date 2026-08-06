import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Search, X, ArrowUpDown, Sparkles } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { FilterCategory } from '../../types';

export const FilterBar: React.FC = () => {
  const { theme } = useThemeStore();
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortOrder,
    setSortOrder,
  } = useGalleryStore();
  const inputRef = useRef<TextInput>(null);

  const categories: { label: string; value: FilterCategory; icon?: boolean }[] = [
    { label: 'All Pins', value: 'ALL' },
    { label: 'Collective Stream', value: 'COMMUNITY_UPLOADS', icon: true },
    { label: 'A-M Creators', value: 'AUTHOR_A_M' },
    { label: 'N-Z Creators', value: 'AUTHOR_N_Z' },
  ];

  const cycleSort = () => {
    if (sortOrder === 'ID_ASC') setSortOrder('ID_DESC');
    else if (sortOrder === 'ID_DESC') setSortOrder('AUTHOR_ASC');
    else setSortOrder('ID_ASC');
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'ID_DESC':
        return 'Recent ↓';
      case 'AUTHOR_ASC':
        return 'Name A-Z';
      default:
        return 'Default';
    }
  };

  return (
    <View style={styles.container}>
      {/* Pinterest Pill Search Bar */}
      <View style={styles.searchRow}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.searchBox,
            { backgroundColor: theme.surface, borderColor: 'transparent' },
          ]}
        >
          <Search size={20} color={theme.textMuted} />
          <TextInput
            ref={inputRef}
            placeholder="Search for event pins, creators, ideas..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: theme.textPrimary },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </Pressable>

        {/* Sort Filter Icon Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={cycleSort}
          style={[styles.sortBtn, { backgroundColor: theme.surface }]}
        >
          <ArrowUpDown size={18} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Pinterest Interest Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {categories.map((cat) => {
          const isActive = categoryFilter === cat.value;
          return (
            <TouchableOpacity
              key={cat.value}
              activeOpacity={0.8}
              onPress={() => setCategoryFilter(cat.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? (theme.isDark ? '#FFFFFF' : '#111111')
                    : theme.surface,
                },
              ]}
            >
              {cat.icon && (
                <Sparkles
                  size={14}
                  color={isActive ? (theme.isDark ? '#111111' : '#FFFFFF') : theme.primary}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive
                      ? (theme.isDark ? '#111111' : '#FFFFFF')
                      : theme.textPrimary,
                    fontWeight: isActive ? '700' : '600',
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    cursor: 'text',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  sortBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    cursor: 'pointer',
  },
  chipText: {
    fontSize: 14,
  },
});
