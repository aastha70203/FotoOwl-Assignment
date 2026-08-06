import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, AlertCircle, Plus } from 'lucide-react-native';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { FilterBar } from '../../components/gallery/FilterBar';
import { ImageCard } from '../../components/gallery/ImageCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ImageDetailModal } from '../../components/gallery/ImageDetailModal';
import { UploadPhotoModal } from '../../components/gallery/UploadPhotoModal';
import { PicsumImage } from '../../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const {
    images,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    initializeGallery,
    refreshGallery,
    fetchMoreImages,
    getFilteredImages,
    searchQuery,
  } = useGalleryStore();

  const [selectedImage, setSelectedImage] = useState<PicsumImage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      initializeGallery();
    }
  }, []);

  const filteredImages = getFilteredImages();

  const handleCardPress = (image: PicsumImage) => {
    setSelectedImage(image);
    if (navigation && typeof navigation.navigate === 'function') {
      try {
        navigation.navigate('ImageDetail', { image });
      } catch (e) {
        // Fallback inline modal
      }
    }
  };

  const renderSkeletonList = () => (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </View>
  );

  const bottomInset = Math.max(insets.bottom, 20);
  const listBottomPadding = bottomInset + 110;
  const fabBottomPosition = bottomInset + 80;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Pinterest Brand Header */}
      <Header
        title="FotoOwl Pins"
        subtitle={`Welcome, ${user?.fullName ? user.fullName.split(' ')[0] : 'Creator'}`}
      />

      {/* Pinterest Search & Interest Chips */}
      <FilterBar />

      {/* Main Pinterest Staggered Pin Stream */}
      {isLoading ? (
        renderSkeletonList()
      ) : error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={44} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={initializeGallery}
            style={[styles.retryBtn, { backgroundColor: theme.primary }]}
          >
            <RefreshCw size={18} color="#FFFFFF" />
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[styles.listPadding, { paddingBottom: listBottomPadding }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={() => handleCardPress(item)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshGallery}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          onEndReached={filteredImages.length > 0 ? fetchMoreImages : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.footerText, { color: theme.textMuted }]}>
                  Loading more pins...
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title={searchQuery ? 'No matching pins found' : 'No pins available'}
              description={
                searchQuery
                  ? `No pins match "${searchQuery}". Try searching another tag.`
                  : 'Create your own pin or tap refresh.'
              }
              actionTitle={searchQuery ? 'Reset Search' : '+ Create New Pin'}
              onAction={searchQuery ? refreshGallery : () => setIsUploadModalOpen(true)}
            />
          }
        />
      )}

      {/* Pinterest Signature Red Plus Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsUploadModalOpen(true)}
        style={[styles.pinterestFab, { bottom: fabBottomPosition }]}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>Create Pin</Text>
      </TouchableOpacity>

      {/* Guaranteed Pin Detail View Modal */}
      <ImageDetailModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Collective Upload Modal */}
      <UploadPhotoModal
        visible={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listPadding: {
    paddingBottom: 120,
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
  },
  pinterestFab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E60023',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#E60023',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    cursor: 'pointer',
    zIndex: 90,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
