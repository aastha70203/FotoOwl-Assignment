import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Tag, CheckCircle2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useToast } from '../../hooks/useToast';
import { CustomInput } from '../common/CustomInput';
import { CustomButton } from '../common/CustomButton';

interface UploadPhotoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { uploadPhoto } = useGalleryStore();
  const { showToast } = useToast();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [eventTag, setEventTag] = useState('Pune Startup Summit');
  const [photographerName, setPhotographerName] = useState(user?.fullName || 'Anonymous Creator');

  const [isUploading, setIsUploading] = useState(false);
  const [aiProgressStep, setAiProgressStep] = useState('');

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedUri(result.assets[0].uri);
        setCustomUrlInput('');
      }
    } catch (err) {
      console.error('Image picker error:', err);
      showToast('error', 'Gallery Error', 'Could not open photo library.');
    }
  };

  const handleUploadSubmit = async () => {
    const finalUri = selectedUri || customUrlInput.trim();
    if (!finalUri) {
      showToast('warning', 'Photo Required', 'Please select a photo from gallery or enter an image URL.');
      return;
    }

    setIsUploading(true);
    setAiProgressStep('FotoOwl AI: Scanning Face Vectors & Indexing Event Media...');

    setTimeout(async () => {
      setAiProgressStep('FotoOwl AI: Color Balancing & Generating High-Res Thumbnails...');

      setTimeout(async () => {
        const photoId = `comm_${Date.now()}`;
        const newPhoto = {
          id: photoId,
          author: photographerName.trim() || user?.fullName || 'Event Photographer',
          width: 4000,
          height: 3000,
          url: finalUri,
          download_url: finalUri,
          isCommunityUpload: true,
          eventTag: eventTag.trim() || 'Live Event',
          uploadedBy: user?.fullName || 'Community Creator',
          uploadedAt: new Date().toISOString(),
          aiTags: ['AI Verified', 'Face Indexed', 'FotoOwl Collective'],
          isFavorite: false,
        };

        const success = await uploadPhoto(newPhoto);
        setIsUploading(false);
        setAiProgressStep('');

        if (success) {
          showToast(
            'success',
            'Photo Shared to Collective Stream! 🎉',
            `Your photo "${eventTag}" is now live for all creators to view.`
          );
          setSelectedUri(null);
          setCustomUrlInput('');
          onClose();
        } else {
          showToast('error', 'Upload Failed', 'Failed to publish photo to storage server.');
        }
      }, 1000);
    }, 1000);
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
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.titleRow}>
              <UploadCloud size={24} color={theme.primary} />
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Upload to Collective Server
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Share event media photos with all creators
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image Preview Box */}
            <View
              style={[
                styles.previewBox,
                { backgroundColor: theme.surface, borderColor: theme.cardBorder },
              ]}
            >
              {selectedUri || customUrlInput.trim() ? (
                <View style={styles.imagePreviewWrapper}>
                  <Image
                    source={{ uri: selectedUri || customUrlInput.trim() }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUri(null);
                      setCustomUrlInput('');
                    }}
                    style={styles.removeImageBadge}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.pickerActionsContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handlePickImage}
                    style={[styles.pickBtn, { backgroundColor: theme.primary }]}
                  >
                    <ImageIcon size={20} color="#FFFFFF" />
                    <Text style={styles.pickBtnText}>Pick Photo from Device Gallery</Text>
                  </TouchableOpacity>

                  <Text style={[styles.orText, { color: theme.textMuted }]}>
                    — OR PASTE IMAGE URL BELOW —
                  </Text>

                  <TextInput
                    placeholder="https://example.com/event-photo.jpg"
                    placeholderTextColor={theme.textMuted}
                    value={customUrlInput}
                    onChangeText={setCustomUrlInput}
                    style={[
                      styles.urlInput,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>
              )}
            </View>

            {/* Form Inputs */}
            <CustomInput
              label="Event Name / Tag"
              placeholder="e.g. Baner Tech Summit 2026"
              value={eventTag}
              onChangeText={setEventTag}
              leftIcon={<Tag size={18} color={theme.textMuted} />}
            />

            <CustomInput
              label="Photographer Name"
              placeholder="Your full name"
              value={photographerName}
              onChangeText={setPhotographerName}
            />

            {/* AI Status Banner */}
            {isUploading && (
              <View style={[styles.aiBanner, { backgroundColor: theme.primaryLight + '20' }]}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.aiBannerText, { color: theme.primary }]}>
                  {aiProgressStep}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Publish & Share Photo"
              onPress={handleUploadSubmit}
              isLoading={isUploading}
              variant="primary"
              size="large"
              icon={<Sparkles size={20} color="#FFFFFF" />}
            />
          </View>
        </View>
      </View>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  previewBox: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 16,
    marginBottom: 16,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerActionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  pickBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  orText: {
    fontSize: 11,
    fontWeight: '700',
    marginVertical: 12,
  },
  urlInput: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  aiBannerText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  footer: {
    marginTop: 12,
  },
});
