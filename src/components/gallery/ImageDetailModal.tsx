import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import {
  X,
  Heart,
  Download,
  Share2,
  Maximize2,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useToast } from '../../hooks/useToast';
import { CustomButton } from '../common/CustomButton';
import { FullScreenViewer } from '../../screens/main/FullScreenViewer';
import { PicsumImage } from '../../types';

interface ImageDetailModalProps {
  visible: boolean;
  image: PicsumImage | null;
  onClose: () => void;
}

const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  visible,
  image,
  onClose,
}) => {
  if (!image) return null;

  const { theme } = useThemeStore();
  const { toggleFavorite, favorites } = useGalleryStore();
  const { showToast } = useToast();

  const [isFullViewerOpen, setIsFullViewerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [displayUrl, setDisplayUrl] = useState(
    image.download_url || `https://picsum.photos/id/${image.id}/800/600`
  );

  useEffect(() => {
    if (image) {
      setDisplayUrl(image.download_url || `https://picsum.photos/id/${image.id}/800/600`);
      setImageLoading(true);
    }
  }, [image?.id]);

  const isSaved = favorites.some(id => String(id) === String(image.id));
  const authorAvatarUri = `https://picsum.photos/id/${(parseInt(image.id.replace(/\D/g, ''), 10) || 1) + 50}/100/100`;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(displayUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `pinterest_pin_${image.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        showToast('success', 'Pin Saved to Device', `Pin #${image.id} downloaded!`);
      } else {
        const FileSystem = require('expo-file-system');
        const MediaLibrary = require('expo-media-library');

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          showToast('warning', 'Permission Required', 'Storage permission required to save pins.');
          setIsDownloading(false);
          return;
        }

        const fileUri = `${FileSystem.documentDirectory}pinterest_pin_${image.id}.jpg`;
        const downloadRes = await FileSystem.downloadAsync(displayUrl, fileUri);
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        showToast('success', 'Saved to Gallery', `Pin #${image.id} saved to photo library!`);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      showToast('error', 'Download Failed', 'Could not complete pin download.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(displayUrl, {
          dialogTitle: `Share Pin by ${image.author}`,
        });
      } else {
        showToast('info', 'Share Pin Link', displayUrl);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, Platform.OS === 'web' ? ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } as any) : null]}>
        <View style={[styles.content, { backgroundColor: theme.cardBg }]}>
          {/* Pinterest Top Action Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surface }]}>
              <X size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={[styles.iconBtn, { backgroundColor: theme.surface }]}
              >
                <Share2 size={18} color={theme.textPrimary} />
              </TouchableOpacity>

              {/* Pinterest Red Save Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => toggleFavorite(image.id)}
                style={[
                  styles.pinterestSaveBtn,
                  { backgroundColor: isSaved ? '#111111' : '#E60023' },
                ]}
              >
                <Heart size={16} color="#FFFFFF" fill={isSaved ? '#FFFFFF' : 'none'} />
                <Text style={styles.pinterestSaveText}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Pinterest Main Pin Image */}
            <Pressable
              onPress={() => setIsFullViewerOpen(true)}
              style={styles.imageContainer}
            >
              {imageLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#E60023" />
                </View>
              )}
              <Image
                source={{ uri: displayUrl }}
                style={styles.image}
                contentFit="cover"
                transition={300}
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setDisplayUrl(FALLBACK_IMAGE_URL);
                }}
              />
              <View style={styles.expandOverlay} pointerEvents="none">
                <Maximize2 size={14} color="#FFFFFF" />
                <Text style={styles.expandText}>Tap for Full Screen</Text>
              </View>
            </Pressable>

            {/* Photographer Profile & Follow Row */}
            <View style={styles.creatorProfileRow}>
              <View style={styles.creatorInfo}>
                <Image
                  source={{ uri: authorAvatarUri }}
                  style={styles.creatorAvatar}
                  contentFit="cover"
                />
                <View>
                  <Text style={[styles.creatorName, { color: theme.textPrimary }]}>
                    {image.author}
                  </Text>
                  <Text style={[styles.creatorSub, { color: theme.textMuted }]}>
                    12.4k Followers • FotoOwl Creator
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsFollowing(!isFollowing);
                  showToast('success', isFollowing ? 'Unfollowed' : 'Following', `Now following ${image.author}`);
                }}
                style={[
                  styles.followBtn,
                  { backgroundColor: isFollowing ? theme.surface : '#E9E9E9' },
                ]}
              >
                <Text
                  style={[
                    styles.followBtnText,
                    { color: isFollowing ? theme.textPrimary : '#111111' },
                  ]}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pin Details & Specs */}
            <View
              style={[
                styles.specsCard,
                { backgroundColor: theme.surface },
              ]}
            >
              <Text style={[styles.pinTitleText, { color: theme.textPrimary }]}>
                {image.eventTag || `Event Media Asset #${image.id}`}
              </Text>
              <Text style={[styles.pinDescText, { color: theme.textSecondary }]}>
                Captured at high-speed live event. Indexed & color balanced by FotoOwl AI.
              </Text>

              <View style={styles.specBadgesRow}>
                <View style={styles.specBadge}>
                  <Sparkles size={13} color="#E60023" />
                  <Text style={styles.specBadgeText}>AI Indexed</Text>
                </View>
                <View style={styles.specBadge}>
                  <Layers size={13} color="#0076D7" />
                  <Text style={styles.specBadgeText}>{image.width} × {image.height} px</Text>
                </View>
              </View>
            </View>

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <CustomButton
                title="Download High-Res Pin"
                onPress={handleDownload}
                isLoading={isDownloading}
                variant="primary"
                size="large"
                icon={<Download size={18} color="#FFFFFF" />}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      <FullScreenViewer
        visible={isFullViewerOpen}
        imageUrl={displayUrl}
        author={image.author}
        imageId={image.id}
        onClose={() => setIsFullViewerOpen(false)}
        onDownload={handleDownload}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  content: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinterestSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 6,
  },
  pinterestSaveText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 320,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    cursor: 'pointer',
    backgroundColor: '#1E2738',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
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
    zIndex: 10,
  },
  expandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  creatorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: '800',
  },
  creatorSub: {
    fontSize: 11,
    marginTop: 2,
  },
  followBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  specsCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  pinTitleText: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  pinDescText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  specBadgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  specBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    marginTop: 6,
  },
});
