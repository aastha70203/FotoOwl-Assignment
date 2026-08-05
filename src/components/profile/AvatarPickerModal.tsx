import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { X, Check, Link, Sparkles } from 'lucide-react-native';
import { PREDEFINED_AVATARS } from '../../config/constants';
import { useThemeStore } from '../../store/useThemeStore';
import { CustomButton } from '../common/CustomButton';

interface AvatarPickerModalProps {
  visible: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  currentAvatar,
  onClose,
  onSelectAvatar,
}) => {
  const { theme } = useThemeStore();
  const [selectedUrl, setSelectedUrl] = useState(currentAvatar);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleSave = () => {
    const finalUrl = useCustom && customUrlInput.trim() ? customUrlInput.trim() : selectedUrl;
    onSelectAvatar(finalUrl);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.titleRow}>
              <Sparkles size={20} color={theme.primary} />
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Choose Profile Avatar
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Select from predefined avatars or insert custom image URL:
            </Text>

            <View style={styles.grid}>
              {PREDEFINED_AVATARS.map((url, idx) => {
                const isSelected = !useCustom && selectedUrl === url;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedUrl(url);
                      setUseCustom(false);
                    }}
                    style={[
                      styles.avatarWrapper,
                      {
                        borderColor: isSelected ? theme.primary : 'transparent',
                        backgroundColor: theme.surface,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: url }}
                      style={styles.avatarImg}
                      contentFit="cover"
                    />
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom URL Option */}
            <View style={[styles.customBox, { backgroundColor: theme.surface }]}>
              <TouchableOpacity
                onPress={() => setUseCustom(!useCustom)}
                style={styles.customHeader}
              >
                <Link size={18} color={theme.primary} />
                <Text style={[styles.customTitle, { color: theme.textPrimary }]}>
                  Or use Custom Image URL
                </Text>
              </TouchableOpacity>

              {useCustom && (
                <TextInput
                  placeholder="https://example.com/my-avatar.jpg"
                  placeholderTextColor={theme.textMuted}
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Apply Avatar"
              onPress={handleSave}
              variant="primary"
              size="large"
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customBox: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  customInput: {
    marginTop: 10,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  footer: {
    marginTop: 10,
  },
});
