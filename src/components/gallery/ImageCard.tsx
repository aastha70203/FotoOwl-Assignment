import React from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Heart, MoreHorizontal, Sparkles } from 'lucide-react-native';
import { PicsumImage } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

// Pinterest staggered height calculator based on image id hash
const getMasonryHeight = (id: string): number => {
  const num = parseInt(id.replace(/\D/g, ''), 10) || 1;
  const heights = [180, 240, 200, 270, 220, 290, 190, 250];
  return heights[num % heights.length];
};

interface ImageCardProps {
  image: PicsumImage;
  onPress: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress }) => {
  const { theme } = useThemeStore();
  const favorites = useGalleryStore(s => s.favorites);
  const toggleFavorite = useGalleryStore(s => s.toggleFavorite);

  // Direct reactive favorites evaluation
  const isSaved = favorites.some(id => String(id) === String(image.id));
  const cardHeight = getMasonryHeight(image.id);

  const handleSavePress = () => {
    toggleFavorite(image.id);
  };

  const authorAvatarUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(image.author || 'Author')}&background=E60023&color=fff&bold=true`;

  return (
    <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
      {/* Pinterest Rounded Pin Container */}
      <View style={styles.pinWrapper}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.imagePressable,
            { height: cardHeight },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Image
            source={{ uri: image.download_url || `https://picsum.photos/id/${image.id}/400/500` }}
            style={styles.pinImage}
            contentFit="cover"
            transition={300}
          />

          {/* Pinterest Community Badge */}
          {image.isCommunityUpload && (
            <View style={styles.communityBadge}>
              <Sparkles size={10} color="#FFFFFF" />
              <Text style={styles.communityBadgeText}>Community Pin</Text>
            </View>
          )}

          {/* Pinterest Red Save Button Overlay */}
          <Pressable
            onPress={handleSavePress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isSaved ? '#E60023' : 'rgba(0,0,0,0.65)',
              },
              pressed && { transform: [{ scale: 0.9 }] },
            ]}
          >
            <Heart
              size={14}
              color="#FFFFFF"
              fill={isSaved ? '#FFFFFF' : 'none'}
            />
            <Text style={styles.saveBtnText}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </Pressable>
      </View>

      {/* Pinterest Typography & Author Details Below Image */}
      <Pressable onPress={onPress} style={styles.detailsRow}>
        <View style={styles.authorRow}>
          <Image
            source={{ uri: authorAvatarUri }}
            style={styles.authorAvatar}
            contentFit="cover"
          />
          <Text
            numberOfLines={1}
            style={[styles.authorName, { color: theme.textPrimary }]}
          >
            {image.author}
          </Text>
        </View>

        <TouchableOpacity onPress={onPress} style={styles.moreBtn}>
          <MoreHorizontal size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  pinWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E2738',
  },
  imagePressable: {
    width: '100%',
    position: 'relative',
    cursor: 'pointer',
  },
  pinImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  communityBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#E60023',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  communityBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    zIndex: 20,
    cursor: 'pointer',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
    cursor: 'pointer',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  moreBtn: {
    padding: 2,
  },
});
