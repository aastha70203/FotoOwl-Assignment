import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Heart, Search, X } from 'lucide-react-native';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { ImageCard } from '../../components/gallery/ImageCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ImageDetailModal } from '../../components/gallery/ImageDetailModal';
import { PicsumImage } from '../../types';

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { getFavoriteImages } = useGalleryStore();
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<PicsumImage | null>(null);

  const favoriteImages = getFavoriteImages();

  const filteredFavorites = favoriteImages.filter(img =>
    img.author.toLowerCase().includes(favSearchQuery.toLowerCase().trim())
  );

  const handleCardPress = (image: PicsumImage) => {
    setSelectedImage(image);
    if (navigation && typeof navigation.navigate === 'function') {
      try {
        navigation.navigate('ImageDetail', { image });
      } catch (e) {
        // Fallback to inline modal
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="My Favorites"
        subtitle={`${favoriteImages.length} saved images in collection`}
      />

      {favoriteImages.length > 0 && (
        <View style={styles.searchBarContainer}>
          <View
            style={[
              styles.searchBox,
              { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
            ]}
          >
            <Search size={18} color={theme.primary} />
            <TextInput
              placeholder="Search in favorites by author..."
              placeholderTextColor={theme.textMuted}
              value={favSearchQuery}
              onChangeText={setFavSearchQuery}
              style={[styles.searchInput, { color: theme.textPrimary }]}
            />
            {favSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setFavSearchQuery('')}>
                <X size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ImageCard image={item} onPress={() => handleCardPress(item)} />
        )}
        ListEmptyComponent={
          <EmptyState
            title={favSearchQuery ? 'No matching favorite author' : 'No Favorite Images Yet'}
            description={
              favSearchQuery
                ? `No favorited item matches "${favSearchQuery}".`
                : 'Browse the gallery and tap the heart icon on any image to save it here.'
            }
            actionTitle="Discover Gallery Images"
            onAction={() => navigation.navigate('Home')}
            icon={<Heart size={40} color={theme.primary} fill={theme.primary + '40'} />}
          />
        }
      />

      <ImageDetailModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listPadding: {
    paddingBottom: 30,
  },
});
