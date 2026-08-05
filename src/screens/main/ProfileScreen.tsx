import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
  Heart,
  Calendar,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useToast } from '../../hooks/useToast';
import { Header } from '../../components/common/Header';
import { AvatarPickerModal } from '../../components/profile/AvatarPickerModal';
import { EditProfileModal } from '../../components/profile/EditProfileModal';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { theme, isDark, toggleTheme } = useThemeStore();
  const { user, logout, updateProfile, updateAvatar } = useAuthStore();
  const { favorites } = useGalleryStore();
  const { showToast } = useToast();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to end your current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showToast('info', 'Logged Out', 'You have been signed out.');
          },
        },
      ]
    );
  };

  const handleSaveProfile = async (updatedData: any) => {
    const res = await updateProfile(updatedData);
    if (res.success) {
      showToast('success', 'Profile Updated', 'Your profile details have been saved.');
      return true;
    } else {
      showToast('error', 'Update Error', res.error || 'Failed to update profile.');
      return false;
    }
  };

  const handleSelectAvatar = async (avatarUrl: string) => {
    const success = await updateAvatar(avatarUrl);
    if (success) {
      showToast('success', 'Avatar Changed', 'New avatar updated successfully!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="My Account" subtitle="Profile & Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar & Hero Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setAvatarModalVisible(true)}
              style={[styles.cameraBadge, { backgroundColor: theme.primary }]}
            >
              <Camera size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            {user.fullName}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user.email}
          </Text>

          {/* Security Badge */}
          <View style={[styles.securityBadge, { backgroundColor: theme.primaryLight + '20' }]}>
            <ShieldCheck size={14} color={theme.primary} />
            <Text style={[styles.securityText, { color: theme.primary }]}>
              Verified Account • Security Score {user.securityScore || 95}%
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setEditProfileModalVisible(true)}
            style={[styles.editBtn, { backgroundColor: theme.surface }]}
          >
            <Edit3 size={15} color={theme.primary} />
            <Text style={[styles.editBtnText, { color: theme.primary }]}>
              Edit Profile Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            <Heart size={20} color={theme.error} fill={theme.error + '40'} />
            <Text style={[styles.statNum, { color: theme.textPrimary }]}>
              {favorites.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Saved Favorites
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            <Calendar size={20} color={theme.accent} />
            <Text style={[styles.statNum, { color: theme.textPrimary }]}>
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Member Since
            </Text>
          </View>
        </View>

        {/* User Information Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PERSONAL DETAILS
        </Text>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.infoRow}>
            <User size={18} color={theme.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Gender
              </Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>
                {user.gender}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.infoRow}>
            <Phone size={18} color={theme.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Mobile Number
              </Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>
                +91 {user.mobileNumber}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.infoRow}>
            <MapPin size={18} color={theme.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Address & City
              </Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>
                {user.address}, {user.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings & Appearance Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PREFERENCES & SECURITY
        </Text>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTheme}
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              {isDark ? (
                <Sun size={18} color="#FDCB6E" />
              ) : (
                <Moon size={18} color={theme.primary} />
              )}
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                App Theme ({isDark ? 'Dark Mode' : 'Light Mode'})
              </Text>
            </View>
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
              Toggle
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogout}
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <LogOut size={18} color={theme.error} />
              <Text style={[styles.settingLabel, { color: theme.error }]}>
                Logout Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <AvatarPickerModal
        visible={avatarModalVisible}
        currentAvatar={user.avatarUrl}
        onClose={() => setAvatarModalVisible(false)}
        onSelectAvatar={handleSelectAvatar}
      />

      <EditProfileModal
        visible={editProfileModalVisible}
        user={user}
        onClose={() => setEditProfileModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#6C5CE7',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 14,
    gap: 6,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
