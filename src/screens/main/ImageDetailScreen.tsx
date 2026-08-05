import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  Download,
  Share2,
  Maximize2,
  User,
  Sparkles,
  Layers,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useToast } from '../../hooks/useToast';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';
import { FullScreenViewer } from './FullScreenViewer';
import { PicsumImage } from '../../types';

export const ImageDetailScreen: React.FC<ImageDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { image } = route.params as { image: PicsumImage };
  const { theme } = useThemeStore();
  const { toggleFavorite, favorites } = useGalleryStore();
  const { showToast } = useToast();

  const [isFullViewerOpen, setIsFullViewerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isFav = favorites.includes(image.id);
  const highResUrl = image.download_url || `https://picsum.photos/id/${image.id}/1200/900`;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(highResUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `fotoowl_image_${image.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        showToast('success', 'Image Downloaded', `Image #${image.id} saved to your device downloads!`);
      } else {
        const FileSystem = require('expo-file-system');
        const MediaLibrary = require('expo-media-library');

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          showToast('warning', 'Permission Required', 'Storage permission is required to save photos.');
          setIsDownloading(false);
          return;
        }

        const fileUri = `${FileSystem.documentDirectory}fotoowl_img_${image.id}.jpg`;
        const downloadRes = await FileSystem.downloadAsync(highResUrl, fileUri);
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        showToast('success', 'Saved to Gallery', `Image #${image.id} saved to your device photo gallery!`);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      showToast('error', 'Download Failed', 'Could not complete image download.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(image.url || highResUrl, {
          dialogTitle: `Share FotoOwl Image by ${image.author}`,
        });
      } else {
        showToast('info', 'Share Image URL', image.download_url);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={`Image #${image.id}`}
        subtitle={`Captured by ${image.author}`}
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => toggleFavorite(image.id)}
            style={[styles.headerFavBtn, { backgroundColor: theme.surface }]}
          >
            <Heart
              size={20}
              color={isFav ? theme.error : theme.textSecondary}
              fill={isFav ? theme.error : 'none'}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Display Image */}
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => setIsFullViewerOpen(true)}
          style={[styles.imageContainer, { borderColor: theme.cardBorder }]}
        >
          <Image
            source={{ uri: highResUrl }}
            style={styles.image}
            contentFit="cover"
            transition={400}
          />
          <View style={styles.expandOverlay}>
            <Maximize2 size={16} color="#FFFFFF" />
            <Text style={styles.expandText}>Tap to View Full Screen</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Action Bar */}
        <View style={styles.actionRow}>
          <CustomButton
            title="Download Image"
            onPress={handleDownload}
            isLoading={isDownloading}
            variant="primary"
            size="medium"
            icon={<Download size={18} color="#FFFFFF" />}
            style={{ flex: 1 }}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShare}
            style={[styles.iconActionBtn, { backgroundColor: theme.surface }]}
          >
            <Share2 size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Image Metadata Details */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          IMAGE METADATA & SPECS
        </Text>

        <View
          style={[
            styles.metaCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.metaRow}>
            <User size={18} color={theme.primary} />
            <View style={styles.metaTextGroup}>
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                Photographer / Author
              </Text>
              <Text style={[styles.metaVal, { color: theme.textPrimary }]}>
                {image.author}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.metaRow}>
            <Sparkles size={18} color={theme.accent} />
            <View style={styles.metaTextGroup}>
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                Asset ID
              </Text>
              <Text style={[styles.metaVal, { color: theme.textPrimary }]}>
                PICSUM-{image.id}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.metaRow}>
            <Layers size={18} color={theme.primary} />
            <View style={styles.metaTextGroup}>
              <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                Original Resolution
              </Text>
              <Text style={[styles.metaVal, { color: theme.textPrimary }]}>
                {image.width} × {image.height} pixels
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Viewer Modal */}
      <FullScreenViewer
        visible={isFullViewerOpen}
        imageUrl={highResUrl}
        author={image.author}
        imageId={image.id}
        onClose={() => setIsFullViewerOpen(false)}
        onDownload={handleDownload}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerFavBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    height: 280,
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  expandOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  expandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  iconActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  metaCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  metaTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
